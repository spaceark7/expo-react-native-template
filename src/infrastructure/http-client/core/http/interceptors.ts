import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import axios from 'axios'
import type { HttpConfig, RetryQueueItem } from './types'

const REFRESH_TOKEN_MAX_RETRY = 3

export function setupInterceptors(
  instance: AxiosInstance,
  config: HttpConfig
): void {
  // ─── State (scoped per instance) ───────────────────────────────────────────
  let isRefreshing = false
  const refreshAndRetryQueue: RetryQueueItem[] = []

  // ─── Request interceptor ───────────────────────────────────────────────────
  instance.interceptors.request.use(
    (requestConfig) => {
      // Always attach API key
      requestConfig.headers[config.apiKeyName] = config.apiKeyValue

      const requireToken = requestConfig.headers['Require-Token']
      if (requireToken && requireToken !== false) {
        const token = config.getAccessToken()
        if (token) {
          requestConfig.headers['Authorization'] = `Bearer ${token}`
        }
      }

      return requestConfig
    },
    (error: AxiosError) => Promise.reject(error)
  )

  // ─── Response interceptor ──────────────────────────────────────────────────
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        headers: Record<string, unknown>
      }

      if (!originalRequest?.headers) {
        config.onForceLogout()
        return Promise.reject(error)
      }

      const requireToken = originalRequest.headers['Require-Token']
      const retryCount = (originalRequest.headers['Retry-Count'] as number) ?? 0
      const is401 = error.response?.status === 401

      // Non-401 or no token required — pass through
      if (!is401 || !requireToken) {
        return Promise.reject(error)
      }

      // Max retries exceeded
      if (retryCount >= REFRESH_TOKEN_MAX_RETRY) {
        flushQueueWithError(refreshAndRetryQueue, error)
        config.onForceLogout()
        return Promise.reject(error)
      }

      // Another refresh is already in flight — queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshAndRetryQueue.push({
            config: originalRequest,
            resolve,
            reject
          })
        })
      }

      // This request triggers the refresh
      isRefreshing = true

      try {
        const refreshResponse = await axios.get(
          `${config.baseURL}/${config.refreshTokenEndpoint}`,
          {
            headers: {
              [config.apiKeyName]: config.apiKeyValue,
              'Require-Token': false
            },
            withCredentials: true
          }
        )

        const newTokens = refreshResponse.data?.data
        await config.setTokens(newTokens)

        const newAccessToken: string = newTokens.accessToken
        const nextRetryCount = retryCount + 1

        // Patch and flush queued requests
        refreshAndRetryQueue.forEach(
          ({ config: queuedConfig, resolve, reject }) => {
            queuedConfig.headers = {
              ...queuedConfig.headers,
              Authorization: `Bearer ${newAccessToken}`,
              'Require-Token': true,
              'Retry-Count': nextRetryCount
            }
            instance.request(queuedConfig).then(resolve).catch(reject)
          }
        )
        refreshAndRetryQueue.length = 0

        // Retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        originalRequest.headers['Retry-Count'] = nextRetryCount

        return instance.request(originalRequest)
      } catch (refreshError) {
        flushQueueWithError(refreshAndRetryQueue, refreshError)
        config.onForceLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}

function flushQueueWithError(queue: RetryQueueItem[], error: unknown): void {
  queue.forEach(({ reject }) => reject(error))
  queue.length = 0
}

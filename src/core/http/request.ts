import type { AxiosInstance, AxiosResponse } from 'axios'
import type { UseFetchOptions } from './types'

// Module-level dedup cache — shared across all hook instances
const dedupeCache = new Map<string, Promise<unknown>>()

function buildDedupeKey(
  url: string,
  options?: UseFetchOptions<unknown>
): string {
  const params = options?.params ? JSON.stringify(options.params) : ''
  const method = (options?.method ?? 'GET').toUpperCase()
  return `${method}:${url}:${params}`
}

export async function executeRequest<T>(
  instance: AxiosInstance,
  url: string,
  options?: UseFetchOptions<T>,
  signal?: AbortSignal
): Promise<T> {
  const {
    immediate: _immediate,
    dedupe = false,
    onSuccess,
    onError,
    ...axiosOptions
  } = options ?? {}

  const requestFn = (): Promise<T> =>
    instance
      .request<T, AxiosResponse<T>>({ url, signal, ...axiosOptions })
      .then((res) => {
        onSuccess?.(res.data)
        return res.data
      })
      .catch((err) => {
        onError?.(err)
        throw err
      })

  if (!dedupe) {
    return requestFn()
  }

  const key = buildDedupeKey(url, options as UseFetchOptions<unknown>)

  if (dedupeCache.has(key)) {
    return dedupeCache.get(key) as Promise<T>
  }

  const promise = requestFn().finally(() => {
    dedupeCache.delete(key)
  })

  dedupeCache.set(key, promise)
  return promise
}

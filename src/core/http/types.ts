import type { AxiosError, AxiosRequestConfig } from 'axios'

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthEntity {
  accessToken: string
  refreshToken: string
  user?: Record<string, unknown>
}

// ─── HttpConfig (injected by adapter) ────────────────────────────────────────

export interface HttpConfig {
  apiKeyName: string
  apiKeyValue: string
  baseURL: string
  refreshTokenEndpoint: string
  timeout: number
  /** Returns current access token from store, or null if unauthenticated */
  getAccessToken: () => string | null
  /** Persists new tokens returned after a successful token refresh */
  setTokens: (tokens: Partial<AuthEntity>) => Promise<void>
  /** Called after max refresh retries exceeded — adapter handles UI + navigation */
  onForceLogout: () => void
}

// ─── Retry queue ─────────────────────────────────────────────────────────────

export interface RetryQueueItem {
  resolve: (value: unknown) => void
  reject: (error: unknown) => void
  config: AxiosRequestConfig
}

// ─── useFetch ─────────────────────────────────────────────────────────────────

export interface UseFetchOptions<T = unknown> extends AxiosRequestConfig {
  /** Auto-fetch on mount. Default: true */
  immediate?: boolean
  /** Deduplicate simultaneous requests to the same URL+params. Default: false */
  dedupe?: boolean
  /** Called with response data on success */
  onSuccess?: (data: T) => void
  /** Called with error on failure */
  onError?: (error: AxiosError) => void
}

export interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: AxiosError | null
  status: number | null
  refetch: () => void
}

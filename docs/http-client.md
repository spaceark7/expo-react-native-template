# HTTP Client — `useFetch` & Core

A framework-agnostic HTTP client built on Axios with token refresh, request queuing, deduplication, and abort-on-unmount. The core layer has **zero framework dependencies** — only Axios and TypeScript types — making it portable to Vue, React Native, or any future adapter.

---

## Architecture

```
src/
  infrastructure/http-client/
    core/http/               ← pure TypeScript + Axios, no framework imports
      types.ts               ← all shared types
      interceptors.ts        ← request/response interceptor logic
      axios-instance.ts      ← instance factory
      request.ts             ← executeRequest with dedup cache

    adapters/react/          ← React Native / Expo bindings
      auth-store.ts          ← Zustand store (persisted to AsyncStorage)
      force-logout.ts        ← Alert.alert + expo-router navigation
      setup-http.ts          ← wires core with React adapter
      use-fetch.ts           ← useFetch React hook

    adapters/vue/            ← future Vue bindings (stubs only)
      auth-store.ts
      force-logout.ts
      setup-http.ts
      use-fetch.ts
```

---

## Core Types (`src/infrastructure/http-client/core/http/types.ts`)

### `AuthEntity`

Represents authenticated user tokens and optional user data.

```ts
interface AuthEntity {
  accessToken: string
  refreshToken: string
  user?: Record<string, unknown>
}
```

### `HttpConfig`

Injected dependencies — the bridge between the framework-agnostic core and the adapter layer.

```ts
interface HttpConfig {
  baseURL: string
  apiKeyName: string
  apiKeyValue: string
  refreshTokenEndpoint: string
  timeout: number
  getAccessToken: () => string | null
  setTokens: (tokens: Partial<AuthEntity>) => Promise<void>
  onForceLogout: () => void
}
```

| Field            | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `getAccessToken` | Returns current access token from store, or `null`           |
| `setTokens`      | Persists new tokens after a successful refresh               |
| `onForceLogout`  | Called after max retries — adapter handles UI and navigation |

### `UseFetchOptions<T>`

Extends `AxiosRequestConfig` with hook-specific controls.

```ts
interface UseFetchOptions<T> extends AxiosRequestConfig {
  immediate?: boolean // auto-fetch on mount (default: true)
  dedupe?: boolean // share in-flight request by URL+params (default: false)
  onSuccess?: (data: T) => void // called on successful response
  onError?: (error: AxiosError) => void // called on failure
}
```

### `UseFetchResult<T>`

```ts
interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: AxiosError | null
  status: number | null
  refetch: () => void
}
```

---

## Core — Interceptors (`src/infrastructure/http-client/core/http/interceptors.ts`)

`setupInterceptors(instance, config)` attaches two interceptors to an Axios instance:

### Request interceptor

1. Attaches `apiKeyName: apiKeyValue` to every request header
2. If `Require-Token: true` on the request, calls `config.getAccessToken()` and attaches `Authorization: Bearer <token>`

### Response interceptor

| Condition                                                      | Behaviour                       |
| -------------------------------------------------------------- | ------------------------------- |
| Any success                                                    | Pass through                    |
| Error, non-401                                                 | Pass through (reject)           |
| Error, 401, no `Require-Token`                                 | Pass through (reject)           |
| Error, 401, `Require-Token: true`, retry count ≥ 3             | Flush queue → `onForceLogout()` |
| Error, 401, `Require-Token: true`, refresh not in progress     | Trigger token refresh           |
| Error, 401, `Require-Token: true`, refresh already in progress | Queue the request               |

**Token refresh flow:**

1. Sets `isRefreshing = true` (scoped per instance)
2. Calls `GET {baseURL}/{refreshTokenEndpoint}` with `Require-Token: false` (bypasses auth)
3. On success → `config.setTokens(newTokens)`, flushes all queued requests with new token, retries original request
4. On failure → rejects all queued requests, calls `config.onForceLogout()`
5. Always resets `isRefreshing = false` in `finally`

---

## Core — `executeRequest` (`src/infrastructure/http-client/core/http/request.ts`)

```ts
executeRequest<T>(
  instance: AxiosInstance,
  url: string,
  options?: UseFetchOptions<T>,
  signal?: AbortSignal
): Promise<T>
```

- Calls `onSuccess` / `onError` callbacks from options
- Supports `AbortSignal` for cancellation on unmount
- When `dedupe: true`, stores the in-flight `Promise` by `METHOD:url:params` key — concurrent callers share the same request. The cache entry is removed after the Promise settles.

---

## React Adapter

### Auth Store (`src/infrastructure/http-client/adapters/react/auth-store.ts`)

Zustand store persisted to AsyncStorage.

```ts
import { useAuthStore } from '@/adapters/react/auth-store'

const { auth, getAccessToken, setTokens, logout } = useAuthStore()
```

| Action               | Description                                |
| -------------------- | ------------------------------------------ |
| `getAccessToken()`   | Returns `auth.accessToken` or `null`       |
| `setTokens(partial)` | Merges new tokens into existing auth state |
| `logout()`           | Clears auth state                          |
| `resetState()`       | Alias for `logout()`                       |

### Setup HTTP (`src/infrastructure/http-client/adapters/react/setup-http.ts`)

Creates and caches a singleton Axios instance wired to the React adapter. All fields from `HttpConfig` can be overridden.

```ts
import { getHttpInstance } from '@/adapters/react/setup-http'

// Default — uses Zustand store + built-in forceLogout
const http = getHttpInstance()

// Custom token source
const http = getHttpInstance({
  baseURL: 'https://staging.example.com',
  getAccessToken: () => SecureStore.getItemSync('token'),
  setTokens: async (tokens) => {
    /* custom persist */
  },
  onForceLogout: () => {
    /* custom logout */
  }
})
```

### Force Logout (`src/infrastructure/http-client/adapters/react/force-logout.ts`)

Called automatically by the interceptor after 3 failed refresh attempts.

1. Calls `logout()` + `resetState()` on auth store
2. Shows `Alert.alert('Session Expired', ...)`
3. Navigates to root via `router.replace('/')`

---

## `useFetch` Hook (`src/infrastructure/http-client/adapters/react/use-fetch.ts`)

```ts
useFetch<T>(url: string, options?: UseFetchOptions<T>): UseFetchResult<T>
```

### Basic usage — auto-fetch on mount

```ts
const { data, loading, error, refetch } = useFetch<User[]>('/api/users')
```

### Public endpoint — no auth token

```ts
const { data, loading } = useFetch<Post[]>('/api/posts', {
  headers: { 'Require-Token': false },
  params: { limit: 10 }
})
```

### Lazy — manual trigger only

```ts
const { data, loading, refetch } = useFetch<LoginResponse>('/api/login', {
  method: 'POST',
  data: { email, password },
  headers: { 'Require-Token': false },
  immediate: false, // do not fetch on mount
})

// Trigger manually
<Button onPress={refetch} />
```

### Deduplication — shared in-flight request

```ts
// Both components share one HTTP request if mounted simultaneously
const { data } = useFetch<Profile>('/api/me', { dedupe: true })
```

### Callbacks

```ts
const { data } = useFetch<Profile>('/api/me', {
  onSuccess: (data) => {
    authStore.setTokens(data.tokens) // push to store after fetch
  },
  onError: (err) => {
    Toast.show(`Failed: ${err.message}`)
  }
})
```

> **Important:** Never call `setState` inside `onSuccess` for state that feeds back into the same hook's `params` or `url`. Doing so creates an infinite re-fetch loop. Change params from user interactions instead.

### Controlled pull-to-refresh with `ScrollViewRefresh`

```ts
const { data, loading, refetch } = useFetch<Post[]>('/api/posts', {
  headers: { 'Require-Token': false },
})

<ScrollViewRefresh
  enablePullToRefresh
  refreshing={loading}
  onRefresh={refetch}>
  {/* content */}
</ScrollViewRefresh>
```

---

## Adding a Vue Adapter

Implement the four files in `src/infrastructure/http-client/adapters/vue/` following the same `HttpConfig` interface:

```ts
// adapters/vue/setup-http.ts
import { createHttpInstance } from '@/infrastructure/http-client/core/http/axios-instance'
import { useAuthStore } from './auth-store' // Pinia store
import { forceLogout } from './force-logout' // Vue Router based

export function getHttpInstance() {
  const authStore = useAuthStore()
  return createHttpInstance({
    ...HTTP_CONFIG,
    getAccessToken: () => authStore.auth?.accessToken ?? null,
    setTokens: async (tokens) => authStore.setTokens(tokens),
    onForceLogout: forceLogout
  })
}
```

`infrastructure/http-client/core/http/` requires **no changes** when adding a new adapter.

---

## Environment Variables

Add to your `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_API_KEY_NAME=x-api-key
EXPO_PUBLIC_API_KEY_VALUE=your-api-key
```

Defaults are defined in `src/constants/config.ts` under `HTTP_CONFIG`.

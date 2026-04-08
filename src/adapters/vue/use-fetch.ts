// TODO: Implement as Vue composable (ref, watchEffect) wrapping executeRequest
//
// This should mirror the interface of adapters/react/use-fetch.ts
// using Vue's Composition API primitives instead of React hooks.
//
// Required signature:
//   function useFetch<T>(url: string, options?: UseFetchOptions<T>): UseFetchResult<T>
//
// Use:
//   - ref<T | null>(null)      → data
//   - ref<boolean>(false)      → loading
//   - ref<AxiosError | null>   → error
//   - ref<number | null>       → status
//   - watchEffect / onMounted  → auto-fetch when immediate = true
//   - AbortController          → cancel on unmount (onUnmounted)
//   - executeRequest()         → from core/http/request.ts
//   - getHttpInstance()        → from adapters/vue/setup-http.ts

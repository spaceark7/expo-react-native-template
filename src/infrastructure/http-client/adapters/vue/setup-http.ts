// TODO: Wire createHttpInstance with Pinia store + Vue Router forceLogout
//
// This should mirror the interface of adapters/react/setup-http.ts
// injecting Vue-specific implementations into the core HttpConfig.
//
// Example:
//   import { createHttpInstance } from '@/core/http/axios-instance'
//   import { useAuthStore } from './auth-store'
//   import { forceLogout } from './force-logout'
//   import { HTTP_CONFIG } from '@/constants/config'
//
//   export function getHttpInstance(): AxiosInstance {
//     const authStore = useAuthStore()
//     return createHttpInstance({
//       ...HTTP_CONFIG,
//       getAccessToken: () => authStore.auth?.accessToken ?? null,
//       setTokens: (tokens) => authStore.setTokens(tokens),
//       onForceLogout: forceLogout,
//     })
//   }

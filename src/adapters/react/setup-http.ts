import { HTTP_CONFIG } from '@/constants/config'
import { createHttpInstance } from '@/core/http/axios-instance'
import type { HttpConfig } from '@/core/http/types'
import type { AxiosInstance } from 'axios'
import { useAuthStore } from './auth-store'
import { forceLogout } from './force-logout'

type SetupHttpOptions = Partial<HttpConfig>

let httpInstance: AxiosInstance | null = null

export function getHttpInstance(overrides?: SetupHttpOptions): AxiosInstance {
  if (httpInstance) {
    return httpInstance
  }

  const { getAccessToken, setTokens } = useAuthStore.getState()

  httpInstance = createHttpInstance({
    baseURL: overrides?.baseURL ?? HTTP_CONFIG.BASE_URL,
    apiKeyName: overrides?.apiKeyName ?? HTTP_CONFIG.API_KEY_NAME,
    apiKeyValue: overrides?.apiKeyValue ?? HTTP_CONFIG.API_KEY_VALUE,
    refreshTokenEndpoint:
      overrides?.refreshTokenEndpoint ?? HTTP_CONFIG.REFRESH_TOKEN_ENDPOINT,
    timeout: overrides?.timeout ?? HTTP_CONFIG.REQUEST_TIMEOUT,
    getAccessToken: overrides?.getAccessToken ?? getAccessToken,
    setTokens: overrides?.setTokens ?? setTokens,
    onForceLogout: overrides?.onForceLogout ?? forceLogout
  })

  return httpInstance
}

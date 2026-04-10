import { HTTP_CONFIG } from '@/constants/config'
import { createHttpInstance } from '@/infrastructure/http-client/core/http/axios-instance'
import type { HttpConfig } from '@/infrastructure/http-client/core/http/types'
import { getAccessToken, setAuthTokens } from '@/infrastructure/store/auth'
import type { AxiosInstance } from 'axios'
import { forceLogout } from './force-logout'

type SetupHttpOptions = Partial<HttpConfig>

let httpInstance: AxiosInstance | null = null

export function getHttpInstance(overrides?: SetupHttpOptions): AxiosInstance {
  if (httpInstance) {
    return httpInstance
  }

  httpInstance = createHttpInstance({
    baseURL: overrides?.baseURL ?? HTTP_CONFIG.BASE_URL,
    apiKeyName: overrides?.apiKeyName ?? HTTP_CONFIG.API_KEY_NAME,
    apiKeyValue: overrides?.apiKeyValue ?? HTTP_CONFIG.API_KEY_VALUE,
    refreshTokenEndpoint:
      overrides?.refreshTokenEndpoint ?? HTTP_CONFIG.REFRESH_TOKEN_ENDPOINT,
    timeout: overrides?.timeout ?? HTTP_CONFIG.REQUEST_TIMEOUT,
    getAccessToken: overrides?.getAccessToken ?? getAccessToken,
    setTokens: overrides?.setTokens ?? setAuthTokens,
    onForceLogout: overrides?.onForceLogout ?? forceLogout
  })

  return httpInstance
}

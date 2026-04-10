import type { AuthEntity } from '@/infrastructure/http-client/core/http/types'

import { useAppStoreInternal } from './app-store'

export const useAuth = () => useAppStoreInternal.use.auth()
export const useAuthActions = () => useAppStoreInternal.use.authActions()
export const useIsAuthenticated = () => Boolean(useAppStoreInternal.use.auth())

export const getAuth = () => useAppStoreInternal.getState().auth
export const getAccessToken = () =>
  useAppStoreInternal.getState().authActions.getAccessToken()
export const setAuthTokens = (tokens: Partial<AuthEntity>) =>
  useAppStoreInternal.getState().authActions.setTokens(tokens)
export const logout = () => useAppStoreInternal.getState().authActions.logout()
export const resetAuthState = () =>
  useAppStoreInternal.getState().authActions.resetState()

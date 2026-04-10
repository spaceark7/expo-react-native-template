import { APP_CONFIG } from '@/constants/config'

import { useAppStoreInternal } from './app-store'
import type {
  AppStoreState,
  RemoteAppConfig,
  ResolvedTheme,
  ThemeMode
} from './app-store.types'

export type {
  RemoteAppConfig,
  ResolvedTheme,
  ThemeMode
} from './app-store.types'

export const selectEffectiveThemeMode = (state: AppStoreState): ThemeMode =>
  state.configOverrides.themeMode ??
  state.remoteConfig?.defaultTheme ??
  APP_CONFIG.DEFAULT_THEME_MODE

export const selectResolvedTheme = (state: AppStoreState): ResolvedTheme => {
  const themeMode = selectEffectiveThemeMode(state)
  return themeMode === 'system' ? state.systemColorScheme : themeMode
}

export const selectEffectiveLanguage = (state: AppStoreState): string =>
  state.configOverrides.language ??
  state.remoteConfig?.language ??
  APP_CONFIG.DEFAULT_LANGUAGE

export const useRemoteConfig = () => useAppStoreInternal.use.remoteConfig()
export const useConfigOverrides = () =>
  useAppStoreInternal.use.configOverrides()
export const useConfigSyncStatus = () => useAppStoreInternal.use.configStatus()
export const useConfigError = () => useAppStoreInternal.use.configError()
export const useConfigLastSyncedAt = () =>
  useAppStoreInternal.use.configLastSyncedAt()
export const useConfigVersion = () => useAppStoreInternal.use.configVersion()
export const useIsAppStoreHydrated = () =>
  useAppStoreInternal.use.isStoreHydrated()
export const useSystemColorScheme = () =>
  useAppStoreInternal.use.systemColorScheme()
export const useGlobalConfigActions = () =>
  useAppStoreInternal.use.globalConfigActions()
export const useThemeMode = () => useAppStoreInternal(selectEffectiveThemeMode)
export const useResolvedTheme = () => useAppStoreInternal(selectResolvedTheme)
export const useLanguage = () => useAppStoreInternal(selectEffectiveLanguage)

export const getRemoteConfig = () => useAppStoreInternal.getState().remoteConfig
export const getEffectiveThemeMode = () =>
  selectEffectiveThemeMode(useAppStoreInternal.getState())
export const getResolvedTheme = () =>
  selectResolvedTheme(useAppStoreInternal.getState())
export const getLanguage = () =>
  selectEffectiveLanguage(useAppStoreInternal.getState())
export const setRemoteConfig = (
  config: RemoteAppConfig,
  options?: { syncedAt?: number }
) =>
  useAppStoreInternal
    .getState()
    .globalConfigActions.setRemoteConfig(config, options)
export const clearRemoteConfig = () =>
  useAppStoreInternal.getState().globalConfigActions.clearRemoteConfig()
export const startConfigSync = () =>
  useAppStoreInternal.getState().globalConfigActions.startConfigSync()
export const finishConfigSync = (
  config: RemoteAppConfig,
  options?: { syncedAt?: number }
) =>
  useAppStoreInternal
    .getState()
    .globalConfigActions.finishConfigSync(config, options)
export const failConfigSync = (error: string) =>
  useAppStoreInternal.getState().globalConfigActions.failConfigSync(error)
export const setThemeMode = (mode: ThemeMode) =>
  useAppStoreInternal.getState().globalConfigActions.setThemeMode(mode)
export const resetThemeMode = () =>
  useAppStoreInternal.getState().globalConfigActions.resetThemeMode()
export const setLanguage = (language: string) =>
  useAppStoreInternal.getState().globalConfigActions.setLanguage(language)
export const resetLanguage = () =>
  useAppStoreInternal.getState().globalConfigActions.resetLanguage()
export const setSystemColorScheme = (scheme: ResolvedTheme) =>
  useAppStoreInternal
    .getState()
    .globalConfigActions.setSystemColorScheme(scheme)

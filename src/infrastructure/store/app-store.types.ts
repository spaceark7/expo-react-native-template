import type { AuthEntity } from '@/infrastructure/http-client/core/http/types'
import type { StateCreator } from 'zustand'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
export type ConfigSyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RemoteAppConfig {
  language?: string
  defaultTheme?: ThemeMode
  featureFlags?: Record<string, boolean>
  version?: string
}

export interface GlobalConfigOverrides {
  language?: string
  themeMode?: ThemeMode
}

export interface AuthActions {
  getAccessToken: () => string | null
  setTokens: (tokens: Partial<AuthEntity>) => Promise<void>
  logout: () => void
  resetState: () => void
}

export interface GlobalConfigActions {
  setRemoteConfig: (
    config: RemoteAppConfig,
    options?: { syncedAt?: number }
  ) => void
  clearRemoteConfig: () => void
  startConfigSync: () => void
  finishConfigSync: (
    config: RemoteAppConfig,
    options?: { syncedAt?: number }
  ) => void
  failConfigSync: (error: string) => void
  clearConfigError: () => void
  setThemeMode: (mode: ThemeMode) => void
  resetThemeMode: () => void
  setLanguage: (language: string) => void
  resetLanguage: () => void
  setSystemColorScheme: (scheme: ResolvedTheme) => void
  markStoreHydrated: () => void
  resetConfigState: () => void
}

export interface AuthSlice {
  auth: AuthEntity | null
  authActions: AuthActions
}

export interface GlobalConfigSlice {
  remoteConfig: RemoteAppConfig | null
  configOverrides: GlobalConfigOverrides
  configStatus: ConfigSyncStatus
  configError: string | null
  configLastSyncedAt: number | null
  configVersion: string | null
  systemColorScheme: ResolvedTheme
  isStoreHydrated: boolean
  globalConfigActions: GlobalConfigActions
}

export type AppStoreState = AuthSlice & GlobalConfigSlice

export type AppStateCreator<T> = StateCreator<AppStoreState, [], [], T>

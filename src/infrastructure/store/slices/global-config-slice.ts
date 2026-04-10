import { Appearance } from 'react-native'
import type {
  AppStateCreator,
  GlobalConfigOverrides,
  GlobalConfigSlice,
  RemoteAppConfig
} from '../app-store.types'

const removeOverrideKey = <K extends keyof GlobalConfigOverrides>(
  overrides: GlobalConfigOverrides,
  key: K
) => {
  const nextOverrides = { ...overrides }
  delete nextOverrides[key]
  return nextOverrides
}

export const createGlobalConfigSlice: AppStateCreator<GlobalConfigSlice> = (
  set,
  get
) => {
  const initialSystemColorScheme =
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'

  const globalConfigActions: GlobalConfigSlice['globalConfigActions'] = {
    setRemoteConfig: (
      config: RemoteAppConfig,
      options?: { syncedAt?: number }
    ) => {
      set({
        remoteConfig: config,
        configStatus: 'success',
        configError: null,
        configLastSyncedAt: options?.syncedAt ?? Date.now(),
        configVersion: config.version ?? null
      })
    },

    clearRemoteConfig: () => {
      set({
        remoteConfig: null,
        configStatus: 'idle',
        configError: null,
        configLastSyncedAt: null,
        configVersion: null
      })
    },

    startConfigSync: () => {
      set({
        configStatus: 'loading',
        configError: null
      })
    },

    finishConfigSync: (
      config: RemoteAppConfig,
      options?: { syncedAt?: number }
    ) => {
      get().globalConfigActions.setRemoteConfig(config, options)
    },

    failConfigSync: (error: string) => {
      set({
        configStatus: 'error',
        configError: error
      })
    },

    clearConfigError: () => {
      set({ configError: null })
    },

    setThemeMode: (mode) => {
      set((state) => ({
        configOverrides: {
          ...state.configOverrides,
          themeMode: mode
        }
      }))
    },

    resetThemeMode: () => {
      set((state) => ({
        configOverrides: removeOverrideKey(state.configOverrides, 'themeMode')
      }))
    },

    setLanguage: (language) => {
      set((state) => ({
        configOverrides: {
          ...state.configOverrides,
          language
        }
      }))
    },

    resetLanguage: () => {
      set((state) => ({
        configOverrides: removeOverrideKey(state.configOverrides, 'language')
      }))
    },

    setSystemColorScheme: (scheme) => {
      set({ systemColorScheme: scheme })
    },

    markStoreHydrated: () => {
      set((state) => ({
        isStoreHydrated: true,
        configStatus:
          state.configStatus === 'idle' && state.remoteConfig
            ? 'success'
            : state.configStatus
      }))
    },

    resetConfigState: () => {
      set((state) => ({
        remoteConfig: null,
        configOverrides: {},
        configStatus: 'idle',
        configError: null,
        configLastSyncedAt: null,
        configVersion: null,
        systemColorScheme: state.systemColorScheme
      }))
    }
  }

  return {
    remoteConfig: null,
    configOverrides: {},
    configStatus: 'idle',
    configError: null,
    configLastSyncedAt: null,
    configVersion: null,
    systemColorScheme: initialSystemColorScheme,
    isStoreHydrated: false,
    globalConfigActions
  }
}

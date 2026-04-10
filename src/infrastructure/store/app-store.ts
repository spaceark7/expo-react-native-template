import { APP_CONFIG } from '@/constants/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AppStoreState } from './app-store.types'
import { createSelectors } from './core/create-selectors'
import { createAuthSlice } from './slices/auth-slice'
import { createGlobalConfigSlice } from './slices/global-config-slice'

const useAppStoreBase = create<AppStoreState>()(
  persist(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createGlobalConfigSlice(...args)
    }),
    {
      name: APP_CONFIG.APP_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        auth: state.auth,
        remoteConfig: state.remoteConfig,
        configOverrides: state.configOverrides,
        configLastSyncedAt: state.configLastSyncedAt,
        configVersion: state.configVersion
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate app store:', error)
        }

        state?.globalConfigActions.markStoreHydrated()
      }
    }
  )
)

export const useAppStoreInternal = createSelectors(useAppStoreBase)

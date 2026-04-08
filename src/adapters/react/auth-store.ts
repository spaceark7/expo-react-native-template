import type { AuthEntity } from '@/core/http/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const AUTH_STORAGE_KEY = '@app_auth'

interface AuthState {
  auth: AuthEntity | null
  getAccessToken: () => string | null
  setTokens: (tokens: Partial<AuthEntity>) => Promise<void>
  logout: () => void
  resetState: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: null,

      getAccessToken: () => get().auth?.accessToken ?? null,

      setTokens: async (tokens) => {
        set((state) => ({
          auth: state.auth
            ? { ...state.auth, ...tokens }
            : (tokens as AuthEntity)
        }))
      },

      logout: () => {
        set({ auth: null })
      },

      resetState: () => {
        set({ auth: null })
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ auth: state.auth })
    }
  )
)

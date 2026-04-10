import type { AuthEntity } from '@/infrastructure/http-client/core/http/types'

import type { AppStateCreator, AuthSlice } from '../app-store.types'

export const createAuthSlice: AppStateCreator<AuthSlice> = (set, get) => {
  const authActions: AuthSlice['authActions'] = {
    getAccessToken: () => get().auth?.accessToken ?? null,

    setTokens: async (tokens: Partial<AuthEntity>) => {
      set((state) => ({
        auth: state.auth ? { ...state.auth, ...tokens } : (tokens as AuthEntity)
      }))
    },

    logout: () => {
      set({ auth: null })
    },

    resetState: () => {
      set({ auth: null })
    }
  }

  return {
    auth: null,
    authActions
  }
}

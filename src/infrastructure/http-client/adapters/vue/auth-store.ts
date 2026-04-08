// TODO: Implement with Pinia
//
// This should mirror the interface of adapters/react/auth-store.ts
// using Pinia store with defineStore().
//
// Required interface:
//   state: { auth: AuthEntity | null }
//   actions:
//     getAccessToken(): string | null
//     setTokens(tokens: Partial<AuthEntity>): Promise<void>
//     logout(): void
//     resetState(): void
//
// Persist to localStorage or a Vue-compatible storage adapter.

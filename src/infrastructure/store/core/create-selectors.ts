import type { StoreApi, UseBoundStore } from 'zustand'
import { useStore } from 'zustand'

export type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  baseStore: S
): WithSelectors<S>

export function createSelectors<S extends StoreApi<object>>(
  baseStore: S
): WithSelectors<S>

export function createSelectors<
  S extends UseBoundStore<StoreApi<object>> | StoreApi<object>
>(baseStore: S) {
  const store = baseStore as WithSelectors<typeof baseStore>
  store.use = {} as WithSelectors<typeof baseStore>['use']
  const isBoundStore = typeof baseStore === 'function'

  for (const key of Object.keys(store.getState())) {
    if (isBoundStore) {
      ;(store.use as Record<string, () => unknown>)[key] =
        function useGeneratedBoundSelector() {
          const boundStore = baseStore as UseBoundStore<StoreApi<object>>
          return boundStore((state) => state[key as keyof typeof state])
        }

      continue
    }

    ;(store.use as Record<string, () => unknown>)[key] =
      function useGeneratedVanillaSelector() {
        const vanillaStore = baseStore as StoreApi<object>
        return useStore(
          vanillaStore,
          (state) => state[key as keyof typeof state]
        )
      }
  }

  return store
}

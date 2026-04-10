import { createStore, type StateCreator, type StoreApi } from 'zustand'

type DynamicStoreShape<
  TState extends object,
  TActions extends object
> = TState & TActions

type DynamicStoreBaseApi<
  TState extends object,
  TActions extends object
> = StoreApi<DynamicStoreShape<TState, TActions>>

export type DynamicStoreLifecycle = 'persist' | 'destroy-on-route-leave'

export type DynamicStoreCreationOptions<TState extends object> = {
  initialState?: Partial<TState>
  lifecycle?: DynamicStoreLifecycle
}

type DynamicStoreEntry<TStore> = {
  store: TStore
  lifecycle: DynamicStoreLifecycle
}

export type RouteLeaveAwareDynamicStore<TKey> = {
  clearStore: (key: TKey) => void
  shouldDestroyStoreOnRouteLeave: (key: TKey) => boolean
}

type CreateDynamicStoreOptions<
  TKey,
  TState extends object,
  TActions extends object,
  TStore extends DynamicStoreBaseApi<TState, TActions>
> = {
  createState: (
    key: TKey,
    initialState?: Partial<TState>
  ) => StateCreator<DynamicStoreShape<TState, TActions>>
  serializeKey?: (key: TKey) => string
  defaultLifecycle?: DynamicStoreLifecycle
  decorateStore?: (store: DynamicStoreBaseApi<TState, TActions>) => TStore
}

export const createDynamicStore = <
  TKey,
  TState extends object,
  TActions extends object,
  TStore extends DynamicStoreBaseApi<TState, TActions> = DynamicStoreBaseApi<
    TState,
    TActions
  >
>({
  createState,
  serializeKey,
  defaultLifecycle = 'persist',
  decorateStore
}: CreateDynamicStoreOptions<TKey, TState, TActions, TStore>) => {
  const stores = new Map<string, DynamicStoreEntry<TStore>>()

  const getStoreKey = (key: TKey) => serializeKey?.(key) ?? String(key)

  const getOrCreateStore = (
    key: TKey,
    options?: DynamicStoreCreationOptions<TState>
  ) => {
    const storeKey = getStoreKey(key)
    const existingStore = stores.get(storeKey)

    if (existingStore) {
      console.log(`get store for key: ${storeKey}`) // Debug log
      return existingStore.store
    }

    const baseStore = createStore<DynamicStoreShape<TState, TActions>>()(
      createState(key, options?.initialState)
    )

    const store = decorateStore
      ? decorateStore(baseStore)
      : (baseStore as TStore)

    stores.set(storeKey, {
      store,
      lifecycle: options?.lifecycle ?? defaultLifecycle
    })

    console.log(
      `created new store for key: ${storeKey} with lifecycle: ${options?.lifecycle ?? defaultLifecycle}`
    ) // Debug log

    return store
  }

  return {
    getOrCreateStore,
    ensureStore: getOrCreateStore,
    hasStore: (key: TKey) => stores.has(getStoreKey(key)),
    getStoreKeys: () => Array.from(stores.keys()),
    getStoreLifecycle: (key: TKey) =>
      stores.get(getStoreKey(key))?.lifecycle ?? null,
    shouldDestroyStoreOnRouteLeave: (key: TKey) =>
      stores.get(getStoreKey(key))?.lifecycle === 'destroy-on-route-leave',
    clearStore: (key: TKey) => {
      stores.delete(getStoreKey(key))
    },
    clearAllStores: () => {
      stores.clear()
    }
  }
}

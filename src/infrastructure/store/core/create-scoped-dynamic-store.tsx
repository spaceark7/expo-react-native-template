import React, {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react'
import { createStore, type StateCreator, type StoreApi } from 'zustand'

import { createSelectors, type WithSelectors } from './create-selectors'

type ScopedStoreShape<TState extends object, TActions extends object> = TState &
  TActions

type ScopedStoreApi<
  TState extends object,
  TActions extends object
> = WithSelectors<StoreApi<ScopedStoreShape<TState, TActions>>>

type CreateScopedDynamicStoreOptions<
  TState extends object,
  TActions extends object
> = {
  createState: (
    initialState?: Partial<TState>
  ) => StateCreator<ScopedStoreShape<TState, TActions>>
  displayName?: string
}

export const createScopedDynamicStore = <
  TState extends object,
  TActions extends object
>({
  createState,
  displayName = 'ScopedDynamicStore'
}: CreateScopedDynamicStoreOptions<TState, TActions>) => {
  const StoreContext = createContext<ScopedStoreApi<TState, TActions> | null>(
    null
  )
  StoreContext.displayName = `${displayName}Context`

  type ProviderProps = {
    children: ReactNode
    initialState?: Partial<TState>
  }

  const Provider = ({ children, initialState }: ProviderProps) => {
    const [store] = useState(
      () =>
        createSelectors(
          createStore<ScopedStoreShape<TState, TActions>>()(
            createState(initialState)
          )
        ) as ScopedStoreApi<TState, TActions>
    )

    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
  }

  const useScopedStore = () => {
    const store = useContext(StoreContext)

    if (!store) {
      throw new Error(`${displayName} must be used within its Provider`)
    }

    return store
  }

  return {
    Provider,
    useScopedStore,
    Context: StoreContext
  }
}

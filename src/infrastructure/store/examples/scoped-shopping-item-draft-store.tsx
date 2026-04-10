import type { StateCreator } from 'zustand'
import { useStore } from 'zustand'

import { createScopedDynamicStore } from '@/infrastructure/store/core/create-scoped-dynamic-store'

type ScopedShoppingItemDraftState = {
  quantity: number
  note: string
}

type ScopedShoppingItemDraftActions = {
  draftActions: {
    setQuantity: (quantity: number) => void
    increment: () => void
    decrement: () => void
    setNote: (note: string) => void
    reset: () => void
  }
}

type ScopedShoppingItemDraftStore = ScopedShoppingItemDraftState &
  ScopedShoppingItemDraftActions

const createScopedShoppingItemDraftState = (
  initialState?: Partial<ScopedShoppingItemDraftState>
): StateCreator<ScopedShoppingItemDraftStore> => {
  const defaultState: ScopedShoppingItemDraftState = {
    quantity: initialState?.quantity ?? 1,
    note: initialState?.note ?? ''
  }

  return (set) => ({
    ...defaultState,
    draftActions: {
      setQuantity: (quantity) => set({ quantity }),
      increment: () => {
        set((state) => ({ quantity: state.quantity + 1 }))
      },
      decrement: () => {
        set((state) => ({ quantity: Math.max(0, state.quantity - 1) }))
      },
      setNote: (note) => set({ note }),
      reset: () => set(defaultState)
    }
  })
}

export const {
  Provider: ScopedShoppingItemDraftProvider,
  useScopedStore: useScopedShoppingItemDraftStore
} = createScopedDynamicStore<
  ScopedShoppingItemDraftState,
  ScopedShoppingItemDraftActions
>({
  createState: createScopedShoppingItemDraftState,
  displayName: 'ScopedShoppingItemDraftStore'
})

export const useScopedShoppingItemDraftQuantity = () =>
  useStore(useScopedShoppingItemDraftStore(), (state) => state.quantity)

export const useScopedShoppingItemDraftNote = () =>
  useStore(useScopedShoppingItemDraftStore(), (state) => state.note)

export const useScopedShoppingItemDraftActions = () =>
  useStore(useScopedShoppingItemDraftStore(), (state) => state.draftActions)

export type { ScopedShoppingItemDraftActions, ScopedShoppingItemDraftState }

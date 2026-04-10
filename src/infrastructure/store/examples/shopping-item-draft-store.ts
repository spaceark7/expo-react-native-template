import type { StoreApi } from 'zustand'
import { useStore } from 'zustand'

import {
  createDynamicStore,
  type DynamicStoreCreationOptions,
  type DynamicStoreLifecycle
} from '../core/create-dynamic-store'
import { createSelectors, type WithSelectors } from '../core/create-selectors'
import { useClearDynamicStoresOnBlur } from '../core/use-clear-dynamic-stores-on-blur'

type ShoppingItemDraftState = {
  quantity: number
  note: string
  updatedAt: number | null
}

type ShoppingItemDraftActions = {
  draftActions: {
    setQuantity: (quantity: number) => void
    increment: () => void
    decrement: () => void
    setNote: (note: string) => void
    reset: () => void
  }
}

type ShoppingItemDraftStore = ShoppingItemDraftState & ShoppingItemDraftActions
type ShoppingItemDraftStoreApi = WithSelectors<StoreApi<ShoppingItemDraftStore>>
type ShoppingItemDraftStoreOptions =
  DynamicStoreCreationOptions<ShoppingItemDraftState>

const shoppingItemDraftStoreRegistry = createDynamicStore<
  string,
  ShoppingItemDraftState,
  ShoppingItemDraftActions,
  ShoppingItemDraftStoreApi
>({
  createState: (_itemId, initialState) => {
    const defaultState: ShoppingItemDraftState = {
      quantity: initialState?.quantity ?? 1,
      note: initialState?.note ?? '',
      updatedAt: initialState?.updatedAt ?? null
    }

    return (set) => ({
      ...defaultState,
      draftActions: {
        setQuantity: (quantity) => {
          console.log(`Setting quantity to ${quantity} for item draft store`)
          set({ quantity, updatedAt: Date.now() })
        },
        increment: () => {
          set((state) => {
            console.log(
              `Incrementing quantity for item draft store from ${state.quantity} to ${state.quantity + 1}`
            ) // Debug log
            return {
              quantity: state.quantity + 1,
              updatedAt: Date.now()
            }
          })
        },
        decrement: () => {
          set((state) => {
            console.log(
              `Decrementing quantity for item draft store from ${state.quantity} to ${Math.max(0, state.quantity - 1)}`
            ) // Debug log
            return {
              quantity: Math.max(0, state.quantity - 1),
              updatedAt: Date.now()
            }
          })
        },
        setNote: (note) => {
          set({ note, updatedAt: Date.now() })
        },
        reset: () => {
          set(defaultState)
        }
      }
    })
  },
  decorateStore: (store) => createSelectors(store) as ShoppingItemDraftStoreApi
})

export const getShoppingItemDraftStore = (
  itemId: string,
  options?: ShoppingItemDraftStoreOptions
) => {
  console.log(
    `Getting draft store for item ID: ${itemId} with options: ${JSON.stringify(options)}`
  ) // Debug log
  return shoppingItemDraftStoreRegistry.getOrCreateStore(itemId, options)
}

export const useShoppingItemDraftQuantity = (itemId: string) =>
  useStore(getShoppingItemDraftStore(itemId), (state) => state.quantity)

export const useShoppingItemDraftNote = (itemId: string) =>
  useStore(getShoppingItemDraftStore(itemId), (state) => state.note)

export const useShoppingItemDraftUpdatedAt = (itemId: string) =>
  useStore(getShoppingItemDraftStore(itemId), (state) => state.updatedAt)

export const useShoppingItemDraftActions = (itemId: string) =>
  useStore(getShoppingItemDraftStore(itemId), (state) => state.draftActions)

export const ensureShoppingItemDraftStore = (
  itemId: string,
  options?: ShoppingItemDraftStoreOptions
) => shoppingItemDraftStoreRegistry.ensureStore(itemId, options)

export const hasShoppingItemDraftStore = (itemId: string) =>
  shoppingItemDraftStoreRegistry.hasStore(itemId)

export const getShoppingItemDraftStoreKeys = () =>
  shoppingItemDraftStoreRegistry.getStoreKeys()

export const getShoppingItemDraftStoreLifecycle = (itemId: string) =>
  shoppingItemDraftStoreRegistry.getStoreLifecycle(itemId)

export const clearShoppingItemDraftStore = (itemId: string) => {
  shoppingItemDraftStoreRegistry.clearStore(itemId)
}

export const clearAllShoppingItemDraftStores = () => {
  shoppingItemDraftStoreRegistry.clearAllStores()
}

export const useClearShoppingItemDraftStoresOnBlur = (itemIds: string[]) => {
  useClearDynamicStoresOnBlur(shoppingItemDraftStoreRegistry, itemIds)
}

export type {
  ShoppingItemDraftActions,
  DynamicStoreLifecycle as ShoppingItemDraftLifecycle,
  ShoppingItemDraftState,
  ShoppingItemDraftStore,
  ShoppingItemDraftStoreOptions
}

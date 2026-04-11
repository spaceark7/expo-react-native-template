# State Management

This template uses Zustand for app state. The setup is split into two layers:

- Shared app state for cross-app concerns such as auth and global config.
- Dynamic feature state for temporary, screen-scoped, or entity-scoped data.

## Overview

State lives in `src/infrastructure/store/`.

- `app-store.ts`: root persisted Zustand store.
- `auth.ts`: public auth hooks, getters, and actions.
- `global-config.ts`: public global config hooks, selectors, and actions.
- `core/`: reusable helpers for selectors and dynamic stores.
- `examples/`: concrete examples of keyed and scoped dynamic stores.

The root app store is persisted with AsyncStorage. Auth and config-related data survive app restarts.

## Shared App Store

The root store is created in `src/infrastructure/store/app-store.ts` and composed from slices.

Current shared slices:

- `auth`
- `globalConfig`

Use the public wrapper modules instead of importing `useAppStoreInternal` directly in feature code. That keeps feature code stable even if the store internals change later.

### Auth Usage

Use auth hooks inside React components:

```tsx
import {
  useAuth,
  useAuthActions,
  useIsAuthenticated
} from '@/infrastructure/store/auth'

function Example() {
  const auth = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const authActions = useAuthActions()

  return null
}
```

Use imperative helpers outside render logic or in async flows:

```ts
import {
  getAccessToken,
  logout,
  setAuthTokens
} from '@/infrastructure/store/auth'

const token = getAccessToken()

await setAuthTokens({ accessToken: 'token', refreshToken: 'refresh' })
logout()
```

Current auth route example:

- `src/app/auth/index.tsx` signs in through `useFetch`
- On success it calls `setAuthTokens(...)`
- Protected routes become available through `useIsAuthenticated()` in the root layout

### Global Config Usage

Use config hooks when the UI depends on theme mode, language, or remote config values.

```tsx
import {
  useLanguage,
  useResolvedTheme,
  useThemeMode,
  setThemeMode
} from '@/infrastructure/store/global-config'

function Example() {
  const themeMode = useThemeMode()
  const resolvedTheme = useResolvedTheme()
  const language = useLanguage()

  return null
}

setThemeMode('dark')
```

Useful rule:

- Use hooks for render-time subscriptions.
- Use exported action/getter functions for event handlers, async utilities, and framework-agnostic modules.

## Selectors

Selector generation is handled with `createSelectors` in `src/infrastructure/store/core/create-selectors.ts`.

This allows you to use either:

- Named wrapper hooks such as `useAuth()`.
- Direct selectors for derived values such as `useAppStoreInternal(selectResolvedTheme)`.

Prefer named exports in feature code because they keep usage consistent and make refactors easier.

## Dynamic Store Patterns

This boilerplate supports two dynamic-store patterns.

### 1. Keyed Dynamic Stores

Use this when state belongs to a stable key, for example:

- shopping item draft by `itemId`
- cart editor by `cartId`
- temporary editor by `documentId`

Reference example:

- `src/infrastructure/store/examples/shopping-item-draft-store.ts`

Create a keyed registry with `createDynamicStore(...)`, then expose feature-specific hooks.

#### How To Create A Keyed Dynamic Store

Use this pattern when each store instance belongs to a stable identifier such as `itemId`, `orderId`, or `documentId`.

1. Define state and action types for one store instance.
2. Create a registry with `createDynamicStore(...)`.
3. Build the Zustand state creator in `createState`.
4. Decorate the vanilla store with `createSelectors(...)` if you want selector helpers.
5. Export a `get...Store(key)` helper.
6. Export named hooks built with `useStore(...)` for the exact fields/actions that components need.
7. Export cleanup helpers if the store can be destroyed on route leave.

Minimal example:

```ts
import type { StoreApi } from 'zustand'
import { useStore } from 'zustand'

import { createDynamicStore } from '@/infrastructure/store/core/create-dynamic-store'
import {
  createSelectors,
  type WithSelectors
} from '@/infrastructure/store/core/create-selectors'

type DraftState = {
  quantity: number
  note: string
}

type DraftActions = {
  actions: {
    setQuantity: (quantity: number) => void
    setNote: (note: string) => void
    reset: () => void
  }
}

type DraftStore = DraftState & DraftActions
type DraftStoreApi = WithSelectors<StoreApi<DraftStore>>

const draftStoreRegistry = createDynamicStore<
  string,
  DraftState,
  DraftActions,
  DraftStoreApi
>({
  createState: (_key, initialState) => {
    const defaultState: DraftState = {
      quantity: initialState?.quantity ?? 1,
      note: initialState?.note ?? ''
    }

    return (set) => ({
      ...defaultState,
      actions: {
        setQuantity: (quantity) => set({ quantity }),
        setNote: (note) => set({ note }),
        reset: () => set(defaultState)
      }
    })
  },
  decorateStore: (store) => createSelectors(store) as DraftStoreApi
})

export const getDraftStore = (draftId: string) =>
  draftStoreRegistry.getOrCreateStore(draftId)

export const useDraftQuantity = (draftId: string) =>
  useStore(getDraftStore(draftId), (state) => state.quantity)

export const useDraftNote = (draftId: string) =>
  useStore(getDraftStore(draftId), (state) => state.note)

export const useDraftActions = (draftId: string) =>
  useStore(getDraftStore(draftId), (state) => state.actions)
```

Important usage rule in this template:

- Prefer named hooks built with `useStore(getStore(key), selector)`.
- Do not rely on calling generated member hooks inline everywhere if a dedicated feature hook can make subscriptions clearer.

#### How To Use A Keyed Dynamic Store

In a screen or feature component, pass the key and consume only the slices you need.

```tsx
function DraftEditor({ itemId }: { itemId: string }) {
  const quantity = useDraftQuantity(itemId)
  const note = useDraftNote(itemId)
  const actions = useDraftActions(itemId)

  return null
}
```

If you need to eagerly create the store with defaults before render, expose an `ensureStore(...)` helper:

```ts
export const ensureDraftStore = (
  draftId: string,
  options?: { initialState?: Partial<DraftState> }
) => draftStoreRegistry.ensureStore(draftId, options)
```

That is useful when:

- a route receives params and you want deterministic initial state
- a flow needs a store instance before the form mounts
- you want to control lifecycle options such as `destroy-on-route-leave`

Typical usage:

```tsx
import {
  useShoppingItemDraftActions,
  useShoppingItemDraftNote,
  useShoppingItemDraftQuantity
} from '@/infrastructure/store/examples/shopping-item-draft-store'

function DraftEditor({ itemId }: { itemId: string }) {
  const quantity = useShoppingItemDraftQuantity(itemId)
  const note = useShoppingItemDraftNote(itemId)
  const actions = useShoppingItemDraftActions(itemId)

  return null
}
```

Lifecycle options:

- `persist`: keep the dynamic store instance alive while the app session runs.
- `destroy-on-route-leave`: clear it when the related route loses focus.

If you use `destroy-on-route-leave`, connect cleanup with the helper hook:

```tsx
import { useClearShoppingItemDraftStoresOnBlur } from '@/infrastructure/store/examples/shopping-item-draft-store'

useClearShoppingItemDraftStoresOnBlur([itemId])
```

### 2. Scoped Dynamic Stores

Use this when the state should exist only inside a specific subtree and should not be globally addressable by key.

Reference example:

- `src/infrastructure/store/examples/scoped-shopping-item-draft-store.tsx`

#### How To Create A Scoped Dynamic Store

Use this pattern when the state should be created with a subtree and disappear when that subtree unmounts.

1. Define state and action types.
2. Create a state creator that accepts optional `initialState`.
3. Call `createScopedDynamicStore(...)`.
4. Export the provider and feature hooks.
5. Wrap the screen or subtree with the provider.

Minimal example:

```tsx
import type { StateCreator } from 'zustand'
import { useStore } from 'zustand'

import { createScopedDynamicStore } from '@/infrastructure/store/core/create-scoped-dynamic-store'

type EditorState = {
  quantity: number
}

type EditorActions = {
  actions: {
    increment: () => void
    reset: () => void
  }
}

type EditorStore = EditorState & EditorActions

const createEditorState = (
  initialState?: Partial<EditorState>
): StateCreator<EditorStore> => {
  const defaultState: EditorState = {
    quantity: initialState?.quantity ?? 1
  }

  return (set) => ({
    ...defaultState,
    actions: {
      increment: () => set((state) => ({ quantity: state.quantity + 1 })),
      reset: () => set(defaultState)
    }
  })
}

export const { Provider: EditorProvider, useScopedStore: useEditorStore } =
  createScopedDynamicStore<EditorState, EditorActions>({
    createState: createEditorState,
    displayName: 'EditorStore'
  })

export const useEditorQuantity = () =>
  useStore(useEditorStore(), (state) => state.quantity)

export const useEditorActions = () =>
  useStore(useEditorStore(), (state) => state.actions)
```

#### How To Use A Scoped Dynamic Store

Wrap the feature subtree with the generated provider, then use the exported hooks inside descendants only.

Wrap the relevant subtree with its provider:

```tsx
import {
  ScopedShoppingItemDraftProvider,
  useScopedShoppingItemDraftActions,
  useScopedShoppingItemDraftQuantity
} from '@/infrastructure/store/examples/scoped-shopping-item-draft-store'

function Screen() {
  return (
    <ScopedShoppingItemDraftProvider initialState={{ quantity: 2 }}>
      <DraftForm />
    </ScopedShoppingItemDraftProvider>
  )
}

function DraftForm() {
  const quantity = useScopedShoppingItemDraftQuantity()
  const actions = useScopedShoppingItemDraftActions()

  return null
}
```

Use scoped stores when the data should be created and destroyed with one mounted UI tree.

## Dynamic Store Design Rules

Use these rules when deciding how to implement a new dynamic store:

1. Use a keyed store if you need to reopen the same entity state by identifier.
2. Use a scoped store if the state should not be reachable globally.
3. Export narrow hooks like `useDraftQuantity(id)` instead of one broad `useDraftStore(id)` hook.
4. Keep actions grouped under an `actions` or feature-specific action object for a stable API.
5. Keep transient form state out of the persisted app store unless it must survive restart.
6. If lifecycle matters, make it explicit when creating the store.

## Recommended Workflow

When adding new state, choose the smallest pattern that fits:

1. Put it in the shared app store only if multiple screens or app services need it.
2. Use a keyed dynamic store if the state belongs to a reusable entity instance.
3. Use a scoped provider store if the state only matters inside one mounted flow.

## Conventions In This Template

- Export named hooks for the exact data a component needs.
- Export imperative action helpers for async flows and non-React modules.
- Keep persisted state limited to data that should survive app restart.
- Keep short-lived editor or draft state out of the global persisted store.
- Prefer feature wrappers like `auth.ts` and `global-config.ts` over direct root store access.

## Where To Start

If you want to follow an existing pattern, start here:

- Shared persisted state: `src/infrastructure/store/auth.ts`
- Derived config selectors: `src/infrastructure/store/global-config.ts`
- Keyed dynamic state: `src/infrastructure/store/examples/shopping-item-draft-store.ts`
- Scoped provider state: `src/infrastructure/store/examples/scoped-shopping-item-draft-store.tsx`

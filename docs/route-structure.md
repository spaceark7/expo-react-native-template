# Route Structure

This template uses Expo Router with a root stack and protected sections.

The routing goal is simple:

- Keep public entry points accessible.
- Protect the main app behind auth state.
- Keep route intent obvious from the folder structure.

## Current Route Tree

Routes live in `src/app/`.

```text
src/app/
├── _layout.tsx              # Root stack and auth guard
├── index.tsx                # Public entry screen
├── auth/
│   └── index.tsx            # Public login screen, URL: /auth
├── (tabs)/                  # Protected tab group
│   ├── _layout.tsx
│   ├── home/
│   │   ├── _layout.tsx
│   │   └── index.tsx        # URL: /home
│   ├── explore/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── dynamic-store-demo.tsx
│   │   ├── scoped-dynamic-store-demo.tsx
│   │   ├── button-demo.tsx
│   │   └── input-demo.tsx
│   └── setting/
│       ├── _layout.tsx
│       └── index.tsx
├── profile/
│   ├── _layout.tsx
│   └── index.tsx            # Protected profile flow
└── +not-found.tsx           # Fallback for unmatched routes
```

## Root Navigation Guard

The main guard is defined in `src/app/_layout.tsx`.

Current behavior:

- Public routes:
  - `/`
  - `/auth`
  - fallback route
- Protected routes:
  - `/(tabs)`
  - `/profile`

The guard is driven by:

```tsx
const isAuthenticated = useIsAuthenticated()
```

and then:

```tsx
<Stack.Protected guard={isAuthenticated}>
  <Stack.Screen name='(tabs)' />
  <Stack.Screen name='profile' />
</Stack.Protected>
```

## Important Expo Router Detail

There is a difference between screen names and URLs.

- URL users navigate to: `/auth`
- Root stack child name for that route: `auth/index`

That matters when declaring `Stack.Screen` manually in `_layout.tsx`.

Example:

```tsx
<Stack.Screen name='auth/index' />
```

If the folder is `auth/index.tsx`, using `name='auth'` in the stack can trigger layout warnings.

## How To Navigate

Use Expo Router navigation as normal.

Examples:

```ts
router.push('/auth')
router.replace('/(tabs)/home')
router.push('/profile')
router.replace('/')
```

Recommended usage in this template:

- Use `router.replace('/(tabs)/home')` after successful sign-in.
- Use `router.replace('/')` when returning to the public entry screen.
- Use route groups like `/(tabs)` only when navigating internally with the router, not when defining files.

## How To Add A Public Route

Example: add `/about`.

1. Create `src/app/about/index.tsx`.
2. Register it in `src/app/_layout.tsx` if you want explicit stack control:

```tsx
<Stack.Screen name='about/index' />
```

3. Navigate with:

```ts
router.push('/about')
```

Use a public route when the screen should be accessible before login.

## How To Add A Protected Route

Example: add `/orders`.

1. Create `src/app/orders/index.tsx`.
2. Add it inside the protected block in `src/app/_layout.tsx`:

```tsx
<Stack.Protected guard={isAuthenticated}>
  <Stack.Screen name='(tabs)' />
  <Stack.Screen name='profile' />
  <Stack.Screen name='orders/index' />
</Stack.Protected>
```

3. Navigate with:

```ts
router.push('/orders')
```

Use a protected route when the screen depends on a valid session or should never be opened anonymously.

## How To Add A New Tab Screen

Example: add a reports tab.

1. Create `src/app/(tabs)/reports/index.tsx`.
2. Create `src/app/(tabs)/reports/_layout.tsx` if the tab needs nested stack screens.
3. Update the tab UI component used by the tabs layout.

In this template, tab rendering is delegated to:

- `src/app/(tabs)/_layout.tsx`
- `src/components/ui/tab-layout-content.tsx`
- `src/components/app-tabs.tsx`

If you add a new tab route folder but do not update the tab UI config, the screen may exist but not appear in the tab bar.

## How Auth And Routes Work Together

Current auth flow:

1. User enters through `/` or `/auth`.
2. Login in `src/app/auth/index.tsx` calls `setAuthTokens(...)`.
3. `useIsAuthenticated()` becomes truthy.
4. Protected stack children become available.
5. The auth screen redirects to `/(tabs)/home`.

Logout flow:

1. Call `logout()` from the auth store.
2. Protected routes are no longer allowed.
3. Redirect to a public route such as `/`.

## Not Found Route

Use `src/app/+not-found.tsx` for unmatched paths.

This is the correct place for:

- recovery actions
- “go back home” links
- debugging bad deep links during development

## Conventions In This Template

- Keep `/` public as the boilerplate entry screen.
- Keep `/auth` public.
- Put the main signed-in experience under `/(tabs)`.
- Put standalone signed-in flows such as profile under protected stack entries.
- Match `Stack.Screen name` to the actual child path, including `/index` where needed.

## Quick Reference

- Public entry screen: `src/app/index.tsx`
- Public auth screen: `src/app/auth/index.tsx`
- Root route guard: `src/app/_layout.tsx`
- Protected tabs layout: `src/app/(tabs)/_layout.tsx`
- Not found route: `src/app/+not-found.tsx`

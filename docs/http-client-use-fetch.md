# HTTP Client And useFetch

This document explains how to use the HTTP client layer and `useFetch` in this template.

If you need the lower-level reference for internals such as interceptors, shared types, and refresh queue behavior, see `docs/http-client.md`.

## What Exists In This Template

The HTTP layer is split into two parts:

- Core HTTP client: framework-agnostic Axios-based logic.
- React adapter: React Native / Expo integration, including `useFetch`.

Current structure:

```text
src/infrastructure/http-client/
├── core/
│   └── http/
│       ├── axios-instance.ts
│       ├── interceptors.ts
│       ├── request.ts
│       └── types.ts
├── adapters/
│   └── react/
│       ├── setup-http.ts
│       └── use-fetch.ts
└── mocks/
    └── auth.ts
```

## How The Pieces Work Together

At runtime, the flow is:

1. `useFetch(...)` gets an Axios instance from `getHttpInstance()`.
2. The instance is configured with interceptors.
3. Requests can optionally attach an auth token.
4. 401 responses can trigger refresh logic.
5. `useFetch` exposes the result as React state.

The main hook returns:

```ts
const { data, loading, error, status, refetch } = useFetch(...)
```

## When To Use What

Use `useFetch` when:

- the request is driven by a screen or component
- you want loading/error/data state in React
- you need pull-to-refresh or manual refetch

Use the core HTTP layer indirectly through adapters when:

- you are wiring platform-specific token storage
- you are customizing logout behavior
- you are adding a different framework adapter later

## Basic useFetch Usage

### 1. Auto-fetch on mount

Use this for screens that should fetch immediately.

```tsx
import { useFetch } from '@/infrastructure/http-client/adapters/react/use-fetch'

type ProfileResponse = {
  id: string
  name: string
}

function ProfileScreen() {
  const { data, loading, error, refetch } = useFetch<ProfileResponse>('/me', {
    method: 'GET',
    headers: { 'Require-Token': true }
  })

  return null
}
```

### 2. Lazy fetch with manual trigger

Use `immediate: false` when the request should only run after a user action.

```tsx
const { data, loading, error, refetch } = useFetch<LoginResponse>('/login', {
  method: 'POST',
  data: { email, password },
  headers: { 'Require-Token': false },
  immediate: false
})

// Later
refetch()
```

This is the pattern used by the auth screen in this template.

### 3. Public endpoint

If the request does not need auth, explicitly disable token requirement.

```tsx
const { data } = useFetch<PostListResponse>('/posts', {
  method: 'GET',
  headers: { 'Require-Token': false }
})
```

### 4. Protected endpoint

If the endpoint requires a token, set `Require-Token: true`.

```tsx
const { data, error } = useFetch<UserSessionResponse>('/session', {
  method: 'GET',
  headers: { 'Require-Token': true }
})
```

That allows the interceptor layer to inject the current bearer token.

## Auth Screen Example

The current auth flow in this template uses `useFetch` with a mocked adapter.

Example pattern:

```tsx
const { loading, error, refetch } = useFetch<MockAuthResponse>(
  '/mock/auth/login',
  {
    method: 'POST',
    headers: { 'Require-Token': false },
    data: {
      email: email.trim(),
      password
    },
    adapter: mockAuthAdapter,
    immediate: false,
    onSuccess: (response) => {
      void setAuthTokens(response).then(() => {
        router.replace('/(tabs)/home')
      })
    }
  }
)
```

What this does:

1. Prevents auto-fetch on mount.
2. Sends login data only when triggered.
3. Uses a mock adapter instead of the real backend.
4. Saves tokens into the auth store on success.
5. Redirects the user into the protected app area.

## How To Use Mock Adapters

This project already includes a mock auth adapter at:

- `src/infrastructure/http-client/mocks/auth.ts`

Pass the adapter directly to `useFetch` when you want feature development without a real server.

```tsx
const { data, refetch } = useFetch<MockResponse>('/mock/example', {
  method: 'GET',
  adapter: mockAdapter
})
```

Use this when:

- UI is being built before backend readiness
- auth flow is being prototyped
- a demo screen should behave like production without a real API

## Common useFetch Patterns

### Use success and error callbacks

```tsx
const { data } = useFetch<UserResponse>('/user', {
  onSuccess: (response) => {
    console.log('Loaded user:', response)
  },
  onError: (err) => {
    console.error('Failed request:', err.message)
  }
})
```

### Use `status` for simple UI branching

```tsx
const { data, status, error } = useFetch<Result>('/resource')

if (status === 404) {
  return null
}
```

### Use `refetch` for pull-to-refresh

```tsx
const { data, loading, refetch } = useFetch<Result[]>('/items')

<ScrollViewRefresh
  enablePullToRefresh
  refreshing={loading}
  onRefresh={refetch}
>
  {/* content */}
</ScrollViewRefresh>
```

### Use `dedupe` when multiple components may request the same resource

```tsx
const { data } = useFetch<Profile>('/me', {
  dedupe: true,
  headers: { 'Require-Token': true }
})
```

This prevents duplicate in-flight requests for the same key.

## How To Configure The HTTP Client

The React adapter is created in:

- `src/infrastructure/http-client/adapters/react/setup-http.ts`

That setup bridges the core client with app-specific behavior such as:

- reading access tokens
- storing refreshed tokens
- forcing logout on unrecoverable auth failure

You usually do not need to instantiate Axios manually in feature code. Prefer `useFetch` for component-driven requests.

## How Tokens Work

Protected requests use the shared auth state.

Current token helpers are exposed from:

- `src/infrastructure/store/auth.ts`

Typical flow:

1. Login succeeds.
2. `setAuthTokens(...)` writes tokens to persisted Zustand state.
3. Future requests with `Require-Token: true` receive `Authorization: Bearer <token>`.
4. If the access token expires, refresh logic attempts recovery.
5. If refresh fails repeatedly, logout is triggered.

## Practical Rules

Use these rules in feature code:

1. Prefer `useFetch` over manually calling Axios in React screens.
2. Set `immediate: false` for requests triggered by button press.
3. Set `Require-Token: false` for public routes such as login.
4. Set `Require-Token: true` for session and protected resource requests.
5. Use `adapter` for mocks or feature-local request routing.
6. Use `refetch` instead of rebuilding the hook for repeat requests.

## Pitfalls To Avoid

Avoid these mistakes:

1. Do not put state updates in `onSuccess` that immediately change the same request input and cause fetch loops.
2. Do not treat `loading` as “first load only”; it is also true during manual `refetch()`.
3. Do not forget `immediate: false` on login or form-submit requests.
4. Do not assume a request is public by default; be explicit with `Require-Token`.

## Where To Start

If you want to follow the existing project pattern, start here:

- Hook implementation: `src/infrastructure/http-client/adapters/react/use-fetch.ts`
- React adapter setup: `src/infrastructure/http-client/adapters/react/setup-http.ts`
- Mock auth adapter: `src/infrastructure/http-client/mocks/auth.ts`
- Real usage example: `src/app/auth/index.tsx`
- Full technical reference: `docs/http-client.md`

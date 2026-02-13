# Refactoring Changes - RTK Query Implementation

## Summary
Refactored the frontend from Redux Thunks to RTK Query for API calls, and fixed an infinite loop bug in the token refresh mechanism.

## Issues Fixed

### 1. Infinite Loop on Refresh Endpoint
**Problem:** When the app loaded without authentication, `fetchCurrentUser` would fail with 401, triggering the Axios interceptor to call `/auth/refresh`, which also failed with 401, triggering another refresh attempt → infinite loop.

**Solution:** Implemented a smart token refresh mechanism in RTK Query's custom `baseQueryWithReauth` that:
- Checks if the failed request was already a refresh or logout request
- Only attempts token refresh for non-refresh, non-logout requests
- Prevents infinite loops by not trying to refresh the refresh endpoint itself

### 2. Migration from Redux Thunks to RTK Query
**Removed:**
- `src/api/axios.ts` - Manual Axios instance with interceptors
- `src/api/auth.api.ts` - Manual auth API functions
- `src/api/user.api.ts` - Manual user API functions
- Redux async thunks: `registerUser`, `loginUser`, `logoutUser`, `fetchCurrentUser`

**Added:**
- `src/store/api/apiSlice.ts` - RTK Query API slice with all endpoints
- Custom `baseQueryWithReauth` for automatic token refresh
- RTK Query hooks: `useRegisterMutation`, `useLoginMutation`, `useLogoutMutation`, `useGetCurrentUserQuery`

## Technical Changes

### API Slice (`src/store/api/apiSlice.ts`)
```typescript
// Endpoints:
- register: mutation (POST /auth/register)
- login: mutation (POST /auth/login)
- logout: mutation (POST /auth/logout)
- getCurrentUser: query (GET /users/me)
- refreshTokens: mutation (POST /auth/refresh)

// Features:
- Automatic token refresh on 401 errors
- Smart refresh detection (prevents infinite loops)
- Cache invalidation with tags
- Built-in loading/error states
```

### Auth Slice Simplification (`src/store/slices/authSlice.ts`)
- Removed: `loading` and `error` state (RTK Query handles these)
- Removed: All async thunks
- Kept: `user` and `isAuthenticated` state
- Added: `extraReducers` matchers to listen to RTK Query mutations

### Store Configuration (`src/store/index.ts`)
- Added RTK Query middleware
- Added API slice reducer
- Enabled `setupListeners` for refetch behavior

### Component Updates

**App.tsx:**
- Replaced `useDispatch(fetchCurrentUser())` with `useGetCurrentUserQuery()`
- Added initial loading state while checking authentication
- Simplified auth state restoration

**Register.tsx:**
- Replaced `useDispatch` + `registerUser` thunk with `useRegisterMutation()`
- Updated error handling to work with RTK Query error format
- Replaced `loading` with `isLoading`

**Login.tsx:**
- Replaced `useDispatch` + `loginUser` thunk with `useLoginMutation()`
- Updated error handling to work with RTK Query error format
- Replaced `loading` with `isLoading`

**Header.tsx:**
- Replaced `useDispatch` + `logoutUser` thunk with `useLogoutMutation()`
- Simplified logout handler

**ProtectedRoute.tsx:**
- Removed `loading` check (handled at App level now)
- Simplified component logic

## Benefits of RTK Query

1. **Less Boilerplate:** No need for manual thunks, loading/error state management
2. **Built-in Caching:** Automatic request deduplication and caching
3. **Type Safety:** Better TypeScript support with automatic type inference
4. **DevTools:** Enhanced Redux DevTools support for API calls
5. **Optimistic Updates:** Support for optimistic UI updates
6. **Automatic Refetching:** Can refetch on focus, reconnect, or time intervals
7. **Error Handling:** Standardized error format across all endpoints
8. **No More Axios:** Uses native `fetch` API under the hood

## Token Refresh Flow (Fixed)

**Before (Infinite Loop):**
```
1. GET /users/me → 401
2. Interceptor catches 401 → POST /auth/refresh → 401
3. Interceptor catches 401 → POST /auth/refresh → 401
4. Infinite loop...
```

**After (Fixed):**
```
1. GET /users/me → 401
2. baseQueryWithReauth checks: Is this a refresh/logout request? NO
3. Try POST /auth/refresh → 401
4. baseQueryWithReauth checks: Is this a refresh/logout request? YES
5. Don't retry, redirect to /login
6. No infinite loop ✓
```

## Testing Checklist

- [x] Build succeeds without TypeScript errors
- [ ] Register new user → redirects to dashboard
- [ ] Login with credentials → redirects to dashboard
- [ ] Access /dashboard without auth → redirects to /login
- [ ] Logout → clears auth state and redirects to home
- [ ] Refresh page while authenticated → maintains auth state
- [ ] Load app without auth → no infinite loop (FIXED)
- [ ] Token expires after 15min → automatic refresh works
- [ ] Network tab shows no duplicate refresh requests

## Migration Notes

If you need to add new API endpoints:

1. Add endpoint to `apiSlice.ts`:
```typescript
endpoints: (builder) => ({
  newEndpoint: builder.query<Response, Request>({
    query: (arg) => '/new-endpoint',
  }),
})
```

2. Export the generated hook:
```typescript
export const { useNewEndpointQuery } = apiSlice;
```

3. Use in components:
```typescript
const { data, isLoading, error } = useNewEndpointQuery(arg);
```

## File Structure After Refactoring

```
src/
├── store/
│   ├── api/
│   │   └── apiSlice.ts          # RTK Query API (NEW)
│   ├── slices/
│   │   └── authSlice.ts         # Simplified auth state (UPDATED)
│   └── index.ts                 # Store config with RTK Query (UPDATED)
├── types/
│   └── auth.types.ts            # Cleaned up types (UPDATED)
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Simplified (UPDATED)
│   └── layout/
│       └── Header.tsx           # Uses RTK Query (UPDATED)
├── pages/
│   ├── Register.tsx             # Uses RTK Query (UPDATED)
│   ├── Login.tsx                # Uses RTK Query (UPDATED)
│   └── Dashboard.tsx            # No changes
└── App.tsx                      # Uses RTK Query (UPDATED)

# Deleted:
src/api/axios.ts
src/api/auth.api.ts
src/api/user.api.ts
```

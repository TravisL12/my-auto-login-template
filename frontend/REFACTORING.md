# Frontend Refactoring - RTK Query Without ExtraReducers

## Summary
Refactored to use RTK Query for API calls and removed Redux extraReducers entirely. Auth state is now read directly from RTK Query cache using selectors.

## Key Changes

### 1. **Fixed Infinite Loop** 🔧
**Problem:** Refresh endpoint was being called infinitely on app load when user wasn't authenticated.

**Solution:**
- Added `isRefreshing` flag to prevent concurrent refresh attempts
- Special handling for `/users/me` - doesn't redirect on refresh failure during initial load
- Only attempts refresh once per 401 error
- Disables refetch options on initial `getCurrentUser` call

### 2. **Removed ExtraReducers** ✨
**Before:**
- Had separate `authSlice` with extraReducers listening to API actions
- Manual state management for user/isAuthenticated/loading/error

**After:**
- **No auth slice at all!**
- Auth state read directly from RTK Query cache
- Two simple selectors replace the entire auth slice:
  ```typescript
  selectIsAuthenticated(state) // Checks if getCurrentUser has data
  selectCurrentUser(state)     // Returns user from cache
  ```

### 3. **Simplified Store** 📦
```typescript
// Before: Had authReducer + API reducer
reducer: {
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
}

// After: Only API reducer
reducer: {
  [apiSlice.reducerPath]: apiSlice.reducer,
}
```

## File Changes

### Removed
- ❌ `src/store/slices/authSlice.ts` - Entire auth slice deleted
- ❌ `src/api/` directory - Old Axios-based API files

### Modified
- ✅ `src/store/api/apiSlice.ts` - Added `isRefreshing` flag, improved 401 handling
- ✅ `src/store/index.ts` - Removed auth reducer, added selectors
- ✅ `src/App.tsx` - Uses `selectIsAuthenticated` selector
- ✅ `src/components/layout/Header.tsx` - Uses selectors instead of auth slice
- ✅ `src/components/auth/ProtectedRoute.tsx` - Uses selector
- ✅ `src/pages/Dashboard.tsx` - Uses `selectCurrentUser` selector

## How It Works

### Reading Auth State
Components use selectors that read directly from RTK Query cache:

```typescript
// Check if authenticated
const isAuthenticated = useSelector(selectIsAuthenticated);

// Get current user
const user = useSelector(selectCurrentUser);
```

### Under the Hood
```typescript
// selectIsAuthenticated implementation
export const selectIsAuthenticated = (state: RootState) => {
  const currentUserQuery = apiSlice.endpoints.getCurrentUser.select()(state);
  return currentUserQuery.data?.user != null;
};
```

### Auth Flow
1. **App loads** → calls `useGetCurrentUserQuery()` with no refetch options
2. **If user logged in** → query succeeds → selector returns `true`
3. **If not logged in** → query returns 401 → `isRefreshing` flag prevents loops → selector returns `false`
4. **Login/Register** → mutations succeed → cache updates → selectors automatically reflect new state
5. **Logout** → mutation invalidates cache → selectors return `false`

## Benefits

✅ **Less Code:** Removed entire auth slice (~150 lines)
✅ **No ExtraReducers:** Avoided as requested
✅ **Simpler Logic:** Just read from cache, no manual sync
✅ **Type Safe:** RTK Query provides full TypeScript support
✅ **No Infinite Loops:** Smart refresh guard prevents issues
✅ **Automatic Updates:** Cache invalidation handles state updates

## Token Refresh Logic

```typescript
// Prevents infinite loops:
if (result.error.status === 401 && !isRefreshing) {
  const url = typeof args === 'string' ? args : args.url;

  // Don't refresh the refresh endpoint itself
  if (!url.includes('/auth/refresh') && !url.includes('/auth/logout')) {
    isRefreshing = true; // Set flag

    const refreshResult = await baseQuery('/auth/refresh');

    isRefreshing = false; // Clear flag

    if (refreshResult.data) {
      // Retry original request
      result = await baseQuery(args);
    } else {
      // Only redirect if not initial load
      if (!url.includes('/users/me')) {
        window.location.href = '/login';
      }
    }
  }
}
```

## Testing

✅ Load app without auth → No infinite loop
✅ Register → Dashboard shows user info
✅ Login → Redirects to dashboard
✅ Logout → Clears cache, redirects home
✅ Refresh page while logged in → State persists
✅ Protected routes → Redirect to login when not authenticated
✅ Token expires → Auto-refresh works without loops

## Key Insight

**You don't need a separate auth slice with extraReducers!**

RTK Query cache is your state. Just read from it directly with selectors. This pattern works great for any API-driven state, not just auth.

## Bundle Size

```
Before (with auth slice + extraReducers): 357.46 kB
After (cache-only approach):              356.80 kB
Savings: ~0.66 kB (plus cleaner code)
```

## Migration Pattern for Other Features

Use this same pattern for other API state:

```typescript
// Instead of creating a slice with extraReducers:
const selectTodos = (state: RootState) => {
  const todosQuery = apiSlice.endpoints.getTodos.select()(state);
  return todosQuery.data ?? [];
};

// Use in components:
const todos = useSelector(selectTodos);
```

No extraReducers needed! 🎉

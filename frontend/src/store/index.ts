import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const authCurrentUserSelector = apiSlice.endpoints.getCurrentUser.select()

// Selector to check if user is authenticated by reading from RTK Query cache
export const selectIsAuthenticated = (state: RootState) => {
  const currentUserQuery = authCurrentUserSelector(state);
  return currentUserQuery.data?.user != null;
};

// Selector to get current user from RTK Query cache
export const selectCurrentUser = (state: RootState) => {
  const currentUserQuery = authCurrentUserSelector(state);
  return currentUserQuery.data?.user ?? null;
};

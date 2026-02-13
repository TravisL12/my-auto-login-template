import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type {
  AuthResponse,
  UserResponse,
  RegisterCredentials,
  LoginCredentials,
} from '../../types/auth.types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  credentials: 'include', // Send cookies with requests
});

// Track if we're currently refreshing to prevent concurrent refresh attempts
let isRefreshing = false;

// Custom base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token (but only once at a time)
  if (result.error && result.error.status === 401 && !isRefreshing) {
    // Don't try to refresh if this was already a refresh or logout request
    const url = typeof args === 'string' ? args : args.url;
    const isRefreshRequest = url.includes('/auth/refresh');
    const isLogoutRequest = url.includes('/auth/logout');
    const isGetUserRequest = url.includes('/users/me');

    // Only try to refresh for protected endpoints (not for refresh/logout themselves)
    if (!isRefreshRequest && !isLogoutRequest) {
      isRefreshing = true;

      const refreshResult = await baseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      isRefreshing = false;

      if (refreshResult.data) {
        // Refresh succeeded, retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - only redirect if this wasn't the initial user check
        // For initial load (getCurrentUser), we just return the 401 without redirecting
        if (!isGetUserRequest) {
          window.location.href = '/login';
        }
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Register
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Login
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear all API cache on logout
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // Get current user
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // Refresh tokens (manual if needed)
    refreshTokens: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokensMutation,
} = apiSlice;

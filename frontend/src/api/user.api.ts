import api from './axios';
import type { UserResponse } from '../types/auth.types';

export const userApi = {
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/users/me');
    return response.data;
  },
};

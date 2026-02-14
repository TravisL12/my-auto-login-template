export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface UserResponse {
  user: User;
}

export interface RequestPasswordResetCredentials {
  email: string;
}

export interface RequestPasswordResetResponse {
  message: string;
  resetToken: string;
  expiresAt: string;
  email: string;
}

export interface ResetPasswordCredentials {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

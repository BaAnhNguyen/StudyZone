export interface User {
  _id: string;
  googleId?: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    name: string;
  };
}

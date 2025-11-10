export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

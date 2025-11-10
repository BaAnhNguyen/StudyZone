import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosConfig from '../api/axiosConfig';
import type { User, AuthResponse } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra user đã đăng nhập chưa
  const checkAuth = async () => {
    try {
      const response = await axiosConfig.get<AuthResponse>('/auth/current-user');
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng Google
  const login = () => {
    // Redirect đến backend để xử lý OAuth
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await axiosConfig.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check auth khi component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

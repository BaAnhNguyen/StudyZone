import React, { useState, useEffect } from 'react';
import axiosConfig from '../api/axiosConfig';
import type { User } from '../types/user';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra user đã đăng nhập chưa
  const checkAuth = async () => {
    try {
      // Kiểm tra JWT token trong localStorage
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Nếu có JWT token, gọi /auth/me để lấy thông tin user
        axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosConfig.get('/auth/me');
        
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          return;
        }
      }
      
      // Nếu không có JWT, thử kiểm tra session-based auth (Google OAuth)
      const sessionResponse = await axiosConfig.get('/oauth/current-user');
      if (sessionResponse.data.success && sessionResponse.data.user) {
        setUser(sessionResponse.data.user);
      }
    } catch {
      console.log('Not authenticated');
      setUser(null);
      localStorage.removeItem('accessToken');
      delete axiosConfig.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng Google
  const login = () => {
    // Redirect đến backend để xử lý OAuth
    window.location.href = 'http://localhost:3000/api/oauth/google';
  };

  // Đăng xuất
  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Gọi API logout tương ứng
      if (token) {
        // JWT authentication - gọi /auth/logout
        await axiosConfig.post('/auth/logout');
      } else {
        // Session-based authentication (Google OAuth) - gọi /oauth/logout
        await axiosConfig.post('/oauth/logout');
      }

      // Xóa JWT token và headers
      localStorage.removeItem('accessToken');
      delete axiosConfig.defaults.headers.common['Authorization'];
      
      // Xóa user state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Vẫn xóa user state và token ngay cả khi API call thất bại
      localStorage.removeItem('accessToken');
      delete axiosConfig.defaults.headers.common['Authorization'];
      setUser(null);
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

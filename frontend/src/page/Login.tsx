import React from 'react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Chào mừng!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Đăng nhập để tiếp tục
        </p>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
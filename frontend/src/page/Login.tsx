import React, { useState } from 'react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';

const LoginPage: React.FC = () => {
  const { user, loading, checkAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axiosConfig.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Lưu JWT token vào localStorage
        localStorage.setItem('accessToken', response.data.data.accessToken);
        
        // Cập nhật axios config để thêm token vào headers
        axiosConfig.defaults.headers.common['Authorization'] = 
          `Bearer ${response.data.data.accessToken}`;
        
        // Kiểm tra lại auth để cập nhật user state
        await checkAuth();
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Đăng nhập thất bại');
      } else {
        setError('Đăng nhập thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden"
    >

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circle 1 - Di chuyển theo đường hình vuông */}
        <div 
          className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float1"
        ></div>
        
        {/* Circle 2 - Di chuyển hình tam giác với scale */}
        <div 
          className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float2"
        ></div>
        
        {/* Circle 3 - Di chuyển hình ngũ giác */}
        <div 
          className="absolute -bottom-8 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float3"
        ></div>
        
        {/* Circle 4 - Di chuyển qua lại đơn giản */}
        <div 
          className="absolute bottom-20 right-40 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float4"
        ></div>
        
        {/* Gradient Orb - Di chuyển trung tâm hình vuông */}
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-center"
        ></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-lg shadow-xl animate-fade-in-up border border-white/20">
        <div className="animate-slide-in">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Chào mừng!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Đăng nhập để tiếp tục
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none input-focus"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none input-focus"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-transform group-hover:scale-110"
              />
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-all">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6 animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Hoặc</span>
          </div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center animate-slide-in" style={{animationDelay: '0.3s'}}>
          <LoginButton />
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600 animate-slide-in" style={{animationDelay: '0.4s'}}>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
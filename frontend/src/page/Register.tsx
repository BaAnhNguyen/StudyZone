import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';

const RegisterPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosConfig.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setSuccess(response.data.message || 'Đăng ký thành công!');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Đăng ký thất bại');
      } else {
        setError('Đăng ký thất bại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Đăng ký
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Tạo tài khoản mới
        </p>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

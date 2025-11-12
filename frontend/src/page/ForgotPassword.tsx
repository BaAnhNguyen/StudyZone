import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosConfig from '../api/axiosConfig';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axiosConfig.post('/auth/reset-password-by-email', {
        email,
        newPassword,
      });

      if (res.data.success) {
        setMessage('✅ Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
        
        // Chuyển đến trang login sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Đặt lại mật khẩu
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Nhập email và mật khẩu mới của bạn
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu mới"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

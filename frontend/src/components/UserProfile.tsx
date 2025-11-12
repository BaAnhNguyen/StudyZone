import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from './ConfirmModal';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        <img
          src={user.avatar || 'https://via.placeholder.com/40'}
          alt={user.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <button
          onClick={handleLogoutClick}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Đăng xuất
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default UserProfile;
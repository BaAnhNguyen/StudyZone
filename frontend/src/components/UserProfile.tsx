import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
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
        onClick={logout}
        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default UserProfile;
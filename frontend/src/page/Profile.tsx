import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axiosConfig';
import type { ProfileData } from '../types/profile';

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    phone: '',
    avatar: '',
    email: ''
  });
  
  const [editData, setEditData] = useState<ProfileData>({
    name: '',
    phone: '',
    avatar: '',
    email: ''
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) {
        console.log('❌ No user ID found');
        setLoading(false);
        return;
      }
      
      console.log('🔄 Fetching profile for user:', user._id);
      
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/view-profile/${user._id}`);
        
        console.log('✅ Profile response:', response.data);
        
        if (response.data.success) {
          const data = response.data.data;
          const newProfileData = {
            email: data.email || user.email || '',
            name: data.name || '',
            phone: data.phone || '',
            avatar: data.avatar || ''
          };
          
          console.log('📝 Setting profile data:', newProfileData);
          
          setProfileData(newProfileData);
          setEditData(newProfileData);
        }
      } catch (err) {
        console.error('❌ Fetch profile error:', err);
        
        const error = err as { response?: { data?: { message?: string }; status?: number } };
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.message || 'Không thể tải thông tin profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  // Handle update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) {
      setError('Không tìm thấy thông tin người dùng');
      return;
    }
    
    // Validation
    if (!editData.name.trim()) {
      setError('Tên không được để trống');
      return;
    }
    
    if (editData.phone && !/^[0-9]{10,11}$/.test(editData.phone)) {
      setError('Số điện thoại không hợp lệ (10-11 số)');
      return;
    }

    // Check if data changed
    const hasChanges = 
      editData.name !== profileData.name ||
      editData.phone !== profileData.phone ||
      editData.avatar !== profileData.avatar;

    if (!hasChanges) {
      setError('');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      // Chỉ gửi những field mà backend chấp nhận
      const updatePayload = {
        name: editData.name,
        phone: editData.phone,
        avatar: editData.avatar
      };
      
      console.log('🔄 Updating profile with:', updatePayload);
      
      const response = await axiosInstance.patch(
        `/user/update-profile/${user._id}`, 
        updatePayload
      );
      
      console.log('✅ Update response:', response.data);
      
      if (response.data.success) {
        // Update local state với data mới
        const updatedProfile = {
          ...editData,
          email: profileData.email // Giữ nguyên email
        };
        
        setProfileData(updatedProfile);
        setEditData(updatedProfile);
        setSuccess('Cập nhật profile thành công!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật profile';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Debug info - Remove in production
  console.log('🔍 Current state:', {
    user: user?._id,
    authLoading,
    loading,
    profileData,
    editData,
    isEditing
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <p className="text-xl text-gray-700">Vui lòng đăng nhập</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hồ Sơ Cá Nhân
          </h1>
          <p className="text-gray-600">Xem và cập nhật thông tin của bạn</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-32 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={editData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&size=128&background=random`}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&size=128&background=random`;
                  }}
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">Nhập URL</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-20 pb-8 px-8">
            {/* Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên hiển thị
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    isEditing 
                      ? 'border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                      : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    isEditing 
                      ? 'border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                      : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="0123456789"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={editData.avatar}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg transition-all ${
                    isEditing 
                      ? 'border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200' 
                      : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Để trống để sử dụng avatar mặc định
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Chỉnh sửa thông tin
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang lưu...
                        </span>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Vai trò:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">
                    {user.role || 'User'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className="ml-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 mr-1 bg-green-400 rounded-full"></span>
                      Hoạt động
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
          >
            ← Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
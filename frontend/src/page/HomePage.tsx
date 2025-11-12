import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/ConfirmModal';

const HomePage : React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SZ</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Study zone</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600">Giới thiệu</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Chương trình học</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Đề thi online</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Flashcards</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Blog</a>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-full">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full border-2 border-blue-600"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogoutClick}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </header>

      {/* ...existing code... */}
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="relative w-96 h-96 mx-auto">
              {/* Circle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-blue-100 rounded-full"></div>
              
              {/* Student Image Placeholder */}
              <div className="absolute inset-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src="/student-learning.jpg" 
                  alt="Student" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-gray-400 text-center"><svg class="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg><p>Student Learning</p></div>';
                  }}
                />
              </div>

              {/* Chat bubble */}
              <div className="absolute top-20 -left-4 bg-white rounded-2xl px-4 py-2 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>

              {/* Light bulb icon */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl px-6 py-3 inline-block shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SZ</span>
                </div>
                <span className="text-xl font-bold text-gray-800">Study zone</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              PHẦN MỀM LUYỆN THI<br />
              & KHÓA HỌC ONLINE
            </h1>

            {/* Speech bubble */}
            <div className="bg-white rounded-3xl px-6 py-3 inline-block shadow-lg ml-auto">
              <p className="text-lg font-semibold text-gray-700">
                Học thử<br />
                <span className="text-blue-600">miễn phí ngay!</span>
              </p>
            </div>

            {/* Course Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                TIẾNG<br />ANH
              </div>
              <div className="bg-gradient-to-r from-red-400 to-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                HÓA
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                TOÁN
              </div>
              <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                LÝ
              </div>
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg transform hover:scale-105 transition-transform">
                VĂN
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-semibold">• Luyện các kĩ năng thực chiến</span><br />
                  <span className="ml-4">& Luyện đề thi</span>
                </p>
                <p className="text-gray-700 font-semibold">
                  • Giao diện học + luyện thi như thi thật
                </p>
                <p className="text-gray-700 font-semibold">
                  • Nhiều tài liệu thi từ các trường
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 font-semibold">
                  • Chấm chữa AI có kết quả ngay
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">• Nhiều công cụ hỗ trợ học tập</span><br />
                  <span className="ml-4 text-sm italic">(highlight, take note, flashcards,...)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Courses Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Khóa học nổi bật
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* TOEIC L&R Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-bold text-gray-700">Study zone</span>
            </div>
            <h3 className="text-3xl font-bold mb-2">
              <span className="text-blue-600">TOÁN</span>
            </h3>
            <p className="text-xl font-bold text-gray-700 mb-4">
              TÍCH PHÂN, ĐẠO HÀM
            </p>
            <div className="bg-orange-500 text-white px-4 py-2 rounded-lg inline-block text-sm font-semibold">
              Từ cơ bản đến nâng cao
            </div>
            <div className="mt-4 text-gray-400 text-6xl">📚</div>
          </div>

          {/* IELTS Fundamentals Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-bold text-gray-700">Study zone</span>
            </div>
            <h3 className="text-3xl font-bold mb-2 text-red-500">
              IELTS
            </h3>
            <p className="text-xl font-bold text-gray-700 mb-4">
              FUNDAMENTALS
            </p>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block text-sm font-semibold">
              Grammar & Vocabulary for IELTS
            </div>
            <div className="mt-4 text-gray-400 text-6xl">📖</div>
          </div>

          {/* IELTS Intensive Listening Card */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="font-bold text-gray-700">Study zone</span>
            </div>
            <h3 className="text-3xl font-bold mb-2 text-red-500">
              IELTS
            </h3>
            <p className="text-xl font-bold text-gray-700 mb-4">
              INTENSIVE LISTENING
            </p>
            <div className="bg-purple-500 text-white px-4 py-2 rounded-lg inline-block text-sm font-semibold">
              Detailed Walkthrough & Dictation
            </div>
            <div className="mt-4 text-gray-400 text-6xl">🎧</div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default HomePage;
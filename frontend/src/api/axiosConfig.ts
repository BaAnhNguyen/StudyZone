import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // QUAN TRỌNG: Để gửi cookies/session
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để tự động thêm JWT token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('accessToken');
      
      // Chỉ redirect nếu đang ở trang cần authentication
      const publicPaths = ['/', '/login', '/register', '/forgot-password'];
      const currentPath = window.location.pathname;
      
      if (!publicPaths.includes(currentPath) && !publicPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
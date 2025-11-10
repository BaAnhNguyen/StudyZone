import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // QUAN TRỌNG: Để gửi cookies/session
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
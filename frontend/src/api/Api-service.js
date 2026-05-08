import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// Request interceptor — attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 auto-logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalid/expired — clear auth
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default API;

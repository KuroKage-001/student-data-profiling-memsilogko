import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with optimized configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout (increased for slow bcrypt hashing)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enable connection pooling for better performance
  maxRedirects: 5,
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if response indicates failure even with 2xx status
    if (response.data && response.data.success === false) {
      // Return response as-is, let the service handle it
      return response;
    }
    return response;
  },
  async (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network error - no response from server:', error.message);
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth-cleared'));
    }

    // Return the error so the service can handle it
    return Promise.reject(error);
  }
);

export default axiosInstance;

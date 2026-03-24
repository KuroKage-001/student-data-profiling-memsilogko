const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Clear authentication data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Trigger a custom event to notify AuthContext
  window.dispatchEvent(new CustomEvent('auth-cleared'));
};

// Create headers with authentication
const createHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// API request wrapper with enhanced error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: createHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - token is invalid or expired
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Authentication failed. Please login again.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: Request failed`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
    
  me: () => apiRequest('/auth/me'),
  
  refresh: () => 
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),
};

// Generic API methods
export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint, data) => apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (endpoint) => apiRequest(endpoint, {
    method: 'DELETE',
  }),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/events/${id}`),
  create: (data) => apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/events/${id}`, {
    method: 'DELETE',
  }),
  getStatistics: () => apiRequest('/events-statistics'),
};

export default api;
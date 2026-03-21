import axiosInstance from './axiosConfig';

class AuthService {
  // Login with optimized request
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      if (response.data.success && response.data.access_token) {
        // Store token and user data
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return {
          success: true,
          data: response.data,
          user: response.data.user,
          token: response.data.access_token,
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle axios errors with response
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 401) {
          return { success: false, message: 'Invalid email or password' };
        } else if (status === 422) {
          return { success: false, message: message || 'Validation error' };
        } else if (status === 429) {
          return { success: false, message: 'Too many attempts. Please try again later.' };
        } else if (status >= 500) {
          return { success: false, message: 'Server error. Please try again later.' };
        }
        
        return {
          success: false,
          message: message || `Error: ${status}`,
        };
      }
      
      // Handle network errors (no response)
      if (error.request) {
        console.error('No response received:', error.request);
        return {
          success: false,
          message: 'Unable to connect to server. Please check if the backend is running.',
        };
      }
      
      // Handle other errors
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  // Logout
  async logout() {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth-cleared'));
    }
  }

  // Get current user
  async me() {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refresh() {
    try {
      const response = await axiosInstance.post('/auth/refresh');
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        return {
          success: true,
          token: response.data.access_token,
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored user
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();

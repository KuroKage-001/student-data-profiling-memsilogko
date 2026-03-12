import { authAPI } from '../../utils/system-utils/apiService';

class LoginService {
  async authenticate(credentials) {
    try {
      const response = await authAPI.login(credentials);
      
      if (response && response.success) {
        // Store token if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        return {
          success: true,
          data: response,
          message: 'Login successful'
        };
      } else {
        return {
          success: false,
          message: response?.message || 'Invalid credentials'
        };
      }
    } catch (error) {
      console.error('Login service error:', error);
      
      if (error.message.includes('Authentication failed')) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      } else if (error.message.includes('429')) {
        return {
          success: false,
          message: 'Too many login attempts. Please try again later.'
        };
      } else {
        return {
          success: false,
          message: error.message || 'Network error. Please check your connection and try again.'
        };
      }
    }
  }

  async logout() {
    try {
      await authAPI.logout();
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      console.error('Logout service error:', error);
      // Even if logout fails on server, clear local token
      localStorage.removeItem('authToken');
      return { success: true };
    }
  }

  async refreshToken() {
    try {
      const response = await authAPI.refresh();
      
      if (response?.token) {
        localStorage.setItem('authToken', response.token);
        return {
          success: true,
          token: response.token
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false };
    }
  }

  getStoredToken() {
    return localStorage.getItem('authToken');
  }

  isTokenValid() {
    const token = this.getStoredToken();
    if (!token) return false;

    try {
      // Basic token validation (you might want to add JWT decode here)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const loginService = new LoginService();
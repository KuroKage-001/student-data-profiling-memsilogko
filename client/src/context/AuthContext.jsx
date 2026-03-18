import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/system-service/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Validate token and user session
  const validateSession = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      setLoading(false);
      return;
    }

    try {
      // Verify token is still valid by calling the /me endpoint
      const response = await authAPI.me();
      if (response.success && response.user) {
        setUser(response.user);
        // Update stored user data in case it changed
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        clearAuthData();
      }
    } catch (error) {
      // Token is invalid or expired
      console.warn('Session validation failed:', error.message);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateSession();

    // Listen for auth-cleared events from API service
    const handleAuthCleared = () => {
      setUser(null);
    };

    window.addEventListener('auth-cleared', handleAuthCleared);
    
    return () => {
      window.removeEventListener('auth-cleared', handleAuthCleared);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      
      if (data.success) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      }
      
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await authAPI.logout();
    } catch (error) {
      // Even if server logout fails, we still clear local data
      console.error('Server logout error:', error);
    } finally {
      // Always clear local authentication data
      clearAuthData();
    }
  };

  // Check if user is authenticated and token is valid
  const checkAuthStatus = async () => {
    if (!user) return false;
    
    try {
      const response = await authAPI.me();
      return response.success && response.user;
    } catch (error) {
      // Token is invalid, clear auth data
      clearAuthData();
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    checkAuthStatus,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
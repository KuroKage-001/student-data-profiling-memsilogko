import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/login-service/authService';

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

  // Validate token and user session - optimized
  const validateSession = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      setLoading(false);
      return;
    }

    // Load user from localStorage immediately for faster initial render
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Then validate in background
    try {
      const response = await authService.me();
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.warn('Session validation failed:', error.message);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateSession();

    // Listen for auth-cleared events
    const handleAuthCleared = () => {
      setUser(null);
    };

    window.addEventListener('auth-cleared', handleAuthCleared);
    
    return () => {
      window.removeEventListener('auth-cleared', handleAuthCleared);
    };
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Server logout error:', error);
    } finally {
      clearAuthData();
    }
  };

  const value = {
    user,
    setUser,
    logout,
    loading,
    isAuthenticated: !!user,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
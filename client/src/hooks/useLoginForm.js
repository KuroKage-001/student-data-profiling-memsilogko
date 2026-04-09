import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useToast from './useToast';
import { authService } from '../services/login-service/authService';
import { validateLoginCredentials } from '../utils/system-utils/login-utils/loginValidation';

export const useLoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  // Determine portal type based on current route
  const portalType = location.pathname === '/admin/login' ? 'admin' : 'student';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate credentials
    const validation = validateLoginCredentials(credentials);
    if (!validation.isValid) {
      showError(validation.message);
      return;
    }

    setIsLoading(true);
    
    try {
      // Include portal type in login request
      const result = await authService.login({
        ...credentials,
        portal_type: portalType
      });
      
      if (result.success) {
        // Update auth context with user data
        setUser(result.user);
        showSuccess('Login Successful...');
        
        // Role-based navigation
        const userRole = result.user?.role;
        
        if (userRole === 'admin' || userRole === 'dept_chair') {
          navigate('/admin/dashboard');
        } else if (userRole === 'faculty') {
          navigate('/admin/dashboard'); // Faculty can access dashboard
        } else if (userRole === 'student') {
          navigate('/profile/settings'); // Students go to their profile
        } else {
          // Default fallback
          navigate('/');
        }
      } else {
        // Handle portal mismatch errors with specific messaging
        if (result.portal_mismatch) {
          showError(result.message);
        } else {
          showError(result.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      showError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    credentials,
    isLoading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility
  };
};
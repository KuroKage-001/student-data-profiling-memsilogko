import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();

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
      const result = await authService.login(credentials);
      
      if (result.success) {
        // Update auth context with user data
        setUser(result.user);
        showSuccess('Login Successful...');
        
        // Navigate immediately for better UX
        navigate('/admin/dashboard');
      } else {
        showError(result.message || 'Login failed. Please check your credentials.');
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
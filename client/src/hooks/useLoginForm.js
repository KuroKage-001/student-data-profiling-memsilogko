import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useToast from './useToast';
import { loginService } from '../services/login-service/loginService';
import { validateLoginCredentials } from '../utils/system-utils/login-utils/loginValidation';

export const useLoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
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
      const result = await loginService.authenticate(credentials);
      
      if (result.success) {
        await login(credentials);
        showSuccess('Login Successful...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
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
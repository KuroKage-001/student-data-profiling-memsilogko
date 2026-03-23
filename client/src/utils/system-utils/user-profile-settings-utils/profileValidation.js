/**
 * Validate profile form data
 */
export const validateProfileForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (/\d/.test(formData.name)) {
    errors.name = 'Name must not contain numbers';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (formData.name.trim().length > 255) {
    errors.name = 'Name must not exceed 255 characters';
  }

  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate password change form data
 */
export const validatePasswordForm = (formData) => {
  const errors = {};

  // Current password validation
  if (!formData.current_password || formData.current_password.trim() === '') {
    errors.current_password = 'Current password is required';
  }

  // New password validation
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'New password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])/.test(formData.password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/(?=.*[A-Z])/.test(formData.password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/(?=.*\d)/.test(formData.password)) {
    errors.password = 'Password must contain at least one number';
  } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
    errors.password = 'Password must contain at least one special character (@$!%*?&)';
  }

  // Confirm password validation
  if (!formData.password_confirmation || formData.password_confirmation.trim() === '') {
    errors.password_confirmation = 'Please confirm your password';
  } else if (formData.password !== formData.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match';
  }

  // Check if new password is same as current
  if (formData.current_password && formData.password && 
      formData.current_password === formData.password) {
    errors.password = 'New password must be different from current password';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Get password strength
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };

  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[@$!%*?&]/.test(password)) strength += 1;

  // Determine label and color
  if (strength <= 2) {
    return { strength, label: 'Weak', color: 'red' };
  } else if (strength <= 4) {
    return { strength, label: 'Medium', color: 'yellow' };
  } else {
    return { strength, label: 'Strong', color: 'green' };
  }
};

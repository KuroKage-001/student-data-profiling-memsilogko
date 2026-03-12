export const validateLoginCredentials = (credentials) => {
  const { email, password } = credentials;

  // Email validation
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      message: 'Email address is required'
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address'
    };
  }

  // Password validation
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }

  return {
    isValid: true,
    message: 'Credentials are valid'
  };
};

export const sanitizeCredentials = (credentials) => {
  return {
    email: credentials.email?.trim().toLowerCase() || '',
    password: credentials.password || ''
  };
};

export const formatLoginError = (error) => {
  const commonErrors = {
    'INVALID_CREDENTIALS': 'Invalid email or password',
    'ACCOUNT_LOCKED': 'Account has been temporarily locked due to multiple failed attempts',
    'ACCOUNT_DISABLED': 'Account has been disabled. Please contact administrator',
    'EMAIL_NOT_VERIFIED': 'Please verify your email address before logging in',
    'NETWORK_ERROR': 'Network connection error. Please check your internet connection',
    'SERVER_ERROR': 'Server error. Please try again later'
  };

  return commonErrors[error] || 'An unexpected error occurred. Please try again';
};
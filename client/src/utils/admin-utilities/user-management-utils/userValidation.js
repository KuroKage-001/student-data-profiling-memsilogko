/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate user form data
 */
export const validateUserForm = (formData, isEdit = false) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (formData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (formData.name.length > 255) {
    errors.name = 'Name must not exceed 255 characters';
  }

  // Email validation
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  } else if (formData.email.length > 255) {
    errors.email = 'Email must not exceed 255 characters';
  }

  // Password validation (only required for new users)
  if (!isEdit) {
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.message;
      }
    }
  } else if (formData.password && formData.password.trim() !== '') {
    // If editing and password is provided, validate it
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.message;
    }
  }

  // Role validation
  if (!formData.role) {
    errors.role = 'Role is required';
  } else if (!['admin', 'faculty', 'student', 'dept_chair'].includes(formData.role)) {
    errors.role = 'Invalid role selected';
  }

  // Department validation - required for student, dept_chair, faculty, and admin
  if (['student', 'dept_chair', 'faculty', 'admin'].includes(formData.role)) {
    if (!formData.department || formData.department.trim() === '') {
      errors.department = 'Department is required for this role';
    } else if (!['IT', 'CS'].includes(formData.department)) {
      errors.department = 'Department must be either IT or CS';
    }
  }

  // Position validation - required for faculty, admin, and dept_chair
  if (['faculty', 'admin', 'dept_chair'].includes(formData.role)) {
    if (!formData.position || formData.position.trim() === '') {
      errors.position = 'Position is required for this role';
    } else if (formData.position.length > 100) {
      errors.position = 'Position must not exceed 100 characters';
    }
  }

  // Student number validation - optional for student role (will be auto-generated if not provided)
  if (formData.role === 'student' && formData.student_number && formData.student_number.trim() !== '') {
    if (formData.student_number.length > 50) {
      errors.student_number = 'Student number must not exceed 50 characters';
    }
  }

  // Status validation
  if (formData.status && !['active', 'inactive', 'suspended'].includes(formData.status)) {
    errors.status = 'Invalid status selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate faculty data
export const validateFacultyData = (facultyData) => {
  const errors = {};

  // Name validation
  if (!facultyData.name?.trim()) {
    errors.name = 'Name is required';
  } else if (facultyData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!facultyData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(facultyData.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone validation (optional but format check if provided)
  if (facultyData.phone && facultyData.phone.trim()) {
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(facultyData.phone)) {
      errors.phone = 'Invalid phone number format';
    }
  }

  // Department validation
  if (!facultyData.department?.trim()) {
    errors.department = 'Department is required';
  }

  // Position validation
  if (!facultyData.position?.trim()) {
    errors.position = 'Position is required';
  }

  // Hire date validation
  if (facultyData.hire_date || facultyData.hireDate) {
    const hireDate = new Date(facultyData.hire_date || facultyData.hireDate);
    const today = new Date();
    
    if (isNaN(hireDate.getTime())) {
      errors.hire_date = 'Invalid hire date';
    } else if (hireDate > today) {
      errors.hire_date = 'Hire date cannot be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate email format
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate phone format
export const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  return /^[\d\s\-\(\)\+]+$/.test(phone);
};

// Validate required fields
export const hasRequiredFields = (facultyData) => {
  const requiredFields = ['name', 'email', 'department', 'position'];
  return requiredFields.every(field => facultyData[field]?.trim());
};

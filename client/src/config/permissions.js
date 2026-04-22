// Role-Based Permissions Configuration
// MVP: Simple permission checks for CRUD operations

export const PERMISSIONS = {
  // Dashboard
  dashboard: {
    view: ['admin', 'dept_chair', 'faculty', 'student'],
  },

  // User Management
  users: {
    view: ['admin'],
    create: ['admin'],
    edit: ['admin'],
    delete: ['admin'],
  },

  // Student Profiles
  students: {
    view: ['admin', 'faculty'],
    create: ['admin', 'faculty'],
    edit: ['admin', 'faculty'],
    delete: ['admin'],
  },

  // Faculty Profiles
  faculty: {
    view: ['admin', 'dept_chair'],
    create: ['admin'],
    edit: ['admin', 'dept_chair'],
    delete: ['admin'],
  },

  // Events
  events: {
    view: ['admin', 'faculty', 'student'],
    create: ['admin', 'faculty'],
    edit: ['admin', 'faculty'],
    delete: ['admin', 'faculty'],
  },

  // Scheduling
  scheduling: {
    view: ['admin', 'dept_chair', 'faculty', 'student'],
    create: ['admin', 'dept_chair', 'faculty'],
    edit: ['admin', 'dept_chair', 'faculty'],
    delete: ['admin', 'dept_chair'],
  },

  // Research Materials
  research: {
    view: ['admin', 'faculty', 'student'],
    create: ['admin', 'faculty'],
    edit: ['admin', 'faculty'],
    delete: ['admin', 'faculty'],
  },

  // Instructions
  instructions: {
    view: ['admin', 'dept_chair', 'faculty', 'student'],
    create: ['admin'],
    edit: ['admin'],
    delete: ['admin'],
  },
};

/**
 * Check if user has permission for an action on a module
 * @param {string} userRole - User's role (admin, faculty, student, dept_chair)
 * @param {string} module - Module name (users, students, events, etc.)
 * @param {string} action - Action type (view, create, edit, delete)
 * @returns {boolean}
 */
export const hasPermission = (userRole, module, action) => {
  if (!userRole || !module || !action) return false;
  
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  
  const allowedRoles = modulePermissions[action];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
};

/**
 * Check if user can perform any action on a module
 * @param {string} userRole - User's role
 * @param {string} module - Module name
 * @returns {boolean}
 */
export const canAccessModule = (userRole, module) => {
  if (!userRole || !module) return false;
  
  const modulePermissions = PERMISSIONS[module];
  if (!modulePermissions) return false;
  
  // Check if user has at least view permission
  return hasPermission(userRole, module, 'view');
};

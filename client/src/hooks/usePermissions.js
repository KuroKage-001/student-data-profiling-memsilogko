import { useAuth } from '../context/AuthContext';
import { hasPermission, canAccessModule } from '../config/permissions';

/**
 * Custom hook for role-based permissions
 * MVP: Simple permission checks
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.role;

  /**
   * Check if user can view a module
   */
  const canView = (module) => {
    return hasPermission(userRole, module, 'view');
  };

  /**
   * Check if user can create in a module
   */
  const canCreate = (module) => {
    return hasPermission(userRole, module, 'create');
  };

  /**
   * Check if user can edit in a module
   */
  const canEdit = (module) => {
    return hasPermission(userRole, module, 'edit');
  };

  /**
   * Check if user can delete in a module
   */
  const canDelete = (module) => {
    return hasPermission(userRole, module, 'delete');
  };

  /**
   * Check if user can access a module at all
   */
  const canAccess = (module) => {
    return canAccessModule(userRole, module);
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    return userRole === 'admin';
  };

  /**
   * Check if user is faculty
   */
  const isFaculty = () => {
    return userRole === 'faculty';
  };

  /**
   * Check if user is student
   */
  const isStudent = () => {
    return userRole === 'student';
  };

  /**
   * Check if user is department chair
   */
  const isDeptChair = () => {
    return userRole === 'dept_chair';
  };

  return {
    canView,
    canCreate,
    canEdit,
    canDelete,
    canAccess,
    isAdmin,
    isFaculty,
    isStudent,
    isDeptChair,
    userRole,
  };
};

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasRouteAccess } from '../config/routeConfig';
import LoadingPage from '../components/system-components/LoadingPage';

/**
 * Unified Route Guard Component
 * 
 * Supports two modes:
 * 1. Dynamic Mode (with route prop): Full role-based access control
 * 2. Simple Mode (without route prop): Basic authentication check (legacy ProtectedRoute behavior)
 * 
 * This consolidates both DynamicRouteGuard and ProtectedRoute functionality
 */
const DynamicRouteGuard = ({ children, route }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingPage message="Verifying access..." subMessage="Please wait..." />;
  }

  // Simple Mode: Basic authentication check (legacy ProtectedRoute behavior)
  // Used when no route prop is provided
  if (!route) {
    return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
  }

  // Dynamic Mode: Full role-based access control
  // Public routes - allow access
  if (route.isPublic) {
    return children;
  }

  // Protected routes - check authentication
  if (route.requiresAuth && !isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  const userRole = user?.role || user?.user_type;
  const hasAccess = hasRouteAccess(route.path, userRole);

  if (!hasAccess) {
    // Redirect to dashboard or home based on authentication
    const redirectTo = isAuthenticated ? '/admin/dashboard' : '/admin/login';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Legacy export alias for backward compatibility
export const ProtectedRoute = DynamicRouteGuard;

export default DynamicRouteGuard;

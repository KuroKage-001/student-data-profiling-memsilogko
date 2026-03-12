import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    // Validate authentication status when component mounts
    // This helps catch cases where user navigates back after logout
    const validateAuth = async () => {
      if (isAuthenticated && !loading) {
        setValidating(true);
        try {
          await checkAuthStatus();
        } catch (error) {
          console.warn('Auth validation failed:', error);
        } finally {
          setValidating(false);
        }
      }
    };

    validateAuth();
  }, [isAuthenticated, loading, checkAuthStatus]);

  if (loading || validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
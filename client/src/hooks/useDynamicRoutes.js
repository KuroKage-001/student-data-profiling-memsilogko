import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { routeConfig, getRoutesByRole } from '../config/routeConfig';

/**
 * Custom hook for dynamic route management
 * Filters routes based on user authentication and role
 * Can be extended to fetch routes from API
 */
export const useDynamicRoutes = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user role
  const userRole = useMemo(() => {
    if (!user) return null;
    return user.role || user.user_type || null;
  }, [user]);

  useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      
      try {
        // Option 1: Use local configuration (current implementation)
        const filteredRoutes = getRoutesByRole(userRole);
        setRoutes(filteredRoutes);

        // Option 2: Fetch from API (uncomment to enable)
        // const apiRoutes = await fetchRoutesFromAPI(userRole);
        // setRoutes(apiRoutes);
        
      } catch (error) {
        console.error('Error loading routes:', error);
        // Fallback to public routes only
        setRoutes(routeConfig.filter(route => route.isPublic));
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadRoutes();
    }
  }, [userRole, authLoading]);

  return {
    routes,
    loading: loading || authLoading,
    userRole,
    isAuthenticated,
  };
};

/**
 * Optional: Fetch routes from API
 * Uncomment and implement if you want to store routes in database
 */
// const fetchRoutesFromAPI = async (userRole) => {
//   try {
//     const response = await fetch(`/api/routes?role=${userRole}`);
//     const data = await response.json();
//     return data.routes;
//   } catch (error) {
//     console.error('Failed to fetch routes from API:', error);
//     throw error;
//   }
// };

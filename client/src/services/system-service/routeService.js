import api from '../api';

/**
 * Route Service
 * Handles API calls for dynamic route management
 */
export const routeService = {
  /**
   * Fetch available routes from API based on user role
   */
  async getRoutes() {
    try {
      const response = await api.get('/routes');
      return {
        success: true,
        routes: response.data.routes,
        role: response.data.role,
      };
    } catch (error) {
      console.error('Error fetching routes:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch routes',
      };
    }
  },

  /**
   * Check if user has access to a specific route
   */
  async checkAccess(path) {
    try {
      const response = await api.post('/routes/check-access', { path });
      return {
        success: true,
        hasAccess: response.data.hasAccess,
        role: response.data.role,
      };
    } catch (error) {
      console.error('Error checking route access:', error);
      return {
        success: false,
        hasAccess: false,
        error: error.response?.data?.message || 'Failed to check access',
      };
    }
  },
};

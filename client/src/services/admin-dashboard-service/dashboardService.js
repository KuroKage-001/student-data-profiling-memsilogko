import axiosInstance from '../login-service/axiosConfig';

class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get('/students-statistics');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  }
}

export const dashboardService = new DashboardService();

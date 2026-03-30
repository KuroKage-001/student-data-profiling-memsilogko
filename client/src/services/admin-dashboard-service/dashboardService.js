import axiosInstance from '../login-service/axiosConfig';

class DashboardService {
  /**
   * Get dashboard statistics (students and faculty combined)
   */
  async getDashboardStats() {
    try {
      // Fetch both student and faculty statistics in parallel
      const [studentsResponse, facultyResponse] = await Promise.all([
        axiosInstance.get('/students-statistics'),
        axiosInstance.get('/faculty-statistics')
      ]);

      return {
        success: true,
        data: {
          students: studentsResponse.data.data,
          faculty: facultyResponse.data.data
        }
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

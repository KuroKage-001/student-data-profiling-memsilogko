import axiosInstance from '../login-service/axiosConfig';

class StudentDashboardService {
  /**
   * Get student dashboard statistics
   */
  async getStudentDashboardStats() {
    try {
      const response = await axiosInstance.get('/student/dashboard-stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get student dashboard stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  }

  /**
   * Get student profile summary
   */
  async getStudentProfile() {
    try {
      const response = await axiosInstance.get('/student/profile');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get student profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student profile'
      };
    }
  }

  /**
   * Get student academic records
   */
  async getAcademicRecords() {
    try {
      const response = await axiosInstance.get('/student/academic-records');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get academic records error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch academic records'
      };
    }
  }

  /**
   * Get student upcoming events
   */
  async getUpcomingEvents() {
    try {
      const response = await axiosInstance.get('/student/upcoming-events');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get upcoming events error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch upcoming events'
      };
    }
  }
}

export const studentDashboardService = new StudentDashboardService();

import api from './system-service/apiService';

const studentScheduleService = {
  // Get student's enrolled schedules
  getMySchedules: async () => {
    try {
      const response = await api.get('/student/schedules');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching student schedules:', error);
      throw error;
    }
  },

  // Get available classes for enrollment
  getAvailableClasses: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/student/available-classes${queryString ? `?${queryString}` : ''}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching available classes:', error);
      throw error;
    }
  },

  // Get schedule statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/student/schedule-statistics');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching schedule statistics:', error);
      throw error;
    }
  },

  // Enroll in a class
  enroll: async (classSectionId) => {
    try {
      const response = await api.post('/student/enroll', { class_section_id: classSectionId });
      return response;
    } catch (error) {
      console.error('Error enrolling in class:', error);
      throw error;
    }
  },

  // Drop a class
  drop: async (enrollmentId) => {
    try {
      const response = await api.delete(`/student/enrollments/${enrollmentId}`);
      return response;
    } catch (error) {
      console.error('Error dropping class:', error);
      throw error;
    }
  },
};

export default studentScheduleService;

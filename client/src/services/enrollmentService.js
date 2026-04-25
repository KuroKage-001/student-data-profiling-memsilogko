import api from './system-service/apiService';

const enrollmentService = {
  // Get all enrollments for a class section
  getClassEnrollments: async (classSectionId) => {
    try {
      const response = await api.get(`/class-sections/${classSectionId}/enrollments`);
      // response is {success: true, data: [...]}
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get eligible students for enrollment (filtered by program)
  getEligibleStudents: async (classSectionId, program) => {
    try {
      const params = new URLSearchParams();
      if (classSectionId) params.append('class_section_id', classSectionId);
      if (program) params.append('program', program);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/eligible-students?${queryString}` : '/eligible-students';
      
      const response = await api.get(endpoint);
      // response is {success: true, data: [...]}
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Enroll a student in a class section (Admin/Dept Chair)
  enrollStudent: async (data) => {
    try {
      const response = await api.post('/enrollments', data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Drop a student from a class section (Admin/Dept Chair)
  dropStudent: async (enrollmentId) => {
    try {
      const response = await api.delete(`/enrollments/${enrollmentId}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Faculty enroll a student (only in their assigned classes)
  facultyEnrollStudent: async (data) => {
    try {
      const response = await api.post('/faculty-enrollments', data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Faculty drop a student (only from their assigned classes)
  facultyDropStudent: async (enrollmentId) => {
    try {
      const response = await api.delete(`/faculty-enrollments/${enrollmentId}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default enrollmentService;

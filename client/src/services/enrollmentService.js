import api from './system-service/apiService';

const enrollmentService = {
  // Get all enrollments for a class section
  getClassEnrollments: async (classSectionId) => {
    try {
      const response = await api.get(`/class-sections/${classSectionId}/enrollments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get eligible students for enrollment (filtered by program)
  getEligibleStudents: async (classSectionId, program) => {
    try {
      const params = {};
      if (classSectionId) params.class_section_id = classSectionId;
      if (program) params.program = program;
      
      const response = await api.get('/eligible-students', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Enroll a student in a class section (Admin/Dept Chair)
  enrollStudent: async (data) => {
    try {
      const response = await api.post('/enrollments', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Drop a student from a class section (Admin/Dept Chair)
  dropStudent: async (enrollmentId) => {
    try {
      const response = await api.delete(`/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Faculty enroll a student (only in their assigned classes)
  facultyEnrollStudent: async (data) => {
    try {
      const response = await api.post('/faculty-enrollments', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Faculty drop a student (only from their assigned classes)
  facultyDropStudent: async (enrollmentId) => {
    try {
      const response = await api.delete(`/faculty-enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default enrollmentService;

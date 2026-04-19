import api from './system-service/apiService';

const classSectionService = {
  // Get all class sections
  getAllSections: async (params = {}) => {
    try {
      const response = await api.get('/class-sections', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get a single class section
  getById: async (id) => {
    try {
      const response = await api.get(`/class-sections/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new class section
  createSection: async (data) => {
    try {
      const response = await api.post('/class-sections', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update a class section
  updateSection: async (id, data) => {
    try {
      const response = await api.put(`/class-sections/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a class section
  deleteSection: async (id) => {
    try {
      const response = await api.delete(`/class-sections/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get statistics
  getStatistics: async (params = {}) => {
    try {
      const response = await api.get('/class-sections-statistics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign faculty to class
  assignFaculty: async (data) => {
    try {
      const response = await api.post('/faculty-assignments', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Unassign faculty from class
  unassignFaculty: async (assignmentId) => {
    try {
      const response = await api.delete(`/faculty-assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get faculty classes
  getFacultyClasses: async (facultyId) => {
    try {
      const response = await api.get(`/faculty/${facultyId}/classes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get class faculty
  getClassFaculty: async (classSectionId) => {
    try {
      const response = await api.get(`/class-sections/${classSectionId}/faculty`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default classSectionService;

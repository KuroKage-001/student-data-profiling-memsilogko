import axiosInstance from '../login-service/axiosConfig';

const violationsService = {
  getViolations: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}/violations`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch violations' };
    }
  },

  createViolation: async (studentId, data) => {
    try {
      const response = await axiosInstance.post(`/students/${studentId}/violations`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create violation' };
    }
  },

  updateViolation: async (studentId, id, data) => {
    try {
      const response = await axiosInstance.put(`/students/${studentId}/violations/${id}`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update violation' };
    }
  },

  deleteViolation: async (studentId, id) => {
    try {
      const response = await axiosInstance.delete(`/students/${studentId}/violations/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete violation' };
    }
  },
};

export default violationsService;

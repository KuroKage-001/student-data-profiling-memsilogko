import axiosInstance from '../login-service/axiosConfig';

const affiliationsService = {
  getAffiliations: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}/affiliations`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch affiliations' };
    }
  },

  createAffiliation: async (studentId, data) => {
    try {
      const response = await axiosInstance.post(`/students/${studentId}/affiliations`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create affiliation' };
    }
  },

  updateAffiliation: async (studentId, id, data) => {
    try {
      const response = await axiosInstance.put(`/students/${studentId}/affiliations/${id}`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update affiliation' };
    }
  },

  deleteAffiliation: async (studentId, id) => {
    try {
      const response = await axiosInstance.delete(`/students/${studentId}/affiliations/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete affiliation' };
    }
  },
};

export default affiliationsService;

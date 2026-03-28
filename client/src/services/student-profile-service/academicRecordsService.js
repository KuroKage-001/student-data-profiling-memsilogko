import axiosInstance from '../login-service/axiosConfig';

const academicRecordsService = {
  getAcademicRecords: async (studentId) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}/academic-records`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch academic records' };
    }
  },

  createAcademicRecord: async (studentId, data) => {
    try {
      const response = await axiosInstance.post(`/students/${studentId}/academic-records`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to create academic record' };
    }
  },

  updateAcademicRecord: async (studentId, id, data) => {
    try {
      const response = await axiosInstance.put(`/students/${studentId}/academic-records/${id}`, data);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update academic record' };
    }
  },

  deleteAcademicRecord: async (studentId, id) => {
    try {
      const response = await axiosInstance.delete(`/students/${studentId}/academic-records/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete academic record' };
    }
  },
};

export default academicRecordsService;

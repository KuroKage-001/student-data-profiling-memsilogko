import api from './system-service/apiService';

/**
 * Research Materials API Service
 * MVP: Basic CRUD operations
 */
export const researchAPI = {
  /**
   * Get all research materials with optional filters
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/research-materials${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(endpoint);
    // apiRequest returns the parsed JSON directly
    return response;
  },

  /**
   * Get single research material by ID
   */
  getOne: async (id) => {
    const response = await api.get(`/research-materials/${id}`);
    return response.data;
  },

  /**
   * Create new research material
   */
  create: async (data) => {
    const response = await api.post('/research-materials', data);
    return response.data;
  },

  /**
   * Update existing research material
   */
  update: async (id, data) => {
    const response = await api.put(`/research-materials/${id}`, data);
    return response.data;
  },

  /**
   * Delete research material
   */
  delete: async (id) => {
    const response = await api.delete(`/research-materials/${id}`);
    return response.data;
  },
};

export default researchAPI;

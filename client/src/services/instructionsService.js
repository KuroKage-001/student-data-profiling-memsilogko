import api from './system-service/apiService';

/**
 * Instructions API Service
 * MVP: Basic CRUD operations
 */
export const instructionsAPI = {
  /**
   * Get all instructions with optional filters
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/instructions${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(endpoint);
    return response;
  },

  /**
   * Get single instruction by ID
   */
  getOne: async (id) => {
    const response = await api.get(`/instructions/${id}`);
    return response.data;
  },

  /**
   * Create new instruction (Admin only)
   */
  create: async (data) => {
    const response = await api.post('/instructions', data);
    return response.data;
  },

  /**
   * Update existing instruction (Admin only)
   */
  update: async (id, data) => {
    const response = await api.put(`/instructions/${id}`, data);
    return response.data;
  },

  /**
   * Delete instruction (Admin only)
   */
  delete: async (id) => {
    const response = await api.delete(`/instructions/${id}`);
    return response.data;
  },
};

export default instructionsAPI;

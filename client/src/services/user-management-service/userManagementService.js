import axiosInstance from '../login-service/axiosConfig';

class UserManagementService {
  /**
   * Get all users with optional filters
   */
  async getUsers(params = {}) {
    try {
      const response = await axiosInstance.get('/users', { params });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  }

  /**
   * Get a single user by ID
   */
  async getUser(id) {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      const response = await axiosInstance.post('/users', userData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      // Handle validation errors specifically
      if (error.response?.status === 422) {
        const errorMessage = error.response.data?.message || 'Validation failed';
        const validationErrors = error.response.data?.errors || {};
        
        // Create a detailed error message
        const errorDetails = Object.entries(validationErrors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('; ');
        
        throw new Error(`${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`);
      }
      
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id, userData) {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
        errors: error.response?.data?.errors
      };
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id) {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      };
    }
  }

  /**
   * Get user statistics
   */
  async getStatistics() {
    try {
      const response = await axiosInstance.get('/users-statistics');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statistics'
      };
    }
  }
}

export const userManagementService = new UserManagementService();

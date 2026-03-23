import axiosInstance from '../login-service/axiosConfig';

class UserProfileService {
  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      const response = await axiosInstance.get('/profile');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(profileData) {
    try {
      const response = await axiosInstance.put('/profile', profileData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        errors: error.response?.data?.errors
      };
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordData) {
    try {
      const response = await axiosInstance.post('/profile/change-password', passwordData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password',
        errors: error.response?.data?.errors
      };
    }
  }
}

export const userProfileService = new UserProfileService();

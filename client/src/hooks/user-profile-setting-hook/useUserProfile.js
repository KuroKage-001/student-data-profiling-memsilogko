import { useState, useEffect, useCallback } from 'react';
import { userProfileService } from '../../services/user-profile-setting-servive/userProfileService';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userProfileService.getProfile();
      
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userProfileService.updateProfile(profileData);
      
      if (result.success) {
        setProfile(result.data);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (err) {
      const message = 'Failed to update profile';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userProfileService.changePassword(passwordData);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (err) {
      const message = 'Failed to change password';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword
  };
};

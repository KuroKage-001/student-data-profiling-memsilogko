import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { userProfileService } from '../services/user-profile-setting-servive/userProfileService';

/**
 * Query keys factory for user profile settings
 * Provides consistent query keys across the application
 */
export const userProfileKeys = {
  all: ['userProfile'],
  profile: () => [...userProfileKeys.all, 'profile'],
};

/**
 * Hook to fetch user profile information
 * Automatically fetches profile data on mount with caching
 * 
 * @returns {Object} Query result with profile data, loading state, and error
 * 
 * @example
 * const { data: profile, isLoading, error } = useUserProfile();
 * 
 * // Access profile
 * console.log(profile.name);
 * console.log(profile.email);
 */
export const useUserProfile = () => {
  const {
    data: profile,
    isLoading: loading,
    error: queryError,
    refetch: fetchProfile,
  } = useQuery({
    queryKey: userProfileKeys.profile(),
    queryFn: async () => {
      const result = await userProfileService.getProfile();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch profile');
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - profile data changes infrequently
    cacheTime: 30 * 60 * 1000, // 30 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2, // Retry failed requests twice
  });

  const error = queryError?.message || null;

  const queryClient = useQueryClient();

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (profileData) => {
      const result = await userProfileService.updateProfile(profileData);
      if (!result.success) {
        const error = new Error(result.message || 'Failed to update profile');
        error.errors = result.errors;
        throw error;
      }
      return result;
    },
    onMutate: async (newProfile) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userProfileKeys.profile() });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(userProfileKeys.profile());

      // Optimistically update cache
      queryClient.setQueryData(userProfileKeys.profile(), (old) => ({
        ...old,
        ...newProfile,
      }));

      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(userProfileKeys.profile(), context.previousProfile);
      }
    },
    onSuccess: (result) => {
      // Update cache with server response
      queryClient.setQueryData(userProfileKeys.profile(), result.data);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const result = await userProfileService.changePassword(passwordData);
      if (!result.success) {
        const error = new Error(result.message || 'Failed to change password');
        error.errors = result.errors;
        throw error;
      }
      return result;
    },
  });

  // Wrapper function for update profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const result = await updateMutation.mutateAsync(profileData);
      return { 
        success: true, 
        message: result.message || 'Profile updated successfully',
        data: result.data 
      };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Failed to update profile',
        errors: err.errors 
      };
    }
  }, [updateMutation]);

  // Wrapper function for change password
  const changePassword = useCallback(async (passwordData) => {
    try {
      const result = await changePasswordMutation.mutateAsync(passwordData);
      return { 
        success: true, 
        message: result.message || 'Password changed successfully' 
      };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Failed to change password',
        errors: err.errors 
      };
    }
  }, [changePasswordMutation]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    isUpdating: updateMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
};

/**
 * Hook to update user profile with optimistic updates
 * Use this when you need standalone profile update functionality
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
 * 
 * @example
 * const updateProfile = useUpdateProfile();
 * 
 * const handleUpdate = async (profileData) => {
 *   try {
 *     const result = await updateProfile.mutateAsync(profileData);
 *     console.log(result.message);
 *   } catch (error) {
 *     console.error(error.message);
 *   }
 * };
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      const result = await userProfileService.updateProfile(profileData);
      if (!result.success) {
        const error = new Error(result.message || 'Failed to update profile');
        error.errors = result.errors;
        throw error;
      }
      return result;
    },
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: userProfileKeys.profile() });
      const previousProfile = queryClient.getQueryData(userProfileKeys.profile());
      
      queryClient.setQueryData(userProfileKeys.profile(), (old) => ({
        ...old,
        ...newProfile,
      }));

      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(userProfileKeys.profile(), context.previousProfile);
      }
    },
    onSuccess: (result) => {
      queryClient.setQueryData(userProfileKeys.profile(), result.data);
    },
  });
};

/**
 * Hook to change user password
 * Use this when you need standalone password change functionality
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
 * 
 * @example
 * const changePassword = useChangePassword();
 * 
 * const handlePasswordChange = async (passwordData) => {
 *   try {
 *     const result = await changePassword.mutateAsync(passwordData);
 *     console.log(result.message);
 *   } catch (error) {
 *     console.error(error.message);
 *   }
 * };
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData) => {
      const result = await userProfileService.changePassword(passwordData);
      if (!result.success) {
        const error = new Error(result.message || 'Failed to change password');
        error.errors = result.errors;
        throw error;
      }
      return result;
    },
  });
};

/**
 * Hook to manually invalidate user profile cache
 * Useful when you need to force a refresh of profile data
 * 
 * @returns {Function} Function to invalidate profile cache
 * 
 * @example
 * const invalidateProfile = useInvalidateProfile();
 * 
 * // Force refresh profile data
 * invalidateProfile();
 */
export const useInvalidateProfile = () => {
  const queryClient = useQueryClient();
  
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userProfileKeys.profile() });
  }, [queryClient]);
};

export default useUserProfile;

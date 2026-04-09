import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from '../../services/user-management-service/userManagementService';

// Query keys
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (params) => [...userKeys.lists(), params],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
};

/**
 * Hook to fetch all users with React Query
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      // Add per_page parameter to get all users (or a large number)
      const queryParams = { ...params, per_page: 1000 };
      const result = await userManagementService.getUsers(queryParams);
      if (!result.success) {
        throw new Error(result.message);
      }
      // Handle both array and paginated response
      if (Array.isArray(result.data)) {
        return result.data;
      }
      // If paginated, return the data array
      return result.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single user
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const result = await userManagementService.getUser(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const result = await userManagementService.createUser(userData);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }) => {
      const result = await userManagementService.updateUser(id, userData);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific user detail
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const result = await userManagementService.deleteUser(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Hook to fetch user statistics
 */
export const useUserStatistics = () => {
  return useQuery({
    queryKey: [...userKeys.all, 'statistics'],
    queryFn: async () => {
      const result = await userManagementService.getStatistics();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

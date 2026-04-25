import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from '../services/user-management-service/userManagementService';

// Query keys for cache management
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (params) => [...userKeys.lists(), params],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  statistics: () => [...userKeys.all, 'statistics'],
};

/**
 * Hook to fetch all users with React Query
 * @param {Object} params - Query parameters (role, status, search, etc.)
 * @returns {Object} Query result with users data, loading state, and error
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
    staleTime: 15 * 60 * 1000, // 15 minutes - data stays fresh
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache even when unused
    refetchOnMount: false, // Don't refetch if data is fresh
  });
};

/**
 * Hook to fetch a single user by ID
 * @param {number|string} id - User ID
 * @returns {Object} Query result with user data, loading state, and error
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
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
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
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
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
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
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
 * @returns {Object} Query result with statistics data, loading state, and error
 */
export const useUserStatistics = () => {
  return useQuery({
    queryKey: userKeys.statistics(),
    queryFn: async () => {
      const result = await userManagementService.getStatistics();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

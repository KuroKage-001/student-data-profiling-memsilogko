import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { instructionsAPI } from '../services/instructionsService';

/**
 * Professional caching configuration for instructions data
 * - Long cache times for better performance
 * - Smart invalidation strategies
 * - Optimistic updates for better UX
 */

// Query keys factory for better organization
export const instructionsKeys = {
  all: ['instructions'],
  lists: () => [...instructionsKeys.all, 'list'],
  list: (filters) => [...instructionsKeys.lists(), { filters }],
  details: () => [...instructionsKeys.all, 'detail'],
  detail: (id) => [...instructionsKeys.details(), id],
  statistics: () => [...instructionsKeys.all, 'statistics'],
};

/**
 * Custom hook for instructions management with React Query caching
 * 
 * Features:
 * - Automatic caching with 20-minute stale time (syllabi/curricula rarely change)
 * - Background refetching for fresh data
 * - Optimistic updates for instant UI feedback
 * - Smart cache invalidation
 * - Persistent cache across component unmounts
 */
const useInstructionsQuery = (initialFilters = {}) => {
  const queryClient = useQueryClient();

  // Fetch instructions list with caching
  const {
    data: instructionsData,
    isLoading: loading,
    error: queryError,
    refetch: refetchInstructions,
    isFetching,
  } = useQuery({
    queryKey: instructionsKeys.list(initialFilters),
    queryFn: async () => {
      const response = await instructionsAPI.getAll(initialFilters);
      
      // Handle different response structures
      let instructionsArray = [];
      
      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          instructionsArray = response.data;
        } else if (Array.isArray(response)) {
          instructionsArray = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          instructionsArray = response.data.data;
        }
      }
      
      return instructionsArray;
    },
    staleTime: 20 * 60 * 1000, // 20 minutes - instructions rarely change
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours - keep in cache longer
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    keepPreviousData: true,
  });

  const instructions = instructionsData || [];
  const error = queryError?.message || null;

  // Create instruction mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (instructionData) => {
      const result = await instructionsAPI.create(instructionData);
      return result;
    },
    onMutate: async (newInstruction) => {
      await queryClient.cancelQueries({ queryKey: instructionsKeys.lists() });
      const previousInstructions = queryClient.getQueryData(instructionsKeys.list(initialFilters));

      queryClient.setQueryData(instructionsKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return [...old, { ...newInstruction, id: 'temp-' + Date.now() }];
        }
        return old;
      });

      return { previousInstructions };
    },
    onError: (err, newInstruction, context) => {
      if (context?.previousInstructions) {
        queryClient.setQueryData(instructionsKeys.list(initialFilters), context.previousInstructions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instructionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: instructionsKeys.statistics() });
    },
  });

  // Update instruction mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({ id, instructionData }) => {
      const result = await instructionsAPI.update(id, instructionData);
      return result;
    },
    onMutate: async ({ id, instructionData }) => {
      await queryClient.cancelQueries({ queryKey: instructionsKeys.lists() });
      await queryClient.cancelQueries({ queryKey: instructionsKeys.detail(id) });

      const previousInstructions = queryClient.getQueryData(instructionsKeys.list(initialFilters));
      const previousDetail = queryClient.getQueryData(instructionsKeys.detail(id));

      queryClient.setQueryData(instructionsKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return old.map(i => i.id === id ? { ...i, ...instructionData } : i);
        }
        return old;
      });

      queryClient.setQueryData(instructionsKeys.detail(id), (old) => ({
        ...old,
        ...instructionData,
      }));

      return { previousInstructions, previousDetail };
    },
    onError: (err, { id }, context) => {
      if (context?.previousInstructions) {
        queryClient.setQueryData(instructionsKeys.list(initialFilters), context.previousInstructions);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(instructionsKeys.detail(id), context.previousDetail);
      }
    },
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: instructionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: instructionsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: instructionsKeys.statistics() });
    },
  });

  // Delete instruction mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const result = await instructionsAPI.delete(id);
      return result;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: instructionsKeys.lists() });
      const previousInstructions = queryClient.getQueryData(instructionsKeys.list(initialFilters));

      queryClient.setQueryData(instructionsKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return old.filter(i => i.id !== id);
        }
        return old;
      });

      return { previousInstructions };
    },
    onError: (err, id, context) => {
      if (context?.previousInstructions) {
        queryClient.setQueryData(instructionsKeys.list(initialFilters), context.previousInstructions);
      }
    },
    onSuccess: (result, id) => {
      queryClient.invalidateQueries({ queryKey: instructionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: instructionsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: instructionsKeys.statistics() });
    },
  });

  // Wrapper functions for mutations
  const createInstruction = useCallback(async (instructionData) => {
    try {
      await createMutation.mutateAsync(instructionData);
      return { success: true };
    } catch (err) {
      throw err;
    }
  }, [createMutation]);

  const updateInstruction = useCallback(async (id, instructionData) => {
    try {
      await updateMutation.mutateAsync({ id, instructionData });
      return { success: true };
    } catch (err) {
      throw err;
    }
  }, [updateMutation]);

  const deleteInstruction = useCallback(async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (err) {
      throw err;
    }
  }, [deleteMutation]);

  // Invalidate all instructions caches (force refresh)
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: instructionsKeys.all });
  }, [queryClient]);

  // Clear all instructions caches
  const clearCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: instructionsKeys.all });
  }, [queryClient]);

  return {
    // Data
    instructions,
    loading,
    error,
    isFetching,
    
    // Mutations
    createInstruction,
    updateInstruction,
    deleteInstruction,
    
    // Actions
    refetchInstructions,
    invalidateAll,
    clearCache,
  };
};

export default useInstructionsQuery;

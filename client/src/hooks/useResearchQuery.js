import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { researchAPI } from '../services/researchService';

/**
 * Professional caching configuration for research data
 * - Long cache times for better performance
 * - Smart invalidation strategies
 * - Optimistic updates for better UX
 */

// Query keys factory for better organization
export const researchKeys = {
  all: ['research'],
  lists: () => [...researchKeys.all, 'list'],
  list: (filters) => [...researchKeys.lists(), { filters }],
  details: () => [...researchKeys.all, 'detail'],
  detail: (id) => [...researchKeys.details(), id],
  statistics: () => [...researchKeys.all, 'statistics'],
};

/**
 * Custom hook for research management with React Query caching
 * 
 * Features:
 * - Automatic caching with 15-minute stale time
 * - Background refetching for fresh data
 * - Optimistic updates for instant UI feedback
 * - Smart cache invalidation
 * - Persistent cache across component unmounts
 */
const useResearchQuery = (initialFilters = {}) => {
  const queryClient = useQueryClient();

  // Fetch research list with caching
  const {
    data: researchData,
    isLoading: loading,
    error: queryError,
    refetch: refetchResearch,
    isFetching,
  } = useQuery({
    queryKey: researchKeys.list(initialFilters),
    queryFn: async () => {
      const response = await researchAPI.getAll(initialFilters);
      
      // Handle different response structures
      let materialsData = [];
      
      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          materialsData = response.data;
        } else if (Array.isArray(response)) {
          materialsData = response;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          materialsData = response.data.data;
        }
      }
      
      return materialsData;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - research data stays fresh
    cacheTime: 60 * 60 * 1000, // 1 hour - keep in cache
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    keepPreviousData: true,
  });

  const materials = researchData || [];
  const error = queryError?.message || null;

  // Create research mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (researchData) => {
      const result = await researchAPI.create(researchData);
      return result;
    },
    onMutate: async (newResearch) => {
      await queryClient.cancelQueries({ queryKey: researchKeys.lists() });
      const previousResearch = queryClient.getQueryData(researchKeys.list(initialFilters));

      queryClient.setQueryData(researchKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return [...old, { ...newResearch, id: 'temp-' + Date.now() }];
        }
        return old;
      });

      return { previousResearch };
    },
    onError: (err, newResearch, context) => {
      if (context?.previousResearch) {
        queryClient.setQueryData(researchKeys.list(initialFilters), context.previousResearch);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: researchKeys.statistics() });
    },
  });

  // Update research mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({ id, researchData }) => {
      const result = await researchAPI.update(id, researchData);
      return result;
    },
    onMutate: async ({ id, researchData }) => {
      await queryClient.cancelQueries({ queryKey: researchKeys.lists() });
      await queryClient.cancelQueries({ queryKey: researchKeys.detail(id) });

      const previousResearch = queryClient.getQueryData(researchKeys.list(initialFilters));
      const previousDetail = queryClient.getQueryData(researchKeys.detail(id));

      queryClient.setQueryData(researchKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return old.map(r => r.id === id ? { ...r, ...researchData } : r);
        }
        return old;
      });

      queryClient.setQueryData(researchKeys.detail(id), (old) => ({
        ...old,
        ...researchData,
      }));

      return { previousResearch, previousDetail };
    },
    onError: (err, { id }, context) => {
      if (context?.previousResearch) {
        queryClient.setQueryData(researchKeys.list(initialFilters), context.previousResearch);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(researchKeys.detail(id), context.previousDetail);
      }
    },
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: researchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: researchKeys.statistics() });
    },
  });

  // Delete research mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const result = await researchAPI.delete(id);
      return result;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: researchKeys.lists() });
      const previousResearch = queryClient.getQueryData(researchKeys.list(initialFilters));

      queryClient.setQueryData(researchKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return old.filter(r => r.id !== id);
        }
        return old;
      });

      return { previousResearch };
    },
    onError: (err, id, context) => {
      if (context?.previousResearch) {
        queryClient.setQueryData(researchKeys.list(initialFilters), context.previousResearch);
      }
    },
    onSuccess: (result, id) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: researchKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: researchKeys.statistics() });
    },
  });

  // Wrapper functions for mutations
  const createResearch = useCallback(async (researchData) => {
    try {
      await createMutation.mutateAsync(researchData);
      return { success: true };
    } catch (err) {
      throw err;
    }
  }, [createMutation]);

  const updateResearch = useCallback(async (id, researchData) => {
    try {
      await updateMutation.mutateAsync({ id, researchData });
      return { success: true };
    } catch (err) {
      throw err;
    }
  }, [updateMutation]);

  const deleteResearch = useCallback(async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (err) {
      throw err;
    }
  }, [deleteMutation]);

  // Invalidate all research caches (force refresh)
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: researchKeys.all });
  }, [queryClient]);

  // Clear all research caches
  const clearCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: researchKeys.all });
  }, [queryClient]);

  return {
    // Data
    materials,
    loading,
    error,
    isFetching,
    
    // Mutations
    createResearch,
    updateResearch,
    deleteResearch,
    
    // Actions
    refetchResearch,
    invalidateAll,
    clearCache,
  };
};

export default useResearchQuery;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import facultyService from '../../services/faculty-profile-service/facultyService';

/**
 * Professional caching configuration for faculty data
 * - Long cache times for better performance
 * - Smart invalidation strategies
 * - Optimistic updates for better UX
 */

// Query keys factory for better organization
export const facultyKeys = {
  all: ['faculty'],
  lists: () => [...facultyKeys.all, 'list'],
  list: (filters) => [...facultyKeys.lists(), { filters }],
  details: () => [...facultyKeys.all, 'detail'],
  detail: (id) => [...facultyKeys.details(), id],
  statistics: () => [...facultyKeys.all, 'statistics'],
};

/**
 * Custom hook for faculty profile management with React Query caching
 * 
 * Features:
 * - Automatic caching with 15-minute stale time
 * - Background refetching for fresh data
 * - Optimistic updates for instant UI feedback
 * - Smart cache invalidation
 * - Persistent cache across component unmounts
 */
const useFacultyProfileQuery = (initialFilters = {}) => {
  const queryClient = useQueryClient();

  // Fetch faculty list with caching
  const {
    data: facultyData,
    isLoading: loading,
    error: queryError,
    refetch: refetchFaculty,
    isFetching,
  } = useQuery({
    queryKey: facultyKeys.list(initialFilters),
    queryFn: async () => {
      const result = await facultyService.getFaculty(initialFilters);
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch faculty');
      }
      return result.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - data stays fresh
    cacheTime: 60 * 60 * 1000, // 1 hour - keep in cache even when unused
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when internet reconnects
    retry: 2, // Retry failed requests twice
    keepPreviousData: true, // Keep showing old data while fetching new
  });

  // Extract faculty array and pagination from response
  const faculty = Array.isArray(facultyData) 
    ? facultyData 
    : (facultyData?.data || []);
  
  const pagination = facultyData?.current_page ? {
    currentPage: facultyData.current_page || 1,
    totalPages: facultyData.last_page || 1,
    totalItems: facultyData.total || 0,
    perPage: facultyData.per_page || 10,
  } : {
    currentPage: 1,
    totalPages: 1,
    totalItems: faculty.length,
    perPage: 10,
  };

  const error = queryError?.message || null;

  // Fetch single faculty by ID with caching
  const useFacultyById = (id) => {
    return useQuery({
      queryKey: facultyKeys.detail(id),
      queryFn: async () => {
        const result = await facultyService.getFacultyById(id);
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch faculty');
        }
        return result.data;
      },
      staleTime: 15 * 60 * 1000, // 15 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      enabled: !!id, // Only fetch if ID exists
    });
  };

  // Fetch statistics with caching
  const useStatistics = () => {
    return useQuery({
      queryKey: facultyKeys.statistics(),
      queryFn: async () => {
        const result = await facultyService.getFacultyStatistics();
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch statistics');
        }
        return result.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  // Create faculty mutation with optimistic updates
  const createMutation = useMutation({
    mutationFn: async (facultyData) => {
      const result = await facultyService.createFaculty(facultyData);
      if (!result.success) {
        throw new Error(result.message || 'Failed to create faculty');
      }
      return result;
    },
    onMutate: async (newFaculty) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: facultyKeys.lists() });

      // Snapshot previous value
      const previousFaculty = queryClient.getQueryData(facultyKeys.list(initialFilters));

      // Optimistically update cache
      queryClient.setQueryData(facultyKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return [...old, { ...newFaculty, id: 'temp-' + Date.now() }];
        }
        if (old?.data) {
          return {
            ...old,
            data: [...old.data, { ...newFaculty, id: 'temp-' + Date.now() }],
          };
        }
        return old;
      });

      return { previousFaculty };
    },
    onError: (err, newFaculty, context) => {
      // Rollback on error
      if (context?.previousFaculty) {
        queryClient.setQueryData(facultyKeys.list(initialFilters), context.previousFaculty);
      }
    },
    onSuccess: (result) => {
      // Invalidate and refetch all faculty queries
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facultyKeys.statistics() });
    },
  });

  // Update faculty mutation with optimistic updates
  const updateMutation = useMutation({
    mutationFn: async ({ id, facultyData }) => {
      const result = await facultyService.updateFaculty(id, facultyData);
      if (!result.success) {
        throw new Error(result.message || 'Failed to update faculty');
      }
      return result;
    },
    onMutate: async ({ id, facultyData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: facultyKeys.lists() });
      await queryClient.cancelQueries({ queryKey: facultyKeys.detail(id) });

      // Snapshot previous values
      const previousFaculty = queryClient.getQueryData(facultyKeys.list(initialFilters));
      const previousDetail = queryClient.getQueryData(facultyKeys.detail(id));

      // Optimistically update list cache
      queryClient.setQueryData(facultyKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return old.map(f => f.id === id ? { ...f, ...facultyData } : f);
        }
        if (old?.data) {
          return {
            ...old,
            data: old.data.map(f => f.id === id ? { ...f, ...facultyData } : f),
          };
        }
        return old;
      });

      // Optimistically update detail cache
      queryClient.setQueryData(facultyKeys.detail(id), (old) => ({
        ...old,
        ...facultyData,
      }));

      return { previousFaculty, previousDetail };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousFaculty) {
        queryClient.setQueryData(facultyKeys.list(initialFilters), context.previousFaculty);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(facultyKeys.detail(id), context.previousDetail);
      }
    },
    onSuccess: (result, { id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facultyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: facultyKeys.statistics() });
    },
  });

  // Delete faculty mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const result = await facultyService.deleteFaculty(id);
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete faculty');
      }
      return result;
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: facultyKeys.lists() });

      // Snapshot previous value
      const previousFaculty = queryClient.getQueryData(facultyKeys.list(initialFilters));

      // Optimistically remove from cache
      queryClient.setQueryData(facultyKeys.list(initialFilters), (old) => {
        if (Array.isArray(old)) {
          return old.filter(f => f.id !== id);
        }
        if (old?.data) {
          return {
            ...old,
            data: old.data.filter(f => f.id !== id),
          };
        }
        return old;
      });

      return { previousFaculty };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousFaculty) {
        queryClient.setQueryData(facultyKeys.list(initialFilters), context.previousFaculty);
      }
    },
    onSuccess: (result, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facultyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: facultyKeys.statistics() });
    },
  });

  // Wrapper functions for mutations
  const createFaculty = useCallback(async (facultyData) => {
    try {
      const result = await createMutation.mutateAsync(facultyData);
      return { 
        success: true, 
        message: result.message || 'Faculty created successfully',
        data: result.data 
      };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Failed to create faculty',
        errors: err.errors 
      };
    }
  }, [createMutation]);

  const updateFaculty = useCallback(async (id, facultyData) => {
    try {
      const result = await updateMutation.mutateAsync({ id, facultyData });
      return { 
        success: true, 
        message: result.message || 'Faculty updated successfully',
        data: result.data 
      };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Failed to update faculty',
        errors: err.errors 
      };
    }
  }, [updateMutation]);

  const deleteFaculty = useCallback(async (id) => {
    try {
      const result = await deleteMutation.mutateAsync(id);
      return { 
        success: true, 
        message: result.message || 'Faculty deleted successfully' 
      };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Failed to delete faculty' 
      };
    }
  }, [deleteMutation]);

  // Search faculty with cache
  const searchFaculty = useCallback(async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters
    };
    
    // Update query with new filters
    queryClient.setQueryData(facultyKeys.list(params), undefined);
    await queryClient.refetchQueries({ 
      queryKey: facultyKeys.list(params),
      exact: true 
    });
  }, [queryClient]);

  // Prefetch faculty by ID for faster navigation
  const prefetchFaculty = useCallback(async (id) => {
    await queryClient.prefetchQuery({
      queryKey: facultyKeys.detail(id),
      queryFn: async () => {
        const result = await facultyService.getFacultyById(id);
        if (!result.success) {
          throw new Error(result.message);
        }
        return result.data;
      },
      staleTime: 15 * 60 * 1000,
    });
  }, [queryClient]);

  // Invalidate all faculty caches (force refresh)
  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: facultyKeys.all });
  }, [queryClient]);

  // Clear all faculty caches
  const clearCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: facultyKeys.all });
  }, [queryClient]);

  // Get cached faculty by ID without fetching
  const getCachedFaculty = useCallback((id) => {
    return queryClient.getQueryData(facultyKeys.detail(id));
  }, [queryClient]);

  // Static utility functions
  const getDepartments = useCallback(() => {
    return facultyService.getDepartments();
  }, []);

  const getPositions = useCallback(() => {
    return facultyService.getPositions();
  }, []);

  const getStatuses = useCallback(() => {
    return facultyService.getStatuses();
  }, []);

  const formatFacultyForDisplay = useCallback((faculty) => {
    return facultyService.formatFacultyForDisplay(faculty);
  }, []);

  const generateFacultyId = useCallback(() => {
    return facultyService.generateFacultyId();
  }, []);

  const clearError = useCallback(() => {
    // Error is managed by React Query
  }, []);

  return {
    // Data
    faculty,
    loading,
    error,
    pagination,
    isFetching, // Background fetching indicator
    
    // Queries
    useFacultyById,
    useStatistics,
    
    // Mutations
    createFaculty,
    updateFaculty,
    deleteFaculty,
    
    // Actions
    searchFaculty,
    refetchFaculty,
    prefetchFaculty,
    invalidateAll,
    clearCache,
    getCachedFaculty,
    
    // Utilities
    getDepartments,
    getPositions,
    getStatuses,
    formatFacultyForDisplay,
    generateFacultyId,
    clearError,
  };
};

export default useFacultyProfileQuery;

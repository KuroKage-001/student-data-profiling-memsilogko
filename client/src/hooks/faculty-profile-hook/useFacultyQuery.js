import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import facultyService from '../../services/faculty-profile-service/facultyService';

// Query keys for faculty
export const facultyKeys = {
  all: ['faculty'],
  lists: () => [...facultyKeys.all, 'list'],
  list: (filters) => [...facultyKeys.lists(), { filters }],
  details: () => [...facultyKeys.all, 'detail'],
  detail: (id) => [...facultyKeys.details(), id],
};

/**
 * Hook to fetch all faculty members
 */
export const useFacultyList = (params = {}) => {
  return useQuery({
    queryKey: facultyKeys.list(params),
    queryFn: () => facultyService.getFaculty(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook to fetch a single faculty member by ID
 */
export const useFacultyDetail = (id) => {
  return useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: () => facultyService.getFacultyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new faculty member
 */
export const useCreateFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (facultyData) => facultyService.createFaculty(facultyData),
    onSuccess: () => {
      // Invalidate and refetch faculty list
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing faculty member
 */
export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => facultyService.updateFaculty(id, data),
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific faculty detail
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: facultyKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a faculty member
 */
export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => facultyService.deleteFaculty(id),
    onSuccess: () => {
      // Invalidate and refetch faculty list
      queryClient.invalidateQueries({ queryKey: facultyKeys.lists() });
    },
  });
};

/**
 * Hook to fetch faculty statistics
 */
export const useFacultyStatistics = () => {
  return useQuery({
    queryKey: [...facultyKeys.all, 'statistics'],
    queryFn: () => facultyService.getFacultyStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

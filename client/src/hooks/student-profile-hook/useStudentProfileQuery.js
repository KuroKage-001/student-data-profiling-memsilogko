import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../../services/student-profile-service/studentProfileService';

// Query keys
export const studentKeys = {
  all: ['students'],
  lists: () => [...studentKeys.all, 'list'],
  list: (params) => [...studentKeys.lists(), params],
  details: () => [...studentKeys.all, 'detail'],
  detail: (id) => [...studentKeys.details(), id],
  statistics: () => [...studentKeys.all, 'statistics'],
};

/**
 * Hook to fetch all students with React Query
 */
export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: async () => {
      const result = await studentService.getStudents(params);
      if (!result.success) {
        throw new Error(result.message);
      }
      // Return the data array from paginated response
      return result.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single student
 */
export const useStudent = (id) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: async () => {
      const result = await studentService.getStudentById(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new student
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentData) => {
      const result = await studentService.createStudent(studentData);
      if (!result.success) {
        const error = new Error(result.message);
        error.errors = result.errors;
        throw error;
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
    },
  });
};

/**
 * Hook to update an existing student
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, studentData }) => {
      const result = await studentService.updateStudent(id, studentData);
      if (!result.success) {
        const error = new Error(result.message);
        error.errors = result.errors;
        throw error;
      }
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific student detail
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
    },
  });
};

/**
 * Hook to delete a student
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const result = await studentService.deleteStudent(id);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch students list
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
    },
  });
};

/**
 * Hook to fetch student statistics
 */
export const useStudentStatistics = () => {
  return useQuery({
    queryKey: studentKeys.statistics(),
    queryFn: async () => {
      const result = await studentService.getStudentStatistics();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Utility functions (non-query hooks)
export const getPrograms = () => studentService.getPrograms();
export const getYearLevels = () => studentService.getYearLevels();
export const getStatuses = () => studentService.getStatuses();
export const formatStudentForDisplay = (student) => studentService.formatStudentForDisplay(student);
export const generateStudentId = () => studentService.generateStudentId();

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../services/student-profile-service/studentProfileService';

// Query keys for cache management
export const studentKeys = {
  all: ['students'],
  lists: () => [...studentKeys.all, 'list'],
  list: (params) => [...studentKeys.lists(), params],
  details: () => [...studentKeys.all, 'detail'],
  detail: (id) => [...studentKeys.details(), id],
  statistics: () => [...studentKeys.all, 'statistics'],
  nextNumber: (department) => [...studentKeys.all, 'nextNumber', department],
};

/**
 * Hook to fetch all students with React Query
 * Supports filtering by program, year level, skills, activities, status, and department
 * 
 * @param {Object} params - Query parameters for filtering
 * @param {string} params.program - Filter by program (e.g., 'BSIT', 'BSCS')
 * @param {string} params.year_level - Filter by year level (e.g., '1st Year', '2nd Year')
 * @param {string} params.skills - Filter by skills
 * @param {string} params.activities - Filter by activities
 * @param {string} params.status - Filter by status (active, inactive, suspended)
 * @param {string} params.department - Filter by department (for dept_chair role)
 * @returns {Object} Query result with students data, loading state, and error
 * 
 * @example
 * const { data: students, isLoading, error } = useStudents({ 
 *   program: 'BSIT', 
 *   year_level: '3rd Year' 
 * });
 */
export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: async () => {
      // Add per_page parameter to get all students
      const queryParams = { ...params, per_page: 1000 };
      const result = await studentService.getStudents(queryParams);
      if (!result.success) {
        throw new Error(result.message);
      }
      // Return the data array from paginated response
      return result.data?.data || [];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - data stays fresh
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache even when unused
    refetchOnMount: false, // Don't refetch if data is fresh
  });
};

/**
 * Hook to fetch a single student by ID
 * 
 * @param {number|string} id - Student ID
 * @returns {Object} Query result with student data, loading state, and error
 * 
 * @example
 * const { data: student, isLoading } = useStudent(studentId);
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
 * Automatically invalidates students list and statistics after successful creation
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
 * 
 * @example
 * const createStudent = useCreateStudent();
 * 
 * try {
 *   const result = await createStudent.mutateAsync(studentData);
 *   console.log(result.message);
 * } catch (error) {
 *   console.error(error.message);
 *   console.error(error.errors); // Validation errors
 * }
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
      // Invalidate and refetch students list and statistics
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
    },
  });
};

/**
 * Hook to update an existing student
 * Automatically invalidates students list, specific student detail, and statistics
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
 * 
 * @example
 * const updateStudent = useUpdateStudent();
 * 
 * try {
 *   const result = await updateStudent.mutateAsync({ 
 *     id: studentId, 
 *     studentData 
 *   });
 *   console.log(result.message);
 * } catch (error) {
 *   console.error(error.message);
 *   console.error(error.errors); // Validation errors
 * }
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
 * Automatically invalidates students list and statistics after successful deletion
 * 
 * @returns {Object} Mutation object with mutate, mutateAsync, isPending, etc.
 * 
 * @example
 * const deleteStudent = useDeleteStudent();
 * 
 * try {
 *   const result = await deleteStudent.mutateAsync(studentId);
 *   console.log(result.message);
 * } catch (error) {
 *   console.error(error.message);
 * }
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
      // Invalidate and refetch students list and statistics
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
    },
  });
};

/**
 * Hook to fetch student statistics
 * Returns aggregated statistics like total students, by program, by year level, etc.
 * 
 * @returns {Object} Query result with statistics data, loading state, and error
 * 
 * @example
 * const { data: stats, isLoading } = useStudentStatistics();
 * console.log(stats.totalStudents);
 * console.log(stats.byProgram);
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
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to fetch next available student number for a department
 * Used when creating new students to auto-generate student IDs
 * 
 * @param {string} department - Department code (e.g., 'IT', 'CS', 'CE')
 * @returns {Object} Query result with next student number, loading state, and error
 * 
 * @example
 * const { data: nextNumber, isLoading } = useNextStudentNumber('IT');
 * console.log(nextNumber); // e.g., "2024-IT-001"
 */
export const useNextStudentNumber = (department) => {
  return useQuery({
    queryKey: studentKeys.nextNumber(department),
    queryFn: async () => {
      const result = await studentService.getNextStudentNumber(department);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    enabled: !!department, // Only fetch when department is provided
    staleTime: 0, // Always fetch fresh data
  });
};

// Utility functions (non-query hooks)

/**
 * Get list of available programs
 * @returns {Array<string>} Array of program names
 * 
 * @example
 * const programs = getPrograms();
 * // ['BSIT', 'BSCS', 'BSCpE', 'BSDS', ...]
 */
export const getPrograms = () => studentService.getPrograms();

/**
 * Get list of available year levels
 * @returns {Array<string>} Array of year level names
 * 
 * @example
 * const yearLevels = getYearLevels();
 * // ['1st Year', '2nd Year', '3rd Year', '4th Year']
 */
export const getYearLevels = () => studentService.getYearLevels();

/**
 * Get list of available student statuses
 * @returns {Array<string>} Array of status names
 * 
 * @example
 * const statuses = getStatuses();
 * // ['active', 'inactive', 'suspended']
 */
export const getStatuses = () => studentService.getStatuses();

/**
 * Format student data for display
 * @param {Object} student - Student object
 * @returns {Object} Formatted student object
 * 
 * @example
 * const formattedStudent = formatStudentForDisplay(rawStudent);
 */
export const formatStudentForDisplay = (student) => studentService.formatStudentForDisplay(student);

/**
 * Generate a new student ID
 * @returns {string} Generated student ID
 * 
 * @example
 * const newId = generateStudentId();
 * // e.g., "2024-IT-001"
 */
export const generateStudentId = () => studentService.generateStudentId();

import { useState, useCallback } from 'react';
import studentService from '../../services/student-profile-service';

const useStudentProfile = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10
  });

  // Fetch all students
  const fetchStudents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.getStudents(params);
      
      if (result.success) {
        setStudents(result.data.data || []);
        setPagination({
          currentPage: result.data.current_page || 1,
          totalPages: result.data.last_page || 1,
          totalItems: result.data.total || 0,
          perPage: result.data.per_page || 10
        });
      } else {
        setError(result.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single student
  const fetchStudentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.getStudentById(id);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch student');
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create student
  const createStudent = useCallback(async (studentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.createStudent(studentData);
      
      if (result.success) {
        await fetchStudents();
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to create student');
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (err) {
      const message = 'An unexpected error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  // Update student
  const updateStudent = useCallback(async (id, studentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.updateStudent(id, studentData);
      
      if (result.success) {
        await fetchStudents();
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to update student');
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (err) {
      const message = 'An unexpected error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  // Delete student
  const deleteStudent = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.deleteStudent(id);
      
      if (result.success) {
        await fetchStudents();
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to delete student');
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = 'An unexpected error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  // Get statistics
  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await studentService.getStudentStatistics();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch statistics');
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search students
  const searchStudents = useCallback(async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters
    };
    await fetchStudents(params);
  }, [fetchStudents]);

  // Get available programs
  const getPrograms = useCallback(() => {
    return studentService.getPrograms();
  }, []);

  // Get available year levels
  const getYearLevels = useCallback(() => {
    return studentService.getYearLevels();
  }, []);

  // Get available statuses
  const getStatuses = useCallback(() => {
    return studentService.getStatuses();
  }, []);

  // Format student for display
  const formatStudentForDisplay = useCallback((student) => {
    return studentService.formatStudentForDisplay(student);
  }, []);

  // Generate student ID
  const generateStudentId = useCallback(() => {
    return studentService.generateStudentId();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    fetchStatistics,
    searchStudents,
    getPrograms,
    getYearLevels,
    getStatuses,
    formatStudentForDisplay,
    generateStudentId,
    clearError
  };
};

export default useStudentProfile;
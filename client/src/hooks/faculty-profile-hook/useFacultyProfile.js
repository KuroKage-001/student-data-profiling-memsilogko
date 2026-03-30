import { useState, useCallback } from 'react';
import facultyService from '../../services/faculty-profile-service/facultyService';

const useFacultyProfile = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10
  });

  // Fetch all faculty
  const fetchFaculty = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyService.getFaculty(params);
      
      if (result.success) {
        const facultyData = Array.isArray(result.data) 
          ? result.data 
          : (result.data?.data || []);
        setFaculty(facultyData);
        
        if (result.data?.current_page) {
          setPagination({
            currentPage: result.data.current_page || 1,
            totalPages: result.data.last_page || 1,
            totalItems: result.data.total || 0,
            perPage: result.data.per_page || 10
          });
        }
      } else {
        setError(result.message || 'Failed to fetch faculty');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single faculty
  const fetchFacultyById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyService.getFacultyById(id);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.message || 'Failed to fetch faculty');
        return null;
      }
    } catch (err) {
      setError('An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create faculty
  const createFaculty = useCallback(async (facultyData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyService.createFaculty(facultyData);
      
      if (result.success) {
        await fetchFaculty();
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to create faculty');
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (err) {
      const message = 'An unexpected error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty]);

  // Update faculty
  const updateFaculty = useCallback(async (id, facultyData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyService.updateFaculty(id, facultyData);
      
      if (result.success) {
        await fetchFaculty();
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to update faculty');
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (err) {
      const message = 'An unexpected error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty]);

  // Delete faculty
  const deleteFaculty = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyService.deleteFaculty(id);
      
      if (result.success) {
        await fetchFaculty();
        return { success: true, message: result.message };
      } else {
        setError(result.message || 'Failed to delete faculty');
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = 'An unexpected error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty]);

  // Get statistics
  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await facultyService.getFacultyStatistics();
      
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

  // Search faculty
  const searchFaculty = useCallback(async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters
    };
    await fetchFaculty(params);
  }, [fetchFaculty]);

  // Get available departments
  const getDepartments = useCallback(() => {
    return facultyService.getDepartments();
  }, []);

  // Get available positions
  const getPositions = useCallback(() => {
    return facultyService.getPositions();
  }, []);

  // Get available statuses
  const getStatuses = useCallback(() => {
    return facultyService.getStatuses();
  }, []);

  // Format faculty for display
  const formatFacultyForDisplay = useCallback((faculty) => {
    return facultyService.formatFacultyForDisplay(faculty);
  }, []);

  // Generate faculty ID
  const generateFacultyId = useCallback(() => {
    return facultyService.generateFacultyId();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    faculty,
    loading,
    error,
    pagination,
    fetchFaculty,
    fetchFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    fetchStatistics,
    searchFaculty,
    getDepartments,
    getPositions,
    getStatuses,
    formatFacultyForDisplay,
    generateFacultyId,
    clearError
  };
};

export default useFacultyProfile;

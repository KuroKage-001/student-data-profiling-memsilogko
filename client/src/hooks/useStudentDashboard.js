import { useQuery } from '@tanstack/react-query';
import { studentDashboardService } from '../services/student-dashboard-service';

// Query keys for cache management
export const studentDashboardKeys = {
  all: ['studentDashboard'],
  stats: () => [...studentDashboardKeys.all, 'stats'],
  profile: () => [...studentDashboardKeys.all, 'profile'],
  academicRecords: () => [...studentDashboardKeys.all, 'academicRecords'],
  upcomingEvents: () => [...studentDashboardKeys.all, 'upcomingEvents'],
};

/**
 * Hook to fetch student dashboard statistics
 * Fetches overview statistics for the student dashboard including:
 * - Enrolled courses count
 * - Completed courses count
 * - Current GPA
 * - Upcoming events count
 * 
 * @returns {Object} Query result with dashboard stats data, loading state, and error
 * 
 * @example
 * const { data: stats, isLoading, error } = useStudentDashboard();
 * 
 * // Access stats
 * console.log(stats.enrolledCourses);
 * console.log(stats.currentGPA);
 */
export const useStudentDashboard = () => {
  return useQuery({
    queryKey: studentDashboardKeys.stats(),
    queryFn: async () => {
      const result = await studentDashboardService.getStudentDashboardStats();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard stats update frequently
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
  });
};

/**
 * Hook to fetch student profile information
 * Fetches the logged-in student's profile data including:
 * - Personal information
 * - Contact details
 * - Program and year level
 * - Student ID and status
 * 
 * @returns {Object} Query result with student profile data, loading state, and error
 * 
 * @example
 * const { data: profile, isLoading, error } = useStudentProfile();
 * 
 * // Access profile
 * console.log(profile.name);
 * console.log(profile.program);
 * console.log(profile.yearLevel);
 */
export const useStudentProfile = () => {
  return useQuery({
    queryKey: studentDashboardKeys.profile(),
    queryFn: async () => {
      const result = await studentDashboardService.getStudentProfile();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - profile data changes less frequently
  });
};

/**
 * Hook to fetch student academic records
 * Fetches the student's academic history including:
 * - Grades by semester
 * - Course history
 * - GPA per semester
 * - Overall GPA
 * 
 * @returns {Object} Query result with academic records data, loading state, and error
 * 
 * @example
 * const { data: records, isLoading, error } = useStudentAcademicRecords();
 * 
 * // Access records
 * console.log(records.semesters);
 * console.log(records.overallGPA);
 */
export const useStudentAcademicRecords = () => {
  return useQuery({
    queryKey: studentDashboardKeys.academicRecords(),
    queryFn: async () => {
      const result = await studentDashboardService.getAcademicRecords();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - academic records are relatively static
  });
};

/**
 * Hook to fetch upcoming events for the student
 * Fetches events that the student is enrolled in or eligible to attend:
 * - Campus events
 * - Department events
 * - Program-specific events
 * - Deadlines and important dates
 * 
 * @returns {Object} Query result with upcoming events data, loading state, and error
 * 
 * @example
 * const { data: events, isLoading, error } = useStudentUpcomingEvents();
 * 
 * // Access events
 * events.forEach(event => {
 *   console.log(event.title);
 *   console.log(event.date);
 *   console.log(event.location);
 * });
 */
export const useStudentUpcomingEvents = () => {
  return useQuery({
    queryKey: studentDashboardKeys.upcomingEvents(),
    queryFn: async () => {
      const result = await studentDashboardService.getUpcomingEvents();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - events can change frequently
  });
};

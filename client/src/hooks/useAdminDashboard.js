import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/admin-dashboard-service';

// Query keys for cache management
export const dashboardKeys = {
  all: ['dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
};

/**
 * Hook to fetch dashboard statistics
 * Fetches comprehensive statistics for the admin dashboard including:
 * - Total students count
 * - Total faculty count
 * - Active classes count
 * - Pending tasks count
 * - Department-specific stats (for dept_chair role)
 * 
 * @returns {Object} Query result with dashboard stats data, loading state, and error
 * 
 * @example
 * const { data: stats, isLoading, error } = useDashboardStats();
 * 
 * // Access stats
 * console.log(stats.totalStudents);
 * console.log(stats.totalFaculty);
 * console.log(stats.activeClasses);
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const result = await dashboardService.getDashboardStats();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
  });
};

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/admin-dashboard-service';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const result = await dashboardService.getDashboardStats();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

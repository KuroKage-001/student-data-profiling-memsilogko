import { useQuery } from '@tanstack/react-query';
import { studentDashboardService } from '../../services/student-dashboard-service';

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      const result = await studentDashboardService.getStudentDashboardStats();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useStudentProfile = () => {
  return useQuery({
    queryKey: ['studentProfile'],
    queryFn: async () => {
      const result = await studentDashboardService.getStudentProfile();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudentAcademicRecords = () => {
  return useQuery({
    queryKey: ['studentAcademicRecords'],
    queryFn: async () => {
      const result = await studentDashboardService.getAcademicRecords();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudentUpcomingEvents = () => {
  return useQuery({
    queryKey: ['studentUpcomingEvents'],
    queryFn: async () => {
      const result = await studentDashboardService.getUpcomingEvents();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

import DashboardStatsSkeleton from './DashboardStatsSkeleton';
import DashboardCardSkeleton from './DashboardCardSkeleton';

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section Skeleton */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-64 animate-pulse"></div>
        </div>
        <div className="ml-6 h-6 bg-gray-200 rounded w-80 animate-pulse"></div>
      </div>

      {/* Dashboard Stats Skeleton */}
      <div className="mb-8 sm:mb-10">
        <DashboardStatsSkeleton />
      </div>

      {/* Main Navigation Cards Skeleton */}
      <div className="mb-8 sm:mb-10">
        <DashboardCardSkeleton />
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;

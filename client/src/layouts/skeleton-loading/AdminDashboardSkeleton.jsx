import DashboardStatsSkeleton from './DashboardStatsSkeleton';
import DashboardCardSkeleton from './DashboardCardSkeleton';

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Section Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-7 sm:h-9 lg:h-10 bg-gray-300 rounded w-48 sm:w-56 lg:w-64 animate-pulse"></div>
        </div>
        <div className="ml-4 sm:ml-6 h-5 sm:h-6 bg-gray-200 rounded w-56 sm:w-72 lg:w-80 animate-pulse"></div>
      </div>

      {/* Dashboard Stats Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <DashboardStatsSkeleton />
      </div>

      {/* Main Navigation Cards Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <DashboardCardSkeleton />
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;

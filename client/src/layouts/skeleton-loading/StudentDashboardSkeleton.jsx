import DashboardStatsSkeleton from './DashboardStatsSkeleton';

const StudentDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Section Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-7 sm:h-9 lg:h-10 bg-gray-300 rounded w-64 sm:w-80 animate-pulse"></div>
        </div>
        <div className="ml-4 sm:ml-6 h-5 sm:h-6 bg-gray-200 rounded w-56 sm:w-72 animate-pulse"></div>
      </div>

      {/* Dashboard Stats Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <DashboardStatsSkeleton />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Academic Progress Skeleton */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-6 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded-full"></div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-16 bg-gray-100 rounded"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>

          {/* Quick Links Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Profile Card Skeleton */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events Skeleton */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-6 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardSkeleton;

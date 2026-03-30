const ProfileTabSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 bg-gray-300 rounded w-48"></div>
        <div className="w-28 h-10 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-5">
        {/* Name Field Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="relative">
            <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
          </div>
        </div>

        {/* Email Field Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="relative">
            <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
          </div>
        </div>

        {/* Role Field Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="relative">
            <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
          </div>
          <div className="mt-1 h-3 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabSkeleton;

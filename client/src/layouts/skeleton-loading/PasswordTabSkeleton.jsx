const PasswordTabSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-7 bg-gray-300 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-80"></div>
      </div>

      {/* Password Requirements Info Skeleton */}
      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="h-5 bg-orange-200 rounded w-44 mb-2"></div>
        <div className="space-y-2">
          <div className="h-3 bg-orange-100 rounded w-full"></div>
          <div className="h-3 bg-orange-100 rounded w-5/6"></div>
          <div className="h-3 bg-orange-100 rounded w-4/5"></div>
          <div className="h-3 bg-orange-100 rounded w-full"></div>
        </div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-5">
        {/* Current Password Field Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="relative">
            <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
          </div>
        </div>

        {/* New Password Field Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
          <div className="relative">
            <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
          </div>
          {/* Password Strength Indicator Skeleton */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="h-3 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Confirm Password Field Skeleton */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="relative">
            <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
          </div>
        </div>

        {/* Submit Button Skeleton */}
        <div className="pt-4">
          <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default PasswordTabSkeleton;

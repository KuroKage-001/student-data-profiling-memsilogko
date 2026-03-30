const DashboardCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {[1, 2].map((index) => (
        <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
          <div className="flex items-start justify-between gap-4 mb-4">
            {/* Icon skeleton */}
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-xl"></div>
            {/* Arrow skeleton */}
            <div className="shrink-0 w-10 h-10 bg-gray-100 rounded-full"></div>
          </div>
          
          {/* Title skeleton */}
          <div className="h-7 bg-gray-300 rounded w-40 mb-3"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-5 bg-gray-200 rounded w-28"></div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCardSkeleton;

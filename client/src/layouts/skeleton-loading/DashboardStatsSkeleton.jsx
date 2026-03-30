const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              {/* Value skeleton */}
              <div className="h-8 bg-gray-300 rounded w-20"></div>
            </div>
            {/* Icon skeleton */}
            <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsSkeleton;

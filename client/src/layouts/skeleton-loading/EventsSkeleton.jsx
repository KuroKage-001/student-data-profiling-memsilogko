import { FaCalendarAlt, FaSearch, FaPlus, FaChartBar, FaList, FaTh } from 'react-icons/fa';

const EventsSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section Skeleton */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-9 bg-gray-300 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="ml-16 h-6 bg-gray-200 rounded w-80 animate-pulse"></div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            <div className="relative flex-1 sm:max-w-md">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle Skeleton */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <div className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Calendar/List View Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Calendar Header Skeleton */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="w-20 h-8 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="w-40 h-8 bg-white/20 rounded ml-2 sm:ml-4 animate-pulse"></div>
            </div>
            <div className="flex bg-white/20 rounded-lg p-1 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-8 bg-white/20 rounded-md animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Calendar Grid Skeleton */}
        <div className="p-2 sm:p-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2">
                <div className="h-4 bg-gray-200 rounded mx-auto w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square border border-gray-100 rounded-lg p-2">
                <div className="h-4 bg-gray-200 rounded w-6 mb-2 animate-pulse"></div>
                {i % 3 === 0 && (
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsSkeleton;

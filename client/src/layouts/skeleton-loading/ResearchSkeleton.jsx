import { FaFlask, FaSearch, FaPlus, FaChartBar, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

const ResearchSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section Skeleton */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-9 sm:h-10 bg-gray-300 rounded w-56 sm:w-64 lg:w-72 animate-pulse"></div>
          </div>
        </div>
        <div className="ml-16 h-5 sm:h-6 bg-gray-200 rounded w-64 sm:w-80 lg:w-96 animate-pulse"></div>
      </div>

      {/* Research Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {[
          { icon: FaChartBar, color: 'gray' },
          { icon: FaCheckCircle, color: 'green' },
          { icon: FaClock, color: 'blue' },
          { icon: FaFileAlt, color: 'gray' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 sm:h-9 bg-gray-300 rounded w-12 sm:w-16 animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Input Skeleton */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <div className="h-12 sm:h-13 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          {/* Filter Dropdowns Skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 sm:h-13 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        {/* Add Button Skeleton */}
        <div className="h-12 sm:h-13 bg-gray-200 rounded-xl w-full sm:w-48 animate-pulse"></div>
      </div>

      {/* Research Materials Table Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">
                  <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left hidden sm:table-cell">
                  <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left hidden md:table-cell">
                  <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left hidden lg:table-cell">
                  <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left hidden lg:table-cell">
                  <div className="h-3 bg-gray-300 rounded w-12 animate-pulse"></div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left">
                  <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left">
                  <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr key={row} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-48 sm:w-64 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full sm:w-96 animate-pulse"></div>
                      <div className="sm:hidden h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                      <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResearchSkeleton;

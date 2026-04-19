import { FaClock } from 'react-icons/fa';

const SchedulingSkeleton = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section Skeleton */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-8 sm:h-10 bg-gray-300 rounded w-64 sm:w-80 animate-pulse"></div>
          </div>
        </div>
        <div className="ml-16 h-5 sm:h-6 bg-gray-200 rounded w-80 sm:w-96 animate-pulse"></div>
      </div>

      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 sm:h-10 bg-gray-300 rounded w-16 animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Controls Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            <div className="h-12 bg-gray-200 rounded-xl flex-1 sm:max-w-md animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-full sm:w-40 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-full lg:w-40 animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 sm:mb-8">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-4 xl:px-6 py-3">
                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 xl:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-gray-200 last:border-b-0 p-4">
              <div className="mb-3">
                <div className="h-5 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-56 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-7 bg-gray-300 rounded w-64 animate-pulse"></div>
        </div>
        
        {/* Desktop Grid View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-2 sm:px-4 py-3 bg-gray-50 rounded-tl-lg">
                  <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                </th>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className={`px-2 sm:px-4 py-3 bg-gray-50 ${i === 6 ? 'rounded-tr-lg' : ''}`}>
                    <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row} className="border-t border-gray-100">
                  <td className="px-2 sm:px-4 py-4 bg-gray-50">
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                  </td>
                  {[1, 2, 3, 4, 5, 6].map((col) => (
                    <td key={col} className="px-2 sm:px-4 py-4 text-center">
                      <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                        <div className="h-4 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Day-by-Day View */}
        <div className="md:hidden space-y-4">
          {[1, 2, 3, 4, 5, 6].map((day) => (
            <div key={day} className="border-2 border-gray-200 rounded-xl p-4">
              <div className="h-5 bg-gray-300 rounded w-24 mb-3 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
                    <div className="h-8 bg-gray-100 rounded-lg w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchedulingSkeleton;

const StudentListSkeleton = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Desktop Table View Skeleton */}
      <div className="hidden lg:block flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left">
                <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-3 bg-gray-300 rounded w-12 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-3 bg-gray-300 rounded w-10 animate-pulse"></div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-36 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View Skeleton */}
      <div className="lg:hidden flex-1 overflow-auto">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0 p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="flex space-x-3">
                <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-10 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex-1 flex justify-between sm:hidden">
          <div className="h-9 bg-gray-200 rounded-md w-20 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded-md w-16 animate-pulse"></div>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-1">
            <div className="h-9 bg-gray-200 rounded-l-md w-9 animate-pulse"></div>
            <div className="h-9 bg-gray-200 w-9 animate-pulse"></div>
            <div className="h-9 bg-gray-200 w-9 animate-pulse"></div>
            <div className="h-9 bg-gray-200 w-9 animate-pulse"></div>
            <div className="h-9 bg-gray-200 rounded-r-md w-9 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListSkeleton;

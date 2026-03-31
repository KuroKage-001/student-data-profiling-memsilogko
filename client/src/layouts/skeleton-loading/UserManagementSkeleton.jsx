import UserListSkeleton from './UserListSkeleton';
import { FaUsers, FaSearch, FaPlus } from 'react-icons/fa';

const UserManagementSkeleton = () => {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
      {/* Header Section Skeleton */}
      <div className="mb-4 sm:mb-6 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          <div>
            <div className="h-6 sm:h-8 bg-gray-300 rounded w-36 sm:w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="ml-10 sm:ml-13 h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64 animate-pulse"></div>
      </div>

      {/* Search and Actions Section Skeleton */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 mb-4 sm:mb-6 shrink-0">
        <div className="space-y-2.5 sm:space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center lg:justify-between">
          {/* Search Input Skeleton */}
          <div className="relative w-full lg:flex-1 lg:max-w-md">
            <div className="h-9 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>
          </div>
          
          {/* Action Button Skeleton */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="h-9 sm:h-10 bg-gray-200 rounded-lg sm:rounded-xl w-full sm:w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* User List Skeleton - Scrollable */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
        <UserListSkeleton />
      </div>
    </div>
  );
};

export default UserManagementSkeleton;

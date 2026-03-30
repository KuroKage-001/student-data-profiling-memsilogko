import UserListSkeleton from './UserListSkeleton';
import { FaUsers, FaSearch, FaPlus } from 'react-icons/fa';

const UserManagementSkeleton = () => {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col">
      {/* Header Section Skeleton */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div>
            <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="ml-13 h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>

      {/* Search and Actions Section Skeleton */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6 shrink-0">
        <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center lg:justify-between">
          {/* Search Input Skeleton */}
          <div className="relative w-full lg:flex-1 lg:max-w-md">
            <div className="h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          
          {/* Action Button Skeleton */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* User List Skeleton - Scrollable */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
        <UserListSkeleton />
      </div>
    </div>
  );
};

export default UserManagementSkeleton;

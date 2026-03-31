import ProfileTabSkeleton from './ProfileTabSkeleton';
import PasswordTabSkeleton from './PasswordTabSkeleton';

const UserProfileSettingsSkeleton = ({ activeTab = 'profile' }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Back Button Skeleton */}
      <div className="mb-4 sm:mb-6 w-36 sm:w-48 h-9 sm:h-11 bg-gray-200 rounded-lg sm:rounded-xl animate-pulse"></div>

      {/* Header Section Skeleton */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-7 sm:h-9 lg:h-10 bg-gray-300 rounded w-56 sm:w-72 lg:w-80 animate-pulse"></div>
        </div>
        <div className="ml-4 sm:ml-6 h-5 sm:h-6 bg-gray-200 rounded w-64 sm:w-80 lg:w-96 animate-pulse"></div>
      </div>

      {/* Profile Card with Tabs Skeleton */}
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation Skeleton */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4 sm:mb-6">
          <div className="flex border-b border-gray-200">
            {[1, 2].map((index) => (
              <div
                key={index}
                className={`flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 ${
                  (activeTab === 'profile' && index === 1) || (activeTab === 'password' && index === 2)
                    ? 'bg-orange-50'
                    : 'bg-white'
                }`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-20 sm:w-28 lg:w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content Skeleton */}
        {activeTab === 'profile' ? <ProfileTabSkeleton /> : <PasswordTabSkeleton />}

        {/* Security Notice Skeleton */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl animate-pulse">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-200 rounded shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3.5 sm:h-4 bg-blue-200 rounded w-24 sm:w-32"></div>
              <div className="h-3 bg-blue-200 rounded w-full"></div>
              <div className="h-3 bg-blue-200 rounded w-5/6 sm:w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettingsSkeleton;

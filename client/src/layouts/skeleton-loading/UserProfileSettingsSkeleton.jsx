import ProfileTabSkeleton from './ProfileTabSkeleton';
import PasswordTabSkeleton from './PasswordTabSkeleton';

const UserProfileSettingsSkeleton = ({ activeTab = 'profile' }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Back Button Skeleton */}
      <div className="mb-6 w-48 h-11 bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Header Section Skeleton */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-80 animate-pulse"></div>
        </div>
        <div className="ml-6 h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Profile Card with Tabs Skeleton */}
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            {[1, 2].map((index) => (
              <div
                key={index}
                className={`flex-1 px-4 sm:px-6 py-4 flex items-center justify-center gap-2 sm:gap-3 ${
                  (activeTab === 'profile' && index === 1) || (activeTab === 'password' && index === 2)
                    ? 'bg-orange-50'
                    : 'bg-white'
                }`}
              >
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content Skeleton */}
        {activeTab === 'profile' ? <ProfileTabSkeleton /> : <PasswordTabSkeleton />}

        {/* Security Notice Skeleton */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-200 rounded shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-blue-200 rounded w-32"></div>
              <div className="h-3 bg-blue-200 rounded w-full"></div>
              <div className="h-3 bg-blue-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettingsSkeleton;

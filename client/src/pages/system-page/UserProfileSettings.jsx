import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { ProfileInfoTab, ChangePasswordTab } from '../../components/system-components/user-profile-setting-compo';
import { useUserProfile } from '../../hooks/user-profile-setting-hook/useUserProfile';
import { UserProfileSettingsSkeleton } from '../../layouts/skeleton-loading';
import useToast from '../../hooks/useToast';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';

const UserProfileSettings = () => {
  usePageTitle('Profile Settings');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const { profile, loading, updateProfile, changePassword } = useUserProfile();
  const { showSuccess, showError } = useToast();

  // Determine dashboard route based on user role
  const getDashboardRoute = () => {
    if (user?.role === 'student') {
      return '/student/dashboard';
    }
    return '/admin/dashboard';
  };

  const handleUpdateProfile = async (profileData) => {
    const result = await updateProfile(profileData);
    
    if (result.success) {
      showSuccess(result.message || 'Profile updated successfully');
    } else {
      showError(result.message || 'Failed to update profile');
    }
    
    return result;
  };

  const handleChangePassword = async (passwordData) => {
    const result = await changePassword(passwordData);
    
    if (result.success) {
      showSuccess(result.message || 'Password changed successfully');
    } else {
      showError(result.message || 'Failed to change password');
    }
    
    return result;
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: FaUser
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: FaLock
    }
  ];

  // Show skeleton loading while profile data is being fetched
  if (loading && !profile) {
    return (
      <AdminLayout hideSidebar>
        <UserProfileSettingsSkeleton activeTab={activeTab} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout hideSidebar>
      <ToastContainer />
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(getDashboardRoute())}
          className="group mb-4 sm:mb-6 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300 text-sm sm:text-base"
        >
          <FaArrowLeft className="text-xs sm:text-sm group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-linear-to-b from-orange-600 to-orange-400 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              User Profile Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 ml-4 sm:ml-6 font-medium">
            Manage your account information and security settings
          </p>
        </div>

        {/* Profile Card with Tabs */}
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-4 sm:mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-3 font-semibold transition-all relative text-xs sm:text-sm lg:text-base ${
                      activeTab === tab.id
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="text-base sm:text-lg lg:text-xl" />
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">{tab.id === 'profile' ? 'Profile' : 'Password'}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-linear-to-r from-orange-600 to-orange-400"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-300">
            {activeTab === 'profile' && (
              <ProfileInfoTab
                profile={profile}
                onUpdate={handleUpdateProfile}
                loading={loading}
              />
            )}
            
            {activeTab === 'password' && (
              <ChangePasswordTab
                onChangePassword={handleChangePassword}
                loading={loading}
              />
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <FaCheckCircle className="text-blue-600 text-base sm:text-lg mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                  Security Notice
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Your information is encrypted and stored securely. We recommend using a strong, unique password and updating it regularly to maintain account security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserProfileSettings;

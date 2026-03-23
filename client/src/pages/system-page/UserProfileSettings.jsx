import { useState } from 'react';
import { FaUser, FaLock, FaCheckCircle } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { ProfileInfoTab, ChangePasswordTab } from '../../components/system-components/user-profile-setting-compo';
import { useUserProfile } from '../../hooks/user-profile-setting-hook/useUserProfile';
import useToast from '../../hooks/useToast';

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { profile, loading, updateProfile, changePassword } = useUserProfile();
  const { showSuccess, showError } = useToast();

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

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 bg-linear-to-b from-orange-600 to-orange-400 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              User Profile Settings
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-6 font-medium">
            Manage your account information and security settings
          </p>
        </div>

        {/* Profile Card with Tabs */}
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 sm:px-6 py-4 flex items-center justify-center gap-2 sm:gap-3 font-semibold transition-all relative ${
                      activeTab === tab.id
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="text-lg sm:text-xl" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-orange-600 to-orange-400"></div>
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
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-blue-600 text-lg mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Security Notice
                </h4>
                <p className="text-xs text-blue-800">
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

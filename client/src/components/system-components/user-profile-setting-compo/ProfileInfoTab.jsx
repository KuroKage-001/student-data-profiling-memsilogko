import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaUserTag, FaSave, FaTimes } from 'react-icons/fa';
import { validateProfileForm } from '../../../utils/system-utils/user-profile-settings-utils/profileValidation';

const ProfileInfoTab = ({ profile, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateProfileForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const result = await onUpdate(formData);
    
    if (result.success) {
      setIsEditing(false);
      setHasChanges(false);
      setErrors({});
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
    setIsEditing(false);
    setHasChanges(false);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
          Profile Information
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all font-semibold text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaUser />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.name 
                  ? 'border-red-500 focus:border-red-600' 
                  : isEditing 
                  ? 'border-gray-200 focus:border-orange-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.email 
                  ? 'border-red-500 focus:border-red-600' 
                  : isEditing 
                  ? 'border-gray-200 focus:border-orange-500 bg-white' 
                  : 'border-gray-200 bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Role Field (Read-only) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaUserTag />
            </div>
            <input
              type="text"
              value={profile?.role || 'N/A'}
              disabled
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-600 capitalize"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Role cannot be changed. Contact an administrator if you need role modifications.
          </p>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              className="flex-1 px-4 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInfoTab;

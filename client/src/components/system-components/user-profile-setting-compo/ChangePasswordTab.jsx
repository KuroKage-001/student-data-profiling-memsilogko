import { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaKey, FaCheckCircle } from 'react-icons/fa';
import { validatePasswordForm, getPasswordStrength } from '../../../utils/system-utils/user-profile-settings-utils/profileValidation';

const ChangePasswordTab = ({ onChangePassword, loading }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update password strength for new password
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validatePasswordForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const result = await onChangePassword(formData);
    
    if (result.success) {
      // Reset form on success
      setFormData({
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      setPasswordStrength({ strength: 0, label: '', color: '' });
      setErrors({});
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const getStrengthBarColor = () => {
    if (passwordStrength.color === 'red') return 'bg-red-500';
    if (passwordStrength.color === 'yellow') return 'bg-yellow-500';
    if (passwordStrength.color === 'green') return 'bg-green-500';
    return 'bg-gray-300';
  };

  const getStrengthTextColor = () => {
    if (passwordStrength.color === 'red') return 'text-red-600';
    if (passwordStrength.color === 'yellow') return 'text-yellow-600';
    if (passwordStrength.color === 'green') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Change Password
        </h3>
        <p className="text-sm text-gray-600">
          Ensure your account is using a strong password to stay secure
        </p>
      </div>

      {/* Password Requirements Info */}
      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <h4 className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
          <FaKey className="text-orange-600" />
          Password Requirements
        </h4>
        <ul className="text-xs text-orange-800 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-0.5">•</span>
            <span>At least 8 characters long</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-0.5">•</span>
            <span>Contains uppercase and lowercase letters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-0.5">•</span>
            <span>Contains at least one number</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-0.5">•</span>
            <span>Contains at least one special character (@$!%*?&)</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaLock />
            </div>
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.current_password 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-200 focus:border-orange-500'
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.current_password && (
            <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
          )}
        </div>

        {/* New Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaLock />
            </div>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.password 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-200 focus:border-orange-500'
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password Strength:</span>
                <span className={`text-xs font-semibold ${getStrengthTextColor()}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthBarColor()} transition-all duration-300`}
                  style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaLock />
            </div>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              disabled={loading}
              className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                errors.password_confirmation 
                  ? 'border-red-500 focus:border-red-600' 
                  : 'border-gray-200 focus:border-orange-500'
              }`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheckCircle />
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordTab;

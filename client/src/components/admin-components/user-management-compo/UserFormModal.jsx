import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaUserTag, FaToggleOn, FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateUserForm } from '../../../utils/admin-utilities/user-management-utils/userValidation';

const UserFormModal = ({ isOpen, onClose, onSubmit, user, loading }) => {
  const isEdit = !!user;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    position: '',
    student_number: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'student',
        department: user.department || '',
        position: user.position || '',
        student_number: user.student_number || '',
        status: user.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        department: '',
        position: '',
        student_number: '',
        status: 'active'
      });
    }
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if passwords match for new users or when password is being changed
    if (!isEdit || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }
    }
    
    const validation = validateUserForm(formData, isEdit);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Remove password and confirmPassword if empty in edit mode
    const submitData = { ...formData };
    delete submitData.confirmPassword; // Always remove confirmPassword from submission
    if (isEdit && !submitData.password) {
      delete submitData.password;
    }
    
    // Remove empty student_number to allow auto-generation
    if (submitData.role === 'student' && (!submitData.student_number || submitData.student_number.trim() === '')) {
      delete submitData.student_number;
    }

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal panel - optimized for no scrolling */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3.5 shrink-0 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form - scrollable content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser className="text-sm" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password {isEdit && <span className="text-gray-500 text-xs font-normal">(leave blank to keep)</span>}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder={isEdit ? 'New password' : 'Enter password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password {isEdit && <span className="text-gray-500 text-xs font-normal">(if changing)</span>}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-10 py-2.5 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder={isEdit ? 'Confirm new password' : 'Confirm password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUserTag className="text-sm" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all appearance-none text-sm ${
                      errors.role 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                    <option value="dept_chair">Department Chairman</option>
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600">{errors.role}</p>
                )}
              </div>

              {/* Status Field - Only show when editing */}
              {isEdit && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Status
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaToggleOn className="text-sm" />
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all appearance-none text-sm ${
                        errors.status 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  {errors.status && (
                    <p className="mt-1 text-xs text-red-600">{errors.status}</p>
                  )}
                </div>
              )}

              {/* Department Field - Show for all roles */}
              {(formData.role === 'student' || formData.role === 'dept_chair' || formData.role === 'faculty' || formData.role === 'admin') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Department *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all appearance-none text-sm ${
                        errors.department 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="CS">Computer Science (CS)</option>
                    </select>
                  </div>
                  {errors.department && (
                    <p className="mt-1 text-xs text-red-600">{errors.department}</p>
                  )}
                </div>
              )}

              {/* Position Field - Show for Faculty, Admin, and Dept Chair */}
              {(formData.role === 'faculty' || formData.role === 'admin' || formData.role === 'dept_chair') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Position *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all appearance-none text-sm ${
                        errors.position 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    >
                      <option value="">Select Position</option>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Adjunct Professor">Adjunct Professor</option>
                      <option value="Department Head">Department Head</option>
                      <option value="Dean">Dean</option>
                    </select>
                  </div>
                  {errors.position && (
                    <p className="mt-1 text-xs text-red-600">{errors.position}</p>
                  )}
                </div>
              )}

              {/* Student Number Field - Only show for Student role */}
              {formData.role === 'student' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Student Number <span className="text-gray-500 text-xs font-normal">(optional - auto-generated if blank)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="student_number"
                      value={formData.student_number}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all text-sm ${
                        errors.student_number 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                      placeholder="e.g., 2026-IT00001 (leave blank for auto-generation)"
                    />
                  </div>
                  {errors.student_number && (
                    <p className="mt-1 text-xs text-red-600">{errors.student_number}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 shrink-0 rounded-b-lg">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-semibold text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

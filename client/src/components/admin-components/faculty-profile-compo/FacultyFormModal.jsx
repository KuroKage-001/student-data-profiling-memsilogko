import { useState, useEffect } from 'react';
import { FaTimes, FaChalkboardTeacher, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCalendarAlt, FaStickyNote, FaIdCard, FaBriefcase, FaUniversity } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

const FacultyFormModal = ({ faculty, onClose, onSubmit, loading, serverErrors }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isDeptChair = user?.role === 'dept_chair';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    faculty_id: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    specialization: '',
    office: '',
    hire_date: '',
    notes: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Update errors when serverErrors prop changes
  useEffect(() => {
    if (serverErrors) {
      setErrors(serverErrors);
    }
  }, [serverErrors]);

  // Available options - Updated departments to match seeder data
  const departments = ['IT', 'CS'];

  const positions = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Instructor',
    'Adjunct Professor',
    'Department Head',
    'Dean'
  ];

  const statuses = ['active', 'inactive', 'on leave'];

  // Initialize form data if editing
  useEffect(() => {
    if (faculty) {
      setIsEditMode(true);
      setFormData({
        name: faculty.name || '',
        email: faculty.email || '',
        faculty_id: faculty.faculty_id || faculty.id || '',
        phone: faculty.phone || '',
        address: faculty.address || '',
        department: faculty.department || '',
        position: faculty.position || '',
        specialization: faculty.specialization || '',
        office: faculty.office || '',
        hire_date: faculty.hire_date || faculty.hireDate || '',
        notes: faculty.notes || '',
        status: faculty.status?.toLowerCase() || 'active'
      });
    } else {
      setIsEditMode(false);
      const generateFacultyId = () => {
        const prefix = 'FAC';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear().toString().slice(-2);
        return `${prefix}${year}${randomNum}`;
      };
      
      // Auto-set department for dept_chair users
      const defaultDepartment = isDeptChair ? (user?.department || '') : '';
      
      setFormData(prev => ({
        ...prev,
        faculty_id: generateFacultyId(),
        hire_date: new Date().toISOString().split('T')[0],
        department: defaultDepartment
      }));
    }
    setErrors({});
  }, [faculty, isDeptChair, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
      }
    }
    
    if (!formData.faculty_id.trim()) newErrors.faculty_id = 'Faculty ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData, isEditMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal panel - Optimized size */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {isEditMode ? 'Edit Faculty' : 'Add New Faculty'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
              disabled={loading}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable with custom scrollbar */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
          <div className="px-6 py-6 space-y-4">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaChalkboardTeacher className="text-orange-600" />
                Basic Information
              </h4>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaChalkboardTeacher />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
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
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Faculty ID Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Faculty ID *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaIdCard />
                </div>
                <input
                  type="text"
                  name="faculty_id"
                  value={formData.faculty_id}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.faculty_id 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Enter faculty ID"
                />
              </div>
              {errors.faculty_id && (
                <p className="mt-1 text-sm text-red-600">{errors.faculty_id}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaBriefcase className="text-orange-600" />
                Professional Information
              </h4>
            </div>

            {/* Department Field - Conditional rendering based on role */}
            {isAdmin ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUniversity />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                      errors.department 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                )}
              </div>
            ) : isDeptChair ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUniversity />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Department"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Department is automatically set based on your role
                </p>
              </div>
            ) : null}

            {/* Position Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaBriefcase />
                </div>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                    errors.position 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                >
                  <option value="">Select position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Specialization Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaGraduationCap />
                </div>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Enter specialization"
                />
              </div>
            </div>

            {/* Office Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Office Location
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaMapMarkerAlt />
                </div>
                <input
                  type="text"
                  name="office"
                  value={formData.office}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Enter office location"
                />
              </div>
            </div>

            {/* Important Dates */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaCalendarAlt className="text-orange-600" />
                Important Dates
              </h4>
            </div>

            {/* Hire Date Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hire Date *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaCalendarAlt />
                </div>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    errors.hire_date 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.hire_date && (
                <p className="mt-1 text-sm text-red-600">{errors.hire_date}</p>
              )}
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all appearance-none"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                <FaMapMarkerAlt className="text-orange-600" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all resize-none"
                placeholder="Enter address"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                <FaStickyNote className="text-orange-600" />
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all resize-none"
                placeholder="Enter any additional notes or remarks"
              />
            </div>
          </div>
        </form>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-6 py-4 bg-linear-to-r from-gray-50 to-gray-100 border-t border-gray-200 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white hover:border-gray-400 transition-all font-semibold shadow-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-5 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                isEditMode ? 'Update Faculty' : 'Create Faculty'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyFormModal;

import { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaUserGraduate, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCalendarAlt, FaUserFriends, FaStickyNote, FaIdCard, FaTrophy, FaRunning } from 'react-icons/fa';
import UserSearchDropdown from './UserSearchDropdown';
import { useUsers } from '../../../hooks/user-management-hook';
import { useNextStudentNumber } from '../../../hooks/student-profile-hook';

const StudentFormModal = ({ student, onClose, onSubmit, loading, serverErrors }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    email: '',
    student_id: '',
    phone: '',
    address: '',
    program: '',
    year_level: '',
    gpa: '',
    enrollment_date: '',
    graduation_date: '',
    guardian_name: '',
    guardian_phone: '',
    skills: '',
    extracurricular_activities: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);

  // Fetch users with student role
  const { data: allUsers = [], isLoading: usersLoading, error: usersError } = useUsers({ role: 'student' });

  // Fetch next student number based on selected user's department
  const { data: nextStudentNumber, isLoading: loadingNextNumber } = useNextStudentNumber(userDepartment);

  // Update errors when serverErrors prop changes
  useEffect(() => {
    if (serverErrors) {
      setErrors(serverErrors);
    }
  }, [serverErrors]);

  // Available options
  const programs = [
    'Bachelor of Science in Information Technology',
    'Bachelor of Science in Computer Science'
  ];

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

  // Initialize form data if editing
  useEffect(() => {
    if (student) {
      setIsEditMode(true);
      setFormData({
        user_id: student.id || '',
        name: student.name || '',
        email: student.email || '',
        student_id: student.student_number || student.student_id || '', // Use student_number first
        phone: student.phone || '',
        address: student.address || '',
        program: student.program || '',
        year_level: student.year_level || '',
        gpa: student.gpa || '',
        enrollment_date: student.enrollment_date || '',
        graduation_date: student.graduation_date || '',
        guardian_name: student.guardian_name || '',
        guardian_phone: student.guardian_phone || '',
        skills: student.skills || '',
        extracurricular_activities: student.extracurricular_activities || '',
        notes: student.notes || ''
      });
      // Set selected user for edit mode
      setSelectedUser({
        id: student.id,
        name: student.name,
        email: student.email,
        student_number: student.student_number || '',
        department: student.department || ''
      });
    } else {
      setIsEditMode(false);
      setSelectedUser(null);
      setUserDepartment(null);
      
      setFormData({
        user_id: '',
        name: '',
        email: '',
        student_id: '', // Will be set when user is selected or next number is fetched
        phone: '',
        address: '',
        program: '',
        year_level: '',
        gpa: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        graduation_date: '',
        guardian_name: '',
        guardian_phone: '',
        skills: '',
        extracurricular_activities: '',
        notes: ''
      });
    }
    setErrors({});
  }, [student]);

  // Auto-fill next student number when it's fetched
  useEffect(() => {
    if (!isEditMode && nextStudentNumber && userDepartment) {
      setFormData(prev => ({
        ...prev,
        student_id: nextStudentNumber
      }));
      // Clear student_id error since it's auto-filled
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.student_id;
        return newErrors;
      });
    }
  }, [nextStudentNumber, userDepartment, isEditMode]);

  // Handle user selection from dropdown
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (user) {
      // Set department to trigger next student number fetch
      setUserDepartment(user.department);
      
      // Determine program based on department
      let program = '';
      if (user.department === 'IT') {
        program = 'Bachelor of Science in Information Technology';
      } else if (user.department === 'CS') {
        program = 'Bachelor of Science in Computer Science';
      }

      setFormData(prev => ({
        ...prev,
        user_id: user.id,
        name: user.name || '',
        email: user.email || '',
        program: program,
        student_id: user.student_number || prev.student_id // Use student_number if available, otherwise keep current (will be set by next number)
      }));
      // Clear name, email, program errors since they're auto-filled
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.name;
        delete newErrors.email;
        delete newErrors.program;
        if (user.student_number) {
          delete newErrors.student_id;
        }
        return newErrors;
      });
    } else {
      setUserDepartment(null);
      setFormData(prev => ({
        ...prev,
        user_id: '',
        name: '',
        email: '',
        program: '',
        student_id: ''
      }));
    }
  };

  // Real-time validation function
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (value !== value.toLowerCase()) return 'Email address should be entered in lowercase letters only.';
        const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address (e.g., user@example.com)';
        return null;
      
      case 'phone':
        if (value && value.trim()) {
          if (/[^0-9]/.test(value)) return 'Phone number should contain numbers only.';
          if (!value.startsWith('09')) return 'Phone number must start with 09.';
          if (value.length !== 11) return 'Phone number must be exactly 11 digits.';
        }
        return null;
      
      case 'guardian_phone':
        if (value && value.trim()) {
          if (/[^0-9]/.test(value)) return 'Phone number should contain numbers only.';
          if (!value.startsWith('09')) return 'Phone number must start with 09.';
          if (value.length !== 11) return 'Phone number must be exactly 11 digits.';
        }
        return null;
      
      case 'gpa':
        if (value) {
          const gpaNum = parseFloat(value);
          if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) return 'GPA must be between 0.0 and 4.0';
          const decimalPart = value.toString().split('.')[1];
          if (decimalPart && decimalPart.length > 2) return 'GPA should only contain up to two decimal places.';
        }
        return null;
      
      case 'name':
        if (!value.trim()) return 'Name is required';
        return null;
      
      case 'student_id':
        if (!value || typeof value !== 'string' || !value.trim()) return 'Student Number is required';
        // Validate format: YYYY-DDDDD (e.g., 2026-IT00001, 2026-CS00050)
        const studentIdRegex = /^\d{4}-(IT|CS)\d{5}$/;
        if (!studentIdRegex.test(value)) {
          return 'Invalid format. Use: YYYY-DDDDD (e.g., 2026-IT00001)';
        }
        return null;
      
      case 'program':
        if (!value) return 'Program is required';
        return null;
      
      case 'year_level':
        if (!value) return 'Year level is required';
        return null;
      
      case 'enrollment_date':
        if (!value) return 'Enrollment date is required';
        return null;
      
      default:
        return null;
    }
  };

  // Check if form is valid for enabling/disabling submit button
  const isFormValid = useMemo(() => {
    // For new students, user must be selected
    if (!isEditMode && !formData.user_id) return false;
    
    // Check required fields with safe string checks
    if (!formData.name || typeof formData.name !== 'string' || !formData.name.trim()) return false;
    if (!formData.email || typeof formData.email !== 'string' || !formData.email.trim()) return false;
    if (!formData.student_id || typeof formData.student_id !== 'string' || !formData.student_id.trim()) return false;
    
    // Validate student_id format
    const studentIdRegex = /^\d{4}-(IT|CS)\d{5}$/;
    if (!studentIdRegex.test(formData.student_id)) return false;
    
    if (!formData.program) return false;
    if (!formData.year_level) return false;
    if (!formData.enrollment_date) return false;

    // Email must be lowercase
    if (formData.email !== formData.email.toLowerCase()) return false;
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(formData.email)) return false;

    // Phone validation (if provided)
    if (formData.phone && formData.phone.trim()) {
      if (/[^0-9]/.test(formData.phone)) return false;
      if (!formData.phone.startsWith('09')) return false;
      if (formData.phone.length !== 11) return false;
    }

    // Guardian phone validation (if provided)
    if (formData.guardian_phone && formData.guardian_phone.trim()) {
      if (/[^0-9]/.test(formData.guardian_phone)) return false;
      if (!formData.guardian_phone.startsWith('09')) return false;
      if (formData.guardian_phone.length !== 11) return false;
    }

    // GPA validation (if provided)
    if (formData.gpa) {
      const gpaNum = parseFloat(formData.gpa);
      if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) return false;
      const decimalPart = formData.gpa.toString().split('.')[1];
      if (decimalPart && decimalPart.length > 2) return false;
    }

    // Graduation date validation
    if (formData.graduation_date && formData.enrollment_date) {
      const enrollmentDate = new Date(formData.enrollment_date);
      const graduationDate = new Date(formData.graduation_date);
      if (graduationDate <= enrollmentDate) return false;
    }

    return true;
  }, [formData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone fields, only allow numbers
    if (name === 'phone' || name === 'guardian_phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      // Limit to 11 digits
      const limitedValue = numericValue.slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
      const error = validateField(name, limitedValue);
      setErrors(prev => ({ ...prev, [name]: error }));
      return;
    }

    // For GPA, limit decimal places
    if (name === 'gpa') {
      // Allow empty, or valid GPA format
      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
        const gpaNum = parseFloat(value);
        if (value === '' || (gpaNum >= 0 && gpaNum <= 4) || value === '.' || /^\d\.$/.test(value)) {
          setFormData(prev => ({ ...prev, [name]: value }));
          const error = validateField(name, value);
          setErrors(prev => ({ ...prev, [name]: error }));
        }
      }
      return;
    }

    // For email, convert to lowercase automatically
    if (name === 'email') {
      const lowerValue = value.toLowerCase();
      setFormData(prev => ({ ...prev, [name]: lowerValue }));
      const error = validateField(name, lowerValue);
      setErrors(prev => ({ ...prev, [name]: error }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation before submit
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Graduation date validation
    if (formData.graduation_date && formData.enrollment_date) {
      const enrollmentDate = new Date(formData.enrollment_date);
      const graduationDate = new Date(formData.graduation_date);
      if (graduationDate <= enrollmentDate) {
        newErrors.graduation_date = 'Graduation date must be after enrollment date';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData, isEditMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {isEditMode ? 'Edit Student' : 'Add New Student'}
            </h3>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors" disabled={loading}>
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-4">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaUserGraduate className="text-orange-600" />
                Basic Information
              </h4>
            </div>

            {/* User Selection Dropdown - Only show for new students */}
            {!isEditMode && (
              <UserSearchDropdown
                users={allUsers}
                selectedUser={selectedUser}
                onSelect={handleUserSelect}
                loading={usersLoading}
                error={usersError?.message}
                disabled={loading}
              />
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUserGraduate /></div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditMode && selectedUser}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    (!isEditMode && selectedUser) ? 'bg-gray-50 cursor-not-allowed' : ''
                  } ${errors.name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              {!isEditMode && selectedUser && (
                <p className="mt-1 text-xs text-gray-500">Auto-filled from selected user account</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaEnvelope /></div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditMode && selectedUser}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    (!isEditMode && selectedUser) ? 'bg-gray-50 cursor-not-allowed' : ''
                  } ${errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="Enter email address (lowercase only)"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              {!isEditMode && selectedUser ? (
                <p className="mt-1 text-xs text-gray-500">Auto-filled from selected user account</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Email will be automatically converted to lowercase</p>
              )}
            </div>

            {/* Student Number Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student Number * {isEditMode && <span className="text-gray-500 font-normal">(editable)</span>}
                {!isEditMode && <span className="text-gray-500 font-normal">(auto-generated)</span>}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaIdCard /></div>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  disabled={!isEditMode && (!selectedUser || loadingNextNumber)}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                    (!isEditMode && (!selectedUser || loadingNextNumber)) ? 'bg-gray-50 cursor-not-allowed' : ''
                  } ${errors.student_id ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder={loadingNextNumber ? "Generating..." : "e.g., 2026-IT00001"}
                />
              </div>
              {errors.student_id && <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>}
              {!isEditMode && selectedUser && !loadingNextNumber && formData.student_id ? (
                <p className="mt-1 text-xs text-gray-500">Auto-generated next available number for {selectedUser.department}</p>
              ) : !isEditMode && loadingNextNumber ? (
                <p className="mt-1 text-xs text-gray-500">Generating next student number...</p>
              ) : isEditMode ? (
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-DDDDD (e.g., 2026-IT00001, 2026-CS00050)</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">Will be auto-generated when you select a user</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone /></div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={11}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${errors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="09XXXXXXXXX"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              <p className="mt-1 text-xs text-gray-500">Philippine format: 09XXXXXXXXX (11 digits)</p>
            </div>

            {/* Academic Information */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaGraduationCap className="text-orange-600" />
                Academic Information
              </h4>
            </div>

            {/* Program Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Program *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaGraduationCap /></div>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  disabled={!isEditMode && selectedUser && selectedUser.department}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                    (!isEditMode && selectedUser && selectedUser.department) ? 'bg-gray-50 cursor-not-allowed' : ''
                  } ${errors.program ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                >
                  <option value="">Select program</option>
                  {programs.map(program => (<option key={program} value={program}>{program}</option>))}
                </select>
              </div>
              {errors.program && <p className="mt-1 text-sm text-red-600">{errors.program}</p>}
              {!isEditMode && selectedUser && selectedUser.department && (
                <p className="mt-1 text-xs text-gray-500">Auto-filled based on user's department ({selectedUser.department})</p>
              )}
            </div>

            {/* Year Level Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year Level *</label>
              <select
                name="year_level"
                value={formData.year_level}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${errors.year_level ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
              >
                <option value="">Select year level</option>
                {yearLevels.map(level => (<option key={level} value={level}>{level}</option>))}
              </select>
              {errors.year_level && <p className="mt-1 text-sm text-red-600">{errors.year_level}</p>}
            </div>

            {/* GPA Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">GPA (0.0 - 4.0)</label>
              <input
                type="text"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${errors.gpa ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                placeholder="e.g., 3.50"
              />
              {errors.gpa && <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>}
              <p className="mt-1 text-xs text-gray-500">Maximum 2 decimal places (e.g., 3.50, 2.75)</p>
            </div>

            {/* Dates */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaCalendarAlt className="text-orange-600" />
                Important Dates
              </h4>
            </div>

            {/* Enrollment Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enrollment Date *</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaCalendarAlt /></div>
                <input
                  type="date"
                  name="enrollment_date"
                  value={formData.enrollment_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${errors.enrollment_date ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                />
              </div>
              {errors.enrollment_date && <p className="mt-1 text-sm text-red-600">{errors.enrollment_date}</p>}
            </div>

            {/* Graduation Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Graduation Date</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaCalendarAlt /></div>
                <input
                  type="date"
                  name="graduation_date"
                  value={formData.graduation_date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${errors.graduation_date ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                />
              </div>
              {errors.graduation_date && <p className="mt-1 text-sm text-red-600">{errors.graduation_date}</p>}
            </div>

            {/* Guardian Information */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaUserFriends className="text-orange-600" />
                Guardian Information
              </h4>
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUserFriends /></div>
                <input
                  type="text"
                  name="guardian_name"
                  value={formData.guardian_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Enter guardian name"
                />
              </div>
            </div>

            {/* Guardian Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Phone</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaPhone /></div>
                <input
                  type="tel"
                  name="guardian_phone"
                  value={formData.guardian_phone}
                  onChange={handleChange}
                  maxLength={11}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${errors.guardian_phone ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-orange-500'}`}
                  placeholder="09XXXXXXXXX"
                />
              </div>
              {errors.guardian_phone && <p className="mt-1 text-sm text-red-600">{errors.guardian_phone}</p>}
              <p className="mt-1 text-xs text-gray-500">Philippine format: 09XXXXXXXXX (11 digits)</p>
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

            {/* Skills & Activities */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaTrophy className="text-orange-600" />
                Skills & Activities
              </h4>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all resize-none"
                placeholder="e.g., Programming (Python, JavaScript), Data Analysis, Public Speaking"
              />
              <p className="mt-1 text-xs text-gray-500">List student's technical and soft skills</p>
            </div>

            {/* Extracurricular Activities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                <FaRunning className="text-orange-600" />
                Extracurricular Activities
              </label>
              <textarea
                name="extracurricular_activities"
                value={formData.extracurricular_activities}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all resize-none"
                placeholder="e.g., Basketball Team, Debate Club, Student Council, Volunteer Work"
              />
              <p className="mt-1 text-xs text-gray-500">List clubs, sports, organizations, and volunteer activities</p>
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

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className={`flex-1 px-4 py-3 rounded-xl transition-all font-semibold ${
                isFormValid && !loading
                  ? 'bg-linear-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isFormValid || loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Student' : 'Create Student'}
            </button>
          </div>
          {!isFormValid && !isEditMode && (
            <p className="mt-2 text-xs text-center text-gray-500">
              Please fill in all required fields correctly to enable the Create button
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;

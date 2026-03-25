import { useState, useEffect } from 'react';
import { FaTimes, FaUserGraduate, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCalendarAlt, FaUserFriends, FaStickyNote, FaIdCard, FaToggleOn, FaTrophy, FaRunning } from 'react-icons/fa';

const StudentFormModal = ({ student, onClose, onSubmit, loading, serverErrors }) => {
  const [formData, setFormData] = useState({
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

  // Available options
  const programs = [
    'Computer Science',
    'Information Technology',
    'Computer Engineering',
    'Data Science',
    'Software Engineering',
    'Information Systems',
    'Cybersecurity',
    'Artificial Intelligence',
    'Computer Networks',
    'Web Development'
  ];

  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
  const statuses = ['active', 'inactive', 'suspended'];

  // Initialize form data if editing
  useEffect(() => {
    if (student) {
      setIsEditMode(true);
      setFormData({
        name: student.name || '',
        email: student.email || '',
        student_id: student.student_id || '',
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
        notes: student.notes || '',
        status: student.status || 'active'
      });
    } else {
      setIsEditMode(false);
      // Generate student ID for new student
      const generateStudentId = () => {
        const prefix = 'STU';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const year = new Date().getFullYear().toString().slice(-2);
        return `${prefix}${year}${randomNum}`;
      };
      
      setFormData(prev => ({
        ...prev,
        student_id: generateStudentId(),
        enrollment_date: new Date().toISOString().split('T')[0]
      }));
    }
    setErrors({});
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    // Student ID validation
    if (!formData.student_id.trim()) newErrors.student_id = 'Student ID is required';
    
    // Program validation
    if (!formData.program) newErrors.program = 'Program is required';
    
    // Year level validation
    if (!formData.year_level) newErrors.year_level = 'Year level is required';
    
    // Enrollment date validation
    if (!formData.enrollment_date) newErrors.enrollment_date = 'Enrollment date is required';
    
    // GPA validation
    if (formData.gpa && (parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4)) {
      newErrors.gpa = 'GPA must be between 0.0 and 4.0';
    }
    
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
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {isEditMode ? 'Edit Student' : 'Add New Student'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={loading}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-4">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaUserGraduate className="text-orange-600" />
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
                      <FaUserGraduate />
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

                {/* Student ID Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.student_id 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                      placeholder="Enter student ID"
                    />
                  </div>
                  {errors.student_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
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

            {/* Academic Information */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2 pb-2 border-b-2 border-orange-200">
                <FaGraduationCap className="text-orange-600" />
                Academic Information
              </h4>
            </div>

                {/* Program Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Program *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaGraduationCap />
                    </div>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                        errors.program 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    >
                      <option value="">Select program</option>
                      {programs.map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                  {errors.program && (
                    <p className="mt-1 text-sm text-red-600">{errors.program}</p>
                  )}
                </div>

                {/* Year Level Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year Level *
                  </label>
                  <select
                    name="year_level"
                    value={formData.year_level}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                      errors.year_level 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                  >
                    <option value="">Select year level</option>
                    {yearLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.year_level && (
                    <p className="mt-1 text-sm text-red-600">{errors.year_level}</p>
                  )}
                </div>

                {/* GPA Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GPA (0.0 - 4.0)
                  </label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleChange}
                    min="0"
                    max="4"
                    step="0.01"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.gpa 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="Enter GPA"
                  />
                  {errors.gpa && (
                    <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
                  )}
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaToggleOn />
                    </div>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all appearance-none"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enrollment Date *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaCalendarAlt />
                    </div>
                    <input
                      type="date"
                      name="enrollment_date"
                      value={formData.enrollment_date}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.enrollment_date 
                          ? 'border-red-500 focus:border-red-600' 
                          : 'border-gray-200 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  {errors.enrollment_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.enrollment_date}</p>
                  )}
                </div>

                {/* Graduation Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Graduation Date
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaCalendarAlt />
                    </div>
                    <input
                      type="date"
                      name="graduation_date"
                      value={formData.graduation_date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guardian Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaUserFriends />
                    </div>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guardian Phone
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      name="guardian_phone"
                      value={formData.guardian_phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                      placeholder="Enter guardian phone"
                    />
                  </div>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skills
                  </label>
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

        {/* Action Buttons - Fixed at bottom */}
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
              className="flex-1 px-4 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;

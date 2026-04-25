import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaUser, FaBook, FaClock, FaDoorOpen, FaCalendar, FaUserPlus, FaTrash } from 'react-icons/fa';
import facultyService from '../../../services/faculty-profile-service/facultyService';
import enrollmentService from '../../../services/enrollmentService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const ClassSectionModal = ({ mode, section, onClose, onSubmit, onEnrollmentChange }) => {
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const isEnroll = mode === 'enroll'; // New mode for faculty enrollment
  const facultyDropdownRef = useRef(null);
  const studentDropdownRef = useRef(null);
  const { user } = useAuth();
  const isFaculty = user && user.role === 'faculty';
  
  const [formData, setFormData] = useState({
    section_code: '',
    course_code: '',
    course_name: '',
    room: '',
    day_of_week: 'Monday',
    start_time: '08:00',
    end_time: '10:00',
    semester: 'Fall 2024',
    academic_year: '2024-2025',
    max_capacity: 40,
    current_enrollment: 0,
    faculty_id: '',
  });

  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Enrollment state
  const [enrollments, setEnrollments] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  
  // Search state for faculty dropdown
  const [facultySearch, setFacultySearch] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [selectedFacultyName, setSelectedFacultyName] = useState('');
  const [conflictError, setConflictError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (section && (isEdit || isView || isEnroll)) {
      setFormData({
        section_code: section.section_code || '',
        course_code: section.course_code || '',
        course_name: section.course_name || '',
        room: section.room || '',
        day_of_week: section.day_of_week || 'Monday',
        start_time: section.start_time || '08:00',
        end_time: section.end_time || '10:00',
        semester: section.semester || 'Fall 2024',
        academic_year: section.academic_year || '2024-2025',
        max_capacity: section.max_capacity || 40,
        current_enrollment: section.current_enrollment || 0,
        faculty_id: section.instructor_id || '',
      });
      
      // Set selected faculty name if editing
      if (section.instructor_id && facultyList.length > 0) {
        const faculty = facultyList.find(f => f.id === section.instructor_id);
        if (faculty) {
          setSelectedFacultyName(`${faculty.name} - ${faculty.department}`);
        }
      }
    }
  }, [section, mode, facultyList]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (facultyDropdownRef.current && !facultyDropdownRef.current.contains(event.target)) {
        setShowFacultyDropdown(false);
      }
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target)) {
        setShowStudentDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch enrollments when viewing or editing
  useEffect(() => {
    if (section && section.id && (isEdit || isView || isEnroll)) {
      fetchEnrollments();
    }
  }, [section, isEdit, isView, isEnroll]);

  // Fetch eligible students when course code changes or when modal opens in enroll mode
  useEffect(() => {
    if ((mode === 'edit' || mode === 'create' || mode === 'enroll') && formData.course_code) {
      const program = extractProgramFromCourseCode(formData.course_code);
      if (program) {
        fetchEligibleStudents(program);
      }
    }
  }, [formData.course_code, mode, section?.id]);

  const extractProgramFromCourseCode = (courseCode) => {
    const match = courseCode.match(/^(IT|CS)\s/i);
    return match ? match[1].toUpperCase() : null;
  };

  const fetchEnrollments = async () => {
    if (!section?.id) return;
    
    try {
      const response = await enrollmentService.getClassEnrollments(section.id);
      
      // Response is already the data object {success: true, data: [...]}
      if (response && response.success && Array.isArray(response.data)) {
        setEnrollments(response.data);
      } else if (Array.isArray(response)) {
        // Fallback if response is directly an array
        setEnrollments(response);
      } else {
        setEnrollments([]);
      }
    } catch (error) {
      setEnrollments([]);
    }
  };

  const fetchEligibleStudents = async (program) => {
    try {
      const response = await enrollmentService.getEligibleStudents(
        section?.id || null,
        program
      );
      
      // Response is already the data object {success: true, data: [...]}
      if (response && response.success && Array.isArray(response.data)) {
        setEligibleStudents(response.data);
      } else if (Array.isArray(response)) {
        // Fallback if response is directly an array
        setEligibleStudents(response);
      } else {
        setEligibleStudents([]);
      }
    } catch (error) {
      setEligibleStudents([]);
    }
  };

  const handleEnrollStudent = async (student) => {
    if (!section?.id) {
      toast.error('Please save the class section first before enrolling students');
      return;
    }

    setEnrollmentLoading(true);
    try {
      // Use faculty-specific endpoint if user is faculty
      const enrollFunction = isFaculty 
        ? enrollmentService.facultyEnrollStudent 
        : enrollmentService.enrollStudent;
      
      const response = await enrollFunction({
        user_id: student.id,
        class_section_id: section.id,
      });

      if (response.success) {
        toast.success(`${student.name} enrolled successfully`);
        await fetchEnrollments();
        setStudentSearch('');
        setShowStudentDropdown(false);
        
        // Update current enrollment count
        setFormData(prev => ({
          ...prev,
          current_enrollment: prev.current_enrollment + 1
        }));
        
        // Notify parent component to refresh
        if (onEnrollmentChange) {
          onEnrollmentChange();
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to enroll student');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleDropStudent = async (enrollment) => {
    if (!window.confirm(`Are you sure you want to drop ${enrollment.student?.name} from this class?`)) {
      return;
    }

    setEnrollmentLoading(true);
    try {
      // Use faculty-specific endpoint if user is faculty
      const dropFunction = isFaculty 
        ? enrollmentService.facultyDropStudent 
        : enrollmentService.dropStudent;
      
      const response = await dropFunction(enrollment.id);

      if (response.success) {
        toast.success('Student dropped successfully');
        await fetchEnrollments();
        
        // Update current enrollment count
        setFormData(prev => ({
          ...prev,
          current_enrollment: Math.max(0, prev.current_enrollment - 1)
        }));
        
        // Notify parent component to refresh
        if (onEnrollmentChange) {
          onEnrollmentChange();
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to drop student');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await facultyService.getFaculty();
      if (response.success && response.data) {
        const facultyData = Array.isArray(response.data) ? response.data : [];
        setFacultyList(facultyData);
      }
    } catch (error) {
      setFacultyList([]);
    }
  };
  
  // Refresh faculty list when modal opens
  useEffect(() => {
    if (mode === 'create' || mode === 'edit') {
      fetchFaculty();
    }
  }, [mode]);

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
        [name]: ''
      }));
    }
    // Clear conflict error when user makes changes
    if (conflictError) {
      setConflictError(null);
    }
  };
  
  // Filter faculty based on search
  const filteredFaculty = facultyList.filter(faculty => {
    const searchLower = facultySearch.toLowerCase();
    return (
      faculty.name?.toLowerCase().includes(searchLower) ||
      faculty.department?.toLowerCase().includes(searchLower) ||
      faculty.email?.toLowerCase().includes(searchLower)
    );
  });
  
  const handleFacultySelect = (faculty) => {
    setFormData(prev => ({ ...prev, faculty_id: faculty.id }));
    setSelectedFacultyName(`${faculty.name} - ${faculty.department}`);
    setFacultySearch('');
    setShowFacultyDropdown(false);
  };
  
  const handleFacultySearchChange = (e) => {
    setFacultySearch(e.target.value);
    setShowFacultyDropdown(true);
  };
  
  const handleClearFaculty = () => {
    setFormData(prev => ({ ...prev, faculty_id: '' }));
    setSelectedFacultyName('');
    setFacultySearch('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.section_code.trim()) {
      newErrors.section_code = 'Section code is required';
    }
    if (!formData.course_code.trim()) {
      newErrors.course_code = 'Course code is required';
    }
    if (!formData.course_name.trim()) {
      newErrors.course_name = 'Course name is required';
    }
    if (!formData.day_of_week) {
      newErrors.day_of_week = 'Day is required';
    }
    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }
    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = 'End time must be after start time';
    }
    if (formData.max_capacity < 1) {
      newErrors.max_capacity = 'Capacity must be at least 1';
    }
    // Make faculty required in both create and edit mode
    if ((mode === 'create' || mode === 'edit') && !formData.faculty_id) {
      newErrors.faculty_id = 'Faculty assignment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setConflictError(null);
    try {
      // Format time values to H:i format (remove seconds if present)
      const submitData = {
        ...formData,
        start_time: formData.start_time.substring(0, 5), // Ensure HH:MM format
        end_time: formData.end_time.substring(0, 5), // Ensure HH:MM format
      };
      
      await onSubmit(submitData);
      // If successful, the parent will close the modal and show success toast
      // Modal will be closed by parent component
    } catch (error) {
      // Display conflict error in the modal
      if (error.conflict) {
        const conflict = error.conflict;
        setConflictError(
          `Schedule conflict detected: ${conflict.course_code} (${conflict.course_name}) is already scheduled in ${conflict.room || 'this room'} on ${conflict.day_of_week} from ${conflict.start_time} to ${conflict.end_time}. Please choose a different time slot or room.`
        );
      } else if (error.message) {
        // Show other errors as conflict error for visibility
        setConflictError(error.message);
      }
      // Re-throw the error so parent knows submission failed
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {mode === 'create' && 'Create New Class Section'}
              {mode === 'edit' && 'Edit Class Section'}
              {mode === 'view' && 'View Class Section'}
              {mode === 'enroll' && 'Enroll Students'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form - Scrollable with custom scrollbar */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
          <div className="px-6 py-6 space-y-4">
            {/* Conflict Error Alert */}
            {conflictError && !isEnroll && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-800 mb-1">Schedule Conflict</h4>
                    <p className="text-sm text-red-700">{conflictError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Form Sections - Hide in enroll mode */}
              {!isEnroll && (
                <>
              {/* View Mode - Professional Card Layout */}
              {isView ? (
                <div className="space-y-6">
                  {/* Course Information Card */}
                  <div className="bg-linear-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border-2 border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <FaBook className="text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Course Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Section Code</div>
                        <div className="text-base font-bold text-gray-900">{formData.section_code}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Course Code</div>
                        <div className="text-base font-bold text-gray-900">{formData.course_code}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 md:col-span-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Course Name</div>
                        <div className="text-base font-bold text-gray-900">{formData.course_name}</div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Information Card */}
                  <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <FaClock className="text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Schedule Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Day</div>
                        <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <FaCalendar className="text-blue-500" />
                          {formData.day_of_week}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Room</div>
                        <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <FaDoorOpen className="text-blue-500" />
                          {formData.room || 'TBA'}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Start Time</div>
                        <div className="text-base font-bold text-gray-900">{formData.start_time}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">End Time</div>
                        <div className="text-base font-bold text-gray-900">{formData.end_time}</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Card */}
                  <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <FaUser className="text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Additional Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Instructor</div>
                        <div className="text-base font-bold text-gray-900">{section?.instructor || 'Not assigned'}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Capacity</div>
                        <div className="text-base font-bold text-gray-900">
                          {formData.current_enrollment} / {formData.max_capacity} students
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            ({Math.round((formData.current_enrollment / formData.max_capacity) * 100)}% full)
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Semester</div>
                        <div className="text-base font-bold text-gray-900">{formData.semester}</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Academic Year</div>
                        <div className="text-base font-bold text-gray-900">{formData.academic_year}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
              {/* Edit/Create Mode - Form Layout */}
              {/* Course Information Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Course Information</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Section Code */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Section Code *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaBook />
                        </div>
                        <input
                          type="text"
                          name="section_code"
                          value={formData.section_code}
                          onChange={handleChange}
                          disabled={isView}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                            errors.section_code 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-200 focus:border-orange-500'
                          } ${isView ? 'bg-gray-100' : ''}`}
                          placeholder="e.g., A, B, C"
                        />
                      </div>
                      {errors.section_code && (
                        <p className="mt-1 text-sm text-red-600">{errors.section_code}</p>
                      )}
                    </div>

                    {/* Course Code */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Code *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaBook />
                        </div>
                        <input
                          type="text"
                          name="course_code"
                          value={formData.course_code}
                          onChange={handleChange}
                          disabled={isView}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                            errors.course_code 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-200 focus:border-orange-500'
                          } ${isView ? 'bg-gray-100' : ''}`}
                          placeholder="e.g., CS 101"
                        />
                      </div>
                      {errors.course_code && (
                        <p className="mt-1 text-sm text-red-600">{errors.course_code}</p>
                      )}
                    </div>
                  </div>

                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Course Name *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaBook />
                      </div>
                      <input
                        type="text"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        disabled={isView}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.course_name 
                            ? 'border-red-500 focus:border-red-600' 
                            : 'border-gray-200 focus:border-orange-500'
                        } ${isView ? 'bg-gray-100' : ''}`}
                        placeholder="e.g., Introduction to Programming"
                      />
                    </div>
                    {errors.course_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.course_name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Information Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Schedule Information</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Day */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Day *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaCalendar />
                        </div>
                        <select
                          name="day_of_week"
                          value={formData.day_of_week}
                          onChange={handleChange}
                          disabled={isView}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none ${
                            errors.day_of_week 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-200 focus:border-orange-500'
                          } ${isView ? 'bg-gray-100' : ''}`}
                        >
                          {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                      {errors.day_of_week && (
                        <p className="mt-1 text-sm text-red-600">{errors.day_of_week}</p>
                      )}
                    </div>

                    {/* Room */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Room
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaDoorOpen />
                        </div>
                        <input
                          type="text"
                          name="room"
                          value={formData.room}
                          onChange={handleChange}
                          disabled={isView}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all border-gray-200 focus:border-orange-500 ${
                            isView ? 'bg-gray-100' : ''
                          }`}
                          placeholder="e.g., CS-301"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Start Time *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaClock />
                        </div>
                        <input
                          type="time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleChange}
                          disabled={isView}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                            errors.start_time 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-200 focus:border-orange-500'
                          } ${isView ? 'bg-gray-100' : ''}`}
                        />
                      </div>
                      {errors.start_time && (
                        <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                      )}
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        End Time *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <FaClock />
                        </div>
                        <input
                          type="time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleChange}
                          disabled={isView}
                          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                            errors.end_time 
                              ? 'border-red-500 focus:border-red-600' 
                              : 'border-gray-200 focus:border-orange-500'
                          } ${isView ? 'bg-gray-100' : ''}`}
                        />
                      </div>
                      {errors.end_time && (
                        <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Additional Information</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Semester */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Semester
                      </label>
                      <input
                        type="text"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        disabled={isView}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all border-gray-200 focus:border-orange-500 ${
                          isView ? 'bg-gray-100' : ''
                        }`}
                        placeholder="e.g., Fall 2024"
                      />
                    </div>

                    {/* Academic Year */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        name="academic_year"
                        value={formData.academic_year}
                        onChange={handleChange}
                        disabled={isView}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all border-gray-200 focus:border-orange-500 ${
                          isView ? 'bg-gray-100' : ''
                        }`}
                        placeholder="e.g., 2024-2025"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Max Capacity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Capacity *
                      </label>
                      <input
                        type="number"
                        name="max_capacity"
                        value={formData.max_capacity}
                        onChange={handleChange}
                        disabled={isView}
                        min="1"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.max_capacity 
                            ? 'border-red-500 focus:border-red-600' 
                            : 'border-gray-200 focus:border-orange-500'
                        } ${isView ? 'bg-gray-100' : ''}`}
                      />
                      {errors.max_capacity && (
                        <p className="mt-1 text-sm text-red-600">{errors.max_capacity}</p>
                      )}
                    </div>

                    {/* Current Enrollment */}
                    {isEdit && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Current Enrollment
                        </label>
                        <input
                          type="number"
                          name="current_enrollment"
                          value={formData.current_enrollment}
                          onChange={handleChange}
                          disabled={isView}
                          min="0"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all border-gray-200 focus:border-orange-500 ${
                            isView ? 'bg-gray-100' : ''
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Assign Faculty */}
                  <div ref={facultyDropdownRef}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Assign Faculty {(mode === 'create' || mode === 'edit') ? '*' : ''}
                      </label>
                      {!isView && (
                        <button
                          type="button"
                          onClick={fetchFaculty}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh List
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                        <FaUser />
                      </div>
                      
                      {/* Display selected faculty or search input */}
                      {isView ? (
                        <div className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                          <span className="text-gray-900 font-medium">
                            {section?.instructor || 'No faculty assigned'}
                          </span>
                        </div>
                      ) : formData.faculty_id && selectedFacultyName && !showFacultyDropdown ? (
                        <div className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl bg-orange-50 flex items-center justify-between">
                          <span className="text-gray-900 font-medium">{selectedFacultyName}</span>
                          {(mode !== 'create' && mode !== 'edit') && (
                            <button
                              type="button"
                              onClick={handleClearFaculty}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={facultySearch}
                            onChange={handleFacultySearchChange}
                            onFocus={() => setShowFacultyDropdown(true)}
                            disabled={isView}
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                              errors.faculty_id 
                                ? 'border-red-500 focus:border-red-600' 
                                : 'border-gray-200 focus:border-orange-500'
                            } ${isView ? 'bg-gray-100' : ''}`}
                            placeholder="Search faculty by name, department, or email..."
                          />
                          
                          {/* Dropdown list - positioned above */}
                          {showFacultyDropdown && !isView && (
                            <div className="absolute z-20 w-full bottom-full mb-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                              {filteredFaculty.length > 0 ? (
                                <>
                                  {(mode !== 'create' && mode !== 'edit') && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleClearFaculty();
                                        setShowFacultyDropdown(false);
                                      }}
                                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 text-gray-500 italic"
                                    >
                                      -- No Faculty (Clear Selection) --
                                    </button>
                                  )}
                                  {filteredFaculty.map(faculty => (
                                    <button
                                      key={faculty.id}
                                      type="button"
                                      onClick={() => handleFacultySelect(faculty)}
                                      className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="font-medium text-gray-900">{faculty.name}</div>
                                      <div className="text-sm text-gray-600">{faculty.department}</div>
                                      {faculty.email && (
                                        <div className="text-xs text-gray-500">{faculty.email}</div>
                                      )}
                                    </button>
                                  ))}
                                </>
                              ) : (
                                <div className="px-4 py-3 text-gray-500 text-center">
                                  {facultySearch ? 'No faculty found matching your search' : 'No faculty available'}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {errors.faculty_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.faculty_id}</p>
                    )}
                    {!isView && (
                      <p className="mt-1 text-xs text-gray-500">
                        {(mode === 'create' || mode === 'edit')
                          ? 'Faculty assignment is required. Search by name, department, or email.' 
                          : 'Search by name, department, or email. Click "Refresh List" to see newly added faculty.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
                </>
              )}
                </>
              )}

              {/* Student Enrollment Section - Show in edit/view/enroll mode for existing sections */}
              {(isEdit || isView || isEnroll) && section?.id && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center justify-between">
                    <span>Enrolled Students ({enrollments.length}/{formData.max_capacity})</span>
                    {!isView && (
                      <span className="text-xs font-normal text-gray-500">
                        {extractProgramFromCourseCode(formData.course_code) || 'All'} students only
                      </span>
                    )}
                  </h4>

                  {/* Add Student Dropdown - Only in edit mode */}
                  {!isView && (
                    <div ref={studentDropdownRef} className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Add Student
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                          <FaUserPlus />
                        </div>
                        <input
                          type="text"
                          value={studentSearch}
                          onChange={(e) => {
                            setStudentSearch(e.target.value);
                            setShowStudentDropdown(true);
                          }}
                          onFocus={() => setShowStudentDropdown(true)}
                          className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all border-gray-200 focus:border-orange-500"
                          placeholder="Search students by name, ID, or email..."
                          disabled={enrollmentLoading}
                        />
                        
                        {/* Student Dropdown */}
                        {showStudentDropdown && (
                          <div className="absolute z-20 w-full top-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {eligibleStudents.filter(student => {
                              const searchLower = studentSearch.toLowerCase();
                              return (
                                student.name?.toLowerCase().includes(searchLower) ||
                                student.email?.toLowerCase().includes(searchLower) ||
                                student.student_id?.toLowerCase().includes(searchLower)
                              );
                            }).length > 0 ? (
                              eligibleStudents
                                .filter(student => {
                                  const searchLower = studentSearch.toLowerCase();
                                  return (
                                    student.name?.toLowerCase().includes(searchLower) ||
                                    student.email?.toLowerCase().includes(searchLower) ||
                                    student.student_id?.toLowerCase().includes(searchLower)
                                  );
                                })
                                .map(student => (
                                  <button
                                    key={student.id}
                                    type="button"
                                    onClick={() => handleEnrollStudent(student)}
                                    disabled={enrollmentLoading}
                                    className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 disabled:opacity-50"
                                  >
                                    <div className="font-medium text-gray-900">{student.name}</div>
                                    <div className="text-sm text-gray-600">
                                      {student.student_id} • {student.program} • Year {student.year_level}
                                    </div>
                                    <div className="text-xs text-gray-500">{student.email}</div>
                                  </button>
                                ))
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-center">
                                {studentSearch ? 'No students found matching your search' : 'No eligible students available'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Only {extractProgramFromCourseCode(formData.course_code) || 'eligible'} students who are not already enrolled will appear
                      </p>
                    </div>
                  )}

                  {/* Enrolled Students List */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {enrollments.length > 0 ? (
                      enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{enrollment.student?.name}</div>
                            <div className="text-sm text-gray-600">
                              {enrollment.student?.student_id} • {enrollment.student?.program}
                            </div>
                          </div>
                          {!isView && (
                            <button
                              type="button"
                              onClick={() => handleDropStudent(enrollment)}
                              disabled={enrollmentLoading}
                              className="text-red-600 hover:text-red-700 transition-colors p-2 disabled:opacity-50"
                              title="Drop student"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No students enrolled yet
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              {(isView || isEnroll) ? 'Close' : 'Cancel'}
            </button>
            {!isView && !isEnroll && (
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
                  mode === 'create' ? 'Create Section' : 'Update Section'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSectionModal;

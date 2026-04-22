import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaBook, FaClock, FaDoorOpen, FaCalendar } from 'react-icons/fa';
import facultyService from '../../../services/faculty-profile-service/facultyService';

const ClassSectionModal = ({ mode, section, onClose, onSubmit }) => {
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  
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
  const [conflictError, setConflictError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchFaculty();
    
    if (section && (isEdit || isView)) {
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
    }
  }, [section, mode]);

  const fetchFaculty = async () => {
    try {
      const response = await facultyService.getFaculty();
      if (response.success && response.data) {
        setFacultyList(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      // Silently fail - faculty dropdown will just be empty
      setFacultyList([]);
    }
  };

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
      await onSubmit(formData);
      // If successful, the parent will close the modal and show success toast
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Display conflict error in the modal
      if (error.conflict) {
        const conflict = error.conflict;
        setConflictError(
          `Schedule conflict detected: ${conflict.course_code} (${conflict.course_name}) is already scheduled in ${conflict.room || 'this room'} on ${conflict.day_of_week} from ${conflict.start_time} to ${conflict.end_time}. Please choose a different time slot or room.`
        );
      }
      // Don't re-throw - error is handled here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with blur */}
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {mode === 'create' && 'Create New Class Section'}
                {mode === 'edit' && 'Edit Class Section'}
                {mode === 'view' && 'View Class Section'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {/* Conflict Error Alert */}
            {conflictError && (
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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assign Faculty
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaUser />
                      </div>
                      <select
                        name="faculty_id"
                        value={formData.faculty_id}
                        onChange={handleChange}
                        disabled={isView}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all appearance-none border-gray-200 focus:border-orange-500 ${
                          isView ? 'bg-gray-100' : ''
                        }`}
                      >
                        <option value="">-- Select Faculty (Optional) --</option>
                        {facultyList.map(faculty => (
                          <option key={faculty.id} value={faculty.id}>
                            {faculty.name} - {faculty.department}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                disabled={loading}
              >
                {isView ? 'Close' : 'Cancel'}
              </button>
              {!isView && (
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : mode === 'create' ? 'Create Section' : 'Update Section'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassSectionModal;

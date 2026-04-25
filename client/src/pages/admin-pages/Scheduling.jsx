import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import { FaClock, FaSearch, FaPlus, FaChartBar, FaUsers, FaDoorOpen, FaEdit, FaTrash, FaEye, FaUserPlus } from 'react-icons/fa';
import classSectionService from '../../services/classSectionService';
import ClassSectionModal from '../../components/admin-components/scheduling/ClassSectionModal';
import DeleteConfirmModal from '../../components/admin-components/scheduling/DeleteConfirmModal';
import { SchedulingSkeleton } from '../../layouts/skeleton-loading';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

const Scheduling = () => {
  usePageTitle('Scheduling');
  const { user } = useAuth();
  
  const [schedules, setSchedules] = useState([]);
  const [statistics, setStatistics] = useState({
    total_classes: 0,
    total_students: 0,
    unique_rooms: 0,
    avg_capacity_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Check if user can manage schedules (admin or dept_chair)
  const canManageSchedules = user && ['admin', 'dept_chair'].includes(user.role);
  
  // Check if user is faculty
  const isFaculty = user && user.role === 'faculty';
  
  // Check if user can enroll students (admin, dept_chair, or faculty)
  const canEnrollStudents = user && ['admin', 'dept_chair', 'faculty'].includes(user.role);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchSchedules();
    fetchStatistics();
  }, [isFaculty, user?.id]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      
      // If user is faculty, fetch only their classes
      let response;
      if (isFaculty && user?.id) {
        response = await classSectionService.getFacultyClasses(user.id);
        
        // Handle faculty-specific response format
        if (response?.success && response?.data?.classes) {
          // Extract class_section from each assignment
          const facultySchedules = response.data.classes.map(item => item.class_section);
          setSchedules(facultySchedules);
        } else if (Array.isArray(response)) {
          setSchedules(response);
        }
      } else {
        // Admin and dept_chair can see all schedules
        response = await classSectionService.getAllSections({
          status: 'active',
        });
        
        // Handle both response formats
        if (Array.isArray(response)) {
          setSchedules(response);
        } else if (response?.success && response?.data) {
          setSchedules(response.data);
        }
      }
    } catch (error) {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // If user is faculty, pass their ID to get filtered statistics
      const params = isFaculty && user?.id ? { faculty_id: user.id } : {};
      const response = await classSectionService.getStatistics(params);
      
      // Handle both response formats
      if (response?.success && response?.data) {
        setStatistics(response.data);
      } else if (response && !response.success) {
        setStatistics(response);
      }
    } catch (error) {
      // Silently fail - statistics are not critical
    }
  };

  const handleCreate = () => {
    setSelectedSection(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (schedule) => {
    setSelectedSection(schedule);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (schedule) => {
    setSelectedSection(schedule);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEnroll = (schedule) => {
    setSelectedSection(schedule);
    setModalMode('enroll');
    setShowModal(true);
  };

  const handleDelete = (schedule) => {
    setSelectedSection(schedule);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await classSectionService.deleteSection(selectedSection.id);
      
      if (response?.success) {
        toast.success('Class section deleted successfully');
        fetchSchedules();
        fetchStatistics();
      } else {
        toast.error(response?.message || 'Failed to delete class section');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to delete class section');
    } finally {
      setShowDeleteModal(false);
      setSelectedSection(null);
    }
  };

  const handleModalSubmit = async (data) => {
    try {
      let response;
      
      if (modalMode === 'create') {
        response = await classSectionService.createSection(data);
      } else if (modalMode === 'edit') {
        response = await classSectionService.updateSection(selectedSection.id, data);
      }

      if (response.success) {
        toast.success(`Class section ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setShowModal(false);
        await fetchSchedules();
        await fetchStatistics();
      }
    } catch (error) {
      // Handle schedule conflict error with detailed information
      if (error.conflict) {
        const conflict = error.conflict;
        toast.error(
          `Schedule conflict: ${conflict.course_code} (${conflict.course_name}) is already scheduled in ${conflict.room || 'this room'} on ${conflict.day_of_week} from ${conflict.start_time} to ${conflict.end_time}`,
          { autoClose: 8000 }
        );
      } else {
        toast.error(error.message || `Failed to ${modalMode} class section`);
      }
      // Re-throw so modal knows there was an error
      throw error;
    }
  };

  // Callback to refresh data when enrollments change
  const handleEnrollmentChange = async () => {
    await fetchSchedules();
    await fetchStatistics();
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = filterDay === 'All' || schedule.day_of_week === filterDay;
    return matchesSearch && matchesDay;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = filteredSchedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDay]);

  const getCapacityColor = (students, capacity) => {
    const percentage = (students / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM'
  ];

  const getScheduleForSlot = (day, timeSlot) => {
    return schedules.find(s => {
      // Convert 24-hour time to 12-hour format with AM/PM
      const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      };
      
      // Parse slot start time
      const [slotStart] = timeSlot.split(' - ');
      const scheduleStartTime = formatTime(s.start_time);
      
      // Match if day matches and class starts within this time slot
      return s.day_of_week === day && scheduleStartTime === slotStart;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <SchedulingSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaClock className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {canManageSchedules ? 'Scheduling Management' : 'My Schedule'}
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            {canManageSchedules 
              ? 'Manage class schedules, room assignments, and faculty assignments'
              : 'View your assigned class schedules and teaching assignments'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.total_classes}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-gray-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Classes</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">{statistics.total_students}</div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-orange-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Students</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{statistics.unique_rooms || 0}</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDoorOpen className="text-green-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Rooms Used</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{Math.round(statistics.avg_capacity_percentage)}%</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Avg. Capacity</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              <div className="relative flex-1 sm:max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses, instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
                />
              </div>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md min-w-0 sm:min-w-[160px]"
              >
                <option value="All">All Days</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            
            {canManageSchedules && (
              <button
                onClick={handleCreate}
                className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden w-full lg:w-auto"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaPlus className="text-sm relative z-10" />
                <span className="relative z-10">Add Schedule</span>
              </button>
            )}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 sm:mb-8">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-4 xl:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{schedule.course_code}</div>
                        <div className="text-sm text-gray-500">{schedule.course_name}</div>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.instructor}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.day_of_week}</div>
                      <div className="text-sm text-gray-500">{schedule.start_time} - {schedule.end_time}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.room || 'TBA'}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getCapacityColor(schedule.current_enrollment, schedule.max_capacity)}`}>
                        {schedule.current_enrollment}/{schedule.max_capacity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((schedule.current_enrollment / schedule.max_capacity) * 100)}% full
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleView(schedule)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        {canEnrollStudents && (
                          <button 
                            onClick={() => handleEnroll(schedule)}
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="Enroll Students"
                          >
                            <FaUserPlus />
                          </button>
                        )}
                        {canManageSchedules && (
                          <>
                            <button 
                              onClick={() => handleEdit(schedule)}
                              className="text-orange-600 hover:text-orange-700 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(schedule)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {currentSchedules.map((schedule) => (
              <div key={schedule.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-black mb-1">{schedule.course_code}</h3>
                    <p className="text-sm text-gray-600 mb-2">{schedule.course_name}</p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{schedule.instructor}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{schedule.day_of_week} • {schedule.start_time} - {schedule.end_time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{schedule.room || 'TBA'}</span>
                        </div>
                        <div className={`text-sm font-medium ${getCapacityColor(schedule.current_enrollment, schedule.max_capacity)}`}>
                          {schedule.current_enrollment}/{schedule.max_capacity} ({Math.round((schedule.current_enrollment / schedule.max_capacity) * 100)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 text-sm">
                  <button 
                    onClick={() => handleView(schedule)}
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium flex items-center gap-1"
                  >
                    <FaEye /> View
                  </button>
                  {canEnrollStudents && (
                    <button 
                      onClick={() => handleEnroll(schedule)}
                      className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1"
                    >
                      <FaUserPlus /> Enroll
                    </button>
                  )}
                  {canManageSchedules && (
                    <>
                      <button 
                        onClick={() => handleEdit(schedule)}
                        className="text-orange-600 hover:text-orange-700 transition-colors font-medium flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(schedule)}
                        className="text-red-600 hover:text-red-700 transition-colors font-medium flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSchedules.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 text-sm sm:text-base">No schedules found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredSchedules.length > itemsPerPage && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSchedules.length)} of {filteredSchedules.length} schedules
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 rounded-lg border-2 transition-all ${
                            currentPage === pageNumber
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="px-2 py-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Schedule Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FaClock className="text-white text-lg" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Schedule Overview</h3>
          </div>
          
          {/* Desktop Grid View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 rounded-tl-lg">Time</th>
                  {days.map((day, index) => (
                    <th key={day} className={`px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 ${index === days.length - 1 ? 'rounded-tr-lg' : ''}`}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="border-t border-gray-100">
                    <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 font-medium bg-gray-50">{timeSlot}</td>
                    {days.map(day => {
                      const classInSlot = getScheduleForSlot(day, timeSlot);
                      return (
                        <td key={day} className="px-2 sm:px-4 py-4 text-center">
                          {classInSlot ? (
                            <div 
                              className="bg-linear-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-2 sm:p-3 text-xs hover:shadow-md transition-shadow duration-200 cursor-pointer"
                              onClick={() => handleView(classInSlot)}
                            >
                              <div className="font-bold text-gray-900 mb-1">{classInSlot.course_code}</div>
                              <div className="text-gray-700 font-medium">{classInSlot.room || 'TBA'}</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs py-2">Available</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Day-by-Day View */}
          <div className="md:hidden space-y-4">
            {days.map(day => {
              const daySchedules = schedules.filter(s => s.day_of_week === day);
              return (
                <div key={day} className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors duration-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    {day}
                  </h4>
                  <div className="space-y-2">
                    {timeSlots.map(timeSlot => {
                      const classInSlot = daySchedules.find(s => `${s.start_time} - ${s.end_time}` === timeSlot);
                      return (
                        <div key={timeSlot} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="text-xs text-gray-600 font-medium min-w-0 shrink-0 mr-3">
                            {timeSlot}
                          </div>
                          <div className="flex-1 text-right">
                            {classInSlot ? (
                              <div 
                                className="bg-linear-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg px-3 py-2 text-xs inline-block hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() => handleView(classInSlot)}
                              >
                                <div className="font-bold text-gray-900">{classInSlot.course_code}</div>
                                <div className="text-gray-700 font-medium mt-0.5">{classInSlot.room || 'TBA'}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Available</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ClassSectionModal
          mode={modalMode}
          section={selectedSection}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
          onEnrollmentChange={handleEnrollmentChange}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          section={selectedSection}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
      
      <ToastContainer />
    </AdminLayout>
  );
};

export default Scheduling;

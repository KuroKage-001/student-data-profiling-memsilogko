import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { FacultyList, FacultyProfileModal, FacultyFormModal } from '../../components/admin-components/faculty-profile-compo';
import { FacultyProfilesSkeleton } from '../../layouts/skeleton-loading';
import usePageTitle from '../../hooks/usePageTitle';
import useToast from '../../hooks/useToast';
import useFacultyProfileQuery from '../../hooks/faculty-profile-hook/useFacultyProfileQuery';
import { useAuth } from '../../context/AuthContext';
import { generateFacultyPDF } from '../../components/admin-components/faculty-profile-compo/facultyReportPdf.jsx';
import { exportFacultyToExcel, SEARCH_DEBOUNCE_DELAY } from '../../utils/admin-utilities/faculty-profile-utils';
import { FaChalkboardTeacher, FaSearch, FaPlus, FaFileExport, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FacultyProfiles = () => {
  usePageTitle('Faculty Profiles');
  
  const { user } = useAuth();
  const isDeptChair = user?.role === 'dept_chair';
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverErrors, setServerErrors] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    position: 'all',
    status: 'all'
  });

  // Use the cached query hook with initial filters
  const {
    faculty,
    loading,
    error,
    pagination,
    isFetching, // Background fetching indicator
    createFaculty,
    updateFaculty,
    searchFaculty,
    getDepartments,
    getPositions,
    getStatuses,
    formatFacultyForDisplay,
    generateFacultyId,
    clearError,
    prefetchFaculty, // Prefetch for faster navigation
    invalidateAll, // Force refresh all data
  } = useFacultyProfileQuery(filters);

  const { showSuccess, showError, showInfo } = useToast();

  // No need for initial fetch - React Query handles it automatically

  // Handle search with debounce
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      try {
        searchFaculty(searchTerm, filters);
      } catch (err) {
        showError('Failed to search faculty');
      }
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, filters]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleViewFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setIsViewModalOpen(true);
    // Prefetch faculty details for instant loading if user edits
    if (faculty.id) {
      prefetchFaculty(faculty.id);
    }
  };

  const handleEditFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setServerErrors(null);
    clearError(); // Clear any previous errors
    setIsFormModalOpen(true);
  };

  const handleAddFaculty = () => {
    setSelectedFaculty(null);
    setServerErrors(null);
    clearError(); // Clear any previous errors
    setIsFormModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedFaculty(null);
    clearError(); // Clear errors when closing
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedFaculty(null);
    setServerErrors(null);
    clearError(); // Clear errors when closing
  };

  const handleSubmitFaculty = async (facultyData, isEdit) => {
    setServerErrors(null);
    
    try {
      let result;
      
      if (isEdit) {
        result = await updateFaculty(selectedFaculty.id, facultyData);
      } else {
        result = await createFaculty(facultyData);
      }
      
      // Handle successful response
      if (result.success) {
        showSuccess(result.message || `Faculty ${isEdit ? 'updated' : 'created'} successfully`);
        handleCloseFormModal();
        return;
      }
      
      // Handle validation errors from server
      if (result.errors) {
        setServerErrors(result.errors);
        
        // Show specific error message or generic validation error
        const errorMessage = result.message || 'Please fix the validation errors';
        showError(errorMessage);
        return;
      }
      
      // Handle general failure without specific errors
      if (!result.success) {
        const errorMessage = result.message || `Failed to ${isEdit ? 'update' : 'create'} faculty`;
        showError(errorMessage);
        return;
      }
      
    } catch (err) {
      showError(err.message || 'An unexpected error occurred while saving the faculty');
    }
  };

  const handleExportList = () => {
    try {
      if (!faculty || faculty.length === 0) {
        showInfo('No faculty to export');
        return;
      }
      
      const filename = exportFacultyToExcel(faculty);
      showSuccess(`Faculty list exported successfully as ${filename}`);
    } catch (err) {
      showError(err.message || 'Failed to export faculty list');
    }
  };

  const handleGenerateReport = async (faculty) => {
    try {
      await generateFacultyPDF(faculty);
      showSuccess(`PDF report generated for ${faculty.name}`);
    } catch (err) {
      showError('Failed to generate PDF report');
    }
  };

  const handleFilterChange = (filterName, value) => {
    try {
      setFilters(prev => ({
        ...prev,
        [filterName]: value
      }));
      clearError(); // Clear any previous errors when filters change
    } catch (err) {
      showError('Failed to apply filter');
    }
  };

  // Get departments and filter for Admin role (only IT and CS)
  const allDepartments = getDepartments();
  const departments = isDeptChair 
    ? allDepartments 
    : allDepartments.filter(dept => 
        dept === 'IT' || dept === 'CS'
      );
  
  // Department display names mapping
  const departmentDisplayNames = {
    'IT': 'Information Technology',
    'CS': 'Computer Science',
    'Computer Engineering': 'Computer Engineering',
    'Data Science': 'Data Science',
    'Software Engineering': 'Software Engineering',
    'Information Systems': 'Information Systems',
    'Cybersecurity': 'Cybersecurity',
    'Artificial Intelligence': 'Artificial Intelligence',
    'Computer Networks': 'Computer Networks',
    'Web Development': 'Web Development'
  };
  
  const positions = getPositions();
  const statuses = getStatuses();

  // Show skeleton loading while data is being fetched initially
  if (loading && !faculty.length) {
    return (
      <AdminLayout>
        <ToastContainer />
        <FacultyProfilesSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
        {/* Header Section with Enhanced Design */}
        <div className="mb-4 sm:mb-6 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FaChalkboardTeacher className="text-white text-base sm:text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {isDeptChair && user?.department ? `${user.department} Faculty Profiles` : 'Faculty Profiles'}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 ml-10 sm:ml-13 font-medium">
            {isDeptChair && user?.department 
              ? `${user.department} department faculty information and professional development`
              : 'Faculty information and professional development management'
            }
          </p>
        </div>

        {/* Search and Actions Section - Enhanced Design */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 mb-4 sm:mb-6 shrink-0">
          {/* Cache Status Indicator */}
          {isFetching && !loading && (
            <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Updating faculty data in background...</span>
            </div>
          )}
          
          <div className="space-y-2.5 sm:space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center lg:justify-between">
            {/* Search Input with Icon */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-xs sm:text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons - Enhanced */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button 
                onClick={handleAddFaculty}
                className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 active:scale-95 text-white px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm flex-1 sm:flex-none">
                <FaPlus className="text-xs" />
                <span>Add Faculty</span>
              </button>
              <button 
                onClick={handleExportList}
                className="group bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-700 active:text-white px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm flex-1 sm:flex-none">
                <FaFileExport className="text-xs" />
                <span>Export</span>
              </button>
              <button 
                onClick={invalidateAll}
                disabled={isFetching}
                title="Refresh faculty data"
                className="group bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm">
                <svg className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters Toggle Button (Mobile Only) */}
          <div className="mt-3 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-lg transition-all text-gray-700 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <FaFilter className="text-xs text-orange-600" />
                <span>Filters</span>
                {(filters.department !== 'all' || filters.position !== 'all' || filters.status !== 'all') && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-600 rounded-full">
                    {[filters.department !== 'all', filters.position !== 'all', filters.status !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </div>
              {showFilters ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>
          </div>

          {/* Filters Section */}
          <div className={`mt-3 pt-3 border-t border-gray-200 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* Department Filter - Hidden for Dept Chair */}
              {!isDeptChair && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {departmentDisplayNames[dept] || dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Positions</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Faculty List - Enhanced Container - Scrollable */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
          <FacultyList 
            searchTerm={searchTerm}
            onViewFaculty={handleViewFaculty}
            onEditFaculty={handleEditFaculty}
            faculty={faculty}
            loading={loading}
            error={error}
          />
        </div>

        {/* View Modal */}
        {isViewModalOpen && selectedFaculty && (
          <FacultyProfileModal
            faculty={selectedFaculty}
            onClose={handleCloseViewModal}
            onEdit={() => {
              handleCloseViewModal();
              handleEditFaculty(selectedFaculty);
            }}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {/* Form Modal */}
        {isFormModalOpen && (
          <FacultyFormModal
            faculty={selectedFaculty}
            onClose={handleCloseFormModal}
            onSubmit={handleSubmitFaculty}
            loading={loading}
            serverErrors={serverErrors}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default FacultyProfiles;
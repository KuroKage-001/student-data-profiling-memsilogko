import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { FacultyList, FacultyProfileModal, FacultyFormModal, DeleteConfirmModal } from '../../components/admin-components/faculty-profile-compo';
import { FacultyProfilesSkeleton } from '../../layouts/skeleton-loading';
import usePageTitle from '../../hooks/usePageTitle';
import useToast from '../../hooks/useToast';
import useFacultyProfile from '../../hooks/faculty-profile-hook/useFacultyProfile';
import { generateFacultyPDF } from '../../components/admin-components/faculty-profile-compo/facultyReportPdf.jsx';
import { exportFacultyToExcel, SEARCH_DEBOUNCE_DELAY } from '../../utils/admin-utilities/faculty-profile-utils';
import { FaChalkboardTeacher, FaSearch, FaPlus, FaFileExport, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FacultyProfiles = () => {
  usePageTitle('Faculty Profiles');
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverErrors, setServerErrors] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    position: 'all',
    status: 'all'
  });

  const {
    faculty,
    loading,
    error,
    pagination,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    searchFaculty,
    getDepartments,
    getPositions,
    getStatuses,
    formatFacultyForDisplay,
    generateFacultyId,
    clearError
  } = useFacultyProfile();

  const { showSuccess, showError, showInfo } = useToast();

  // Fetch faculty on component mount
  useEffect(() => {
    fetchFaculty();
  }, []);

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
  };

  const handleEditFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setServerErrors(null);
    clearError(); // Clear any previous errors
    setIsFormModalOpen(true);
  };

  const handleDeleteFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    clearError(); // Clear any previous errors
    setIsDeleteModalOpen(true);
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

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFaculty(null);
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

  const handleConfirmDelete = async (facultyId) => {
    try {
      const result = await deleteFaculty(facultyId);
      
      if (result.success) {
        showSuccess(result.message || 'Faculty deleted successfully');
        handleCloseDeleteModal();
      } else {
        const errorMessage = result.message || 'Failed to delete faculty';
        showError(errorMessage);
      }
    } catch (err) {
      showError(err.message || 'An unexpected error occurred while deleting the faculty');
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

  const departments = getDepartments();
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
                Faculty Profiles
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 ml-10 sm:ml-13 font-medium">
            Faculty information and professional development management
          </p>
        </div>

        {/* Search and Actions Section - Enhanced Design */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 mb-4 sm:mb-6 shrink-0">
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
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
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
            onDeleteFaculty={handleDeleteFaculty}
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

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedFaculty && (
          <DeleteConfirmModal
            faculty={selectedFaculty}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default FacultyProfiles;
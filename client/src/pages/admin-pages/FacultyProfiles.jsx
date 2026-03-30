import { useState, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import AdminLayout from '../../layouts/AdminLayout';
import { FacultyList, FacultyProfileModal, FacultyFormModal, DeleteConfirmModal } from '../../components/admin-components/faculty-profile-compo';
import usePageTitle from '../../hooks/usePageTitle';
import useToast from '../../hooks/useToast';
import useFacultyProfile from '../../hooks/faculty-profile-hook/useFacultyProfile';
import { generateFacultyPDF } from '../../utils/admin-utilities/faculty-profile-utils/facultyReportPdf.jsx';
import { FaChalkboardTeacher, FaSearch, FaPlus, FaFileExport } from 'react-icons/fa';

const FacultyProfiles = () => {
  usePageTitle('Faculty Profiles');
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverErrors, setServerErrors] = useState(null);
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

  // Handle search
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      try {
        searchFaculty(searchTerm, filters);
      } catch (err) {
        console.error('Search error:', err);
        showError('Failed to search faculty');
      }
    }, 500);

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
    console.log('=== FACULTY SUBMIT DEBUG ===');
    console.log('Is Edit Mode:', isEdit);
    console.log('Selected Faculty ID:', selectedFaculty?.id);
    console.log('Faculty Data:', JSON.stringify(facultyData, null, 2));
    
    setServerErrors(null);
    
    try {
      let result;
      
      if (isEdit) {
        console.log('Calling updateFaculty with ID:', selectedFaculty.id);
        result = await updateFaculty(selectedFaculty.id, facultyData);
        console.log('Update result:', JSON.stringify(result, null, 2));
      } else {
        console.log('Calling createFaculty');
        result = await createFaculty(facultyData);
        console.log('Create result:', JSON.stringify(result, null, 2));
      }
      
      // Handle successful response
      if (result.success) {
        showSuccess(result.message || `Faculty ${isEdit ? 'updated' : 'created'} successfully`);
        handleCloseFormModal();
        return;
      }
      
      // Handle validation errors from server
      if (result.errors) {
        console.error('Server validation errors:', result.errors);
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
      console.error('Unexpected error:', err);
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
      console.error('Delete error:', err);
      showError(err.message || 'An unexpected error occurred while deleting the faculty');
    }
  };

  const handleExportList = () => {
    try {
      if (!faculty || faculty.length === 0) {
        showInfo('No faculty to export');
        return;
      }
      
      // Prepare data for export
      const exportData = faculty.map((member, index) => ({
        'No.': index + 1,
        'Faculty ID': member.faculty_id || member.id,
        'Name': member.name,
        'Email': member.email || 'N/A',
        'Phone': member.phone || 'N/A',
        'Department': member.department || 'N/A',
        'Position': member.position || 'N/A',
        'Specialization': member.specialization || 'N/A',
        'Office': member.office || 'N/A',
        'Status': member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'N/A',
        'Hire Date': member.hire_date || member.hireDate 
          ? new Date(member.hire_date || member.hireDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })
          : 'N/A',
        'Address': member.address || 'N/A',
        'Notes': member.notes || 'N/A'
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 5 },  // No.
        { wch: 12 }, // Faculty ID
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 25 }, // Department
        { wch: 20 }, // Position
        { wch: 25 }, // Specialization
        { wch: 12 }, // Office
        { wch: 10 }, // Status
        { wch: 15 }, // Hire Date
        { wch: 30 }, // Address
        { wch: 40 }  // Notes
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Faculty List');

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `Faculty_List_${date}.xlsx`;

      // Write file
      XLSX.writeFile(wb, filename);

      showSuccess(`Faculty list exported successfully as ${filename}`);
    } catch (err) {
      console.error('Export error:', err);
      showError(err.message || 'Failed to export faculty list');
    }
  };

  const handleGenerateReport = async (faculty) => {
    try {
      await generateFacultyPDF(faculty);
      showSuccess(`PDF report generated for ${faculty.name}`);
    } catch (err) {
      console.error('Report generation error:', err);
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
      console.error('Filter change error:', err);
      showError('Failed to apply filter');
    }
  };

  const departments = getDepartments();
  const positions = getPositions();
  const statuses = getStatuses();

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Header Section with Enhanced Design */}
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaChalkboardTeacher className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Faculty Profiles
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-13 font-medium">
            Faculty information and professional development management
          </p>
        </div>

        {/* Search and Actions Section - Enhanced Design */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6 shrink-0">
          <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center lg:justify-between">
            {/* Search Input with Icon */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search faculty by name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons - Enhanced */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button 
                onClick={handleAddFaculty}
                className="group relative bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm">
                <FaPlus className="text-xs" />
                <span>Add Faculty</span>
              </button>
              <button 
                onClick={handleExportList}
                className="group bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm">
                <FaFileExport className="text-xs" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
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
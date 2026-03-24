import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { StudentList, StudentFormModal, DeleteConfirmModal } from '../../components/admin-components/student-profile-compo';
import StudentProfileModal from '../../components/student-components/student-profile/StudentProfileModal';
import usePageTitle from '../../hooks/usePageTitle';
import useStudentProfile from '../../hooks/student-profile-hook/useStudentProfile';
import useToast from '../../hooks/useToast';
import { exportToCSV } from '../../utils/admin-utilities/student-profile-utils';
import { FaUserGraduate, FaSearch, FaPlus, FaFileExport, FaSync } from 'react-icons/fa';

// Import auth debug utility (for development)
if (import.meta.env.DEV) {
  import('../../utils/admin-utilities/authDebug');
}

const StudentProfiles = () => {
  usePageTitle('Student Profiles');
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverErrors, setServerErrors] = useState(null);
  const [filters, setFilters] = useState({
    program: 'all',
    yearLevel: 'all',
    status: 'all'
  });

  const {
    students,
    loading,
    error,
    pagination,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    getPrograms,
    getYearLevels,
    getStatuses,
    formatStudentForDisplay,
    generateStudentId,
    clearError
  } = useStudentProfile();

  const { showSuccess, showError, showInfo } = useToast();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle search
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      try {
        searchStudents(searchTerm, filters);
      } catch (err) {
        console.error('Search error:', err);
        showError('Failed to search students');
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

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setServerErrors(null);
    clearError(); // Clear any previous errors
    setIsFormModalOpen(true);
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    clearError(); // Clear any previous errors
    setIsDeleteModalOpen(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setServerErrors(null);
    clearError(); // Clear any previous errors
    setIsFormModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
    clearError(); // Clear errors when closing
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedStudent(null);
    setServerErrors(null);
    clearError(); // Clear errors when closing
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
    clearError(); // Clear errors when closing
  };

  const handleSubmitStudent = async (studentData, isEdit) => {
    console.log('Submitting student data:', studentData);
    setServerErrors(null);
    
    try {
      let result;
      
      if (isEdit) {
        result = await updateStudent(selectedStudent.id, studentData);
        console.log('Update result:', result);
      } else {
        result = await createStudent(studentData);
        console.log('Create result:', result);
      }
      
      // Handle successful response
      if (result.success) {
        showSuccess(result.message || `Student ${isEdit ? 'updated' : 'created'} successfully`);
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
        const errorMessage = result.message || `Failed to ${isEdit ? 'update' : 'create'} student`;
        showError(errorMessage);
        return;
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
      showError(err.message || 'An unexpected error occurred while saving the student');
    }
  };

  const handleConfirmDelete = async (studentId) => {
    try {
      const result = await deleteStudent(studentId);
      
      if (result.success) {
        showSuccess(result.message || 'Student deleted successfully');
        handleCloseDeleteModal();
      } else {
        const errorMessage = result.message || 'Failed to delete student';
        showError(errorMessage);
      }
    } catch (err) {
      console.error('Delete error:', err);
      showError(err.message || 'An unexpected error occurred while deleting the student');
    }
  };

  const handleExportList = () => {
    try {
      if (!students || students.length === 0) {
        showInfo('No students to export');
        return;
      }
      
      exportToCSV(students, `students_${new Date().toISOString().split('T')[0]}.csv`);
      showSuccess(`Successfully exported ${students.length} student(s) to CSV`);
    } catch (err) {
      console.error('Export error:', err);
      showError(err.message || 'Failed to export student list');
    }
  };

  const handleRefresh = async () => {
    try {
      await fetchStudents();
      showInfo('Student list refreshed');
    } catch (err) {
      console.error('Refresh error:', err);
      showError('Failed to refresh student list');
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

  const handleGenerateReport = (student) => {
    try {
      // Generate a formatted text report
      const report = `
STUDENT PROFILE REPORT
=====================

Personal Information:
- Name: ${student.name}
- Student ID: ${student.student_id || student.id}
- Email: ${student.email || 'N/A'}
- Phone: ${student.phone || 'N/A'}
- Address: ${student.address || 'N/A'}

Academic Information:
- Program: ${student.program || 'N/A'}
- Year Level: ${student.year_level || 'N/A'}
- GPA: ${student.gpa ? parseFloat(student.gpa).toFixed(2) : 'N/A'}
- Status: ${student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : 'N/A'}
- Enrollment Date: ${student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
- Expected Graduation: ${student.graduation_date ? new Date(student.graduation_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}

Guardian Information:
- Guardian Name: ${student.guardian_name || 'N/A'}
- Guardian Phone: ${student.guardian_phone || 'N/A'}

Additional Notes:
${student.notes || 'No additional notes'}

Generated on: ${new Date().toLocaleString()}
      `.trim();

      // Create a blob and download
      const blob = new Blob([report], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_report_${student.student_id || student.id}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess(`Report generated for ${student.name}`);
    } catch (err) {
      showError('Failed to generate report');
    }
  };

  const programs = getPrograms();
  const yearLevels = getYearLevels();
  const statuses = getStatuses();

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUserGraduate className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Student Profiles
              </h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 ml-13 font-medium">
            Comprehensive student data management and profiling
          </p>
        </div>

        {/* Search and Actions Section - Enhanced Design */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6">
          <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center lg:justify-between">
            {/* Search Input with Icon */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search students by name, ID, or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons - Enhanced */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={handleAddStudent}
                className="group relative bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm"
              >
                <FaPlus className="text-xs" />
                <span>Add Student</span>
              </button>
              <button
                onClick={handleExportList}
                className="group bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm"
              >
                <FaFileExport className="text-xs" />
                <span>Export</span>
              </button>
              <button
                onClick={handleRefresh}
                className="group bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm"
              >
                <FaSync className="text-xs" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Program
                </label>
                <select
                  value={filters.program}
                  onChange={(e) => handleFilterChange('program', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Programs</option>
                  {programs.map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Year Level
                </label>
                <select
                  value={filters.yearLevel}
                  onChange={(e) => handleFilterChange('yearLevel', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Year Levels</option>
                  {yearLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
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

        {/* Student List - Enhanced Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <StudentList 
            searchTerm={searchTerm}
            onViewStudent={handleViewStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            loading={loading}
            error={error}
            students={students}
          />
        </div>

        {/* View Modal */}
        {isViewModalOpen && selectedStudent && (
          <StudentProfileModal
            student={selectedStudent}
            onClose={handleCloseViewModal}
            onEdit={() => {
              handleCloseViewModal();
              handleEditStudent(selectedStudent);
            }}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {/* Form Modal */}
        {isFormModalOpen && (
          <StudentFormModal
            student={selectedStudent}
            onClose={handleCloseFormModal}
            onSubmit={handleSubmitStudent}
            loading={loading}
            serverErrors={serverErrors}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedStudent && (
          <DeleteConfirmModal
            student={selectedStudent}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentProfiles;
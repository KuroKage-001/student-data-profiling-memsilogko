import { useState, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { StudentList, StudentFormModal, DeleteConfirmModal } from '../../components/admin-components/student-profile-compo';
import StudentProfileModal from '../../components/student-components/student-profile/StudentProfileModal';
import usePageTitle from '../../hooks/usePageTitle';
import { 
  useStudents, 
  useCreateStudent, 
  useUpdateStudent, 
  useDeleteStudent,
  getPrograms,
  getYearLevels,
  generateStudentId
} from '../../hooks/student-profile-hook';
import useToast from '../../hooks/useToast';
import { exportToExcel } from '../../utils/admin-utilities/student-profile-utils';
import { FaUserGraduate, FaSearch, FaPlus, FaFileExport } from 'react-icons/fa';

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
    skills: '',
    activities: ''
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (filters.program !== 'all') params.program = filters.program;
    if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
    if (filters.skills) params.skills = filters.skills;
    if (filters.activities) params.activities = filters.activities;
    return params;
  }, [searchTerm, filters]);

  // React Query hooks
  const { data: students = [], isLoading, error } = useStudents(queryParams);
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  const { showSuccess, showError, showInfo } = useToast();

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      showError(error.message || 'Failed to fetch students');
    }
  }, [error, showError]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setServerErrors(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteStudent = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setServerErrors(null);
    setIsFormModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedStudent(null);
    setServerErrors(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSubmitStudent = async (studentData, isEdit) => {
    setServerErrors(null);
    
    try {
      if (isEdit) {
        const result = await updateStudentMutation.mutateAsync({ 
          id: selectedStudent.id, 
          studentData 
        });
        showSuccess(result.message || 'Student updated successfully');
      } else {
        const result = await createStudentMutation.mutateAsync(studentData);
        showSuccess(result.message || 'Student created successfully');
      }
      handleCloseFormModal();
    } catch (err) {
      // Handle validation errors
      if (err.errors) {
        setServerErrors(err.errors);
      }
      showError(err.message || `Failed to ${isEdit ? 'update' : 'create'} student`);
    }
  };

  const handleConfirmDelete = async (studentId) => {
    try {
      const result = await deleteStudentMutation.mutateAsync(studentId);
      showSuccess(result.message || 'Student deleted successfully');
      handleCloseDeleteModal();
    } catch (err) {
      showError(err.message || 'Failed to delete student');
    }
  };

  const handleExportList = () => {
    try {
      if (!students || students.length === 0) {
        showInfo('No students to export');
        return;
      }
      
      exportToExcel(students, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
      showSuccess(`Successfully exported ${students.length} student(s) to Excel`);
    } catch (err) {
      showError(err.message || 'Failed to export student list');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
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

Skills & Activities:
- Skills: ${student.skills || 'N/A'}
- Extracurricular Activities: ${student.extracurricular_activities || 'N/A'}

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

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Header Section */}
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
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

        {/* Search and Actions Section */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6 shrink-0">
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
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={handleAddStudent}
                className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm"
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
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="Filter by skills..."
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Activities
                </label>
                <input
                  type="text"
                  placeholder="Filter by activities..."
                  value={filters.activities}
                  onChange={(e) => handleFilterChange('activities', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Student List - Scrollable */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
          <StudentList 
            searchTerm={searchTerm}
            onViewStudent={handleViewStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            loading={isLoading}
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
            loading={createStudentMutation.isPending || updateStudentMutation.isPending}
            serverErrors={serverErrors}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedStudent && (
          <DeleteConfirmModal
            student={selectedStudent}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            loading={deleteStudentMutation.isPending}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentProfiles;
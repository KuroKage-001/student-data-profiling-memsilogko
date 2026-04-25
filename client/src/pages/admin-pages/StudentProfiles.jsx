import { useState, useEffect, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import { StudentList, StudentFormModal, StudentProfileModal } from '../../components/admin-components/student-profile-compo';
import { StudentProfilesSkeleton } from '../../layouts/skeleton-loading';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';
import { 
  useStudents, 
  useCreateStudent, 
  useUpdateStudent,
  getPrograms,
  getYearLevels,
  generateStudentId
} from '../../hooks/useStudentProfile';
import useToast from '../../hooks/useToast';
import { exportToExcel } from '../../utils/admin-utilities/student-profile-utils';
import { generateStudentPDF } from '../../utils/admin-utilities/pdfGenerator';
import { FaUserGraduate, FaSearch, FaPlus, FaFileExport, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const StudentProfiles = () => {
  usePageTitle('Student Profiles');
  
  const { user } = useAuth();
  const isDeptChair = user?.role === 'dept_chair';
  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';
  const userDepartment = user?.department;
  
  // Only admin and dept_chair can create/edit students
  const canModifyStudents = isAdmin || isDeptChair;
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverErrors, setServerErrors] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    program: 'all',
    yearLevel: 'all',
    skills: '',
    activities: '',
    status: 'all'
  });

  // Build query params (exclude searchTerm - it's client-side only)
  const queryParams = useMemo(() => {
    const params = {};
    // searchTerm is handled client-side in StudentList component
    if (filters.program !== 'all') params.program = filters.program;
    if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
    if (filters.skills) params.skills = filters.skills;
    if (filters.activities) params.activities = filters.activities;
    if (filters.status !== 'all') params.status = filters.status;
    
    // For dept_chair, filter by their department
    if (isDeptChair && userDepartment) {
      params.department = userDepartment;
    }
    
    return params;
  }, [filters, isDeptChair, userDepartment]); // Add isDeptChair and userDepartment to dependencies

  // React Query hooks
  const { data: students = [], isLoading, error } = useStudents(queryParams);
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();

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

  const handleGenerateReport = async (student) => {
    try {
      await generateStudentPDF(student);
      showSuccess(`PDF report generated for ${student.name}`);
    } catch (err) {
      showError('Failed to generate PDF report');
    }
  };

  const programs = getPrograms();
  const yearLevels = getYearLevels();

  // Filter programs for dept_chair based on their department
  const availablePrograms = useMemo(() => {
    if (!isDeptChair || !userDepartment) {
      return programs;
    }
    
    // Map departments to their programs
    const departmentPrograms = {
      'IT': ['BSIT', 'Information Technology'],
      'CS': ['BSCS', 'Computer Science'],
      'CE': ['BSCpE', 'Computer Engineering'],
      'DS': ['BSDS', 'Data Science'],
    };
    
    return programs.filter(program => {
      const deptPrograms = departmentPrograms[userDepartment] || [];
      return deptPrograms.some(dp => program.includes(dp));
    });
  }, [programs, isDeptChair, userDepartment]);

  // Show skeleton loading while data is being fetched
  if (isLoading) {
    return (
      <AdminLayout>
        <ToastContainer />
        <StudentProfilesSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FaUserGraduate className="text-white text-base sm:text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {isDeptChair && userDepartment ? `${userDepartment} Student Profiles` : 'Student Profiles'}
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 ml-10 sm:ml-13 font-medium">
            {isDeptChair && userDepartment 
              ? `${userDepartment} department student data management and profiling`
              : 'Comprehensive student data management and profiling'
            }
          </p>
        </div>

        {/* Search and Actions Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 mb-4 sm:mb-6 shrink-0">
          {/* Department Filter Indicator for Dept Chair */}
          {isDeptChair && userDepartment && (
            <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Viewing <strong>{userDepartment}</strong> department students only</span>
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
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {canModifyStudents && (
                <button
                  onClick={handleAddStudent}
                  className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 active:scale-95 text-white px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm flex-1 sm:flex-none"
                >
                  <FaPlus className="text-xs" />
                  <span>Add Student</span>
                </button>
              )}
              <button
                onClick={handleExportList}
                className="group bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-700 active:text-white px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm flex-1 sm:flex-none"
              >
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
                {(filters.program !== 'all' || filters.yearLevel !== 'all' || filters.skills || filters.activities || filters.status !== 'all') && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-600 rounded-full">
                    {[filters.program !== 'all', filters.yearLevel !== 'all', filters.skills, filters.activities, filters.status !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </div>
              {showFilters ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>
          </div>

          {/* Filters Section */}
          <div className={`mt-3 pt-3 border-t border-gray-200 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Program
                </label>
                <select
                  value={filters.program}
                  onChange={(e) => handleFilterChange('program', e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isDeptChair && availablePrograms.length === 0}
                >
                  <option value="all">
                    {isDeptChair && userDepartment 
                      ? `All ${userDepartment} Programs` 
                      : 'All Programs'
                    }
                  </option>
                  {availablePrograms.map(program => (
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
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
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
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
                />
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Student List - Scrollable */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
          <StudentList 
            searchTerm={searchTerm}
            onViewStudent={handleViewStudent}
            onEditStudent={canModifyStudents ? handleEditStudent : null}
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
            onEdit={canModifyStudents ? () => {
              handleCloseViewModal();
              handleEditStudent(selectedStudent);
            } : null}
            onGenerateReport={handleGenerateReport}
            userRole={user?.role}
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
      </div>
    </AdminLayout>
  );
};

export default StudentProfiles;
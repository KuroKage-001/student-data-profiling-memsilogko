import { useState, useMemo, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const StudentList = ({ searchTerm, onViewStudent, onEditStudent, loading, error, students }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    const term = searchTerm.toLowerCase();
    return students.filter(student =>
      student.name?.toLowerCase().includes(term) ||
      String(student.student_id || '').toLowerCase().includes(term) ||
      String(student.student_number || '').toLowerCase().includes(term) ||
      student.program?.toLowerCase().includes(term) ||
      student.email?.toLowerCase().includes(term) ||
      student.skills?.toLowerCase().includes(term) ||
      student.extracurricular_activities?.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const formatGPA = (gpa) => {
    if (!gpa && gpa !== 0) return 'N/A';
    const gpaNumber = parseFloat(gpa);
    if (isNaN(gpaNumber)) return 'N/A';
    return gpaNumber.toFixed(2);
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-600 text-sm">Error: {error.message || error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Desktop Table View */}
      <div className="hidden lg:block flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-linear-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Student
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Program
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Year
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                GPA
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.map((student) => (
              <tr key={student.id} className="hover:bg-orange-50/30 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <div className="text-base font-bold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-600 mt-0.5">
                      {student.student_number || student.student_id || student.id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-800 font-medium">{student.program || 'N/A'}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-800 font-medium">{student.year_level || 'N/A'}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base font-bold text-gray-900">
                    {formatGPA(student.gpa)}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-lg transition-all duration-200 font-semibold"
                    >
                      View
                    </button>
                    {onEditStudent && (
                      <button
                        onClick={() => onEditStudent(student)}
                        className="px-3 py-1.5 text-sm text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-600 rounded-lg transition-all duration-200 font-semibold"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden flex-1 overflow-auto">
        {currentStudents.map((student) => (
          <div key={student.id} className="border-b border-gray-200 last:border-b-0 p-4 sm:p-5 hover:bg-orange-50/30 transition-colors active:bg-orange-50/50">
            <div className="space-y-3">
              {/* Student Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 wrap-break-word">{student.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2.5 break-all">
                  {student.student_number || student.student_id || student.id}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
                  <span className="text-gray-800 font-medium">{student.program || 'N/A'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-800 font-medium">{student.year_level || 'N/A'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700">
                    <span className="text-gray-600">GPA: </span>
                    <span className="font-bold text-gray-900">{formatGPA(student.gpa)}</span>
                  </span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onViewStudent(student)}
                  className={`${onEditStudent ? 'flex-1' : 'w-full'} px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-blue-600 hover:text-white hover:bg-blue-600 active:bg-blue-700 border-2 border-blue-600 rounded-lg transition-all duration-200 font-semibold touch-manipulation`}
                >
                  View
                </button>
                {onEditStudent && (
                  <button
                    onClick={() => onEditStudent(student)}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-orange-600 hover:text-white hover:bg-orange-600 active:bg-orange-700 border-2 border-orange-600 rounded-lg transition-all duration-200 font-semibold touch-manipulation"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="h-full flex items-center justify-center py-8 sm:py-12 px-4">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FaSearch className="text-gray-400 text-xl sm:text-2xl" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base font-medium">No students found</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shrink-0">
          <div className="flex-1 flex justify-between items-center gap-2 sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 sm:px-4 py-2 border-2 border-gray-300 text-xs sm:text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all"
            >
              Previous
            </button>
            <span className="text-xs sm:text-sm font-medium text-gray-700 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 sm:px-4 py-2 border-2 border-gray-300 text-xs sm:text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
                <span className="font-medium">{filteredStudents.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;

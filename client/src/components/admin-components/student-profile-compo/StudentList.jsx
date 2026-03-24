import { useState, useEffect, useMemo } from 'react';

const StudentList = ({ searchTerm, onViewStudent, onEditStudent, onDeleteStudent, loading, error, students }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = students.slice(startIndex, endIndex);

  // Reset to page 1 when search changes or students change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, students.length]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatGPA = (gpa) => {
    if (!gpa && gpa !== 0) return 'N/A';
    const gpaNumber = parseFloat(gpa);
    if (isNaN(gpaNumber)) return 'N/A';
    return gpaNumber.toFixed(2);
  };

  const capitalize = (str) => {
    if (!str) return 'N/A';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        <p className="text-gray-500 text-sm">No students found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Desktop Table View */}
      <div className="hidden lg:block flex-1 overflow-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100 hover:scrollbar-thumb-orange-600">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                GPA
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.student_id || student.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{student.program || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{student.year_level || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatGPA(student.gpa)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {capitalize(student.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditStudent(student)}
                      className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteStudent(student)}
                      className="text-red-600 hover:text-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden flex-1 overflow-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100 hover:scrollbar-thumb-orange-600">
        {currentStudents.map((student) => (
          <div key={student.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{student.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{student.student_id || student.id}</p>
                <div className="flex flex-wrap gap-2 text-sm mb-2">
                  <span className="text-gray-700">{student.program || 'N/A'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700">{student.year_level || 'N/A'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                    {capitalize(student.status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">GPA: </span>
                <span className="font-semibold text-gray-900">
                  {formatGPA(student.gpa)}
                </span>
              </div>
              
              <div className="flex space-x-3 text-sm">
                <button
                  onClick={() => onViewStudent(student)}
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  View
                </button>
                <button
                  onClick={() => onEditStudent(student)}
                  className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteStudent(student)}
                  className="text-red-600 hover:text-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && !loading && (
        <div className="flex items-center justify-center py-12 px-4">
          <p className="text-gray-500 text-sm">No students found matching your search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {students.length > 0 && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, students.length)}</span> of{' '}
                <span className="font-medium">{students.length}</span> results
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

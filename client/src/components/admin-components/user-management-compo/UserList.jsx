import { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getStatusColor, getRoleColor, capitalize } from '../../../utils/admin-utilities/user-management-utils/userHelpers';

const UserList = ({ users, searchTerm, onEditUser, onDeleteUser, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Desktop Table View */}
      <div className="hidden lg:block flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-linear-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Created At
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-orange-50/30 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <div className="text-base font-bold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div>
                    <span className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role === 'dept_chair' ? 'Dept. Chairman' : capitalize(user.role)}
                    </span>
                    {user.role === 'dept_chair' && user.department && (
                      <div className="text-xs text-gray-600 mt-1 font-medium">
                        {user.department} Department
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-full ${getStatusColor(user.status)}`}>
                    {capitalize(user.status)}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-800 font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onEditUser(user)}
                      className="px-3 py-1.5 text-sm text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-600 rounded-lg transition-all duration-200 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-200 font-semibold"
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
      <div className="lg:hidden flex-1 overflow-auto">
        {currentUsers.map((user) => (
          <div key={user.id} className="border-b border-gray-200 last:border-b-0 p-4 sm:p-5 hover:bg-orange-50/30 transition-colors active:bg-orange-50/50">
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 wrap-break-word">{user.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2.5 break-all">{user.email}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span className={`inline-flex px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-bold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role === 'dept_chair' ? 'Dept. Chairman' : capitalize(user.role)}
                  </span>
                  {user.role === 'dept_chair' && user.department && (
                    <span className="inline-flex px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.department}
                    </span>
                  )}
                  <span className={`inline-flex px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-bold rounded-full ${getStatusColor(user.status)}`}>
                    {capitalize(user.status)}
                  </span>
                </div>
              </div>
              
              {/* Date and Actions */}
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2.5 pt-3 border-t border-gray-200">
                <div className="text-xs sm:text-sm text-gray-700 font-medium">
                  Created: {new Date(user.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                
                <div className="flex gap-2 text-xs sm:text-sm">
                  <button
                    onClick={() => onEditUser(user)}
                    className="flex-1 xs:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-orange-600 hover:text-white hover:bg-orange-600 active:bg-orange-700 border-2 border-orange-600 rounded-lg transition-all duration-200 font-semibold touch-manipulation"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="flex-1 xs:flex-none px-4 sm:px-5 py-2 sm:py-2.5 text-red-600 hover:text-white hover:bg-red-600 active:bg-red-700 border-2 border-red-600 rounded-lg transition-all duration-200 font-semibold touch-manipulation"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredUsers.length === 0 && !loading && (
        <div className="flex items-center justify-center py-8 sm:py-12 px-4">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FaSearch className="text-gray-400 text-xl sm:text-2xl" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base font-medium">No users found</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
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
                <span className="font-medium">{Math.min(endIndex, filteredUsers.length)}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
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

export default UserList;

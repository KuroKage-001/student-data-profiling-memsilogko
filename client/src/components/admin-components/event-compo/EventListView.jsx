import { useMemo, useState } from 'react';
import { FaCalendarAlt, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const EventListView = ({ events, onEdit, onDelete, getStatusColor }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 10;

  // Sorting function
  const sortedEvents = useMemo(() => {
    if (!sortConfig.key) return events;

    const sorted = [...events].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle numeric sorting (attendees)
      if (sortConfig.key === 'attendees') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [events, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = sortedEvents.slice(startIndex, endIndex);

  // Reset to page 1 when sorting changes
  useMemo(() => {
    setCurrentPage(1);
  }, [sortConfig]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-orange-600" /> : 
      <FaSortDown className="text-orange-600" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-linear-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
            <tr>
              <th 
                className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  <span>Event</span>
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-2">
                  <span>Date & Time</span>
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center gap-2">
                  <span>Location</span>
                  {getSortIcon('location')}
                </div>
              </th>
              <th 
                className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-2">
                  <span>Type</span>
                  {getSortIcon('type')}
                </div>
              </th>
              <th 
                className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('attendees')}
              >
                <div className="flex items-center gap-2">
                  <span>Attendees</span>
                  {getSortIcon('attendees')}
                </div>
              </th>
              <th className="px-4 xl:px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEvents.map((event) => (
              <tr key={event.id} className="hover:bg-orange-50/30 transition-colors">
                <td className="px-4 xl:px-6 py-5">
                  <div>
                    <div className="text-base font-bold text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-900 font-medium">{event.date}</div>
                  <div className="text-sm text-gray-600 mt-0.5">{event.time}</div>
                </td>
                <td className="px-4 xl:px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-800 font-medium">{event.location}</div>
                </td>
                <td className="px-4 xl:px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-800 font-medium">{event.type}</div>
                </td>
                <td className="px-4 xl:px-6 py-5 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1.5 text-sm font-bold rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-4 xl:px-6 py-5 whitespace-nowrap">
                  <div className="text-base text-gray-900 font-bold">{event.attendees}</div>
                </td>
                <td className="px-4 xl:px-6 py-5 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col xl:flex-row xl:space-x-3 space-y-1 xl:space-y-0">
                    <button onClick={() => onEdit(event)} className="px-3 py-1.5 text-sm text-orange-600 hover:text-white hover:bg-orange-600 border border-orange-600 rounded-lg transition-all duration-200 font-semibold text-left">
                      Edit
                    </button>
                    <button onClick={() => onDelete(event)} className="px-3 py-1.5 text-sm text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-200 font-semibold text-left">
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
        {currentEvents.map((event) => (
          <div key={event.id} className="border-b border-gray-200 last:border-b-0 p-4 sm:p-5 hover:bg-orange-50/30 transition-colors active:bg-orange-50/50">
            <div className="space-y-3">
              {/* Event Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 wrap-break-word">{event.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2.5 line-clamp-2">{event.description}</p>
                </div>
                <span className={`inline-flex px-2 sm:px-2.5 py-1 text-xs sm:text-sm font-bold rounded-full ${getStatusColor(event.status)} shrink-0`}>
                  {event.status}
                </span>
              </div>

              {/* Event Details */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center text-gray-800">
                  <svg className="w-4 h-4 mr-2 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium wrap-break-word">{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center text-gray-800">
                  <svg className="w-4 h-4 mr-2 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium wrap-break-word">{event.location}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span className="text-gray-600">Type: <span className="font-medium text-gray-800">{event.type}</span></span>
                  <span className="text-gray-600">Attendees: <span className="font-bold text-gray-900">{event.attendees}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button 
                  onClick={() => onEdit(event)} 
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-orange-600 hover:text-white hover:bg-orange-600 active:bg-orange-700 border-2 border-orange-600 rounded-lg transition-all duration-200 font-semibold touch-manipulation"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(event.id)} 
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:text-white hover:bg-red-600 active:bg-red-700 border-2 border-red-600 rounded-lg transition-all duration-200 font-semibold touch-manipulation"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedEvents.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaCalendarAlt className="text-gray-400 text-2xl sm:text-3xl lg:text-5xl" />
          </div>
          <p className="text-gray-500 text-base sm:text-lg font-medium">No events found</p>
          <p className="text-gray-400 text-sm sm:text-base mt-1">Create your first event to get started</p>
        </div>
      )}

      {/* Pagination */}
      {sortedEvents.length > 0 && (
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
                <span className="font-medium">{Math.min(endIndex, sortedEvents.length)}</span> of{' '}
                <span className="font-medium">{sortedEvents.length}</span> results
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

export default EventListView;

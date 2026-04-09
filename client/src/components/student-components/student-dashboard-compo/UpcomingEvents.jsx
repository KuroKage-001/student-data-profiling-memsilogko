import { useStudentUpcomingEvents } from '../../../hooks/student-dashboard-hook';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDate } from '../../../utils/student-utilities/student-dashboard-utils';

const UpcomingEvents = () => {
  const { data: eventsData, isLoading, isError } = useStudentUpcomingEvents();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
        <p className="text-red-600 text-center">Failed to load upcoming events</p>
      </div>
    );
  }

  const events = eventsData?.events || [];

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <FaCalendarAlt className="text-blue-600 text-xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-500">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.slice(0, 5).map((event, index) => (
            <div 
              key={index} 
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
            >
              <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-orange-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;

import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { studentEventAPI } from '../../services/studentEventService';
import { toast } from 'react-toastify';

const MyEvents = () => {
  usePageTitle('My Events');
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await studentEventAPI.getMyEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'All') return true;
    return event.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-orange-100 text-orange-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'attended': return <FaCheckCircle className="text-green-600" />;
      case 'absent': return <FaTimesCircle className="text-red-600" />;
      default: return <FaClock className="text-orange-600" />;
    }
  };

  const getAttendanceLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading your events...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Events
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            View your registered events and attendance
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {['All', 'Upcoming', 'Ongoing', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No events found</p>
            <p className="text-gray-400 text-sm mt-2">You haven't been registered for any events yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                {/* Event Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{event.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-orange-600" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-orange-600" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-orange-600" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                )}

                {/* Attendance Status */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Attendance:</span>
                    <div className="flex items-center gap-2">
                      {getAttendanceIcon(event.attendance_status)}
                      <span className="text-sm font-medium text-gray-900">
                        {getAttendanceLabel(event.attendance_status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MyEvents;

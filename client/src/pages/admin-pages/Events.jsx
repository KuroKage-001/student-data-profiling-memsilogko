import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'CCS Research Symposium 2024',
      date: '2024-04-15',
      time: '09:00 AM',
      location: 'Main Auditorium',
      type: 'Academic',
      status: 'Upcoming',
      attendees: 150,
      description: 'Annual research presentation by CCS faculty and students'
    },
    {
      id: 2,
      title: 'Faculty Development Workshop',
      date: '2024-04-20',
      time: '02:00 PM',
      location: 'Conference Room A',
      type: 'Professional',
      status: 'Upcoming',
      attendees: 25,
      description: 'Workshop on modern teaching methodologies'
    },
    {
      id: 3,
      title: 'Student Orientation',
      date: '2024-03-10',
      time: '08:00 AM',
      location: 'CCS Building',
      type: 'Academic',
      status: 'Completed',
      attendees: 200,
      description: 'Orientation for new CCS students'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Events Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage academic and institutional events</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-black">{events.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Events</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{events.filter(e => e.status === 'Upcoming').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Upcoming Events</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{events.filter(e => e.status === 'Completed').length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Completed Events</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-black">{events.reduce((sum, e) => sum + e.attendees, 0)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Attendees</div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base min-w-0"
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium w-full lg:w-auto"
          >
            + Add Event
          </button>
        </div>

        {/* Events List */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden mb-6 sm:mb-8">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-4 xl:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{event.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.date}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.location}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.type}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.attendees}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col xl:flex-row xl:space-x-3 space-y-1 xl:space-y-0">
                        <button className="text-orange-600 hover:text-orange-700 transition-colors text-left">
                          View
                        </button>
                        <button className="text-black hover:text-orange-600 transition-colors text-left">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 transition-colors text-left">
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
          <div className="lg:hidden">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-black mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span>{event.type}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <span>{event.attendees}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)} ml-2 shrink-0`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="flex justify-end space-x-3 text-sm">
                  <button className="text-orange-600 hover:text-orange-700 transition-colors font-medium">
                    View
                  </button>
                  <button className="text-black hover:text-orange-600 transition-colors font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 transition-colors font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 text-sm sm:text-base">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Events;
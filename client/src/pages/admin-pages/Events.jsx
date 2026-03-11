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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Events Management</h1>
          <p className="text-gray-600">Manage academic and institutional events</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-md px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
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
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Add Event
          </button>
        </div>

        {/* Events List */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-black">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.date}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{event.attendees}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-orange-600 hover:text-orange-700 mr-3 transition-colors">
                        View
                      </button>
                      <button className="text-black hover:text-orange-600 mr-3 transition-colors">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No events found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-black">{events.length}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-600">{events.filter(e => e.status === 'Upcoming').length}</div>
            <div className="text-sm text-gray-600">Upcoming Events</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'Completed').length}</div>
            <div className="text-sm text-gray-600">Completed Events</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-black">{events.reduce((sum, e) => sum + e.attendees, 0)}</div>
            <div className="text-sm text-gray-600">Total Attendees</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Events;
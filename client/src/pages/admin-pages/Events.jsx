import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import EventCalendar from '../../components/admin-components/event-compo/EventCalendar';
import { eventsAPI } from '../../services/system-service/apiService';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaSearch, FaPlus, FaChartBar, FaList, FaTh, FaTimes, FaSpinner } from 'react-icons/fa';
import { EventsSkeleton } from '../../layouts/skeleton-loading';

const Events = () => {
  usePageTitle('Events');
  
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    totalAttendees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState('calendar');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Academic',
    status: 'Upcoming',
    attendees: 0,
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;
      
      const response = await eventsAPI.getAll(params);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await eventsAPI.getStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchStatistics();
  }, [filterStatus, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: 'Academic',
      status: 'Upcoming',
      attendees: 0,
      description: '',
    });
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingEvent) {
        const response = await eventsAPI.update(editingEvent.id, formData);
        if (response.success) {
          toast.success('Event updated successfully');
        }
      } else {
        const response = await eventsAPI.create(formData);
        if (response.success) {
          toast.success('Event created successfully');
        }
      }
      setShowForm(false);
      resetForm();
      fetchEvents();
      fetchStatistics();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      status: event.status,
      attendees: event.attendees,
      description: event.description || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await eventsAPI.delete(eventId);
      if (response.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-orange-100 text-orange-800';
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEventClick = (event) => {
    handleEdit(event);
  };

  const handleDateSelect = (selectInfo) => {
    resetForm();
    setFormData(prev => ({
      ...prev,
      date: selectInfo.startStr,
    }));
    setShowForm(true);
  };

  // Show skeleton loading while data is being fetched
  if (loading) {
    return (
      <AdminLayout>
        <EventsSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Events Management
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            Manage academic and institutional events
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.total}</div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-gray-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Events</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">{statistics.upcoming}</div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-orange-600 text-lg" />
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Upcoming Events</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{statistics.completed}</div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Completed Events</div>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.totalAttendees}</div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Total Attendees</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              <div className="relative flex-1 sm:max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base shadow-sm focus:shadow-md min-w-0 sm:min-w-[160px]"
              >
                <option value="All">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaTh className="text-sm" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaList className="text-sm" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaPlus className="text-sm relative z-10" />
                <span className="relative z-10">Add Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <EventCalendar 
            events={events}
            onEventClick={handleEventClick}
            onDateSelect={handleDateSelect}
          />
        )}

        {/* List View */}
        {viewMode === 'list' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                        <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
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
                              <button onClick={() => handleEdit(event)} className="text-orange-600 hover:text-orange-700 transition-colors text-left">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-700 transition-colors text-left">
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
                  {events.map((event) => (
                    <div key={event.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-black mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
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
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)} ml-2 shrink-0`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex justify-end space-x-3 text-sm">
                        <button onClick={() => handleEdit(event)} className="text-orange-600 hover:text-orange-700 transition-colors font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-700 transition-colors font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {events.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <FaCalendarAlt className="mx-auto text-gray-300 text-5xl mb-4" />
                    <p className="text-gray-500 text-lg">No events found</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first event to get started</p>
                  </div>
                )}
              </div>
        )}

        {/* Add/Edit Event Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <FaTimes className="text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    placeholder="Enter event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    placeholder="Enter location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    >
                      <option value="Academic">Academic</option>
                      <option value="Professional">Professional</option>
                      <option value="Competition">Competition</option>
                      <option value="Social">Social</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all resize-none"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting && <FaSpinner className="animate-spin" />}
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Events;

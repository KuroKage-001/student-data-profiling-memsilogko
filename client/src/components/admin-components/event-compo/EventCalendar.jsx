import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { FaChevronLeft, FaChevronRight, FaTimes, FaMapMarkerAlt, FaClock, FaUsers, FaTag, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const EventCalendar = ({ events, onEventClick, onDateSelect }) => {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [currentTitle, setCurrentTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Transform events for FullCalendar format with color coding
  const getEventColor = (status, type) => {
    // Status-based colors matching the app's palette
    const statusColors = {
      'Upcoming': { bg: '#f97316', border: '#ea580c', text: '#ffffff' }, // Orange (primary)
      'Ongoing': { bg: '#22c55e', border: '#16a34a', text: '#ffffff' },  // Green
      'Completed': { bg: '#6b7280', border: '#4b5563', text: '#ffffff' }, // Gray
      'Cancelled': { bg: '#ef4444', border: '#dc2626', text: '#ffffff' }, // Red
    };
    
    return statusColors[status] || statusColors['Upcoming'];
  };

  const calendarEvents = events.map(event => {
    const colors = getEventColor(event.status, event.type);
    // Parse date and time to create proper datetime
    const dateTime = event.time ? 
      `${event.date}T${convertTo24Hour(event.time)}` : 
      event.date;
    
    return {
      id: event.id,
      title: event.title,
      start: dateTime,
      end: dateTime,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: {
        ...event,
        colorScheme: colors
      }
    };
  });

  // Convert 12-hour time to 24-hour format
  function convertTo24Hour(time12h) {
    if (!time12h) return '09:00';
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event.extendedProps);
    setShowEventModal(true);
    if (onEventClick) onEventClick(clickInfo.event.extendedProps);
  };

  const handleDateSelect = (selectInfo) => {
    if (onDateSelect) onDateSelect(selectInfo);
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentTitle(dateInfo.view.title);
  };

  const navigatePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.prev();
  };

  const navigateNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.next();
  };

  const navigateToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) calendarApi.today();
  };

  const navigatePrevYear = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const currentDate = calendarApi.getDate();
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      calendarApi.gotoDate(currentDate);
    }
  };

  const navigateNextYear = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const currentDate = calendarApi.getDate();
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      calendarApi.gotoDate(currentDate);
    }
  };

  const changeView = (viewName) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(viewName);
      setCurrentView(viewName);
    }
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCurrentTitle(calendarApi.view.title);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Custom Calendar Header */}
      <div className="bg-linear-to-r from-orange-500 to-orange-600 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={navigatePrevYear}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Previous Year"
            >
              <FaAngleDoubleLeft className="text-white text-sm" />
            </button>
            <button
              onClick={navigatePrev}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Previous Month"
            >
              <FaChevronLeft className="text-white text-sm" />
            </button>
            <button
              onClick={navigateToday}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Today
            </button>
            <button
              onClick={navigateNext}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Next Month"
            >
              <FaChevronRight className="text-white text-sm" />
            </button>
            <button
              onClick={navigateNextYear}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Next Year"
            >
              <FaAngleDoubleRight className="text-white text-sm" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-white ml-2 sm:ml-4">
              {currentTitle}
            </h2>
          </div>

          {/* View Switcher */}
          <div className="flex bg-white/20 rounded-lg p-1 gap-1">
            {[
              { key: 'dayGridMonth', label: 'Month' },
              { key: 'timeGridWeek', label: 'Week' },
              { key: 'timeGridDay', label: 'Day' },
              { key: 'listWeek', label: 'List' },
            ].map(view => (
              <button
                key={view.key}
                onClick={() => changeView(view.key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  currentView === view.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span className="text-sm text-gray-600">Upcoming</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-600">Ongoing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-500"></span>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-sm text-gray-600">Cancelled</span>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="p-2 sm:p-4 calendar-container">
        <style>{`
          .calendar-container .fc {
            font-family: inherit;
          }
          .calendar-container .fc-theme-standard td,
          .calendar-container .fc-theme-standard th {
            border-color: #e5e7eb;
          }
          .calendar-container .fc-theme-standard .fc-scrollgrid {
            border-color: #e5e7eb;
          }
          .calendar-container .fc-col-header-cell {
            background: #f9fafb;
            padding: 12px 0;
          }
          .calendar-container .fc-col-header-cell-cushion {
            color: #374151;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
          }
          .calendar-container .fc-daygrid-day-number {
            color: #374151;
            font-weight: 500;
            padding: 8px;
          }
          .calendar-container .fc-daygrid-day.fc-day-today {
            background: #fff7ed !important;
          }
          .calendar-container .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
            background: #f97316;
            color: white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .calendar-container .fc-event {
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s;
            border-width: 0;
            border-left-width: 3px;
          }
          .calendar-container .fc-event:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .calendar-container .fc-daygrid-event-dot {
            display: none;
          }
          .calendar-container .fc-daygrid-more-link {
            color: #f97316;
            font-weight: 600;
            font-size: 0.75rem;
          }
          .calendar-container .fc-daygrid-more-link:hover {
            color: #ea580c;
          }
          .calendar-container .fc-popover {
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }
          .calendar-container .fc-popover-header {
            background: #f9fafb;
            padding: 8px 12px;
            font-weight: 600;
          }
          .calendar-container .fc-list-event:hover td {
            background: #fff7ed;
          }
          .calendar-container .fc-list-day-cushion {
            background: #f9fafb;
          }
          .calendar-container .fc-timegrid-slot-label {
            font-size: 0.75rem;
            color: #6b7280;
          }
          .calendar-container .fc-timegrid-now-indicator-line {
            border-color: #f97316;
          }
          .calendar-container .fc-timegrid-now-indicator-arrow {
            border-color: #f97316;
            border-top-color: transparent;
            border-bottom-color: transparent;
          }
          .calendar-container .fc-toolbar {
            display: none;
          }
          .calendar-container .fc-view-harness {
            min-height: 500px;
          }
          @media (max-width: 640px) {
            .calendar-container .fc-col-header-cell-cushion {
              font-size: 0.7rem;
            }
            .calendar-container .fc-daygrid-day-number {
              font-size: 0.8rem;
              padding: 4px;
            }
            .calendar-container .fc-event {
              font-size: 0.65rem;
              padding: 1px 3px;
            }
          }
        `}</style>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={calendarEvents}
          eventClick={handleEventClick}
          selectable={true}
          select={handleDateSelect}
          datesSet={handleDatesSet}
          dayMaxEvents={3}
          nowIndicator={true}
          height="auto"
          eventDisplay="block"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
        />
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-orange-500 to-orange-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {selectedEvent.title}
                  </h3>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaClock className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                  <p className="text-gray-900 font-semibold">{selectedEvent.date}</p>
                  <p className="text-gray-600">{selectedEvent.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 font-semibold">{selectedEvent.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaTag className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Event Type</p>
                  <p className="text-gray-900 font-semibold">{selectedEvent.type}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaUsers className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Expected Attendees</p>
                  <p className="text-gray-900 font-semibold">{selectedEvent.attendees} people</p>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 font-medium mb-2">Description</p>
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => setShowEventModal(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  if (onEventClick) onEventClick(selectedEvent);
                }}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;

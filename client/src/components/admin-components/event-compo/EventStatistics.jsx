import { FaChartBar, FaCalendarAlt } from 'react-icons/fa';

const EventStatistics = ({ statistics }) => {
  return (
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
  );
};

export default EventStatistics;

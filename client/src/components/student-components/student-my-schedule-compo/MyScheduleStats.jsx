import { FaChartBar, FaCalendarAlt, FaClock } from 'react-icons/fa';

const MyScheduleStats = ({ statistics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{statistics.total_enrolled}</div>
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <FaChartBar className="text-orange-600 text-lg" />
          </div>
        </div>
        <div className="text-sm sm:text-base text-gray-600 font-medium">Enrolled Classes</div>
      </div>
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{statistics.completed_courses}</div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <FaCalendarAlt className="text-green-600 text-lg" />
          </div>
        </div>
        <div className="text-sm sm:text-base text-gray-600 font-medium">Completed</div>
      </div>
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{statistics.current_semester}</div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaClock className="text-blue-600 text-lg" />
          </div>
        </div>
        <div className="text-sm sm:text-base text-gray-600 font-medium">Current Semester</div>
      </div>
    </div>
  );
};

export default MyScheduleStats;
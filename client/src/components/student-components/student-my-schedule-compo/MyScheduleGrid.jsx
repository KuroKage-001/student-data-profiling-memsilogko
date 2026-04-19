import { FaClock } from 'react-icons/fa';

const MyScheduleGrid = ({ schedules, days, timeSlots, getScheduleForSlot }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <FaClock className="text-white text-lg" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Schedule Overview</h3>
      </div>
      
      {/* Desktop Grid View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 rounded-tl-lg">Time</th>
              {days.map((day, index) => (
                <th key={day} className={`px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 ${index === days.length - 1 ? 'rounded-tr-lg' : ''}`}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => (
              <tr key={timeSlot} className="border-t border-gray-100">
                <td className="px-2 sm:px-4 py-4 text-xs sm:text-sm text-gray-900 font-medium bg-gray-50">{timeSlot}</td>
                {days.map(day => {
                  const classInSlot = getScheduleForSlot(day, timeSlot);
                  return (
                    <td key={day} className="px-2 sm:px-4 py-4 text-center">
                      {classInSlot ? (
                        <div className="bg-linear-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg p-2 sm:p-3 text-xs hover:shadow-md transition-shadow duration-200">
                          <div className="font-bold text-gray-900 mb-1">{classInSlot.course_code}</div>
                          <div className="text-gray-700 font-medium">{classInSlot.room || 'TBA'}</div>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs py-2">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Day-by-Day View */}
      <div className="md:hidden space-y-4">
        {days.map(day => {
          const daySchedules = schedules.filter(s => s.day_of_week === day);
          return (
            <div key={day} className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors duration-200">
              <h4 className="font-bold text-gray-900 mb-3 text-base flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                {day}
              </h4>
              <div className="space-y-2">
                {timeSlots.map(timeSlot => {
                  const classInSlot = daySchedules.find(s => `${s.start_time} - ${s.end_time}` === timeSlot);
                  return (
                    <div key={timeSlot} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="text-xs text-gray-600 font-medium min-w-0 shrink-0 mr-3">
                        {timeSlot}
                      </div>
                      <div className="flex-1 text-right">
                        {classInSlot ? (
                          <div className="bg-linear-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-lg px-3 py-2 text-xs inline-block hover:shadow-md transition-shadow duration-200">
                            <div className="font-bold text-gray-900">{classInSlot.course_code}</div>
                            <div className="text-gray-700 font-medium mt-0.5">{classInSlot.room || 'TBA'}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyScheduleGrid;
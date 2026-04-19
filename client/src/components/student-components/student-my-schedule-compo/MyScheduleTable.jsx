const MyScheduleTable = ({ filteredSchedules, getCapacityColor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6 sm:mb-8">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-4 xl:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-black">{schedule.course_code}</div>
                    <div className="text-sm text-gray-500">{schedule.course_name}</div>
                  </div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{schedule.instructor}</div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{schedule.day_of_week}</div>
                  <div className="text-sm text-gray-500">{schedule.start_time} - {schedule.end_time}</div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{schedule.room || 'TBA'}</div>
                </td>
                <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getCapacityColor(schedule.current_enrollment, schedule.max_capacity)}`}>
                    {schedule.current_enrollment}/{schedule.max_capacity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round((schedule.current_enrollment / schedule.max_capacity) * 100)}% full
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {filteredSchedules.map((schedule) => (
          <div key={schedule.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-black mb-1">{schedule.course_code}</h3>
                <p className="text-sm text-gray-600 mb-2">{schedule.course_name}</p>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{schedule.instructor}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{schedule.day_of_week} • {schedule.start_time} - {schedule.end_time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{schedule.room || 'TBA'}</span>
                  </div>
                  <div className={`text-sm font-medium ${getCapacityColor(schedule.current_enrollment, schedule.max_capacity)}`}>
                    {schedule.current_enrollment}/{schedule.max_capacity} ({Math.round((schedule.current_enrollment / schedule.max_capacity) * 100)}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-8 px-4">
          <p className="text-gray-500 text-sm sm:text-base">No schedules found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MyScheduleTable;
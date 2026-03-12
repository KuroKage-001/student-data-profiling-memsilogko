import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Scheduling = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      courseCode: 'CS 101',
      courseName: 'Introduction to Programming',
      instructor: 'Dr. Robert Anderson',
      room: 'CS-301',
      day: 'Monday',
      time: '08:00 AM - 10:00 AM',
      semester: 'Fall 2024',
      students: 35,
      capacity: 40
    },
    {
      id: 2,
      courseCode: 'IT 201',
      courseName: 'Network Security',
      instructor: 'Dr. Maria Garcia',
      room: 'IT-205',
      day: 'Tuesday',
      time: '02:00 PM - 04:00 PM',
      semester: 'Fall 2024',
      students: 28,
      capacity: 30
    },
    {
      id: 3,
      courseCode: 'CE 301',
      courseName: 'Microprocessors',
      instructor: 'Prof. David Chen',
      room: 'CE-150',
      day: 'Wednesday',
      time: '10:00 AM - 12:00 PM',
      semester: 'Fall 2024',
      students: 22,
      capacity: 25
    },
    {
      id: 4,
      courseCode: 'DS 401',
      courseName: 'Advanced Analytics',
      instructor: 'Dr. Lisa Thompson',
      room: 'DS-401',
      day: 'Thursday',
      time: '01:00 PM - 03:00 PM',
      semester: 'Fall 2024',
      students: 18,
      capacity: 20
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = filterDay === 'All' || schedule.day === filterDay;
    return matchesSearch && matchesDay;
  });

  const getCapacityColor = (students, capacity) => {
    const percentage = (students / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Scheduling Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage class schedules, room assignments, and timetables</p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base"
            />
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black text-sm sm:text-base min-w-0"
            >
              <option value="All">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium w-full lg:w-auto"
          >
            + Add Schedule
          </button>
        </div>

        {/* Schedule Table */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden mb-6 sm:mb-8">
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
                  <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-4 xl:px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-black">{schedule.courseCode}</div>
                        <div className="text-sm text-gray-500">{schedule.courseName}</div>
                      </div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.instructor}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.day}</div>
                      <div className="text-sm text-gray-500">{schedule.time}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.room}</div>
                    </td>
                    <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getCapacityColor(schedule.students, schedule.capacity)}`}>
                        {schedule.students}/{schedule.capacity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((schedule.students / schedule.capacity) * 100)}% full
                      </div>
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
            {filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-black mb-1">{schedule.courseCode}</h3>
                    <p className="text-sm text-gray-600 mb-2">{schedule.courseName}</p>
                    
                    {/* Schedule Details */}
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
                        <span>{schedule.day} • {schedule.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{schedule.room}</span>
                        </div>
                        <div className={`text-sm font-medium ${getCapacityColor(schedule.students, schedule.capacity)}`}>
                          {schedule.students}/{schedule.capacity} ({Math.round((schedule.students / schedule.capacity) * 100)}%)
                        </div>
                      </div>
                    </div>
                  </div>
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

          {filteredSchedules.length === 0 && (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500 text-sm sm:text-base">No schedules found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Weekly Schedule Grid */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Weekly Schedule Overview</h3>
          
          {/* Desktop Grid View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-500">Time</th>
                  {days.map(day => (
                    <th key={day} className="px-2 sm:px-4 py-2 text-center text-xs sm:text-sm font-medium text-gray-500">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot} className="border-t">
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-black font-medium">{timeSlot}</td>
                    {days.map(day => {
                      const classInSlot = schedules.find(s => s.day === day && s.time === timeSlot);
                      return (
                        <td key={day} className="px-2 sm:px-4 py-3 text-center">
                          {classInSlot ? (
                            <div className="bg-orange-100 border border-orange-300 rounded p-1 sm:p-2 text-xs">
                              <div className="font-medium text-black">{classInSlot.courseCode}</div>
                              <div className="text-gray-600">{classInSlot.room}</div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-xs">Available</div>
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
              const daySchedules = schedules.filter(s => s.day === day);
              return (
                <div key={day} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-semibold text-black mb-3 text-sm">{day}</h4>
                  <div className="space-y-2">
                    {timeSlots.map(timeSlot => {
                      const classInSlot = daySchedules.find(s => s.time === timeSlot);
                      return (
                        <div key={timeSlot} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="text-xs text-gray-600 min-w-0 shrink-0 mr-3">
                            {timeSlot}
                          </div>
                          <div className="flex-1 text-right">
                            {classInSlot ? (
                              <div className="bg-orange-100 border border-orange-300 rounded px-2 py-1 text-xs inline-block">
                                <div className="font-medium text-black">{classInSlot.courseCode}</div>
                                <div className="text-gray-600">{classInSlot.room}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">Available</span>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-black">{schedules.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Classes</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{schedules.reduce((sum, s) => sum + s.students, 0)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{new Set(schedules.map(s => s.room)).size}</div>
            <div className="text-xs sm:text-sm text-gray-600">Rooms Used</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-black">{Math.round(schedules.reduce((sum, s) => sum + (s.students / s.capacity), 0) / schedules.length * 100)}%</div>
            <div className="text-xs sm:text-sm text-gray-600">Avg. Capacity</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Scheduling;
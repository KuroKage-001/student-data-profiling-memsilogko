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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Scheduling Management</h1>
          <p className="text-gray-600">Manage class schedules, room assignments, and timetables</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 flex-1">
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 max-w-md px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
            />
            <select
              value={filterDay}
              onChange={(e) => setFilterDay(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-600 focus:outline-none transition-colors text-black"
            >
              <option value="All">All Days</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            + Add Schedule
          </button>
        </div>

        {/* Schedule Table */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-black">{schedule.courseCode}</div>
                        <div className="text-sm text-gray-500">{schedule.courseName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.instructor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.day}</div>
                      <div className="text-sm text-gray-500">{schedule.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{schedule.room}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getCapacityColor(schedule.students, schedule.capacity)}`}>
                        {schedule.students}/{schedule.capacity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((schedule.students / schedule.capacity) * 100)}% full
                      </div>
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
        </div>

        {/* Weekly Schedule Grid */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Weekly Schedule Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-2 text-center text-sm font-medium text-gray-500">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(timeSlot => (
                  <tr key={timeSlot} className="border-t">
                    <td className="px-4 py-3 text-sm text-black font-medium">{timeSlot}</td>
                    {days.map(day => {
                      const classInSlot = schedules.find(s => s.day === day && s.time === timeSlot);
                      return (
                        <td key={day} className="px-4 py-3 text-center">
                          {classInSlot ? (
                            <div className="bg-orange-100 border border-orange-300 rounded p-2 text-xs">
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
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-black">{schedules.length}</div>
            <div className="text-sm text-gray-600">Total Classes</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-600">{schedules.reduce((sum, s) => sum + s.students, 0)}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-600">{new Set(schedules.map(s => s.room)).size}</div>
            <div className="text-sm text-gray-600">Rooms Used</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="text-2xl font-bold text-black">{Math.round(schedules.reduce((sum, s) => sum + (s.students / s.capacity), 0) / schedules.length * 100)}%</div>
            <div className="text-sm text-gray-600">Avg. Capacity</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Scheduling;
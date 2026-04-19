import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import usePageTitle from '../../hooks/usePageTitle';
import { FaClock } from 'react-icons/fa';
import studentScheduleService from '../../services/studentScheduleService';
import { toast } from 'react-toastify';
import { SchedulingSkeleton } from '../../layouts/skeleton-loading';
import { 
  MyScheduleStats, 
  MyScheduleControls, 
  MyScheduleTable, 
  MyScheduleGrid 
} from '../../components/student-components';

const MySchedule = () => {
  usePageTitle('My Schedule');
  
  const [schedules, setSchedules] = useState([]);
  const [statistics, setStatistics] = useState({
    total_enrolled: 0,
    total_units: 0,
    completed_courses: 0,
    current_semester: 'Spring 2026',
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('All');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchSchedules();
    fetchStatistics();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await studentScheduleService.getMySchedules();
      
      if (Array.isArray(response)) {
        setSchedules(response);
      } else if (response?.success && response?.data) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await studentScheduleService.getStatistics();
      
      if (response?.success && response?.data) {
        setStatistics(response.data);
      } else if (response && !response.success) {
        setStatistics(response);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };



  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.course_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = filterDay === 'All' || schedule.day_of_week === filterDay;
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

  const getScheduleForSlot = (day, timeSlot) => {
    return schedules.find(s => {
      const scheduleTime = `${s.start_time} - ${s.end_time}`;
      return s.day_of_week === day && scheduleTime === timeSlot;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <SchedulingSkeleton />
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
              <FaClock className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Schedule
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-16 font-medium">
            View your enrolled classes and weekly schedule
          </p>
        </div>

        {/* Quick Stats */}
        <MyScheduleStats statistics={statistics} />

        {/* Controls */}
        <MyScheduleControls 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterDay={filterDay}
          setFilterDay={setFilterDay}
          days={days}
        />

        {/* Schedule Table */}
        <MyScheduleTable 
          filteredSchedules={filteredSchedules}
          getCapacityColor={getCapacityColor}
        />

        {/* Weekly Schedule Grid */}
        <MyScheduleGrid 
          schedules={schedules}
          days={days}
          timeSlots={timeSlots}
          getScheduleForSlot={getScheduleForSlot}
        />
      </div>
    </AdminLayout>
  );
};

export default MySchedule;

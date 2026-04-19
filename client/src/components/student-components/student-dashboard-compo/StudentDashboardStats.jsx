import { FaBook, FaCalendarAlt, FaChartLine, FaGraduationCap } from 'react-icons/fa';
import { useStudentDashboard } from '../../../hooks/student-dashboard-hook';
import { formatNumber, formatGPA } from '../../../utils/student-utilities/student-dashboard-utils';

const StudentDashboardStats = () => {
  const { data: statsData, isLoading, isError } = useStudentDashboard();

  const stats = [
    {
      title: 'Current GPA',
      value: isLoading ? '...' : formatGPA(statsData?.gpa || 0),
      icon: FaChartLine,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Units Completed',
      value: isLoading ? '...' : formatNumber(statsData?.units_completed || 0),
      icon: FaBook,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Enrolled Classes',
      value: isLoading ? '...' : formatNumber(statsData?.enrolled_classes || 0),
      icon: FaGraduationCap,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Upcoming Events',
      value: isLoading ? '...' : formatNumber(statsData?.upcoming_events || 0),
      icon: FaCalendarAlt,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    }
  ];

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load dashboard statistics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm sm:text-base text-gray-600 font-medium mb-2">{stat.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className={`text-xl ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboardStats;

import { FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck, FaClock } from 'react-icons/fa';
import { useDashboardStats } from '../../../hooks/admin-dashboard-hook';

const DashboardStats = () => {
  const { data: statsData, isLoading, isError } = useDashboardStats();

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const stats = [
    {
      title: 'Total Students',
      value: isLoading ? '...' : formatNumber(statsData?.total_students || 0),
      icon: FaUserGraduate,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Active Faculty',
      value: '89',
      icon: FaChalkboardTeacher,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Profiles Completed',
      value: '1,156',
      icon: FaClipboardCheck,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      icon: FaClock,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
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

export default DashboardStats;
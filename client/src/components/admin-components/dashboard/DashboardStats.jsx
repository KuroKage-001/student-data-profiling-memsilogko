import { FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck, FaClock } from 'react-icons/fa';
import { useDashboardStats } from '../../../hooks/admin-dashboard-hook';
import { useAuth } from '../../../context/AuthContext';

const DashboardStats = () => {
  const { data: statsData, isLoading, isError } = useDashboardStats();
  const { user } = useAuth();
  
  const isDeptChair = user?.role === 'dept_chair';
  const isFaculty = user?.role === 'faculty';

  // Format number with commas
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const allStats = [
    {
      title: 'Total Students',
      value: isLoading ? '...' : formatNumber(statsData?.students?.total_students || 0),
      icon: FaUserGraduate,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      hideForDeptChair: true
    },
    {
      title: 'Active Faculty',
      value: isLoading ? '...' : formatNumber(statsData?.faculty?.active || 0),
      icon: FaChalkboardTeacher,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hideForDeptChair: false
    },
    {
      title: 'Total Faculty',
      value: isLoading ? '...' : formatNumber(statsData?.faculty?.total || 0),
      icon: FaClipboardCheck,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      hideForDeptChair: false
    },
    {
      title: 'Faculty on Leave',
      value: isLoading ? '...' : formatNumber(statsData?.faculty?.on_leave || 0),
      icon: FaClock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      hideForDeptChair: false
    }
  ];

  // Filter stats based on user role
  const stats = (isDeptChair || isFaculty)
    ? allStats.filter(stat => !stat.hideForDeptChair)
    : allStats;

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load dashboard statistics</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${(isDeptChair || isFaculty) ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4 sm:gap-5`}>
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
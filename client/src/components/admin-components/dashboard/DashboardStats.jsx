import { FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck, FaClock } from 'react-icons/fa';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: FaUserGraduate
    },
    {
      title: 'Active Faculty',
      value: '89',
      change: '+3%',
      changeType: 'increase',
      icon: FaChalkboardTeacher
    },
    {
      title: 'Profiles Completed',
      value: '1,156',
      change: '+8%',
      changeType: 'increase',
      icon: FaClipboardCheck
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-15%',
      changeType: 'decrease',
      icon: FaClock
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-600 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-black">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="text-orange-600 text-3xl">
              <stat.icon />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
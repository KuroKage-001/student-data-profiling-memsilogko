import AdminLayout from '../../layouts/AdminLayout';
import { 
  StudentDashboardStats, 
  StudentProfileCard, 
  UpcomingEvents 
} from '../../components/student-components/student-dashboard-compo';
import usePageTitle from '../../hooks/usePageTitle';
import { useStudentDashboard } from '../../hooks/student-dashboard-hook';
import { StudentDashboardSkeleton } from '../../layouts/skeleton-loading';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaCalendarAlt, FaChartLine, FaUserGraduate } from 'react-icons/fa';

const StudentDashboard = () => {
  usePageTitle('Student Dashboard');
  
  const { isLoading } = useStudentDashboard();
  const { user } = useAuth();

  // Show skeleton loading while data is being fetched
  if (isLoading) {
    return (
      <AdminLayout>
        <StudentDashboardSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-orange-600 to-orange-400 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 ml-4 sm:ml-6 font-medium">
            Your Academic Dashboard and Progress Overview
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <StudentDashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          {/* Left Column - Quick Links and Info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Academic Records Link */}
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                    <FaChartLine className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    Academic Records
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    View your grades, transcripts, and complete academic history
                  </p>
                </div>
              </div>

              {/* My Schedule Link */}
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                    <FaBook className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    My Schedule
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    View your class schedule and enrolled subjects
                  </p>
                </div>
              </div>

              {/* Campus Events Link */}
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    Campus Events
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Stay updated with campus activities and events
                  </p>
                </div>
              </div>

              {/* Student Profile Link */}
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
                    <FaUserGraduate className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    My Profile
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    View and update your personal information
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile and Events */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Student Profile Card */}
            <StudentProfileCard />

            {/* Upcoming Events */}
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentDashboard;

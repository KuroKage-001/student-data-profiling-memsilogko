import AdminLayout from '../../layouts/AdminLayout';
import { 
  StudentProfileCard, 
  UpcomingEvents 
} from '../../components/student-components/student-dashboard-compo';
import UniversityMap from '../../components/admin-components/dashboard/UniversityMap';
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-linear-to-b from-orange-600 to-orange-400 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 ml-4 sm:ml-6 font-medium">
            Your Academic Dashboard and Progress Overview
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column - Profile Card and University Map */}
          <div className="xl:col-span-4 space-y-6 sm:space-y-8">
            <div className="sticky top-24 space-y-6 sm:space-y-8">
              <StudentProfileCard />
              <UniversityMap />
            </div>
          </div>

          {/* Center & Right Column - Quick Links and Events */}
          <div className="xl:col-span-8 space-y-6 sm:space-y-8">
            {/* Quick Access Cards */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Quick Access
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Academic Records Link */}
                <div className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
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
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
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
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
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
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-5">
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

            {/* Upcoming Events Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Upcoming Events
              </h2>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentDashboard;

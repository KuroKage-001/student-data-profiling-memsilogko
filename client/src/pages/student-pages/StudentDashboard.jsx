import AdminLayout from '../../layouts/AdminLayout';
import { 
  StudentDashboardStats, 
  StudentProfileCard, 
  AcademicProgress, 
  UpcomingEvents 
} from '../../components/student-components/student-dashboard-compo';
import usePageTitle from '../../hooks/usePageTitle';
import { useStudentDashboard } from '../../hooks/student-dashboard-hook';
import { StudentDashboardSkeleton } from '../../layouts/skeleton-loading';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaCalendarAlt } from 'react-icons/fa';

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
        {/* Header Section with Enhanced Design */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
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

        {/* Dashboard Stats */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <StudentDashboardStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
          {/* Left Column - Profile and Progress */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Academic Progress Card */}
            <AcademicProgress />

            {/* Quick Links Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Academic Records Link */}
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                    <FaBook className="text-white text-xl" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    Academic Records
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    View your grades, transcripts, and academic history
                  </p>
                </div>
              </div>

              {/* Events Link */}
              <div className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-100 to-transparent rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    Campus Events
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Stay updated with campus activities and events
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

        {/* Welcome Message */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Need Help?</h3>
          <p className="text-orange-50 mb-4">
            If you have any questions or need assistance, please contact your academic advisor or visit the student services office.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200">
              Contact Support
            </button>
            <button className="px-4 py-2 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition-colors duration-200">
              View FAQs
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentDashboard;

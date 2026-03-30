import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardStats from '../../components/admin-components/dashboard/DashboardStats';
import UniversityMap from '../../components/admin-components/dashboard/UniversityMap';
import usePageTitle from '../../hooks/usePageTitle';
import { useDashboardStats } from '../../hooks/admin-dashboard-hook';
import { AdminDashboardSkeleton } from '../../layouts/skeleton-loading';
import { FaUserGraduate, FaChalkboardTeacher, FaFileAlt, FaDownload, FaCog, FaArrowRight, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
  usePageTitle('Dashboard');
  
  const navigate = useNavigate();
  const { isLoading } = useDashboardStats();

  const handleNavigateToStudents = () => {
    navigate('/admin/students');
  };

  const handleNavigateToFaculty = () => {
    navigate('/admin/faculty');
  };

  // Show skeleton loading while data is being fetched
  if (isLoading) {
    return (
      <AdminLayout>
        <AdminDashboardSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-8 bg-linear-to-b from-orange-600 to-orange-400 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 ml-6 font-medium">
            Comprehensive Profiling System Management
          </p>
        </div>

        {/* Dashboard Stats with Shadow */}
        <div className="mb-8 sm:mb-10">
          <DashboardStats />
        </div>

        {/* Main Navigation Cards - Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">
          {/* Student Profiles Card */}
          <div 
            onClick={handleNavigateToStudents}
            className="group relative bg-white rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1"
          >
            {/* Gradient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaUserGraduate className="text-white text-2xl sm:text-3xl" />
                </div>
                <div className="shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4">
                  <FaArrowRight className="text-orange-600 text-lg" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                Student Profiles
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Manage and view comprehensive student data, academic records, and profiling information.
              </p>
              
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                <span>View Details</span>
                <FaArrowRight className="text-xs" />
              </div>
            </div>
          </div>

          {/* Faculty Profiles Card */}
          <div 
            onClick={handleNavigateToFaculty}
            className="group relative bg-white rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1"
          >
            {/* Gradient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaChalkboardTeacher className="text-white text-2xl sm:text-3xl" />
                </div>
                <div className="shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4">
                  <FaArrowRight className="text-orange-600 text-lg" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                Faculty Profiles
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                Access faculty information, teaching assignments, and professional development records.
              </p>
              
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                <span>View Details</span>
                <FaArrowRight className="text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* University Location Map */}
        <div className="mb-8 sm:mb-10">
          <UniversityMap />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
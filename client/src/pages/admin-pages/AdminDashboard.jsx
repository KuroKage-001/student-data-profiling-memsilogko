import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardStats from '../../components/admin-components/dashboard/DashboardStats';
import UniversityMap from '../../components/admin-components/dashboard/UniversityMap';
import usePageTitle from '../../hooks/usePageTitle';
import { useDashboardStats } from '../../hooks/admin-dashboard-hook';
import { AdminDashboardSkeleton } from '../../layouts/skeleton-loading';
import { useAuth } from '../../context/AuthContext';
import { FaUserGraduate, FaChalkboardTeacher, FaArrowRight, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
  usePageTitle('Dashboard');
  
  const navigate = useNavigate();
  const { isLoading } = useDashboardStats();
  const { user } = useAuth();
  
  const isDeptChair = user?.role === 'dept_chair';

  const handleNavigateToStudents = () => {
    navigate('/admin/students');
  };

  const handleNavigateToFaculty = () => {
    navigate('/admin/faculty');
  };

  const handleNavigateToScheduling = () => {
    navigate('/admin/scheduling');
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section with Enhanced Design */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-linear-to-b from-orange-600 to-orange-400 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {isDeptChair && user?.department ? `${user.department} Department Dashboard` : 'Admin Dashboard'}
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 ml-4 sm:ml-6 font-medium">
            {isDeptChair ? 'Department Management and Oversight' : 'Comprehensive Profiling System Management'}
          </p>
        </div>

        {/* Dashboard Stats with Shadow */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <DashboardStats />
        </div>

        {/* Main Navigation Cards - Enhanced Design */}
        <div className={`grid grid-cols-1 ${isDeptChair ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10`}>
          {/* Student Profiles Card - Hidden for Dept Chair */}
          {!isDeptChair && (
            <div 
              onClick={handleNavigateToStudents}
              className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              {/* Gradient Background Effect */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaUserGraduate className="text-white text-xl sm:text-2xl lg:text-3xl" />
                  </div>
                  <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4">
                    <FaArrowRight className="text-orange-600 text-base sm:text-lg" />
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  Student Profiles
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                  Manage and view comprehensive student data, academic records, and profiling information.
                </p>
                
                <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
                  <span>View Details</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* Faculty Profiles Card */}
          <div 
            onClick={handleNavigateToFaculty}
            className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1 active:scale-[0.98]"
          >
            {/* Gradient Background Effect */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaChalkboardTeacher className="text-white text-xl sm:text-2xl lg:text-3xl" />
                </div>
                <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4">
                  <FaArrowRight className="text-orange-600 text-base sm:text-lg" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">
                Faculty Profiles
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                {isDeptChair && user?.department
                  ? `Manage ${user.department} department faculty information, teaching assignments, and professional development.`
                  : 'Access faculty information, teaching assignments, and professional development records.'
                }
              </p>
              
              <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
                <span>View Details</span>
                <FaArrowRight className="text-xs" />
              </div>
            </div>
          </div>

          {/* Scheduling Card - For Dept Chair */}
          {isDeptChair && (
            <div 
              onClick={handleNavigateToScheduling}
              className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              {/* Gradient Background Effect */}
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-orange-100 to-transparent rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaClock className="text-white text-xl sm:text-2xl lg:text-3xl" />
                  </div>
                  <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-4">
                    <FaArrowRight className="text-orange-600 text-base sm:text-lg" />
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  Class Scheduling
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4">
                  {user?.department ? `Manage ${user.department} department class schedules, room assignments, and timetables.` : 'Manage class schedules, room assignments, and timetables.'}
                </p>
                
                <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all duration-300">
                  <span>View Details</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* University Location Map */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <UniversityMap />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
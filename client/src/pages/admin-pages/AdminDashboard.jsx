import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardStats from '../../components/admin-components/dashboard/DashboardStats';
import { FaUserGraduate, FaChalkboardTeacher, FaFileAlt, FaDownload, FaCog } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigateToStudents = () => {
    navigate('/admin/students');
  };

  const handleNavigateToFaculty = () => {
    navigate('/admin/faculty');
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive Profiling System Management</p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-6 sm:mb-8">
          <DashboardStats />
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div 
            onClick={handleNavigateToStudents}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 hover:border-orange-600 transition-colors cursor-pointer group"
          >
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 group-hover:text-orange-600 transition-colors">
                  Student Profiles
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Manage and view comprehensive student data, academic records, and profiling information.
                </p>
              </div>
              <div className="text-orange-600 text-3xl sm:text-4xl shrink-0">
                <FaUserGraduate />
              </div>
            </div>
          </div>

          <div 
            onClick={handleNavigateToFaculty}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6 hover:border-orange-600 transition-colors cursor-pointer group"
          >
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 group-hover:text-orange-600 transition-colors">
                  Faculty Profiles
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Access faculty information, teaching assignments, and professional development records.
                </p>
              </div>
              <div className="text-orange-600 text-3xl sm:text-4xl shrink-0">
                <FaChalkboardTeacher />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
              <FaFileAlt className="text-sm sm:text-base" />
              <span>Generate Reports</span>
            </button>
            <button className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
              <FaDownload className="text-sm sm:text-base" />
              <span>Export Data</span>
            </button>
            <button className="bg-white border-2 border-gray-300 text-black hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium sm:col-span-2 lg:col-span-1">
              <FaCog className="text-sm sm:text-base" />
              <span>System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive Profiling System Management</p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div 
            onClick={handleNavigateToStudents}
            className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-600 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-orange-600 transition-colors">
                  Student Profiles
                </h3>
                <p className="text-gray-600">
                  Manage and view comprehensive student data, academic records, and profiling information.
                </p>
              </div>
              <div className="text-orange-600 text-4xl">
                <FaUserGraduate />
              </div>
            </div>
          </div>

          <div 
            onClick={handleNavigateToFaculty}
            className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-600 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-orange-600 transition-colors">
                  Faculty Profiles
                </h3>
                <p className="text-gray-600">
                  Access faculty information, teaching assignments, and professional development records.
                </p>
              </div>
              <div className="text-orange-600 text-4xl">
                <FaChalkboardTeacher />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <FaFileAlt />
              Generate Reports
            </button>
            <button className="bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <FaDownload />
              Export Data
            </button>
            <button className="bg-white border-2 border-gray-300 text-black hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <FaCog />
              System Settings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
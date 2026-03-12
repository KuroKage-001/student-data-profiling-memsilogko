import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserGraduate, FaShieldAlt, FaClock, FaChartBar, FaDesktop } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">CCS</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">Comprehensive Profiling System</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced Student and Faculty Management Platform for comprehensive data management and reporting
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div 
            onClick={() => navigate('/admin/login')}
            className="bg-white border-2 border-gray-200 rounded-lg p-6 md:p-8 hover:border-orange-600 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="text-orange-600 text-3xl md:text-4xl mr-4">
                    <FaUserShield />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-black group-hover:text-orange-600 transition-colors">
                    Admin Portal
                  </h3>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Access comprehensive student and faculty profiling tools, manage data, and generate detailed reports.
                </p>
              </div>
            </div>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              <span>Access Dashboard</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 md:p-8 cursor-not-allowed group opacity-60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="text-gray-400 text-3xl md:text-4xl mr-4">
                    <FaUserGraduate />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-400">
                    Student Portal
                  </h3>
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  Coming Soon - Student access to profiles, academic records, and personal information management.
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-sm font-medium">
              <span>Coming Soon</span>
              <span className="ml-2">⏳</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-semibold text-black mb-6 text-center">
            System Features & Benefits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-orange-600 text-2xl md:text-3xl mb-3 flex justify-center">
                <FaShieldAlt />
              </div>
              <h4 className="font-semibold text-black mb-2">Data Security</h4>
              <p className="text-gray-600 text-sm">Advanced encryption and secure data handling</p>
            </div>
            <div className="text-center">
              <div className="text-orange-600 text-2xl md:text-3xl mb-3 flex justify-center">
                <FaClock />
              </div>
              <h4 className="font-semibold text-black mb-2">Real-time Updates</h4>
              <p className="text-gray-600 text-sm">Instant data synchronization and updates</p>
            </div>
            <div className="text-center">
              <div className="text-orange-600 text-2xl md:text-3xl mb-3 flex justify-center">
                <FaChartBar />
              </div>
              <h4 className="font-semibold text-black mb-2">Comprehensive Reports</h4>
              <p className="text-gray-600 text-sm">Detailed analytics and reporting tools</p>
            </div>
            <div className="text-center">
              <div className="text-orange-600 text-2xl md:text-3xl mb-3 flex justify-center">
                <FaDesktop />
              </div>
              <h4 className="font-semibold text-black mb-2">User-friendly Interface</h4>
              <p className="text-gray-600 text-sm">Intuitive design for seamless navigation</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm md:text-base">
            Secure, comprehensive, and user-friendly profiling system for educational institutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
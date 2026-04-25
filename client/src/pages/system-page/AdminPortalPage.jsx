import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaChartLine, FaUsers, FaCog } from 'react-icons/fa';
import LoadingPage from '../../components/system-components/LoadingPage';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';

const AdminPortalPage = () => {
  usePageTitle('Admin Portal');
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userRole = user.role;
      
      // Redirect authenticated admin/faculty users to dashboard
      if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'student') {
        // Students shouldn't be here, redirect to student portal
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <LoadingPage message="Loading Admin Portal..." subMessage="Please wait..." />;
  }

  const features = [
    {
      icon: <FaUsers className="text-3xl" />,
      title: 'User Management',
      description: 'Manage students, faculty, and administrative users'
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: 'Analytics & Reports',
      description: 'Comprehensive insights and data visualization'
    },
    {
      icon: <FaCog className="text-3xl" />,
      title: 'System Configuration',
      description: 'Configure system settings and preferences'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <FaUserShield className="text-4xl text-orange-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Admin Portal
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            System administration, user management, and comprehensive oversight of all platform operations
          </p>

          <button
            onClick={() => navigate('/admin/login')}
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaUserShield className="mr-2" />
            Sign In to Admin Portal
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-orange-600 mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalPage;

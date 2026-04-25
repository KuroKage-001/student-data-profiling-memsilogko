import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaCalendarAlt, FaClipboardList, FaChartBar } from 'react-icons/fa';
import LoadingPage from '../../components/system-components/LoadingPage';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';

const FacultyPortalPage = () => {
  usePageTitle('Faculty Portal');
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userRole = user.role;
      
      // Redirect authenticated faculty users to dashboard
      if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'student') {
        // Students shouldn't be here, redirect to student portal
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <LoadingPage message="Loading Faculty Portal..." subMessage="Please wait..." />;
  }

  const features = [
    {
      icon: <FaClipboardList className="text-3xl" />,
      title: 'Student Profiling',
      description: 'Access and manage student academic profiles'
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: 'Class Scheduling',
      description: 'View and manage class schedules and assignments'
    },
    {
      icon: <FaChartBar className="text-3xl" />,
      title: 'Academic Reports',
      description: 'Generate and review academic performance reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <FaChalkboardTeacher className="text-4xl text-blue-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Faculty Portal
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Faculty and Department Chair access to student profiling, academic management, and reporting tools
          </p>

          <button
            onClick={() => navigate('/faculty/login')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaChalkboardTeacher className="mr-2" />
            Sign In to Faculty Portal
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
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
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyPortalPage;

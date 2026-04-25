import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaCalendar, FaIdCard, FaCalendarCheck } from 'react-icons/fa';
import LoadingPage from '../../components/system-components/LoadingPage';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';

const StudentPortalPage = () => {
  usePageTitle('Student Portal');
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userRole = user.role;
      
      // Redirect authenticated users to their appropriate dashboard
      if (userRole === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
        // Admin/Faculty shouldn't be here, redirect to admin portal
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <LoadingPage message="Loading Student Portal..." subMessage="Please wait..." />;
  }

  const features = [
    {
      icon: <FaIdCard className="text-3xl" />,
      title: 'Personal Profile',
      description: 'View and manage your academic profile and information'
    },
    {
      icon: <FaCalendar className="text-3xl" />,
      title: 'Class Schedule',
      description: 'Access your class schedules and timetables'
    },
    {
      icon: <FaCalendarCheck className="text-3xl" />,
      title: 'Events & Activities',
      description: 'Stay updated with campus events and activities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FaUserGraduate className="text-4xl text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Student Portal
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Student access to profiles, academic records, and personal information management
          </p>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaUserGraduate className="mr-2" />
            Sign In to Student Portal
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-green-600 mb-4">{feature.icon}</div>
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
            className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPortalPage;

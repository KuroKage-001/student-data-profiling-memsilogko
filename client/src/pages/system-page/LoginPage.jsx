import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/LoginPage.css';
import { 
  LoginForm, 
  LoginHeader, 
  LoginFooter, 
  CarouselSection, 
  MobileCarousel 
} from '../../components/system-components/login-compo';
import usePageTitle from '../../hooks/usePageTitle';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  usePageTitle('Login');
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userRole = user.role;
      
      // Redirect based on role
      if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'student') {
        navigate('/profile/settings', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-md w-full">
          <LoginHeader />
          <LoginForm />
          <LoginFooter />
        </div>
      </div>

      {/* Right Side - Desktop Carousel */}
      <CarouselSection />

      {/* Mobile Carousel */}
      <MobileCarousel />

      {/* Toast Container with Modern Styling */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          zIndex: 9999,
          top: '24px',
          right: '24px',
        }}
        toastStyle={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(234, 88, 12, 0.1), 0 8px 10px -6px rgba(234, 88, 12, 0.1)',
          padding: '0',
          minHeight: '72px',
        }}
      />
    </div>
  );
};

export default LoginPage;
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

const LoginPage = () => {

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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
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
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-orange-100 p-12 sm:p-14 lg:p-16">
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
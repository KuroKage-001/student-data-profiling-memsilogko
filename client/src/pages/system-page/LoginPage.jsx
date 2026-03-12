import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  // Carousel slides data
  const slides = [
    {
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Comprehensive Profiling System",
      description: "Streamline student and faculty data management with our comprehensive profiling platform designed for educational excellence."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Secure & Reliable",
      description: "Advanced security measures ensure your data is protected with enterprise-grade encryption and secure access controls."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with optimized data processing and intuitive user interface for seamless workflow."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Team Collaboration",
      description: "Foster collaboration between administrators, faculty, and students with integrated communication and data sharing tools."
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(credentials);
    
    if (result.success) {
      showSuccess('Login Successful...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      showError(result.message || 'Login failed. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-orange-600 rounded-2xl mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl font-bold text-white">CCS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">
              Sign in to access the Comprehensive Profiling System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white text-sm sm:text-base"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white text-sm sm:text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
              Secure access to student and faculty profiles
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auto-sliding Carousel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden rounded-tl-[3rem] lg:rounded-tl-[4rem]">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-400 via-orange-500 to-orange-600"></div>
        <div className="absolute inset-0 bg-linear-to-t from-orange-700/30 via-transparent to-orange-300/20"></div>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-orange-500/10 to-orange-600/30"></div>
        
        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center p-12 w-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-white/5 rounded-full"></div>
          </div>

          {/* Carousel Content */}
          <div className="max-w-md text-center text-white relative z-20">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-sm mb-6 transition-all duration-500 shadow-lg">
                {slides[currentSlide].icon}
              </div>
            </div>
            
            <div className="transition-all duration-500 ease-in-out">
              <h2 className="text-3xl font-bold mb-4 drop-shadow-sm">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-orange-50 leading-relaxed drop-shadow-sm">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Slide Indicators */}
            <div className="mt-8 flex items-center justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/60 w-2'
                  }`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-white/20 rounded-full h-1 shadow-inner">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-100 ease-linear shadow-sm"
                style={{
                  width: `${((currentSlide + 1) / slides.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Carousel - Visible only on mobile */}
      <div className="lg:hidden relative overflow-hidden rounded-t-4xl">
        {/* Mobile Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-400 via-orange-500 to-orange-600"></div>
        <div className="absolute inset-0 bg-linear-to-t from-orange-700/30 via-transparent to-orange-300/20"></div>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-orange-500/10 to-orange-600/30"></div>
        
        {/* Mobile Content */}
        <div className="relative z-10 py-8 px-4">
          <div className="max-w-sm mx-auto text-center text-white">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4 transition-all duration-500 shadow-lg">
                {slides[currentSlide].icon}
              </div>
            </div>
            
            <div className="transition-all duration-500 ease-in-out">
              <h2 className="text-xl font-bold mb-3 drop-shadow-sm">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm text-orange-50 leading-relaxed drop-shadow-sm">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Mobile Slide Indicators */}
            <div className="mt-6 flex items-center justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/60 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
        style={{
          top: '20px',
          right: '20px',
          width: '400px',
          maxWidth: '90vw',
          zIndex: 9999,
        }}
      />

      {/* Custom Toast Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-toast {
            border-radius: 12px !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            border: none !important;
            margin-bottom: 12px !important;
            backdrop-filter: blur(10px) !important;
            animation: slideInRight 0.3s ease-out !important;
          }

          .custom-toast-body {
            padding: 0 !important;
            margin: 0 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            font-weight: 500 !important;
            line-height: 1.5 !important;
          }

          .custom-toast-progress-success {
            background: linear-gradient(90deg, #10b981, #059669) !important;
            height: 3px !important;
            border-radius: 0 0 12px 12px !important;
          }

          .custom-toast-progress-error {
            background: linear-gradient(90deg, #ef4444, #dc2626) !important;
            height: 3px !important;
            border-radius: 0 0 12px 12px !important;
          }

          .custom-toast-progress-warning {
            background: linear-gradient(90deg, #f59e0b, #d97706) !important;
            height: 3px !important;
            border-radius: 0 0 12px 12px !important;
          }

          .custom-toast-progress-info {
            background: linear-gradient(90deg, #3b82f6, #2563eb) !important;
            height: 3px !important;
            border-radius: 0 0 12px 12px !important;
          }

          .Toastify__close-button {
            color: #6b7280 !important;
            opacity: 0.7 !important;
            transition: all 0.2s ease !important;
          }

          .Toastify__close-button:hover {
            opacity: 1 !important;
            transform: scale(1.1) !important;
          }

          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @media (max-width: 640px) {
            .Toastify__toast-container {
              width: calc(100vw - 32px) !important;
              right: 16px !important;
              top: 16px !important;
            }
          }
        `
      }} />
    </div>
  );
};

export default LoginPage;
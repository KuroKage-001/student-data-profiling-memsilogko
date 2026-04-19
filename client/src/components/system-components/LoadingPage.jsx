const LoadingPage = ({ message = "Loading", subMessage = "Initializing..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Logo and spinner container */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400"></div>
          </div>
          
          {/* Middle rotating ring */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-b-orange-600 border-l-orange-500"></div>
          </div>
          
          {/* Center logo */}
          <div className="w-24 h-24 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
              <span className="text-white text-3xl font-bold tracking-tight">C</span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center gap-4">
          {/* Main heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              CCS PnC Profiling System
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full"></div>
          </div>

          {/* Loading status */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <p className="text-gray-600 font-medium text-lg">{message}</p>
            
            {/* Animated dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-orange-700 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
            </div>
            
            {/* Sub message */}
            <p className="text-gray-400 text-sm font-light tracking-wide">{subMessage}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

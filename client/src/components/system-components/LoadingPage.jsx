const LoadingPage = ({ message = "Loading application...", subMessage = "Initializing..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50">
      <div className="flex flex-col items-center gap-6 relative">
        {/* Decorative background circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl"></div>
        
        {/* Main spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 absolute top-0 left-0"></div>
          
          {/* Center logo/icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">C</span>
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 font-semibold text-lg">{message}</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        {/* System name */}
        <div className="text-center mt-2">
          <p className="text-orange-600 text-sm font-medium">CCS PnC Profiling System</p>
          <p className="text-gray-400 text-xs mt-1">{subMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

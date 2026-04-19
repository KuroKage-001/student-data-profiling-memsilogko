const LoadingPage = ({ message = "Loading", subMessage = "Initializing..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          CCS PnC Profiling System
        </h1>
        <p className="text-gray-600">{message}</p>
        
        {/* Bouncing dots */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-orange-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-gray-500 text-sm">{subMessage}</p>
      </div>
    </div>
  );
};

export default LoadingPage;

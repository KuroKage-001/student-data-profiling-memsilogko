const LoginHeader = () => {
  return (
    <div className="text-center mb-8 lg:mb-10">
      <div className="mb-4 sm:mb-6">
        <img 
          src="/src/assets/images/pnc-header-2.png" 
          alt="PNC Header" 
          className="mx-auto h-16 sm:h-20 w-auto object-contain"
        />
      </div>
      <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">
        Sign in to access the Comprehensive Profiling System
      </p>
    </div>
  );
};

export { LoginHeader };
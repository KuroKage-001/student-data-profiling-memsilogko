import { useLocation } from 'react-router-dom';
import pncHeaderImage from '../../../assets/images/pnc-header-2.png';

const LoginHeader = () => {
  const location = useLocation();
  
  const getPortalInfo = () => {
    switch (location.pathname) {
      case '/admin/login':
        return {
          title: 'Admin Portal',
          description: 'Sign in to access the administrative dashboard and system management tools'
        };
      case '/faculty/login':
        return {
          title: 'Faculty Portal',
          description: 'Sign in to access student profiling, academic management, and reporting tools'
        };
      default:
        return {
          title: 'Student Portal',
          description: 'Sign in to access your student profile and academic information'
        };
    }
  };

  const portalInfo = getPortalInfo();

  return (
    <div className="text-center mb-12 lg:mb-14">
      <div className="mb-8 sm:mb-10">
        <img 
          src={pncHeaderImage} 
          alt="PNC Header" 
          className="mx-auto h-24 sm:h-28 w-auto object-contain"
        />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-linear-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
        {portalInfo.title}
      </h2>
      <p className="text-sm sm:text-base px-4 sm:px-0 leading-relaxed" style={{ color: '#5A6A7A' }}>
        {portalInfo.description}
      </p>
    </div>
  );
};

export { LoginHeader };
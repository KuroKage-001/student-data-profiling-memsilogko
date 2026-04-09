import { useLocation } from 'react-router-dom';
import pncHeaderImage from '../../../assets/images/pnc-header-2.png';

const LoginHeader = () => {
  const location = useLocation();
  const isAdminPortal = location.pathname === '/admin/login';

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
        {isAdminPortal ? 'Admin Portal' : 'Student Portal'}
      </h2>
      <p className="text-sm sm:text-base px-4 sm:px-0 leading-relaxed" style={{ color: '#5A6A7A' }}>
        {isAdminPortal 
          ? 'Sign in to access the administrative dashboard and management tools'
          : 'Sign in to access your student profile and academic information'
        }
      </p>
    </div>
  );
};

export { LoginHeader };
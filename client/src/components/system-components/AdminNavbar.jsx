import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => navigate('/admin/dashboard')}
              className="cursor-pointer"
            >
              <h1 className="text-xl font-bold text-black">CCS Admin</h1>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/dashboard')
                    ? 'bg-orange-600 text-white'
                    : 'text-black hover:text-orange-600'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => navigate('/admin/students')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/students')
                    ? 'bg-orange-600 text-white'
                    : 'text-black hover:text-orange-600'
                }`}
              >
                Students
              </button>
              
              <button
                onClick={() => navigate('/admin/faculty')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin/faculty')
                    ? 'bg-orange-600 text-white'
                    : 'text-black hover:text-orange-600'
                }`}
              >
                Faculty
              </button>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-black hover:text-orange-600 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="hidden md:block">Admin</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/admin/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-50 transition-colors"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-2 space-y-1">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              isActive('/admin/dashboard')
                ? 'bg-orange-600 text-white'
                : 'text-black hover:text-orange-600'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => navigate('/admin/students')}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              isActive('/admin/students')
                ? 'bg-orange-600 text-white'
                : 'text-black hover:text-orange-600'
            }`}
          >
            Students
          </button>
          
          <button
            onClick={() => navigate('/admin/faculty')}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              isActive('/admin/faculty')
                ? 'bg-orange-600 text-white'
                : 'text-black hover:text-orange-600'
            }`}
          >
            Faculty
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
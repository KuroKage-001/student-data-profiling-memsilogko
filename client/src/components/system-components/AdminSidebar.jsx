import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveNavigation } from '../../hooks';
import { useAuth } from '../../context/AuthContext';

function AdminSidebar({ isOpen, onClose, onCollapseChange }) {
  const navigate = useNavigate();
  const { activeItem, setActiveItem } = useActiveNavigation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapse state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
    // Notify parent component about collapse state change
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  // Notify parent on mount about initial state
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, []);

  const menuItems = [
    // Admin, Dept Chair & Faculty Dashboard
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      route: '/admin/dashboard',
      roles: ['admin', 'dept_chair', 'faculty'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4m8-4v4" />
        </svg>
      )
    },
    // Student Dashboard
    { 
      id: 'student-dashboard', 
      label: 'Dashboard', 
      route: '/student/dashboard',
      roles: ['student'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4m8-4v4" />
        </svg>
      )
    },
    { 
      id: 'user-management', 
      label: 'User Management', 
      route: '/admin/user-management',
      roles: ['admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: 'student-profile', 
      label: 'Students', 
      route: '/admin/students',
      roles: ['admin', 'faculty'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'faculty-profile', 
      label: 'Faculty', 
      route: '/admin/faculty',
      roles: ['admin', 'dept_chair'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'events', 
      label: 'Events', 
      route: '/admin/events',
      roles: ['admin', 'faculty'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'scheduling', 
      label: 'Scheduling', 
      route: '/admin/scheduling',
      roles: ['admin', 'dept_chair', 'faculty'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'college-research', 
      label: 'Research', 
      route: '/admin/research',
      roles: ['admin', 'faculty'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'instructions', 
      label: 'Instructions', 
      route: '/admin/instructions',
      roles: ['admin'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.route);
    // Close sidebar on mobile after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-45 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        data-sidebar
        className={`
          fixed lg:fixed top-16 left-0 z-46 lg:z-auto
          ${isCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] bg-white shadow-2xl lg:shadow-lg border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-visible
        `}
      >
        {/* Header */}
        <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white px-6 py-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          <div className="relative flex items-center justify-between">
            <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
              <h2 className="text-xl font-bold whitespace-nowrap">CCS PnC</h2>
              <p className="text-xs text-orange-100 mt-1 font-medium whitespace-nowrap">Profiling System</p>
            </div>
            {isCollapsed && (
              <div className="flex items-center justify-center w-full">
                <div className="w-10 h-10 flex items-center justify-center">
                  <span className="text-2xl font-bold">C</span>
                </div>
              </div>
            )}
            {/* Close button for mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Collapse Toggle Button - Desktop Only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-orange-600 rounded-full items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50 border-2 border-orange-200"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1.5 px-3">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group relative overflow-hidden ${
                    activeItem === item.id
                      ? 'bg-linear-to-r from-orange-50 to-orange-100 text-orange-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  {/* Active indicator */}
                  {activeItem === item.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-r-full"></div>
                  )}
                  
                  <span className={`transition-all duration-200 ${
                    activeItem === item.id 
                      ? 'text-orange-600 scale-110' 
                      : 'text-gray-400 group-hover:text-gray-600 group-hover:scale-105'
                  } ${isCollapsed ? 'mx-auto' : ''}`}>
                    {item.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <>
                      <span className={`text-sm font-semibold ${
                        activeItem === item.id ? 'text-orange-700' : ''
                      }`}>
                        {item.label}
                      </span>
                      
                      {/* Hover arrow */}
                      <svg 
                        className={`w-4 h-4 ml-auto transition-all duration-200 ${
                          activeItem === item.id 
                            ? 'opacity-100 translate-x-0 text-orange-600' 
                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`py-4 border-t border-gray-200 bg-linear-to-br from-gray-50 to-white transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-600 text-xs font-medium">System Online</p>
              </div>
              <p className="text-gray-400 text-xs text-center">© 2026 CCS System</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-gray-400 text-[9px] font-semibold text-center leading-tight tracking-wide">2026</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
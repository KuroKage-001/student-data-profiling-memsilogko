import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/students')) return 'student-profile';
    if (path.includes('/faculty')) return 'faculty-profile';
    if (path.includes('/events')) return 'events';
    if (path.includes('/scheduling')) return 'scheduling';
    if (path.includes('/research')) return 'college-research';
    if (path.includes('/instructions')) return 'instructions';
    return 'dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      route: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4m8-4v4" />
        </svg>
      )
    },
    { 
      id: 'student-profile', 
      label: 'Student Profile', 
      route: '/admin/students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'faculty-profile', 
      label: 'Faculty Profile', 
      route: '/admin/faculty',
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
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'college-research', 
      label: 'College Research', 
      route: '/admin/research',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'instructions', 
      label: 'Instructions (Syllabus, Curriculum, lessons)', 
      route: '/admin/instructions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.route);
  };

  return (
    <div className="w-64 bg-white min-h-screen shadow-lg flex flex-col">
      {/* Header */}
      <div className="bg-orange-800 text-white p-6">
        <h2 className="text-lg font-bold">CCS Admin</h2>
        <p className="text-sm text-orange-100">Profiling System - Admin</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-6 py-3 transition-all duration-150 flex items-center gap-3 ${
                  activeItem === item.id
                    ? 'bg-orange-800 text-white border-l-4 border-orange-600'
                    : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                }`}
              >
                <span className={activeItem === item.id ? 'text-white' : 'text-orange-700'}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => navigate('/admin/login')}
          className="w-full text-left px-2 py-2 text-gray-600 hover:text-orange-700 transition-colors flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-gray-500 text-xs text-center">© 2026 CCS Profiling System</p>
      </div>
    </div>
  );
}

export default AdminSidebar;
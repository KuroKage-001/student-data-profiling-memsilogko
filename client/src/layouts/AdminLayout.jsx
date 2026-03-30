import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../hooks';
import AdminNavbar from '../components/system-components/AdminNavbar';
import AdminSidebar from '../components/system-components/AdminSidebar';

const AdminLayout = ({ children, hideSidebar = false }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  const handleCollapseChange = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Auto-hide sidebar on profile settings page
  const shouldHideSidebar = hideSidebar || location.pathname === '/admin/profile-settings';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      {/* Main Layout Container */}
      <div className="flex pt-16"> {/* pt-16 to account for fixed navbar height */}
        {/* Sidebar - conditionally rendered */}
        {!shouldHideSidebar && (
          <AdminSidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
            onCollapseChange={handleCollapseChange}
          />
        )}
        
        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 ${
          !shouldHideSidebar && (isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
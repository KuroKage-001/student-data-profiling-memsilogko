import { useSidebar } from '../hooks';
import AdminNavbar from '../components/system-components/AdminNavbar';
import AdminSidebar from '../components/system-components/AdminSidebar';

const AdminLayout = ({ children }) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <AdminNavbar onToggleSidebar={toggleSidebar} />
      
      {/* Main Layout Container */}
      <div className="flex pt-16"> {/* pt-16 to account for fixed navbar height */}
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
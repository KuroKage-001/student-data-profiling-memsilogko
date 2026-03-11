import AdminSidebar from '../system-components/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
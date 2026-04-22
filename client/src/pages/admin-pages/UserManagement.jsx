import { useState, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import UserList from '../../components/admin-components/user-management-compo/UserList';
import UserFormModal from '../../components/admin-components/user-management-compo/UserFormModal';
import DeleteConfirmModal from '../../components/admin-components/user-management-compo/DeleteConfirmModal';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/user-management-hook';
import { UserManagementSkeleton } from '../../layouts/skeleton-loading';
import useToast from '../../hooks/useToast';
import usePageTitle from '../../hooks/usePageTitle';
import { FaUsers, FaSearch, FaPlus, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const UserManagement = () => {
  usePageTitle('User Management');
  
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all'
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (filters.role !== 'all') params.role = filters.role;
    if (filters.status !== 'all') params.status = filters.status;
    return params;
  }, [searchTerm, filters]);

  // React Query hooks
  const { data: users = [], isLoading, error } = useUsers(queryParams);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  
  const { showSuccess, showError } = useToast();

  // Show error toast if query fails
  if (error) {
    showError(error.message || 'Failed to fetch users');
  }

  const handleAddUser = () => {
    setUserToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (userToEdit) {
        const result = await updateUserMutation.mutateAsync({ 
          id: userToEdit.id, 
          userData: formData 
        });
        showSuccess(result.message || 'User updated successfully');
      } else {
        const result = await createUserMutation.mutateAsync(formData);
        showSuccess(result.message || 'User created successfully');
      }
      setIsFormModalOpen(false);
      setUserToEdit(null);
    } catch (error) {
      // Handle validation errors specifically
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        showError(`Validation failed: ${errorMessages.join(', ')}`);
      } else {
        showError(error.message || 'Operation failed');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const result = await deleteUserMutation.mutateAsync(userToDelete.id);
      showSuccess(result.message || 'User deleted successfully');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      showError(error.message || 'Failed to delete user');
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setUserToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Show skeleton loading while data is being fetched
  if (isLoading) {
    return (
      <AdminLayout>
        <ToastContainer />
        <UserManagementSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-base sm:text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                User Management
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 ml-10 sm:ml-13 font-medium">
            Manage system users and access control
          </p>
        </div>

        {/* Search and Actions Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-100 mb-4 sm:mb-6 shrink-0">
          <div className="space-y-2.5 sm:space-y-3 lg:space-y-0 lg:flex lg:gap-3 lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-xs sm:text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={handleAddUser}
                className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 active:scale-95 text-white px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm w-full sm:w-auto"
              >
                <FaPlus className="text-xs" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Filters Toggle Button (Mobile Only) */}
          <div className="mt-3 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-lg transition-all text-gray-700 font-medium text-sm"
            >
              <div className="flex items-center gap-2">
                <FaFilter className="text-xs text-orange-600" />
                <span>Filters</span>
                {(filters.role !== 'all' || filters.status !== 'all') && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-600 rounded-full">
                    {[filters.role !== 'all', filters.status !== 'all'].filter(Boolean).length}
                  </span>
                )}
              </div>
              {showFilters ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>
          </div>

          {/* Filters Section */}
          <div className={`mt-3 pt-3 border-t border-gray-200 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrator</option>
                  <option value="dept_chair">Department Chairman</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* User List - Scrollable */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
          <UserList
            users={users}
            searchTerm={searchTerm}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            loading={isLoading}
          />
        </div>

        {/* Modals */}
        <UserFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSubmit={handleFormSubmit}
          user={userToEdit}
          loading={createUserMutation.isPending || updateUserMutation.isPending}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          user={userToDelete}
          loading={deleteUserMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagement;

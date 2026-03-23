import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../layouts/AdminLayout';
import UserList from '../../components/admin-components/user-management-compo/UserList';
import UserFormModal from '../../components/admin-components/user-management-compo/UserFormModal';
import DeleteConfirmModal from '../../components/admin-components/user-management-compo/DeleteConfirmModal';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/user-management-hook';
import useToast from '../../hooks/useToast';
import { FaUsers, FaSearch, FaPlus } from 'react-icons/fa';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // React Query hooks
  const { data: users = [], isLoading, error } = useUsers();
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
      showError(error.message || 'Operation failed');
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

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                User Management
              </h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-13 font-medium">
            Manage system users and access control
          </p>
        </div>

        {/* Search and Actions Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-4 sm:mb-6 shrink-0">
          <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-4 lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:flex-1 lg:max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch className="text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all text-gray-900 text-sm sm:text-base placeholder:text-gray-400 shadow-sm focus:shadow-md"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col min-[480px]:flex-row gap-3 w-full min-[480px]:w-auto lg:w-auto">
              <button
                onClick={handleAddUser}
                className="group relative bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <FaPlus className="text-sm relative z-10" />
                <span className="relative z-10">Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* User List - Scrollable */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-0">
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

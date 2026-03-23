# User Management Documentation

Welcome to the User Management system documentation. This folder contains comprehensive guides for implementing and using the user management feature.

## 📚 Documentation Files

### 1. [QUICK_START.md](./QUICK_START.md)
**Quick reference guide for getting started**
- Setup instructions
- Quick actions
- Common commands
- File locations
- Testing tips

**Best for:** Developers who want to get up and running quickly.

### 2. [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md)
**Complete technical documentation**
- Feature overview
- Technical architecture
- API endpoints
- Component structure
- Security features
- Troubleshooting
- Future enhancements

**Best for:** Developers who need detailed technical information.

### 3. [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
**Implementation checklist and summary**
- Completed features
- Files created
- Key features
- Design patterns
- Testing checklist
- Status overview

**Best for:** Project managers and developers reviewing the implementation.

## 🎯 Quick Navigation

### For Developers
1. Start with [QUICK_START.md](./QUICK_START.md) to set up
2. Reference [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md) for details
3. Check [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for overview

### For Users
- See the "Usage" section in [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md)

### For Troubleshooting
- Check "Troubleshooting" in [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md)
- Review "Common Issues" in [QUICK_START.md](./QUICK_START.md)

## 🚀 Quick Setup

```bash
# 1. Run migration
cd server
php artisan migrate

# 2. Start backend
php artisan serve

# 3. Start frontend (in new terminal)
cd client
npm run dev

# 4. Access at http://localhost:5173/admin/user-management
```

## 📋 Feature Overview

The User Management system provides:
- ✅ Create, Read, Update, Delete (CRUD) operations
- ✅ User roles (admin, faculty, student)
- ✅ User status (active, inactive, suspended)
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Form validation
- ✅ Security features

## 🔗 Related Documentation

- [ERD Diagrams](../diagrams/) - Database structure
- [Login Documentation](../login-page-documentations/) - Authentication system

## 📞 Support

If you need help:
1. Check the documentation files in this folder
2. Review error messages in browser console
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify database migrations are up to date

## 📝 Version History

- **v1.0.0** (March 22, 2026) - Initial implementation
  - Full CRUD functionality
  - Role-based access
  - Responsive UI
  - Complete documentation

## 🎓 Key Concepts

### User Roles
- **Admin**: Full system access, can manage all users
- **Faculty**: Faculty-specific features and permissions
- **Student**: Student-specific features and permissions

### User Status
- **Active**: User can login and access the system
- **Inactive**: User account is disabled, cannot login
- **Suspended**: User is temporarily blocked from access

### Security
- All endpoints require JWT authentication
- Passwords are hashed using bcrypt
- Users cannot delete their own account
- Email addresses must be unique

## 🛠️ Technology Stack

### Backend
- Laravel (PHP)
- MySQL Database
- JWT Authentication
- RESTful API

### Frontend
- React
- React Router
- Tailwind CSS
- Axios
- React Icons
- React Toastify

## 📊 File Structure

```
user-management-documentations/
├── README.md (this file)
├── QUICK_START.md
├── USER_MANAGEMENT_GUIDE.md
└── IMPLEMENTATION_SUMMARY.md
```

## ✨ Features at a Glance

| Feature | Status | Description |
|---------|--------|-------------|
| Create User | ✅ | Add new users with validation |
| View User | ✅ | Display detailed user information |
| Edit User | ✅ | Update user details |
| Delete User | ✅ | Remove users with confirmation |
| Search | ✅ | Real-time search filtering |
| Responsive | ✅ | Works on all devices |
| Validation | ✅ | Client and server-side |
| Security | ✅ | JWT auth, password hashing |

## 🎯 Next Steps

1. Read [QUICK_START.md](./QUICK_START.md) for setup
2. Explore [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md) for details
3. Review [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for overview
4. Start building!

---

**Last Updated:** March 22, 2026  
**Status:** Complete and Production Ready ✅

=======================================================================

# User Management Hooks

This directory contains hooks for managing users in the application.

## Available Hooks

### React Query Hooks (Recommended)

#### `useUsers(params)`
Fetches all users with optional parameters.
- **Returns**: `{ data, isLoading, error, refetch }`
- **Features**: Automatic caching, background refetching, optimistic updates

#### `useUser(id)`
Fetches a single user by ID.
- **Returns**: `{ data, isLoading, error }`
- **Features**: Only fetches when ID is provided

#### `useCreateUser()`
Creates a new user.
- **Returns**: `{ mutate, mutateAsync, isPending, error }`
- **Features**: Automatically invalidates user list cache on success

#### `useUpdateUser()`
Updates an existing user.
- **Returns**: `{ mutate, mutateAsync, isPending, error }`
- **Usage**: `mutateAsync({ id, userData })`
- **Features**: Automatically invalidates user list and detail cache on success

#### `useDeleteUser()`
Deletes a user.
- **Returns**: `{ mutate, mutateAsync, isPending, error }`
- **Features**: Automatically invalidates user list cache on success

#### `useUserStatistics()`
Fetches user statistics.
- **Returns**: `{ data, isLoading, error }`
- **Features**: 10-minute cache time

### Legacy Hook

#### `useUserManagement()`
Traditional state management hook (deprecated in favor of React Query hooks).

## Benefits of React Query

1. **Automatic Caching**: Data is cached and reused across components
2. **Background Refetching**: Keeps data fresh automatically
3. **Optimistic Updates**: UI updates immediately, rolls back on error
4. **Loading States**: Built-in loading and error states
5. **Request Deduplication**: Multiple components requesting same data = single request
6. **Stale-While-Revalidate**: Shows cached data while fetching fresh data

## Example Usage

```jsx
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/user-management-hook';

function UserManagement() {
  // Fetch users
  const { data: users = [], isLoading, error } = useUsers();
  
  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  // Create user
  const handleCreate = async (userData) => {
    try {
      await createUser.mutateAsync(userData);
      // Success! List automatically refetches
    } catch (error) {
      // Handle error
    }
  };
  
  // Update user
  const handleUpdate = async (id, userData) => {
    try {
      await updateUser.mutateAsync({ id, userData });
    } catch (error) {
      // Handle error
    }
  };
  
  // Delete user
  const handleDelete = async (id) => {
    try {
      await deleteUser.mutateAsync(id);
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    // Your component JSX
  );
}
```

# User Management Documentation

This folder contains comprehensive documentation for the User Management system and User Profile Settings.

## Documentation Files

### 1. USER_PROFILE_ROLE_FIELDS_UPDATE.md
Complete technical documentation of the role-specific fields implementation:
- Database schema changes
- Backend API updates
- Frontend component modifications
- Validation rules
- Testing checklist

### 2. ROLE_FIELDS_QUICK_REFERENCE.md
Quick reference guide for role-specific field requirements:
- Field requirements by role
- Department and position options
- Student number format
- Common workflows
- Validation messages

## Features

### User Management
- Create, read, update, and delete users
- Role-based field requirements
- Department and position management
- Student number tracking
- Status management (active/inactive/suspended)
- Search and filter functionality

### User Profile Settings
- View and edit personal information
- Role-specific field display
- Password change functionality
- Read-only role-specific fields

## Role Types

1. **Student**
   - Requires: Department, Student Number
   - Displays: Student Number, Program

2. **Faculty**
   - Requires: Department, Position
   - Displays: Department, Position

3. **Admin**
   - Requires: Department, Position
   - Displays: Department, Position

4. **Department Chairman**
   - Requires: Department, Position
   - Displays: Department, Position

## Key Files

### Backend
- `server/app/Models/User.php` - User model
- `server/app/Http/Controllers/UserManagementController.php` - User management API
- `server/app/Http/Controllers/UserProfileController.php` - Profile API
- `server/database/migrations/2026_04_10_000000_add_position_to_users_table.php` - Position field migration

### Frontend
- `client/src/pages/admin-pages/UserManagement.jsx` - User management page
- `client/src/pages/system-page/UserProfileSettings.jsx` - Profile settings page
- `client/src/components/admin-components/user-management-compo/UserFormModal.jsx` - User form
- `client/src/components/system-components/user-profile-setting-compo/ProfileInfoTab.jsx` - Profile info display
- `client/src/utils/admin-utilities/user-management-utils/userValidation.js` - Validation logic

## API Endpoints

### User Management
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users-statistics` - Get user statistics

### User Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/change-password` - Change password

## Getting Started

1. **Run Migration**
   ```bash
   cd server
   php artisan migrate
   ```

2. **Access User Management**
   - Login as admin
   - Navigate to User Management
   - Create/edit users with role-specific fields

3. **View Profile**
   - Click profile icon
   - Go to Profile Settings
   - View role-specific information

## Support

For questions or issues:
1. Check the quick reference guide
2. Review the technical documentation
3. Contact system administrator

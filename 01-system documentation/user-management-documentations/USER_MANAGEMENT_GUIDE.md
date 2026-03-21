# User Management System Documentation

## Overview
The User Management system provides comprehensive CRUD (Create, Read, Update, Delete) functionality for managing system users with role-based access control.

## Features

### 1. User Listing
- Display all users in a responsive table/card layout
- Search functionality by name, email, or role
- Real-time filtering
- Pagination support
- Mobile-responsive design

### 2. Create User
- Add new users with the following fields:
  - Full Name (required)
  - Email Address (required, unique)
  - Password (required, minimum 8 characters)
  - Role (admin, faculty, student)
  - Status (active, inactive, suspended)
- Form validation with error messages
- Duplicate email prevention

### 3. View User
- Display detailed user information
- View user profile with all attributes
- Formatted date display
- Color-coded role and status badges

### 4. Update User
- Edit existing user information
- Optional password update (leave blank to keep current)
- Update role and status
- Form validation
- Email uniqueness check (excluding current user)

### 5. Delete User
- Confirmation modal before deletion
- Prevent self-deletion
- Cascade handling for related data
- Success/error notifications

## Technical Architecture

### Backend (Laravel)

#### Controller
**File:** `server/app/Http/Controllers/UserManagementController.php`

**Endpoints:**
- `GET /api/users` - List all users with filtering and pagination
- `GET /api/users/{id}` - Get single user details
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update existing user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users-statistics` - Get user statistics

#### Model
**File:** `server/app/Models/User.php`

**Fields:**
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (admin, faculty, student)
- `status` - Account status (active, inactive, suspended)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

#### Migration
**File:** `server/database/migrations/2026_03_22_000000_add_role_to_users_table.php`

Adds `role` and `status` columns to the users table.

#### Routes
**File:** `server/routes/api.php`

All user management routes are protected with `auth:api` middleware.

### Frontend (React)

#### Main Page
**File:** `client/src/pages/admin-pages/UserManagement.jsx`

Main component that orchestrates all user management functionality.

#### Components

1. **UserList** (`client/src/components/admin-components/user-management-compo/UserList.jsx`)
   - Displays users in table (desktop) and card (mobile) layouts
   - Handles search filtering
   - Action buttons for view, edit, delete

2. **UserFormModal** (`client/src/components/admin-components/user-management-compo/UserFormModal.jsx`)
   - Form for creating and editing users
   - Client-side validation
   - Password visibility toggle
   - Handles both create and update modes

3. **UserViewModal** (`client/src/components/admin-components/user-management-compo/UserViewModal.jsx`)
   - Displays detailed user information
   - Read-only view with formatted data

4. **DeleteConfirmModal** (`client/src/components/admin-components/user-management-compo/DeleteConfirmModal.jsx`)
   - Confirmation dialog for user deletion
   - Displays user details before deletion

#### Services
**File:** `client/src/services/user-management-service/userManagementService.js`

Handles all API communication for user management operations.

#### Hooks
**File:** `client/src/hooks/user-management-hook/useUserManagement.js`

Custom hook that manages:
- User state
- Loading states
- Error handling
- CRUD operations
- Pagination

#### Utilities

1. **userHelpers.js** - Helper functions for:
   - Status color coding
   - Role color coding
   - Date formatting
   - Text capitalization
   - User filtering

2. **userValidation.js** - Validation functions for:
   - Email format validation
   - Password strength validation
   - Form data validation

## Setup Instructions

### Backend Setup

1. Run the migration:
```bash
cd server
php artisan migrate
```

2. The routes are automatically registered in `api.php`

3. Ensure JWT authentication is configured

### Frontend Setup

1. The route is already added to `App.jsx`

2. The sidebar menu item is already configured in `AdminSidebar.jsx`

3. No additional dependencies needed (uses existing packages)

## Usage

### Accessing User Management
1. Login as an admin user
2. Click "User Management" in the sidebar
3. The user management page will load

### Creating a User
1. Click "Add User" button
2. Fill in the form:
   - Enter full name
   - Enter email address
   - Create a password (min 8 characters)
   - Select role (admin, faculty, or student)
   - Select status (active, inactive, or suspended)
3. Click "Create User"

### Viewing a User
1. Find the user in the list
2. Click "View" button
3. User details modal will appear

### Editing a User
1. Find the user in the list
2. Click "Edit" button
3. Update the desired fields
4. Leave password blank to keep current password
5. Click "Update User"

### Deleting a User
1. Find the user in the list
2. Click "Delete" button
3. Confirm deletion in the modal
4. User will be permanently deleted

### Searching Users
1. Use the search bar at the top
2. Type name, email, or role
3. Results filter in real-time

## Security Features

1. **Authentication Required** - All endpoints protected with JWT middleware
2. **Password Hashing** - Passwords are hashed using bcrypt
3. **Self-Deletion Prevention** - Users cannot delete their own account
4. **Email Uniqueness** - Prevents duplicate email addresses
5. **Input Validation** - Both client and server-side validation
6. **Role-Based Access** - Only admins should access this feature

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* user data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors */ }
}
```

## Future Enhancements

1. **Bulk Operations** - Select and delete multiple users
2. **Export Functionality** - Export user list to CSV/Excel
3. **Advanced Filtering** - Filter by role, status, date range
4. **User Activity Log** - Track user actions and changes
5. **Password Reset** - Admin-initiated password reset
6. **Email Notifications** - Send welcome emails to new users
7. **Profile Pictures** - Upload and manage user avatars
8. **Permissions Management** - Granular permission control

## Troubleshooting

### Common Issues

1. **"Failed to fetch users"**
   - Check if backend server is running
   - Verify JWT token is valid
   - Check API endpoint URL

2. **"Email already exists"**
   - Email must be unique across all users
   - Try a different email address

3. **"Cannot delete your own account"**
   - This is a security feature
   - Use another admin account to delete

4. **Validation errors**
   - Ensure all required fields are filled
   - Password must be at least 8 characters
   - Email must be valid format

## File Structure

```
client/src/
├── pages/admin-pages/
│   └── UserManagement.jsx
├── components/admin-components/user-management-compo/
│   ├── UserList.jsx
│   ├── UserFormModal.jsx
│   ├── UserViewModal.jsx
│   ├── DeleteConfirmModal.jsx
│   └── index.js
├── services/user-management-service/
│   └── userManagementService.js
├── hooks/user-management-hook/
│   ├── useUserManagement.js
│   └── index.js
└── utils/admin-utilities/user-management-utils/
    ├── userHelpers.js
    ├── userValidation.js
    └── index.js

server/
├── app/Http/Controllers/
│   └── UserManagementController.php
├── app/Models/
│   └── User.php
├── database/migrations/
│   └── 2026_03_22_000000_add_role_to_users_table.php
└── routes/
    └── api.php
```

## Maintenance

### Regular Tasks
1. Monitor user creation patterns
2. Review inactive accounts
3. Audit user roles and permissions
4. Clean up suspended accounts
5. Backup user data regularly

### Database Maintenance
```sql
-- Find inactive users
SELECT * FROM users WHERE status = 'inactive';

-- Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Find users created in last 30 days
SELECT * FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify database migrations are up to date

# User Management - Quick Start Guide

## Setup (One-time)

### Backend
```bash
cd server
php artisan migrate
```

### Frontend
Already configured! Just start the dev server:
```bash
cd client
npm run dev
```

## Access
1. Login as admin at `/admin/login`
2. Click "User Management" in sidebar
3. Route: `/admin/user-management`

## Quick Actions

### Create User
```
Click "Add User" → Fill form → Submit
Required: Name, Email, Password, Role, Status
```

### Edit User
```
Click "Edit" on user row → Update fields → Submit
Password optional (leave blank to keep current)
```

### Delete User
```
Click "Delete" on user row → Confirm → Done
Note: Cannot delete your own account
```

### Search
```
Type in search bar → Results filter automatically
Searches: Name, Email, Role
```

## User Roles
- **Admin**: Full system access
- **Faculty**: Faculty-specific features
- **Student**: Student-specific features

## User Status
- **Active**: Can login and use system
- **Inactive**: Cannot login
- **Suspended**: Temporarily blocked

## API Endpoints

```
GET    /api/users              - List users
GET    /api/users/{id}         - Get user
POST   /api/users              - Create user
PUT    /api/users/{id}         - Update user
DELETE /api/users/{id}         - Delete user
GET    /api/users-statistics   - Get stats
```

All endpoints require authentication (`auth:api` middleware).

## Validation Rules

### Name
- Required
- Minimum 2 characters

### Email
- Required
- Valid email format
- Must be unique

### Password
- Required for new users
- Minimum 8 characters
- Optional for updates

### Role
- Required
- Must be: admin, faculty, or student

### Status
- Required
- Must be: active, inactive, or suspended

## Common Issues

**"Failed to fetch users"**
→ Check backend is running and JWT token is valid

**"Email already exists"**
→ Use a different email address

**"Cannot delete your own account"**
→ This is intentional for security

## File Locations

### Frontend
- Page: `client/src/pages/admin-pages/UserManagement.jsx`
- Components: `client/src/components/admin-components/user-management-compo/`
- Service: `client/src/services/user-management-service/`
- Hook: `client/src/hooks/user-management-hook/`
- Utils: `client/src/utils/admin-utilities/user-management-utils/`

### Backend
- Controller: `server/app/Http/Controllers/UserManagementController.php`
- Model: `server/app/Models/User.php`
- Routes: `server/routes/api.php`
- Migration: `server/database/migrations/2026_03_22_000000_add_role_to_users_table.php`

## Testing

### Create Test User
```bash
# Using Tinker
php artisan tinker

User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => Hash::make('password123'),
    'role' => 'student',
    'status' => 'active'
]);
```

### API Testing (Postman/cURL)
```bash
# Login first to get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Then use token for user management
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Tips

1. **Search is instant** - No need to press Enter
2. **Password field** - Leave blank when editing to keep current password
3. **Mobile friendly** - Works on all screen sizes
4. **Real-time updates** - List refreshes after create/update/delete
5. **Error messages** - Check toast notifications for feedback

## Next Steps

After basic setup:
1. Create admin users
2. Set up faculty accounts
3. Configure student access
4. Test all CRUD operations
5. Review security settings

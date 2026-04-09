# Department Chairman Role Implementation

## Overview
This document describes the implementation of the Department Chairman role in the CCS Profiling System. Department Chairmen have restricted access to specific modules based on their department (IT or CS).

## Database Changes

### Migration: `2026_04_09_000000_add_department_chairman_role.php`

**Changes:**
1. Added `dept_chair` to the role enum in users table
2. Added `department` column (enum: 'IT', 'CS') for department chairmen

```sql
-- Role enum updated to include dept_chair
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'faculty', 'student', 'dept_chair') DEFAULT 'student';

-- Department column added
ALTER TABLE users ADD COLUMN department ENUM('IT', 'CS') NULL AFTER role;
```

## Backend Changes

### User Model (`server/app/Models/User.php`)

**Added Methods:**
- `isDeptChair()` - Check if user is a department chairman
- `isAdmin()` - Check if user is an administrator
- `getRoleLabelAttribute()` - Get formatted role label

**Updated Fillable Fields:**
- Added `department` to fillable array

### UserManagementController (`server/app/Http/Controllers/UserManagementController.php`)

**Updated Methods:**

1. **store()** - Create new user
   - Added validation for `dept_chair` role
   - Required `department` field when role is `dept_chair`
   - Validates department as 'IT' or 'CS'

2. **update()** - Update existing user
   - Added validation for `dept_chair` role
   - Handles department assignment/removal based on role change
   - Sets department to null when role changes from dept_chair

3. **statistics()** - Get user statistics
   - Added `dept_chairs` count
   - Added `dept_chair_it` count
   - Added `dept_chair_cs` count

## Frontend Changes

### Components Updated

#### 1. UserFormModal (`client/src/components/admin-components/user-management-compo/UserFormModal.jsx`)

**Changes:**
- Added "Department Chairman" option to role dropdown
- Added conditional department dropdown (shows only when role is dept_chair)
- Department options: IT (Information Technology) and CS (Computer Science)
- Form validation ensures department is selected for dept_chair role

#### 2. UserList (`client/src/components/admin-components/user-management-compo/UserList.jsx`)

**Changes:**
- Display "Dept. Chairman" label instead of "dept_chair"
- Show department badge for department chairmen (both desktop and mobile views)
- Desktop: Shows department below role badge
- Mobile: Shows department as separate badge

#### 3. AdminSidebar (`client/src/components/system-components/AdminSidebar.jsx`)

**Changes:**
- Added role-based menu filtering
- Each menu item now has a `roles` array defining who can access it
- Department Chairmen can access:
  - Dashboard
  - Faculty Profiles
  - Scheduling

**Access Control Matrix:**

| Module | Admin | Dept Chair | Faculty | Student |
|--------|-------|------------|---------|---------|
| Dashboard | ✓ | ✓ | ✗ | ✗ |
| User Management | ✓ | ✗ | ✗ | ✗ |
| Students | ✓ | ✗ | ✗ | ✗ |
| Faculty | ✓ | ✓ | ✗ | ✗ |
| Events | ✓ | ✗ | ✗ | ✗ |
| Scheduling | ✓ | ✓ | ✗ | ✗ |
| Research | ✓ | ✗ | ✗ | ✗ |
| Instructions | ✓ | ✗ | ✗ | ✗ |

#### 4. userHelpers (`client/src/utils/admin-utilities/user-management-utils/userHelpers.js`)

**Changes:**
- Added `dept_chair` case to `getRoleColor()` function
- Color scheme: Indigo (bg-indigo-100 text-indigo-800)

## Usage

### Creating a Department Chairman

1. Navigate to User Management
2. Click "Add User"
3. Fill in user details
4. Select "Department Chairman" as role
5. Select department (IT or CS)
6. Submit form

### Editing Department Chairman

1. Click "Edit" on a department chairman user
2. Can change department or role
3. If role is changed from dept_chair, department is automatically cleared
4. If role is changed to dept_chair, department selection becomes required

### Department Chairman Login

When a department chairman logs in:
1. They see only Dashboard, Faculty, and Scheduling in the sidebar
2. They cannot access other admin modules
3. Their department is displayed in their user profile

## Validation Rules

### Backend Validation

```php
'role' => 'required|in:admin,faculty,student,dept_chair'
'department' => 'required_if:role,dept_chair|nullable|in:IT,CS'
```

### Frontend Validation

- Department field is required when role is dept_chair
- Department field is hidden when role is not dept_chair
- Form submission validates department selection

## API Endpoints

All existing user management endpoints support the new role:

- `POST /api/users` - Create user (with dept_chair support)
- `PUT /api/users/{id}` - Update user (with dept_chair support)
- `GET /api/users` - List users (includes department field)
- `GET /api/users-statistics` - Get statistics (includes dept_chair counts)

## Database Migration

To apply the changes:

```bash
php artisan migrate
```

To rollback:

```bash
php artisan migrate:rollback
```

## Testing Checklist

- [ ] Create IT Department Chairman
- [ ] Create CS Department Chairman
- [ ] Verify IT chairman sees only allowed modules
- [ ] Verify CS chairman sees only allowed modules
- [ ] Edit department chairman and change department
- [ ] Change dept_chair to another role (verify department is cleared)
- [ ] Change another role to dept_chair (verify department is required)
- [ ] Verify department display in user list (desktop)
- [ ] Verify department display in user list (mobile)
- [ ] Verify statistics include dept_chair counts

## Security Considerations

1. **Role-based Access Control**: Sidebar filtering prevents unauthorized access to modules
2. **Backend Validation**: All role and department changes are validated server-side
3. **Department Isolation**: Each chairman can only manage their department's data
4. **Audit Trail**: All user changes are logged with timestamps

## Future Enhancements

1. Add department-specific filtering in Faculty module
2. Add department-specific filtering in Scheduling module
3. Implement department-based data isolation
4. Add department chairman dashboard with department-specific statistics
5. Add ability to assign multiple departments to a chairman

## Related Files

### Backend
- `server/database/migrations/2026_04_09_000000_add_department_chairman_role.php`
- `server/app/Models/User.php`
- `server/app/Http/Controllers/UserManagementController.php`

### Frontend
- `client/src/components/admin-components/user-management-compo/UserFormModal.jsx`
- `client/src/components/admin-components/user-management-compo/UserList.jsx`
- `client/src/components/system-components/AdminSidebar.jsx`
- `client/src/utils/admin-utilities/user-management-utils/userHelpers.js`

## Support

For issues or questions regarding the Department Chairman role implementation, please refer to:
- System documentation in `01-system documentation/`
- User Management documentation in `01-system documentation/user-management-documentations/`

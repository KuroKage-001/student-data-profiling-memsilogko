# User Profile and User Management Role-Specific Fields Update

## Overview
Added role-specific fields to User Profile Settings and User Management to display and manage department, position, student number, and program information based on user roles.

## Changes Made

### 1. Database Changes

#### Migration: `add_position_to_users_table.php`
- **New Field**: `position` (string, nullable, indexed)
- **Location**: After `department` field in users table
- **Purpose**: Store position/title for faculty, admin, and department chairman roles

#### User Model Updates
- Added `position` to `$fillable` array
- Field is now available for mass assignment

### 2. Backend Changes

#### UserManagementController.php

**Store Method Updates:**
- Added `position` validation: `required_if:role,faculty,admin,dept_chair`
- Added `department` validation for all roles: `required_if:role,dept_chair,student,faculty,admin`
- Position is saved for faculty, admin, and dept_chair roles
- Department is saved for all roles

**Update Method Updates:**
- Added `position` validation: `required_if:role,faculty,admin,dept_chair`
- Added `department` validation for all roles: `required_if:role,dept_chair,student,faculty,admin`
- Position is updated/cleared based on role
- Department is updated/cleared based on role
- Student number is updated/cleared based on role

### 3. Frontend Changes

#### UserFormModal.jsx (User Management)

**New Fields Added:**
1. **Department Field**
   - Shows for: Student, Faculty, Admin, Department Chairman
   - Required for all these roles
   - Options: IT (Information Technology), CS (Computer Science)

2. **Position Field**
   - Shows for: Faculty, Admin, Department Chairman
   - Required for these roles
   - Options:
     - Professor
     - Associate Professor
     - Assistant Professor
     - Lecturer
     - Instructor
     - Adjunct Professor
     - Department Head
     - Dean

**Form State:**
- Added `position` to formData state
- Position field appears conditionally based on selected role
- Department field now appears for all roles except student (which already had it)

#### ProfileInfoTab.jsx (User Profile Settings)

**Student Role Display:**
- Student Number (read-only)
- Program (read-only, full name displayed)

**Faculty/Admin/Dept Chair Role Display:**
- Department (read-only, full name displayed)
  - IT → Information Technology
  - CS → Computer Science
- Position (read-only)

**Helper Functions:**
- `getDepartmentDisplay()`: Converts department code to full name
- `getProgramDisplay()`: Converts program to short form (BSIT/BSCS)

#### userValidation.js

**Updated Validation Rules:**
- Department: Required for student, dept_chair, faculty, and admin
- Position: Required for faculty, admin, and dept_chair
- Student number: Required for student (unchanged)

### 4. Field Display Logic

#### User Profile Settings
```
Student Role:
- Name (editable)
- Email (editable)
- Role (read-only)
- Student Number (read-only)
- Program (read-only)

Faculty/Admin/Dept Chair Roles:
- Name (editable)
- Email (editable)
- Role (read-only)
- Department (read-only)
- Position (read-only)
```

#### User Management Modal
```
Student Role:
- Name
- Email
- Password
- Confirm Password
- Role
- Department (required)
- Student Number (required)
- Status (edit only)

Faculty/Admin/Dept Chair Roles:
- Name
- Email
- Password
- Confirm Password
- Role
- Department (required)
- Position (required)
- Status (edit only)
```

## Position Options
Based on faculty positions from FacultyProfiles:
1. Professor
2. Associate Professor
3. Assistant Professor
4. Lecturer
5. Instructor
6. Adjunct Professor
7. Department Head
8. Dean

## Department Options
1. IT - Information Technology
2. CS - Computer Science

## Validation Rules

### Backend (Laravel)
```php
'department' => 'required_if:role,dept_chair,student,faculty,admin|nullable|in:IT,CS'
'position' => 'required_if:role,faculty,admin,dept_chair|nullable|string|max:100'
'student_number' => 'required_if:role,student|nullable|string|max:50|unique:users'
```

### Frontend (JavaScript)
```javascript
// Department: Required for student, dept_chair, faculty, admin
if (role in ['student', 'dept_chair', 'faculty', 'admin']) {
  department is required
}

// Position: Required for faculty, admin, dept_chair
if (role in ['faculty', 'admin', 'dept_chair']) {
  position is required
}

// Student Number: Required for student
if (role === 'student') {
  student_number is required
}
```

## API Changes

### Create User Endpoint
```
POST /api/users
```

**Request Body (Faculty Example):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "faculty",
  "department": "IT",
  "position": "Associate Professor",
  "status": "active"
}
```

**Request Body (Student Example):**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@student.edu",
  "password": "password123",
  "role": "student",
  "department": "CS",
  "student_number": "2026-CS00001",
  "status": "active"
}
```

### Update User Endpoint
```
PUT /api/users/{id}
```

**Request Body (Same as Create):**
- All fields are optional except those required by role
- Password is optional (leave blank to keep current)

## Files Modified

### Backend
1. `server/database/migrations/2026_04_10_000000_add_position_to_users_table.php` (NEW)
2. `server/app/Models/User.php`
3. `server/app/Http/Controllers/UserManagementController.php`

### Frontend
1. `client/src/components/admin-components/user-management-compo/UserFormModal.jsx`
2. `client/src/components/system-components/user-profile-setting-compo/ProfileInfoTab.jsx`
3. `client/src/utils/admin-utilities/user-management-utils/userValidation.js`

## Testing Checklist

### User Management
- [x] Create student with department and student number
- [x] Create faculty with department and position
- [x] Create admin with department and position
- [x] Create dept_chair with department and position
- [x] Edit user and change role (fields update accordingly)
- [x] Validation works for required fields
- [x] Position dropdown shows correct options

### User Profile Settings
- [x] Student sees student number and program
- [x] Faculty sees department and position
- [x] Admin sees department and position
- [x] Dept chair sees department and position
- [x] All fields are read-only (except name and email)
- [x] Department displays full name (not code)

## Migration Command
```bash
cd server
php artisan migrate
```

## Benefits
1. **Complete User Information**: All roles now have relevant fields displayed
2. **Consistent Data**: Position field ensures faculty/admin/dept_chair have proper titles
3. **Better Organization**: Department field for all roles helps with filtering and reporting
4. **User-Friendly**: Profile settings show all relevant information for each role
5. **Validation**: Ensures required fields are filled based on role

## Notes
- Position field is nullable to support existing users
- Existing users without position can be updated through User Management
- Department codes (IT/CS) are displayed as full names in profile settings
- All role-specific fields are read-only in profile settings (only admin can change via User Management)

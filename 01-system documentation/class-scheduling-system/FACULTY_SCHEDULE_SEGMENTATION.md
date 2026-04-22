# Faculty Schedule Segmentation Implementation

## Overview
Implemented role-based access control for the scheduling system to ensure faculty users can only view their own assigned schedules, while administrators and department chairs retain full access to manage all schedules.

## Problem Statement
Previously, all users with access to the scheduling page could see all class sections regardless of their role. Faculty members could see schedules assigned to other faculty members, which violated data privacy and created confusion.

## Solution Implemented

### 1. Database Changes

#### Migration: Add user_id to faculty table
**File**: `server/database/migrations/2026_04_22_000000_add_user_id_to_faculty_table.php`

Added `user_id` foreign key to establish relationship between `users` and `faculty` tables:
- Links faculty profiles to user accounts
- Enables role-based filtering
- Cascades on delete to maintain referential integrity

```php
$table->foreignId('user_id')->nullable()->after('id')
    ->constrained('users')->onDelete('cascade');
```

### 2. Model Updates

#### Faculty Model
**File**: `server/app/Models/Faculty.php`

Added relationships:
- `user()` - BelongsTo relationship to User model
- Updated fillable fields to include `user_id`

#### User Model
**File**: `server/app/Models/User.php`

Added relationships and helper methods:
- `facultyProfile()` - HasOne relationship to Faculty model
- `isFaculty()` - Helper method to check if user has faculty profile

### 3. Backend Controller Changes

#### ClassSectionController
**File**: `server/app/Http/Controllers/ClassSectionController.php`

**index() method** - List class sections:
- Added role-based filtering
- Faculty users only see their assigned classes
- Admin and dept_chair see all classes
- Filters using `whereHas` on facultyAssignments relationship

```php
if ($user && in_array($user->role, ['faculty']) && $user->facultyProfile) {
    $facultyId = $user->facultyProfile->id;
    $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
        $q->where('faculty_id', $facultyId)
          ->where('status', 'active');
    });
}
```

**statistics() method** - Get statistics:
- Applied same filtering logic
- Faculty see statistics only for their classes
- Admin and dept_chair see system-wide statistics

**store() method** - Create class section:
- Added authorization check
- Only admin and dept_chair can create
- Returns 403 Forbidden for faculty users

**update() method** - Update class section:
- Added authorization check
- Only admin and dept_chair can update
- Returns 403 Forbidden for faculty users

**destroy() method** - Delete class section:
- Added authorization check
- Only admin and dept_chair can delete
- Returns 403 Forbidden for faculty users

### 4. Frontend Changes

#### Scheduling.jsx
**File**: `client/src/pages/admin-pages/Scheduling.jsx`

**Added AuthContext integration**:
```javascript
import { useAuth } from '../../context/AuthContext';
const { user } = useAuth();
```

**Permission checking**:
```javascript
const canManageSchedules = user && ['admin', 'dept_chair'].includes(user.role);
```

**UI Adaptations**:

1. **Dynamic Page Title**:
   - Admin/Dept Chair: "Scheduling Management"
   - Faculty: "My Schedule"

2. **Dynamic Description**:
   - Admin/Dept Chair: "Manage class schedules, room assignments, and faculty assignments"
   - Faculty: "View your assigned class schedules and teaching assignments"

3. **Conditional Buttons**:
   - "Add Schedule" button: Hidden for faculty
   - "Edit" button: Hidden for faculty
   - "Delete" button: Hidden for faculty
   - "View" button: Visible for all roles

4. **Applied to both views**:
   - Desktop table view
   - Mobile card view

## User Experience by Role

### Admin / Department Chair
- Full access to all schedules
- Can create new class sections
- Can edit existing class sections
- Can delete class sections
- Can view all statistics
- Can see weekly schedule overview for all classes

### Faculty
- View-only access to their assigned schedules
- Cannot create new class sections
- Cannot edit class sections
- Cannot delete class sections
- Can view statistics for their classes only
- Can see weekly schedule overview for their classes only
- Page titled "My Schedule" instead of "Scheduling Management"

## Security Features

1. **Backend Authorization**:
   - All write operations (create, update, delete) check user role
   - Returns 403 Forbidden if unauthorized
   - Cannot be bypassed from frontend

2. **Data Filtering**:
   - Applied at query level using Eloquent relationships
   - Faculty users physically cannot access other faculty's data
   - Filtering happens before data leaves the server

3. **Frontend UI**:
   - Hides management buttons for faculty
   - Provides clear visual indication of permissions
   - Prevents accidental unauthorized actions

## Testing Checklist

### As Admin/Dept Chair:
- [ ] Can see all class sections
- [ ] Can create new class sections
- [ ] Can edit any class section
- [ ] Can delete class sections
- [ ] Statistics show all classes
- [ ] "Add Schedule" button is visible
- [ ] Edit and Delete buttons are visible

### As Faculty:
- [ ] Can only see assigned class sections
- [ ] Cannot see other faculty's classes
- [ ] Cannot create new class sections
- [ ] Cannot edit class sections
- [ ] Cannot delete class sections
- [ ] Statistics show only their classes
- [ ] "Add Schedule" button is hidden
- [ ] Edit and Delete buttons are hidden
- [ ] "View" button works correctly
- [ ] Page title shows "My Schedule"

### API Testing:
- [ ] Faculty user GET /api/class-sections returns only their classes
- [ ] Faculty user POST /api/class-sections returns 403
- [ ] Faculty user PUT /api/class-sections/{id} returns 403
- [ ] Faculty user DELETE /api/class-sections/{id} returns 403
- [ ] Admin user has full access to all endpoints

## Migration Steps

1. **Run the migration**:
   ```bash
   php artisan migrate
   ```

2. **Link existing faculty to users** (if needed):
   ```sql
   UPDATE faculty f
   JOIN users u ON f.email = u.email
   SET f.user_id = u.id
   WHERE u.role IN ('faculty', 'dept_chair');
   ```

3. **Verify relationships**:
   - Check that faculty records have user_id populated
   - Ensure users with faculty role have corresponding faculty profiles

4. **Test the implementation**:
   - Login as admin - verify full access
   - Login as dept_chair - verify full access
   - Login as faculty - verify restricted access

## Benefits

1. **Data Privacy**: Faculty can only see their own schedules
2. **Security**: Backend enforcement prevents unauthorized access
3. **User Experience**: Clear indication of permissions
4. **Maintainability**: Role-based logic is centralized
5. **Scalability**: Easy to add more roles or permissions

## Future Enhancements

1. **Department-level filtering**: Dept chairs see only their department
2. **Audit logging**: Track who views/modifies schedules
3. **Notification system**: Alert faculty of schedule changes
4. **Export functionality**: Faculty can export their schedules
5. **Calendar integration**: Sync with external calendar apps

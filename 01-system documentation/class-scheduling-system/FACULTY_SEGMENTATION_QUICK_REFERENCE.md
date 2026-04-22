# Faculty Schedule Segmentation - Quick Reference

## What Changed?

Faculty users now only see their own assigned schedules. Admin and department chairs continue to see all schedules.

## Quick Setup

### 1. Run Migration
```bash
cd server
php artisan migrate
```

### 2. Link Faculty to Users (if needed)
If you have existing faculty records without user_id:

```sql
UPDATE faculty f
JOIN users u ON f.email = u.email
SET f.user_id = u.id
WHERE u.role IN ('faculty', 'dept_chair');
```

## Role Permissions

| Action | Admin | Dept Chair | Faculty |
|--------|-------|------------|---------|
| View all schedules | ✅ | ✅ | ❌ |
| View own schedules | ✅ | ✅ | ✅ |
| Create schedule | ✅ | ✅ | ❌ |
| Edit schedule | ✅ | ✅ | ❌ |
| Delete schedule | ✅ | ✅ | ❌ |
| View all statistics | ✅ | ✅ | ❌ |
| View own statistics | ✅ | ✅ | ✅ |

## API Endpoints Affected

### GET /api/class-sections
- **Admin/Dept Chair**: Returns all class sections
- **Faculty**: Returns only their assigned class sections

### GET /api/class-sections-statistics
- **Admin/Dept Chair**: Returns statistics for all classes
- **Faculty**: Returns statistics for their classes only

### POST /api/class-sections
- **Admin/Dept Chair**: Can create ✅
- **Faculty**: Returns 403 Forbidden ❌

### PUT /api/class-sections/{id}
- **Admin/Dept Chair**: Can update ✅
- **Faculty**: Returns 403 Forbidden ❌

### DELETE /api/class-sections/{id}
- **Admin/Dept Chair**: Can delete ✅
- **Faculty**: Returns 403 Forbidden ❌

## Frontend Changes

### Page Title
- **Admin/Dept Chair**: "Scheduling Management"
- **Faculty**: "My Schedule"

### Visible Buttons
- **Admin/Dept Chair**: Add, Edit, Delete, View
- **Faculty**: View only

## Testing

### Test as Faculty User
1. Login as faculty
2. Navigate to Scheduling page
3. Verify:
   - Page title is "My Schedule"
   - Only your assigned classes are visible
   - No "Add Schedule" button
   - No Edit/Delete buttons
   - View button works

### Test as Admin
1. Login as admin
2. Navigate to Scheduling page
3. Verify:
   - Page title is "Scheduling Management"
   - All classes are visible
   - "Add Schedule" button present
   - Edit/Delete buttons present

## Troubleshooting

### Faculty sees no schedules
**Cause**: Faculty record not linked to user account

**Solution**:
```sql
-- Check if faculty has user_id
SELECT id, name, email, user_id FROM faculty WHERE email = 'faculty@example.com';

-- If user_id is NULL, link it
UPDATE faculty 
SET user_id = (SELECT id FROM users WHERE email = 'faculty@example.com')
WHERE email = 'faculty@example.com';
```

### Faculty can still edit schedules
**Cause**: Frontend cache or role not properly set

**Solution**:
1. Clear browser cache
2. Logout and login again
3. Verify user role in database:
```sql
SELECT id, name, email, role FROM users WHERE email = 'faculty@example.com';
```

### 403 Error when faculty tries to create
**Expected behavior** - This is correct! Faculty should not be able to create schedules.

## Files Modified

### Backend
- `server/database/migrations/2026_04_22_000000_add_user_id_to_faculty_table.php` (NEW)
- `server/app/Models/Faculty.php`
- `server/app/Models/User.php`
- `server/app/Http/Controllers/ClassSectionController.php`

### Frontend
- `client/src/pages/admin-pages/Scheduling.jsx`

## Key Code Snippets

### Check if user can manage schedules (Frontend)
```javascript
const { user } = useAuth();
const canManageSchedules = user && ['admin', 'dept_chair'].includes(user.role);
```

### Filter by faculty (Backend)
```php
if ($user && in_array($user->role, ['faculty']) && $user->facultyProfile) {
    $facultyId = $user->facultyProfile->id;
    $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
        $q->where('faculty_id', $facultyId)->where('status', 'active');
    });
}
```

### Check authorization (Backend)
```php
if ($user && $user->role === 'faculty') {
    return response()->json([
        'success' => false,
        'message' => 'Unauthorized. Only administrators and department chairs can create class sections.'
    ], 403);
}
```

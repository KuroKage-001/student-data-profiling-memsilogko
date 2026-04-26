# Student Number Auto-Generation Fix

## Issue
In production, when creating a new student user with the "leave blank for auto-generate" option for Student Number, the system was returning errors:

1. **Initial Error (422 Validation Error)**:
```
Validation failed - student_number: The student number field is required when role is student.
```

2. **Secondary Error (500 Internal Server Error)**:
```
SQLSTATE[25P02]: In failed sql transaction: 7 ERROR: current transaction is aborted, 
commands ignored until end of transaction block
SQL: select * from "users" where "student_id"::text LIKE STU2026-IT% order by "student_id" desc limit 1
```

## Root Causes

### Issue 1: Validation Rules
The backend validation in `UserManagementController.php` had conflicting rules:
1. In the `store` method: `student_number` was marked as `nullable` but the logic didn't properly handle empty strings
2. In the `update` method: `student_number` had `required_if:role,student` which prevented auto-generation
3. When the frontend sent an empty string `""`, Laravel treated it as present but empty, causing validation issues

### Issue 2: PostgreSQL Compatibility
The `LIKE` operator usage was incompatible with PostgreSQL (used in production on Render):
- MySQL allows: `where('column', 'LIKE', 'pattern%')`
- PostgreSQL requires: `whereRaw("column LIKE ?", ['pattern%'])` for proper type handling

The error occurred in three methods:
- `generateStudentNumber()` - querying `student_number` field
- `generateStudentId()` - querying `student_id` field  
- `generateFacultyId()` - querying `faculty_id` field

## Solution

### Backend Changes (`server/app/Http/Controllers/UserManagementController.php`)

#### 1. Store Method (Line ~138)
**Added preprocessing to remove empty student_number:**
```php
public function store(Request $request)
{
    // Remove empty student_number to allow auto-generation
    if ($request->has('student_number') && empty(trim($request->student_number))) {
        $request->request->remove('student_number');
    }
    
    $validator = Validator::make($request->all(), [
        // ... other rules
        'student_number' => 'nullable|string|max:50|unique:users',
        // ... other rules
    ]);
    // ... rest of the method
}
```

#### 2. Update Method (Line ~300)
**Fixed validation rule and added preprocessing:**
```php
public function update(Request $request, $id)
{
    try {
        DB::beginTransaction();
        
        $user = User::findOrFail($id);
        $oldRole = $user->role;

        // Remove empty student_number to allow auto-generation
        if ($request->has('student_number') && empty(trim($request->student_number))) {
            $request->request->remove('student_number');
        }

        $validator = Validator::make($request->all(), [
            // ... other rules
            'student_number' => 'nullable|string|max:50|unique:users,student_number,' . $id,
            // Changed from: 'required_if:role,student|nullable|...'
            // ... other rules
        ]);
        // ... rest of validation
    }
    // ... rest of the method
}
```

#### 3. Update Method - Student Number Handling (Line ~365)
**Fixed auto-generation logic:**
```php
// Handle student_number for student role
if ($request->role === 'student') {
    // Auto-generate student number if not provided
    if (!$request->has('student_number')) {
        $updateData['student_number'] = $this->generateStudentNumber($request->department);
    } else {
        $updateData['student_number'] = $request->student_number;
    }
    
    // ... rest of student profile setup
}
```

**Changed from:**
```php
if ($request->role === 'student' && $request->has('student_number')) {
    $updateData['student_number'] = $request->student_number;
    // ... (no auto-generation fallback)
}
```

## How It Works Now

### Creating a New Student User
1. **Frontend** (`UserFormModal.jsx`): When student_number is empty, it's deleted from the request payload
2. **Backend** (`store` method): 
   - Preprocesses request to remove empty student_number strings
   - Validates with `nullable` rule (no longer requires it)
   - Auto-generates student_number using `generateStudentNumber()` method
   - Format: `YYYY-DEPT00001` (e.g., `2026-IT00001`)

### Updating a Student User
1. **Frontend**: Same behavior - removes empty student_number
2. **Backend** (`update` method):
   - Preprocesses request to remove empty student_number strings
   - Validates with `nullable` rule (removed `required_if`)
   - Auto-generates if not provided
   - Uses existing value if provided

## Auto-Generation Logic

### Fixed `generateStudentNumber()` Method
**Changed for PostgreSQL compatibility:**
```php
private function generateStudentNumber($department)
{
    $year = date('Y');
    $prefix = $year . '-' . $department;
    
    // Get the highest existing student number for this department and year
    // Use whereRaw for PostgreSQL compatibility
    $lastStudent = User::whereRaw("student_number LIKE ?", [$prefix . '%'])
        ->orderBy('student_number', 'desc')
        ->first();
    
    if ($lastStudent) {
        // Extract the number part and increment
        $lastNumber = (int) substr($lastStudent->student_number, -5);
        $nextNumber = $lastNumber + 1;
    } else {
        // Start from 1 if no existing students
        $nextNumber = 1;
    }
    
    // Format with leading zeros
    return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
}
```

**Changed from:**
```php
// Old MySQL-style query (incompatible with PostgreSQL)
$lastStudent = User::where('student_number', 'LIKE', $prefix . '%')
    ->orderBy('student_number', 'desc')
    ->first();
```

### Fixed `generateStudentId()` Method
```php
private function generateStudentId($department)
{
    $year = date('Y');
    $prefix = 'STU' . $year . '-' . $department;
    
    // Use whereRaw for PostgreSQL compatibility
    $lastStudent = User::whereRaw("student_id LIKE ?", [$prefix . '%'])
        ->orderBy('student_id', 'desc')
        ->first();
    
    // ... rest of logic
}
```

### Fixed `generateFacultyId()` Method
```php
private function generateFacultyId()
{
    $prefix = 'FAC';
    $year = date('y');
    
    // Use whereRaw for PostgreSQL compatibility
    $lastFaculty = Faculty::whereRaw("faculty_id LIKE ?", ["{$prefix}{$year}%"])
        ->orderBy('faculty_id', 'desc')
        ->first();
    
    // ... rest of logic
}
```

## Testing

### Test Case 1: Create Student with Auto-Generated Number
1. Open User Management
2. Click "Add User"
3. Fill in required fields (name, email, password, department)
4. Select role: "Student"
5. Leave "Student Number" field blank
6. Submit
7. ✅ User should be created with auto-generated student number (e.g., `2026-IT00001`)

### Test Case 2: Create Student with Custom Number
1. Open User Management
2. Click "Add User"
3. Fill in required fields
4. Select role: "Student"
5. Enter custom student number (e.g., `2026-IT99999`)
6. Submit
7. ✅ User should be created with the custom student number

### Test Case 3: Update Student Role (Non-Student to Student)
1. Edit an existing non-student user
2. Change role to "Student"
3. Leave student number blank
4. Submit
5. ✅ User should be updated with auto-generated student number

## Files Modified
- `server/app/Http/Controllers/UserManagementController.php`
  - `store()` method: Added empty string preprocessing
  - `update()` method: Fixed validation rule and added auto-generation logic
  - `generateStudentNumber()` method: Fixed PostgreSQL compatibility (whereRaw)
  - `generateStudentId()` method: Fixed PostgreSQL compatibility (whereRaw)
  - `generateFacultyId()` method: Fixed PostgreSQL compatibility (whereRaw)

## Database Compatibility
- **Development**: Works with MySQL/MariaDB (XAMPP)
- **Production**: Works with PostgreSQL (Render/Neon)
- **Solution**: Using `whereRaw()` with parameterized queries ensures compatibility with both databases

## Why This Matters
PostgreSQL is stricter about type comparisons than MySQL:
- MySQL implicitly casts types in `LIKE` comparisons
- PostgreSQL requires explicit handling, which is why the error showed `"student_id"::text LIKE`
- Using `whereRaw()` with bound parameters (`?`) lets Laravel handle the type casting properly for both databases

## Frontend (No Changes Required)
The frontend already correctly handles this by deleting empty student_number from the payload:
```javascript
// Remove empty student_number to allow auto-generation
if (submitData.role === 'student' && (!submitData.student_number || submitData.student_number.trim() === '')) {
  delete submitData.student_number;
}
```

## Deployment Notes
1. Deploy the updated `UserManagementController.php` to production
2. No database migrations required
3. No frontend changes required
4. Test with both auto-generation and custom student numbers

## Related Files
- Backend: `server/app/Http/Controllers/UserManagementController.php`
- Frontend: `client/src/components/admin-components/user-management-compo/UserFormModal.jsx`
- Frontend: `client/src/pages/admin-pages/UserManagement.jsx`

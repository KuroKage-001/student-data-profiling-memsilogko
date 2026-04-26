# User Management Auto-Generation Fix - Quick Summary

## Problem
Creating student users with auto-generated student numbers failed in production with:
```
500 Internal Server Error
SQLSTATE[25P02]: In failed sql transaction
SQL: select * from "users" where student_id LIKE STU2026-IT%
```

## Root Cause
PostgreSQL (production) requires explicit type casting for `LIKE` queries, while MySQL (local) doesn't.

## Solution Applied

### Changed in `UserManagementController.php`:

#### 1. Validation Fix (Lines ~140-145)
```php
// Remove empty student_number before validation
if ($request->has('student_number') && empty(trim($request->student_number))) {
    $request->request->remove('student_number');
}
```

#### 2. PostgreSQL-Compatible Queries
```php
// generateStudentNumber()
User::whereRaw("student_number::text LIKE ?", [$prefix . '%'])

// generateStudentId()
User::whereRaw("student_id::text LIKE ?", [$prefix . '%'])

// generateFacultyId()
Faculty::whereRaw("faculty_id::text LIKE ?", ["{$prefix}{$year}%"])
```

#### 3. Update Method Validation (Line ~320)
```php
// Changed from: 'required_if:role,student|nullable|...'
'student_number' => 'nullable|string|max:50|unique:users,student_number,' . $id
```

#### 4. Update Method Auto-Generation (Line ~370)
```php
if ($request->role === 'student') {
    // Auto-generate if not provided
    if (!$request->has('student_number')) {
        $updateData['student_number'] = $this->generateStudentNumber($request->department);
    }
}
```

## What Changed

| Method | Before | After |
|--------|--------|-------|
| `generateStudentNumber()` | `where('student_number', 'LIKE', ...)` | `whereRaw("student_number::text LIKE ?", [...])` |
| `generateStudentId()` | `where('student_id', 'LIKE', ...)` | `whereRaw("student_id::text LIKE ?", [...])` |
| `generateFacultyId()` | `where('faculty_id', 'like', ...)` | `whereRaw("faculty_id::text LIKE ?", [...])` |
| Validation | `required_if:role,student` | `nullable` |
| Empty string handling | Not handled | Removed before validation |

## Testing

### ✅ Local (MySQL/MariaDB - XAMPP)
- Create student with auto-generated number
- Create student with custom number
- Update user to student role

### ✅ Production (PostgreSQL - Render/Neon)
- Create student with auto-generated number
- Create student with custom number
- Update user to student role

## Auto-Generated Formats

| Type | Format | Example |
|------|--------|---------|
| Student Number | `YYYY-DEPT00001` | `2026-IT00001` |
| Student ID | `STUYYYY-DEPT0001` | `STU2026-IT0001` |
| Faculty ID | `FACyy0001` | `FAC260001` |

## Files Modified
- `server/app/Http/Controllers/UserManagementController.php`

## Deployment
1. Deploy updated `UserManagementController.php` to production
2. No database migrations needed
3. No frontend changes needed
4. Works with both MySQL (local) and PostgreSQL (production)

## Key Learning
PostgreSQL requires explicit `::text` casting for `LIKE` operations on non-text columns. Using `whereRaw()` with bound parameters (`?`) ensures proper quoting and database compatibility.

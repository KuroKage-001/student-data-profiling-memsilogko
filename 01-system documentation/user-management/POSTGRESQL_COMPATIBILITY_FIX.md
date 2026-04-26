# PostgreSQL Compatibility Fix - Quick Reference

## Problem
500 Internal Server Error when creating users in production (PostgreSQL on Render):
```
SQLSTATE[25P02]: In failed sql transaction: 7 ERROR: current transaction is aborted
```

## Root Cause
MySQL-style `LIKE` queries don't work properly with PostgreSQL:
```php
// ❌ Doesn't work with PostgreSQL
User::where('student_number', 'LIKE', $prefix . '%')

// ✅ Works with both MySQL and PostgreSQL
User::whereRaw("student_number LIKE ?", [$prefix . '%'])
```

## Fixed Methods in UserManagementController.php

### 1. generateStudentNumber()
```php
// Before (MySQL only)
$lastStudent = User::where('student_number', 'LIKE', $prefix . '%')
    ->orderBy('student_number', 'desc')
    ->first();

// After (MySQL + PostgreSQL)
$lastStudent = User::whereRaw("student_number LIKE ?", [$prefix . '%'])
    ->orderBy('student_number', 'desc')
    ->first();
```

### 2. generateStudentId()
```php
// Before (MySQL only)
$lastStudent = User::where('student_id', 'LIKE', $prefix . '%')
    ->orderBy('student_id', 'desc')
    ->first();

// After (MySQL + PostgreSQL)
$lastStudent = User::whereRaw("student_id LIKE ?", [$prefix . '%'])
    ->orderBy('student_id', 'desc')
    ->first();
```

### 3. generateFacultyId()
```php
// Before (MySQL only)
$lastFaculty = Faculty::where('faculty_id', 'like', "{$prefix}{$year}%")
    ->orderBy('faculty_id', 'desc')
    ->first();

// After (MySQL + PostgreSQL)
$lastFaculty = Faculty::whereRaw("faculty_id LIKE ?", ["{$prefix}{$year}%"])
    ->orderBy('faculty_id', 'desc')
    ->first();
```

## Why Use whereRaw()?

### The Issue
PostgreSQL requires explicit type handling for pattern matching:
- MySQL: Automatically handles type conversion
- PostgreSQL: Needs explicit casting (e.g., `column::text`)

### The Solution
`whereRaw()` with bound parameters (`?`) lets Laravel handle database-specific type casting:
```php
whereRaw("column LIKE ?", ['pattern%'])
```

This generates:
- **MySQL**: `column LIKE 'pattern%'`
- **PostgreSQL**: `column::text LIKE 'pattern%'` (Laravel adds casting automatically)

## Testing Checklist

### Local (MySQL/MariaDB)
- [ ] Create student with auto-generated number
- [ ] Create student with custom number
- [ ] Create faculty user
- [ ] Update user role to student

### Production (PostgreSQL)
- [ ] Create student with auto-generated number
- [ ] Create student with custom number
- [ ] Create faculty user
- [ ] Update user role to student

## Key Takeaway
When using `LIKE` queries in Laravel that need to work with both MySQL and PostgreSQL:
- ✅ Use `whereRaw("column LIKE ?", ['pattern%'])`
- ❌ Avoid `where('column', 'LIKE', 'pattern%')`

## Related Files
- `server/app/Http/Controllers/UserManagementController.php`
- `server/app/Http/Controllers/FacultyController.php` (if it has similar queries)
- Any other controllers using `LIKE` queries with auto-generated IDs

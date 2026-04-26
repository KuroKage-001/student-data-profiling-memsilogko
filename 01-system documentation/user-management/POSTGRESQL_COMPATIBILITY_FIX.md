# PostgreSQL Compatibility Fix - Quick Reference

## Problem
500 Internal Server Error when creating users in production (PostgreSQL on Render):
```
SQLSTATE[25P02]: In failed sql transaction: 7 ERROR: current transaction is aborted
SQL: select * from "users" where student_id LIKE STU2026-IT% order by "student_id" desc limit 1
```

## Root Cause
The `LIKE` operator in PostgreSQL requires explicit type casting for non-text columns. The query was missing:
1. Proper parameter binding (quotes around the pattern)
2. Explicit `::text` casting for PostgreSQL

```sql
-- ❌ What was being generated (missing quotes and casting)
where student_id LIKE STU2026-IT%

-- ✅ What PostgreSQL needs
where student_id::text LIKE 'STU2026-IT%'
```

## Solution
Use `whereRaw()` with explicit `::text` casting and proper parameter binding:

```php
// ✅ Works with both MySQL and PostgreSQL
User::whereRaw("student_id::text LIKE ?", [$prefix . '%'])
```

## Fixed Methods in UserManagementController.php

### 1. generateStudentNumber()
```php
// After (MySQL + PostgreSQL compatible)
$lastStudent = User::whereRaw("student_number::text LIKE ?", [$prefix . '%'])
    ->orderBy('student_number', 'desc')
    ->first();
```

### 2. generateStudentId()
```php
// After (MySQL + PostgreSQL compatible)
$lastStudent = User::whereRaw("student_id::text LIKE ?", [$prefix . '%'])
    ->orderBy('student_id', 'desc')
    ->first();
```

### 3. generateFacultyId()
```php
// After (MySQL + PostgreSQL compatible)
$lastFaculty = Faculty::whereRaw("faculty_id::text LIKE ?", ["{$prefix}{$year}%"])
    ->orderBy('faculty_id', 'desc')
    ->first();
```

## Why `::text` Casting?

PostgreSQL is strict about type comparisons:
- **MySQL**: Implicitly converts types in `LIKE` operations
- **PostgreSQL**: Requires explicit casting when the column isn't already text type

The `::text` syntax is PostgreSQL's type casting operator:
- MySQL ignores it (treats it as part of the column name, but Laravel handles this)
- PostgreSQL uses it to cast the column value to text before comparison

## Why Use `whereRaw()` with `?` Placeholders?

Using bound parameters (`?`) ensures:
1. **Proper quoting**: Laravel adds quotes around the pattern value
2. **SQL injection protection**: Values are properly escaped
3. **Database compatibility**: Laravel handles database-specific syntax

```php
// ✅ Correct - Laravel binds the parameter with quotes
whereRaw("column::text LIKE ?", ['pattern%'])
// Generates: column::text LIKE 'pattern%'

// ❌ Wrong - No parameter binding
whereRaw("column::text LIKE pattern%")
// Generates: column::text LIKE pattern% (missing quotes, syntax error)
```

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
- ✅ Use `whereRaw("column::text LIKE ?", ['pattern%'])`
- ❌ Avoid `where('column', 'LIKE', 'pattern%')` (PostgreSQL type issues)
- ❌ Avoid `whereRaw("column LIKE pattern%")` (missing parameter binding)

The `::text` casting is ignored by MySQL but required by PostgreSQL for proper type handling.

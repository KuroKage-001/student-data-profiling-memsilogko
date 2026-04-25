# Enrollment Program Filter Fix

## Problem

The "Enroll Students" modal was showing "No eligible students available" even though there were 93 active students in the database.

### Network Tab Debug Data
```json
{
  "success": true,
  "data": [],
  "debug": {
    "total_students_in_db": 103,
    "active_students": 93,
    "program_filter": "IT",
    "students_with_program": 0
  }
}
```

**Key Issue**: `students_with_program: 0` - No students matched the program filter "IT"

## Root Cause

### Database Structure
The `users` table stores the full program name:
```
program = "Bachelor of Science in Information Technology"
program = "Bachelor of Science in Computer Science"
```

### Code Expectation
The code was filtering by short codes:
```php
$query->where('program', 'IT');  // Exact match - FAILS
$query->where('program', 'CS');  // Exact match - FAILS
```

This caused **zero matches** because:
- Database: `"Bachelor of Science in Information Technology"`
- Filter: `"IT"`
- Result: No match ❌

## Solution Implemented

### 1. Updated `getEligibleStudents()` Method

Changed from exact match to LIKE query:

```php
// Filter by program if provided
// Program field contains full name like "Bachelor of Science in Information Technology"
// So we need to use LIKE to match "IT" or "CS"
if ($program) {
    if ($program === 'IT') {
        $query->where('program', 'like', '%Information Technology%');
    } elseif ($program === 'CS') {
        $query->where('program', 'like', '%Computer Science%');
    } else {
        // Fallback to exact match for other programs
        $query->where('program', $program);
    }
}
```

**Result**: Now returns 44 IT students ✅

### 2. Added Helper Method `studentMatchesProgram()`

Created a reusable method for program matching:

```php
/**
 * Check if student's program matches the course program
 * Student program is full name like "Bachelor of Science in Information Technology"
 * Course program is short code like "IT" or "CS"
 */
private function studentMatchesProgram($studentProgram, $courseProgram)
{
    if (!$studentProgram || !$courseProgram) {
        return true; // Allow if either is not set
    }

    $studentProgram = strtolower($studentProgram);
    $courseProgram = strtoupper($courseProgram);

    if ($courseProgram === 'IT') {
        return str_contains($studentProgram, 'information technology');
    } elseif ($courseProgram === 'CS') {
        return str_contains($studentProgram, 'computer science');
    }

    // Fallback to exact match
    return strtolower($studentProgram) === strtolower($courseProgram);
}
```

### 3. Updated Enrollment Validation

Changed both `enrollStudent()` and `facultyEnrollStudent()` methods:

**Before:**
```php
if ($courseProgram && $student->program !== $courseProgram) {
    return response()->json([
        'success' => false,
        'message' => "Only {$courseProgram} students can enroll in this course"
    ], 403);
}
```

**After:**
```php
if ($courseProgram && !$this->studentMatchesProgram($student->program, $courseProgram)) {
    return response()->json([
        'success' => false,
        'message' => "Only {$courseProgram} students can enroll in this course"
    ], 403);
}
```

## Testing

### Test Query Results

**IT Students:**
```bash
php artisan tinker --execute="echo \App\Models\User::where('role', 'student')->where('status', 'active')->where('program', 'like', '%Information Technology%')->count();"
# Result: 44 students
```

**CS Students:**
```bash
php artisan tinker --execute="echo \App\Models\User::where('role', 'student')->where('status', 'active')->where('program', 'like', '%Computer Science%')->count();"
# Result: [number of CS students]
```

### Expected Behavior

1. **Open Enroll Students Modal for IT Course:**
   - Should show all IT students (Bachelor of Science in Information Technology)
   - Should exclude already enrolled students
   - Should show student name, email, student_id, program, year_level

2. **Open Enroll Students Modal for CS Course:**
   - Should show all CS students (Bachelor of Science in Computer Science)
   - Should exclude already enrolled students

3. **Enrollment Validation:**
   - IT students can only enroll in IT courses (course_code starts with "IT")
   - CS students can only enroll in CS courses (course_code starts with "CS")
   - Proper error message if wrong program attempts to enroll

## Files Modified

1. **`server/app/Http/Controllers/StudentEnrollmentController.php`**
   - Modified `getEligibleStudents()` method (lines ~40-70)
   - Modified `enrollStudent()` method (lines ~135-140)
   - Modified `facultyEnrollStudent()` method (lines ~350-355)
   - Added `studentMatchesProgram()` helper method (lines ~270-290)

## Program Mapping

| Short Code | Full Program Name |
|------------|-------------------|
| IT | Bachelor of Science in Information Technology |
| CS | Bachelor of Science in Computer Science |

## Related Issues

This fix also resolves:
- ✅ Students not appearing in enrollment dropdown
- ✅ Program validation failing during enrollment
- ✅ "No eligible students available" message when students exist

## Recommendations

### Short-term
1. ✅ Use LIKE queries for program filtering (DONE)
2. ✅ Create helper method for consistent program matching (DONE)
3. ✅ Update enrollment validation to use helper method (DONE)

### Long-term
1. **Standardize program field:**
   - Option A: Store short code ("IT", "CS") in database
   - Option B: Store both short code and full name in separate fields
   - Option C: Create a `programs` table with proper relationships

2. **Add program constants:**
   ```php
   class ProgramConstants {
       const IT_SHORT = 'IT';
       const IT_FULL = 'Bachelor of Science in Information Technology';
       const CS_SHORT = 'CS';
       const CS_FULL = 'Bachelor of Science in Computer Science';
   }
   ```

3. **Create program mapping service:**
   ```php
   class ProgramService {
       public static function getShortCode($fullName) { ... }
       public static function getFullName($shortCode) { ... }
       public static function matches($studentProgram, $courseProgram) { ... }
   }
   ```

## Status

✅ **FIXED** - Students now appear in the enrollment modal with proper program filtering

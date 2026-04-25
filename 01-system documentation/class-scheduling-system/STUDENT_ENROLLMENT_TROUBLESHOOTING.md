# Student Enrollment Troubleshooting Guide

## Issue: No Students Showing in Enrollment Dropdown

### Symptoms
- Console shows: `Eligible students response: {success: true, data: Array(0)}`
- "No eligible students available" message in modal
- Enrollment dropdown is empty

### Root Causes & Solutions

## 1. No Student Accounts in Database

### Check if Students Exist

Run this SQL query in your database:

```sql
-- Check total students
SELECT COUNT(*) as total_students 
FROM users 
WHERE role = 'student';

-- Check students by program
SELECT program, COUNT(*) as count 
FROM users 
WHERE role = 'student' 
GROUP BY program;

-- Check student status
SELECT status, COUNT(*) as count 
FROM users 
WHERE role = 'student' 
GROUP BY status;

-- View all students
SELECT id, name, email, student_id, program, year_level, status 
FROM users 
WHERE role = 'student'
ORDER BY program, name;
```

### Solution: Create Student Accounts

#### Option 1: Using the Admin Panel (User Management)

1. Go to **User Management** page
2. Click **Add User**
3. Fill in the form:
   - **Name**: Student name
   - **Email**: student@example.com
   - **Password**: Set a password
   - **Role**: Select "Student"
   - **Program**: Select "IT" or "CS"
   - **Year Level**: Select year (1-4)
   - **Student ID**: Enter student ID
   - **Status**: Active
4. Click **Create User**

#### Option 2: Using Database Seeder

Create a seeder file or run SQL:

```sql
-- Create IT students
INSERT INTO users (name, email, password, role, program, year_level, student_id, status, created_at, updated_at)
VALUES 
('John Doe', 'john.doe@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'IT', 1, 'IT-2024-001', 'active', NOW(), NOW()),
('Jane Smith', 'jane.smith@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'IT', 2, 'IT-2024-002', 'active', NOW(), NOW()),
('Bob Johnson', 'bob.johnson@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'IT', 3, 'IT-2024-003', 'active', NOW(), NOW());

-- Create CS students
INSERT INTO users (name, email, password, role, program, year_level, student_id, status, created_at, updated_at)
VALUES 
('Alice Brown', 'alice.brown@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'CS', 1, 'CS-2024-001', 'active', NOW(), NOW()),
('Charlie Davis', 'charlie.davis@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'CS', 2, 'CS-2024-002', 'active', NOW(), NOW()),
('Diana Wilson', 'diana.wilson@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'CS', 3, 'CS-2024-003', 'active', NOW(), NOW());
```

**Note**: The password hash above is for "password" (for testing only)

## 2. Students Have Wrong Program

### Check Program Mismatch

```sql
-- Check if students have NULL or incorrect program
SELECT id, name, program, status 
FROM users 
WHERE role = 'student' 
AND (program IS NULL OR program NOT IN ('IT', 'CS'));
```

### Solution: Update Student Programs

```sql
-- Update students to IT program
UPDATE users 
SET program = 'IT' 
WHERE role = 'student' 
AND id IN (1, 2, 3); -- Replace with actual student IDs

-- Update students to CS program
UPDATE users 
SET program = 'CS' 
WHERE role = 'student' 
AND id IN (4, 5, 6); -- Replace with actual student IDs
```

## 3. Students Are Inactive

### Check Inactive Students

```sql
SELECT id, name, email, program, status 
FROM users 
WHERE role = 'student' 
AND status != 'active';
```

### Solution: Activate Students

```sql
UPDATE users 
SET status = 'active' 
WHERE role = 'student' 
AND status != 'active';
```

## 4. Students Already Enrolled

### Check Existing Enrollments

```sql
-- Check enrollments for a specific class section
SELECT 
    se.id,
    u.name as student_name,
    u.student_id,
    u.program,
    se.enrollment_status,
    se.enrollment_date
FROM student_enrollments se
JOIN users u ON se.user_id = u.id
WHERE se.class_section_id = 1 -- Replace with your class section ID
ORDER BY u.name;
```

### Solution: Drop Students if Needed

```sql
-- Drop a student from a class (change status to dropped)
UPDATE student_enrollments 
SET enrollment_status = 'dropped', 
    drop_date = NOW() 
WHERE id = 1; -- Replace with enrollment ID

-- Or delete the enrollment record
DELETE FROM student_enrollments 
WHERE id = 1; -- Replace with enrollment ID
```

## 5. Program Filtering Issue

### Verify Course Code Format

The system extracts the program from the course code. Ensure your course codes follow this format:

- **IT courses**: Must start with "IT " (e.g., "IT 101", "IT 201")
- **CS courses**: Must start with "CS " (e.g., "CS 101", "CS 201")

### Check Course Codes

```sql
SELECT id, course_code, course_name 
FROM class_sections 
WHERE course_code NOT LIKE 'IT %' 
AND course_code NOT LIKE 'CS %';
```

### Solution: Fix Course Codes

```sql
-- Update course codes to proper format
UPDATE class_sections 
SET course_code = CONCAT('IT ', SUBSTRING(course_code, 1, 3))
WHERE id = 1; -- Replace with class section ID
```

## Backend Logging

The backend now logs enrollment queries. Check your Laravel logs:

```bash
# View logs
tail -f storage/logs/laravel.log

# Look for these log entries:
# - "Getting eligible students"
# - "Total students matching criteria"
# - "Eligible students found"
```

### Example Log Output

```
[2026-04-25 10:30:00] local.INFO: Getting eligible students {"class_section_id":"1","program":"IT"}
[2026-04-25 10:30:00] local.INFO: Total students matching criteria {"count":5}
[2026-04-25 10:30:00] local.INFO: Eligible students found {"count":3}
```

## Testing Checklist

After creating/fixing student accounts:

- [ ] Students appear in User Management page
- [ ] Students have correct role ('student')
- [ ] Students have correct program ('IT' or 'CS')
- [ ] Students have 'active' status
- [ ] Students appear in enrollment dropdown for IT courses
- [ ] Students appear in enrollment dropdown for CS courses
- [ ] IT students only appear for IT courses
- [ ] CS students only appear for CS courses
- [ ] Already enrolled students don't appear in dropdown
- [ ] Can successfully enroll a student
- [ ] Enrolled student appears in "Enrolled Students" list
- [ ] Can successfully drop a student

## API Endpoints for Testing

### Get Eligible Students
```
GET /api/eligible-students?program=IT&class_section_id=1
```

### Get Class Enrollments
```
GET /api/class-sections/1/enrollments
```

### Enroll Student
```
POST /api/enrollments
{
  "user_id": 1,
  "class_section_id": 1
}
```

## Quick Fix Script

Run this in your database to create test students:

```sql
-- Delete existing test students (optional)
DELETE FROM users WHERE email LIKE '%@test.student.edu';

-- Create IT test students
INSERT INTO users (name, email, password, role, program, year_level, student_id, status, created_at, updated_at)
VALUES 
('IT Student 1', 'it1@test.student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'IT', 1, 'IT-TEST-001', 'active', NOW(), NOW()),
('IT Student 2', 'it2@test.student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'IT', 2, 'IT-TEST-002', 'active', NOW(), NOW()),
('IT Student 3', 'it3@test.student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'IT', 3, 'IT-TEST-003', 'active', NOW(), NOW());

-- Create CS test students
INSERT INTO users (name, email, password, role, program, year_level, student_id, status, created_at, updated_at)
VALUES 
('CS Student 1', 'cs1@test.student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'CS', 1, 'CS-TEST-001', 'active', NOW(), NOW()),
('CS Student 2', 'cs2@test.student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'CS', 2, 'CS-TEST-002', 'active', NOW(), NOW()),
('CS Student 3', 'cs3@test.student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'CS', 3, 'CS-TEST-003', 'active', NOW(), NOW());

-- Verify
SELECT id, name, email, program, year_level, status 
FROM users 
WHERE role = 'student' 
ORDER BY program, name;
```

## Common Mistakes

1. **Wrong Role**: User has role 'faculty' or 'admin' instead of 'student'
2. **Wrong Program**: Program is NULL, empty, or not 'IT'/'CS'
3. **Inactive Status**: Status is 'inactive' or 'suspended'
4. **Already Enrolled**: Student is already enrolled in the class
5. **Wrong Course Code**: Course code doesn't start with 'IT ' or 'CS '

## Related Documentation

- [Enrollment Feature Implementation](./ENROLLMENT_FEATURE_IMPLEMENTATION.md)
- [Faculty Enrollment Feature](./FACULTY_ENROLLMENT_FEATURE.md)
- [Scheduling Fixes Summary](./SCHEDULING_FIXES_SUMMARY.md)


---

## 6. Drop Student 409 Error ✅ FIXED

### Symptoms
```
DELETE http://localhost:8000/api/enrollments/1 409 (Conflict)
Error: Student is not currently enrolled in this class
```

### Root Cause
The `getClassEnrollments()` method was returning ALL enrollments including those with status 'dropped'. When trying to drop an already-dropped enrollment, the validation in `dropStudent()` failed because the status was not 'enrolled'.

### Solution
Modified `getClassEnrollments()` to only return currently enrolled students:

```php
// server/app/Http/Controllers/StudentEnrollmentController.php
public function getClassEnrollments($classSectionId)
{
    try {
        // Only get currently enrolled students (not dropped)
        $enrollments = StudentEnrollment::where('class_section_id', $classSectionId)
            ->where('enrollment_status', 'enrolled')
            ->with('student')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $enrollments
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch enrollments',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

### Status
✅ **FIXED** - Only currently enrolled students appear in the list, preventing attempts to drop already-dropped students.

---

## 7. Enrollment Count Not Updating ✅ FIXED

### Symptoms
- Students are enrolled/dropped successfully
- Modal shows updated count
- Main table still shows old enrollment count
- Page refresh required to see updated count

### Root Cause
The modal component had no way to notify the parent component (Scheduling page) that enrollment data changed.

### Solution
Implemented callback pattern to refresh parent component data:

**Step 1: Add callback prop to modal**
```javascript
// client/src/components/admin-components/scheduling/ClassSectionModal.jsx
const ClassSectionModal = ({ mode, section, onClose, onSubmit, onEnrollmentChange }) => {
  // ... existing code ...
  
  const handleEnrollStudent = async (student) => {
    // ... enrollment logic ...
    
    if (response.success) {
      toast.success(`${student.name} enrolled successfully`);
      await fetchEnrollments();
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        current_enrollment: prev.current_enrollment + 1
      }));
      
      // Notify parent component to refresh
      if (onEnrollmentChange) {
        onEnrollmentChange();
      }
    }
  };
  
  const handleDropStudent = async (enrollment) => {
    // ... drop logic ...
    
    if (response.success) {
      toast.success('Student dropped successfully');
      await fetchEnrollments();
      
      // Update local state
      setFormData(prev => ({
        ...prev,
        current_enrollment: Math.max(0, prev.current_enrollment - 1)
      }));
      
      // Notify parent component to refresh
      if (onEnrollmentChange) {
        onEnrollmentChange();
      }
    }
  };
};
```

**Step 2: Implement callback in parent**
```javascript
// client/src/pages/admin-pages/Scheduling.jsx
const Scheduling = () => {
  // ... existing code ...
  
  // Callback to refresh data when enrollments change
  const handleEnrollmentChange = async () => {
    await fetchSchedules();
    await fetchStatistics();
  };
  
  return (
    // ... JSX ...
    {showModal && (
      <ClassSectionModal
        mode={modalMode}
        section={selectedSection}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        onEnrollmentChange={handleEnrollmentChange}
      />
    )}
  );
};
```

### Status
✅ **FIXED** - Enrollment counts update immediately in the main table without page refresh.

---

## 8. Enroll Students Modal Not Showing Data ✅ FIXED

### Symptoms
- Click "Enroll" button on a class
- Modal opens but no students appear in dropdown
- Console shows eligible students were fetched but dropdown is empty

### Root Cause
The useEffect that fetches eligible students wasn't properly triggered when the modal opened in 'enroll' mode with an existing section.

### Solution
Added `section?.id` to the useEffect dependency array:

```javascript
// client/src/components/admin-components/scheduling/ClassSectionModal.jsx
// Fetch eligible students when course code changes or when modal opens in enroll mode
useEffect(() => {
  if ((mode === 'edit' || mode === 'create' || mode === 'enroll') && formData.course_code) {
    const program = extractProgramFromCourseCode(formData.course_code);
    if (program) {
      fetchEligibleStudents(program);
    }
  }
}, [formData.course_code, mode, section?.id]);
```

### Status
✅ **FIXED** - Eligible students are properly fetched and displayed in all modal modes.

---

## Complete Fix Summary

All three major enrollment issues have been resolved:

1. ✅ **Drop Student 409 Error** - Filter enrollments to only show 'enrolled' status
2. ✅ **Enrollment Count Not Updating** - Callback pattern refreshes parent component
3. ✅ **Enroll Students Modal Empty** - Fixed useEffect dependencies

### Files Modified
- `server/app/Http/Controllers/StudentEnrollmentController.php`
- `client/src/components/admin-components/scheduling/ClassSectionModal.jsx`
- `client/src/pages/admin-pages/Scheduling.jsx`

### Testing After Fixes
- [ ] Drop student works without 409 error
- [ ] Enrollment count updates immediately in table
- [ ] Enroll Students modal shows eligible students
- [ ] Statistics update after enrollment changes
- [ ] No page refresh needed to see changes

For detailed implementation, see: [ENROLLMENT_FIXES_COMPLETE.md](./ENROLLMENT_FIXES_COMPLETE.md)

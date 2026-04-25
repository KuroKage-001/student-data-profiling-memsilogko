# Program-Based Enrollment System

## Overview

The enrollment system automatically enforces program-based restrictions:
- **IT students** can only enroll in **IT courses**
- **CS students** can only enroll in **CS courses**

This is enforced at multiple levels for security and data integrity.

## How It Works

### 1. Course Code Format

Courses must follow this naming convention:
- **IT Courses**: `IT 101`, `IT 201`, `IT 301`, etc.
- **CS Courses**: `CS 101`, `CS 201`, `CS 301`, etc.

The system extracts the program prefix (IT or CS) from the course code.

### 2. Student Program Field

Students must have their `program` field set to either:
- `IT` - Information Technology
- `CS` - Computer Science

### 3. Automatic Filtering

When viewing eligible students for enrollment, the system:

1. **Extracts program from course code**
   ```php
   // Example: "IT 101" → "IT"
   // Example: "CS 201" → "CS"
   ```

2. **Filters students by program**
   ```sql
   SELECT * FROM users 
   WHERE role = 'student' 
   AND program = 'IT'  -- Matches course program
   AND status = 'active'
   ```

3. **Excludes already enrolled students**
   ```sql
   WHERE NOT EXISTS (
     SELECT 1 FROM student_enrollments 
     WHERE user_id = users.id 
     AND class_section_id = ?
     AND enrollment_status = 'enrolled'
   )
   ```

### 4. Enrollment Validation

When attempting to enroll a student, the backend validates:

```php
// Get course program from course code
$courseProgram = extractProgramFromCourseCode($classSection->course_code);

// Get student program
$student = User::findOrFail($request->user_id);

// Validate match
if ($courseProgram && $student->program !== $courseProgram) {
    return error("Only {$courseProgram} students can enroll in this course");
}
```

## Implementation Details

### Backend Controller

**File**: `server/app/Http/Controllers/StudentEnrollmentController.php`

#### Get Eligible Students
```php
public function getEligibleStudents(Request $request)
{
    $program = $request->query('program'); // IT or CS
    
    $query = User::where('role', 'student')
        ->where('status', 'active');
    
    // Filter by program
    if ($program) {
        $query->where('program', $program);
    }
    
    // Exclude already enrolled
    if ($classSectionId) {
        $query->whereDoesntHave('enrollments', function($q) use ($classSectionId) {
            $q->where('class_section_id', $classSectionId)
              ->where('enrollment_status', 'enrolled');
        });
    }
    
    return $query->get();
}
```

#### Enroll Student with Validation
```php
public function enrollStudent(Request $request)
{
    $classSection = ClassSection::findOrFail($request->class_section_id);
    $student = User::findOrFail($request->user_id);
    
    // Extract program from course code
    $courseProgram = $this->extractProgramFromCourseCode($classSection->course_code);
    
    // Validate program match
    if ($courseProgram && $student->program !== $courseProgram) {
        return response()->json([
            'success' => false,
            'message' => "Only {$courseProgram} students can enroll in this course"
        ], 403);
    }
    
    // Proceed with enrollment...
}
```

#### Extract Program Helper
```php
private function extractProgramFromCourseCode($courseCode)
{
    if (preg_match('/^(IT|CS)\s/i', $courseCode, $matches)) {
        return strtoupper($matches[1]);
    }
    return null;
}
```

### Frontend Component

**File**: `client/src/components/admin-components/scheduling/ClassSectionModal.jsx`

```javascript
// Extract program from course code
const extractProgramFromCourseCode = (courseCode) => {
  const match = courseCode.match(/^(IT|CS)\s/i);
  return match ? match[1].toUpperCase() : null;
};

// Fetch eligible students when course code changes
useEffect(() => {
  if (formData.course_code) {
    const program = extractProgramFromCourseCode(formData.course_code);
    if (program) {
      fetchEligibleStudents(program);
    }
  }
}, [formData.course_code]);
```

## Examples

### Example 1: IT Course Enrollment

**Course**: IT 101 - Introduction to Programming

**Eligible Students**:
- ✅ John Doe (IT, Year 1)
- ✅ Jane Smith (IT, Year 2)
- ❌ Bob Johnson (CS, Year 1) - Wrong program
- ❌ Alice Brown (IT, Year 1) - Already enrolled

### Example 2: CS Course Enrollment

**Course**: CS 201 - Data Structures

**Eligible Students**:
- ✅ Bob Johnson (CS, Year 2)
- ✅ Charlie Davis (CS, Year 3)
- ❌ John Doe (IT, Year 1) - Wrong program
- ❌ Diana Wilson (CS, Year 2) - Already enrolled

## Error Messages

### Frontend Errors
- "No eligible students available" - No students match the criteria
- "Please save the class section first before enrolling students" - Section not saved yet

### Backend Errors
- "Only IT students can enroll in this course" - CS student trying to enroll in IT course
- "Only CS students can enroll in this course" - IT student trying to enroll in CS course
- "Student is already enrolled in this class" - Duplicate enrollment attempt
- "Class is at full capacity" - No more seats available

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    role ENUM('admin', 'dept_chair', 'faculty', 'student'),
    program ENUM('IT', 'CS'), -- Student program
    year_level INT,
    student_id VARCHAR(50),
    status ENUM('active', 'inactive', 'suspended'),
    -- other fields...
);
```

### Class Sections Table
```sql
CREATE TABLE class_sections (
    id BIGINT PRIMARY KEY,
    course_code VARCHAR(20), -- Must start with 'IT ' or 'CS '
    course_name VARCHAR(255),
    -- other fields...
);
```

### Student Enrollments Table
```sql
CREATE TABLE student_enrollments (
    id BIGINT PRIMARY KEY,
    user_id BIGINT, -- Foreign key to users
    class_section_id BIGINT, -- Foreign key to class_sections
    enrollment_status ENUM('enrolled', 'dropped', 'completed'),
    enrollment_date DATE,
    drop_date DATE,
    -- other fields...
);
```

## Testing Scenarios

### Test 1: IT Student Enrolling in IT Course
```
Given: IT student "John Doe"
And: IT course "IT 101"
When: Admin enrolls John in IT 101
Then: Enrollment succeeds
```

### Test 2: CS Student Enrolling in IT Course (Should Fail)
```
Given: CS student "Bob Johnson"
And: IT course "IT 101"
When: Admin tries to enroll Bob in IT 101
Then: Error: "Only IT students can enroll in this course"
```

### Test 3: IT Student Enrolling in CS Course (Should Fail)
```
Given: IT student "John Doe"
And: CS course "CS 201"
When: Admin tries to enroll John in CS 201
Then: Error: "Only CS students can enroll in this course"
```

### Test 4: Eligible Students List
```
Given: IT course "IT 101"
When: Admin opens enrollment modal
Then: Only IT students appear in dropdown
And: CS students do not appear
```

## Faculty Restrictions

Faculty members can only enroll students in their assigned classes:

```php
public function facultyEnrollStudent(Request $request)
{
    $user = auth()->user();
    $classSection = ClassSection::findOrFail($request->class_section_id);
    
    // Check if faculty is assigned to this class
    $isAssigned = $classSection->facultyAssignments()
        ->where('faculty_id', $user->facultyProfile->id)
        ->where('status', 'active')
        ->exists();

    if (!$isAssigned) {
        return error('You can only enroll students in your assigned classes');
    }
    
    // Same program validation applies...
}
```

## Benefits

1. **Data Integrity**: Prevents incorrect enrollments
2. **Automatic Filtering**: Users only see relevant students
3. **Clear Error Messages**: Users understand why enrollment failed
4. **Program Separation**: IT and CS programs remain separate
5. **Scalable**: Easy to add more programs (e.g., IS, SE)

## Future Enhancements

1. **Cross-Program Electives**: Allow students to take courses from other programs
2. **Prerequisites**: Check if student has completed required courses
3. **Year Level Restrictions**: Limit courses to specific year levels
4. **Capacity Management**: Waitlist for full classes
5. **Batch Enrollment**: Enroll multiple students at once

## Related Documentation

- [Student Enrollment Troubleshooting](./STUDENT_ENROLLMENT_TROUBLESHOOTING.md)
- [Enrollment Feature Implementation](./ENROLLMENT_FEATURE_IMPLEMENTATION.md)
- [Faculty Enrollment Feature](./FACULTY_ENROLLMENT_FEATURE.md)

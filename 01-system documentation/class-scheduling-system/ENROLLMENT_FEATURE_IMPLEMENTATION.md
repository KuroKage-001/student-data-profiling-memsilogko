# Student Enrollment Feature Implementation

## Overview
This document describes the implementation of the student enrollment feature for class sections, including program-based filtering and faculty schedule restrictions.

## Features Implemented

### 1. Student Enrollment Management
- **Enroll Students**: Admins and department chairs can enroll students in class sections
- **Drop Students**: Remove students from class sections
- **View Enrollments**: See all enrolled students for each class section
- **Capacity Management**: Automatic tracking of current enrollment vs max capacity

### 2. Program-Based Student Filtering
- **IT Courses**: Only IT students can be enrolled in IT courses (e.g., "IT 101")
- **CS Courses**: Only CS students can be enrolled in CS courses (e.g., "CS 201")
- **Automatic Detection**: Program is extracted from course code automatically
- **Eligible Students**: Only shows students from the matching program who aren't already enrolled

### 3. Faculty Schedule Restrictions
- **Faculty View**: Faculty members can only see their own assigned schedules
- **Admin/Dept Chair View**: Admins and department chairs can see all schedules
- **Statistics Filtering**: Statistics are also filtered based on user role

## Backend Implementation

### New Controller
**File**: `server/app/Http/Controllers/StudentEnrollmentController.php`

#### Endpoints:
1. **GET** `/class-sections/{classSectionId}/enrollments`
   - Get all enrollments for a class section
   - Returns list of enrolled students with their details

2. **GET** `/eligible-students`
   - Get eligible students for enrollment
   - Query params: `class_section_id`, `program` (IT/CS)
   - Filters by program and excludes already enrolled students

3. **POST** `/enrollments`
   - Enroll a student in a class section
   - Body: `{ user_id, class_section_id }`
   - Validates:
     - Student not already enrolled
     - Class not at full capacity
     - Student program matches course program

4. **DELETE** `/enrollments/{enrollmentId}`
   - Drop a student from a class section
   - Updates enrollment status to 'dropped'
   - Decrements class enrollment count

### Updated Routes
**File**: `server/routes/api.php`

```php
// Student Enrollment Routes (Admin and Dept Chair only)
Route::middleware('role:admin,dept_chair')->group(function () {
    Route::get('class-sections/{classSectionId}/enrollments', [StudentEnrollmentController::class, 'getClassEnrollments']);
    Route::get('eligible-students', [StudentEnrollmentController::class, 'getEligibleStudents']);
    Route::post('enrollments', [StudentEnrollmentController::class, 'enrollStudent']);
    Route::delete('enrollments/{enrollmentId}', [StudentEnrollmentController::class, 'dropStudent']);
});
```

### Faculty Schedule Filtering
**File**: `server/app/Http/Controllers/ClassSectionController.php`

The `index()` and `statistics()` methods already include filtering logic:

```php
// If user is faculty (not admin or dept_chair), only show their assigned classes
if ($user && in_array($user->role, ['faculty']) && $user->facultyProfile) {
    $facultyId = $user->facultyProfile->id;
    $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
        $q->where('faculty_id', $facultyId)
          ->where('status', 'active');
    });
}
```

## Frontend Implementation

### New Service
**File**: `client/src/services/enrollmentService.js`

Provides methods for:
- `getClassEnrollments(classSectionId)` - Fetch enrollments
- `getEligibleStudents(classSectionId, program)` - Get filtered students
- `enrollStudent(data)` - Enroll a student
- `dropStudent(enrollmentId)` - Drop a student

### Updated Modal Component
**File**: `client/src/components/admin-components/scheduling/ClassSectionModal.jsx`

#### New Features:
1. **Enrollment Section** (Edit/View modes only)
   - Shows enrolled students count vs capacity
   - Displays program filter indicator
   - Lists all enrolled students with their details

2. **Add Student Dropdown** (Edit mode only)
   - Search students by name, ID, or email
   - Filters students by program automatically
   - Shows student details: ID, program, year level
   - Real-time search filtering

3. **Enrolled Students List**
   - Shows student name, ID, and program
   - Drop button for each student (edit mode)
   - Scrollable list for many students
   - Empty state message

#### Program Detection:
```javascript
const extractProgramFromCourseCode = (courseCode) => {
  const match = courseCode.match(/^(IT|CS)\s/i);
  return match ? match[1].toUpperCase() : null;
};
```

### Updated Scheduling Page
**File**: `client/src/pages/admin-pages/Scheduling.jsx`

- Already has role-based access control
- `canManageSchedules` checks for admin or dept_chair role
- Faculty users see read-only view

## User Interface

### Enrollment Section in Modal

```
┌─────────────────────────────────────────────────────────┐
│ Enrolled Students (3/40)              IT students only  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Add Student                                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 🔍 Search students by name, ID, or email...        │  │
│ └────────────────────────────────────────────────────┘  │
│ Only IT students who are not already enrolled will appear│
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ John Doe                                      🗑️   │  │
│ │ 2026-IT00001 • IT                                  │  │
│ └────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Jane Smith                                    🗑️   │  │
│ │ 2026-IT00002 • IT                                  │  │
│ └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Access Control

### Role Permissions

| Feature | Admin | Dept Chair | Faculty | Student |
|---------|-------|------------|---------|---------|
| View All Schedules | ✅ | ✅ | ❌ | ❌ |
| View Own Schedules | ✅ | ✅ | ✅ | ✅ |
| Create Schedule | ✅ | ✅ | ❌ | ❌ |
| Edit Schedule | ✅ | ✅ | ❌ | ❌ |
| Delete Schedule | ✅ | ✅ | ❌ | ❌ |
| Enroll Students | ✅ | ✅ | ❌ | ❌ |
| Drop Students | ✅ | ✅ | ❌ | ❌ |
| View Enrollments | ✅ | ✅ | ✅ | ❌ |

## Validation Rules

### Enrollment Validation
1. **Student must be active** - Only active students can be enrolled
2. **No duplicate enrollment** - Student cannot be enrolled twice in same class
3. **Capacity check** - Class must have available seats
4. **Program match** - Student program must match course program (IT/CS)
5. **Class section must exist** - Cannot enroll in non-existent class

### Program Matching
- Course code starting with "IT " → Only IT students
- Course code starting with "CS " → Only CS students
- Other course codes → All students eligible

## Error Handling

### Backend Errors
- **409 Conflict**: Student already enrolled or class at capacity
- **403 Forbidden**: Student program doesn't match course program
- **422 Validation**: Invalid data provided
- **500 Server Error**: Database or system error

### Frontend Handling
- Toast notifications for success/error messages
- Detailed error messages for conflicts
- Loading states during operations
- Confirmation dialogs for destructive actions

## Database Schema

### student_enrollments Table
```sql
- id (primary key)
- user_id (foreign key to users)
- class_section_id (foreign key to class_sections)
- enrollment_status (enum: enrolled, dropped, completed)
- enrollment_date (date)
- drop_date (date, nullable)
- grade (decimal, nullable)
- notes (text, nullable)
- created_at
- updated_at
```

### Relationships
- `StudentEnrollment` belongs to `User` (student)
- `StudentEnrollment` belongs to `ClassSection`
- `User` has many `StudentEnrollment` (enrollments)
- `ClassSection` has many `StudentEnrollment` (enrollments)

## Testing Checklist

### Enrollment Feature
- [ ] Admin can enroll IT student in IT course
- [ ] Admin can enroll CS student in CS course
- [ ] Admin cannot enroll IT student in CS course
- [ ] Admin cannot enroll CS student in IT course
- [ ] Cannot enroll student twice in same class
- [ ] Cannot enroll when class is at capacity
- [ ] Can drop enrolled student
- [ ] Enrollment count updates correctly
- [ ] Search filters students correctly

### Faculty Restrictions
- [ ] Faculty can only see their assigned schedules
- [ ] Faculty cannot see other faculty schedules
- [ ] Faculty statistics only show their classes
- [ ] Faculty cannot create/edit/delete schedules
- [ ] Faculty cannot enroll/drop students

### Admin/Dept Chair Access
- [ ] Can see all schedules
- [ ] Can create/edit/delete schedules
- [ ] Can enroll/drop students
- [ ] Can view all enrollments
- [ ] Statistics show all classes

## Future Enhancements

1. **Bulk Enrollment**
   - Upload CSV file to enroll multiple students
   - Enroll entire class/year level

2. **Waitlist Feature**
   - Add students to waitlist when class is full
   - Automatic enrollment when seat becomes available

3. **Enrollment History**
   - Track all enrollment changes
   - Audit log for compliance

4. **Email Notifications**
   - Notify students when enrolled
   - Notify when dropped from class
   - Reminder emails before class starts

5. **Prerequisites Check**
   - Validate student has completed prerequisite courses
   - Block enrollment if prerequisites not met

6. **Grade Management**
   - Faculty can enter grades for enrolled students
   - Grade submission workflow
   - Grade reports and transcripts

## Troubleshooting

### Issue: Students not appearing in dropdown
**Solution**: 
- Check course code format (must start with "IT " or "CS ")
- Verify students have correct program in their profile
- Ensure students are not already enrolled

### Issue: Faculty seeing all schedules
**Solution**:
- Verify faculty user has `facultyProfile` relationship
- Check faculty is assigned to classes via `faculty_assignments` table
- Ensure role is exactly 'faculty' (not 'admin' or 'dept_chair')

### Issue: Enrollment count not updating
**Solution**:
- Check `current_enrollment` field in `class_sections` table
- Verify increment/decrement operations in controller
- Refresh the page to see updated count

## Conclusion

The enrollment feature provides comprehensive student management for class sections with proper access control and program-based filtering. Faculty members are restricted to viewing only their assigned schedules, while admins and department chairs have full management capabilities.

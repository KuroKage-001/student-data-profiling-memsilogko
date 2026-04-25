# Faculty Enrollment Feature

## Overview
Faculty members can now enroll and drop students in their assigned class sections directly from the Scheduling page.

## Feature Details

### What Faculty Can Do
- ✅ View their assigned schedules
- ✅ Enroll students in their assigned classes
- ✅ Drop students from their assigned classes
- ✅ View enrolled students list
- ✅ Search and filter eligible students by program
- ❌ Cannot enroll/drop in classes not assigned to them
- ❌ Cannot create/edit/delete schedules

### Access Control
Faculty can only enroll/drop students in classes where they are assigned as the instructor. The system automatically verifies:
1. Faculty has an active assignment to the class
2. Student program matches the course program (IT/CS)
3. Class has available capacity
4. Student is not already enrolled

## User Interface

### Enroll Button in Table
A new **Enroll** button (green user-plus icon) appears in the Actions column for faculty users:

**Desktop View:**
```
Actions: 👁️ View | ➕ Enroll
```

**Mobile View:**
```
👁️ View | ➕ Enroll
```

### Enrollment Modal
Clicking the **Enroll** button opens a modal showing:
- Class section details (read-only)
- Enrolled students list with count
- Add student search box
- Program filter indicator (IT/CS students only)
- Drop button for each enrolled student

## How to Use

### Enrolling a Student
1. Navigate to **Scheduling** page
2. Find your assigned class
3. Click the **Enroll** button (green ➕ icon)
4. In the modal, type student name/ID in search box
5. Click on student from dropdown to enroll
6. Student is added immediately

### Dropping a Student
1. Click **Enroll** button on your class
2. Find student in enrolled list
3. Click trash icon (🗑️) next to student
4. Confirm the action
5. Student is removed immediately

## Backend Implementation

### New Endpoints

#### Faculty Enroll Student
```
POST /faculty-enrollments
Authorization: Bearer {token}
Role: faculty

Body:
{
  "user_id": 1,
  "class_section_id": 5
}

Response:
{
  "success": true,
  "message": "Student enrolled successfully",
  "data": {
    "id": 10,
    "user_id": 1,
    "class_section_id": 5,
    "enrollment_status": "enrolled",
    "enrollment_date": "2026-04-25",
    "student": {
      "id": 1,
      "name": "John Doe",
      "student_id": "2026-IT00001",
      "program": "IT"
    }
  }
}
```

#### Faculty Drop Student
```
DELETE /faculty-enrollments/{enrollmentId}
Authorization: Bearer {token}
Role: faculty

Response:
{
  "success": true,
  "message": "Student dropped successfully"
}
```

### Validation Logic

The backend verifies:
1. **Faculty Assignment**: Faculty must be assigned to the class
   ```php
   $isAssigned = $classSection->facultyAssignments()
       ->where('faculty_id', $user->facultyProfile->id)
       ->where('status', 'active')
       ->exists();
   ```

2. **Program Match**: Student program must match course
   ```php
   $courseProgram = extractProgramFromCourseCode($classSection->course_code);
   if ($courseProgram && $student->program !== $courseProgram) {
       return error("Only {$courseProgram} students can enroll");
   }
   ```

3. **Capacity Check**: Class must have available seats
   ```php
   if ($classSection->current_enrollment >= $classSection->max_capacity) {
       return error("Class is at full capacity");
   }
   ```

4. **Duplicate Check**: Student not already enrolled
   ```php
   $existingEnrollment = StudentEnrollment::where('user_id', $userId)
       ->where('class_section_id', $classSectionId)
       ->where('enrollment_status', 'enrolled')
       ->first();
   ```

## Frontend Implementation

### Service Methods

**enrollmentService.js**
```javascript
// Faculty enroll a student (only in their assigned classes)
facultyEnrollStudent: async (data) => {
  const response = await api.post('/faculty-enrollments', data);
  return response.data;
},

// Faculty drop a student (only from their assigned classes)
facultyDropStudent: async (enrollmentId) => {
  const response = await api.delete(`/faculty-enrollments/${enrollmentId}`);
  return response.data;
},
```

### Modal Modes

The ClassSectionModal now supports 4 modes:
1. **create** - Create new class section (Admin/Dept Chair only)
2. **edit** - Edit existing class section (Admin/Dept Chair only)
3. **view** - View class details (All roles)
4. **enroll** - Enroll students (Admin/Dept Chair/Faculty)

### Role-Based Rendering

```javascript
const isFaculty = user && user.role === 'faculty';
const canEnrollStudents = user && ['admin', 'dept_chair', 'faculty'].includes(user.role);

// Use appropriate endpoint based on role
const enrollFunction = isFaculty 
  ? enrollmentService.facultyEnrollStudent 
  : enrollmentService.enrollStudent;
```

## Error Messages

### Faculty-Specific Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "You can only enroll students in your assigned classes" | Faculty trying to enroll in unassigned class | Only use Enroll button on your assigned classes |
| "You can only drop students from your assigned classes" | Faculty trying to drop from unassigned class | Only drop students from your classes |
| "Faculty profile not found" | User account missing faculty profile | Contact administrator |
| "Only IT/CS students can enroll" | Student program doesn't match course | Select students from correct program |
| "Class is at full capacity" | No available seats | Ask admin to increase capacity |
| "Student is already enrolled" | Duplicate enrollment attempt | Check enrolled students list |

## Security Features

### Authorization Checks
1. **Route Middleware**: Only faculty role can access faculty endpoints
2. **Controller Verification**: Checks faculty profile exists
3. **Assignment Validation**: Verifies faculty is assigned to class
4. **Active Status**: Only active assignments are valid

### Data Protection
- Faculty can only see their assigned classes
- Cannot access other faculty's enrollment data
- All operations logged for audit trail
- Transaction-based operations for data integrity

## Testing Checklist

### Faculty Enrollment
- [ ] Faculty can enroll IT student in their IT course
- [ ] Faculty can enroll CS student in their CS course
- [ ] Faculty cannot enroll in unassigned class
- [ ] Faculty cannot enroll wrong program student
- [ ] Faculty can drop enrolled student
- [ ] Faculty cannot drop from unassigned class
- [ ] Enrollment count updates correctly
- [ ] Search filters students by program

### UI/UX
- [ ] Enroll button appears for faculty
- [ ] Enroll button works on desktop
- [ ] Enroll button works on mobile
- [ ] Modal shows correct title "Enroll Students"
- [ ] Form fields hidden in enroll mode
- [ ] Enrollment section visible
- [ ] Toast notifications work
- [ ] Loading states display correctly

### Error Handling
- [ ] Assignment validation error shows
- [ ] Program mismatch error shows
- [ ] Capacity error shows
- [ ] Duplicate enrollment error shows
- [ ] Network errors handled gracefully

## Comparison: Admin vs Faculty

| Feature | Admin/Dept Chair | Faculty |
|---------|------------------|---------|
| View All Schedules | ✅ | ❌ |
| View Own Schedules | ✅ | ✅ |
| Create Schedule | ✅ | ❌ |
| Edit Schedule | ✅ | ❌ |
| Delete Schedule | ✅ | ❌ |
| Enroll Any Class | ✅ | ❌ |
| Enroll Own Class | ✅ | ✅ |
| Drop Any Class | ✅ | ❌ |
| Drop Own Class | ✅ | ✅ |
| Endpoint Used | `/enrollments` | `/faculty-enrollments` |

## Benefits

### For Faculty
- ✅ Direct control over class roster
- ✅ Quick enrollment without admin help
- ✅ Real-time student management
- ✅ Better class preparation

### For Administrators
- ✅ Reduced workload
- ✅ Faster enrollment process
- ✅ Maintained security and control
- ✅ Audit trail of all changes

### For Students
- ✅ Faster enrollment processing
- ✅ More flexible scheduling
- ✅ Better communication with faculty

## Future Enhancements

1. **Bulk Enrollment**
   - Faculty upload CSV of student IDs
   - Enroll entire section at once

2. **Enrollment Requests**
   - Students request enrollment
   - Faculty approve/deny requests

3. **Waitlist Management**
   - Faculty manage waitlist
   - Auto-enroll from waitlist

4. **Email Notifications**
   - Notify students when enrolled
   - Notify faculty of enrollment changes

5. **Enrollment Analytics**
   - Track enrollment trends
   - Identify popular courses
   - Optimize class sizes

## Troubleshooting

### Issue: Enroll button not showing
**Solution**: 
- Verify user role is 'faculty'
- Check faculty profile exists
- Ensure viewing assigned classes only

### Issue: Cannot enroll students
**Solution**:
- Verify you're assigned to the class
- Check class has available capacity
- Ensure student program matches course

### Issue: Wrong students appearing
**Solution**:
- Check course code format (IT/CS prefix)
- Verify student program in their profile
- Refresh eligible students list

## Conclusion

The faculty enrollment feature empowers instructors to manage their class rosters directly while maintaining proper security and validation. Faculty can only enroll students in their assigned classes, with automatic program matching and capacity checks.

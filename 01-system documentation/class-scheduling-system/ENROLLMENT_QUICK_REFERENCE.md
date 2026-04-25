# Student Enrollment - Quick Reference

## Quick Start

### Enrolling a Student
1. Navigate to **Scheduling** page
2. Click **Edit** on a class section
3. Scroll to **Enrolled Students** section
4. Type student name/ID in search box
5. Click on student to enroll
6. Student is added immediately

### Dropping a Student
1. Open class section in **Edit** mode
2. Find student in **Enrolled Students** list
3. Click **trash icon** (🗑️) next to student
4. Confirm the action
5. Student is removed immediately

## Program Filtering

### How It Works
- Course code determines eligible students
- **"IT 101"** → Only IT students shown
- **"CS 201"** → Only CS students shown
- Automatic detection from course code

### Checking Program Match
```
Course Code: IT 101
✅ IT students can enroll
❌ CS students cannot enroll

Course Code: CS 201
❌ IT students cannot enroll
✅ CS students can enroll
```

## Faculty Schedule Access

### What Faculty Can See
- ✅ Their own assigned schedules
- ✅ Their class enrollments
- ✅ Their teaching statistics
- ❌ Other faculty schedules
- ❌ Unassigned classes

### What Faculty Cannot Do
- ❌ Create new schedules
- ❌ Edit schedules
- ❌ Delete schedules
- ❌ Enroll/drop students
- ❌ View other faculty schedules

## Admin/Dept Chair Access

### Full Permissions
- ✅ View all schedules
- ✅ Create/edit/delete schedules
- ✅ Enroll/drop students
- ✅ View all enrollments
- ✅ Manage all classes

## Common Tasks

### Check Class Capacity
```
Enrolled Students (25/40)
         ↑        ↑
    Current    Max
```

### Search for Students
- Type name: "John Doe"
- Type ID: "2026-IT00001"
- Type email: "john@example.com"
- Results filter in real-time

### View Enrolled Students
1. Click **View** or **Edit** on class section
2. Scroll to **Enrolled Students** section
3. See list of all enrolled students
4. Shows: Name, Student ID, Program

## Error Messages

### "Student is already enrolled"
- Student is already in this class
- Check enrolled students list

### "Class is at full capacity"
- No more seats available
- Increase max capacity or drop a student

### "Only IT/CS students can enroll"
- Student program doesn't match course
- Verify course code and student program

### "Please save the class section first"
- Cannot enroll in unsaved class
- Click "Create Section" first, then enroll

## API Endpoints

### Get Enrollments
```
GET /class-sections/{id}/enrollments
```

### Get Eligible Students
```
GET /eligible-students?class_section_id={id}&program=IT
```

### Enroll Student
```
POST /enrollments
Body: { user_id: 1, class_section_id: 5 }
```

### Drop Student
```
DELETE /enrollments/{enrollmentId}
```

## Tips & Tricks

### Tip 1: Bulk Viewing
- Use **View** mode to see enrollments without edit access
- Faster for checking who's enrolled

### Tip 2: Program Indicator
- Look for "IT students only" or "CS students only" label
- Appears next to enrollment count

### Tip 3: Real-time Search
- Start typing to filter students immediately
- No need to press Enter

### Tip 4: Capacity Planning
- Check enrollment percentage in main table
- Red = 90%+ full, Yellow = 75%+, Green = <75%

## Keyboard Shortcuts

- **Esc** - Close modal
- **Tab** - Navigate between fields
- **Enter** - Submit form (when focused on button)

## Mobile Usage

### On Small Screens
- Enrollment section scrolls independently
- Student list is touch-friendly
- Search box expands to full width

## Troubleshooting

### Students not showing?
1. Check course code format (IT/CS prefix)
2. Verify student program matches
3. Ensure students are active status

### Can't enroll students?
1. Verify you're admin or dept_chair
2. Check class section is saved
3. Ensure capacity not exceeded

### Faculty seeing wrong schedules?
1. Check faculty profile exists
2. Verify faculty assignments
3. Confirm role is 'faculty'

## Best Practices

1. **Save First** - Create class section before enrolling
2. **Check Program** - Verify course code has IT/CS prefix
3. **Monitor Capacity** - Don't exceed max capacity
4. **Use Search** - Filter students for faster enrollment
5. **Confirm Drops** - Double-check before dropping students

## Quick Reference Table

| Action | Admin | Dept Chair | Faculty |
|--------|-------|------------|---------|
| View Own Schedules | ✅ | ✅ | ✅ |
| View All Schedules | ✅ | ✅ | ❌ |
| Create Schedule | ✅ | ✅ | ❌ |
| Edit Schedule | ✅ | ✅ | ❌ |
| Delete Schedule | ✅ | ✅ | ❌ |
| Enroll Students | ✅ | ✅ | ❌ |
| Drop Students | ✅ | ✅ | ❌ |
| View Enrollments | ✅ | ✅ | ✅ |

## Support

For issues or questions:
1. Check this quick reference
2. Review full documentation
3. Contact system administrator

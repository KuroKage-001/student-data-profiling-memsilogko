# Class Assignment System - Quick Reference

## Setup Instructions

### 1. Run Database Migrations
```bash
cd server
php artisan migrate
```

### 2. Seed Sample Data (Optional)
```bash
php artisan db:seed --class=ClassSectionSeeder
```

### 3. Start Servers
```bash
# Terminal 1 - Backend
cd server
php artisan serve

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## Quick API Reference

### Class Sections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/class-sections` | List all class sections |
| POST | `/api/class-sections` | Create new class section |
| GET | `/api/class-sections/{id}` | Get single class section |
| PUT | `/api/class-sections/{id}` | Update class section |
| DELETE | `/api/class-sections/{id}` | Delete class section |
| GET | `/api/class-sections-statistics` | Get statistics |

### Faculty Assignments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/faculty-assignments` | Assign faculty to class |
| DELETE | `/api/faculty-assignments/{id}` | Unassign faculty |
| GET | `/api/faculty/{id}/classes` | Get faculty's classes |
| GET | `/api/class-sections/{id}/faculty` | Get class's faculty |

---

## Common Tasks

### Create a Class Section
```javascript
const data = {
  section_code: "A",
  course_code: "CS 101",
  course_name: "Introduction to Programming",
  room: "CS-301",
  day_of_week: "Monday",
  start_time: "08:00",
  end_time: "10:00",
  semester: "Fall 2024",
  academic_year: "2024-2025",
  max_capacity: 40,
  faculty_id: 1 // Optional
};

const response = await classSectionService.createSection(data);
```

### Assign Faculty to Class
```javascript
const assignment = {
  faculty_id: 1,
  class_section_id: 5,
  assignment_type: "primary" // or "co-instructor", "assistant"
};

const response = await classSectionService.assignFaculty(assignment);
```

### Get Faculty's Classes
```javascript
const response = await classSectionService.getFacultyClasses(facultyId);
```

---

## UI Navigation

### Access Scheduling Page:
1. Login as Admin/Department Chair/Faculty
2. Click "Scheduling" in sidebar
3. View all class sections

### Create New Class:
1. Click "Add Schedule" button
2. Fill in form fields
3. Select faculty (optional)
4. Click "Create Section"

### Edit Class:
1. Click "Edit" icon on any class
2. Modify fields
3. Click "Update Section"

### Delete Class:
1. Click "Delete" icon on any class
2. Confirm deletion
3. Class is removed

---

## Validation Rules

### Required Fields:
- Section Code
- Course Code
- Course Name
- Day of Week
- Start Time
- End Time
- Semester
- Academic Year
- Max Capacity

### Optional Fields:
- Room
- Faculty Assignment

### Constraints:
- End time must be after start time
- Max capacity must be ≥ 1
- No room conflicts (same room, day, overlapping time)
- No faculty conflicts (same faculty, day, overlapping time)

---

## Conflict Detection

### Room Conflict:
- Same room
- Same day
- Overlapping time
- Same semester/academic year
- **Result:** Creation/Update rejected

### Faculty Conflict:
- Same faculty
- Same day
- Overlapping time
- Same semester/academic year
- **Result:** Assignment rejected

---

## Statistics Dashboard

### Metrics Displayed:
1. **Total Classes** - Count of all class sections
2. **Total Students** - Sum of current enrollments
3. **Rooms Used** - Count of unique rooms
4. **Avg. Capacity** - Average enrollment percentage

### Filters:
- Semester
- Academic Year
- Status (active, cancelled, completed)

---

## Search & Filter

### Search By:
- Course Code
- Course Name
- Instructor Name

### Filter By:
- Day of Week
- Semester
- Academic Year
- Status

---

## Weekly Schedule Grid

### Features:
- Visual weekly schedule
- Time slots: 8-10 AM, 10-12 PM, 1-3 PM, 3-5 PM
- Days: Monday - Friday
- Color-coded class blocks
- Click to view details
- Mobile-responsive

---

## Troubleshooting

### Issue: "Schedule conflict detected"
**Solution:** Check for existing classes in the same room/time or faculty schedule conflicts

### Issue: "Cannot delete class section with enrolled students"
**Solution:** Remove student enrollments first or set status to 'cancelled'

### Issue: Faculty not showing in dropdown
**Solution:** Ensure faculty records exist in the database

### Issue: Statistics not loading
**Solution:** Check API authentication and semester filters

---

## Database Schema Quick View

### class_sections
```
id, section_code, course_code, course_name, room,
day_of_week, start_time, end_time, semester, academic_year,
max_capacity, current_enrollment, status, timestamps
```

### faculty_class_assignments
```
id, faculty_id, class_section_id, assignment_type,
assigned_date, status, timestamps
```

---

## Role Permissions

| Role | View | Create | Edit | Delete |
|------|------|--------|------|--------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Dept Chair | ✅ | ✅ | ✅ | ✅ |
| Faculty | ✅ | ❌ | ❌ | ❌ |

---

## Sample Data

### Sample Class Section:
```json
{
  "id": 1,
  "section_code": "A",
  "course_code": "CS 101",
  "course_name": "Introduction to Programming",
  "room": "CS-301",
  "day_of_week": "Monday",
  "start_time": "08:00",
  "end_time": "10:00",
  "semester": "Fall 2024",
  "academic_year": "2024-2025",
  "max_capacity": 40,
  "current_enrollment": 35,
  "status": "active",
  "instructor": "Dr. John Smith"
}
```

---

## Support

For issues or questions:
1. Check this quick reference
2. Review full implementation documentation
3. Check browser console for errors
4. Verify API responses in Network tab
5. Check Laravel logs: `server/storage/logs/laravel.log`

---

**Last Updated:** 2026-04-19  
**Version:** 1.0.0

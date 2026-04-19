# Student Schedule - Quick Reference

## API Endpoints

### Get Student's Enrolled Schedules
```
GET /api/student/schedules
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "enrollment_id": 5,
      "section_code": "CS101-A",
      "course_code": "CS101",
      "course_name": "Introduction to Programming",
      "room": "Room 301",
      "day_of_week": "Monday",
      "start_time": "08:00 AM",
      "end_time": "10:00 AM",
      "semester": "Spring 2026",
      "academic_year": "2025-2026",
      "instructor": "Dr. John Smith",
      "max_capacity": 35,
      "current_enrollment": 32,
      "enrollment_percentage": 91.43,
      "enrollment_date": "Mar 15, 2026",
      "status": "active"
    }
  ]
}
```

### Get Available Classes
```
GET /api/student/available-classes?search=CS&day=Monday
Authorization: Bearer {token}

Query Parameters:
- search: Search by course code, name, or section
- day: Filter by day of week
- semester: Filter by semester (default: Spring 2026)
- academic_year: Filter by academic year (default: 2025-2026)

Response:
{
  "success": true,
  "data": [...]
}
```

### Get Schedule Statistics
```
GET /api/student/schedule-statistics
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "total_enrolled": 5,
    "total_units": 0,
    "completed_courses": 12,
    "current_semester": "Spring 2026"
  }
}
```

### Enroll in Class
```
POST /api/student/enroll
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "class_section_id": 1
}

Response:
{
  "success": true,
  "message": "Successfully enrolled in class",
  "data": {
    "id": 1,
    "user_id": 5,
    "class_section_id": 1,
    "enrollment_status": "enrolled",
    "enrollment_date": "2026-04-19"
  }
}
```

### Drop Class
```
DELETE /api/student/enrollments/{enrollmentId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Successfully dropped class"
}
```

## Database Schema

### student_enrollments Table
```sql
CREATE TABLE student_enrollments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  class_section_id BIGINT NOT NULL,
  enrollment_status ENUM('enrolled', 'dropped', 'completed') DEFAULT 'enrolled',
  enrollment_date DATE NOT NULL,
  drop_date DATE NULL,
  grade DECIMAL(4,2) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_section_id) REFERENCES class_sections(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, class_section_id)
);
```

## Frontend Service Usage

### Import Service
```javascript
import studentScheduleService from '../../services/studentScheduleService';
```

### Get Schedules
```javascript
const schedules = await studentScheduleService.getMySchedules();
```

### Get Available Classes
```javascript
const classes = await studentScheduleService.getAvailableClasses({
  search: 'CS',
  day: 'Monday'
});
```

### Enroll in Class
```javascript
const response = await studentScheduleService.enroll(classSectionId);
if (response.success) {
  toast.success('Enrolled successfully');
}
```

### Drop Class
```javascript
const response = await studentScheduleService.drop(enrollmentId);
if (response.success) {
  toast.success('Class dropped');
}
```

## Model Relationships

### User Model
```php
// Get all enrollments
$user->enrollments

// Get active enrollments only
$user->activeEnrollments

// Get enrolled classes
$user->activeEnrollments()->with('classSection')->get()
```

### ClassSection Model
```php
// Get all enrollments
$classSection->enrollments

// Get enrolled students
$classSection->enrolledStudents

// Check if full
$classSection->isFull()

// Get enrollment percentage
$classSection->enrollment_percentage
```

### StudentEnrollment Model
```php
// Get student
$enrollment->student

// Get class section
$enrollment->classSection

// Scopes
StudentEnrollment::enrolled()->get()
StudentEnrollment::dropped()->get()
StudentEnrollment::completed()->get()
```

## Seeder Usage

### Run Seeder
```bash
php artisan db:seed --class=StudentEnrollmentSeeder
```

### Seeder Features
- Enrolls each student in 4-6 random classes
- Checks for time conflicts
- Respects class capacity
- Updates enrollment counts
- Displays statistics

## UI Components

### Statistics Cards
- **Enrolled Classes**: Total number of enrolled classes
- **Completed Courses**: Number of completed courses
- **Current Semester**: Current semester name

### Schedule Table (Desktop)
- Course code and name
- Instructor name
- Schedule (day and time)
- Room number
- Enrollment count with percentage
- Drop button

### Schedule Cards (Mobile)
- Compact card layout
- All essential information
- Touch-friendly buttons

### Weekly Grid
- Time slots (rows): 08:00-10:00, 10:00-12:00, 01:00-03:00, 03:00-05:00
- Days (columns): Monday through Saturday
- Shows course code and room
- Click to view details

## Color Coding

### Enrollment Capacity
- **Green** (< 75%): Plenty of space
- **Yellow** (75-89%): Filling up
- **Red** (≥ 90%): Nearly full

## Navigation

### Student Menu
```
Dashboard
My Schedule  ← New menu item
```

### Route
```
/student/my-schedule
```

## Common Tasks

### Check Enrollment Count
```php
$classSection = ClassSection::find(1);
echo $classSection->current_enrollment . '/' . $classSection->max_capacity;
```

### Get Student's Schedule
```php
$user = Auth::user();
$schedules = $user->activeEnrollments()
    ->with('classSection')
    ->get();
```

### Enroll Student
```php
StudentEnrollment::create([
    'user_id' => $userId,
    'class_section_id' => $classSectionId,
    'enrollment_status' => 'enrolled',
    'enrollment_date' => now(),
]);

// Update count
$classSection->increment('current_enrollment');
```

### Drop Student
```php
$enrollment->update([
    'enrollment_status' => 'dropped',
    'drop_date' => now(),
]);

// Update count
$classSection->decrement('current_enrollment');
```

## Error Handling

### Common Errors
- **Already Enrolled**: Student is already enrolled in the class
- **Class Full**: Class has reached maximum capacity
- **Time Conflict**: Student has another class at the same time
- **Not Found**: Class section or enrollment not found

### Error Responses
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing

### Test Student Login
1. Login with student credentials
2. Navigate to "My Schedule"
3. Verify enrolled classes display
4. Test search and filter
5. Test drop functionality

### Test Enrollment
1. Check class capacity
2. Enroll student
3. Verify count increments
4. Verify student sees class
5. Drop class
6. Verify count decrements

## Performance Tips

- Use eager loading: `with(['classSection', 'student'])`
- Index foreign keys for faster queries
- Cache statistics if needed
- Paginate large result sets

## Security

- All routes require authentication
- Students can only view/modify their own enrollments
- Enrollment validation prevents conflicts
- Transaction support ensures data integrity

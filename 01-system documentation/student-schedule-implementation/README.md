# Student Schedule System

## Overview
A comprehensive student schedule viewing system that displays real-time enrollment data based on actual student accounts in the database. Students can view their enrolled classes, see weekly schedules, and manage their enrollments.

## Key Features

### ✅ Real Enrollment Data
- Enrollment counts based on actual student accounts (not hardcoded)
- Example: "32/35 (91% full)" shows real students enrolled
- Automatically updates when students enroll or drop classes

### ✅ Student Schedule View
- View all enrolled classes in a clean table format
- Weekly schedule grid visualization
- Search and filter capabilities
- Drop class functionality with confirmation
- Real-time enrollment statistics

### ✅ Enrollment Management
- Students can enroll in available classes
- System prevents time conflicts
- System checks class capacity
- Automatic enrollment count updates

### ✅ Responsive Design
- Desktop: Full table with weekly grid
- Mobile: Card-based layout with day-by-day view
- Touch-friendly interface
- Modern, clean UI matching UserManagement.jsx style

## Quick Start

### 1. Run Migration
```bash
cd server
php artisan migrate
```

### 2. Seed Enrollment Data
```bash
php artisan db:seed --class=StudentEnrollmentSeeder
```

### 3. Access Student Schedule
1. Login as a student
2. Click "My Schedule" in the sidebar
3. View your enrolled classes

## Current Statistics

Based on the seeder run:
- **96 active students** in the database
- **46 class sections** available
- **262 total enrollments** created
- **Average 5.7 students** per class
- **Range: 1-12 students** per class

## Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - Complete technical implementation details
2. **QUICK_REFERENCE.md** - API endpoints, code examples, and common tasks
3. **README.md** - This file, overview and quick start guide

## File Structure

### Backend
```
server/
├── app/
│   ├── Models/
│   │   ├── StudentEnrollment.php (NEW)
│   │   ├── ClassSection.php (UPDATED)
│   │   └── User.php (UPDATED)
│   └── Http/Controllers/
│       └── StudentScheduleController.php (NEW)
├── database/
│   ├── migrations/
│   │   └── 2026_04_19_000002_create_student_enrollments_table.php (NEW)
│   └── seeders/
│       └── StudentEnrollmentSeeder.php (NEW)
└── routes/
    └── api.php (UPDATED)
```

### Frontend
```
client/
├── src/
│   ├── pages/
│   │   └── student-pages/
│   │       └── MySchedule.jsx (NEW)
│   ├── services/
│   │   └── studentScheduleService.js (NEW)
│   ├── components/
│   │   └── system-components/
│   │       └── AdminSidebar.jsx (UPDATED)
│   └── config/
│       └── routeConfig.js (UPDATED)
```

## API Endpoints

All endpoints require authentication (`Bearer token`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/schedules` | Get enrolled schedules |
| GET | `/api/student/available-classes` | Get available classes |
| GET | `/api/student/schedule-statistics` | Get statistics |
| POST | `/api/student/enroll` | Enroll in a class |
| DELETE | `/api/student/enrollments/{id}` | Drop a class |

## Features in Detail

### 1. My Schedule Page
- **Location**: `/student/my-schedule`
- **Access**: Student role only
- **Features**:
  - View all enrolled classes
  - Search by course code, name, or instructor
  - Filter by day of week
  - Drop classes with confirmation
  - View enrollment statistics

### 2. Weekly Schedule Grid
- **Desktop View**: Full grid with time slots and days
- **Mobile View**: Day-by-day accordion layout
- **Time Slots**: 08:00-10:00, 10:00-12:00, 01:00-03:00, 03:00-05:00
- **Days**: Monday through Saturday
- **Display**: Course code and room number

### 3. Enrollment Display
- **Format**: "32/35 (91% full)"
- **Color Coding**:
  - 🟢 Green: < 75% full
  - 🟡 Yellow: 75-89% full
  - 🔴 Red: ≥ 90% full

### 4. Statistics Cards
- **Enrolled Classes**: Total number of enrolled classes
- **Completed Courses**: Number of completed courses
- **Current Semester**: Current semester name

## How It Works

### Enrollment Flow
1. Student logs in
2. Views "My Schedule" page
3. Sees enrolled classes with real enrollment data
4. Can search/filter classes
5. Can drop classes (with confirmation)
6. Enrollment counts update automatically

### Data Flow
```
Student Login
    ↓
API Request (/api/student/schedules)
    ↓
StudentScheduleController
    ↓
Query student_enrollments table
    ↓
Join with class_sections table
    ↓
Return formatted data
    ↓
Display in MySchedule.jsx
```

### Enrollment Count Update
```
Student Enrolls
    ↓
Create StudentEnrollment record
    ↓
Increment class_sections.current_enrollment
    ↓
Update reflected in all views
```

## Database Schema

### student_enrollments
- `id`: Primary key
- `user_id`: Foreign key to users table
- `class_section_id`: Foreign key to class_sections table
- `enrollment_status`: enrolled, dropped, completed
- `enrollment_date`: Date of enrollment
- `drop_date`: Date dropped (nullable)
- `grade`: Final grade (nullable)
- `notes`: Additional notes (nullable)

### Relationships
- `StudentEnrollment` belongs to `User`
- `StudentEnrollment` belongs to `ClassSection`
- `User` has many `StudentEnrollment`
- `ClassSection` has many `StudentEnrollment`

## Testing

### Manual Testing
1. ✅ Login as student
2. ✅ Navigate to "My Schedule"
3. ✅ Verify enrolled classes display
4. ✅ Test search functionality
5. ✅ Test filter by day
6. ✅ Test drop class
7. ✅ Verify enrollment counts
8. ✅ Check weekly grid
9. ✅ Test mobile responsiveness

### API Testing
```bash
# Get schedules
curl -X GET http://localhost:8000/api/student/schedules \
  -H "Authorization: Bearer YOUR_TOKEN"

# Enroll in class
curl -X POST http://localhost:8000/api/student/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"class_section_id": 1}'

# Drop class
curl -X DELETE http://localhost:8000/api/student/enrollments/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### No Enrollments Showing
1. Check if seeder ran: `php artisan db:seed --class=StudentEnrollmentSeeder`
2. Verify student has enrollments in database
3. Check API response in browser console

### Enrollment Count Not Updating
1. Verify transaction completed successfully
2. Check database for current_enrollment value
3. Refresh the page

### Cannot Drop Class
1. Verify enrollment_id is correct
2. Check if student owns the enrollment
3. Verify API endpoint is correct

## Future Enhancements

### Planned Features
- [ ] Enrollment period management
- [ ] Waitlist system for full classes
- [ ] Prerequisites checking
- [ ] Grade management
- [ ] Email notifications
- [ ] Print/export schedule
- [ ] Calendar integration (iCal)

### Suggested Improvements
- Add units/credits tracking
- Implement course prerequisites
- Add class ratings/reviews
- Show instructor office hours
- Add class materials/syllabus links

## Support

### Documentation
- **Implementation Details**: See IMPLEMENTATION_SUMMARY.md
- **API Reference**: See QUICK_REFERENCE.md
- **This Guide**: README.md

### Code References
- **Backend Controller**: `server/app/Http/Controllers/StudentScheduleController.php`
- **Frontend Service**: `client/src/services/studentScheduleService.js`
- **Frontend Page**: `client/src/pages/student-pages/MySchedule.jsx`
- **Database Model**: `server/app/Models/StudentEnrollment.php`

## Credits

**Implemented**: April 19, 2026  
**System**: CCS Student Profiling System  
**Version**: 1.0.0

---

**Note**: This system uses real enrollment data from the database. All enrollment counts are calculated dynamically based on actual student enrollments, not hardcoded values.

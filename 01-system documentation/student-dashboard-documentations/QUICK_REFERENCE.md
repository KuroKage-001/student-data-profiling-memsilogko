# Student Dashboard - Quick Reference

## Quick Start

### Access Dashboard
```
URL: /student/dashboard
Role: student
Auth: Required
```

### Key Components
```javascript
// Main Dashboard
import { StudentDashboard } from './pages/student-pages';

// Components
import { 
  StudentDashboardStats,
  StudentProfileCard,
  AcademicProgress,
  UpcomingEvents
} from './components/student-components/student-dashboard-compo';

// Hooks
import { useStudentDashboard } from './hooks/student-dashboard-hook';

// Service
import { studentDashboardService } from './services/student-dashboard-service';
```

## API Quick Reference

### Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/student/dashboard-stats` | GET | Get dashboard statistics |
| `/api/student/profile` | GET | Get student profile |
| `/api/student/academic-records` | GET | Get academic records |
| `/api/student/upcoming-events` | GET | Get upcoming events |

### Example API Call
```javascript
// Using the service
const result = await studentDashboardService.getStudentDashboardStats();

// Using the hook
const { data, isLoading, isError } = useStudentDashboard();
```

## Component Usage

### StudentDashboard
```jsx
import { StudentDashboard } from './pages/student-pages';

// Used in routing
<Route path="/student/dashboard" element={<StudentDashboard />} />
```

### StudentDashboardStats
```jsx
import { StudentDashboardStats } from './components/student-components/student-dashboard-compo';

<StudentDashboardStats />
// Displays: GPA, Units Completed, Achievements, Upcoming Events
```

### StudentProfileCard
```jsx
import { StudentProfileCard } from './components/student-components/student-dashboard-compo';

<StudentProfileCard />
// Displays: Name, Email, Student ID, Program
```

### AcademicProgress
```jsx
import { AcademicProgress } from './components/student-components/student-dashboard-compo';

<AcademicProgress />
// Displays: Progress bar, Units completed/total, Current semester
```

### UpcomingEvents
```jsx
import { UpcomingEvents } from './components/student-components/student-dashboard-compo';

<UpcomingEvents />
// Displays: List of upcoming events (max 5)
```

## Utility Functions

### Formatters
```javascript
import { 
  formatNumber,
  formatGPA,
  formatDate,
  calculateCompletionPercentage
} from './utils/student-utilities/student-dashboard-utils';

// Usage
formatNumber(1234);                    // "1,234"
formatGPA(3.456);                      // "3.46"
formatDate("2026-05-15");              // "May 15, 2026"
calculateCompletionPercentage(80, 100); // 80
```

## Routing

### Route Configuration
```javascript
{
  id: 'student-dashboard',
  path: '/student/dashboard',
  component: StudentDashboard,
  isPublic: false,
  title: 'Student Dashboard',
  roles: ['student'],
  requiresAuth: true,
}
```

### Navigation
```javascript
// Programmatic navigation
navigate('/student/dashboard');

// Sidebar menu (auto-filtered by role)
{ 
  id: 'student-dashboard', 
  label: 'Dashboard', 
  route: '/student/dashboard',
  roles: ['student']
}
```

## Authentication

### Login Redirect
```javascript
// After successful login
if (userRole === 'student') {
  navigate('/student/dashboard', { replace: true });
}
```

### Protected Access
```javascript
// Only students can access
roles: ['student']
requiresAuth: true
```

## Data Structure

### Dashboard Stats Response
```json
{
  "gpa": 3.45,
  "units_completed": 120,
  "achievements": 5,
  "upcoming_events": 3
}
```

### Profile Response
```json
{
  "student_id": "2021-00001",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "program": "BSCS",
  "year_level": 3,
  "section": "A"
}
```

### Academic Records Response
```json
{
  "total_units": 150,
  "completed_units": 120,
  "current_semester": "SY 2025-2026 - Semester 1",
  "records": [...]
}
```

### Events Response
```json
{
  "events": [
    {
      "id": 1,
      "title": "Career Fair",
      "date": "2026-05-15",
      "location": "Main Auditorium"
    }
  ]
}
```

## Styling Classes

### Common Patterns
```css
/* Card */
.bg-white .rounded-2xl .p-6 .shadow-lg .border .border-gray-100

/* Stat Card */
.bg-white .rounded-2xl .p-5 .sm:p-6 .shadow-lg .hover:shadow-xl

/* Icon Container */
.w-12 .h-12 .bg-orange-100 .rounded-xl .flex .items-center .justify-center

/* Progress Bar */
.bg-linear-to-r .from-orange-500 .to-orange-600 .h-3 .rounded-full

/* Hover Effect */
.hover:-translate-y-1 .transition-all .duration-300
```

## Common Tasks

### Add New Stat
1. Update `StudentDashboardStats.jsx`
2. Add stat to `stats` array
3. Update API endpoint if needed

### Modify Profile Display
1. Edit `StudentProfileCard.jsx`
2. Update profile data structure
3. Adjust layout as needed

### Change Progress Calculation
1. Update `calculateCompletionPercentage` in formatters
2. Modify `AcademicProgress.jsx` display logic

### Add New Event Field
1. Update `UpcomingEvents.jsx` component
2. Modify API response structure
3. Update event card layout

## Debugging

### Check Authentication
```javascript
const { user, isAuthenticated } = useAuth();
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
```

### Check API Response
```javascript
const { data, isLoading, isError, error } = useStudentDashboard();
console.log('Data:', data);
console.log('Loading:', isLoading);
console.log('Error:', error);
```

### Check Route Access
```javascript
// In routeConfig.js
console.log('Route roles:', route.roles);
console.log('User role:', user?.role);
```

## Performance Tips

### Optimize Queries
```javascript
// Adjust stale time
staleTime: 5 * 60 * 1000, // 5 minutes

// Disable refetch if not needed
refetchOnWindowFocus: false,
```

### Lazy Load Components
```javascript
const StudentDashboard = lazy(() => import('./pages/student-pages/StudentDashboard'));
```

### Minimize Re-renders
```javascript
// Use memo for expensive components
const MemoizedComponent = memo(StudentDashboardStats);
```

## File Locations

### Frontend
```
client/src/
├── pages/student-pages/StudentDashboard.jsx
├── components/student-components/student-dashboard-compo/
├── hooks/student-dashboard-hook/
├── services/student-dashboard-service/
├── utils/student-utilities/student-dashboard-utils/
└── layouts/skeleton-loading/StudentDashboardSkeleton.jsx
```

### Backend
```
server/
├── app/Http/Controllers/StudentDashboardController.php
└── routes/api.php
```

### Documentation
```
01-system documentation/student-dashboard-documentations/
├── STUDENT_DASHBOARD_IMPLEMENTATION.md
└── QUICK_REFERENCE.md
```

## Support

### Common Issues
- **Dashboard not loading**: Check authentication and API
- **Stats not showing**: Verify student record exists
- **Navigation broken**: Check route configuration

### Getting Help
1. Check browser console for errors
2. Review API responses in Network tab
3. Verify user role and permissions
4. Check documentation for examples

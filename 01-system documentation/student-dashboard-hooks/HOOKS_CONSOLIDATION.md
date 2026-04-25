# Student Dashboard Hooks Consolidation

## Overview
Consolidated all student dashboard hooks from the `student-dashboard-hook` directory into a single file for better maintainability and simpler imports.

## Changes Made

### 1. Created Consolidated Hook File
**Location:** `client/src/hooks/useStudentDashboard.js`

This single file now contains all student dashboard hooks:
- `useStudentDashboard()` - Fetch dashboard statistics
- `useStudentProfile()` - Fetch student profile information
- `useStudentAcademicRecords()` - Fetch academic records
- `useStudentUpcomingEvents()` - Fetch upcoming events
- `studentDashboardKeys` - Query key factory for cache management

### 2. Removed Old Directory Structure
**Deleted:**
- `client/src/hooks/student-dashboard-hook/index.js`
- `client/src/hooks/student-dashboard-hook/useStudentDashboard.js`
- `client/src/hooks/student-dashboard-hook/` (directory)

### 3. Updated Imports

#### Files Updated:
1. **`client/src/pages/student-pages/StudentDashboard.jsx`**
   ```javascript
   // Before
   import { useStudentDashboard } from '../../hooks/student-dashboard-hook';
   
   // After
   import { useStudentDashboard } from '../../hooks/useStudentDashboard';
   ```

2. **`client/src/components/student-components/student-dashboard-compo/UpcomingEvents.jsx`**
   ```javascript
   // Before
   import { useStudentUpcomingEvents } from '../../../hooks/student-dashboard-hook';
   
   // After
   import { useStudentUpcomingEvents } from '../../../hooks/useStudentDashboard';
   ```

3. **`client/src/components/student-components/student-dashboard-compo/StudentDashboardStats.jsx`**
   ```javascript
   // Before
   import { useStudentDashboard } from '../../../hooks/student-dashboard-hook';
   
   // After
   import { useStudentDashboard } from '../../../hooks/useStudentDashboard';
   ```

4. **`client/src/components/student-components/student-dashboard-compo/AcademicProgress.jsx`**
   ```javascript
   // Before
   import { useStudentAcademicRecords } from '../../../hooks/student-dashboard-hook';
   
   // After
   import { useStudentAcademicRecords } from '../../../hooks/useStudentDashboard';
   ```

## Benefits

### 1. Simplified Structure
- Single file instead of multiple files in a directory
- Easier to locate and maintain
- Consistent with other hooks in the project

### 2. Cleaner Imports
```javascript
// Before (longer path)
import { useStudentDashboard } from '../../hooks/student-dashboard-hook';

// After (cleaner)
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
```

### 3. Better Organization
- All student dashboard-related hooks in one place
- Consistent with other consolidated hooks (useUserManagement, useAdminDashboard, etc.)
- Easier to understand the full API at a glance

### 4. Maintained Functionality
- All React Query hooks preserved
- Query key factory added for better cache management
- Stale time and refetch behavior intact
- JSDoc comments added for better IDE support

## Hook API Reference

### Query Hooks

#### `useStudentDashboard()`
Fetches student dashboard statistics including:
- Enrolled courses count
- Completed courses count
- Current GPA
- Upcoming events count

**Parameters:** None

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: stats, isLoading, error } = useStudentDashboard();

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;

console.log(stats.enrolledCourses);
console.log(stats.currentGPA);
```

#### `useStudentProfile()`
Fetches the logged-in student's profile data including:
- Personal information
- Contact details
- Program and year level
- Student ID and status

**Parameters:** None

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: profile, isLoading } = useStudentProfile();

console.log(profile.name);
console.log(profile.program);
console.log(profile.yearLevel);
```

#### `useStudentAcademicRecords()`
Fetches the student's academic history including:
- Grades by semester
- Course history
- GPA per semester
- Overall GPA

**Parameters:** None

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: records, isLoading } = useStudentAcademicRecords();

console.log(records.semesters);
console.log(records.overallGPA);
```

#### `useStudentUpcomingEvents()`
Fetches upcoming events for the student:
- Campus events
- Department events
- Program-specific events
- Deadlines and important dates

**Parameters:** None

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: events, isLoading } = useStudentUpcomingEvents();

events.forEach(event => {
  console.log(event.title);
  console.log(event.date);
  console.log(event.location);
});
```

### Query Keys

The `studentDashboardKeys` object provides a factory for generating consistent query keys:

```javascript
studentDashboardKeys.all                // ['studentDashboard']
studentDashboardKeys.stats()            // ['studentDashboard', 'stats']
studentDashboardKeys.profile()          // ['studentDashboard', 'profile']
studentDashboardKeys.academicRecords()  // ['studentDashboard', 'academicRecords']
studentDashboardKeys.upcomingEvents()   // ['studentDashboard', 'upcomingEvents']
```

## Data Structures

### Dashboard Statistics
```javascript
{
  enrolledCourses: number,
  completedCourses: number,
  currentGPA: number,
  upcomingEventsCount: number,
  totalCredits: number,
  completedCredits: number
}
```

### Student Profile
```javascript
{
  id: number,
  studentNumber: string,
  name: string,
  email: string,
  phone: string,
  address: string,
  program: string,
  yearLevel: string,
  department: string,
  status: string,
  enrollmentDate: string
}
```

### Academic Records
```javascript
{
  semesters: [
    {
      semester: string,
      year: string,
      courses: [
        {
          code: string,
          name: string,
          credits: number,
          grade: string,
          gpa: number
        }
      ],
      semesterGPA: number
    }
  ],
  overallGPA: number,
  totalCredits: number,
  completedCredits: number
}
```

### Upcoming Events
```javascript
[
  {
    id: number,
    title: string,
    description: string,
    date: string,
    time: string,
    location: string,
    type: string, // 'campus', 'department', 'program'
    isEnrolled: boolean
  }
]
```

## Configuration

### Stale Time Configuration
- **Dashboard Stats:** 5 minutes - Updates frequently
- **Student Profile:** 10 minutes - Changes less frequently
- **Academic Records:** 10 minutes - Relatively static
- **Upcoming Events:** 5 minutes - Can change frequently

### Refetch Behavior
- **Dashboard Stats:** Refetch on window focus enabled
- **Other Hooks:** Default React Query behavior

## Testing Checklist

- [x] Student dashboard loads correctly
- [x] Dashboard stats display properly
- [x] Student profile card shows correct data
- [x] Academic records display correctly
- [x] Upcoming events list works
- [x] Loading skeleton shows during data fetch
- [x] Error handling works correctly
- [x] Stats update after stale time
- [x] Dashboard refetches when returning to tab
- [x] No console errors
- [x] All imports resolved correctly

## Usage in Components

### StudentDashboard.jsx
```javascript
import { useStudentDashboard } from '../../hooks/useStudentDashboard';

const StudentDashboard = () => {
  const { isLoading } = useStudentDashboard();
  
  if (isLoading) {
    return <StudentDashboardSkeleton />;
  }
  
  return (
    <AdminLayout>
      <StudentProfileCard />
      <UpcomingEvents />
    </AdminLayout>
  );
};
```

### StudentProfileCard.jsx
```javascript
import { useStudentProfile } from '../../../hooks/useStudentDashboard';

const StudentProfileCard = () => {
  const { data: profile, isLoading, error } = useStudentProfile();
  
  if (isLoading) return <ProfileSkeleton />;
  if (error) return <ErrorMessage />;
  
  return (
    <div className="profile-card">
      <h2>{profile.name}</h2>
      <p>{profile.program} - {profile.yearLevel}</p>
      <p>Student ID: {profile.studentNumber}</p>
    </div>
  );
};
```

### UpcomingEvents.jsx
```javascript
import { useStudentUpcomingEvents } from '../../../hooks/useStudentDashboard';

const UpcomingEvents = () => {
  const { data: events, isLoading } = useStudentUpcomingEvents();
  
  if (isLoading) return <EventsSkeleton />;
  
  return (
    <div className="events-list">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
```

### AcademicProgress.jsx
```javascript
import { useStudentAcademicRecords } from '../../../hooks/useStudentDashboard';

const AcademicProgress = () => {
  const { data: records, isLoading } = useStudentAcademicRecords();
  
  if (isLoading) return <RecordsSkeleton />;
  
  return (
    <div className="academic-progress">
      <h3>Overall GPA: {records.overallGPA}</h3>
      {records.semesters.map(semester => (
        <SemesterCard key={semester.semester} semester={semester} />
      ))}
    </div>
  );
};
```

## Cache Management

### Manual Cache Invalidation
```javascript
import { useQueryClient } from '@tanstack/react-query';
import { studentDashboardKeys } from '../../hooks/useStudentDashboard';

const MyComponent = () => {
  const queryClient = useQueryClient();
  
  const refreshDashboard = () => {
    queryClient.invalidateQueries({ 
      queryKey: studentDashboardKeys.stats() 
    });
  };
  
  const refreshAll = () => {
    queryClient.invalidateQueries({ 
      queryKey: studentDashboardKeys.all 
    });
  };
  
  return (
    <>
      <button onClick={refreshDashboard}>Refresh Stats</button>
      <button onClick={refreshAll}>Refresh All</button>
    </>
  );
};
```

### Automatic Cache Invalidation
The student dashboard data is automatically invalidated when:
- Stale time expires (5-10 minutes depending on hook)
- User switches back to the dashboard tab (for stats)
- Manual invalidation is triggered

## Performance Considerations

### 1. Caching Strategy
- **Stale Time:** 5-10 minutes reduces unnecessary API calls
- **Refetch on Focus:** Ensures fresh data for dashboard stats
- **Background Refetch:** React Query handles this automatically

### 2. Loading States
- Skeleton loading provides better UX during data fetch
- Prevents layout shift with proper skeleton dimensions
- Component-level loading states for granular control

### 3. Error Handling
- Graceful error display
- Retry mechanism built into React Query
- Error boundaries can be added for additional safety

## Future Enhancements

### Potential Improvements
1. Add real-time updates using WebSockets for events
2. Add notification system for upcoming deadlines
3. Add grade prediction based on current performance
4. Add course recommendation system
5. Add study progress tracking
6. Add peer comparison (anonymized)
7. Add achievement badges and milestones
8. Add export functionality for academic records
9. Add calendar integration for events
10. Add mobile app support

## Related Documentation

- [User Management Hooks](../user-management-hooks/)
- [Admin Dashboard Hooks](../admin-dashboard-hooks/)
- [Student Profile Hooks](../student-profile-hooks/)
- [Dual Portal Authentication](../dual-portal-authentication/)

## Migration Notes

If you need to add new student dashboard hooks in the future:
1. Add them to `client/src/hooks/useStudentDashboard.js`
2. Export them from the same file
3. Update `studentDashboardKeys` if needed for cache management
4. Add JSDoc comments for IDE support
5. Import directly from `useStudentDashboard`

## Related Files

- **Hook File:** `client/src/hooks/useStudentDashboard.js`
- **Service:** `client/src/services/student-dashboard-service/index.js`
- **Main Component:** `client/src/pages/student-pages/StudentDashboard.jsx`
- **Related Components:**
  - `client/src/components/student-components/student-dashboard-compo/StudentProfileCard.jsx`
  - `client/src/components/student-components/student-dashboard-compo/UpcomingEvents.jsx`
  - `client/src/components/student-components/student-dashboard-compo/StudentDashboardStats.jsx`
  - `client/src/components/student-components/student-dashboard-compo/AcademicProgress.jsx`
- **Skeleton:** `client/src/layouts/skeleton-loading/StudentDashboardSkeleton.jsx`

## Date
April 26, 2026

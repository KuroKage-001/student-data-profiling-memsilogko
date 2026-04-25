# Student Dashboard Hooks Documentation

## Overview
This directory contains documentation for the consolidated student dashboard hooks system. All student dashboard hooks have been consolidated into a single file for better maintainability and simpler imports.

## Documentation Files

### 1. [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md)
Complete documentation of the consolidation process, including:
- Changes made
- Benefits of consolidation
- Full API reference
- Data structures
- Cache management
- Testing checklist
- Future enhancements

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
Quick reference guide with:
- Import examples
- Usage examples for all hooks
- Data structures
- Cache management
- Loading states
- Error handling patterns
- Complete component examples
- Performance tips

## Hook Location
**File:** `client/src/hooks/useStudentDashboard.js`

## Available Hooks

### Query Hooks (Data Fetching)
- `useStudentDashboard()` - Fetch dashboard statistics
- `useStudentProfile()` - Fetch student profile information
- `useStudentAcademicRecords()` - Fetch academic records
- `useStudentUpcomingEvents()` - Fetch upcoming events

### Utilities
- `studentDashboardKeys` - Query key factory for cache management

## Quick Start

### Installation
No installation needed - hooks are already available in the project.

### Basic Usage
```javascript
import { useStudentDashboard } from '../../hooks/useStudentDashboard';

function StudentDashboard() {
  const { data: stats, isLoading, error } = useStudentDashboard();
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return (
    <div>
      <h2>Enrolled Courses: {stats.enrolledCourses}</h2>
      <h2>Current GPA: {stats.currentGPA}</h2>
    </div>
  );
}
```

## Key Features

### 1. React Query Integration
- Automatic caching (5-10 minute stale time)
- Background refetching
- Refetch on window focus (for dashboard stats)
- Built-in error handling
- Loading states

### 2. Comprehensive Student Data
Different hooks for different aspects of student information:
- **Dashboard Stats:** Overview metrics and KPIs
- **Profile:** Personal and academic information
- **Academic Records:** Grades, GPA, course history
- **Upcoming Events:** Campus and department events

### 3. Automatic Cache Management
- 5-10 minute cache duration depending on data type
- Automatic refetch on window focus for dashboard stats
- Manual invalidation support

### 4. Type Safety
JSDoc comments provide better IDE support and type checking.

## Components Using These Hooks

### Primary Components
1. **StudentDashboard.jsx** - Main student dashboard page
   - Uses: `useStudentDashboard` (for loading state)

2. **StudentProfileCard.jsx** - Student profile display
   - Uses: `useStudentProfile`

3. **UpcomingEvents.jsx** - Events list
   - Uses: `useStudentUpcomingEvents`

4. **AcademicProgress.jsx** - Academic records display
   - Uses: `useStudentAcademicRecords`

5. **StudentDashboardStats.jsx** - Dashboard statistics cards
   - Uses: `useStudentDashboard`

### Related Components
- `UniversityMap.jsx` - University location map
- `StudentDashboardSkeleton.jsx` - Loading skeleton
- `EventCard.jsx` - Individual event card
- `StatCard.jsx` - Individual stat card

## Service Layer
**Service:** `client/src/services/student-dashboard-service/index.js`

The hooks interact with the service layer which handles:
- API calls to fetch student data
- Request/response formatting
- Error handling
- Authentication

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
  semesters: Array<{
    semester: string,
    year: string,
    courses: Array<{
      code: string,
      name: string,
      credits: number,
      grade: string,
      gpa: number
    }>,
    semesterGPA: number
  }>,
  overallGPA: number,
  totalCredits: number,
  completedCredits: number
}
```

### Upcoming Events
```javascript
Array<{
  id: number,
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  type: string,
  isEnrolled: boolean
}>
```

## Best Practices

### 1. Use Loading Skeletons
```javascript
if (isLoading) return <StudentDashboardSkeleton />;
```

### 2. Handle Errors Gracefully
```javascript
if (error) return <ErrorMessage message={error.message} />;
```

### 3. Leverage Caching
```javascript
// Data is cached for 5-10 minutes automatically
const { data: stats } = useStudentDashboard();
```

### 4. Combine Multiple Hooks
```javascript
const { data: stats } = useStudentDashboard();
const { data: profile } = useStudentProfile();
const { data: events } = useStudentUpcomingEvents();
```

### 5. Manual Refresh When Needed
```javascript
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: studentDashboardKeys.all });
```

## Configuration

### Stale Time
- **Dashboard Stats:** 5 minutes - Updates frequently
- **Student Profile:** 10 minutes - Changes less frequently
- **Academic Records:** 10 minutes - Relatively static
- **Upcoming Events:** 5 minutes - Can change frequently

### Refetch Behavior
- **Dashboard Stats:** Refetch on window focus enabled
- **Others:** Default React Query behavior (on mount, reconnect)

## Troubleshooting

### Issue: Stats not updating
**Solution:** Check network tab for API calls. Manually invalidate cache if needed.

### Issue: Stale data showing
**Solution:** Reduce `staleTime` or manually refetch using `refetch()`.

### Issue: Import errors
**Solution:** Ensure you're importing from `../../hooks/useStudentDashboard` (not the old `student-dashboard-hook` directory).

### Issue: Loading state stuck
**Solution:** Check API endpoint and authentication. Verify service layer is working.

## Performance Considerations

### 1. Caching Strategy
- **Stale Time:** 5-10 minutes reduces server load
- **Background Refetch:** Keeps data fresh without blocking UI
- **Window Focus Refetch:** Ensures fresh data when user returns

### 2. Loading States
- Skeleton loading prevents layout shift
- Provides better perceived performance
- Maintains UI structure during load

### 3. Error Handling
- Graceful error display
- Automatic retry with exponential backoff
- User-friendly error messages

## Future Enhancements

### Potential Improvements
1. **Real-time Updates** - WebSocket integration for live data
2. **Notifications** - Push notifications for events and deadlines
3. **Grade Predictions** - AI-based grade prediction
4. **Course Recommendations** - Personalized course suggestions
5. **Study Analytics** - Track study patterns and productivity
6. **Peer Comparison** - Anonymous comparison with peers
7. **Achievement System** - Badges and milestones
8. **Export Functionality** - Download academic records as PDF
9. **Calendar Integration** - Sync events with external calendars
10. **Mobile App** - Native mobile app support

## Related Documentation

- [User Management Hooks](../user-management-hooks/)
- [Admin Dashboard Hooks](../admin-dashboard-hooks/)
- [Student Profile Hooks](../student-profile-hooks/)
- [Dual Portal Authentication](../dual-portal-authentication/)

## API Endpoints

### Get Dashboard Stats
```
GET /api/student/dashboard/stats
```

### Get Student Profile
```
GET /api/student/profile
```

### Get Academic Records
```
GET /api/student/academic-records
```

### Get Upcoming Events
```
GET /api/student/events/upcoming
```

## Testing

### Unit Tests
```javascript
import { renderHook, waitFor } from '@testing-library/react';
import { useStudentDashboard } from './useStudentDashboard';

test('fetches dashboard stats', async () => {
  const { result } = renderHook(() => useStudentDashboard());
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  
  expect(result.current.data).toHaveProperty('enrolledCourses');
  expect(result.current.data).toHaveProperty('currentGPA');
});
```

### Integration Tests
```javascript
test('dashboard displays stats correctly', async () => {
  render(<StudentDashboard />);
  
  await waitFor(() => {
    expect(screen.getByText(/Enrolled Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/Current GPA/i)).toBeInTheDocument();
  });
});
```

## Migration Notes

If you need to add new student dashboard hooks in the future:
1. Add them to `client/src/hooks/useStudentDashboard.js`
2. Export them from the same file
3. Update `studentDashboardKeys` if needed for cache management
4. Add JSDoc comments for IDE support
5. Update documentation

## Support

For issues or questions:
1. Check the [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common usage patterns
2. Review the [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md) for detailed API documentation
3. Check the service layer implementation
4. Review React Query documentation for advanced usage

## Changelog

### April 26, 2026
- ✅ Consolidated student dashboard hooks into single file
- ✅ Updated all imports across the codebase (4 files)
- ✅ Removed old hook directory structure
- ✅ Added comprehensive documentation
- ✅ Added JSDoc comments for better IDE support
- ✅ Added query key factory for cache management

## License
Part of the Student Data Profiling System (MEMSILOGKO)

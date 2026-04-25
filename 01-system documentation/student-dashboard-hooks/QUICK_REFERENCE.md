# Student Dashboard Hooks - Quick Reference

## Import
```javascript
import { 
  useStudentDashboard,
  useStudentProfile,
  useStudentAcademicRecords,
  useStudentUpcomingEvents,
  studentDashboardKeys
} from '../../hooks/useStudentDashboard';
```

## Usage Examples

### Dashboard Statistics
```javascript
const { data: stats, isLoading, error } = useStudentDashboard();

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;

return (
  <div>
    <StatCard title="Enrolled Courses" value={stats.enrolledCourses} />
    <StatCard title="Current GPA" value={stats.currentGPA} />
    <StatCard title="Completed Credits" value={stats.completedCredits} />
  </div>
);
```

### Student Profile
```javascript
const { data: profile, isLoading } = useStudentProfile();

if (isLoading) return <ProfileSkeleton />;

return (
  <div className="profile-card">
    <img src={profile.avatar} alt={profile.name} />
    <h2>{profile.name}</h2>
    <p>{profile.studentNumber}</p>
    <p>{profile.program} - {profile.yearLevel}</p>
    <p>{profile.email}</p>
  </div>
);
```

### Academic Records
```javascript
const { data: records, isLoading } = useStudentAcademicRecords();

if (isLoading) return <RecordsSkeleton />;

return (
  <div>
    <h2>Overall GPA: {records.overallGPA.toFixed(2)}</h2>
    <p>Total Credits: {records.completedCredits} / {records.totalCredits}</p>
    
    {records.semesters.map(semester => (
      <div key={semester.semester}>
        <h3>{semester.semester} {semester.year}</h3>
        <p>Semester GPA: {semester.semesterGPA.toFixed(2)}</p>
        
        {semester.courses.map(course => (
          <div key={course.code}>
            <span>{course.code} - {course.name}</span>
            <span>Grade: {course.grade}</span>
            <span>Credits: {course.credits}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);
```

### Upcoming Events
```javascript
const { data: events, isLoading } = useStudentUpcomingEvents();

if (isLoading) return <EventsSkeleton />;

return (
  <div className="events-list">
    {events.length === 0 ? (
      <p>No upcoming events</p>
    ) : (
      events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>📅 {event.date} at {event.time}</p>
          <p>📍 {event.location}</p>
          {event.isEnrolled && <span className="badge">Enrolled</span>}
        </div>
      ))
    )}
  </div>
);
```

### With Loading Skeleton
```javascript
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import { StudentDashboardSkeleton } from '../../layouts/skeleton-loading';

const StudentDashboard = () => {
  const { isLoading } = useStudentDashboard();
  
  if (isLoading) {
    return (
      <AdminLayout>
        <StudentDashboardSkeleton />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <StudentProfileCard />
      <UpcomingEvents />
    </AdminLayout>
  );
};
```

### Manual Refresh
```javascript
import { useQueryClient } from '@tanstack/react-query';
import { studentDashboardKeys } from '../../hooks/useStudentDashboard';

const RefreshButton = () => {
  const queryClient = useQueryClient();
  
  const handleRefreshStats = () => {
    queryClient.invalidateQueries({ 
      queryKey: studentDashboardKeys.stats() 
    });
  };
  
  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ 
      queryKey: studentDashboardKeys.all 
    });
  };
  
  return (
    <>
      <button onClick={handleRefreshStats}>Refresh Stats</button>
      <button onClick={handleRefreshAll}>Refresh All Data</button>
    </>
  );
};
```

### Combined Usage
```javascript
import { 
  useStudentDashboard,
  useStudentProfile,
  useStudentUpcomingEvents
} from '../../hooks/useStudentDashboard';

const StudentDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useStudentDashboard();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: events, isLoading: eventsLoading } = useStudentUpcomingEvents();
  
  const isLoading = statsLoading || profileLoading || eventsLoading;
  
  if (isLoading) return <FullPageSkeleton />;
  
  return (
    <div className="dashboard">
      <ProfileSection profile={profile} />
      <StatsSection stats={stats} />
      <EventsSection events={events} />
    </div>
  );
};
```

## Data Structures

### Dashboard Stats
```javascript
{
  enrolledCourses: 6,
  completedCourses: 24,
  currentGPA: 3.75,
  upcomingEventsCount: 3,
  totalCredits: 120,
  completedCredits: 96
}
```

### Student Profile
```javascript
{
  id: 1,
  studentNumber: "2024-IT-001",
  name: "John Doe",
  email: "john.doe@university.edu",
  phone: "+1234567890",
  address: "123 Main St, City",
  program: "BSIT",
  yearLevel: "3rd Year",
  department: "IT",
  status: "active",
  enrollmentDate: "2021-08-15",
  avatar: "/uploads/avatars/john.jpg"
}
```

### Academic Records
```javascript
{
  semesters: [
    {
      semester: "1st Semester",
      year: "2023-2024",
      courses: [
        {
          code: "IT301",
          name: "Data Structures",
          credits: 3,
          grade: "A",
          gpa: 4.0
        }
      ],
      semesterGPA: 3.8
    }
  ],
  overallGPA: 3.75,
  totalCredits: 120,
  completedCredits: 96
}
```

### Upcoming Events
```javascript
[
  {
    id: 1,
    title: "Tech Summit 2024",
    description: "Annual technology conference",
    date: "2024-05-15",
    time: "09:00 AM",
    location: "Main Auditorium",
    type: "campus",
    isEnrolled: true
  }
]
```

## Cache Management

### Query Keys
```javascript
import { studentDashboardKeys } from '../../hooks/useStudentDashboard';

studentDashboardKeys.all                // ['studentDashboard']
studentDashboardKeys.stats()            // ['studentDashboard', 'stats']
studentDashboardKeys.profile()          // ['studentDashboard', 'profile']
studentDashboardKeys.academicRecords()  // ['studentDashboard', 'academicRecords']
studentDashboardKeys.upcomingEvents()   // ['studentDashboard', 'upcomingEvents']
```

### Invalidate Cache
```javascript
// Invalidate all student dashboard queries
queryClient.invalidateQueries({ 
  queryKey: studentDashboardKeys.all 
});

// Invalidate only stats
queryClient.invalidateQueries({ 
  queryKey: studentDashboardKeys.stats() 
});

// Invalidate only profile
queryClient.invalidateQueries({ 
  queryKey: studentDashboardKeys.profile() 
});
```

### Refetch Manually
```javascript
const { refetch } = useStudentDashboard();

const handleRefresh = async () => {
  const { data } = await refetch();
  console.log('Refreshed data:', data);
};
```

## Configuration

### Stale Time
- **Dashboard Stats:** 5 minutes
- **Student Profile:** 10 minutes
- **Academic Records:** 10 minutes
- **Upcoming Events:** 5 minutes

### Refetch Behavior
- **Dashboard Stats:** Refetch on window focus enabled
- **Others:** Default React Query behavior

## Loading States

### Check Loading State
```javascript
const { isLoading, isFetching } = useStudentDashboard();

// isLoading: true on initial load
// isFetching: true on any fetch (including background refetch)
```

### Loading Indicators
```javascript
const { isLoading, isFetching } = useStudentDashboard();

return (
  <div>
    {isLoading && <FullPageSkeleton />}
    {isFetching && !isLoading && <RefreshIndicator />}
    <DashboardContent />
  </div>
);
```

## Error Handling

### Basic Error Handling
```javascript
const { data, error, isError } = useStudentDashboard();

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### Advanced Error Handling
```javascript
const { data, error, isError, refetch } = useStudentDashboard();

if (isError) {
  return (
    <div className="error-container">
      <h3>Failed to load dashboard</h3>
      <p>{error.message}</p>
      <button onClick={() => refetch()}>
        Try Again
      </button>
    </div>
  );
}
```

### Error with Toast
```javascript
import useToast from '../../hooks/useToast';

const StudentDashboard = () => {
  const { data, error } = useStudentDashboard();
  const { showError } = useToast();
  
  useEffect(() => {
    if (error) {
      showError(error.message || 'Failed to load dashboard');
    }
  }, [error, showError]);
  
  // Rest of component...
};
```

## Complete Component Example

```javascript
import { 
  useStudentDashboard,
  useStudentProfile,
  useStudentUpcomingEvents
} from '../../hooks/useStudentDashboard';
import { useAuth } from '../../context/AuthContext';
import { StudentDashboardSkeleton } from '../../layouts/skeleton-loading';
import AdminLayout from '../../layouts/AdminLayout';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useStudentDashboard();
  const { data: profile, isLoading: profileLoading } = useStudentProfile();
  const { data: events, isLoading: eventsLoading } = useStudentUpcomingEvents();
  
  const isLoading = statsLoading || profileLoading || eventsLoading;
  
  if (isLoading) {
    return (
      <AdminLayout>
        <StudentDashboardSkeleton />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
        
        {/* Profile Card */}
        <div className="profile-card">
          <h2>{profile.name}</h2>
          <p>{profile.program} - {profile.yearLevel}</p>
          <p>Student ID: {profile.studentNumber}</p>
        </div>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard 
            title="Enrolled Courses" 
            value={stats.enrolledCourses}
          />
          <StatCard 
            title="Current GPA" 
            value={stats.currentGPA.toFixed(2)}
          />
          <StatCard 
            title="Completed Credits" 
            value={`${stats.completedCredits}/${stats.totalCredits}`}
          />
        </div>
        
        {/* Upcoming Events */}
        <div className="events-section">
          <h2>Upcoming Events</h2>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentDashboard;
```

## Performance Tips

1. **Use Skeleton Loading** - Better UX during initial load
2. **Leverage Caching** - 5-10 minute stale time reduces API calls
3. **Background Refetch** - Keeps data fresh without blocking UI
4. **Conditional Rendering** - Only render when data is available
5. **Memoization** - Use `useMemo` for expensive calculations

## Common Patterns

### Conditional Data Display
```javascript
const { data: stats } = useStudentDashboard();

return (
  <div>
    {stats?.currentGPA >= 3.5 && (
      <Badge>Dean's List</Badge>
    )}
  </div>
);
```

### Stats with Progress Bar
```javascript
const { data: stats } = useStudentDashboard();

const progress = (stats.completedCredits / stats.totalCredits) * 100;

return (
  <div>
    <ProgressBar value={progress} />
    <p>{stats.completedCredits} / {stats.totalCredits} credits</p>
  </div>
);
```

### Events with Filtering
```javascript
const { data: events } = useStudentUpcomingEvents();

const campusEvents = events.filter(e => e.type === 'campus');
const departmentEvents = events.filter(e => e.type === 'department');

return (
  <div>
    <h3>Campus Events ({campusEvents.length})</h3>
    <h3>Department Events ({departmentEvents.length})</h3>
  </div>
);
```

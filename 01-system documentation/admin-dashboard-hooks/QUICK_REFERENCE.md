# Admin Dashboard Hooks - Quick Reference

## Import
```javascript
import { useDashboardStats, dashboardKeys } from '../../hooks/useAdminDashboard';
```

## Usage Examples

### Basic Usage
```javascript
const { data: stats, isLoading, error } = useDashboardStats();

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;

return (
  <div>
    <h2>Total Students: {stats.totalStudents}</h2>
    <h2>Total Faculty: {stats.totalFaculty}</h2>
    <h2>Active Classes: {stats.activeClasses}</h2>
  </div>
);
```

### With Loading Skeleton
```javascript
import { useDashboardStats } from '../../hooks/useAdminDashboard';
import { AdminDashboardSkeleton } from '../../layouts/skeleton-loading';

const AdminDashboard = () => {
  const { isLoading } = useDashboardStats();
  
  if (isLoading) {
    return (
      <AdminLayout>
        <AdminDashboardSkeleton />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <DashboardStats />
    </AdminLayout>
  );
};
```

### Accessing Stats in Component
```javascript
import { useDashboardStats } from '../../../hooks/useAdminDashboard';

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <StatsCardsSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard 
        title="Total Students" 
        value={stats.totalStudents}
        icon={<FaUserGraduate />}
        color="blue"
      />
      <StatCard 
        title="Total Faculty" 
        value={stats.totalFaculty}
        icon={<FaChalkboardTeacher />}
        color="green"
      />
      <StatCard 
        title="Active Classes" 
        value={stats.activeClasses}
        icon={<FaClipboardCheck />}
        color="purple"
      />
      <StatCard 
        title="Pending Tasks" 
        value={stats.pendingTasks}
        icon={<FaClock />}
        color="orange"
      />
    </div>
  );
};
```

### Manual Refresh
```javascript
import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '../../hooks/useAdminDashboard';

const RefreshButton = () => {
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ 
      queryKey: dashboardKeys.stats() 
    });
  };
  
  return (
    <button onClick={handleRefresh}>
      Refresh Dashboard
    </button>
  );
};
```

### Role-Based Stats Display
```javascript
import { useDashboardStats } from '../../hooks/useAdminDashboard';
import { useAuth } from '../../context/AuthContext';

const DashboardStats = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { user } = useAuth();
  
  const isDeptChair = user?.role === 'dept_chair';
  const isFaculty = user?.role === 'faculty';
  
  if (isLoading) return <Skeleton />;
  
  return (
    <div>
      {isDeptChair && (
        <>
          <StatCard 
            title={`${user.department} Students`}
            value={stats.departmentStudents}
          />
          <StatCard 
            title={`${user.department} Faculty`}
            value={stats.departmentFaculty}
          />
        </>
      )}
      
      {isFaculty && (
        <>
          <StatCard 
            title="My Classes"
            value={stats.myClasses}
          />
          <StatCard 
            title="My Students"
            value={stats.myStudents}
          />
        </>
      )}
      
      {!isDeptChair && !isFaculty && (
        <>
          <StatCard 
            title="Total Students"
            value={stats.totalStudents}
          />
          <StatCard 
            title="Total Faculty"
            value={stats.totalFaculty}
          />
        </>
      )}
    </div>
  );
};
```

## Data Structure

### Admin Stats
```javascript
{
  totalStudents: 1250,
  totalFaculty: 85,
  activeClasses: 120,
  pendingTasks: 15,
  totalDepartments: 8,
  totalPrograms: 24
}
```

### Department Chair Stats
```javascript
{
  totalStudents: 1250,        // University-wide
  totalFaculty: 85,           // University-wide
  departmentStudents: 320,    // Department-specific
  departmentFaculty: 18,      // Department-specific
  departmentClasses: 45,      // Department-specific
  pendingApprovals: 5
}
```

### Faculty Stats
```javascript
{
  myClasses: 4,
  myStudents: 120,
  upcomingClasses: 2,
  pendingGrades: 8
}
```

## Cache Management

### Query Keys
```javascript
import { dashboardKeys } from '../../hooks/useAdminDashboard';

dashboardKeys.all      // ['dashboard']
dashboardKeys.stats()  // ['dashboard', 'stats']
```

### Invalidate Cache
```javascript
// Invalidate all dashboard queries
queryClient.invalidateQueries({ 
  queryKey: dashboardKeys.all 
});

// Invalidate only stats
queryClient.invalidateQueries({ 
  queryKey: dashboardKeys.stats() 
});
```

### Refetch Manually
```javascript
const { refetch } = useDashboardStats();

const handleRefresh = async () => {
  const { data } = await refetch();
  console.log('Refreshed data:', data);
};
```

## Configuration

### Stale Time
**5 minutes** - Data is considered fresh for 5 minutes

### Refetch Behavior
- **On Window Focus:** Yes
- **On Reconnect:** Yes (default)
- **On Mount:** Yes (default)

### Retry Configuration
- **Retry Count:** 3 (default)
- **Retry Delay:** Exponential backoff (default)

## Loading States

### Check Loading State
```javascript
const { isLoading, isFetching } = useDashboardStats();

// isLoading: true on initial load
// isFetching: true on any fetch (including background refetch)
```

### Loading Indicators
```javascript
const { isLoading, isFetching } = useDashboardStats();

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
const { data, error, isError } = useDashboardStats();

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### Advanced Error Handling
```javascript
const { data, error, isError, refetch } = useDashboardStats();

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

const DashboardStats = () => {
  const { data, error } = useDashboardStats();
  const { showError } = useToast();
  
  useEffect(() => {
    if (error) {
      showError(error.message || 'Failed to load dashboard stats');
    }
  }, [error, showError]);
  
  // Rest of component...
};
```

## Complete Component Example

```javascript
import { useDashboardStats } from '../../hooks/useAdminDashboard';
import { useAuth } from '../../context/AuthContext';
import { AdminDashboardSkeleton } from '../../layouts/skeleton-loading';
import { FaUserGraduate, FaChalkboardTeacher, FaClipboardCheck, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  const { user } = useAuth();
  
  const isDeptChair = user?.role === 'dept_chair';
  
  if (isLoading) {
    return (
      <AdminLayout>
        <AdminDashboardSkeleton />
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <ErrorMessage message={error.message} />
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>
          {isDeptChair && user?.department 
            ? `${user.department} Department Dashboard` 
            : 'Admin Dashboard'}
        </h1>
        
        <div className="stats-grid">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents}
            icon={<FaUserGraduate />}
          />
          <StatCard 
            title="Total Faculty" 
            value={stats.totalFaculty}
            icon={<FaChalkboardTeacher />}
          />
          <StatCard 
            title="Active Classes" 
            value={stats.activeClasses}
            icon={<FaClipboardCheck />}
          />
          <StatCard 
            title="Pending Tasks" 
            value={stats.pendingTasks}
            icon={<FaClock />}
          />
        </div>
        
        {/* Other dashboard content */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
```

## Performance Tips

1. **Use Skeleton Loading** - Provides better UX during initial load
2. **Leverage Caching** - 5-minute stale time reduces API calls
3. **Background Refetch** - Keeps data fresh without blocking UI
4. **Conditional Rendering** - Only render stats when data is available
5. **Memoization** - Use `useMemo` for expensive calculations on stats data

## Common Patterns

### Conditional Stats Display
```javascript
const { data: stats } = useDashboardStats();

return (
  <div>
    {stats?.totalStudents > 0 && (
      <StatCard title="Students" value={stats.totalStudents} />
    )}
  </div>
);
```

### Stats with Percentage Change
```javascript
const { data: stats } = useDashboardStats();

return (
  <StatCard 
    title="Total Students" 
    value={stats.totalStudents}
    change={stats.studentGrowth}
    changeType={stats.studentGrowth > 0 ? 'increase' : 'decrease'}
  />
);
```

### Stats with Loading Placeholder
```javascript
const { data: stats, isLoading } = useDashboardStats();

return (
  <StatCard 
    title="Total Students" 
    value={isLoading ? '...' : stats.totalStudents}
  />
);
```

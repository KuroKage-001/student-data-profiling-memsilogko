# Admin Dashboard Hooks Consolidation

## Overview
Consolidated all admin dashboard hooks from the `admin-dashboard-hook` directory into a single file for better maintainability and simpler imports.

## Changes Made

### 1. Created Consolidated Hook File
**Location:** `client/src/hooks/useAdminDashboard.js`

This single file now contains:
- `useDashboardStats()` - Fetch dashboard statistics
- `dashboardKeys` - Query key factory for cache management

### 2. Removed Old Directory Structure
**Deleted:**
- `client/src/hooks/admin-dashboard-hook/index.js`
- `client/src/hooks/admin-dashboard-hook/useDashboardStats.js`
- `client/src/hooks/admin-dashboard-hook/` (directory)

### 3. Updated Imports

#### Files Updated:
1. **`client/src/pages/admin-pages/AdminDashboard.jsx`**
   ```javascript
   // Before
   import { useDashboardStats } from '../../hooks/admin-dashboard-hook';
   
   // After
   import { useDashboardStats } from '../../hooks/useAdminDashboard';
   ```

2. **`client/src/components/admin-components/dashboard/DashboardStats.jsx`**
   ```javascript
   // Before
   import { useDashboardStats } from '../../../hooks/admin-dashboard-hook';
   
   // After
   import { useDashboardStats } from '../../../hooks/useAdminDashboard';
   ```

## Benefits

### 1. Simplified Structure
- Single file instead of multiple files in a directory
- Easier to locate and maintain
- Consistent with other hooks in the project

### 2. Cleaner Imports
```javascript
// Before (longer path)
import { useDashboardStats } from '../../hooks/admin-dashboard-hook';

// After (cleaner)
import { useDashboardStats } from '../../hooks/useAdminDashboard';
```

### 3. Better Organization
- All dashboard-related hooks in one place
- Consistent with other consolidated hooks (useUserManagement, etc.)
- Easier to understand the full API at a glance

### 4. Maintained Functionality
- React Query hook preserved
- Query key factory added for better cache management
- Stale time and refetch behavior intact
- JSDoc comments added for better IDE support

## Hook API Reference

### Query Hook

#### `useDashboardStats()`
Fetches comprehensive dashboard statistics including:
- Total students count
- Total faculty count
- Active classes count
- Pending tasks count
- Department-specific stats (for dept_chair role)

**Parameters:** None

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: stats, isLoading, error } = useDashboardStats();

if (isLoading) return <Skeleton />;
if (error) return <Error message={error.message} />;

console.log(stats.totalStudents);
console.log(stats.totalFaculty);
console.log(stats.activeClasses);
```

### Query Keys

The `dashboardKeys` object provides a factory for generating consistent query keys:

```javascript
dashboardKeys.all      // ['dashboard']
dashboardKeys.stats()  // ['dashboard', 'stats']
```

## Dashboard Statistics Data Structure

The `useDashboardStats()` hook returns data with the following structure:

```javascript
{
  totalStudents: number,
  totalFaculty: number,
  activeClasses: number,
  pendingTasks: number,
  // For dept_chair role:
  departmentStudents: number,
  departmentFaculty: number,
  departmentClasses: number,
  // Additional stats may vary based on role
}
```

## Role-Based Statistics

### Admin Role
- Access to all university-wide statistics
- Total counts across all departments
- System-wide metrics

### Department Chair Role
- Department-specific statistics
- Faculty and students in their department
- Department class schedules
- Department-specific metrics

### Faculty Role
- Personal teaching statistics
- Assigned classes
- Student enrollment in their classes

## Configuration

### Stale Time
**5 minutes** - Dashboard statistics don't change frequently, so we cache them for 5 minutes to reduce unnecessary API calls.

### Refetch Behavior
**Refetch on Window Focus:** Enabled - When users return to the dashboard tab, fresh data is automatically fetched to ensure they see the latest statistics.

## Testing Checklist

- [x] Admin dashboard loads correctly
- [x] Dashboard stats display properly
- [x] Loading skeleton shows during data fetch
- [x] Error handling works correctly
- [x] Stats update after 5 minutes (stale time)
- [x] Stats refetch when returning to tab
- [x] Department chair sees department-specific stats
- [x] Faculty sees faculty-specific stats
- [x] No console errors
- [x] All imports resolved correctly

## Usage in Components

### AdminDashboard.jsx
```javascript
import { useDashboardStats } from '../../hooks/useAdminDashboard';

const AdminDashboard = () => {
  const { isLoading } = useDashboardStats();
  
  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }
  
  return (
    <AdminLayout>
      <DashboardStats />
      {/* Other dashboard content */}
    </AdminLayout>
  );
};
```

### DashboardStats.jsx
```javascript
import { useDashboardStats } from '../../../hooks/useAdminDashboard';

const DashboardStats = () => {
  const { data: stats, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <StatsCardsSkeleton />;
  if (error) return <ErrorMessage />;
  
  return (
    <div className="grid grid-cols-4 gap-4">
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
      {/* More stat cards */}
    </div>
  );
};
```

## Cache Management

### Manual Cache Invalidation
```javascript
import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '../../hooks/useAdminDashboard';

const MyComponent = () => {
  const queryClient = useQueryClient();
  
  const refreshDashboard = () => {
    queryClient.invalidateQueries({ 
      queryKey: dashboardKeys.stats() 
    });
  };
  
  return <button onClick={refreshDashboard}>Refresh</button>;
};
```

### Automatic Cache Invalidation
The dashboard stats are automatically invalidated when:
- 5 minutes have passed (stale time)
- User switches back to the dashboard tab (refetch on window focus)

## Performance Considerations

### 1. Caching Strategy
- **Stale Time:** 5 minutes reduces unnecessary API calls
- **Refetch on Focus:** Ensures users see fresh data when returning
- **Background Refetch:** React Query handles this automatically

### 2. Loading States
- Skeleton loading provides better UX during data fetch
- Prevents layout shift with proper skeleton dimensions

### 3. Error Handling
- Graceful error display
- Retry mechanism built into React Query
- Error boundaries can be added for additional safety

## Future Enhancements

### Potential Improvements
1. Add real-time updates using WebSockets
2. Add date range filtering for statistics
3. Add export functionality for reports
4. Add comparison with previous periods
5. Add trend indicators (up/down arrows)
6. Add drill-down capabilities for detailed views
7. Add customizable dashboard widgets
8. Add role-specific dashboard layouts

## Related Documentation

- [User Management Hooks](../user-management-hooks/)
- [Admin Dashboard Documentation](../admin-dashboard-documentations/)
- [Dual Portal Authentication](../dual-portal-authentication/)

## Migration Notes

If you need to add new dashboard hooks in the future:
1. Add them to `client/src/hooks/useAdminDashboard.js`
2. Export them from the same file
3. Update `dashboardKeys` if needed for cache management
4. Import directly from `useAdminDashboard`

## Related Files

- **Hook File:** `client/src/hooks/useAdminDashboard.js`
- **Service:** `client/src/services/admin-dashboard-service/index.js`
- **Main Component:** `client/src/pages/admin-pages/AdminDashboard.jsx`
- **Stats Component:** `client/src/components/admin-components/dashboard/DashboardStats.jsx`
- **Map Component:** `client/src/components/admin-components/dashboard/UniversityMap.jsx`
- **Skeleton:** `client/src/layouts/skeleton-loading/AdminDashboardSkeleton.jsx`

## Date
April 25, 2026

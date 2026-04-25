# Admin Dashboard Hooks Documentation

## Overview
This directory contains documentation for the consolidated admin dashboard hooks system. All admin dashboard hooks have been consolidated into a single file for better maintainability and simpler imports.

## Documentation Files

### 1. [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md)
Complete documentation of the consolidation process, including:
- Changes made
- Benefits of consolidation
- Full API reference
- Role-based statistics
- Cache management
- Testing checklist
- Future enhancements

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
Quick reference guide with:
- Import examples
- Usage examples
- Data structures
- Cache management
- Loading states
- Error handling patterns
- Complete component examples
- Performance tips

## Hook Location
**File:** `client/src/hooks/useAdminDashboard.js`

## Available Hooks

### Query Hook
- `useDashboardStats()` - Fetch comprehensive dashboard statistics

### Utilities
- `dashboardKeys` - Query key factory for cache management

## Quick Start

### Installation
No installation needed - hooks are already available in the project.

### Basic Usage
```javascript
import { useDashboardStats } from '../../hooks/useAdminDashboard';

function AdminDashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();
  
  if (isLoading) return <Skeleton />;
  if (error) return <Error />;
  
  return (
    <div>
      <h2>Total Students: {stats.totalStudents}</h2>
      <h2>Total Faculty: {stats.totalFaculty}</h2>
    </div>
  );
}
```

## Key Features

### 1. React Query Integration
- Automatic caching (5-minute stale time)
- Background refetching
- Refetch on window focus
- Built-in error handling
- Loading states

### 2. Role-Based Statistics
Different statistics based on user role:
- **Admin:** University-wide statistics
- **Department Chair:** Department-specific statistics
- **Faculty:** Personal teaching statistics

### 3. Automatic Cache Management
- 5-minute cache duration
- Automatic refetch on window focus
- Manual invalidation support

### 4. Type Safety
JSDoc comments provide better IDE support and type checking.

## Components Using These Hooks

### Primary Components
1. **AdminDashboard.jsx** - Main admin dashboard page
   - Uses: `useDashboardStats` (for loading state)

2. **DashboardStats.jsx** - Dashboard statistics cards
   - Uses: `useDashboardStats` (for displaying stats)

### Related Components
- `UniversityMap.jsx` - University location map
- `AdminDashboardSkeleton.jsx` - Loading skeleton
- `StatCard.jsx` - Individual stat card component

## Service Layer
**Service:** `client/src/services/admin-dashboard-service/index.js`

The hook interacts with the service layer which handles:
- API calls to fetch dashboard statistics
- Request/response formatting
- Error handling
- Authentication

## Statistics Data Structure

### Admin Role
```javascript
{
  totalStudents: number,
  totalFaculty: number,
  activeClasses: number,
  pendingTasks: number,
  totalDepartments: number,
  totalPrograms: number
}
```

### Department Chair Role
```javascript
{
  totalStudents: number,        // University-wide
  totalFaculty: number,          // University-wide
  departmentStudents: number,    // Department-specific
  departmentFaculty: number,     // Department-specific
  departmentClasses: number,     // Department-specific
  pendingApprovals: number
}
```

### Faculty Role
```javascript
{
  myClasses: number,
  myStudents: number,
  upcomingClasses: number,
  pendingGrades: number
}
```

## Best Practices

### 1. Use Loading Skeletons
```javascript
if (isLoading) return <AdminDashboardSkeleton />;
```

### 2. Handle Errors Gracefully
```javascript
if (error) return <ErrorMessage message={error.message} />;
```

### 3. Leverage Caching
```javascript
// Data is cached for 5 minutes automatically
const { data: stats } = useDashboardStats();
```

### 4. Role-Based Display
```javascript
const { user } = useAuth();
const isDeptChair = user?.role === 'dept_chair';

return isDeptChair ? <DeptStats /> : <AdminStats />;
```

### 5. Manual Refresh When Needed
```javascript
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
```

## Configuration

### Stale Time
**5 minutes** - Dashboard statistics are cached for 5 minutes to reduce unnecessary API calls while keeping data reasonably fresh.

### Refetch Behavior
- **On Window Focus:** Enabled - Fresh data when returning to dashboard
- **On Reconnect:** Enabled (default)
- **On Mount:** Enabled (default)

## Troubleshooting

### Issue: Stats not updating
**Solution:** Check network tab for API calls. Manually invalidate cache if needed.

### Issue: Stale data showing
**Solution:** Reduce `staleTime` or manually refetch using `refetch()`.

### Issue: Import errors
**Solution:** Ensure you're importing from `../../hooks/useAdminDashboard` (not the old `admin-dashboard-hook` directory).

### Issue: Loading state stuck
**Solution:** Check API endpoint and authentication. Verify service layer is working.

## Performance Considerations

### 1. Caching Strategy
- **Stale Time:** 5 minutes reduces server load
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
1. **Real-time Updates** - WebSocket integration for live stats
2. **Historical Data** - Track statistics over time
3. **Comparison Views** - Compare current vs previous periods
4. **Export Functionality** - Download stats as PDF/Excel
5. **Customizable Widgets** - User-configurable dashboard layout
6. **Drill-down Capabilities** - Click stats to see detailed views
7. **Trend Indicators** - Show growth/decline with arrows
8. **Notifications** - Alert on significant changes
9. **Scheduled Reports** - Automated email reports
10. **Advanced Filtering** - Filter stats by date range, department, etc.

## Related Documentation

- [User Management Hooks](../user-management-hooks/)
- [Admin Dashboard Documentation](../admin-dashboard-documentations/)
- [Dual Portal Authentication](../dual-portal-authentication/)
- [Class Scheduling System](../class-scheduling-system/)

## API Endpoints

### Get Dashboard Stats
```
GET /api/admin/dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 1250,
    "totalFaculty": 85,
    "activeClasses": 120,
    "pendingTasks": 15
  }
}
```

## Testing

### Unit Tests
```javascript
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardStats } from './useAdminDashboard';

test('fetches dashboard stats', async () => {
  const { result } = renderHook(() => useDashboardStats());
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  
  expect(result.current.data).toHaveProperty('totalStudents');
  expect(result.current.data).toHaveProperty('totalFaculty');
});
```

### Integration Tests
```javascript
test('dashboard displays stats correctly', async () => {
  render(<AdminDashboard />);
  
  await waitFor(() => {
    expect(screen.getByText(/Total Students/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Faculty/i)).toBeInTheDocument();
  });
});
```

## Migration Notes

If you need to add new dashboard hooks in the future:
1. Add them to `client/src/hooks/useAdminDashboard.js`
2. Export them from the same file
3. Update `dashboardKeys` if needed for cache management
4. Add JSDoc comments for IDE support
5. Update documentation

## Support

For issues or questions:
1. Check the [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common usage patterns
2. Review the [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md) for detailed API documentation
3. Check the service layer implementation
4. Review React Query documentation for advanced usage

## Changelog

### April 25, 2026
- ✅ Consolidated admin dashboard hooks into single file
- ✅ Updated all imports across the codebase
- ✅ Removed old hook directory structure
- ✅ Added comprehensive documentation
- ✅ Added JSDoc comments for better IDE support
- ✅ Added query key factory for cache management

## License
Part of the Student Data Profiling System (MEMSILOGKO)

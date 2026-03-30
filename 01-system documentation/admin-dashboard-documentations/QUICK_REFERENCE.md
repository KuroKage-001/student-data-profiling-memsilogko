# Admin Dashboard - Quick Reference

## Dynamic Statistics

### Total Students Stat
The "Total Students" statistic is now dynamic and fetches real-time data from the database.

### How It Works
1. Component mounts → Hook fetches data
2. Shows skeleton loading (animated placeholders)
3. Displays formatted count (e.g., "1,247")
4. Auto-refreshes every 5 minutes
5. Refetches when window regains focus

### Key Files
```
Service:   client/src/services/admin-dashboard-service/dashboardService.js
Hook:      client/src/hooks/admin-dashboard-hook/useDashboardStats.js
Component: client/src/components/admin-components/dashboard/DashboardStats.jsx
Utils:     client/src/utils/admin-utilities/admin-dashboard-utils/dashboardUtils.js
Skeleton:  client/src/layouts/skeleton-loading/AdminDashboardSkeleton.jsx
```

### API Endpoint
```
GET /api/students-statistics
Auth: Required (JWT)
```

### Response Data
```javascript
{
  total_students: 1247,
  active_students: 1156,
  inactive_students: 68,
  suspended_students: 23,
  average_gpa: 3.45,
  by_program: [...],
  by_year_level: [...]
}
```

### Using the Hook
```jsx
import { useDashboardStats } from '../../hooks/admin-dashboard-hook';
import { AdminDashboardSkeleton } from '../../layouts/skeleton-loading';

const { data, isLoading, isError } = useDashboardStats();

// Show skeleton while loading
if (isLoading) return <AdminDashboardSkeleton />;

// Access data
const totalStudents = data?.total_students || 0;
```

## Skeleton Loading

### Components
```
AdminDashboardSkeleton  - Full page skeleton
DashboardStatsSkeleton  - Stats section only
DashboardCardSkeleton   - Cards section only
```

### Usage
```jsx
import { AdminDashboardSkeleton } from '../../layouts/skeleton-loading';

if (isLoading) {
  return (
    <AdminLayout>
      <AdminDashboardSkeleton />
    </AdminLayout>
  );
}
```

### Utility Functions
```javascript
import { formatDashboardNumber } from '../../utils/admin-utilities/admin-dashboard-utils';

// Format: 1247 → "1,247"
const formatted = formatDashboardNumber(1247);
```

## Current Stats Status

| Stat | Status | Data Source | Percentage |
|------|--------|-------------|------------|
| Total Students | ✅ Dynamic | Database (real-time) | ❌ Removed |
| Active Faculty | ⏳ Static | Hardcoded (89) | ❌ Removed |
| Profiles Completed | ⏳ Static | Hardcoded (1,156) | ❌ Removed |
| Pending Reviews | ⏳ Static | Hardcoded (23) | ❌ Removed |

## UI Improvements

| Feature | Status | Description |
|---------|--------|-------------|
| Skeleton Loading | ✅ Implemented | Animated placeholders during load |
| Static Percentages | ✅ Removed | Removed "+12% from last month" text |
| Dynamic Count | ✅ Implemented | Real-time student count |
| Error Handling | ✅ Implemented | User-friendly error messages |

## Next Steps
1. Implement dynamic Active Faculty count
2. Calculate Profiles Completed from student data
3. Add Pending Reviews functionality
4. Implement real percentage change calculations
5. Add historical data tracking
6. Create skeleton loading for other pages

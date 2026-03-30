# Dynamic Faculty Statistics Implementation

## Overview
Updated the Admin Dashboard to display dynamic faculty statistics fetched from the backend API, replacing the previously hardcoded values.

## Changes Made

### 1. Backend (Already Existed)
The backend already had the necessary endpoint implemented in `FacultyController.php`:

**Endpoint**: `GET /api/faculty-statistics`

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 89,
    "inactive": 45,
    "on_leave": 16,
    "by_department": [
      {
        "department": "Computer Science",
        "count": 45
      },
      // ... more departments
    ]
  }
}
```

**Statistics Provided**:
- `total`: Total number of faculty members
- `active`: Faculty members with "active" status
- `inactive`: Faculty members with "inactive" status
- `on_leave`: Faculty members with "on leave" status
- `by_department`: Faculty count grouped by department

### 2. Frontend Service Layer

**File**: `client/src/services/admin-dashboard-service/dashboardService.js`

**Changes**:
- Updated `getDashboardStats()` to fetch both student and faculty statistics in parallel
- Uses `Promise.all()` for efficient concurrent API calls
- Returns combined data structure

**Before**:
```javascript
async getDashboardStats() {
  const response = await axiosInstance.get('/students-statistics');
  return {
    success: true,
    data: response.data.data
  };
}
```

**After**:
```javascript
async getDashboardStats() {
  const [studentsResponse, facultyResponse] = await Promise.all([
    axiosInstance.get('/students-statistics'),
    axiosInstance.get('/faculty-statistics')
  ]);

  return {
    success: true,
    data: {
      students: studentsResponse.data.data,
      faculty: facultyResponse.data.data
    }
  };
}
```

### 3. Dashboard Stats Component

**File**: `client/src/components/admin-components/dashboard/DashboardStats.jsx`

**Changes**:
- Updated all four stat cards to use dynamic data
- Changed stat card titles and data sources to be more meaningful

**Statistics Displayed**:

| Card | Title | Data Source | Icon | Color |
|------|-------|-------------|------|-------|
| 1 | Total Students | `statsData?.students?.total_students` | FaUserGraduate | Orange |
| 2 | Active Faculty | `statsData?.faculty?.active` | FaChalkboardTeacher | Blue |
| 3 | Total Faculty | `statsData?.faculty?.total` | FaClipboardCheck | Green |
| 4 | Faculty on Leave | `statsData?.faculty?.on_leave` | FaClock | Yellow |

**Before** (Hardcoded):
```javascript
{
  title: 'Active Faculty',
  value: '89',
  // ...
}
```

**After** (Dynamic):
```javascript
{
  title: 'Active Faculty',
  value: isLoading ? '...' : formatNumber(statsData?.faculty?.active || 0),
  // ...
}
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           DashboardStats Component                  │    │
│  │                                                     │    │
│  │  Uses: useDashboardStats() hook                    │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
└─────────────────────┼────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              useDashboardStats Hook                          │
│                                                              │
│  - Uses React Query (useQuery)                              │
│  - Calls dashboardService.getDashboardStats()               │
│  - Caches data for 5 minutes                                │
│  - Auto-refetches on window focus                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Dashboard Service                               │
│                                                              │
│  Parallel API Calls:                                        │
│  ┌─────────────────────┐  ┌──────────────────────┐         │
│  │ GET /students-      │  │ GET /faculty-        │         │
│  │     statistics      │  │     statistics       │         │
│  └─────────────────────┘  └──────────────────────┘         │
└──────────────────────┬──────────────────┬──────────────────┘
                       │                  │
                       ▼                  ▼
┌──────────────────────────────┐  ┌──────────────────────────┐
│  StudentController           │  │  FacultyController       │
│  ::statistics()              │  │  ::statistics()          │
│                              │  │                          │
│  Returns student stats       │  │  Returns faculty stats   │
└──────────────────────────────┘  └──────────────────────────┘
```

## API Endpoints Used

### 1. Students Statistics
**Endpoint**: `GET /api/students-statistics`
**Authentication**: Required (JWT)
**Middleware**: `auth:api`, `check.status`

### 2. Faculty Statistics
**Endpoint**: `GET /api/faculty-statistics`
**Authentication**: Required (JWT)
**Middleware**: `auth:api`, `check.status`

## Loading States

The component handles three states:

1. **Loading**: Shows "..." in stat cards
2. **Success**: Displays actual numbers with comma formatting
3. **Error**: Shows error message in red banner

```javascript
// Loading state
value: isLoading ? '...' : formatNumber(statsData?.faculty?.active || 0)

// Error state
if (isError) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <p className="text-red-600">Failed to load dashboard statistics</p>
    </div>
  );
}
```

## Number Formatting

All statistics use comma formatting for better readability:

```javascript
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
```

**Examples**:
- `89` → `"89"`
- `1234` → `"1,234"`
- `1234567` → `"1,234,567"`

## Caching Strategy

React Query configuration:
- **Stale Time**: 5 minutes (data considered fresh for 5 minutes)
- **Refetch on Window Focus**: Enabled (updates when user returns to tab)
- **Query Key**: `['dashboardStats']`

This ensures:
- Reduced API calls
- Fresh data when needed
- Better performance
- Automatic background updates

## Error Handling

### Service Layer
```javascript
catch (error) {
  console.error('Get dashboard stats error:', error);
  return {
    success: false,
    message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
  };
}
```

### Hook Layer
```javascript
queryFn: async () => {
  const result = await dashboardService.getDashboardStats();
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data;
}
```

### Component Layer
```javascript
if (isError) {
  return <ErrorBanner />;
}
```

## Benefits

1. **Real-time Data**: Dashboard shows actual current statistics
2. **Performance**: Parallel API calls reduce loading time
3. **Caching**: React Query caches data to minimize API calls
4. **User Experience**: Loading states provide feedback
5. **Maintainability**: Single source of truth for statistics
6. **Scalability**: Easy to add more statistics in the future

## Future Enhancements

Potential improvements:
- [ ] Add trend indicators (up/down arrows)
- [ ] Show percentage changes from previous period
- [ ] Add click-through to detailed views
- [ ] Implement real-time updates via WebSockets
- [ ] Add export functionality for statistics
- [ ] Create historical data charts
- [ ] Add department-wise breakdown visualization

## Testing Checklist

- [ ] Dashboard loads with correct faculty statistics
- [ ] Loading state shows "..." while fetching
- [ ] Numbers are formatted with commas
- [ ] Error state displays when API fails
- [ ] Data refreshes on window focus
- [ ] All four stat cards display correctly
- [ ] Responsive design works on mobile
- [ ] Statistics update after faculty CRUD operations

## Related Files

### Frontend
- `client/src/pages/admin-pages/AdminDashboard.jsx`
- `client/src/components/admin-components/dashboard/DashboardStats.jsx`
- `client/src/hooks/admin-dashboard-hook/useDashboardStats.js`
- `client/src/services/admin-dashboard-service/dashboardService.js`

### Backend
- `server/app/Http/Controllers/FacultyController.php`
- `server/app/Http/Controllers/StudentController.php`
- `server/routes/api.php`

## Notes

- The backend `FacultyController::statistics()` method uses `on_leave` (with underscore) in the database
- The frontend accesses it as `on_leave` to match the backend response
- All statistics are protected by authentication middleware
- The dashboard automatically updates when returning to the browser tab

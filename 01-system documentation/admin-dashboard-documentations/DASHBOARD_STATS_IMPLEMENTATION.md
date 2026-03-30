# Dashboard Statistics Implementation

## Overview
This document describes the implementation of dynamic dashboard statistics for the Admin Dashboard, specifically focusing on making the "Total Students" stat dynamic by fetching real-time data from the backend API.

## Architecture

### Backend (Laravel)
- **Endpoint**: `GET /api/students-statistics`
- **Controller**: `StudentController@statistics`
- **Authentication**: Required (JWT with status check)
- **Response Format**:
```json
{
  "success": true,
  "data": {
    "total_students": 1247,
    "active_students": 1156,
    "inactive_students": 68,
    "suspended_students": 23,
    "by_program": [...],
    "by_year_level": [...],
    "average_gpa": 3.45
  }
}
```

### Frontend (React)

#### Service Layer
**File**: `client/src/services/admin-dashboard-service/dashboardService.js`
- Handles API communication for dashboard statistics
- Uses axios instance with authentication
- Returns standardized response format

#### Hook Layer
**File**: `client/src/hooks/admin-dashboard-hook/useDashboardStats.js`
- Uses TanStack Query (React Query) for data fetching
- Implements caching with 5-minute stale time
- Automatic refetch on window focus
- Query key: `['dashboardStats']`

#### Component Layer
**File**: `client/src/components/admin-components/dashboard/DashboardStats.jsx`
- Displays dashboard statistics cards
- Shows loading state while fetching data
- Handles error states gracefully
- Formats numbers with commas for readability

#### Utility Layer
**File**: `client/src/utils/admin-utilities/admin-dashboard-utils/dashboardUtils.js`
- `formatDashboardNumber()`: Formats numbers with comma separators
- `calculatePercentageChange()`: Calculates percentage change between values
- `formatDashboardStats()`: Formats raw API data for display

## Features

### Dynamic Total Students
- Fetches real-time student count from database
- Updates automatically when data changes
- Shows loading state ("...") while fetching
- Displays formatted number with commas (e.g., "1,247")

### Error Handling
- Displays error message if API call fails
- Graceful fallback to "0" if data is unavailable
- Console logging for debugging

### Performance Optimization
- Data caching for 5 minutes (reduces API calls)
- Automatic refetch on window focus
- Efficient re-rendering with React Query

## Usage

### In Components
```jsx
import { useDashboardStats } from '../../hooks/admin-dashboard-hook';

const MyComponent = () => {
  const { data, isLoading, isError } = useDashboardStats();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading stats</div>;
  
  return <div>Total Students: {data.total_students}</div>;
};
```

### Utility Functions
```javascript
import { formatDashboardNumber, calculatePercentageChange } from '../../utils/admin-utilities/admin-dashboard-utils';

// Format number
const formatted = formatDashboardNumber(1247); // "1,247"

// Calculate change
const change = calculatePercentageChange(1247, 1112); // { percentage: "+12%", type: "increase" }
```

## File Structure
```
client/src/
├── services/
│   └── admin-dashboard-service/
│       ├── index.js
│       └── dashboardService.js
├── hooks/
│   └── admin-dashboard-hook/
│       ├── index.js
│       └── useDashboardStats.js
├── components/
│   └── admin-components/
│       └── dashboard/
│           └── DashboardStats.jsx
└── utils/
    └── admin-utilities/
        └── admin-dashboard-utils/
            ├── index.js
            └── dashboardUtils.js
```

## API Integration

### Request
```http
GET /api/students-statistics
Authorization: Bearer {token}
```

### Response
```json
{
  "success": true,
  "data": {
    "total_students": 1247,
    "active_students": 1156,
    "inactive_students": 68,
    "suspended_students": 23,
    "by_program": [
      { "program": "Computer Science", "count": 450 },
      { "program": "Information Technology", "count": 380 }
    ],
    "by_year_level": [
      { "year_level": "1st Year", "count": 320 },
      { "year_level": "2nd Year", "count": 310 }
    ],
    "average_gpa": 3.45
  }
}
```

## Future Enhancements

### Planned Features
1. Make other stats dynamic (Active Faculty, Profiles Completed, Pending Reviews)
2. Add real-time percentage change calculations
3. Implement historical data tracking for trend analysis
4. Add date range filters for statistics
5. Create detailed breakdown modals for each stat card

### Additional Statistics
- Students by program distribution
- Students by year level distribution
- Average GPA display
- Active vs inactive student ratio
- Monthly enrollment trends

## Testing

### Manual Testing
1. Navigate to Admin Dashboard
2. Verify "Total Students" shows loading state initially
3. Confirm number updates with real data from database
4. Test error handling by disconnecting from API
5. Verify number formatting (commas for thousands)

### Integration Points
- Ensure JWT authentication is working
- Verify CORS settings allow API requests
- Check that user has proper permissions
- Confirm database connection is active

## Troubleshooting

### Common Issues

**Issue**: Stats show "0" or "..."
- Check if user is authenticated
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure database has student records

**Issue**: Error message displayed
- Check network tab for failed requests
- Verify JWT token is valid
- Check Laravel logs for backend errors
- Ensure middleware is properly configured

**Issue**: Stats not updating
- Clear React Query cache
- Check staleTime configuration
- Verify refetchOnWindowFocus is enabled
- Force refresh the page

## Dependencies
- `@tanstack/react-query`: Data fetching and caching
- `axios`: HTTP client
- `react-icons`: Icon components

## Related Documentation
- [Student Profile Implementation](../student-profile-documentations/IMPLEMENTATION_SUMMARY.md)
- [User Management Guide](../user-management-documentations/USER_MANAGEMENT_GUIDE.md)
- [API Routes](../../server/routes/api.php)

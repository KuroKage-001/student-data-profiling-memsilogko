# Upcoming Events Display Fix

## Issue Summary
The Upcoming Events section in the Student Dashboard was not displaying any events, even though events existed in the database. The API was returning `{"success":true,"data":{"events":[]}}`.

## Root Cause
The issue was in `server/app/Http/Controllers/StudentDashboardController.php`. The `getUpcomingEvents()` method was filtering events by `status = 'active'`, but the Event model uses different status values:

**Actual Event Status Values:**
- `Upcoming`
- `Ongoing`
- `Completed`
- `Cancelled`

**Incorrect Filter Used:**
```php
->where('status', 'active')  // This status doesn't exist!
```

## Solution
Changed the status filter to match the actual status values used in the Event model:

### File: `server/app/Http/Controllers/StudentDashboardController.php`

#### 1. Fixed `getUpcomingEvents()` method (Line ~185-200)
```php
// BEFORE
$events = Event::where('date', '>=', Carbon::now())
    ->where('status', 'active')  // ❌ Wrong status
    ->orderBy('date', 'asc')
    ->limit(10)
    ->get(['id', 'title', 'description', 'date', 'time', 'location', 'type']);

// AFTER
$events = Event::where('date', '>=', Carbon::now())
    ->whereIn('status', ['Upcoming', 'Ongoing'])  // ✅ Correct statuses
    ->orderBy('date', 'asc')
    ->limit(10)
    ->get(['id', 'title', 'description', 'date', 'time', 'location', 'type']);
```

#### 2. Fixed `getDashboardStats()` method (Line ~55-57)
```php
// BEFORE
$upcomingEvents = Event::where('date', '>=', Carbon::now())
    ->where('status', 'active')  // ❌ Wrong status
    ->count();

// AFTER
$upcomingEvents = Event::where('date', '>=', Carbon::now())
    ->whereIn('status', ['Upcoming', 'Ongoing'])  // ✅ Correct statuses
    ->count();
```

## What Changed
1. **Status Filter**: Changed from `where('status', 'active')` to `whereIn('status', ['Upcoming', 'Ongoing'])`
2. **Logic**: Now correctly fetches events with status `Upcoming` or `Ongoing` that have dates in the future
3. **Consistency**: Aligns with the Event model's actual status values as defined in `EventController.php`

## Testing
After this fix, the Student Dashboard should now display:
- All upcoming events with status `Upcoming` or `Ongoing`
- Events sorted by date (earliest first)
- Maximum of 10 events
- Only events with dates >= current date

## API Endpoint
- **Endpoint**: `GET /api/student/upcoming-events`
- **Authentication**: Required (student role)
- **Response Format**:
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Event Title",
        "description": "Event Description",
        "date": "2026-05-01",
        "time": "09:00:00",
        "location": "Event Location",
        "type": "Academic"
      }
    ]
  }
}
```

## Related Files
- `server/app/Http/Controllers/StudentDashboardController.php` - Fixed
- `server/app/Http/Controllers/EventController.php` - Reference for status values
- `server/app/Models/Event.php` - Event model definition
- `client/src/components/student-components/student-dashboard-compo/UpcomingEvents.jsx` - Frontend component
- `client/src/hooks/useStudentDashboard.js` - React Query hook
- `client/src/services/student-dashboard-service/studentDashboardService.js` - API service

## Status Values Reference
For future reference, the Event model uses these status values:
- `Upcoming` - Event is scheduled for the future
- `Ongoing` - Event is currently happening
- `Completed` - Event has finished
- `Cancelled` - Event was cancelled

These are defined in the validation rules in `EventController.php`:
```php
'status' => 'in:Upcoming,Ongoing,Completed,Cancelled'
```

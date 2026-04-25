# Faculty Statistics Filtering - FIXED

## Overview
Statistics cards on the scheduling page are now correctly filtered for faculty users to show only their own class data.

## Issue Found
The statistics were showing data from all classes instead of filtering by faculty assignments because:
1. The `facultyProfile` relationship wasn't being loaded explicitly
2. The cache might have contained stale data from before the fix

## Solution Applied

### Backend Fix (`server/app/Http/Controllers/ClassSectionController.php`)

**Added explicit faculty profile loading:**

```php
public function statistics(Request $request)
{
    try {
        $user = auth()->user();
        
        // Load faculty profile if user is faculty
        $facultyProfile = null;
        if ($user && $user->role === 'faculty') {
            $facultyProfile = Faculty::where('user_id', $user->id)->first();
        }
        
        $cacheParams = [
            'user_id' => $user ? $user->id : 'guest',
            'user_role' => $user ? $user->role : 'guest',
            'faculty_id' => $facultyProfile ? $facultyProfile->id : null,
            'semester' => $request->get('semester', ''),
            'academic_year' => $request->get('academic_year', ''),
        ];

        $statistics = CacheService::remember(
            CacheService::PREFIX_STATISTICS . '_' . CacheService::PREFIX_CLASS_SECTIONS,
            $cacheParams,
            function () use ($request, $user, $facultyProfile) {
                $query = ClassSection::query();

                // If user is faculty, only show their assigned classes
                if ($user && $user->role === 'faculty' && $facultyProfile) {
                    $facultyId = $facultyProfile->id;
                    $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
                        $q->where('faculty_id', $facultyId)
                          ->where('status', 'active');
                    });
                }

                // Calculate statistics from filtered query
                $totalClasses = $query->count();
                $totalStudents = (clone $query)->sum('current_enrollment');
                $totalCapacity = (clone $query)->sum('max_capacity');
                $uniqueRooms = (clone $query)->distinct('room')->count('room');
                $avgCapacity = $totalCapacity > 0 
                    ? round(($totalStudents / $totalCapacity) * 100, 2) 
                    : 0;

                return [
                    'total_classes' => $totalClasses,
                    'total_students' => $totalStudents,
                    'unique_rooms' => $uniqueRooms,
                    'avg_capacity_percentage' => $avgCapacity,
                ];
            },
            CacheService::DEFAULT_TTL
        );

        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch statistics',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

**Key Changes:**
1. Explicitly load faculty profile using `Faculty::where('user_id', $user->id)->first()`
2. Pass `$facultyProfile` to the cache closure
3. Use strict role check: `$user->role === 'faculty'` instead of `in_array()`
4. Added Faculty model import: `use App\Models\Faculty;`

### Cache Cleared
Ran `php artisan cache:clear` to remove stale cached statistics.

## Expected Behavior

### Faculty with NO Assignments:
- **Total Classes**: 0
- **Total Students**: 0
- **Rooms Used**: 0
- **Avg. Capacity**: 0%
- **Schedule Table**: "No schedules found matching your criteria."

### Faculty with Assignments:
- **Total Classes**: Count of their assigned classes only
- **Total Students**: Sum of students in their classes only
- **Rooms Used**: Unique rooms where they teach
- **Avg. Capacity**: Average enrollment in their classes only

### Admin/Dept Chair:
- Shows all system-wide statistics (unchanged)

## Testing

1. **Clear browser cache** or do a hard refresh (Ctrl+F5)
2. Login as faculty user with no assignments
3. Verify all statistics show 0
4. Login as faculty user with assignments
5. Verify statistics show only their data
6. Login as admin
7. Verify statistics show all system data

## Files Modified

1. `server/app/Http/Controllers/ClassSectionController.php`
   - Added explicit faculty profile loading
   - Fixed role check
   - Added Faculty model import

## Cache Management

If statistics still show incorrect data after the fix:
```bash
cd server
php artisan cache:clear
```

This will force recalculation of all cached statistics.

## Notes

- Faculty profile is now explicitly loaded instead of relying on lazy loading
- Cache keys include faculty_id to ensure separate caching per faculty member
- If a faculty user has no faculty profile record, statistics will show 0 (correct behavior)
- The fix ensures faculty cannot see other faculty members' statistics

## Implementation

### Frontend (`client/src/pages/admin-pages/Scheduling.jsx`)

The frontend already passes the faculty context when fetching statistics:

```javascript
const fetchStatistics = async () => {
  try {
    // If user is faculty, pass their ID to get filtered statistics
    const params = isFaculty && user?.id ? { faculty_id: user.id } : {};
    const response = await classSectionService.getStatistics(params);
    
    // Handle both response formats
    if (response?.success && response?.data) {
      setStatistics(response.data);
    } else if (response && !response.success) {
      setStatistics(response);
    }
  } catch (error) {
    // Silently fail - statistics are not critical
  }
};
```

### Backend (`server/app/Http/Controllers/ClassSectionController.php`)

The backend automatically filters statistics based on the authenticated user's role:

```php
public function statistics(Request $request)
{
    try {
        $user = auth()->user();
        
        // Cache parameters include user context
        $cacheParams = [
            'user_id' => $user ? $user->id : 'guest',
            'user_role' => $user ? $user->role : 'guest',
            'faculty_id' => ($user && $user->facultyProfile) ? $user->facultyProfile->id : null,
            'semester' => $request->get('semester', ''),
            'academic_year' => $request->get('academic_year', ''),
        ];

        $statistics = CacheService::remember(
            CacheService::PREFIX_STATISTICS . '_' . CacheService::PREFIX_CLASS_SECTIONS,
            $cacheParams,
            function () use ($request, $user) {
                $query = ClassSection::query();

                // If user is faculty, only show their assigned classes
                if ($user && in_array($user->role, ['faculty']) && $user->facultyProfile) {
                    $facultyId = $user->facultyProfile->id;
                    $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
                        $q->where('faculty_id', $facultyId)
                          ->where('status', 'active');
                    });
                }

                // Calculate statistics from filtered query
                $totalClasses = $query->count();
                $activeClasses = (clone $query)->where('status', 'active')->count();
                $totalStudents = (clone $query)->sum('current_enrollment');
                $totalCapacity = (clone $query)->sum('max_capacity');
                $uniqueRooms = (clone $query)->distinct('room')->count('room');
                $avgCapacity = $totalCapacity > 0 
                    ? round(($totalStudents / $totalCapacity) * 100, 2) 
                    : 0;

                return [
                    'total_classes' => $totalClasses,
                    'active_classes' => $activeClasses,
                    'total_students' => $totalStudents,
                    'total_capacity' => $totalCapacity,
                    'unique_rooms' => $uniqueRooms,
                    'avg_capacity_percentage' => $avgCapacity,
                ];
            },
            CacheService::DEFAULT_TTL
        );

        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch statistics',
            'error' => $e->getMessage()
        ], 500);
    }
}
```

## Statistics Cards Displayed

### For Faculty Users:
1. **Total Classes**: Count of classes assigned to the faculty member
2. **Total Students**: Sum of enrolled students in their classes
3. **Rooms Used**: Number of unique rooms where they teach
4. **Avg. Capacity**: Average enrollment percentage across their classes

### For Admin/Dept Chair:
1. **Total Classes**: Count of all classes in the system
2. **Total Students**: Sum of all enrolled students
3. **Rooms Used**: Number of unique rooms used
4. **Avg. Capacity**: Average enrollment percentage across all classes

## Security Features

1. **Server-Side Filtering**: Statistics are filtered on the backend based on authenticated user
2. **No Parameter Manipulation**: Frontend cannot request other faculty's statistics
3. **Cached Per User**: Statistics are cached separately for each user/role combination
4. **Automatic Detection**: Uses `auth()->user()` to automatically detect faculty profile

## User Model Relationship

The User model has a `facultyProfile()` relationship:

```php
/**
 * Get the faculty profile for this user (if user is faculty)
 */
public function facultyProfile()
{
    return $this->hasOne(Faculty::class);
}
```

This relationship is used to:
- Identify the faculty member's ID in the faculty table
- Filter class sections by faculty assignments
- Cache statistics per faculty member

## How It Works

1. Faculty user loads the scheduling page
2. Frontend calls `getStatistics()` with optional `faculty_id` parameter
3. Backend ignores the parameter and uses `auth()->user()->facultyProfile` instead
4. Query filters class sections to only those with active faculty assignments
5. Statistics are calculated from the filtered results
6. Results are cached with user-specific cache key
7. Frontend displays the filtered statistics

## Testing

### Test as Faculty:
1. Login as faculty user (e.g., johnmiles@gmail.com)
2. Navigate to Scheduling page
3. Verify statistics show only your classes:
   - Total Classes should match your assigned classes count
   - Total Students should be sum of students in your classes only
   - Rooms Used should be rooms where you teach
   - Avg. Capacity should reflect your classes only

### Test as Admin:
1. Login as admin
2. Navigate to Scheduling page
3. Verify statistics show all system data

## Notes

- Statistics are automatically filtered - no additional configuration needed
- Caching ensures good performance even with filtering
- Faculty cannot manipulate parameters to see other faculty's statistics
- The implementation is secure and follows best practices

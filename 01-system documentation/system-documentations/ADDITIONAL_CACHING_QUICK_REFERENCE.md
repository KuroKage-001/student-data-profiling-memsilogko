# Additional Caching Quick Reference

## Quick Overview

This guide provides a quick reference for the server-side caching implementation in **User Management**, **Student Profiles**, **Events**, and **Research Materials** controllers.

## Cache Prefixes

```php
'users'              // UserManagementController
'students'           // StudentController
'events'             // EventController
'research_materials' // ResearchMaterialController
'statistics_users'   // User statistics
'statistics_students' // Student statistics
'statistics_events'  // Event statistics
```

## Cached Endpoints

### User Management
```bash
GET  /api/users                 # List users (cached)
GET  /api/users/{id}            # Show user (cached)
GET  /api/users/statistics      # User stats (cached)
POST /api/users                 # Create user (invalidates cache)
PUT  /api/users/{id}            # Update user (invalidates cache)
DELETE /api/users/{id}          # Delete user (invalidates cache)
```

### Student Profiles
```bash
GET  /api/students              # List students (cached)
GET  /api/students/{id}         # Show student (cached)
GET  /api/students/statistics   # Student stats (cached)
POST /api/students              # Create student (invalidates cache)
PUT  /api/students/{id}         # Update student (invalidates cache)
DELETE /api/students/{id}       # Delete student (invalidates cache)
```

### Events
```bash
GET  /api/events                # List events (cached)
GET  /api/events/{id}           # Show event (cached)
GET  /api/events/statistics     # Event stats (cached)
POST /api/events                # Create event (invalidates cache)
PUT  /api/events/{id}           # Update event (invalidates cache)
DELETE /api/events/{id}         # Delete event (invalidates cache)
```

### Research Materials
```bash
GET  /api/research-materials        # List materials (cached)
GET  /api/research-materials/{id}   # Show material (cached)
POST /api/research-materials        # Create material (invalidates cache)
PUT  /api/research-materials/{id}   # Update material (invalidates cache)
DELETE /api/research-materials/{id} # Delete material (invalidates cache)
```

## Cache Parameters by Controller

### UserManagementController
```php
[
    'search' => string,      // Search term
    'role' => string,        // Filter by role (admin, faculty, student, dept_chair)
    'status' => string,      // Filter by status (active, inactive, suspended)
    'sort_by' => string,     // Sort field
    'sort_order' => string,  // Sort direction (asc, desc)
    'per_page' => int,       // Items per page
    'page' => int,           // Current page
]
```

### StudentController
```php
[
    'search' => string,      // Search term
    'status' => string,      // Filter by status
    'year_level' => string,  // Filter by year level
    'program' => string,     // Filter by program
    'skills' => string,      // Filter by skills
    'activities' => string,  // Filter by activities
    'sort_by' => string,     // Sort field
    'sort_order' => string,  // Sort direction
    'per_page' => int,       // Items per page
    'page' => int,           // Current page
]
```

### EventController
```php
[
    'status' => string,      // Filter by status (Upcoming, Ongoing, Completed, Cancelled)
    'search' => string,      // Search term
    'start' => string,       // Start date (YYYY-MM-DD)
    'end' => string,         // End date (YYYY-MM-DD)
]
```

### ResearchMaterialController
```php
[
    'search' => string,         // Search term
    'department' => string,     // Filter by department
    'research_type' => string,  // Filter by research type
    'year' => string,           // Filter by publication year
    'status' => string,         // Filter by status
    'sort_by' => string,        // Sort field
    'sort_order' => string,     // Sort direction
    'per_page' => int,          // Items per page
    'page' => int,              // Current page
]
```

## Testing Commands

### Test Cache Hit/Miss

```bash
# First request (cache miss - slower)
curl -w "\nTime: %{time_total}s\n" \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/users

# Second request (cache hit - faster)
curl -w "\nTime: %{time_total}s\n" \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/users
```

### Check Cache Headers

```bash
# View response headers
curl -I -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/users

# Look for: X-Cache-Enabled: true
```

### Test Cache Invalidation

```bash
# 1. GET request (cache miss)
curl http://localhost:8000/api/users

# 2. GET request (cache hit - fast)
curl http://localhost:8000/api/users

# 3. POST request (invalidates cache)
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com",...}'

# 4. GET request (cache miss again - slower)
curl http://localhost:8000/api/users
```

## Manual Cache Management

### Clear Specific Cache

```php
// In Laravel Tinker or controller
use App\Services\CacheService;

// Clear users cache
CacheService::invalidate('users');

// Clear students cache
CacheService::invalidate('students');

// Clear events cache
CacheService::invalidate('events');

// Clear research materials cache
CacheService::invalidate('research_materials');
```

### Clear Cache with Statistics

```php
// Clear users and user statistics
CacheService::invalidateRelated('users');

// Clear students and student statistics
CacheService::invalidateRelated('students');

// Clear events and event statistics
CacheService::invalidateRelated('events');
```

### Clear All Cache

```php
// Clear entire application cache
CacheService::clearAll();
```

## Cache Response Headers

All cached responses include:

```
X-Cache-Enabled: true
```

This header indicates that caching is active for the endpoint.

## Cache TTL

- **Default:** 300 seconds (5 minutes)
- **Short:** 60 seconds (1 minute)
- **Long:** 3600 seconds (1 hour)

All implementations use the default TTL of 5 minutes.

## Common Issues & Solutions

### Issue: Cache not working
**Solution:** Check `.env` file for cache configuration:
```env
CACHE_DRIVER=database
```

### Issue: Stale data after update
**Solution:** Verify cache invalidation is called in mutation methods:
```php
CacheService::invalidateRelated('prefix');
```

### Issue: Cache headers not showing
**Solution:** Ensure response includes header:
```php
->header('X-Cache-Enabled', 'true')
```

### Issue: Different results for same query
**Solution:** Check cache parameters are consistent:
```php
$cacheParams = [
    'search' => $request->get('search', ''),  // Use default values
    'status' => $request->get('status', 'all'),
    // ...
];
```

## Performance Metrics

### Expected Results

| Metric | Before Caching | After Caching | Improvement |
|--------|---------------|---------------|-------------|
| Response Time | 200-500ms | 20-50ms | 90% faster |
| Database Queries | 5-10 queries | 0 queries | 100% reduction |
| Server Load | High | Low | 80% reduction |
| Concurrent Users | 50-100 | 500+ | 5x increase |

## Monitoring

### Check Cache Statistics

```php
use App\Services\CacheService;

$stats = CacheService::getStats();
// Returns: ['driver' => 'database', 'enabled' => true]
```

### View Cache Logs

```bash
# Monitor cache operations
tail -f storage/logs/laravel.log | grep -i cache

# View cache hits
tail -f storage/logs/laravel.log | grep "Cache remember"

# View cache invalidations
tail -f storage/logs/laravel.log | grep "Cache invalidated"
```

## Best Practices

1. ✅ **Always use cache parameters** - Include all query parameters in cache key
2. ✅ **Invalidate on mutations** - Clear cache after create/update/delete
3. ✅ **Use appropriate TTL** - Balance freshness vs performance
4. ✅ **Add cache headers** - Include X-Cache-Enabled for debugging
5. ✅ **Handle cache failures** - Graceful fallback to database
6. ✅ **Monitor cache performance** - Track hit rates and response times
7. ✅ **Clear related caches** - Use invalidateRelated() for statistics

## Quick Commands

```bash
# Clear application cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# View cache table
php artisan tinker
>>> DB::table('cache')->count()

# Clear specific cache entries
php artisan tinker
>>> use App\Services\CacheService;
>>> CacheService::invalidate('users');
```

## Related Documentation

- [Additional Caching Implementation](ADDITIONAL_CACHING_IMPLEMENTATION.md)
- [Additional Caching Complete Summary](../ADDITIONAL_CACHING_COMPLETE_SUMMARY.md)
- [Server Caching Implementation](../server/CACHING_IMPLEMENTATION.md)
- [Server Caching Quick Reference](../server/CACHING_QUICK_REFERENCE.md)

---

**Last Updated:** April 25, 2026
**Status:** ✅ Complete
**Controllers:** 4/4 (UserManagement, Student, Event, ResearchMaterial)

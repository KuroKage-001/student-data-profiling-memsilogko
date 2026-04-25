# Caching System Flow Diagrams

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  React Query Cache Layer                                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │Instructions  │  │Class Sections│  │Faculty       │        │ │
│  │  │Query Hook    │  │Query Hook    │  │Query Hook    │        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  │  - Stale time: 5 minutes                                       │ │
│  │  - Cache time: 10 minutes                                      │ │
│  │  - Background refetching                                       │ │
│  │  - Optimistic updates                                          │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
                          HTTP Request (GET/POST/PUT/DELETE)
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Laravel)                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Middleware Layer                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │CORS          │→ │Auth          │→ │CacheResponse │        │ │
│  │  │Middleware    │  │Middleware    │  │Middleware    │        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  │                                              ↓                  │ │
│  │                                    Check if GET request         │ │
│  │                                              ↓                  │ │
│  │                                    Generate cache key           │ │
│  │                                    (user + params)              │ │
│  │                                              ↓                  │ │
│  │                                    Check cache                  │ │
│  │                                              ↓                  │ │
│  │                                    ┌─────────┴─────────┐       │ │
│  │                                    │                   │       │ │
│  │                                 Cache HIT          Cache MISS  │ │
│  │                                    │                   │       │ │
│  │                              Return cached      Continue to    │ │
│  │                              response           controller     │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                        ↓              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Controller Layer                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │Instruction   │  │ClassSection  │  │Faculty       │        │ │
│  │  │Controller    │  │Controller    │  │Controller    │        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  │         ↓                  ↓                  ↓                │ │
│  │    Uses CacheService  Uses CacheService  Uses CacheService    │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  CacheService                                                  │ │
│  │  - remember(prefix, params, callback, ttl)                     │ │
│  │  - invalidate(prefix)                                          │ │
│  │  - invalidateRelated(prefix)                                   │ │
│  │  - forget(prefix, params)                                      │ │
│  │  - clearAll()                                                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Laravel Cache Facade                                          │ │
│  │  - Database Driver (default)                                   │ │
│  │  - Redis Driver (optional)                                     │ │
│  │  - Memcached Driver (optional)                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Cache Storage                                                 │ │
│  │  ┌──────────────┐                                              │ │
│  │  │cache table   │  Key: instructions:abc123...                 │ │
│  │  │              │  Value: JSON data                            │ │
│  │  │              │  Expiration: timestamp                       │ │
│  │  └──────────────┘                                              │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                    ↓                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Database (MySQL)                                              │ │
│  │  - instructions table                                          │ │
│  │  - class_sections table                                        │ │
│  │  - faculty table                                               │ │
│  │  - Only queried on cache miss                                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## GET Request Flow (Cache Hit)

```
User Action
    ↓
Frontend Component
    ↓
React Query Hook
    ↓
Check Frontend Cache
    ↓
Cache MISS → HTTP GET Request
    ↓
Laravel API Endpoint
    ↓
CacheResponse Middleware
    ↓
Generate Cache Key
(user_id:123:role:admin:params:abc)
    ↓
Check Backend Cache
    ↓
Cache HIT ✅
    ↓
Return Cached Response
(X-Cache-Status: HIT)
    ↓
React Query Updates
    ↓
Component Re-renders
    ↓
User Sees Data

Total Time: ~20-50ms
Database Queries: 0
```

## GET Request Flow (Cache Miss)

```
User Action
    ↓
Frontend Component
    ↓
React Query Hook
    ↓
Check Frontend Cache
    ↓
Cache MISS → HTTP GET Request
    ↓
Laravel API Endpoint
    ↓
CacheResponse Middleware
    ↓
Generate Cache Key
(user_id:123:role:admin:params:abc)
    ↓
Check Backend Cache
    ↓
Cache MISS ❌
    ↓
Controller Method
    ↓
CacheService::remember()
    ↓
Execute Database Query
    ↓
Store Result in Cache
(TTL: 300 seconds)
    ↓
Return Response
(X-Cache-Status: MISS)
    ↓
React Query Caches Result
    ↓
Component Re-renders
    ↓
User Sees Data

Total Time: ~200-500ms
Database Queries: 5-10
```

## POST/PUT/DELETE Request Flow (Cache Invalidation)

```
User Action (Create/Update/Delete)
    ↓
Frontend Component
    ↓
React Query Mutation
    ↓
HTTP POST/PUT/DELETE Request
    ↓
Laravel API Endpoint
    ↓
Auth Middleware
    ↓
Controller Method
    ↓
Validate Request
    ↓
Database Operation
(Create/Update/Delete)
    ↓
CacheService::invalidate()
or
CacheService::invalidateRelated()
    ↓
Clear Backend Cache
(All related cache entries)
    ↓
Return Success Response
    ↓
React Query Invalidates
Frontend Cache
    ↓
Automatic Refetch
    ↓
Component Re-renders
    ↓
User Sees Updated Data

Cache Status: Cleared ✅
Next GET: Cache MISS
```

## User-Specific Caching Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Admin User Request                                          │
│  GET /api/faculty                                            │
│  Cache Key: faculty:hash:user_123:admin:all                 │
│  Result: All faculty members                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Dept Chair Request                                          │
│  GET /api/faculty                                            │
│  Cache Key: faculty:hash:user_456:dept_chair:IT             │
│  Result: Only IT department faculty                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Faculty User Request                                        │
│  GET /api/class-sections                                     │
│  Cache Key: class_sections:hash:user_789:faculty:fac_101    │
│  Result: Only assigned classes                               │
└─────────────────────────────────────────────────────────────┘

Each user gets their own cache entry!
```

## Cache Invalidation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Single Resource Invalidation                                │
│                                                               │
│  POST /api/instructions                                       │
│         ↓                                                     │
│  CacheService::invalidate('instructions')                    │
│         ↓                                                     │
│  Clear all cache entries with prefix 'instructions'          │
│         ↓                                                     │
│  Cache entries cleared:                                       │
│  - instructions:hash1:user_123:admin:all                     │
│  - instructions:hash2:user_456:admin:search_syllabus         │
│  - instructions:hash3:user_789:faculty:all                   │
│  - ... (all instruction cache entries)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Related Resource Invalidation                               │
│                                                               │
│  POST /api/faculty                                            │
│         ↓                                                     │
│  CacheService::invalidateRelated('faculty')                  │
│         ↓                                                     │
│  Clear 'faculty' AND 'statistics_faculty' cache              │
│         ↓                                                     │
│  Cache entries cleared:                                       │
│  - faculty:*                                                  │
│  - statistics_faculty:*                                       │
└─────────────────────────────────────────────────────────────┘
```

## Cache Key Generation

```
┌─────────────────────────────────────────────────────────────┐
│  Cache Key Components                                        │
│                                                               │
│  1. Resource Prefix                                          │
│     - instructions                                            │
│     - class_sections                                          │
│     - faculty                                                 │
│     - statistics                                              │
│                                                               │
│  2. Parameters Hash (MD5)                                     │
│     - search: "syllabus"                                      │
│     - type: "curriculum"                                      │
│     - department: "IT"                                        │
│     - sort_by: "created_at"                                   │
│     → MD5: abc123def456...                                    │
│                                                               │
│  3. User Context                                              │
│     - user_id: 123                                            │
│     - role: admin                                             │
│     - department: IT (for dept_chair)                         │
│                                                               │
│  Final Key:                                                   │
│  instructions:abc123def456:123:admin:IT                      │
└─────────────────────────────────────────────────────────────┘
```

## Cache TTL Timeline

```
Time: 0s
│
│  Cache Entry Created
│  TTL: 300 seconds (5 minutes)
│
├─ 60s  ─ Still valid (4 min remaining)
│
├─ 120s ─ Still valid (3 min remaining)
│
├─ 180s ─ Still valid (2 min remaining)
│
├─ 240s ─ Still valid (1 min remaining)
│
├─ 300s ─ EXPIRED ❌
│         Next request will be cache MISS
│         New cache entry will be created
│
└─ 360s ─ New cache entry (if requested)
          TTL: 300 seconds
```

## Performance Comparison

```
┌─────────────────────────────────────────────────────────────┐
│  WITHOUT CACHING                                             │
│                                                               │
│  Request 1: 450ms (DB queries: 8)                            │
│  Request 2: 420ms (DB queries: 8)                            │
│  Request 3: 480ms (DB queries: 8)                            │
│  Request 4: 440ms (DB queries: 8)                            │
│  Request 5: 460ms (DB queries: 8)                            │
│                                                               │
│  Average: 450ms                                               │
│  Total DB Queries: 40                                         │
│  Server Load: HIGH                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  WITH CACHING                                                │
│                                                               │
│  Request 1: 450ms (DB queries: 8) [MISS]                     │
│  Request 2:  35ms (DB queries: 0) [HIT] ✅                   │
│  Request 3:  30ms (DB queries: 0) [HIT] ✅                   │
│  Request 4:  40ms (DB queries: 0) [HIT] ✅                   │
│  Request 5:  32ms (DB queries: 0) [HIT] ✅                   │
│                                                               │
│  Average: 117ms (74% faster)                                 │
│  Total DB Queries: 8 (80% reduction)                         │
│  Server Load: LOW                                             │
│  Cache Hit Rate: 80%                                          │
└─────────────────────────────────────────────────────────────┘
```

## Cache Monitoring Dashboard (Conceptual)

```
┌─────────────────────────────────────────────────────────────┐
│  CACHE STATISTICS                                            │
│                                                               │
│  Total Requests:        10,000                               │
│  Cache Hits:             8,500 (85%)  ████████████████░░    │
│  Cache Misses:           1,500 (15%)  ███░░░░░░░░░░░░░░░    │
│                                                               │
│  Average Response Time:                                       │
│  - Cache Hit:              35ms  ██░░░░░░░░░░░░░░░░░░░░     │
│  - Cache Miss:            450ms  ████████████████████████   │
│                                                               │
│  Database Queries Saved: 68,000                              │
│  Server Load Reduction:     85%                              │
│                                                               │
│  Cache by Resource:                                           │
│  - Instructions:        3,200 entries                         │
│  - Class Sections:      2,800 entries                         │
│  - Faculty:             1,500 entries                         │
│  - Statistics:            500 entries                         │
│                                                               │
│  Cache Size:              125 MB                              │
│  Memory Usage:             45%                                │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Issue: Cache Not Working                                    │
│                                                               │
│  Step 1: Check cache configuration                           │
│  → php artisan config:show cache                             │
│                                                               │
│  Step 2: Clear all caches                                    │
│  → php artisan cache:clear                                   │
│  → php artisan config:clear                                  │
│  → php artisan route:clear                                   │
│                                                               │
│  Step 3: Verify cache table exists                           │
│  → SELECT * FROM cache;                                       │
│                                                               │
│  Step 4: Check cache headers in response                     │
│  → curl -I http://api/endpoint                               │
│  → Look for X-Cache-Status header                            │
│                                                               │
│  Step 5: Review logs                                          │
│  → tail -f storage/logs/laravel.log                          │
│                                                               │
│  Step 6: Test manually                                        │
│  → Make same request twice                                    │
│  → Second should be faster                                    │
└─────────────────────────────────────────────────────────────┘
```

This visual guide helps understand the complete caching flow from frontend to backend and back!

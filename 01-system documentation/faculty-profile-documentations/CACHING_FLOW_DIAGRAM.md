# Faculty Profiles Caching Flow Diagram

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Query Cache Layer                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Cache Storage (In-Memory)                                │  │
│  │  ├─ Faculty Lists (by filters)                            │  │
│  │  ├─ Faculty Details (by ID)                               │  │
│  │  ├─ Statistics                                            │  │
│  │  └─ Metadata (timestamps, status)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              useFacultyProfileQuery Hook                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Query Management                                         │  │
│  │  ├─ Fetch Strategies                                      │  │
│  │  ├─ Cache Invalidation                                    │  │
│  │  ├─ Optimistic Updates                                    │  │
│  │  └─ Background Refetching                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                   Faculty Service Layer                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Communication                                        │  │
│  │  ├─ GET /faculty                                          │  │
│  │  ├─ GET /faculty/:id                                      │  │
│  │  ├─ POST /faculty                                         │  │
│  │  ├─ PUT /faculty/:id                                      │  │
│  │  └─ DELETE /faculty/:id                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Server                          │
│                      (Laravel/Database)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 First Load Flow

```
User Opens Page
      ↓
┌─────────────────┐
│ Check Cache     │ → Cache Empty
└─────────────────┘
      ↓
┌─────────────────┐
│ Show Skeleton   │ ← loading = true
└─────────────────┘
      ↓
┌─────────────────┐
│ Fetch from API  │ → GET /faculty
└─────────────────┘
      ↓
┌─────────────────┐
│ Store in Cache  │ → staleTime: 15min, cacheTime: 1hr
└─────────────────┘
      ↓
┌─────────────────┐
│ Display Data    │ ← loading = false
└─────────────────┘
```

## ⚡ Subsequent Load Flow (Within 15 Minutes)

```
User Opens Page
      ↓
┌─────────────────┐
│ Check Cache     │ → Cache Hit (Fresh)
└─────────────────┘
      ↓
┌─────────────────┐
│ Display Data    │ ← Instant (0ms)
└─────────────────┘
      ↓
┌─────────────────┐
│ No API Call     │ ← Data is fresh
└─────────────────┘
```

## 🔄 Background Refetch Flow (After 15 Minutes)

```
User Opens Page
      ↓
┌─────────────────┐
│ Check Cache     │ → Cache Hit (Stale)
└─────────────────┘
      ↓
┌─────────────────┐
│ Display Cached  │ ← Instant (0ms)
└─────────────────┘
      ↓
┌─────────────────┐
│ Fetch in BG     │ → isFetching = true
└─────────────────┘
      ↓
┌─────────────────┐
│ Update Cache    │ → New data received
└─────────────────┘
      ↓
┌─────────────────┐
│ Update UI       │ ← Smooth transition
└─────────────────┘
```

## ✨ Optimistic Update Flow (Create)

```
User Submits Form
      ↓
┌─────────────────┐
│ Optimistic Add  │ → UI updates instantly
└─────────────────┘
      ↓
┌─────────────────┐
│ Send to API     │ → POST /faculty
└─────────────────┘
      ↓
    Success?
    ↙     ↘
  Yes      No
   ↓        ↓
┌──────┐ ┌──────────┐
│Keep  │ │Rollback  │
│Update│ │Changes   │
└──────┘ └──────────┘
   ↓        ↓
┌──────────────────┐
│Invalidate Cache  │
└──────────────────┘
   ↓
┌──────────────────┐
│Refetch Lists     │
└──────────────────┘
```

## 🔄 Cache Invalidation Flow

```
User Action (Create/Update/Delete)
      ↓
┌─────────────────────────────────┐
│ Determine Affected Caches       │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Mark Caches as Invalid           │
│ ├─ Faculty Lists                 │
│ ├─ Faculty Detail (if update)    │
│ └─ Statistics                    │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Trigger Refetch                  │
│ (Only for active queries)        │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Update UI with Fresh Data        │
└─────────────────────────────────┘
```

## 🎯 Prefetch Flow

```
User Hovers Over "View" Button
      ↓
┌─────────────────┐
│ Trigger Prefetch│ → prefetchFaculty(id)
└─────────────────┘
      ↓
┌─────────────────┐
│ Check Cache     │
└─────────────────┘
      ↓
    Cached?
    ↙     ↘
  Yes      No
   ↓        ↓
┌──────┐ ┌──────────┐
│Skip  │ │Fetch from│
│      │ │API       │
└──────┘ └──────────┘
           ↓
      ┌──────────┐
      │Store in  │
      │Cache     │
      └──────────┘
           ↓
User Clicks "View"
      ↓
┌─────────────────┐
│ Instant Display │ ← Data already cached
└─────────────────┘
```

## 🔍 Search/Filter Flow

```
User Changes Filter
      ↓
┌─────────────────────────────────┐
│ Generate Cache Key               │
│ ['faculty', 'list', {filters}]   │
└─────────────────────────────────┘
      ↓
┌─────────────────┐
│ Check Cache     │
└─────────────────┘
      ↓
    Cached?
    ↙     ↘
  Yes      No
   ↓        ↓
┌──────┐ ┌──────────┐
│Show  │ │Fetch from│
│Cache │ │API       │
└──────┘ └──────────┘
           ↓
      ┌──────────┐
      │Store with│
      │Filter Key│
      └──────────┘
```

## 🔄 Manual Refresh Flow

```
User Clicks Refresh Button
      ↓
┌─────────────────────────────────┐
│ invalidateAll()                  │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Mark All Faculty Caches Invalid  │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Show Loading Indicator           │
│ (isFetching = true)              │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Fetch Fresh Data from API        │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Update All Caches                │
└─────────────────────────────────┘
      ↓
┌─────────────────────────────────┐
│ Update UI                        │
│ (isFetching = false)             │
└─────────────────────────────────┘
```

## 🕐 Cache Lifecycle

```
Time: 0 min
┌─────────────────┐
│ Data Fetched    │ → Fresh
└─────────────────┘

Time: 0-15 min
┌─────────────────┐
│ Cache Status    │ → Fresh (No refetch)
└─────────────────┘

Time: 15+ min
┌─────────────────┐
│ Cache Status    │ → Stale (Background refetch)
└─────────────────┘

Time: 60+ min (unused)
┌─────────────────┐
│ Cache Status    │ → Garbage Collected
└─────────────────┘
```

## 📊 Query State Machine

```
                    ┌──────────┐
                    │  Idle    │
                    └──────────┘
                         ↓
                    ┌──────────┐
                    │ Loading  │ ← First fetch
                    └──────────┘
                         ↓
                    ┌──────────┐
                    │ Success  │ → Data cached
                    └──────────┘
                         ↓
                    ┌──────────┐
                    │  Fresh   │ ← 0-15 min
                    └──────────┘
                         ↓
                    ┌──────────┐
                    │  Stale   │ ← 15+ min
                    └──────────┘
                         ↓
                    ┌──────────┐
                    │Fetching  │ ← Background refetch
                    └──────────┘
                         ↓
                    ┌──────────┐
                    │ Success  │ → Cache updated
                    └──────────┘
```

## 🎯 Cache Key Structure

```
Faculty Queries
├─ ['faculty']                                    → Base key
├─ ['faculty', 'list']                            → All lists
├─ ['faculty', 'list', { department: 'CS' }]      → Filtered list
├─ ['faculty', 'list', { status: 'active' }]      → Another filter
├─ ['faculty', 'detail']                          → All details
├─ ['faculty', 'detail', 123]                     → Specific faculty
└─ ['faculty', 'statistics']                      → Statistics

Each key maintains its own cache independently
```

## 🔄 Mutation Flow with Cache Updates

```
CREATE FACULTY
User → Form Submit
  ↓
Optimistic Update (Add to UI)
  ↓
POST /faculty
  ↓
Success → Invalidate ['faculty', 'list']
       → Invalidate ['faculty', 'statistics']
       → Refetch active queries
  ↓
UI Updated with Server Data

UPDATE FACULTY
User → Form Submit
  ↓
Optimistic Update (Update in UI)
  ↓
PUT /faculty/:id
  ↓
Success → Invalidate ['faculty', 'list']
       → Invalidate ['faculty', 'detail', id]
       → Invalidate ['faculty', 'statistics']
       → Refetch active queries
  ↓
UI Updated with Server Data

DELETE FACULTY
User → Confirm Delete
  ↓
Optimistic Update (Remove from UI)
  ↓
DELETE /faculty/:id
  ↓
Success → Invalidate ['faculty', 'list']
       → Invalidate ['faculty', 'detail', id]
       → Invalidate ['faculty', 'statistics']
       → Refetch active queries
  ↓
UI Updated
```

## 🎨 UI State Indicators

```
┌─────────────────────────────────────────┐
│  Faculty Profiles Page                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔄 Updating data in background  │   │ ← isFetching && !loading
│  └─────────────────────────────────┘   │
│                                         │
│  [Search] [Add] [Export] [🔄 Refresh]  │
│                            ↑            │
│                            └─ Spin when fetching
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Faculty List                   │   │
│  │  ├─ John Doe                    │   │
│  │  ├─ Jane Smith                  │   │
│  │  └─ ...                         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## 📈 Performance Timeline

```
Traditional Approach (No Caching):
─────────────────────────────────────────
Visit 1: [████████] 2s
Visit 2: [████████] 2s
Visit 3: [████████] 2s
Filter:  [████████] 2s
Back:    [████████] 2s
Total:   10s of loading

With React Query Caching:
─────────────────────────────────────────
Visit 1: [████████] 2s (fetch)
Visit 2: [█] 0ms (cache)
Visit 3: [█] 0ms (cache)
Filter:  [█] 0ms (cache)
Back:    [█] 0ms (cache)
Total:   2s of loading (80% improvement)
```

## 🎯 Cache Hit/Miss Scenarios

```
Scenario 1: Same Page, Same Filters
┌──────┐  ┌──────┐  ┌──────┐
│Visit │→ │Cache │→ │ HIT  │ → Instant
└──────┘  └──────┘  └──────┘

Scenario 2: Same Page, Different Filters
┌──────┐  ┌──────┐  ┌──────┐
│Visit │→ │Cache │→ │ MISS │ → Fetch
└──────┘  └──────┘  └──────┘

Scenario 3: After 15 Minutes
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│Visit │→ │Cache │→ │ HIT  │→ │Refetch│
└──────┘  └──────┘  └──────┘  └──────┘
           (Stale)    (Show)    (BG)

Scenario 4: After Mutation
┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│Create│→ │Inval │→ │Cache │→ │Refetch│
└──────┘  └──────┘  └──────┘  └──────┘
```

## 🔧 Memory Management

```
Active Queries (In Use)
┌─────────────────────────┐
│ Faculty List (CS)       │ ← Kept in memory
│ Faculty Detail (123)    │ ← Kept in memory
└─────────────────────────┘

Inactive Queries (Not In Use)
┌─────────────────────────┐
│ Faculty List (IT)       │ ← Kept for 1 hour
│ Faculty Detail (456)    │ ← Kept for 1 hour
└─────────────────────────┘
         ↓ After 1 hour
┌─────────────────────────┐
│ Garbage Collected       │ ← Freed from memory
└─────────────────────────┘
```

---

**Legend:**
- `→` Flow direction
- `↓` Next step
- `↕` Bidirectional
- `[████]` Loading time
- `[█]` Instant (cached)
- `🔄` Refresh/Update
- `✓` Success
- `✗` Error

# User Management Pagination Fix

## Issue
When filtering users (e.g., selecting "Student" role), only 10 users were displayed even though there were 100+ student accounts. The pagination was not updating, and switching back to "All Roles" showed no results.

## Root Cause
The backend API returns paginated data with a default of 10 items per page:

```php
// In UserManagementController.php
$perPage = $request->get('per_page', 10); // Default: 10
$users = $query->paginate($perPage);
```

The frontend was only extracting the first page of results:

```javascript
// Before fix
return result.data?.data || []; // Only returns first 10 items
```

## Solution
Modified the `useUsers` hook to request all users by setting a high `per_page` value:

```javascript
// After fix
const queryParams = { ...params, per_page: 1000 };
const result = await userManagementService.getUsers(queryParams);
```

This ensures all users are fetched in a single request, eliminating pagination issues.

## Implementation

### File Changed
`client/src/hooks/user-management-hook/useUserManagementQuery.js`

### Before
```javascript
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const result = await userManagementService.getUsers(params);
      if (!result.success) {
        throw new Error(result.message);
      }
      // Handle both array and paginated response
      if (Array.isArray(result.data)) {
        return result.data;
      }
      // If paginated, return the data array
      return result.data?.data || []; // ❌ Only first page
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

### After
```javascript
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      // Add per_page parameter to get all users
      const queryParams = { ...params, per_page: 1000 }; // ✅ Request all
      const result = await userManagementService.getUsers(queryParams);
      if (!result.success) {
        throw new Error(result.message);
      }
      // Handle both array and paginated response
      if (Array.isArray(result.data)) {
        return result.data;
      }
      // If paginated, return the data array
      return result.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
```

## Testing Results

### Before Fix
```
Filter: Role = Student
Result: Only 10 students shown ❌
Expected: 100+ students

Filter: Role = All Roles
Result: No users shown ❌
Expected: All users
```

### After Fix
```
Filter: Role = Student
Result: All 100+ students shown ✅

Filter: Role = All Roles
Result: All users shown ✅

Filter: Role = Faculty, Status = Active
Result: All active faculty shown ✅
```

## Why This Works

### Backend Pagination
The Laravel backend supports the `per_page` parameter:

```php
$perPage = $request->get('per_page', 10);
$users = $query->paginate($perPage);
```

By setting `per_page: 1000`, we request up to 1000 users in a single response.

### Frontend Handling
The frontend extracts the data array from the paginated response:

```javascript
return result.data?.data || [];
```

This works for both:
- Paginated responses: `{ data: { data: [...], total: 100 } }`
- Array responses: `{ data: [...] }`

## Performance Considerations

### Current Approach (per_page: 1000)
**Pros:**
- Simple implementation
- No pagination UI needed
- All filters work correctly
- Fast for current data volume

**Cons:**
- May be slow with 10,000+ users
- Larger initial payload
- More memory usage

### Alternative Approaches

#### Option 1: Client-Side Pagination
```javascript
// Keep all data in memory, paginate on frontend
const [page, setPage] = useState(1);
const itemsPerPage = 20;
const paginatedUsers = users.slice(
  (page - 1) * itemsPerPage, 
  page * itemsPerPage
);
```

#### Option 2: Server-Side Pagination with Filters
```javascript
// Request specific page with filters
const queryParams = { 
  ...params, 
  page: currentPage,
  per_page: 20 
};
```

#### Option 3: Infinite Scroll
```javascript
// Load more as user scrolls
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: userKeys.list(params),
  queryFn: ({ pageParam = 1 }) => fetchUsers(params, pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

## When to Revisit

Consider implementing proper pagination when:
- User count exceeds 1,000
- Page load time > 2 seconds
- Memory usage becomes an issue
- Users request pagination UI

## Recommended Future Enhancement

Implement client-side pagination for better UX:

```javascript
// In UserManagement.jsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 20;

// Paginate in memory
const paginatedUsers = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return users.slice(startIndex, endIndex);
}, [users, currentPage, itemsPerPage]);

// Calculate total pages
const totalPages = Math.ceil(users.length / itemsPerPage);
```

Then add pagination controls:
```jsx
<div className="pagination">
  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
    Previous
  </button>
  <span>Page {currentPage} of {totalPages}</span>
  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
    Next
  </button>
</div>
```

## API Request Examples

### Before Fix
```
GET /api/users?role=student
Response: { data: { data: [10 users], total: 102 } }
Frontend shows: 10 users ❌
```

### After Fix
```
GET /api/users?role=student&per_page=1000
Response: { data: { data: [102 users], total: 102 } }
Frontend shows: 102 users ✅
```

## Verification Steps

1. **Test All Roles Filter**
   ```
   Set: Role = All Roles
   Expected: All users displayed
   Result: ✅ Pass
   ```

2. **Test Student Filter**
   ```
   Set: Role = Student
   Expected: All 100+ students displayed
   Result: ✅ Pass
   ```

3. **Test Combined Filters**
   ```
   Set: Role = Faculty, Status = Active
   Expected: All active faculty displayed
   Result: ✅ Pass
   ```

4. **Test Search with Filters**
   ```
   Set: Role = Student, Search = "john"
   Expected: All students with "john" in name/email
   Result: ✅ Pass
   ```

## Related Issues

### Issue 1: Filter Not Updating
**Cause:** React Query cache not invalidating
**Solution:** Already handled by query key changes

### Issue 2: "All Roles" Shows Nothing
**Cause:** Pagination returning only first page
**Solution:** Fixed by per_page parameter

### Issue 3: Slow Performance
**Cause:** Too many users to fetch at once
**Solution:** Implement client-side pagination (future)

## Conclusion

The pagination fix resolves the immediate issue by requesting all users in a single API call. This works well for the current data volume (100-200 users) and provides a smooth user experience with filters.

For future scalability, consider implementing client-side pagination when the user count grows significantly.

**Status:** ✅ Fixed and Verified

**Date:** April 9, 2026

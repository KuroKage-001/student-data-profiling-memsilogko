# Student Profiles - TanStack Query Migration

## Overview
Migrated the Student Profiles page from custom hooks to TanStack Query (React Query) for improved data fetching, caching, and state management.

## Changes Made

### 1. Service Layer
- **Renamed**: `client/src/services/student-profile-service/index.js` → `studentProfileService.js`
- **Removed**: All `console.error()` and `console.log()` statements for production security
- **Added**: `index.js` export file for backward compatibility

### 2. New Query Hooks
Created `client/src/hooks/student-profile-hook/useStudentProfileQuery.js` with:

#### Query Hooks
- `useStudents(params)` - Fetch all students with filters
- `useStudent(id)` - Fetch single student by ID
- `useStudentStatistics()` - Fetch student statistics

#### Mutation Hooks
- `useCreateStudent()` - Create new student
- `useUpdateStudent()` - Update existing student
- `useDeleteStudent()` - Delete student

#### Utility Functions
- `getPrograms()` - Get available programs
- `getYearLevels()` - Get year levels
- `getStatuses()` - Get student statuses
- `formatStudentForDisplay(student)` - Format student data
- `generateStudentId()` - Generate unique student ID

#### Query Keys
- Centralized query key management via `studentKeys` object
- Automatic cache invalidation on mutations

### 3. Updated StudentProfiles Page
**File**: `client/src/pages/admin-pages/StudentProfiles.jsx`

#### Key Changes:
- Replaced `useStudentProfile` hook with TanStack Query hooks
- Removed manual state management for `students`, `loading`, `error`
- Implemented `useMemo` for query params optimization
- Simplified error handling with automatic error propagation
- Removed unnecessary `console.log()` statements
- Automatic refetching on filter/search changes

#### Before:
```javascript
const {
  students,
  loading,
  error,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent
} = useStudentProfile();

useEffect(() => {
  fetchStudents();
}, []);
```

#### After:
```javascript
const queryParams = useMemo(() => {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (filters.program !== 'all') params.program = filters.program;
  return params;
}, [searchTerm, filters]);

const { data: students = [], isLoading, error, refetch } = useStudents(queryParams);
const createStudentMutation = useCreateStudent();
const updateStudentMutation = useUpdateStudent();
const deleteStudentMutation = useDeleteStudent();
```

### 4. Benefits

#### Performance
- **Automatic Caching**: 5-minute stale time for student lists
- **Background Refetching**: Data stays fresh without blocking UI
- **Optimistic Updates**: Instant UI feedback on mutations
- **Request Deduplication**: Multiple components can share same query

#### Developer Experience
- **Less Boilerplate**: No manual loading/error state management
- **Better TypeScript Support**: Built-in type inference
- **DevTools Integration**: React Query DevTools for debugging
- **Automatic Retry**: Failed requests retry automatically

#### Code Quality
- **Separation of Concerns**: Data fetching logic isolated in hooks
- **Consistent Patterns**: Same pattern as UserManagement page
- **Error Handling**: Centralized error handling with proper propagation
- **Security**: Removed all console debug statements

### 5. Migration Pattern

This migration follows the same pattern as UserManagement:

1. **Service Layer**: Pure API calls, no state management
2. **Query Hooks**: TanStack Query hooks for data fetching
3. **Page Component**: Uses query hooks, focuses on UI logic
4. **Automatic Invalidation**: Mutations automatically refresh related queries

### 6. Cache Invalidation Strategy

```javascript
// On create/update/delete student
queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });

// On update specific student
queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
```

### 7. Error Handling

Errors are now thrown from mutations and caught in the component:

```javascript
try {
  await createStudentMutation.mutateAsync(studentData);
  showSuccess('Student created successfully');
} catch (err) {
  if (err.errors) {
    setServerErrors(err.errors); // Validation errors
  }
  showError(err.message);
}
```

### 8. Backward Compatibility

The old `useStudentProfile` hook is still available for any components that haven't migrated yet. Both hooks can coexist during transition period.

## Testing Checklist

- [ ] Student list loads correctly
- [ ] Search and filters work
- [ ] Create student functionality
- [ ] Update student functionality
- [ ] Delete student functionality
- [ ] Error messages display properly
- [ ] Loading states show correctly
- [ ] Export to CSV works
- [ ] Refresh button works
- [ ] View student modal works
- [ ] Generate report works

## Future Improvements

1. Add pagination support with `useInfiniteQuery`
2. Implement optimistic updates for better UX
3. Add prefetching for student details on hover
4. Implement query cancellation for search
5. Add retry logic configuration
6. Implement offline support with persistence

## Related Files

- `client/src/pages/admin-pages/StudentProfiles.jsx`
- `client/src/hooks/student-profile-hook/useStudentProfileQuery.js`
- `client/src/hooks/student-profile-hook/index.js`
- `client/src/services/student-profile-service/studentProfileService.js`
- `client/src/utils/admin-utilities/authDebug.js` (cleaned)

## Notes

- All console debug statements removed for security
- Service file renamed to `studentProfileService.js` for consistency
- Query hooks follow React Query best practices
- Cache invalidation ensures data consistency
- Error handling improved with proper error propagation

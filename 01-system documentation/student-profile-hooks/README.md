# Student Profile Hooks Documentation

## Overview
This directory contains documentation for the consolidated student profile hooks system. All student profile hooks have been consolidated into a single file for better maintainability and simpler imports.

## Documentation Files

### 1. [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md)
Complete documentation of the consolidation process, including:
- Changes made
- Benefits of consolidation
- Full API reference
- Student data structure
- Role-based access
- Cache management
- Testing checklist
- Future enhancements

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
Quick reference guide with:
- Import examples
- Usage examples for all hooks
- Filter parameters
- Loading states
- Cache management
- Complete component examples
- Error handling patterns
- Common patterns

## Hook Location
**File:** `client/src/hooks/useStudentProfile.js`

## Available Hooks

### Query Hooks (Data Fetching)
- `useStudents(params)` - Fetch all students with optional filters
- `useStudent(id)` - Fetch a single student by ID
- `useStudentStatistics()` - Fetch student statistics
- `useNextStudentNumber(department)` - Get next available student number

### Mutation Hooks (Data Modification)
- `useCreateStudent()` - Create a new student
- `useUpdateStudent()` - Update an existing student
- `useDeleteStudent()` - Delete a student

### Utility Functions
- `getPrograms()` - Get list of available programs
- `getYearLevels()` - Get list of year levels
- `getStatuses()` - Get list of student statuses
- `formatStudentForDisplay(student)` - Format student data
- `generateStudentId()` - Generate new student ID

### Utilities
- `studentKeys` - Query key factory for cache management

## Quick Start

### Installation
No installation needed - hooks are already available in the project.

### Basic Usage
```javascript
import { useStudents, useCreateStudent } from '../../hooks/useStudentProfile';

function StudentProfiles() {
  const { data: students, isLoading } = useStudents({ program: 'BSIT' });
  const createStudent = useCreateStudent();
  
  // Use the hooks...
}
```

## Key Features

### 1. React Query Integration
All hooks use React Query for:
- Automatic caching (5-minute stale time for lists)
- Background refetching
- Optimistic updates
- Error handling
- Loading states

### 2. Role-Based Access Control
Different access levels based on user role:
- **Admin:** Full access to all students
- **Department Chair:** Access to department students only
- **Faculty:** Read-only access

### 3. Automatic Cache Invalidation
Mutations automatically invalidate relevant queries:
- Create → Invalidates student list + statistics
- Update → Invalidates student list + specific student + statistics
- Delete → Invalidates student list + statistics

### 4. Department Filtering
Automatic filtering for department chairs:
```javascript
const { user } = useAuth();
const params = {};
if (user?.role === 'dept_chair' && user?.department) {
  params.department = user.department;
}
const { data: students } = useStudents(params);
```

### 5. Next Student Number Generation
Automatic student number generation:
```javascript
const { data: nextNumber } = useNextStudentNumber('IT');
// "2024-IT-001"
```

### 6. Type Safety
All hooks include JSDoc comments for better IDE support and type checking.

## Components Using These Hooks

### Primary Components
1. **StudentProfiles.jsx** - Main student profiles page
   - Uses: `useStudents`, `useCreateStudent`, `useUpdateStudent`, `getPrograms`, `getYearLevels`, `generateStudentId`

2. **StudentFormModal.jsx** - Student creation/editing form
   - Uses: `useNextStudentNumber`

### Related Components
- `StudentList.jsx` - Displays student list
- `StudentProfileModal.jsx` - Student profile view
- `UserSearchDropdown.jsx` - User search for linking

## Service Layer
**Service:** `client/src/services/student-profile-service/studentProfileService.js`

The hooks interact with the service layer which handles:
- API calls to fetch/create/update/delete students
- Request/response formatting
- Error handling
- Authentication
- Data validation

## Student Data Structure

```javascript
{
  id: number,
  student_number: string,
  user_id: number,
  name: string,
  email: string,
  program: string,
  year_level: string,
  department: string,
  skills: string,
  activities: string,
  achievements: string,
  status: string,
  created_at: string,
  updated_at: string,
  user: {
    id: number,
    email: string,
    role: string
  }
}
```

## Filter Parameters

### Available Filters
- **program:** Filter by academic program (BSIT, BSCS, BSCpE, BSDS, etc.)
- **year_level:** Filter by year level (1st Year, 2nd Year, 3rd Year, 4th Year)
- **skills:** Search by skills
- **activities:** Search by activities
- **status:** Filter by status (active, inactive, suspended)
- **department:** Filter by department (IT, CS, CE, DS) - auto-applied for dept_chair

## Best Practices

### 1. Use Query Hooks for Reading
```javascript
const { data, isLoading, error } = useStudents({ program: 'BSIT' });
```

### 2. Use Mutation Hooks for Writing
```javascript
const createStudent = useCreateStudent();
await createStudent.mutateAsync(studentData);
```

### 3. Handle Loading States
```javascript
if (isLoading) return <StudentProfilesSkeleton />;
if (error) return <ErrorMessage />;
```

### 4. Handle Errors Properly
```javascript
try {
  await createStudent.mutateAsync(studentData);
  showSuccess('Student created');
} catch (error) {
  if (error.errors) {
    // Handle validation errors
    setServerErrors(error.errors);
  }
  showError(error.message);
}
```

### 5. Use Filters Efficiently
```javascript
const queryParams = useMemo(() => {
  const params = {};
  if (filters.program !== 'all') params.program = filters.program;
  if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
  return params;
}, [filters]);

const { data: students } = useStudents(queryParams);
```

### 6. Implement Role-Based Access
```javascript
const { user } = useAuth();
const canModifyStudents = user?.role === 'admin' || user?.role === 'dept_chair';

{canModifyStudents && (
  <button onClick={handleAddStudent}>Add Student</button>
)}
```

## Troubleshooting

### Issue: Students not updating after mutation
**Solution:** Check that React Query is properly configured and cache invalidation is working.

### Issue: Stale data showing
**Solution:** Adjust `staleTime` in the hook configuration or manually invalidate queries.

### Issue: Import errors
**Solution:** Ensure you're importing from `../../hooks/useStudentProfile` (not the old `student-profile-hook` directory).

### Issue: Validation errors not showing
**Solution:** Check error handling in your component and ensure you're catching validation errors from `error.errors`.

### Issue: Department filtering not working for dept_chair
**Solution:** Ensure you're passing the department parameter in queryParams and that the user object has the department property.

## Performance Considerations

### 1. Stale Time
- Students list: 5 minutes
- Student detail: Immediate refetch
- Statistics: 10 minutes
- Next student number: Always fresh (0)

### 2. Pagination
Currently fetches all students (per_page: 1000). For large datasets, consider implementing proper pagination.

### 3. Caching Strategy
React Query automatically caches results. Mutations invalidate relevant caches to ensure data consistency.

### 4. Client-Side Search
Search is handled client-side for better UX. For large datasets, consider server-side search.

## Future Enhancements

### Potential Improvements
1. Add pagination support for large student lists
2. Implement infinite scroll
3. Add bulk operations (bulk import, bulk update, bulk delete)
4. Add student photo upload
5. Add advanced filtering (date ranges, custom fields)
6. Add sorting options
7. Add student activity tracking
8. Add real-time updates using WebSockets
9. Add student enrollment history
10. Add grade management integration

## Related Documentation

- [User Management Hooks](../user-management-hooks/)
- [Admin Dashboard Hooks](../admin-dashboard-hooks/)
- [Dual Portal Authentication](../dual-portal-authentication/)
- [Class Scheduling System](../class-scheduling-system/)

## API Endpoints

### Get Students
```
GET /api/admin/students
Query Parameters: program, year_level, skills, activities, status, department
```

### Get Single Student
```
GET /api/admin/students/{id}
```

### Create Student
```
POST /api/admin/students
Body: { student_number, user_id, name, email, program, year_level, ... }
```

### Update Student
```
PUT /api/admin/students/{id}
Body: { student_number, user_id, name, email, program, year_level, ... }
```

### Delete Student
```
DELETE /api/admin/students/{id}
```

### Get Statistics
```
GET /api/admin/students/statistics
```

### Get Next Student Number
```
GET /api/admin/students/next-number/{department}
```

## Testing

### Unit Tests
```javascript
import { renderHook, waitFor } from '@testing-library/react';
import { useStudents } from './useStudentProfile';

test('fetches students', async () => {
  const { result } = renderHook(() => useStudents({ program: 'BSIT' }));
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  
  expect(result.current.data).toBeInstanceOf(Array);
});
```

### Integration Tests
```javascript
test('student profiles page displays students', async () => {
  render(<StudentProfiles />);
  
  await waitFor(() => {
    expect(screen.getByText(/Student Profiles/i)).toBeInTheDocument();
  });
});
```

## Migration Notes

If you need to add new student profile hooks in the future:
1. Add them to `client/src/hooks/useStudentProfile.js`
2. Export them from the same file
3. Update `studentKeys` if needed for cache management
4. Add JSDoc comments for IDE support
5. Update documentation

## Support

For issues or questions:
1. Check the [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common usage patterns
2. Review the [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md) for detailed API documentation
3. Check the service layer implementation
4. Review React Query documentation for advanced usage

## Changelog

### April 26, 2026
- ✅ Consolidated student profile hooks into single file
- ✅ Updated all imports across the codebase
- ✅ Removed old hook directory structure
- ✅ Added comprehensive documentation
- ✅ Added JSDoc comments for better IDE support
- ✅ Added query key factory for cache management
- ✅ Preserved all utility functions

## License
Part of the Student Data Profiling System (MEMSILOGKO)

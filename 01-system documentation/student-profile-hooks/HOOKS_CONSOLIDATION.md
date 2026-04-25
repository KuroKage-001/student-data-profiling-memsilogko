# Student Profile Hooks Consolidation

## Overview
Consolidated all student profile hooks from the `student-profile-hook` directory into a single file for better maintainability and simpler imports.

## Changes Made

### 1. Created Consolidated Hook File
**Location:** `client/src/hooks/useStudentProfile.js`

This single file now contains all student profile hooks:
- `useStudents(params)` - Fetch all students with optional filters
- `useStudent(id)` - Fetch a single student by ID
- `useCreateStudent()` - Create a new student
- `useUpdateStudent()` - Update an existing student
- `useDeleteStudent()` - Delete a student
- `useStudentStatistics()` - Fetch student statistics
- `useNextStudentNumber(department)` - Get next available student number
- `studentKeys` - Query key factory for cache management
- Utility functions: `getPrograms()`, `getYearLevels()`, `getStatuses()`, `formatStudentForDisplay()`, `generateStudentId()`

### 2. Removed Old Directory Structure
**Deleted:**
- `client/src/hooks/student-profile-hook/index.js`
- `client/src/hooks/student-profile-hook/useStudentProfile.js`
- `client/src/hooks/student-profile-hook/useStudentProfileQuery.js`
- `client/src/hooks/student-profile-hook/` (directory)

### 3. Updated Imports

#### Files Updated:
1. **`client/src/pages/admin-pages/StudentProfiles.jsx`**
   ```javascript
   // Before
   import { 
     useStudents, 
     useCreateStudent, 
     useUpdateStudent,
     getPrograms,
     getYearLevels,
     generateStudentId
   } from '../../hooks/student-profile-hook';
   
   // After
   import { 
     useStudents, 
     useCreateStudent, 
     useUpdateStudent,
     getPrograms,
     getYearLevels,
     generateStudentId
   } from '../../hooks/useStudentProfile';
   ```

2. **`client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`**
   ```javascript
   // Before
   import { useNextStudentNumber } from '../../../hooks/student-profile-hook';
   
   // After
   import { useNextStudentNumber } from '../../../hooks/useStudentProfile';
   ```

## Benefits

### 1. Simplified Structure
- Single file instead of multiple files in a directory
- Easier to locate and maintain
- Reduced complexity in the codebase

### 2. Cleaner Imports
```javascript
// Before (longer path)
import { useStudents } from '../../hooks/student-profile-hook';

// After (cleaner)
import { useStudents } from '../../hooks/useStudentProfile';
```

### 3. Better Organization
- All related hooks in one place
- Consistent with other hooks in the project
- Easier to understand the full API at a glance

### 4. Maintained Functionality
- All React Query hooks preserved
- Query key factory maintained
- Cache invalidation logic intact
- Utility functions preserved
- JSDoc comments added for better IDE support

## Hook API Reference

### Query Hooks

#### `useStudents(params)`
Fetches all students with optional filtering.

**Parameters:**
- `params` (Object): Query parameters
  - `program`: Filter by program (e.g., 'BSIT', 'BSCS')
  - `year_level`: Filter by year level (e.g., '1st Year', '2nd Year')
  - `skills`: Filter by skills
  - `activities`: Filter by activities
  - `status`: Filter by status (active, inactive, suspended)
  - `department`: Filter by department (for dept_chair role)

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: students, isLoading, error } = useStudents({ 
  program: 'BSIT', 
  year_level: '3rd Year',
  department: 'IT'
});
```

#### `useStudent(id)`
Fetches a single student by ID.

**Parameters:**
- `id` (number|string): Student ID

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: student, isLoading } = useStudent(studentId);
```

#### `useStudentStatistics()`
Fetches student statistics for dashboard.

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: stats, isLoading } = useStudentStatistics();
console.log(stats.totalStudents);
console.log(stats.byProgram);
```

#### `useNextStudentNumber(department)`
Fetches the next available student number for a department.

**Parameters:**
- `department` (string): Department code (e.g., 'IT', 'CS', 'CE')

**Returns:** React Query result with `data`, `isLoading`, `error`

**Example:**
```javascript
const { data: nextNumber, isLoading } = useNextStudentNumber('IT');
console.log(nextNumber); // "2024-IT-001"
```

### Mutation Hooks

#### `useCreateStudent()`
Creates a new student.

**Returns:** Mutation object with `mutate`, `mutateAsync`, `isPending`

**Usage:**
```javascript
const createStudent = useCreateStudent();

try {
  const result = await createStudent.mutateAsync(studentData);
  console.log(result.message);
} catch (error) {
  console.error(error.message);
  console.error(error.errors); // Validation errors
}
```

#### `useUpdateStudent()`
Updates an existing student.

**Returns:** Mutation object with `mutate`, `mutateAsync`, `isPending`

**Usage:**
```javascript
const updateStudent = useUpdateStudent();

try {
  const result = await updateStudent.mutateAsync({ 
    id: studentId, 
    studentData 
  });
  console.log(result.message);
} catch (error) {
  console.error(error.message);
  console.error(error.errors); // Validation errors
}
```

#### `useDeleteStudent()`
Deletes a student.

**Returns:** Mutation object with `mutate`, `mutateAsync`, `isPending`

**Usage:**
```javascript
const deleteStudent = useDeleteStudent();

try {
  const result = await deleteStudent.mutateAsync(studentId);
  console.log(result.message);
} catch (error) {
  console.error(error.message);
}
```

### Utility Functions

#### `getPrograms()`
Returns list of available programs.

**Returns:** `Array<string>`

**Example:**
```javascript
const programs = getPrograms();
// ['BSIT', 'BSCS', 'BSCpE', 'BSDS', ...]
```

#### `getYearLevels()`
Returns list of available year levels.

**Returns:** `Array<string>`

**Example:**
```javascript
const yearLevels = getYearLevels();
// ['1st Year', '2nd Year', '3rd Year', '4th Year']
```

#### `getStatuses()`
Returns list of available student statuses.

**Returns:** `Array<string>`

**Example:**
```javascript
const statuses = getStatuses();
// ['active', 'inactive', 'suspended']
```

#### `formatStudentForDisplay(student)`
Formats student data for display.

**Parameters:**
- `student` (Object): Raw student object

**Returns:** Formatted student object

#### `generateStudentId()`
Generates a new student ID.

**Returns:** `string`

**Example:**
```javascript
const newId = generateStudentId();
// "2024-IT-001"
```

### Query Keys

The `studentKeys` object provides a factory for generating consistent query keys:

```javascript
studentKeys.all                    // ['students']
studentKeys.lists()                // ['students', 'list']
studentKeys.list(params)           // ['students', 'list', params]
studentKeys.details()              // ['students', 'detail']
studentKeys.detail(id)             // ['students', 'detail', id]
studentKeys.statistics()           // ['students', 'statistics']
studentKeys.nextNumber(department) // ['students', 'nextNumber', department]
```

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

## Role-Based Access

### Admin Role
- Full access to all students
- Can create, update, and delete students
- Can view all departments

### Department Chair Role
- Access to students in their department only
- Can create, update, and delete students in their department
- Filtered by department automatically

### Faculty Role
- Read-only access to students
- Cannot create, update, or delete students
- May see students in their classes

## Configuration

### Stale Time
- **Students List:** 5 minutes
- **Student Detail:** Default (0)
- **Statistics:** 10 minutes
- **Next Student Number:** 0 (always fresh)

### Cache Invalidation
- Create student → Invalidates students list + statistics
- Update student → Invalidates students list + specific student + statistics
- Delete student → Invalidates students list + statistics

## Testing Checklist

- [x] Student profiles page loads correctly
- [x] Student list displays properly
- [x] Create student functionality works
- [x] Update student functionality works
- [x] Delete student functionality works
- [x] Filters work correctly (program, year level, skills, activities, status)
- [x] Search functionality works
- [x] Department filtering works for dept_chair
- [x] Next student number generation works
- [x] Export to Excel works
- [x] PDF generation works
- [x] No console errors
- [x] All imports resolved correctly

## Usage in Components

### StudentProfiles.jsx
```javascript
import { 
  useStudents, 
  useCreateStudent, 
  useUpdateStudent,
  getPrograms,
  getYearLevels,
  generateStudentId
} from '../../hooks/useStudentProfile';

const StudentProfiles = () => {
  const { user } = useAuth();
  const isDeptChair = user?.role === 'dept_chair';
  
  const queryParams = useMemo(() => {
    const params = {};
    if (filters.program !== 'all') params.program = filters.program;
    if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
    if (isDeptChair && user?.department) {
      params.department = user.department;
    }
    return params;
  }, [filters, isDeptChair, user?.department]);
  
  const { data: students = [], isLoading, error } = useStudents(queryParams);
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  
  const programs = getPrograms();
  const yearLevels = getYearLevels();
  
  // Component logic...
};
```

### StudentFormModal.jsx
```javascript
import { useNextStudentNumber } from '../../../hooks/useStudentProfile';

const StudentFormModal = ({ student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    department: 'IT'
  });
  
  const { data: nextNumber, isLoading } = useNextStudentNumber(formData.department);
  
  // Use nextNumber for auto-generating student ID
};
```

## Cache Management

### Manual Cache Invalidation
```javascript
import { useQueryClient } from '@tanstack/react-query';
import { studentKeys } from '../../hooks/useStudentProfile';

const MyComponent = () => {
  const queryClient = useQueryClient();
  
  const refreshStudents = () => {
    queryClient.invalidateQueries({ 
      queryKey: studentKeys.lists() 
    });
  };
  
  return <button onClick={refreshStudents}>Refresh</button>;
};
```

## Performance Considerations

### 1. Caching Strategy
- **Stale Time:** 5 minutes for students list reduces API calls
- **Background Refetch:** React Query handles this automatically
- **Selective Invalidation:** Only invalidates relevant queries

### 2. Filtering
- Client-side search for better UX
- Server-side filtering for large datasets
- Department filtering for dept_chair role

### 3. Loading States
- Skeleton loading provides better UX
- Prevents layout shift with proper skeleton dimensions

## Future Enhancements

### Potential Improvements
1. Add pagination for large student lists
2. Add infinite scroll
3. Add bulk operations (bulk import, bulk update)
4. Add student photo upload
5. Add advanced filtering (date ranges, custom fields)
6. Add sorting options
7. Add student activity tracking
8. Add real-time updates using WebSockets

## Related Documentation

- [User Management Hooks](../user-management-hooks/)
- [Admin Dashboard Hooks](../admin-dashboard-hooks/)
- [Dual Portal Authentication](../dual-portal-authentication/)

## Migration Notes

If you need to add new student profile hooks in the future:
1. Add them to `client/src/hooks/useStudentProfile.js`
2. Export them from the same file
3. Update `studentKeys` if needed for cache management
4. Import directly from `useStudentProfile`

## Related Files

- **Hook File:** `client/src/hooks/useStudentProfile.js`
- **Service:** `client/src/services/student-profile-service/studentProfileService.js`
- **Main Component:** `client/src/pages/admin-pages/StudentProfiles.jsx`
- **Related Components:**
  - `client/src/components/admin-components/student-profile-compo/StudentList.jsx`
  - `client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`
  - `client/src/components/admin-components/student-profile-compo/StudentProfileModal.jsx`
- **Utilities:**
  - `client/src/utils/admin-utilities/student-profile-utils.js`
  - `client/src/utils/admin-utilities/pdfGenerator.js`

## Date
April 26, 2026

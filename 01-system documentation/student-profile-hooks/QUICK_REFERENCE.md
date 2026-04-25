# Student Profile Hooks - Quick Reference

## Import
```javascript
import { 
  useStudents, 
  useStudent, 
  useCreateStudent, 
  useUpdateStudent, 
  useDeleteStudent,
  useStudentStatistics,
  useNextStudentNumber,
  studentKeys,
  getPrograms,
  getYearLevels,
  getStatuses,
  formatStudentForDisplay,
  generateStudentId
} from '../../hooks/useStudentProfile';
```

## Usage Examples

### Fetch All Students
```javascript
const { data: students, isLoading, error } = useStudents({ 
  program: 'BSIT', 
  year_level: '3rd Year',
  status: 'active'
});
```

### Fetch Single Student
```javascript
const { data: student, isLoading } = useStudent(studentId);
```

### Create Student
```javascript
const createStudent = useCreateStudent();

const handleCreate = async (studentData) => {
  try {
    const result = await createStudent.mutateAsync(studentData);
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
    console.error(error.errors); // Validation errors
  }
};
```

### Update Student
```javascript
const updateStudent = useUpdateStudent();

const handleUpdate = async (id, studentData) => {
  try {
    const result = await updateStudent.mutateAsync({ id, studentData });
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
    console.error(error.errors); // Validation errors
  }
};
```

### Delete Student
```javascript
const deleteStudent = useDeleteStudent();

const handleDelete = async (id) => {
  try {
    const result = await deleteStudent.mutateAsync(id);
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
  }
};
```

### Get Statistics
```javascript
const { data: stats, isLoading } = useStudentStatistics();
console.log(stats.totalStudents);
console.log(stats.byProgram);
console.log(stats.byYearLevel);
```

### Get Next Student Number
```javascript
const { data: nextNumber, isLoading } = useNextStudentNumber('IT');
console.log(nextNumber); // "2024-IT-001"
```

### Use Utility Functions
```javascript
const programs = getPrograms();
const yearLevels = getYearLevels();
const statuses = getStatuses();
const newId = generateStudentId();
const formatted = formatStudentForDisplay(student);
```

## Filter Parameters

### useStudents(params)
- `program`: 'BSIT' | 'BSCS' | 'BSCpE' | 'BSDS' | etc.
- `year_level`: '1st Year' | '2nd Year' | '3rd Year' | '4th Year'
- `skills`: string (search term)
- `activities`: string (search term)
- `status`: 'active' | 'inactive' | 'suspended'
- `department`: 'IT' | 'CS' | 'CE' | 'DS' (for dept_chair)

## Loading States
```javascript
const createStudent = useCreateStudent();
const isCreating = createStudent.isPending;

const updateStudent = useUpdateStudent();
const isUpdating = updateStudent.isPending;

const deleteStudent = useDeleteStudent();
const isDeleting = deleteStudent.isPending;
```

## Cache Management
```javascript
import { studentKeys } from '../../hooks/useStudentProfile';

// Invalidate all students
queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

// Invalidate specific student
queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });

// Invalidate statistics
queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });

// Invalidate next number
queryClient.invalidateQueries({ queryKey: studentKeys.nextNumber('IT') });
```

## Complete Component Example
```javascript
import { useState, useMemo } from 'react';
import { 
  useStudents, 
  useCreateStudent, 
  useUpdateStudent, 
  useDeleteStudent,
  getPrograms,
  getYearLevels
} from '../../hooks/useStudentProfile';
import useToast from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

const StudentProfiles = () => {
  const { user } = useAuth();
  const isDeptChair = user?.role === 'dept_chair';
  
  const [filters, setFilters] = useState({
    program: 'all',
    yearLevel: 'all',
    status: 'all'
  });
  
  // Build query params
  const queryParams = useMemo(() => {
    const params = {};
    if (filters.program !== 'all') params.program = filters.program;
    if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
    if (filters.status !== 'all') params.status = filters.status;
    
    // For dept_chair, filter by their department
    if (isDeptChair && user?.department) {
      params.department = user.department;
    }
    
    return params;
  }, [filters, isDeptChair, user?.department]);
  
  // Queries
  const { data: students = [], isLoading, error } = useStudents(queryParams);
  
  // Mutations
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  
  const { showSuccess, showError } = useToast();
  
  // Get utility data
  const programs = getPrograms();
  const yearLevels = getYearLevels();

  const handleCreate = async (studentData) => {
    try {
      const result = await createStudent.mutateAsync(studentData);
      showSuccess(result.message);
    } catch (error) {
      if (error.errors) {
        // Handle validation errors
        console.error(error.errors);
      }
      showError(error.message);
    }
  };

  const handleUpdate = async (id, studentData) => {
    try {
      const result = await updateStudent.mutateAsync({ id, studentData });
      showSuccess(result.message);
    } catch (error) {
      if (error.errors) {
        // Handle validation errors
        console.error(error.errors);
      }
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteStudent.mutateAsync(id);
      showSuccess(result.message);
    } catch (error) {
      showError(error.message);
    }
  };

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {/* Filters */}
      <select 
        value={filters.program}
        onChange={(e) => setFilters(prev => ({ ...prev, program: e.target.value }))}
      >
        <option value="all">All Programs</option>
        {programs.map(program => (
          <option key={program} value={program}>{program}</option>
        ))}
      </select>
      
      {/* Student List */}
      {students.map(student => (
        <div key={student.id}>
          {student.name} - {student.program}
          <button onClick={() => handleUpdate(student.id, updatedData)}>Edit</button>
          <button onClick={() => handleDelete(student.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
```

## Role-Based Filtering Example
```javascript
import { useAuth } from '../../context/AuthContext';
import { useStudents, getPrograms } from '../../hooks/useStudentProfile';

const StudentList = () => {
  const { user } = useAuth();
  const isDeptChair = user?.role === 'dept_chair';
  const userDepartment = user?.department;
  
  // Auto-filter by department for dept_chair
  const queryParams = useMemo(() => {
    const params = {};
    if (isDeptChair && userDepartment) {
      params.department = userDepartment;
    }
    return params;
  }, [isDeptChair, userDepartment]);
  
  const { data: students } = useStudents(queryParams);
  
  // Filter programs for dept_chair
  const availablePrograms = useMemo(() => {
    if (!isDeptChair || !userDepartment) {
      return getPrograms();
    }
    
    const departmentPrograms = {
      'IT': ['BSIT', 'Information Technology'],
      'CS': ['BSCS', 'Computer Science'],
      'CE': ['BSCpE', 'Computer Engineering'],
      'DS': ['BSDS', 'Data Science'],
    };
    
    const programs = getPrograms();
    return programs.filter(program => {
      const deptPrograms = departmentPrograms[userDepartment] || [];
      return deptPrograms.some(dp => program.includes(dp));
    });
  }, [isDeptChair, userDepartment]);
  
  return (
    <div>
      {isDeptChair && userDepartment && (
        <div className="alert">
          Viewing {userDepartment} department students only
        </div>
      )}
      {/* Student list */}
    </div>
  );
};
```

## Next Student Number Example
```javascript
import { useNextStudentNumber } from '../../hooks/useStudentProfile';

const StudentFormModal = ({ student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    department: 'IT',
    student_number: ''
  });
  
  // Fetch next student number when department changes
  const { data: nextNumber, isLoading } = useNextStudentNumber(formData.department);
  
  // Auto-fill student number for new students
  useEffect(() => {
    if (!student && nextNumber && !formData.student_number) {
      setFormData(prev => ({
        ...prev,
        student_number: nextNumber
      }));
    }
  }, [student, nextNumber, formData.student_number]);
  
  return (
    <form>
      <input
        type="text"
        value={formData.student_number}
        onChange={(e) => setFormData(prev => ({ ...prev, student_number: e.target.value }))}
        placeholder={isLoading ? 'Generating...' : 'Student Number'}
      />
      {/* Other form fields */}
    </form>
  );
};
```

## Error Handling
```javascript
try {
  await createStudent.mutateAsync(studentData);
} catch (error) {
  // Validation errors (422)
  if (error.errors) {
    const validationErrors = error.errors;
    Object.keys(validationErrors).forEach(field => {
      console.log(`${field}: ${validationErrors[field].join(', ')}`);
    });
  }
  // Other errors
  console.error(error.message);
}
```

## Export to Excel Example
```javascript
import { exportToExcel } from '../../utils/admin-utilities/student-profile-utils';
import { useStudents } from '../../hooks/useStudentProfile';

const StudentProfiles = () => {
  const { data: students = [] } = useStudents();
  
  const handleExport = () => {
    if (students.length === 0) {
      alert('No students to export');
      return;
    }
    
    exportToExcel(
      students, 
      `students_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  };
  
  return <button onClick={handleExport}>Export to Excel</button>;
};
```

## Generate PDF Report Example
```javascript
import { generateStudentPDF } from '../../utils/admin-utilities/pdfGenerator';

const StudentProfileModal = ({ student }) => {
  const handleGenerateReport = async () => {
    try {
      await generateStudentPDF(student);
      alert(`PDF report generated for ${student.name}`);
    } catch (error) {
      console.error('Failed to generate PDF report');
    }
  };
  
  return <button onClick={handleGenerateReport}>Generate PDF</button>;
};
```

## Stale Time Configuration
- **Students List:** 5 minutes
- **Student Detail:** Default (0)
- **Statistics:** 10 minutes
- **Next Student Number:** 0 (always fresh)

## Auto-Refetch Behavior
- Create student → Invalidates students list + statistics
- Update student → Invalidates students list + specific student + statistics
- Delete student → Invalidates students list + statistics

## Common Patterns

### Conditional Rendering Based on Role
```javascript
const { user } = useAuth();
const canModifyStudents = user?.role === 'admin' || user?.role === 'dept_chair';

return (
  <div>
    {canModifyStudents && (
      <button onClick={handleAddStudent}>Add Student</button>
    )}
  </div>
);
```

### Client-Side Search with Server-Side Filters
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filters, setFilters] = useState({ program: 'all' });

// Server-side filters
const queryParams = useMemo(() => {
  const params = {};
  if (filters.program !== 'all') params.program = filters.program;
  return params;
}, [filters]);

const { data: students = [] } = useStudents(queryParams);

// Client-side search
const filteredStudents = useMemo(() => {
  if (!searchTerm) return students;
  
  return students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [students, searchTerm]);
```

### Loading Skeleton
```javascript
const { data: students, isLoading } = useStudents();

if (isLoading) {
  return <StudentProfilesSkeleton />;
}

return <StudentList students={students} />;
```

### Server Validation Errors
```javascript
const [serverErrors, setServerErrors] = useState(null);
const createStudent = useCreateStudent();

const handleSubmit = async (studentData) => {
  setServerErrors(null);
  
  try {
    await createStudent.mutateAsync(studentData);
  } catch (error) {
    if (error.errors) {
      setServerErrors(error.errors);
    }
  }
};

// In form
{serverErrors?.email && (
  <span className="error">{serverErrors.email[0]}</span>
)}
```

# Faculty Profile Utilities - Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing and using the faculty profile utilities in your components.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Implementation](#basic-implementation)
3. [Advanced Usage](#advanced-usage)
4. [Common Patterns](#common-patterns)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- React 18+
- xlsx library installed
- Existing faculty profile components

### Installation

The utilities are already included in the project at:
```
client/src/utils/admin-utilities/faculty-profile-utils/
```

---

## Basic Implementation

### 1. Import Utilities

```javascript
// In your component file
import { 
  exportFacultyToExcel,
  validateFacultyData,
  formatFacultyForDisplay,
  SEARCH_DEBOUNCE_DELAY
} from '../../utils/admin-utilities/faculty-profile-utils';
```

### 2. Export Faculty List

Replace inline export logic with utility function:

**Before:**
```javascript
const handleExportList = () => {
  // 60+ lines of export logic
  const exportData = faculty.map((member, index) => ({
    'No.': index + 1,
    'Faculty ID': member.faculty_id || member.id,
    // ... many more lines
  }));
  
  const wb = XLSX.utils.book_new();
  // ... more setup
  XLSX.writeFile(wb, filename);
};
```

**After:**
```javascript
const handleExportList = () => {
  try {
    if (!faculty || faculty.length === 0) {
      showInfo('No faculty to export');
      return;
    }
    
    const filename = exportFacultyToExcel(faculty);
    showSuccess(`Faculty list exported successfully as ${filename}`);
  } catch (err) {
    console.error('Export error:', err);
    showError(err.message || 'Failed to export faculty list');
  }
};
```

### 3. Use Constants

Replace magic numbers with named constants:

**Before:**
```javascript
useEffect(() => {
  const searchTimeout = setTimeout(() => {
    searchFaculty(searchTerm, filters);
  }, 500); // Magic number
  
  return () => clearTimeout(searchTimeout);
}, [searchTerm, filters]);
```

**After:**
```javascript
useEffect(() => {
  const searchTimeout = setTimeout(() => {
    searchFaculty(searchTerm, filters);
  }, SEARCH_DEBOUNCE_DELAY);
  
  return () => clearTimeout(searchTimeout);
}, [searchTerm, filters]);
```

### 4. Validate Form Data

```javascript
import { validateFacultyData } from '../../utils/admin-utilities/faculty-profile-utils';

const handleSubmit = (formData) => {
  // Validate before submission
  const { isValid, errors } = validateFacultyData(formData);
  
  if (!isValid) {
    setFormErrors(errors);
    showError('Please fix the validation errors');
    return;
  }
  
  // Proceed with submission
  submitFaculty(formData);
};
```

---

## Advanced Usage

### 1. Custom Export with Filters

```javascript
import { exportFilteredFaculty } from '../../utils/admin-utilities/faculty-profile-utils';

const handleExportFiltered = () => {
  try {
    const filename = exportFilteredFaculty(faculty, {
      department: 'Computer Science',
      status: 'active'
    });
    showSuccess(`Filtered list exported as ${filename}`);
  } catch (err) {
    showError(err.message);
  }
};
```

### 2. Calculate and Display Statistics

```javascript
import { calculateFacultyStats } from '../../utils/admin-utilities/faculty-profile-utils';

const FacultyDashboard = ({ faculty }) => {
  const stats = calculateFacultyStats(faculty);
  
  return (
    <div className="stats-grid">
      <StatCard title="Total Faculty" value={stats.total} />
      <StatCard title="Active" value={stats.active} />
      <StatCard title="Avg Years of Service" value={stats.averageYearsOfService} />
      
      <DepartmentChart data={stats.byDepartment} />
      <PositionChart data={stats.byPosition} />
    </div>
  );
};
```

### 3. Dynamic Filtering

```javascript
import { 
  filterBySearchTerm, 
  applyFacultyFilters, 
  sortFaculty 
} from '../../utils/admin-utilities/faculty-profile-utils';

const useFacultyFiltering = (faculty) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    position: 'all',
    status: 'all'
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'name',
    order: 'asc'
  });
  
  const filteredFaculty = useMemo(() => {
    let result = faculty;
    
    // Apply search
    if (searchTerm) {
      result = filterBySearchTerm(result, searchTerm);
    }
    
    // Apply filters
    result = applyFacultyFilters(result, filters);
    
    // Apply sorting
    result = sortFaculty(result, sortConfig.field, sortConfig.order);
    
    return result;
  }, [faculty, searchTerm, filters, sortConfig]);
  
  return {
    filteredFaculty,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    setSortConfig
  };
};
```

### 4. Status Badge Component

```javascript
import { getStatusColor, getStatusLabel } from '../../utils/admin-utilities/faculty-profile-utils';

const StatusBadge = ({ status }) => {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {label}
    </span>
  );
};
```

### 5. Form Validation Hook

```javascript
import { validateFacultyData } from '../../utils/admin-utilities/faculty-profile-utils';

const useFacultyValidation = () => {
  const [errors, setErrors] = useState({});
  
  const validate = (formData) => {
    const { isValid, errors: validationErrors } = validateFacultyData(formData);
    setErrors(validationErrors);
    return isValid;
  };
  
  const clearErrors = () => setErrors({});
  
  const getFieldError = (fieldName) => errors[fieldName];
  
  return {
    errors,
    validate,
    clearErrors,
    getFieldError
  };
};

// Usage in component
const FacultyForm = () => {
  const { errors, validate, getFieldError } = useFacultyValidation();
  
  const handleSubmit = (formData) => {
    if (validate(formData)) {
      submitFaculty(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      {getFieldError('name') && (
        <span className="error">{getFieldError('name')}</span>
      )}
    </form>
  );
};
```

---

## Common Patterns

### Pattern 1: Export with Custom Filename

```javascript
import { exportFacultyToExcel, generateExportFilename } from '../../utils/admin-utilities/faculty-profile-utils';

const handleExportWithCustomName = () => {
  const customFilename = generateExportFilename('CS_Department_Faculty');
  const filename = exportFacultyToExcel(faculty, customFilename);
  showSuccess(`Exported as ${filename}`);
};
```

### Pattern 2: Conditional Validation

```javascript
import { isValidEmail, isValidPhone } from '../../utils/admin-utilities/faculty-profile-utils';

const validateField = (fieldName, value) => {
  switch (fieldName) {
    case 'email':
      return isValidEmail(value) ? null : 'Invalid email format';
    case 'phone':
      return isValidPhone(value) ? null : 'Invalid phone format';
    default:
      return null;
  }
};
```

### Pattern 3: Dynamic Filter Options

```javascript
import { 
  getUniqueDepartments, 
  getUniquePositions, 
  getUniqueStatuses 
} from '../../utils/admin-utilities/faculty-profile-utils';

const FilterPanel = ({ faculty }) => {
  const departments = getUniqueDepartments(faculty);
  const positions = getUniquePositions(faculty);
  const statuses = getUniqueStatuses(faculty);
  
  return (
    <div className="filters">
      <select>
        <option value="all">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      
      <select>
        <option value="all">All Positions</option>
        {positions.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>
      
      <select>
        <option value="all">All Statuses</option>
        {statuses.map(status => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### Pattern 4: Format Display Data

```javascript
import { formatFacultyForDisplay, formatDate } from '../../utils/admin-utilities/faculty-profile-utils';

const FacultyCard = ({ faculty }) => {
  const displayData = formatFacultyForDisplay(faculty);
  
  return (
    <div className="faculty-card">
      <h3>{displayData.name}</h3>
      <p>{displayData.email}</p>
      <p>{displayData.department}</p>
      <p>Hired: {formatDate(displayData.hire_date)}</p>
    </div>
  );
};
```

---

## Troubleshooting

### Issue 1: Export Not Working

**Problem:** Excel file not downloading

**Solution:**
```javascript
// Check if data exists
if (!faculty || faculty.length === 0) {
  console.error('No faculty data to export');
  return;
}

// Ensure xlsx library is installed
// npm install xlsx

// Check browser console for errors
try {
  const filename = exportFacultyToExcel(faculty);
  console.log('Export successful:', filename);
} catch (error) {
  console.error('Export failed:', error);
}
```

### Issue 2: Validation Not Working

**Problem:** Validation errors not showing

**Solution:**
```javascript
// Ensure you're checking the return value
const { isValid, errors } = validateFacultyData(formData);

console.log('Validation result:', { isValid, errors });

if (!isValid) {
  // Display errors
  Object.keys(errors).forEach(field => {
    console.log(`${field}: ${errors[field]}`);
  });
}
```

### Issue 3: Filters Not Applying

**Problem:** Filters not affecting the list

**Solution:**
```javascript
// Ensure filters are in correct format
const filters = {
  department: 'Computer Science', // Not 'all'
  position: 'Professor',
  status: 'active'
};

// Apply filters correctly
const filtered = applyFacultyFilters(faculty, filters);
console.log('Filtered count:', filtered.length);
```

### Issue 4: Import Errors

**Problem:** Cannot find module

**Solution:**
```javascript
// Check import path - adjust based on your file location
// From pages/admin-pages/
import { ... } from '../../utils/admin-utilities/faculty-profile-utils';

// From components/admin-components/
import { ... } from '../../../utils/admin-utilities/faculty-profile-utils';

// Or use absolute imports (if configured)
import { ... } from '@/utils/admin-utilities/faculty-profile-utils';
```

---

## Best Practices

1. **Always validate before submission**
   ```javascript
   const { isValid, errors } = validateFacultyData(formData);
   if (!isValid) return;
   ```

2. **Use constants instead of magic values**
   ```javascript
   // Good
   setTimeout(callback, SEARCH_DEBOUNCE_DELAY);
   
   // Bad
   setTimeout(callback, 500);
   ```

3. **Handle errors gracefully**
   ```javascript
   try {
     const result = someUtilityFunction(data);
   } catch (error) {
     showError(error.message);
   }
   ```

4. **Format data for display**
   ```javascript
   const displayData = formatFacultyForDisplay(rawData);
   ```

5. **Use memoization for expensive operations**
   ```javascript
   const stats = useMemo(() => 
     calculateFacultyStats(faculty), 
     [faculty]
   );
   ```

---

## Next Steps

1. Review the [API Documentation](./UTILITIES_API.md)
2. Check the [Quick Reference](./QUICK_REFERENCE.md)
3. Read the [Refactoring Summary](./REFACTORING_SUMMARY.md)
4. Implement utilities in your components
5. Write tests for your implementations

## Support

For issues or questions:
1. Check the documentation
2. Review existing implementations
3. Check browser console for errors
4. Verify import paths
5. Ensure all dependencies are installed

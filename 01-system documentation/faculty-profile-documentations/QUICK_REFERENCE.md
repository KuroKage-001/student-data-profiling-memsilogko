# Faculty Profile Utilities - Quick Reference

## Import Utilities

```javascript
// Import specific utilities
import { 
  exportFacultyToExcel, 
  validateFacultyData,
  formatFacultyForDisplay,
  SEARCH_DEBOUNCE_DELAY 
} from '../../utils/admin-utilities/faculty-profile-utils';

// Import all utilities
import * as FacultyUtils from '../../utils/admin-utilities/faculty-profile-utils';
```

## Common Functions

### Export to Excel
```javascript
const filename = exportFacultyToExcel(facultyList);
// Returns: "Faculty_List_2026-03-30.xlsx"
```

### Format Faculty Data
```javascript
const formatted = formatFacultyForDisplay(rawFaculty);
// Returns formatted object with N/A for missing fields
```

### Validate Faculty Data
```javascript
const { isValid, errors } = validateFacultyData(formData);
if (!isValid) {
  console.error(errors);
}
```

### Generate Faculty ID
```javascript
const newId = generateFacultyId();
// Returns: "FAC26XXXX" (year + random 4 digits)
```

### Get Status Color
```javascript
const colorClass = getStatusColor('active');
// Returns: "bg-green-100 text-green-800"
```

### Filter Faculty
```javascript
const filtered = filterBySearchTerm(faculty, 'computer');
const sorted = sortFaculty(faculty, 'name', 'asc');
```

### Calculate Statistics
```javascript
const stats = calculateFacultyStats(faculty);
// Returns: { total, active, inactive, byDepartment, etc. }
```

## Constants

```javascript
SEARCH_DEBOUNCE_DELAY    // 500ms
FACULTY_ID_PREFIX        // "FAC"
FACULTY_STATUSES         // { ACTIVE, INACTIVE, ON_LEAVE, RETIRED }
DEPARTMENTS              // Array of department names
POSITIONS                // Array of position titles
```

## File Organization

```
faculty-profile-utils/
├── index.js              # Central exports
├── constants.js          # All constants
├── formatters.js         # Display formatting
├── validators.js         # Data validation
├── generators.js         # ID/filename generation
├── exportHelpers.js      # Excel export
├── filterHelpers.js      # Filtering/sorting
└── statisticsHelpers.js  # Statistics
```

## Usage in Components

### In FacultyProfiles.jsx
```javascript
import { exportFacultyToExcel, SEARCH_DEBOUNCE_DELAY } from '../../utils/admin-utilities/faculty-profile-utils';

// Export handler
const handleExport = () => {
  const filename = exportFacultyToExcel(faculty);
  showSuccess(`Exported as ${filename}`);
};

// Search with debounce
useEffect(() => {
  const timer = setTimeout(() => {
    searchFaculty(searchTerm, filters);
  }, SEARCH_DEBOUNCE_DELAY);
  return () => clearTimeout(timer);
}, [searchTerm, filters]);
```

### In Custom Hooks
```javascript
import { validateFacultyData, formatFacultyForDisplay } from '../../utils/admin-utilities/faculty-profile-utils';

const useFacultyForm = () => {
  const validate = (data) => {
    return validateFacultyData(data);
  };
  
  const format = (data) => {
    return formatFacultyForDisplay(data);
  };
  
  return { validate, format };
};
```

## Error Handling

All utility functions include error handling:

```javascript
try {
  const filename = exportFacultyToExcel(faculty);
  showSuccess(`Exported: ${filename}`);
} catch (error) {
  showError(error.message);
}
```

## Best Practices

1. Always validate data before submission
2. Use constants instead of magic numbers
3. Handle errors gracefully
4. Format data for display consistently
5. Use utility functions for common operations
6. Keep components clean and focused

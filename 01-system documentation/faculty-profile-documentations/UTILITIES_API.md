# Faculty Profile Utilities API Documentation

## Table of Contents
1. [Constants](#constants)
2. [Formatters](#formatters)
3. [Validators](#validators)
4. [Generators](#generators)
5. [Export Helpers](#export-helpers)
6. [Filter Helpers](#filter-helpers)
7. [Statistics Helpers](#statistics-helpers)

---

## Constants

### FACULTY_STATUSES
```javascript
{
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  RETIRED: 'retired'
}
```

### FACULTY_STATUS_LABELS
```javascript
{
  active: 'Active',
  inactive: 'Inactive',
  on_leave: 'On Leave',
  retired: 'Retired'
}
```

### FACULTY_STATUS_COLORS
```javascript
{
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  on_leave: 'bg-yellow-100 text-yellow-800',
  retired: 'bg-gray-100 text-gray-800'
}
```

### DEPARTMENTS
```javascript
[
  'Computer Science',
  'Information Technology',
  'Engineering',
  'Business Administration',
  'Education',
  'Arts and Sciences',
  'Nursing',
  'Other'
]
```

### POSITIONS
```javascript
[
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Instructor',
  'Lecturer',
  'Adjunct Faculty',
  'Visiting Professor',
  'Research Fellow'
]
```

### Other Constants
- `SEARCH_DEBOUNCE_DELAY`: 500 (ms)
- `FACULTY_ID_PREFIX`: "FAC"
- `EXCEL_COLUMN_WIDTHS`: Object with column width specifications
- `DATE_FORMAT_OPTIONS`: Date formatting options

---

## Formatters

### formatFacultyForDisplay(faculty)
Formats raw faculty data for display with N/A fallbacks.

**Parameters:**
- `faculty` (Object): Raw faculty data

**Returns:** Object with formatted fields

**Example:**
```javascript
const formatted = formatFacultyForDisplay(rawFaculty);
// { id, faculty_id, name, email, phone, ... }
```

### formatDate(dateString)
Formats date string to readable format.

**Parameters:**
- `dateString` (String): ISO date string

**Returns:** String (e.g., "Mar 30, 2026")

**Example:**
```javascript
const date = formatDate('2026-03-30');
// "Mar 30, 2026"
```

### getStatusColor(status)
Returns Tailwind CSS classes for status badge.

**Parameters:**
- `status` (String): Faculty status

**Returns:** String (Tailwind classes)

**Example:**
```javascript
const color = getStatusColor('active');
// "bg-green-100 text-green-800"
```

### getStatusLabel(status)
Returns human-readable status label.

**Parameters:**
- `status` (String): Faculty status

**Returns:** String

**Example:**
```javascript
const label = getStatusLabel('on_leave');
// "On Leave"
```

### formatFacultyForExport(faculty, index)
Formats faculty data for Excel export.

**Parameters:**
- `faculty` (Object): Faculty data
- `index` (Number): Row index

**Returns:** Object with export-ready fields

### formatPhoneNumber(phone)
Formats phone number (optional enhancement).

**Parameters:**
- `phone` (String): Raw phone number

**Returns:** String (formatted phone)

---

## Validators

### validateFacultyData(facultyData)
Comprehensive validation of faculty data.

**Parameters:**
- `facultyData` (Object): Faculty form data

**Returns:** Object `{ isValid: Boolean, errors: Object }`

**Example:**
```javascript
const { isValid, errors } = validateFacultyData(formData);
if (!isValid) {
  console.error(errors);
  // { name: "Name is required", email: "Invalid email format" }
}
```

**Validation Rules:**
- Name: Required, min 2 characters
- Email: Required, valid format
- Phone: Optional, valid format if provided
- Department: Required
- Position: Required
- Hire Date: Optional, cannot be future date

### isValidEmail(email)
Validates email format.

**Parameters:**
- `email` (String): Email address

**Returns:** Boolean

### isValidPhone(phone)
Validates phone format.

**Parameters:**
- `phone` (String): Phone number

**Returns:** Boolean

### hasRequiredFields(facultyData)
Checks if all required fields are present.

**Parameters:**
- `facultyData` (Object): Faculty data

**Returns:** Boolean

---

## Generators

### generateFacultyId()
Generates unique faculty ID.

**Returns:** String (e.g., "FAC26XXXX")

**Example:**
```javascript
const id = generateFacultyId();
// "FAC264523"
```

### generateExportFilename(prefix)
Generates filename with timestamp.

**Parameters:**
- `prefix` (String): Filename prefix (default: "Faculty_List")

**Returns:** String (e.g., "Faculty_List_2026-03-30.xlsx")

### generateReportFilename(facultyName)
Generates PDF report filename.

**Parameters:**
- `facultyName` (String): Faculty member name

**Returns:** String (e.g., "Faculty_Report_John_Doe_2026-03-30.pdf")

---

## Export Helpers

### exportFacultyToExcel(faculty, filename)
Exports faculty list to Excel file.

**Parameters:**
- `faculty` (Array): Faculty list
- `filename` (String): Optional custom filename

**Returns:** String (filename)

**Throws:** Error if no data or export fails

**Example:**
```javascript
try {
  const filename = exportFacultyToExcel(facultyList);
  console.log(`Exported: ${filename}`);
} catch (error) {
  console.error(error.message);
}
```

### exportFilteredFaculty(faculty, filters, filename)
Exports filtered faculty data.

**Parameters:**
- `faculty` (Array): Faculty list
- `filters` (Object): Filter criteria
- `filename` (String): Optional custom filename

**Returns:** String (filename)

---

## Filter Helpers

### filterBySearchTerm(faculty, searchTerm)
Filters faculty by search term.

**Parameters:**
- `faculty` (Array): Faculty list
- `searchTerm` (String): Search query

**Returns:** Array (filtered faculty)

**Searches:** name, email, faculty_id, department, position, specialization

### applyFacultyFilters(faculty, filters)
Applies multiple filters to faculty list.

**Parameters:**
- `faculty` (Array): Faculty list
- `filters` (Object): `{ department, position, status }`

**Returns:** Array (filtered faculty)

**Example:**
```javascript
const filtered = applyFacultyFilters(faculty, {
  department: 'Computer Science',
  position: 'Professor',
  status: 'active'
});
```

### getUniqueDepartments(faculty)
Extracts unique departments from faculty list.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Array (sorted department names)

### getUniquePositions(faculty)
Extracts unique positions from faculty list.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Array (sorted position titles)

### getUniqueStatuses(faculty)
Extracts unique statuses from faculty list.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Array (sorted statuses)

### sortFaculty(faculty, sortBy, sortOrder)
Sorts faculty by specified field.

**Parameters:**
- `faculty` (Array): Faculty list
- `sortBy` (String): Field name (default: 'name')
- `sortOrder` (String): 'asc' or 'desc' (default: 'asc')

**Returns:** Array (sorted faculty)

**Example:**
```javascript
const sorted = sortFaculty(faculty, 'name', 'asc');
```

---

## Statistics Helpers

### calculateFacultyStats(faculty)
Calculates comprehensive faculty statistics.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Object with statistics

**Example:**
```javascript
const stats = calculateFacultyStats(faculty);
// {
//   total: 50,
//   active: 45,
//   inactive: 3,
//   onLeave: 2,
//   retired: 0,
//   byDepartment: { 'Computer Science': 15, ... },
//   byPosition: { 'Professor': 10, ... },
//   averageYearsOfService: 8.5
// }
```

### getFacultyCountByDepartment(faculty)
Counts faculty by department.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Object (department counts)

### getFacultyCountByPosition(faculty)
Counts faculty by position.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Object (position counts)

### getFacultyCountByStatus(faculty)
Counts faculty by status.

**Parameters:**
- `faculty` (Array): Faculty list

**Returns:** Object (status counts)

### calculateYearsOfService(hireDate)
Calculates years of service from hire date.

**Parameters:**
- `hireDate` (String): Hire date

**Returns:** Number (years)

**Example:**
```javascript
const years = calculateYearsOfService('2020-01-15');
// 6
```

---

## Error Handling

All functions include error handling:

```javascript
try {
  const result = someUtilityFunction(data);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error appropriately
}
```

## Type Safety

For TypeScript projects, consider adding type definitions:

```typescript
interface Faculty {
  id: number;
  faculty_id: string;
  name: string;
  email: string;
  // ... other fields
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
```

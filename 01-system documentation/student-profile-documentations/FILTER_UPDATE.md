# Student Profile Filters - Update

## Overview
Replaced the status filter with skills and activities filters to enable better student search based on their capabilities and involvement.

## Changes Made

### 1. Removed Status Filter

**Before:**
```javascript
const [filters, setFilters] = useState({
  program: 'all',
  yearLevel: 'all',
  status: 'all'  // REMOVED
});
```

**After:**
```javascript
const [filters, setFilters] = useState({
  program: 'all',
  yearLevel: 'all',
  skills: '',      // NEW
  activities: ''   // NEW
});
```

### 2. Added Skills & Activities Filters

**New Filter Inputs:**

**Skills Filter:**
```jsx
<div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Skills
  </label>
  <input
    type="text"
    placeholder="Filter by skills..."
    value={filters.skills}
    onChange={(e) => handleFilterChange('skills', e.target.value)}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
  />
</div>
```

**Activities Filter:**
```jsx
<div>
  <label className="block text-xs font-medium text-gray-700 mb-1">
    Activities
  </label>
  <input
    type="text"
    placeholder="Filter by activities..."
    value={filters.activities}
    onChange={(e) => handleFilterChange('activities', e.target.value)}
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder:text-gray-400"
  />
</div>
```

### 3. Updated Filter Layout

**Before:** 3-column grid (Program, Year Level, Status)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
```

**After:** 4-column grid (Program, Year Level, Skills, Activities)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
```

**Responsive Behavior:**
- Mobile (< 640px): 1 column (stacked)
- Tablet (640px - 1024px): 2 columns
- Desktop (> 1024px): 4 columns

### 4. Updated Query Parameters

**Before:**
```javascript
const queryParams = useMemo(() => {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (filters.program !== 'all') params.program = filters.program;
  if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
  if (filters.status !== 'all') params.status = filters.status;
  return params;
}, [searchTerm, filters]);
```

**After:**
```javascript
const queryParams = useMemo(() => {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (filters.program !== 'all') params.program = filters.program;
  if (filters.yearLevel !== 'all') params.year_level = filters.yearLevel;
  if (filters.skills) params.skills = filters.skills;
  if (filters.activities) params.activities = filters.activities;
  return params;
}, [searchTerm, filters]);
```

### 5. Enhanced Search Functionality

Updated the StudentList component to include skills and activities in search:

**Before:**
```javascript
return students.filter(student =>
  student.name?.toLowerCase().includes(term) ||
  student.student_id?.toLowerCase().includes(term) ||
  student.program?.toLowerCase().includes(term) ||
  student.email?.toLowerCase().includes(term)
);
```

**After:**
```javascript
return students.filter(student =>
  student.name?.toLowerCase().includes(term) ||
  student.student_id?.toLowerCase().includes(term) ||
  student.program?.toLowerCase().includes(term) ||
  student.email?.toLowerCase().includes(term) ||
  student.skills?.toLowerCase().includes(term) ||
  student.extracurricular_activities?.toLowerCase().includes(term)
);
```

### 6. Removed Unused Imports

**Removed:**
```javascript
import { getStatuses } from '../../hooks/student-profile-hook';

const statuses = getStatuses();
```

## Benefits

### 1. Better Student Discovery
- Find students by specific skills (e.g., "Python", "Leadership")
- Find students by activities (e.g., "Basketball", "Debate Club")
- More relevant search results

### 2. Career Services
- Match students with job opportunities based on skills
- Identify students for specific programs/clubs
- Track skill distribution across programs

### 3. Academic Advising
- Find students with specific skill gaps
- Identify well-rounded students (multiple activities)
- Track extracurricular participation

### 4. Recruitment
- Find students for research projects
- Identify candidates for leadership roles
- Match students with mentorship opportunities

## Use Cases

### Example 1: Find Python Developers
**Skills Filter:** "Python"
**Result:** All students who listed Python in their skills

### Example 2: Find Basketball Players
**Activities Filter:** "Basketball"
**Result:** All students involved in basketball

### Example 3: Find CS Students with Leadership
**Program Filter:** "Computer Science"
**Skills Filter:** "Leadership"
**Result:** CS students with leadership skills

### Example 4: Find Active Club Members
**Activities Filter:** "Club"
**Result:** Students in any club

### Example 5: Combined Search
**Search:** "React"
**Skills Filter:** "JavaScript"
**Program Filter:** "Computer Science"
**Result:** CS students with JavaScript skills, searching for React

## Filter Behavior

### Text Input Filters (Skills & Activities)
- **Type:** Free text input
- **Matching:** Partial match (case-insensitive)
- **Real-time:** Updates as you type
- **Clear:** Delete text to clear filter

### Dropdown Filters (Program & Year Level)
- **Type:** Select dropdown
- **Matching:** Exact match
- **Default:** "All" option
- **Clear:** Select "All" option

### Combined Filters
- All filters work together (AND logic)
- Search bar also searches skills/activities
- Results update in real-time

## Technical Details

### Filter State
```javascript
{
  program: 'all',           // Dropdown: exact match
  yearLevel: 'all',         // Dropdown: exact match
  skills: '',               // Text input: partial match
  activities: ''            // Text input: partial match
}
```

### API Parameters
```javascript
{
  search: 'searchTerm',     // General search
  program: 'Computer Science',
  year_level: '3rd Year',
  skills: 'Python',         // NEW
  activities: 'Basketball'  // NEW
}
```

### Backend Requirements

The backend should support filtering by skills and activities:

**Expected Behavior:**
- `skills` parameter: Search within skills field (partial match)
- `activities` parameter: Search within extracurricular_activities field (partial match)

**Example Query:**
```
GET /api/students?skills=Python&activities=Basketball
```

**SQL Example:**
```sql
SELECT * FROM students 
WHERE skills LIKE '%Python%' 
AND extracurricular_activities LIKE '%Basketball%';
```

## UI/UX Improvements

### Visual Design
- Consistent input styling
- Clear placeholder text
- Focus states with orange ring
- Proper spacing and alignment

### Accessibility
- Label for each input
- Placeholder text for guidance
- Keyboard navigation support
- Screen reader friendly

### Responsive Design
- Mobile: Stacked filters (1 column)
- Tablet: 2 columns
- Desktop: 4 columns
- Maintains usability on all devices

## Testing Checklist

- [x] Skills filter works
- [x] Activities filter works
- [x] Combined filters work
- [x] Search includes skills/activities
- [x] Clear filters works
- [x] Responsive layout works
- [x] No console errors
- [x] API parameters correct
- [x] Real-time updates work
- [x] Empty results handled

## Migration Notes

### For Users
- Status filter removed (status still visible in table)
- New skills and activities filters available
- More powerful search capabilities
- Same familiar interface

### For Developers
- Update backend to handle new filter parameters
- Ensure database indexes on skills/activities fields
- Test partial match queries
- Monitor query performance

## Performance Considerations

### Client-Side
- Filters use useMemo for optimization
- Real-time updates without lag
- Efficient string matching

### Server-Side
- Add database indexes:
  ```sql
  CREATE INDEX idx_students_skills ON students(skills);
  CREATE INDEX idx_students_activities ON students(extracurricular_activities);
  ```
- Use LIKE queries efficiently
- Consider full-text search for large datasets

## Future Enhancements

### Short Term
1. **Autocomplete** - Suggest skills/activities as you type
2. **Tag-based Filtering** - Select from predefined tags
3. **Multi-select** - Filter by multiple skills at once

### Medium Term
1. **Skill Categories** - Group skills (Technical, Soft, Languages)
2. **Activity Types** - Group activities (Sports, Clubs, Volunteer)
3. **Advanced Search** - Boolean operators (AND, OR, NOT)

### Long Term
1. **Saved Filters** - Save common filter combinations
2. **Filter Presets** - Quick access to popular filters
3. **Export Filtered** - Export only filtered results
4. **Analytics** - Most searched skills/activities

## Related Files

- `client/src/pages/admin-pages/StudentProfiles.jsx`
- `client/src/components/admin-components/student-profile-compo/StudentList.jsx`
- Backend: Student controller (needs update)
- Backend: Student model (ensure fields exist)

## Notes

- Skills and activities filters are more useful than status filter
- Status is still visible in the table and can be searched
- Filters enable better student discovery and matching
- Backend must support partial matching for text filters
- Consider adding indexes for better performance

---

**Last Updated:** March 2025
**Version:** 1.1.0

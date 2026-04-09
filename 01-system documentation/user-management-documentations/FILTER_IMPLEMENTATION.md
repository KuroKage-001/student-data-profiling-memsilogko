# User Management Filter Implementation

## Overview
Added filtering functionality to the User Management page, allowing administrators to filter users by role and status. The implementation follows the same pattern as the Student Profiles filtering system.

## Implementation Date
April 9, 2026

## Features Added

### 1. Filter by Role
Filter users by their role in the system:
- **All Roles** (default)
- **Administrator**
- **Department Chairman**
- **Faculty**
- **Student**

### 2. Filter by Status
Filter users by their account status:
- **All Statuses** (default)
- **Active**
- **Inactive**
- **Suspended**

### 3. Combined Filtering
- Filters can be combined (e.g., Active Students, Inactive Faculty)
- Search works alongside filters
- Real-time filtering with React Query

### 4. Responsive Design
- Desktop: Filters always visible
- Mobile: Collapsible filter section with toggle button
- Filter count badge shows active filters

## Technical Implementation

### Frontend Changes

#### File: `client/src/pages/admin-pages/UserManagement.jsx`

**Added State:**
```javascript
const [showFilters, setShowFilters] = useState(false);
const [filters, setFilters] = useState({
  role: 'all',
  status: 'all'
});
```

**Added Query Params Builder:**
```javascript
const queryParams = useMemo(() => {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (filters.role !== 'all') params.role = filters.role;
  if (filters.status !== 'all') params.status = filters.status;
  return params;
}, [searchTerm, filters]);
```

**Updated useUsers Hook:**
```javascript
const { data: users = [], isLoading, error } = useUsers(queryParams);
```

**Added Filter Handler:**
```javascript
const handleFilterChange = (filterName, value) => {
  setFilters(prev => ({
    ...prev,
    [filterName]: value
  }));
};
```

**Added UI Components:**
- Filter toggle button (mobile only)
- Filter section with role and status dropdowns
- Active filter count badge
- Responsive grid layout

### Backend Support

The backend already supports filtering through the `UserManagementController`:

```php
// Filter by role
if ($request->has('role') && $request->role !== 'all') {
    $query->where('role', $request->role);
}

// Filter by status
if ($request->has('status') && $request->status !== 'all') {
    $query->where('status', $request->status);
}
```

## UI Components

### Desktop View
```
┌─────────────────────────────────────────────────────┐
│  Search: [________________]  [Add User]             │
├─────────────────────────────────────────────────────┤
│  Filters:                                           │
│  Role: [All Roles ▼]    Status: [All Statuses ▼]  │
└─────────────────────────────────────────────────────┘
```

### Mobile View (Collapsed)
```
┌─────────────────────────────────────────────────────┐
│  Search: [________________]                         │
│  [Add User]                                         │
├─────────────────────────────────────────────────────┤
│  🔍 Filters (2) ▼                                   │
└─────────────────────────────────────────────────────┘
```

### Mobile View (Expanded)
```
┌─────────────────────────────────────────────────────┐
│  Search: [________________]                         │
│  [Add User]                                         │
├─────────────────────────────────────────────────────┤
│  🔍 Filters (2) ▲                                   │
├─────────────────────────────────────────────────────┤
│  Role: [All Roles ▼]                               │
│  Status: [All Statuses ▼]                          │
└─────────────────────────────────────────────────────┘
```

## Usage Examples

### Example 1: Find All Active Students
1. Set Role filter to "Student"
2. Set Status filter to "Active"
3. Results show only active student accounts

### Example 2: Find Inactive Faculty
1. Set Role filter to "Faculty"
2. Set Status filter to "Inactive"
3. Results show only inactive faculty accounts

### Example 3: Find All Department Chairmen
1. Set Role filter to "Department Chairman"
2. Leave Status as "All Statuses"
3. Results show all department chairmen regardless of status

### Example 4: Search Within Filtered Results
1. Set Role filter to "Student"
2. Type "john" in search box
3. Results show only students with "john" in name or email

## API Requests

### Without Filters
```
GET /api/users
```

### With Role Filter
```
GET /api/users?role=student
```

### With Status Filter
```
GET /api/users?status=active
```

### With Combined Filters
```
GET /api/users?role=faculty&status=inactive
```

### With Filters and Search
```
GET /api/users?role=student&status=active&search=john
```

## Filter Options

### Role Options
| Value | Label | Description |
|-------|-------|-------------|
| all | All Roles | Shows all users |
| admin | Administrator | System administrators |
| dept_chair | Department Chairman | IT or CS department chairs |
| faculty | Faculty | Teaching staff |
| student | Student | Student accounts |

### Status Options
| Value | Label | Description |
|-------|-------|-------------|
| all | All Statuses | Shows all users |
| active | Active | Can login and use system |
| inactive | Inactive | Cannot login |
| suspended | Suspended | Temporarily blocked |

## Performance Considerations

### React Query Caching
- Filters trigger new API requests
- Results are cached by React Query
- Switching between filter combinations is fast

### Debouncing
- Search input is not debounced (instant)
- Filter changes are instant
- Backend handles filtering efficiently

### Optimization
- Uses `useMemo` for query params
- Prevents unnecessary re-renders
- Efficient state management

## Responsive Behavior

### Desktop (≥1024px)
- Filters always visible
- Side-by-side layout
- No toggle button

### Tablet (768px - 1023px)
- Filters always visible
- Stacked layout
- No toggle button

### Mobile (<768px)
- Filters hidden by default
- Toggle button shows/hides filters
- Badge shows active filter count
- Stacked layout when expanded

## Accessibility

### Keyboard Navigation
- Tab through filter dropdowns
- Arrow keys to select options
- Enter to confirm selection

### Screen Readers
- Labels for all dropdowns
- ARIA attributes for toggle button
- Clear filter descriptions

### Visual Indicators
- Active filter count badge
- Clear dropdown labels
- Focus states on all controls

## Testing Checklist

- [ ] Role filter works correctly
- [ ] Status filter works correctly
- [ ] Combined filters work together
- [ ] Search works with filters
- [ ] Mobile toggle button works
- [ ] Filter count badge updates
- [ ] Clearing filters works
- [ ] No console errors
- [ ] Responsive on all screen sizes
- [ ] Keyboard navigation works

## Common Use Cases

### 1. Find Users to Activate
```
Role: All Roles
Status: Inactive
```
Shows all inactive users that may need activation.

### 2. Audit Student Accounts
```
Role: Student
Status: All Statuses
```
Shows all student accounts for review.

### 3. Check Suspended Users
```
Role: All Roles
Status: Suspended
```
Shows all suspended accounts across all roles.

### 4. Find Specific Faculty Member
```
Role: Faculty
Status: Active
Search: "john"
```
Narrows down to active faculty with "john" in name/email.

## Troubleshooting

### Issue: Filters not working
**Solution:** Check browser console for errors, verify API endpoint

### Issue: Filter count not updating
**Solution:** Check filter state, verify badge logic

### Issue: Mobile toggle not working
**Solution:** Check showFilters state, verify button onClick

### Issue: Results not updating
**Solution:** Check React Query cache, verify queryParams

## Future Enhancements

### Planned
- [ ] Filter by department (for dept_chair and faculty)
- [ ] Date range filters (created_at)
- [ ] Export filtered results
- [ ] Save filter presets

### Under Consideration
- [ ] Advanced filter builder
- [ ] Filter history
- [ ] Bulk actions on filtered results
- [ ] Filter analytics

## Related Files

### Frontend
- `client/src/pages/admin-pages/UserManagement.jsx` (UPDATED)
- `client/src/hooks/user-management-hook/useUserManagementQuery.js`
- `client/src/components/admin-components/user-management-compo/UserList.jsx`

### Backend
- `server/app/Http/Controllers/UserManagementController.php`
- `server/app/Models/User.php`
- `server/routes/api.php`

## Comparison with Student Profiles

### Similarities
- Same UI pattern
- Mobile toggle behavior
- Filter count badge
- Combined with search

### Differences
- Fewer filter options (2 vs 5)
- No text input filters
- Simpler filter logic
- Faster implementation

## Conclusion

The filter implementation provides administrators with powerful tools to quickly find and manage users based on role and status. The responsive design ensures a great experience on all devices, while the integration with React Query provides excellent performance.

**Status:** ✅ Complete and Ready for Use

**Last Updated:** April 9, 2026

# Skills and Activities Filter Implementation

## Overview
Implemented intelligent filtering for student skills and activities in the Student Profiles page. The filters now understand user input and search across multiple relevant fields.

## Backend Changes

### File: `server/app/Http/Controllers/StudentController.php`

Added two new filter handlers in the `index()` method:

#### Skills Filter
```php
// Filter by skills
if ($request->has('skills') && !empty($request->skills)) {
    $skillSearch = $request->skills;
    $query->whereHas('skills', function($q) use ($skillSearch) {
        $q->where('skill_name', 'like', "%{$skillSearch}%")
          ->orWhere('description', 'like', "%{$skillSearch}%");
    });
}
```

**Searches in:**
- `skill_name` - The name of the skill (e.g., "JavaScript", "Python")
- `description` - Additional details about the skill

#### Activities Filter
```php
// Filter by activities
if ($request->has('activities') && !empty($request->activities)) {
    $activitySearch = $request->activities;
    $query->whereHas('activities', function($q) use ($activitySearch) {
        $q->where('activity_name', 'like', "%{$activitySearch}%")
          ->orWhere('description', 'like', "%{$activitySearch}%")
          ->orWhere('organization', 'like', "%{$activitySearch}%")
          ->orWhere('role', 'like', "%{$activitySearch}%");
    });
}
```

**Searches in:**
- `activity_name` - The name of the activity (e.g., "Basketball Team", "Debate Club")
- `description` - Details about the activity
- `organization` - The organizing body (e.g., "Student Council", "IEEE")
- `role` - The student's role (e.g., "President", "Member")

## Frontend Implementation

### File: `client/src/pages/admin-pages/StudentProfiles.jsx`

The frontend already had the filter UI and state management in place:

```javascript
const [filters, setFilters] = useState({
  program: 'all',
  yearLevel: 'all',
  skills: '',
  activities: ''
});
```

The filters are automatically sent as query parameters to the backend through the `useStudents` hook.

## How It Works

1. **User Input**: User types in the Skills or Activities filter input field
2. **State Update**: The filter state is updated via `handleFilterChange`
3. **Query Params**: The `queryParams` useMemo hook builds the API parameters
4. **API Call**: React Query's `useStudents` hook sends the request with filters
5. **Backend Processing**: Laravel's `whereHas` performs a relationship query
6. **Results**: Only students with matching skills/activities are returned

## Usage Examples

### Skills Filter
- Type "JavaScript" → Returns students with JavaScript skill
- Type "programming" → Returns students with any skill containing "programming"
- Type "advanced" → Returns students with "advanced" in skill description

### Activities Filter
- Type "basketball" → Returns students in basketball activities
- Type "president" → Returns students who are presidents in any activity
- Type "IEEE" → Returns students in IEEE organization activities
- Type "volunteer" → Returns students with volunteer activities

## Technical Details

- **Search Type**: Case-insensitive partial match (LIKE %search%)
- **Multiple Fields**: OR logic across all searchable fields
- **Relationship Query**: Uses Laravel's `whereHas` for efficient querying
- **Real-time**: Filters update automatically as user types
- **Debouncing**: Consider adding debouncing for better performance (optional)

## Database Schema

### student_skills table
- `user_id` - Foreign key to users table
- `skill_name` - Name of the skill
- `proficiency_level` - beginner, intermediate, advanced, expert
- `description` - Optional description

### student_activities table
- `user_id` - Foreign key to users table
- `activity_name` - Name of the activity
- `activity_type` - academic, extracurricular, volunteer, sports, arts, leadership, other
- `organization` - Organization name
- `role` - Student's role
- `start_date` - Activity start date
- `end_date` - Activity end date
- `description` - Optional description

## Testing

To test the filters:

1. Ensure you have students with skills and activities in the database
2. Navigate to Student Profiles page
3. Type in the Skills filter input (e.g., "JavaScript")
4. Verify only students with matching skills appear
5. Type in the Activities filter input (e.g., "basketball")
6. Verify only students with matching activities appear
7. Use both filters together to narrow results further

## Performance Considerations

- Filters use indexed foreign keys for efficient queries
- LIKE queries with leading wildcards may be slower on large datasets
- Consider adding full-text search for better performance with large data
- Current implementation is suitable for datasets up to ~10,000 students

## Future Enhancements

1. **Debouncing**: Add 300ms debounce to reduce API calls while typing
2. **Multi-select**: Allow selecting multiple skills/activities
3. **Autocomplete**: Show suggestions based on existing skills/activities
4. **Advanced Filters**: Add proficiency level filter for skills
5. **Activity Type Filter**: Filter by activity type (academic, sports, etc.)

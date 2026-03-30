# Events Utils Quick Reference

## Quick Import Guide

```javascript
// Import everything from barrel export
import { 
  // Constants
  INITIAL_FORM_DATA,
  INITIAL_STATISTICS,
  EVENT_TYPES,
  EVENT_STATUSES,
  FILTER_OPTIONS,
  VIEW_MODES,
  
  // Helpers
  getStatusColor,
  formatEventForForm,
  buildQueryParams,
  parseInputValue,
  validateEventForm,
  
  // Handlers
  fetchEvents,
  fetchStatistics,
  handleEventSubmit,
  handleEventDelete,
  
  // Hooks
  useEventData,
  useEventForm,
} from '../../utils/admin-utilities/events-utils';
```

## Constants

### INITIAL_FORM_DATA
```javascript
{
  title: '',
  date: '',
  time: '',
  location: '',
  type: 'Academic',
  status: 'Upcoming',
  attendees: 0,
  description: '',
}
```

### VIEW_MODES
```javascript
{
  CALENDAR: 'calendar',
  LIST: 'list',
}
```

## Helper Functions

### getStatusColor(status)
```javascript
// Returns Tailwind CSS classes for status badge
const classes = getStatusColor('Upcoming');
// Returns: 'bg-orange-100 text-orange-800'
```

### formatEventForForm(event)
```javascript
// Formats event object for form editing
const formData = formatEventForForm(event);
```

### validateEventForm(formData)
```javascript
// Validates form data
const { isValid, errors } = validateEventForm(formData);
if (!isValid) {
  console.log(errors); // { title: 'Event title is required', ... }
}
```

## Custom Hooks

### useEventData(filterStatus, searchTerm)
```javascript
const { events, statistics, loading, refreshData } = useEventData('All', '');

// Refresh data manually
refreshData();
```

### useEventForm()
```javascript
const { 
  formData,           // Current form state
  editingEvent,       // Event being edited
  handleInputChange,  // Input change handler
  resetForm,          // Reset to initial state
  loadEventForEdit,   // Load event for editing
  setFormDate,        // Set date field
} = useEventForm();

// Load event for editing
loadEventForEdit(event);

// Reset form
resetForm();

// Set date from calendar
setFormDate('2024-03-15');
```

## API Handlers

### handleEventSubmit
```javascript
await handleEventSubmit({
  event: e,                    // Form event
  formData,                    // Form data
  editingEvent,                // Event being edited (null for new)
  setSubmitting,               // Loading state setter
  onSuccess: () => {           // Success callback
    setShowForm(false);
    resetForm();
    refreshData();
  },
});
```

### handleEventDelete
```javascript
await handleEventDelete(eventId, () => {
  refreshData(); // Success callback
});
```

## Common Patterns

### Complete Event Form Setup
```javascript
const Events = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { events, statistics, loading, refreshData } = useEventData(filterStatus, searchTerm);
  const { formData, editingEvent, handleInputChange, resetForm, loadEventForEdit } = useEventForm();
  
  const handleSubmit = async (e) => {
    await handleEventSubmit({
      event: e,
      formData,
      editingEvent,
      setSubmitting,
      onSuccess: () => {
        setShowForm(false);
        resetForm();
        refreshData();
      },
    });
  };
  
  const handleEdit = (event) => {
    loadEventForEdit(event);
    setShowForm(true);
  };
  
  const handleDelete = async (eventId) => {
    await handleEventDelete(eventId, refreshData);
  };
  
  return (
    // JSX...
  );
};
```

### Using Constants
```javascript
// View mode toggle
const [viewMode, setViewMode] = useState(VIEW_MODES.CALENDAR);

// Check view mode
if (viewMode === VIEW_MODES.CALENDAR) {
  // Show calendar
}

// Event types dropdown
EVENT_TYPES.map(type => (
  <option key={type.value} value={type.value}>
    {type.label}
  </option>
))
```

### Form Validation
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const { isValid, errors } = validateEventForm(formData);
  
  if (!isValid) {
    Object.values(errors).forEach(error => toast.error(error));
    return;
  }
  
  // Proceed with submission
  await handleEventSubmit({...});
};
```

## Component Integration

### EventFormModal
```javascript
<EventFormModal
  show={showForm}
  onClose={() => { setShowForm(false); resetForm(); }}
  onSubmit={handleSubmit}
  formData={formData}
  onChange={handleInputChange}
  editingEvent={editingEvent}
  submitting={submitting}
/>
```

### EventListView
```javascript
<EventListView
  events={events}
  onEdit={handleEdit}
  onDelete={handleDelete}
  getStatusColor={getStatusColor}
/>
```

### EventStatistics
```javascript
<EventStatistics statistics={statistics} />
```

## Tips

1. **Always use custom hooks** for data and form management
2. **Use constants** instead of hardcoded strings
3. **Leverage helper functions** for consistent behavior
4. **Use handlers** for API calls to get consistent error handling
5. **Call refreshData()** after any data mutation
6. **Use getStatusColor()** for consistent status badge styling
7. **Validate forms** before submission for better UX

## Error Handling

All handlers include built-in error handling with toast notifications:
- Success: Green toast with success message
- Error: Red toast with error message
- Confirmation: Browser confirm dialog for destructive actions

## Performance Tips

1. `useEventData` automatically re-fetches when dependencies change
2. Use `refreshData()` sparingly to avoid unnecessary API calls
3. Form state is managed locally for better performance
4. Validation is client-side for instant feedback

# Events Utils

Utility functions, constants, and custom hooks for the Events management feature.

## Installation

```javascript
import { 
  getStatusColor, 
  useEventData, 
  useEventForm 
} from '../../utils/admin-utilities/events-utils';
```

## Files

### eventConstants.js
Centralized constants and enums for event management.

**Exports:**
- `INITIAL_FORM_DATA` - Default form state
- `INITIAL_STATISTICS` - Default statistics state
- `EVENT_TYPES` - Event type options
- `EVENT_STATUSES` - Event status options
- `FILTER_OPTIONS` - Filter dropdown options
- `VIEW_MODES` - View mode constants

### eventHelpers.js
Pure helper functions for data transformation and validation.

**Functions:**
- `getStatusColor(status)` - Get status badge CSS classes
- `formatEventForForm(event)` - Format event for form editing
- `buildQueryParams(filterStatus, searchTerm)` - Build API query params
- `parseInputValue(name, value)` - Parse form input values
- `validateEventForm(formData)` - Validate event form data

### eventHandlers.js
API interaction handlers with error handling and notifications.

**Functions:**
- `fetchEvents(filterStatus, searchTerm, setEvents, setLoading)` - Fetch events
- `fetchStatistics(setStatistics)` - Fetch statistics
- `handleEventSubmit({...})` - Handle create/update
- `handleEventDelete(eventId, onSuccess)` - Handle deletion

### useEventData.js
Custom hook for managing event data fetching and state.

**Hook:** `useEventData(filterStatus, searchTerm)`

**Returns:**
- `events` - Array of events
- `statistics` - Statistics object
- `loading` - Loading state
- `refreshData()` - Refresh function

### useEventForm.js
Custom hook for managing event form state.

**Hook:** `useEventForm()`

**Returns:**
- `formData` - Current form data
- `editingEvent` - Event being edited
- `handleInputChange(e)` - Input change handler
- `resetForm()` - Reset form
- `loadEventForEdit(event)` - Load event for editing
- `setFormDate(date)` - Set form date

## Quick Start

```javascript
import { useState } from 'react';
import { 
  getStatusColor, 
  handleEventSubmit, 
  handleEventDelete,
  VIEW_MODES,
  useEventData,
  useEventForm 
} from '../../utils/admin-utilities/events-utils';

const MyComponent = () => {
  // State
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Custom Hooks
  const { events, statistics, loading, refreshData } = useEventData(filterStatus, searchTerm);
  const { formData, editingEvent, handleInputChange, resetForm, loadEventForEdit } = useEventForm();
  
  // Handlers
  const handleSubmit = async (e) => {
    await handleEventSubmit({
      event: e,
      formData,
      editingEvent,
      setSubmitting,
      onSuccess: () => {
        resetForm();
        refreshData();
      },
    });
  };
  
  const handleDelete = async (eventId) => {
    await handleEventDelete(eventId, refreshData);
  };
  
  return (
    // JSX...
  );
};
```

## API Reference

### Constants

#### INITIAL_FORM_DATA
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

#### VIEW_MODES
```javascript
{
  CALENDAR: 'calendar',
  LIST: 'list',
}
```

### Helper Functions

#### getStatusColor(status: string): string
Returns Tailwind CSS classes for status badge.

```javascript
const classes = getStatusColor('Upcoming');
// Returns: 'bg-orange-100 text-orange-800'
```

#### formatEventForForm(event: object): object
Formats event object for form editing.

```javascript
const formData = formatEventForForm(event);
```

#### validateEventForm(formData: object): { isValid: boolean, errors: object }
Validates event form data.

```javascript
const { isValid, errors } = validateEventForm(formData);
if (!isValid) {
  console.log(errors);
}
```

### API Handlers

#### handleEventSubmit(params: object): Promise<boolean>
Handles event creation or update.

**Parameters:**
```javascript
{
  event: Event,              // Form event
  formData: object,          // Form data
  editingEvent: object|null, // Event being edited
  setSubmitting: function,   // Loading state setter
  onSuccess: function,       // Success callback
}
```

**Example:**
```javascript
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
```

#### handleEventDelete(eventId: string|number, onSuccess: function): Promise<boolean>
Handles event deletion with confirmation.

**Example:**
```javascript
await handleEventDelete(eventId, () => {
  refreshData();
});
```

### Custom Hooks

#### useEventData(filterStatus: string, searchTerm: string)
Manages event data fetching and state.

**Returns:**
```javascript
{
  events: Array,
  statistics: object,
  loading: boolean,
  refreshData: function,
}
```

**Example:**
```javascript
const { events, statistics, loading, refreshData } = useEventData('All', '');

// Refresh data
refreshData();
```

#### useEventForm()
Manages event form state.

**Returns:**
```javascript
{
  formData: object,
  editingEvent: object|null,
  handleInputChange: function,
  resetForm: function,
  loadEventForEdit: function,
  setFormDate: function,
}
```

**Example:**
```javascript
const { 
  formData, 
  editingEvent, 
  handleInputChange, 
  resetForm, 
  loadEventForEdit,
  setFormDate 
} = useEventForm();

// Load event for editing
loadEventForEdit(event);

// Reset form
resetForm();

// Set date from calendar
setFormDate('2024-03-15');
```

## Testing

### Unit Tests
```javascript
import { getStatusColor, validateEventForm } from './eventHelpers';

describe('eventHelpers', () => {
  test('getStatusColor returns correct classes', () => {
    expect(getStatusColor('Upcoming')).toBe('bg-orange-100 text-orange-800');
  });
  
  test('validateEventForm validates required fields', () => {
    const { isValid, errors } = validateEventForm({});
    expect(isValid).toBe(false);
    expect(errors.title).toBeDefined();
  });
});
```

### Hook Tests
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useEventForm } from './useEventForm';

describe('useEventForm', () => {
  test('resets form to initial state', () => {
    const { result } = renderHook(() => useEventForm());
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.formData.title).toBe('');
    expect(result.current.editingEvent).toBeNull();
  });
});
```

## Best Practices

1. Always use custom hooks for data and form management
2. Import from barrel export (index.js) for cleaner imports
3. Use constants instead of hardcoded strings
4. Leverage helper functions for consistent behavior
5. Call refreshData() after any data mutation
6. Use getStatusColor() for consistent status badge styling
7. Validate forms before submission

## Error Handling

All handlers include built-in error handling:
- Success: Toast notification with success message
- Error: Toast notification with error message
- Confirmation: Browser confirm dialog for destructive actions

## Dependencies

- `react` - For hooks
- `react-toastify` - For notifications
- `../../../services/system-service/apiService` - For API calls

## License

Internal use only.

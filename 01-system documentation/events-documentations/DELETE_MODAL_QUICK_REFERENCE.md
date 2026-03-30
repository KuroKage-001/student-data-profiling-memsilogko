# Event Delete Modal - Quick Reference

## Component Location
```
client/src/components/admin-components/event-compo/EventDeleteModal.jsx
```

## Usage in Events.jsx

### Import
```javascript
import { EventDeleteModal } from '../../components/admin-components/event-compo';
```

### State Setup
```javascript
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [eventToDelete, setEventToDelete] = useState(null);
const [deleting, setDeleting] = useState(false);
```

### Handlers
```javascript
// Open modal
const handleDelete = (event) => {
  setEventToDelete(event);
  setShowDeleteModal(true);
};

// Confirm deletion
const handleConfirmDelete = async () => {
  if (!eventToDelete) return;
  setDeleting(true);
  try {
    await handleEventDelete(eventToDelete.id, refreshData);
    setShowDeleteModal(false);
    setEventToDelete(null);
  } catch (error) {
    console.error('Failed to delete event:', error);
  } finally {
    setDeleting(false);
  }
};

// Close modal
const handleCloseDeleteModal = () => {
  setShowDeleteModal(false);
  setEventToDelete(null);
};
```

### JSX
```jsx
{showDeleteModal && (
  <EventDeleteModal
    isOpen={showDeleteModal}
    onClose={handleCloseDeleteModal}
    onConfirm={handleConfirmDelete}
    event={eventToDelete}
    loading={deleting}
  />
)}
```

## Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | function | Yes | Called when modal should close |
| `onConfirm` | function | Yes | Called when delete is confirmed |
| `event` | object | Yes | Event object to delete |
| `loading` | boolean | Yes | Shows loading state during deletion |

## Event Object Structure

The modal expects an event object with these properties:
```javascript
{
  id: number,           // Event ID
  title: string,        // Event title
  description: string,  // Event description (optional)
  date: string,         // Event date
  time: string,         // Event time
  location: string      // Event location
}
```

## Visual Structure

```
┌─────────────────────────────────────┐
│ Confirm Delete                    × │ ← Red header
├─────────────────────────────────────┤
│ ⚠️  Delete Event                    │
│     This action cannot be undone    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Are you sure you want to delete │ │
│ │ this event?                     │ │
│ │                                 │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ 📅 Event Title              │ │ │
│ │ │    Event description...     │ │ │
│ │ │ ─────────────────────────── │ │ │
│ │ │ 🕐 2024-03-15 • 10:00 AM   │ │ │
│ │ │ 📍 Main Hall               │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ Cancel ]  [ Delete Event ]        │
└─────────────────────────────────────┘
```

## Color Scheme

- **Header**: Red gradient (`from-red-500 to-red-600`)
- **Warning Icon**: Red (`text-red-600` on `bg-red-100`)
- **Delete Button**: Red gradient (`from-red-600 to-red-500`)
- **Cancel Button**: Gray border (`border-gray-300`)

## States

### Normal State
- All buttons enabled
- Delete button shows "Delete Event"

### Loading State
- All buttons disabled
- Delete button shows "Deleting..."
- Opacity reduced on disabled buttons

### Closed State
- Modal returns `null` if `!isOpen || !event`

## Integration Points

### EventListView
```javascript
// Pass entire event object
<button onClick={() => onDelete(event)}>
  Delete
</button>
```

### EventCalendar
```javascript
// Can be integrated similarly
<button onClick={() => onDelete(event)}>
  Delete
</button>
```

## Best Practices

1. **Always pass the full event object** - Not just the ID
2. **Handle loading state** - Disable buttons during deletion
3. **Clear state on close** - Reset both modal and event states
4. **Error handling** - Use try-catch for deletion
5. **User feedback** - Consider adding toast notifications

## Common Issues & Solutions

### Issue: Modal doesn't show
**Solution:** Check that both `showDeleteModal` and `eventToDelete` are set

### Issue: Event details not displaying
**Solution:** Ensure the event object has all required properties

### Issue: Delete button stays in loading state
**Solution:** Make sure `finally` block resets `deleting` state

### Issue: Modal doesn't close after deletion
**Solution:** Verify `setShowDeleteModal(false)` is called in success handler

## Keyboard Shortcuts

- **ESC**: Close modal (click backdrop)
- **Tab**: Navigate between buttons
- **Enter**: Activate focused button

## Accessibility

- Modal has proper ARIA labels
- Backdrop is marked `aria-hidden="true"`
- Modal has `role="dialog"` and `aria-modal="true"`
- Focus management handled automatically

## Mobile Responsiveness

- Full-width on small screens
- Proper padding and spacing
- Touch-friendly button sizes
- Scrollable content if needed

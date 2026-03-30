# Events Page - Pagination and Sorting Update

## Overview
Enhanced the Events page with year navigation in the calendar view and added pagination with column sorting in the list view, following the UserManagement page pattern.

## Changes Made

### 1. EventCalendar Component (`EventCalendar.jsx`)

#### Year Navigation
Added quick year navigation buttons to easily jump between years:

- **Previous Year Button** (<<): Navigate backward one year
- **Next Year Button** (>>): Navigate forward one year
- Positioned alongside existing month navigation buttons
- Uses `FaAngleDoubleLeft` and `FaAngleDoubleRight` icons

**Implementation:**
```javascript
const navigatePrevYear = () => {
  const calendarApi = calendarRef.current?.getApi();
  if (calendarApi) {
    const currentDate = calendarApi.getDate();
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    calendarApi.gotoDate(currentDate);
  }
};

const navigateNextYear = () => {
  const calendarApi = calendarRef.current?.getApi();
  if (calendarApi) {
    const currentDate = calendarApi.getDate();
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    calendarApi.gotoDate(currentDate);
  }
};
```

**UI Layout:**
```
[<<] [<] [Today] [>] [>>] Month Year
```

### 2. EventListView Component (`EventListView.jsx`)

#### Pagination Feature
Added pagination similar to UserManagement:

- **Items per page**: 10 events
- **Desktop pagination**: Full page numbers with ellipsis for large page counts
- **Mobile pagination**: Simple Previous/Next buttons
- **Page info**: Shows "Showing X to Y of Z results"
- **Auto-reset**: Returns to page 1 when sorting changes

#### Column Sorting Feature
Added sortable columns with visual indicators:

**Sortable Columns:**
1. Event (title)
2. Date & Time (date)
3. Location
4. Type
5. Status
6. Attendees (numeric)

**Sort Icons:**
- `FaSort`: Default state (not sorted)
- `FaSortUp`: Ascending order (orange)
- `FaSortDown`: Descending order (orange)

**Features:**
- Click column header to sort
- First click: Ascending order
- Second click: Descending order
- Visual feedback with orange highlight on active sort
- Hover effect on column headers
- Smart sorting:
  - Date fields: Chronological order
  - Numbers: Numeric order
  - Text: Alphabetical order (case-insensitive)

**Implementation:**
```javascript
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

const handleSort = (key) => {
  setSortConfig(prevConfig => ({
    key,
    direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
  }));
};
```

## User Experience

### Calendar View
- Users can now quickly navigate between years without clicking through months
- Tooltips on year navigation buttons for clarity
- Maintains existing month navigation and view switching

### List View
- Cleaner data presentation with pagination
- Easy sorting by clicking column headers
- Visual feedback for current sort state
- Responsive design maintained for mobile devices
- Consistent with UserManagement page UX

## Technical Details

### State Management
```javascript
// EventListView.jsx
const [currentPage, setCurrentPage] = useState(1);
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
const itemsPerPage = 10;
```

### Sorting Logic
- Uses `useMemo` for performance optimization
- Handles different data types (strings, dates, numbers)
- Case-insensitive string comparison
- Proper date parsing for chronological sorting

### Pagination Logic
- Calculates total pages based on filtered/sorted data
- Slices data for current page display
- Smart page number display (shows first, last, current, and adjacent pages)
- Prevents navigation beyond valid page range

## Benefits

1. **Improved Navigation**: Year buttons make it easy to view events far in the future or past
2. **Better Data Management**: Pagination prevents overwhelming users with large event lists
3. **Enhanced Usability**: Sorting allows users to organize events by any column
4. **Consistent UX**: Matches the UserManagement page design patterns
5. **Performance**: Efficient rendering with pagination and memoized sorting
6. **Responsive**: Works seamlessly on desktop and mobile devices

## Testing Recommendations

1. Test year navigation with events spanning multiple years
2. Verify sorting works correctly for all column types
3. Test pagination with various event counts (< 10, exactly 10, > 10, > 100)
4. Confirm mobile responsiveness for both pagination and sorting
5. Verify sort state persists when switching between pages
6. Test edge cases (empty events, single event, etc.)

# Dynamic Page Title Implementation

## Overview
The application now features dynamic page titles that update based on the current page being viewed. This improves user experience and browser tab management.

## Implementation

### Custom Hook: `usePageTitle`
**Location:** `client/src/hooks/usePageTitle.js`

```javascript
import { useEffect } from 'react';

const usePageTitle = (title, suffix = 'CCS PROFILING SYSTEM') => {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${title} | ${suffix}`;
    } else {
      document.title = suffix;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

export default usePageTitle;
```

### Features
- Automatically updates the browser tab title when navigating between pages
- Format: `[Page Name] | CCS PROFILING SYSTEM`
- Cleans up on component unmount
- Customizable suffix (defaults to "CCS PROFILING SYSTEM")

## Usage in Pages

### Basic Usage
```javascript
import usePageTitle from '../../hooks/usePageTitle';

const MyPage = () => {
  usePageTitle('My Page Name');
  
  return (
    // Component JSX
  );
};
```

### Custom Suffix
```javascript
usePageTitle('Dashboard', 'Custom System Name');
// Result: "Dashboard | Custom System Name"
```

## Pages Updated

### System Pages
| Page | Title |
|------|-------|
| HomePage | `Home \| CCS PROFILING SYSTEM` |
| LoginPage | `Login \| CCS PROFILING SYSTEM` |
| UserProfileSettings | `Profile Settings \| CCS PROFILING SYSTEM` |

### Admin Pages
| Page | Title |
|------|-------|
| AdminDashboard | `Dashboard \| CCS PROFILING SYSTEM` |
| UserManagement | `User Management \| CCS PROFILING SYSTEM` |
| StudentProfiles | `Student Profiles \| CCS PROFILING SYSTEM` |
| FacultyProfiles | `Faculty Profiles \| CCS PROFILING SYSTEM` |
| Events | `Events \| CCS PROFILING SYSTEM` |
| Scheduling | `Scheduling \| CCS PROFILING SYSTEM` |
| Research | `Research \| CCS PROFILING SYSTEM` |
| InstructionsPage | `Instructions \| CCS PROFILING SYSTEM` |

## Benefits

1. **Better User Experience**: Users can easily identify which page they're on when multiple tabs are open
2. **Browser History**: Page titles appear in browser history for easier navigation
3. **Bookmarks**: Bookmarked pages have descriptive titles
4. **SEO**: Better search engine optimization (if pages become public)
5. **Accessibility**: Screen readers announce page titles when navigating

## Technical Details

### How It Works
1. The hook uses React's `useEffect` to update `document.title` when the component mounts
2. The title updates whenever the `title` or `suffix` parameters change
3. On unmount, the previous title is restored (cleanup function)
4. Each page component calls the hook with its specific title

### Performance
- Minimal performance impact (single DOM operation per page load)
- No re-renders triggered
- Cleanup prevents memory leaks

## Adding to New Pages

When creating a new page, simply:

1. Import the hook:
```javascript
import usePageTitle from '../../hooks/usePageTitle';
```

2. Call it at the top of your component:
```javascript
const MyNewPage = () => {
  usePageTitle('My New Page');
  
  // Rest of component
};
```

## Customization

### Change Default Suffix
To change the default suffix for all pages, modify the hook:

```javascript
const usePageTitle = (title, suffix = 'YOUR NEW SUFFIX') => {
  // ...
};
```

### Page-Specific Suffix
For a specific page with a different suffix:

```javascript
usePageTitle('Special Page', 'Different System Name');
```

### Title Only (No Suffix)
To show only the title without a suffix:

```javascript
usePageTitle('Page Name', '');
// Result: "Page Name"
```

## Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- No polyfills required
- Uses standard DOM API (`document.title`)

## Testing

### Manual Testing
1. Navigate to each page
2. Check the browser tab title
3. Verify format: `[Page Name] | CCS PROFILING SYSTEM`
4. Open multiple tabs and verify each shows correct title

### Expected Results
- Home page: "Home | CCS PROFILING SYSTEM"
- Login page: "Login | CCS PROFILING SYSTEM"
- Dashboard: "Dashboard | CCS PROFILING SYSTEM"
- User Management: "User Management | CCS PROFILING SYSTEM"
- And so on...

## Future Enhancements

1. **Dynamic User Info**: Include user name in title for personalized pages
   ```javascript
   usePageTitle(`${userName}'s Profile`);
   ```

2. **Notification Badges**: Add unread count to title
   ```javascript
   usePageTitle(`(${unreadCount}) Dashboard`);
   ```

3. **Breadcrumb Titles**: Show navigation path
   ```javascript
   usePageTitle('User Details', 'Admin > Users > CCS PROFILING SYSTEM');
   ```

4. **Internationalization**: Support multiple languages
   ```javascript
   usePageTitle(t('dashboard.title'));
   ```

## Troubleshooting

### Title Not Updating
- Ensure the hook is called inside the component (not outside)
- Check that the component is actually rendering
- Verify no other code is overwriting `document.title`

### Title Persists After Navigation
- This shouldn't happen due to cleanup function
- If it does, check React Router configuration
- Ensure components are properly unmounting

### Special Characters
- The hook handles special characters automatically
- No encoding needed for most characters
- Emojis are supported: `usePageTitle('📊 Dashboard')`

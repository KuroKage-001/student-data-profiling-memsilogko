# User Profile Settings - Skeleton Loading Quick Reference

## Quick Start

### Import
```jsx
import { UserProfileSettingsSkeleton } from '../../layouts/skeleton-loading';
```

### Usage
```jsx
const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { profile, loading } = useUserProfile();

  if (loading && !profile) {
    return (
      <AdminLayout hideSidebar>
        <UserProfileSettingsSkeleton activeTab={activeTab} />
      </AdminLayout>
    );
  }

  return <ActualContent />;
};
```

## Components

### UserProfileSettingsSkeleton
Main skeleton component for the entire page.

**Props:**
- `activeTab` (optional): 'profile' or 'password' - defaults to 'profile'

**Example:**
```jsx
<UserProfileSettingsSkeleton activeTab="profile" />
<UserProfileSettingsSkeleton activeTab="password" />
```

### ProfileTabSkeleton
Skeleton for Profile Information tab.

**Usage:**
```jsx
import { ProfileTabSkeleton } from '../../layouts/skeleton-loading';

<ProfileTabSkeleton />
```

### PasswordTabSkeleton
Skeleton for Change Password tab.

**Usage:**
```jsx
import { PasswordTabSkeleton } from '../../layouts/skeleton-loading';

<PasswordTabSkeleton />
```

## File Locations

```
client/src/layouts/skeleton-loading/
├── UserProfileSettingsSkeleton.jsx    ← Main skeleton
├── ProfileTabSkeleton.jsx             ← Profile tab
└── PasswordTabSkeleton.jsx            ← Password tab
```

## When to Show Skeleton

### Show Skeleton ✅
```jsx
// Initial load (no profile data yet)
if (loading && !profile) return <Skeleton />;
```

### Don't Show Skeleton ❌
```jsx
// Updating profile (already have data)
if (loading && profile) return <Content />;

// Normal state
if (!loading && profile) return <Content />;
```

## Key Features

| Feature | Description |
|---------|-------------|
| Tab-Aware | Shows different skeleton based on active tab |
| Animated | Pulse animation for all elements |
| Responsive | Works on mobile, tablet, desktop |
| Matching Layout | Exact same layout as actual content |
| Fast | CSS-only animations, no JS overhead |

## Skeleton Elements

### Profile Tab
- Header with edit button
- Name field
- Email field
- Role field (with helper text)

### Password Tab
- Header with description
- Password requirements box
- Current password field
- New password field (with strength indicator)
- Confirm password field
- Submit button

## Color Scheme

| Element | Color Class | Usage |
|---------|-------------|-------|
| Primary | `bg-gray-300` | Titles, important text |
| Secondary | `bg-gray-200` | Labels, buttons |
| Tertiary | `bg-gray-100` | Form fields, backgrounds |
| Info Boxes | `bg-orange-200`, `bg-blue-200` | Colored info boxes |

## Common Patterns

### Basic Field Skeleton
```jsx
<div>
  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
  <div className="w-full h-12 bg-gray-100 rounded-xl border-2 border-gray-200"></div>
</div>
```

### Button Skeleton
```jsx
<div className="w-full h-12 bg-gray-200 rounded-xl"></div>
```

### Info Box Skeleton
```jsx
<div className="p-4 bg-orange-50 border border-orange-200 rounded-xl animate-pulse">
  <div className="h-5 bg-orange-200 rounded w-44 mb-2"></div>
  <div className="space-y-2">
    <div className="h-3 bg-orange-100 rounded w-full"></div>
    <div className="h-3 bg-orange-100 rounded w-5/6"></div>
  </div>
</div>
```

## Troubleshooting

### Issue: Skeleton not showing
**Solution:** Check condition `loading && !profile`

### Issue: Wrong tab skeleton
**Solution:** Pass correct `activeTab` prop

### Issue: Layout doesn't match
**Solution:** Compare dimensions with actual components

### Issue: No animation
**Solution:** Verify Tailwind CSS is configured

## Testing Checklist

- [ ] Skeleton shows on initial page load
- [ ] Profile tab skeleton matches profile form
- [ ] Password tab skeleton matches password form
- [ ] Smooth transition to actual content
- [ ] Responsive on all screen sizes
- [ ] No layout shifts
- [ ] Animation works smoothly

## Related Files

```
Page:       client/src/pages/system-page/UserProfileSettings.jsx
Components: client/src/components/system-components/user-profile-setting-compo/
Hook:       client/src/hooks/user-profile-setting-hook/useUserProfile.js
Skeletons:  client/src/layouts/skeleton-loading/
```

## Related Documentation
- [SKELETON_LOADING_IMPLEMENTATION.md](./SKELETON_LOADING_IMPLEMENTATION.md) - Full guide
- [USER_PROFILE_SETTINGS_GUIDE.md](./USER_PROFILE_SETTINGS_GUIDE.md) - Feature guide
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - General quick reference

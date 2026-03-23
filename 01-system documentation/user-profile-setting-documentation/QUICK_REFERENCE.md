# User Profile Settings - Quick Reference

## Quick Start

### Access the Page
```javascript
import UserProfileSettings from './pages/system-page/UserProfileSettings';

// In your router
<Route path="/profile/settings" element={<UserProfileSettings />} />
```

### Use the Hook
```javascript
import { useUserProfile } from './hooks/user-profile-setting-hook/useUserProfile';

const { profile, loading, updateProfile, changePassword } = useUserProfile();
```

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Get current user profile | ✅ |
| PUT | `/api/profile` | Update profile information | ✅ |
| POST | `/api/profile/change-password` | Change password | ✅ |

## Password Requirements

✅ Minimum 8 characters
✅ One uppercase letter (A-Z)
✅ One lowercase letter (a-z)
✅ One number (0-9)
✅ One special character (@$!%*?&)
✅ Different from current password

## Validation Functions

### Profile Validation
```javascript
import { validateProfileForm } from './utils/system-utils/user-profile-settings-utils/profileValidation';

const validation = validateProfileForm({
  name: 'John Doe',
  email: 'john@example.com'
});

if (validation.isValid) {
  // Submit form
}
```

### Password Validation
```javascript
import { validatePasswordForm } from './utils/system-utils/user-profile-settings-utils/profileValidation';

const validation = validatePasswordForm({
  current_password: 'OldPass123!',
  password: 'NewPass123!',
  password_confirmation: 'NewPass123!'
});
```

### Password Strength
```javascript
import { getPasswordStrength } from './utils/system-utils/user-profile-settings-utils/profileValidation';

const strength = getPasswordStrength('MyPassword123!');
// Returns: { strength: 5, label: 'Strong', color: 'green' }
```

## Component Usage

### ProfileInfoTab
```javascript
import { ProfileInfoTab } from './components/system-components/user-profile-setting-compo';

<ProfileInfoTab
  profile={profile}
  onUpdate={handleUpdateProfile}
  loading={loading}
/>
```

### ChangePasswordTab
```javascript
import { ChangePasswordTab } from './components/system-components/user-profile-setting-compo';

<ChangePasswordTab
  onChangePassword={handleChangePassword}
  loading={loading}
/>
```

## Service Methods

### Get Profile
```javascript
import { userProfileService } from './services/user-profile-setting-servive/userProfileService';

const result = await userProfileService.getProfile();
```

### Update Profile
```javascript
const result = await userProfileService.updateProfile({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Change Password
```javascript
const result = await userProfileService.changePassword({
  current_password: 'OldPass123!',
  password: 'NewPass123!',
  password_confirmation: 'NewPass123!'
});
```

## Error Handling

### Frontend Errors
```javascript
{
  success: false,
  message: 'Failed to update profile',
  errors: {
    email: ['The email has already been taken.']
  }
}
```

### Backend Errors (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

## Common Tasks

### Update User Name
```javascript
const { updateProfile } = useUserProfile();

await updateProfile({
  name: 'New Name',
  email: profile.email // Keep existing email
});
```

### Change Password
```javascript
const { changePassword } = useUserProfile();

await changePassword({
  current_password: 'current',
  password: 'NewSecure123!',
  password_confirmation: 'NewSecure123!'
});
```

### Display Role
```javascript
// Role is read-only
<input
  type="text"
  value={profile?.role || 'N/A'}
  disabled
  className="capitalize"
/>
```

## Styling Classes

### Primary Button
```css
bg-linear-to-r from-orange-600 to-orange-500 
text-white rounded-xl 
hover:from-orange-700 hover:to-orange-600
```

### Input Field
```css
border-2 border-gray-200 rounded-xl
focus:border-orange-500 focus:outline-none
```

### Error State
```css
border-red-500 focus:border-red-600
```

### Card Container
```css
bg-white rounded-2xl shadow-lg border border-gray-100
```

## HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Display success message |
| 401 | Unauthorized | Redirect to login |
| 422 | Validation Error | Show field errors |
| 500 | Server Error | Show error message |

## Testing Examples

### Test Profile Update
```javascript
// Mock successful update
const mockProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
};

const result = await updateProfile(mockProfile);
expect(result.success).toBe(true);
```

### Test Password Validation
```javascript
const validation = validatePasswordForm({
  current_password: 'Old123!',
  password: 'weak',
  password_confirmation: 'weak'
});

expect(validation.isValid).toBe(false);
expect(validation.errors.password).toBeDefined();
```

## Troubleshooting

### Profile Won't Load
```javascript
// Check authentication
const token = localStorage.getItem('authToken');
if (!token) {
  // Redirect to login
}
```

### Email Already Exists
```javascript
// Backend returns 422 with error
{
  errors: {
    email: ['The email has already been taken.']
  }
}
```

### Password Too Weak
```javascript
// Use password strength indicator
const strength = getPasswordStrength(password);
if (strength.strength < 4) {
  // Show warning
}
```

## File Locations

```
Backend:
├── Controllers: server/app/Http/Controllers/UserProfileController.php
└── Routes: server/routes/api.php

Frontend:
├── Page: client/src/pages/system-page/UserProfileSettings.jsx
├── Components: client/src/components/system-components/user-profile-setting-compo/
├── Hook: client/src/hooks/user-profile-setting-hook/useUserProfile.js
├── Service: client/src/services/user-profile-setting-servive/userProfileService.js
└── Utils: client/src/utils/system-utils/user-profile-settings-utils/profileValidation.js
```

## Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-secret-key
JWT_TTL=60
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Quick Commands

### Start Backend
```bash
cd server
php artisan serve
```

### Start Frontend
```bash
cd client
npm run dev
```

### Run Migrations
```bash
cd server
php artisan migrate
```

---

**Last Updated**: March 23, 2026
**Version**: 1.0.0

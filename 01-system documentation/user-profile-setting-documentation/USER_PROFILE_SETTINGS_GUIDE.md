# User Profile Settings - Complete Guide

## Overview

The User Profile Settings feature allows users to manage their account information and security settings through an intuitive two-tab interface. This feature emphasizes security, user experience, and data validation.

## Features

### 1. Profile Information Tab
- View and edit user information (name, email)
- Display role (read-only, cannot be edited by users)
- Real-time validation
- Edit mode toggle
- Change tracking

### 2. Change Password Tab
- Secure password change functionality
- Current password verification
- Strong password requirements
- Password strength indicator
- Real-time validation
- Password visibility toggle

## Architecture

### Frontend Structure

```
client/src/
├── pages/system-page/
│   └── UserProfileSettings.jsx          # Main page component
├── components/system-components/user-profile-setting-compo/
│   ├── ProfileInfoTab.jsx               # Profile information tab
│   ├── ChangePasswordTab.jsx            # Password change tab
│   └── index.js                         # Component exports
├── hooks/user-profile-setting-hook/
│   └── useUserProfile.js                # Profile management hook
├── services/user-profile-setting-servive/
│   └── userProfileService.js            # API service layer
└── utils/system-utils/user-profile-settings-utils/
    └── profileValidation.js             # Validation utilities
```

### Backend Structure

```
server/
├── app/Http/Controllers/
│   └── UserProfileController.php        # Profile API controller
└── routes/
    └── api.php                          # API routes
```

## API Endpoints

### 1. Get Profile
```
GET /api/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 2. Update Profile
```
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

### 3. Change Password
```
POST /api/profile/change-password
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "current_password": "OldPassword123!",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Password Requirements

### Security Rules
1. Minimum 8 characters
2. At least one uppercase letter (A-Z)
3. At least one lowercase letter (a-z)
4. At least one number (0-9)
5. At least one special character (@$!%*?&)
6. New password must be different from current password

### Password Strength Indicator
- **Weak** (Red): 0-2 criteria met
- **Medium** (Yellow): 3-4 criteria met
- **Strong** (Green): 5-6 criteria met

## Validation

### Profile Information Validation

#### Name
- Required field
- Minimum 2 characters
- Maximum 255 characters
- Trimmed whitespace

#### Email
- Required field
- Valid email format
- Must be unique in the system
- Case-insensitive

#### Role
- Read-only field
- Cannot be modified by users
- Only administrators can change roles through User Management

### Password Validation

#### Current Password
- Required field
- Must match existing password

#### New Password
- Required field
- Must meet all security requirements
- Cannot be the same as current password
- Must match confirmation

#### Password Confirmation
- Required field
- Must match new password exactly

## UI/UX Features

### Design Elements
- Modern card-based layout
- Orange accent color scheme (#F97316)
- Smooth transitions and animations
- Responsive design (mobile, tablet, desktop)
- Gradient backgrounds and effects
- Shadow and border styling

### User Interactions
1. **Edit Mode Toggle**: Click "Edit Profile" to enable editing
2. **Change Tracking**: Save button only enabled when changes are made
3. **Cancel Action**: Revert changes and exit edit mode
4. **Password Visibility**: Toggle password visibility with eye icon
5. **Real-time Feedback**: Instant validation and error messages
6. **Loading States**: Disabled inputs and buttons during API calls

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Error announcements
- Color contrast compliance

## Error Handling

### Frontend Validation
- Real-time field validation
- Clear error messages below fields
- Visual error indicators (red borders)
- Form submission prevention on errors

### Backend Validation
- Server-side validation for all inputs
- Detailed error responses
- Field-specific error messages
- HTTP status codes (422 for validation errors)

### Common Error Scenarios

#### Profile Update Errors
- Email already exists
- Invalid email format
- Name too short/long
- Network errors

#### Password Change Errors
- Current password incorrect
- New password doesn't meet requirements
- Passwords don't match
- New password same as current

## Security Features

### Authentication
- JWT token-based authentication
- Protected API routes
- Token validation on each request

### Password Security
- Bcrypt hashing (Laravel default)
- Strong password requirements
- Current password verification
- Password history check (same as current)

### Data Protection
- HTTPS encryption (production)
- Input sanitization
- SQL injection prevention
- XSS protection

## Usage Examples

### Updating Profile Information

```javascript
// Using the hook
const { updateProfile } = useUserProfile();

const handleUpdate = async () => {
  const result = await updateProfile({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  if (result.success) {
    console.log('Profile updated!');
  }
};
```

### Changing Password

```javascript
// Using the hook
const { changePassword } = useUserProfile();

const handlePasswordChange = async () => {
  const result = await changePassword({
    current_password: 'OldPassword123!',
    password: 'NewPassword123!',
    password_confirmation: 'NewPassword123!'
  });
  
  if (result.success) {
    console.log('Password changed!');
  }
};
```

## Testing Checklist

### Profile Information Tab
- [ ] Load profile data on mount
- [ ] Enable edit mode
- [ ] Validate name field
- [ ] Validate email field
- [ ] Display role as read-only
- [ ] Save changes successfully
- [ ] Cancel changes
- [ ] Handle API errors
- [ ] Show loading states

### Change Password Tab
- [ ] Validate current password
- [ ] Validate new password requirements
- [ ] Validate password confirmation
- [ ] Show password strength indicator
- [ ] Toggle password visibility
- [ ] Prevent same password
- [ ] Change password successfully
- [ ] Clear form on success
- [ ] Handle API errors

## Troubleshooting

### Profile Won't Update
1. Check authentication token
2. Verify email is unique
3. Check network connection
4. Review validation errors

### Password Change Fails
1. Verify current password is correct
2. Check new password meets requirements
3. Ensure passwords match
4. Check for network errors

### UI Issues
1. Clear browser cache
2. Check console for errors
3. Verify API responses
4. Test in different browsers

## Future Enhancements

### Potential Features
- Profile picture upload
- Two-factor authentication
- Password reset via email
- Activity log
- Session management
- Account deletion
- Email verification
- Social login integration

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Check browser console
4. Contact system administrator

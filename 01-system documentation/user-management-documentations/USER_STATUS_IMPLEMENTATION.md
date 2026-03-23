# User Status Implementation Guide

## Overview
This document describes the implementation of user status functionality (Active, Inactive, Suspended) in the User Management system.

## Status Types

### 1. Active
- Users can log in and access the system
- All features are available
- Default status for new users

### 2. Inactive
- Users cannot log in
- Existing sessions are blocked
- Message: "Your account is inactive. Please contact the administrator."
- Use case: Temporary account deactivation, pending verification

### 3. Suspended
- Users cannot log in
- Existing sessions are blocked
- Message: "Your account has been suspended. Please contact the administrator."
- Use case: Policy violations, security concerns, disciplinary actions

## Backend Implementation

### 1. Database Schema
```php
// Migration: 2026_03_22_000000_add_role_to_users_table.php
$table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
```

### 2. User Model Methods
```php
// app/Models/User.php
public function isActive()      // Check if user is active
public function isInactive()    // Check if user is inactive
public function isSuspended()   // Check if user is suspended
public function getStatusLabelAttribute() // Get formatted status label
```

### 3. Middleware: CheckUserStatus
**Location:** `app/Http/Middleware/CheckUserStatus.php`

**Purpose:** Validates user status on every authenticated request

**Responses:**
- Inactive: 403 with message and status
- Suspended: 403 with message and status
- Active: Allows request to proceed

### 4. Authentication Flow

#### Login Process (AuthController)
1. Validate credentials
2. Authenticate user
3. **Check user status**
   - If inactive or suspended: Logout and return 403 error
   - If active: Return token and user data
4. Include role and status in response

#### Protected Routes
All authenticated routes use the `check.status` middleware:
```php
Route::middleware(['auth:api', 'check.status'])->group(function () {
    // Protected routes
});
```

### 5. API Endpoints

#### Update User Status
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "inactive" // or "active" or "suspended"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "status": "inactive"
  }
}
```

## Frontend Implementation

### 1. Status Display
The status field is:
- **Hidden** when creating a new user (auto-set to "active")
- **Visible** when editing an existing user

### 2. Status Options
```jsx
<select name="status">
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
  <option value="suspended">Suspended</option>
</select>
```

### 3. Error Handling
When a user with inactive/suspended status tries to log in:

```javascript
// Login response for inactive user
{
  "success": false,
  "message": "Your account is inactive. Please contact the administrator.",
  "status": "inactive"
}

// Login response for suspended user
{
  "success": false,
  "message": "Your account has been suspended. Please contact the administrator.",
  "status": "suspended"
}
```

## Testing Scenarios

### Test 1: Create New User
1. Open "Add New User" modal
2. Verify Status field is hidden
3. Fill in required fields
4. Submit form
5. Verify user is created with status = "active"

### Test 2: Edit User - Set to Inactive
1. Click edit on an active user
2. Change status to "Inactive"
3. Save changes
4. Try to login with that user
5. Verify login is blocked with appropriate message

### Test 3: Edit User - Set to Suspended
1. Click edit on an active user
2. Change status to "Suspended"
3. Save changes
4. Try to login with that user
5. Verify login is blocked with appropriate message

### Test 4: Reactivate User
1. Edit an inactive/suspended user
2. Change status back to "Active"
3. Save changes
4. Try to login with that user
5. Verify login is successful

### Test 5: Active Session Check
1. Login with an active user
2. Admin changes user status to inactive/suspended
3. User tries to access protected route
4. Verify access is blocked with 403 error

## Security Considerations

1. **Immediate Effect**: Status changes take effect immediately
2. **Session Validation**: Every authenticated request checks user status
3. **Login Prevention**: Inactive/suspended users cannot obtain new tokens
4. **Admin Protection**: Admins should not be able to suspend themselves
5. **Audit Trail**: Consider logging status changes for compliance

## API Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200  | OK     | Status updated successfully |
| 401  | Unauthorized | Invalid credentials |
| 403  | Forbidden | Account inactive or suspended |
| 422  | Unprocessable | Validation error |
| 500  | Server Error | Internal server error |

## Files Modified

### Backend
1. `app/Http/Middleware/CheckUserStatus.php` - New middleware
2. `app/Models/User.php` - Added status helper methods
3. `app/Http/Controllers/AuthController.php` - Added status checking in login
4. `bootstrap/app.php` - Registered middleware alias
5. `routes/api.php` - Applied middleware to protected routes

### Frontend
1. `client/src/components/admin-components/user-management-compo/UserFormModal.jsx`
   - Added confirm password field
   - Updated password visibility icons
   - Hidden status field for new users
   - Auto-set status to "active" for new users

## Best Practices

1. **Clear Communication**: Always provide clear messages to users about why they cannot access the system
2. **Admin Notifications**: Consider notifying admins when users attempt to login with inactive/suspended accounts
3. **Reactivation Process**: Document the process for users to request account reactivation
4. **Status History**: Consider implementing a status change log for audit purposes
5. **Bulk Operations**: Consider adding bulk status update functionality for managing multiple users

## Future Enhancements

1. **Temporary Suspension**: Add expiration dates for suspensions
2. **Status Reasons**: Add reason field for status changes
3. **Email Notifications**: Notify users when their status changes
4. **Self-Service**: Allow users to request reactivation
5. **Status History**: Track all status changes with timestamps and admin info

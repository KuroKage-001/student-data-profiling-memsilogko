# Dual Portal Authentication System

## Overview
This document describes the implementation of a dual-portal authentication system that separates Admin Portal and Student Portal access based on user roles.

## Portal Types

### 1. Admin Portal (`/admin/login`)
**Allowed Roles:**
- `admin` - Full system administrators
- `dept_chair` - Department chairpersons
- `faculty` - Faculty members

**Access:** Users with these roles can log in through the Admin Portal and access administrative features.

### 2. Student Portal (`/login`)
**Allowed Roles:**
- `student` - Students only

**Access:** Only users with the student role can log in through the Student Portal.

## Implementation Details

### Backend Changes

#### 1. AuthController.php
**File:** `server/app/Http/Controllers/AuthController.php`

**Changes:**
- Added `portal_type` parameter to login validation (optional)
- Implemented portal-based role validation after authentication
- Returns specific error messages for portal mismatches

**Portal Validation Logic:**
```php
// Admin portal: only admin, dept_chair, and faculty allowed
if ($portalType === 'admin') {
    if (!in_array($user->role, ['admin', 'dept_chair', 'faculty'])) {
        auth('api')->logout();
        return response()->json([
            'success' => false,
            'message' => 'Access denied. This portal is for administrators and faculty only.',
            'portal_mismatch' => true
        ], 403);
    }
}

// Student portal: only students allowed
elseif ($portalType === 'student') {
    if ($user->role !== 'student') {
        auth('api')->logout();
        return response()->json([
            'success' => false,
            'message' => 'Access denied. This portal is for students only. Please use the Admin Portal.',
            'portal_mismatch' => true
        ], 403);
    }
}
```

### Frontend Changes

#### 1. useLoginForm Hook
**File:** `client/src/hooks/useLoginForm.js`

**Changes:**
- Detects portal type based on current route (`/admin/login` vs `/login`)
- Includes `portal_type` in login request payload
- Handles portal mismatch errors with specific messaging

**Portal Detection:**
```javascript
const location = useLocation();
const portalType = location.pathname === '/admin/login' ? 'admin' : 'student';
```

**Login Request:**
```javascript
const result = await authService.login({
  ...credentials,
  portal_type: portalType
});
```

#### 2. LoginHeader Component
**File:** `client/src/components/system-components/login-compo/LoginHeader.jsx`

**Changes:**
- Displays different header text based on portal type
- Shows portal-specific descriptions

**Dynamic Content:**
- Admin Portal: "Sign in to access the administrative dashboard and management tools"
- Student Portal: "Sign in to access your student profile and academic information"

#### 3. authService
**File:** `client/src/services/login-service/authService.js`

**Changes:**
- Enhanced error handling for 403 status (portal mismatch)
- Passes `portal_mismatch` flag to calling code

## User Flow

### Admin Portal Flow
1. User clicks "Admin Portal" on HomePage
2. Navigates to `/admin/login`
3. Enters credentials
4. System validates credentials
5. System checks if user role is `admin`, `dept_chair`, or `faculty`
6. If valid: Login successful, redirect to dashboard
7. If invalid role: Show error "Access denied. This portal is for administrators and faculty only."

### Student Portal Flow
1. User clicks "Student Portal" on HomePage
2. Navigates to `/login`
3. Enters credentials
4. System validates credentials
5. System checks if user role is `student`
6. If valid: Login successful, redirect to profile
7. If invalid role: Show error "Access denied. This portal is for students only. Please use the Admin Portal."

## Error Messages

### Portal Mismatch Errors
- **Admin Portal (non-admin user):** "Access denied. This portal is for administrators and faculty only."
- **Student Portal (non-student user):** "Access denied. This portal is for students only. Please use the Admin Portal."

### Other Errors
- **Invalid credentials:** "Invalid email or password"
- **Inactive account:** "Your account is inactive. Please contact the administrator."
- **Suspended account:** "Your account has been suspended. Please contact the administrator."

## Security Features

1. **Role-based Access Control:** Users can only access portals appropriate for their role
2. **Token Invalidation:** On portal mismatch, the authentication token is immediately invalidated
3. **Clear Error Messages:** Users receive specific guidance on which portal to use
4. **Status Validation:** Account status (active/inactive/suspended) is checked before role validation

## Testing Scenarios

### Test Case 1: Admin Login via Admin Portal
- **User Role:** admin
- **Portal:** /admin/login
- **Expected:** ✅ Success - Redirect to /admin/dashboard

### Test Case 2: Faculty Login via Admin Portal
- **User Role:** faculty
- **Portal:** /admin/login
- **Expected:** ✅ Success - Redirect to /admin/dashboard

### Test Case 3: Student Login via Admin Portal
- **User Role:** student
- **Portal:** /admin/login
- **Expected:** ❌ Error - "Access denied. This portal is for administrators and faculty only."

### Test Case 4: Student Login via Student Portal
- **User Role:** student
- **Portal:** /login
- **Expected:** ✅ Success - Redirect to /profile/settings

### Test Case 5: Admin Login via Student Portal
- **User Role:** admin
- **Portal:** /login
- **Expected:** ❌ Error - "Access denied. This portal is for students only. Please use the Admin Portal."

## API Request/Response Examples

### Successful Admin Portal Login
**Request:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123",
  "portal_type": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

### Portal Mismatch Error
**Request:**
```json
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123",
  "portal_type": "admin"
}
```

**Response:**
```json
{
  "success": false,
  "message": "Access denied. This portal is for administrators and faculty only.",
  "portal_mismatch": true
}
```

## Files Modified

### Backend
1. `server/app/Http/Controllers/AuthController.php`
   - Added portal_type validation
   - Implemented role-based portal access control

### Frontend
1. `client/src/hooks/useLoginForm.js`
   - Added portal type detection
   - Enhanced error handling for portal mismatches

2. `client/src/components/system-components/login-compo/LoginHeader.jsx`
   - Added dynamic portal-specific headers

3. `client/src/services/login-service/authService.js`
   - Enhanced error handling for 403 responses
   - Added portal_mismatch flag support

## Configuration

### Route Configuration
**File:** `client/src/config/routeConfig.js`

The route configuration already defines role-based access:
```javascript
{
  id: 'admin-dashboard',
  path: '/admin/dashboard',
  roles: ['admin', 'dept_chair'],
  requiresAuth: true,
},
{
  id: 'profile-settings',
  path: '/profile/settings',
  roles: ['admin', 'dept_chair', 'faculty', 'student'],
  requiresAuth: true,
}
```

## Future Enhancements

1. **Rate Limiting:** Implement rate limiting per portal to prevent brute force attacks
2. **Audit Logging:** Log portal mismatch attempts for security monitoring
3. **Multi-factor Authentication:** Add MFA support for admin portal
4. **Session Management:** Implement different session timeouts for different portals
5. **Portal Switching:** Allow authorized users to switch between portals without re-login

## Maintenance Notes

- Portal type validation happens at the authentication level, ensuring security
- The system maintains backward compatibility - if no portal_type is provided, authentication proceeds without portal validation
- All portal-related logic is centralized in AuthController for easy maintenance


## Additional Frontend Changes (Redirect Logic)

### HomePage Component
**File:** `client/src/pages/system-page/HomePage.jsx`

**Purpose:** Prevent authenticated users from accessing the public homepage and redirect them to their appropriate dashboard.

**Changes:**
- Added authentication check on component mount
- Redirect authenticated users based on their role
- Show loading state while checking authentication
- Use `replace: true` to prevent back navigation to homepage

**Implementation:**
```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userRole = user.role;
      
      // Redirect based on role
      if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRole === 'student') {
        navigate('/profile/settings', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return <HomePage />;
};
```

**Behavior:**
- **Unauthenticated users:** See the homepage with portal selection cards
- **Admin/Dept Chair/Faculty:** Automatically redirected to `/admin/dashboard`
- **Students:** Automatically redirected to `/profile/settings`
- **Loading state:** Shows spinner while checking authentication

### LoginPage Component Enhancement
**File:** `client/src/pages/system-page/LoginPage.jsx`

**Purpose:** Enhanced redirect logic to handle all user roles properly.

**Changes:**
- Updated redirect logic to check user role
- Redirect admin/dept_chair/faculty to dashboard
- Redirect students to profile settings
- Prevent already authenticated users from accessing login page

**Implementation:**
```javascript
useEffect(() => {
  if (!loading && isAuthenticated && user) {
    const userRole = user.role;
    
    if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
      navigate('/admin/dashboard', { replace: true });
    } else if (userRole === 'student') {
      navigate('/profile/settings', { replace: true });
    }
  }
}, [isAuthenticated, user, loading, navigate]);
```

**Behavior:**
- **Already logged in admin:** Redirected to dashboard
- **Already logged in student:** Redirected to profile
- **Not logged in:** Can access login page

## Complete User Flow with Redirects

### Scenario 1: Admin User Journey
1. User navigates to homepage (`/`)
2. System checks authentication → User is logged in as admin
3. **Automatic redirect** to `/admin/dashboard`
4. User sees admin dashboard

### Scenario 2: Student User Journey
1. User navigates to homepage (`/`)
2. System checks authentication → User is logged in as student
3. **Automatic redirect** to `/profile/settings`
4. User sees their profile

### Scenario 3: Unauthenticated User Journey
1. User navigates to homepage (`/`)
2. System checks authentication → No user logged in
3. User sees homepage with portal cards
4. User clicks "Admin Portal" or "Student Portal"
5. User is taken to appropriate login page

### Scenario 4: Already Logged In User Tries to Login
1. Admin user tries to access `/admin/login`
2. System checks authentication → User is already logged in
3. **Automatic redirect** to `/admin/dashboard`
4. User cannot access login page while authenticated

### Scenario 5: Direct URL Access
1. Admin user types `/admin/dashboard` in browser
2. System checks authentication → User is logged in as admin
3. User sees dashboard (no redirect needed)

## Redirect Logic Summary

| User State | Accessing | Redirect To | Reason |
|------------|-----------|-------------|---------|
| Admin (logged in) | `/` | `/admin/dashboard` | Already authenticated |
| Faculty (logged in) | `/` | `/admin/dashboard` | Already authenticated |
| Dept Chair (logged in) | `/` | `/admin/dashboard` | Already authenticated |
| Student (logged in) | `/` | `/profile/settings` | Already authenticated |
| Admin (logged in) | `/admin/login` | `/admin/dashboard` | Already authenticated |
| Student (logged in) | `/login` | `/profile/settings` | Already authenticated |
| Not logged in | `/` | No redirect | Public page |
| Not logged in | `/admin/login` | No redirect | Login page |
| Not logged in | `/admin/dashboard` | `/admin/login` | Protected route |

## Benefits of This Approach

1. **Better UX:** Users don't see the homepage if they're already logged in
2. **Security:** Prevents authenticated users from accessing login pages
3. **Role-Based Navigation:** Each role is directed to their appropriate starting page
4. **Clean URLs:** No unnecessary redirects or back-button issues
5. **Fast Loading:** Uses `replace: true` to avoid polluting browser history

## Testing the Redirect Logic

### Test 1: Admin Login and Homepage Access
```
1. Login as admin
2. Try to navigate to homepage (/)
Expected: Immediately redirected to /admin/dashboard
```

### Test 2: Student Login and Homepage Access
```
1. Login as student
2. Try to navigate to homepage (/)
Expected: Immediately redirected to /profile/settings
```

### Test 3: Logout and Homepage Access
```
1. Logout from any account
2. Navigate to homepage (/)
Expected: See homepage with portal cards (no redirect)
```

### Test 4: Direct Login Page Access While Authenticated
```
1. Login as admin
2. Try to navigate to /admin/login
Expected: Immediately redirected to /admin/dashboard
```

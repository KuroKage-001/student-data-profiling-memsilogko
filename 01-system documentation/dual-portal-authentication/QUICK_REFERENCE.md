# Dual Portal Authentication - Quick Reference

## Portal Access Rules

| Portal | Route | Allowed Roles | Redirect After Login |
|--------|-------|---------------|---------------------|
| Admin Portal | `/admin/login` | admin, dept_chair, faculty | `/admin/dashboard` |
| Student Portal | `/login` | student | `/profile/settings` |

## Key Files

### Backend
- `server/app/Http/Controllers/AuthController.php` - Portal validation logic

### Frontend
- `client/src/hooks/useLoginForm.js` - Portal detection and login handling
- `client/src/components/system-components/login-compo/LoginHeader.jsx` - Portal-specific UI
- `client/src/services/login-service/authService.js` - API communication
- `client/src/pages/system-page/HomePage.jsx` - Authenticated user redirect
- `client/src/pages/system-page/LoginPage.jsx` - Role-based redirect logic

## How It Works

### 1. Portal Detection
```javascript
// In useLoginForm.js
const portalType = location.pathname === '/admin/login' ? 'admin' : 'student';
```

### 2. Login Request
```javascript
// Includes portal_type in request
await authService.login({
  email: 'user@example.com',
  password: 'password',
  portal_type: 'admin' // or 'student'
});
```

### 3. Backend Validation
```php
// In AuthController.php
if ($portalType === 'admin') {
    if (!in_array($user->role, ['admin', 'dept_chair', 'faculty'])) {
        // Reject login
    }
}
```

## Error Messages

| Scenario | Error Message |
|----------|--------------|
| Student tries Admin Portal | "Access denied. This portal is for administrators and faculty only." |
| Admin tries Student Portal | "Access denied. This portal is for students only. Please use the Admin Portal." |
| Invalid credentials | "Invalid email or password" |
| Inactive account | "Your account is inactive. Please contact the administrator." |

## Testing Commands

### Create Test Users
```bash
# In Laravel tinker
php artisan tinker

# Create admin user
User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
    'status' => 'active'
]);

# Create student user
User::create([
    'name' => 'Student User',
    'email' => 'student@test.com',
    'password' => Hash::make('password'),
    'role' => 'student',
    'status' => 'active'
]);
```

### Test Scenarios
1. ✅ Admin login via `/admin/login` → Success
2. ✅ Student login via `/login` → Success
3. ❌ Student login via `/admin/login` → Error
4. ❌ Admin login via `/login` → Error

## API Endpoints

### Login Endpoint
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "portal_type": "admin" // or "student"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "access_token": "token...",
  "user": {
    "id": 1,
    "role": "admin",
    "name": "Admin User"
  }
}
```

**Portal Mismatch (403):**
```json
{
  "success": false,
  "message": "Access denied...",
  "portal_mismatch": true
}
```

## Troubleshooting

### Issue: Portal validation not working
**Solution:** Check that `portal_type` is being sent in the request payload

### Issue: Wrong error message displayed
**Solution:** Verify `portal_mismatch` flag is being handled in authService.js

### Issue: User can access wrong portal
**Solution:** Ensure AuthController.php has the latest portal validation code

## Code Snippets

### Add Portal Type to Login Form
```javascript
// In useLoginForm.js
const location = useLocation();
const portalType = location.pathname === '/admin/login' ? 'admin' : 'student';

// Include in login request
const result = await authService.login({
  ...credentials,
  portal_type: portalType
});
```

### Backend Portal Validation
```php
// In AuthController.php login method
$portalType = $request->input('portal_type');

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
```

## Security Checklist

- ✅ Token invalidated on portal mismatch
- ✅ Role validation happens server-side
- ✅ Clear error messages without exposing system details
- ✅ Account status checked before role validation
- ✅ Portal type is optional (backward compatible)

## Related Documentation

- [Complete Implementation Guide](./DUAL_PORTAL_IMPLEMENTATION.md)
- [Route Configuration](../client/src/config/routeConfig.js)
- [User Model](../server/app/Models/User.php)


## Redirect Behavior

| User Role | Access Homepage (/) | Access Login Page | Result |
|-----------|-------------------|-------------------|---------|
| Admin (logged in) | ✅ | ✅ | Redirected to `/admin/dashboard` |
| Dept Chair (logged in) | ✅ | ✅ | Redirected to `/admin/dashboard` |
| Faculty (logged in) | ✅ | ✅ | Redirected to `/admin/dashboard` |
| Student (logged in) | ✅ | ✅ | Redirected to `/profile/settings` |
| Not logged in | ✅ | ✅ | Can access both pages |

## Common Issues & Solutions

### Issue: Admin sees homepage after login
**Solution:** Check HomePage.jsx has the redirect logic implemented

### Issue: User can access login page while logged in
**Solution:** Check LoginPage.jsx has the redirect logic implemented

### Issue: Infinite redirect loop
**Solution:** Ensure `replace: true` is used in navigate() calls

### Issue: User redirected to wrong page
**Solution:** Verify user.role matches expected values (admin, dept_chair, faculty, student)

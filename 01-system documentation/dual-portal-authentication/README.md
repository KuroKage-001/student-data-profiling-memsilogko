# Triple Portal Authentication System

## Overview
A role-based triple-portal authentication system that separates Admin Portal, Faculty Portal, and Student Portal access, ensuring users can only access portals appropriate for their roles.

## Quick Start

### 1. Seed the Database
```bash
php artisan migrate:fresh --seed
```

### 2. Test Login Credentials

**Admin Portal** (`/admin/login`):
```
Email:    admin@ccs.edu
Password: Admin@2024
```

**Faculty Portal** (`/faculty/login`):
```
Email:    faculty@ccs.edu
Password: Faculty@2024
```

**Student Portal** (`/login`):
```
Email:    student1@ccs.edu
Password: Student@2024
```

See [Test Accounts](./TEST_ACCOUNTS.md) for complete list of test credentials.

## How It Works

1. **User selects portal** from HomePage (3 options: Admin, Faculty, Student)
2. **System detects portal type** based on route
3. **User enters credentials**
4. **Backend validates** credentials and role
5. **Portal access granted** if role matches portal type
6. **Error shown** if role doesn't match portal type

## Key Features

✅ **Role-Based Access Control** - Users can only access appropriate portals
✅ **Three Separate Portals** - Admin, Faculty, and Student portals
✅ **Automatic Portal Detection** - System detects portal type from URL
✅ **Clear Error Messages** - Users get specific guidance on which portal to use
✅ **Token Invalidation** - Tokens are invalidated on portal mismatch
✅ **Status Validation** - Account status checked before role validation
✅ **Backward Compatible** - Works without portal_type parameter

## Portal Access Matrix

| Role | Admin Portal | Faculty Portal | Student Portal |
|------|-------------|----------------|----------------|
| Admin | ✅ | ❌ | ❌ |
| Department Chair | ❌ | ✅ | ❌ |
| Faculty | ❌ | ✅ | ❌ |
| Student | ❌ | ❌ | ✅ |

## Implementation Files

### Backend
- `server/app/Http/Controllers/AuthController.php`
- `server/routes/api.php`

### Frontend
- `client/src/config/routeConfig.js`
- `client/src/components/system-components/home-compo/PortalCards.jsx`
- `client/src/hooks/useLoginForm.js`
- `client/src/components/system-components/login-compo/LoginHeader.jsx`
- `client/src/services/login-service/authService.js`
- `client/src/App.jsx`
- `client/src/pages/system-page/HomePage.jsx`

## Documentation

- **[Complete Implementation Guide](./DUAL_PORTAL_IMPLEMENTATION.md)** - Detailed technical documentation
- **[Faculty Portal Implementation](../../FACULTY_PORTAL_IMPLEMENTATION.md)** - New faculty portal documentation
- **[Quick Reference](./QUICK_REFERENCE.md)** - Quick lookup guide for developers
- **[Test Accounts](./TEST_ACCOUNTS.md)** - Complete list of test accounts and credentials
- **[Quick Login Reference](./QUICK_LOGIN_REFERENCE.md)** - Printable login reference card

## Testing

### Test Scenarios
| User Role | Admin Portal | Faculty Portal | Student Portal |
|-----------|-------------|----------------|----------------|
| admin | ✅ Success | ❌ Access Denied | ❌ Access Denied |
| dept_chair | ❌ Access Denied | ✅ Success | ❌ Access Denied |
| faculty | ❌ Access Denied | ✅ Success | ❌ Access Denied |
| student | ❌ Access Denied | ❌ Access Denied | ✅ Success |

## Error Messages

### Portal Mismatch
- **Admin Portal (wrong role):** "Access denied. This portal is for administrators only."
- **Faculty Portal (wrong role):** "Access denied. This portal is for faculty and department chairs only."
- **Student Portal (wrong role):** "Access denied. This portal is for students only. Please use the appropriate portal for your role."

### Account Status
- **Inactive:** "Your account is inactive. Please contact the administrator."
- **Suspended:** "Your account has been suspended. Please contact the administrator."

## API Example

### Request
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "portal_type": "faculty"
}
```

### Success Response
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "role": "faculty",
    "name": "Faculty User"
  }
}
```

### Portal Mismatch Response
```json
{
  "success": false,
  "message": "Access denied. This portal is for faculty and department chairs only.",
  "portal_mismatch": true
}
```

## Security

- ✅ Server-side role validation
- ✅ Token invalidation on mismatch
- ✅ No sensitive information in error messages
- ✅ Account status validation
- ✅ JWT-based authentication
- ✅ Strict portal isolation

## Maintenance

### Adding New Roles
1. Update `AuthController.php` portal validation logic
2. Update role arrays in validation conditions
3. Update documentation

### Modifying Portal Rules
1. Edit portal validation in `AuthController.php`
2. Update error messages if needed
3. Test all affected scenarios

## Support

For issues or questions:
1. Check [Quick Reference](./QUICK_REFERENCE.md)
2. Review [Implementation Guide](./DUAL_PORTAL_IMPLEMENTATION.md)
3. Check Laravel logs: `storage/logs/laravel.log`
4. Check browser console for frontend errors

## Version History

- **v2.0** - Triple portal implementation
  - Separated Faculty Portal from Admin Portal
  - Admin Portal now for administrators only
  - Faculty Portal for faculty and department chairs
  - Student Portal for students
  - Enhanced role-based access control
  
- **v1.0** - Initial implementation with dual portal support
  - Admin Portal for admin/dept_chair/faculty
  - Student Portal for students
  - Role-based access control
  - Portal mismatch detection

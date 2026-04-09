# Dual Portal Authentication System

## Overview
A role-based dual-portal authentication system that separates Admin Portal and Student Portal access, ensuring users can only access portals appropriate for their roles.

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

**Student Portal** (`/login`):
```
Email:    student1@ccs.edu
Password: Student@2024
```

See [Test Accounts](./TEST_ACCOUNTS.md) for complete list of test credentials.

## How It Works

1. **User selects portal** from HomePage
2. **System detects portal type** based on route
3. **User enters credentials**
4. **Backend validates** credentials and role
5. **Portal access granted** if role matches portal type
6. **Error shown** if role doesn't match portal type

## Key Features

✅ **Role-Based Access Control** - Users can only access appropriate portals
✅ **Automatic Portal Detection** - System detects portal type from URL
✅ **Clear Error Messages** - Users get specific guidance on which portal to use
✅ **Token Invalidation** - Tokens are invalidated on portal mismatch
✅ **Status Validation** - Account status checked before role validation
✅ **Backward Compatible** - Works without portal_type parameter

## Implementation Files

### Backend
- `server/app/Http/Controllers/AuthController.php`

### Frontend
- `client/src/hooks/useLoginForm.js`
- `client/src/components/system-components/login-compo/LoginHeader.jsx`
- `client/src/services/login-service/authService.js`

## Documentation

- **[Complete Implementation Guide](./DUAL_PORTAL_IMPLEMENTATION.md)** - Detailed technical documentation
- **[Quick Reference](./QUICK_REFERENCE.md)** - Quick lookup guide for developers
- **[Test Accounts](./TEST_ACCOUNTS.md)** - Complete list of test accounts and credentials
- **[Quick Login Reference](./QUICK_LOGIN_REFERENCE.md)** - Printable login reference card

## Testing

### Test Scenarios
| User Role | Portal | Expected Result |
|-----------|--------|----------------|
| admin | Admin Portal | ✅ Success |
| dept_chair | Admin Portal | ✅ Success |
| faculty | Admin Portal | ✅ Success |
| student | Student Portal | ✅ Success |
| student | Admin Portal | ❌ Access Denied |
| admin | Student Portal | ❌ Access Denied |

## Error Messages

### Portal Mismatch
- **Admin Portal (wrong role):** "Access denied. This portal is for administrators and faculty only."
- **Student Portal (wrong role):** "Access denied. This portal is for students only. Please use the Admin Portal."

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
  "portal_type": "admin"
}
```

### Success Response
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "role": "admin",
    "name": "Admin User"
  }
}
```

### Portal Mismatch Response
```json
{
  "success": false,
  "message": "Access denied. This portal is for administrators and faculty only.",
  "portal_mismatch": true
}
```

## Security

- ✅ Server-side role validation
- ✅ Token invalidation on mismatch
- ✅ No sensitive information in error messages
- ✅ Account status validation
- ✅ JWT-based authentication

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

- **v1.0** - Initial implementation with dual portal support
  - Admin Portal for admin/dept_chair/faculty
  - Student Portal for students
  - Role-based access control
  - Portal mismatch detection

# Dynamic Routing Quick Reference

## File Structure

```
client/src/
├── config/
│   └── routeConfig.js              # Route definitions
├── hooks/
│   └── useDynamicRoutes.js         # Route loading hook
├── context/
│   ├── AuthContext.jsx             # Authentication
│   ├── DynamicRouteGuard.jsx       # Access control
│   └── ProtectedRoute.jsx          # Legacy (can be removed)
├── components/
│   └── system-components/
│       └── RouteLoader.jsx         # Lazy loading wrapper
└── App.jsx                         # Main app with dynamic routes

server/
├── app/Http/Controllers/
│   └── RouteController.php         # Optional API endpoint
└── routes/
    └── api.php                     # API routes
```

## Quick Commands

### Add a New Route

```javascript
// 1. In routeConfig.js
const NewPage = lazy(() => import('../pages/NewPage'));

// 2. Add to routeConfig array
{
  id: 'new-page',
  path: '/new-page',
  component: NewPage,
  isPublic: false,
  title: 'New Page',
  roles: ['admin'],
  requiresAuth: true,
}
```

### Check Route Access

```javascript
import { hasRouteAccess } from '../config/routeConfig';

const canAccess = hasRouteAccess('/admin/dashboard', 'admin');
// Returns: true or false
```

### Get Routes by Role

```javascript
import { getRoutesByRole } from '../config/routeConfig';

const routes = getRoutesByRole('admin');
// Returns: Array of route objects
```

### Use in Component

```javascript
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';

function MyComponent() {
  const { routes, loading, userRole } = useDynamicRoutes();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <nav>
      {routes.map(route => (
        <Link key={route.id} to={route.path}>
          {route.title}
        </Link>
      ))}
    </nav>
  );
}
```

## Route Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `path` | string | Yes | URL path |
| `component` | Component | Yes | Lazy-loaded component |
| `isPublic` | boolean | Yes | Public access flag |
| `title` | string | Yes | Page title |
| `roles` | array | Yes | Allowed roles |
| `requiresAuth` | boolean | No | Requires authentication |

## Role Types

| Role | Description | Access Level |
|------|-------------|--------------|
| `*` | All users | Public routes |
| `admin` | Administrators | Full access |
| `faculty` | Faculty members | Limited admin access |
| `student` | Students | Student-specific routes |

## Common Patterns

### Public Route
```javascript
{
  id: 'home',
  path: '/',
  component: HomePage,
  isPublic: true,
  roles: ['*'],
}
```

### Admin-Only Route
```javascript
{
  id: 'admin-dashboard',
  path: '/admin/dashboard',
  component: AdminDashboard,
  isPublic: false,
  roles: ['admin'],
  requiresAuth: true,
}
```

### Multi-Role Route
```javascript
{
  id: 'events',
  path: '/admin/events',
  component: Events,
  isPublic: false,
  roles: ['admin', 'faculty'],
  requiresAuth: true,
}
```

### All Authenticated Users
```javascript
{
  id: 'profile',
  path: '/profile/settings',
  component: UserProfileSettings,
  isPublic: false,
  roles: ['admin', 'faculty', 'student'],
  requiresAuth: true,
}
```

## API Endpoints (Optional)

### Get Routes
```javascript
GET /api/routes
Authorization: Bearer {token}

Response:
{
  "success": true,
  "routes": [...],
  "role": "admin"
}
```

### Check Access
```javascript
POST /api/routes/check-access
Authorization: Bearer {token}
Body: { "path": "/admin/dashboard" }

Response:
{
  "success": true,
  "hasAccess": true,
  "role": "admin"
}
```

## Helper Functions

### getRoutesByRole(role)
```javascript
// Get all routes accessible by a role
const routes = getRoutesByRole('admin');
```

### hasRouteAccess(path, role)
```javascript
// Check if role can access a specific path
const canAccess = hasRouteAccess('/admin/dashboard', 'admin');
```

## Hook Return Values

### useDynamicRoutes()
```javascript
{
  routes: Array,      // Filtered routes for current user
  loading: boolean,   // Loading state
  userRole: string,   // Current user role
  isAuthenticated: boolean  // Auth status
}
```

## Component Props

### DynamicRouteGuard
```javascript
<DynamicRouteGuard route={routeObject}>
  <YourComponent />
</DynamicRouteGuard>
```

### RouteLoader
```javascript
<RouteLoader fallback={<CustomLoader />}>
  <YourComponent />
</RouteLoader>
```

## Testing Snippets

### Test Route Filtering
```javascript
console.log('Public:', getRoutesByRole(null).length);
console.log('Admin:', getRoutesByRole('admin').length);
console.log('Faculty:', getRoutesByRole('faculty').length);
console.log('Student:', getRoutesByRole('student').length);
```

### Test Access Control
```javascript
const testCases = [
  { path: '/', role: null, expected: true },
  { path: '/admin/dashboard', role: 'admin', expected: true },
  { path: '/admin/dashboard', role: 'student', expected: false },
];

testCases.forEach(test => {
  const result = hasRouteAccess(test.path, test.role);
  console.assert(result === test.expected, `Failed: ${test.path} for ${test.role}`);
});
```

## Migration from Static Routes

### Before (Static)
```javascript
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### After (Dynamic)
```javascript
// Routes automatically generated from config
<DynamicRoutes />
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Routes not loading | Check auth loading state |
| Access denied | Verify role in routeConfig |
| Lazy load error | Check component import path |
| Redirect loop | Verify fallback routes |
| Role not recognized | Check user object structure |

## Performance Tips

1. Use lazy loading for all routes
2. Memoize route filtering
3. Cache route configuration
4. Minimize re-renders
5. Use code splitting

## Security Checklist

- [ ] All protected routes require authentication
- [ ] Role validation on both frontend and backend
- [ ] Token validation before route access
- [ ] Proper redirect handling
- [ ] No sensitive data in route config
- [ ] Server-side access control
- [ ] Logout clears all auth data

## Related Documentation

- [README.md](./README.md) - Complete overview
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Detailed implementation
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration steps
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation

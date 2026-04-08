# Dynamic Routing System Documentation

## Overview

The dynamic routing system allows routes to be loaded and filtered dynamically based on user authentication status and roles. This provides better security, maintainability, and flexibility compared to static route definitions.

## Key Features

- **Role-Based Access Control**: Routes are filtered based on user roles (admin, faculty, student)
- **Lazy Loading**: Components are loaded on-demand for better performance
- **Centralized Configuration**: All routes defined in a single configuration file
- **Dynamic Route Guards**: Automatic access control and redirects
- **API Integration Ready**: Can fetch routes from backend API
- **Type Safety**: Clear route structure with metadata

## Architecture

### Frontend Components

1. **Route Configuration** (`client/src/config/routeConfig.js`)
   - Central definition of all application routes
   - Role-based access rules
   - Component lazy loading setup

2. **Dynamic Routes Hook** (`client/src/hooks/useDynamicRoutes.js`)
   - Filters routes based on user role
   - Can fetch routes from API
   - Manages loading states

3. **Route Guard** (`client/src/context/DynamicRouteGuard.jsx`)
   - Validates user access to routes
   - Handles redirects for unauthorized access
   - Shows loading states

4. **Route Loader** (`client/src/components/system-components/RouteLoader.jsx`)
   - Handles lazy loading with Suspense
   - Shows loading fallback UI

### Backend Components

1. **Route Controller** (`server/app/Http/Controllers/RouteController.php`)
   - Optional API endpoint for serving routes
   - Role-based route filtering
   - Access validation endpoint

2. **API Routes** (`server/routes/api.php`)
   - `/api/routes` - Get available routes
   - `/api/routes/check-access` - Validate route access

## Route Structure

Each route has the following properties:

```javascript
{
  id: 'unique-identifier',
  path: '/route/path',
  component: LazyLoadedComponent,
  isPublic: true/false,
  title: 'Page Title',
  roles: ['admin', 'faculty', 'student', '*'],
  requiresAuth: true/false
}
```

## Usage

### Adding a New Route

1. Import the component in `routeConfig.js`:
```javascript
const NewPage = lazy(() => import('../pages/NewPage'));
```

2. Add route definition:
```javascript
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

### Checking Route Access

```javascript
import { hasRouteAccess } from '../config/routeConfig';

const canAccess = hasRouteAccess('/admin/dashboard', userRole);
```

### Getting Routes by Role

```javascript
import { getRoutesByRole } from '../config/routeConfig';

const userRoutes = getRoutesByRole('admin');
```

## Migration from Static Routes

The system has been migrated from static route definitions to dynamic routing:

**Before:**
```javascript
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

**After:**
```javascript
// Routes are automatically generated from configuration
<DynamicRoutes />
```

## API Integration (Optional)

To fetch routes from the backend API instead of using local configuration:

1. Uncomment the API fetch code in `useDynamicRoutes.js`
2. Ensure backend route endpoint is accessible
3. Routes will be fetched on app load and user authentication

## Benefits

1. **Security**: Centralized access control
2. **Maintainability**: Single source of truth for routes
3. **Performance**: Lazy loading reduces initial bundle size
4. **Flexibility**: Easy to add/remove routes
5. **Scalability**: Can move to database-driven routing
6. **Developer Experience**: Clear route structure and metadata

## Role Types

- `*` - All users (including unauthenticated)
- `admin` - Administrator users
- `faculty` - Faculty members
- `student` - Student users

## Special Routes

- **Admin Redirect**: `/admin` → `/admin/login`
- **Not Found**: `*` → `/` (home page)

## Testing

Test route access with different user roles:

```javascript
// Test as admin
const adminRoutes = getRoutesByRole('admin');
console.log('Admin routes:', adminRoutes.length);

// Test as faculty
const facultyRoutes = getRoutesByRole('faculty');
console.log('Faculty routes:', facultyRoutes.length);

// Test as unauthenticated
const publicRoutes = getRoutesByRole(null);
console.log('Public routes:', publicRoutes.length);
```

## Future Enhancements

1. Database-driven route configuration
2. Dynamic permission system
3. Route analytics and tracking
4. A/B testing for routes
5. Feature flags integration
6. Route-level middleware
7. Breadcrumb generation
8. Sitemap generation

## Troubleshooting

### Routes not loading
- Check if `useDynamicRoutes` hook is properly initialized
- Verify user authentication status
- Check browser console for errors

### Access denied errors
- Verify user role matches route requirements
- Check `routeConfig.js` for correct role definitions
- Ensure `hasRouteAccess` function is working

### Lazy loading issues
- Check component import paths
- Verify component exports are correct
- Check for circular dependencies

## Related Files

- `client/src/App.jsx` - Main app with dynamic routing
- `client/src/config/routeConfig.js` - Route definitions
- `client/src/hooks/useDynamicRoutes.js` - Route loading hook
- `client/src/context/DynamicRouteGuard.jsx` - Access control
- `client/src/context/AuthContext.jsx` - Authentication context
- `server/app/Http/Controllers/RouteController.php` - Backend API
- `server/routes/api.php` - API route definitions

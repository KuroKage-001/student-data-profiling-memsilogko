# Dynamic Routing Implementation Guide

## Step-by-Step Implementation

### Phase 1: Configuration Setup

#### 1.1 Create Route Configuration
File: `client/src/config/routeConfig.js`

```javascript
import { lazy } from 'react';

// Lazy load all page components
const HomePage = lazy(() => import('../pages/system-page/HomePage'));
// ... other imports

export const routeConfig = [
  {
    id: 'home',
    path: '/',
    component: HomePage,
    isPublic: true,
    title: 'Home',
    roles: ['*'],
  },
  // ... other routes
];
```

**Key Points:**
- Use `lazy()` for code splitting
- Define clear role requirements
- Set `isPublic` flag appropriately
- Use unique IDs for each route

### Phase 2: Hook Implementation

#### 2.1 Create Dynamic Routes Hook
File: `client/src/hooks/useDynamicRoutes.js`

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRoutesByRole } from '../config/routeConfig';

export const useDynamicRoutes = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoutes = async () => {
      const userRole = user?.role || user?.user_type;
      const filteredRoutes = getRoutesByRole(userRole);
      setRoutes(filteredRoutes);
      setLoading(false);
    };

    if (!authLoading) {
      loadRoutes();
    }
  }, [user, authLoading]);

  return { routes, loading, isAuthenticated };
};
```

**Key Points:**
- Wait for auth to complete before loading routes
- Filter routes based on user role
- Handle loading states properly

### Phase 3: Route Guard Implementation

#### 3.1 Create Route Guard Component
File: `client/src/context/DynamicRouteGuard.jsx`

```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasRouteAccess } from '../config/routeConfig';

const DynamicRouteGuard = ({ children, route }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (route.isPublic) {
    return children;
  }

  if (route.requiresAuth && !isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role || user?.user_type;
  const hasAccess = hasRouteAccess(route.path, userRole);

  if (!hasAccess) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};
```

**Key Points:**
- Check authentication first
- Validate role-based access
- Preserve location for redirects
- Show loading states

### Phase 4: App Integration

#### 4.1 Update App.jsx
File: `client/src/App.jsx`

```javascript
import { useDynamicRoutes } from './hooks/useDynamicRoutes';
import DynamicRouteGuard from './context/DynamicRouteGuard';
import RouteLoader from './components/system-components/RouteLoader';

const DynamicRoutes = () => {
  const { routes, loading } = useDynamicRoutes();

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={
            <DynamicRouteGuard route={route}>
              <RouteLoader>
                <route.component />
              </RouteLoader>
            </DynamicRouteGuard>
          }
        />
      ))}
      {/* Special routes */}
    </Routes>
  );
};
```

**Key Points:**
- Use unique keys for routes
- Wrap with route guard
- Use Suspense for lazy loading
- Handle special routes separately

### Phase 5: Backend API (Optional)

#### 5.1 Create Route Controller
File: `server/app/Http/Controllers/RouteController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RouteController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $role = $user ? $user->role : null;
        $routes = $this->getRoutesByRole($role);

        return response()->json([
            'success' => true,
            'routes' => $routes,
            'role' => $role,
        ]);
    }

    private function getRoutesByRole($role)
    {
        // Return filtered routes based on role
    }
}
```

#### 5.2 Add API Routes
File: `server/routes/api.php`

```php
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::get('routes', [RouteController::class, 'index']);
    Route::post('routes/check-access', [RouteController::class, 'checkAccess']);
});
```

### Phase 6: Testing

#### 6.1 Test Route Access

```javascript
// Test 1: Public routes
const publicRoutes = getRoutesByRole(null);
console.assert(publicRoutes.every(r => r.isPublic), 'All public routes accessible');

// Test 2: Admin routes
const adminRoutes = getRoutesByRole('admin');
console.assert(adminRoutes.length > publicRoutes.length, 'Admin has more routes');

// Test 3: Faculty routes
const facultyRoutes = getRoutesByRole('faculty');
console.assert(facultyRoutes.some(r => r.id === 'events'), 'Faculty can access events');

// Test 4: Access validation
const hasAccess = hasRouteAccess('/admin/dashboard', 'admin');
console.assert(hasAccess === true, 'Admin can access dashboard');
```

#### 6.2 Manual Testing Checklist

- [ ] Unauthenticated user sees only public routes
- [ ] Login redirects to appropriate dashboard
- [ ] Admin can access all admin routes
- [ ] Faculty can access faculty-specific routes
- [ ] Students can access student-specific routes
- [ ] Unauthorized access redirects properly
- [ ] Lazy loading works correctly
- [ ] Loading states display properly
- [ ] Browser back/forward works correctly
- [ ] Direct URL access is protected

## Common Patterns

### Pattern 1: Adding a New Protected Route

```javascript
// 1. Add to routeConfig.js
const NewPage = lazy(() => import('../pages/NewPage'));

{
  id: 'new-page',
  path: '/admin/new-page',
  component: NewPage,
  isPublic: false,
  title: 'New Page',
  roles: ['admin'],
  requiresAuth: true,
}

// 2. Create the page component
// 3. Test access with different roles
```

### Pattern 2: Adding a Public Route

```javascript
{
  id: 'about',
  path: '/about',
  component: AboutPage,
  isPublic: true,
  title: 'About',
  roles: ['*'],
}
```

### Pattern 3: Multi-Role Route

```javascript
{
  id: 'reports',
  path: '/reports',
  component: ReportsPage,
  isPublic: false,
  title: 'Reports',
  roles: ['admin', 'faculty'],
  requiresAuth: true,
}
```

### Pattern 4: Conditional Route Display

```javascript
// In navigation component
const { routes } = useDynamicRoutes();

const navItems = routes
  .filter(route => !route.isPublic)
  .map(route => ({
    path: route.path,
    title: route.title,
  }));
```

## Migration Checklist

- [x] Create route configuration file
- [x] Implement useDynamicRoutes hook
- [x] Create DynamicRouteGuard component
- [x] Create RouteLoader component
- [x] Update App.jsx to use dynamic routes
- [x] Remove old static route definitions
- [x] Add backend API endpoints (optional)
- [x] Create route service (optional)
- [x] Test all routes with different roles
- [x] Update navigation components
- [x] Update documentation

## Performance Considerations

1. **Lazy Loading**: All routes use lazy loading to reduce initial bundle size
2. **Memoization**: Use `useMemo` for expensive computations
3. **Route Caching**: Routes are loaded once per authentication change
4. **Code Splitting**: Each page is a separate chunk

## Security Considerations

1. **Server-Side Validation**: Always validate access on the backend
2. **Token Validation**: Check token expiry before route access
3. **Role Verification**: Verify user role on every protected route
4. **Redirect Handling**: Prevent redirect loops
5. **State Management**: Clear sensitive data on logout

## Troubleshooting

### Issue: Routes not updating after login
**Solution**: Ensure `useDynamicRoutes` depends on `user` state

### Issue: Lazy loading errors
**Solution**: Check component export format (default vs named)

### Issue: Infinite redirect loop
**Solution**: Verify route guard logic and fallback routes

### Issue: Role not recognized
**Solution**: Check user object structure (`role` vs `user_type`)

## Next Steps

1. Test with all user roles
2. Update navigation components to use dynamic routes
3. Add route analytics
4. Implement breadcrumb generation
5. Add route-level permissions
6. Create admin UI for route management

# Migration Guide: Static to Dynamic Routing

## Overview

This guide walks through migrating from static route definitions to the dynamic routing system.

## Before & After Comparison

### Before: Static Routes

```javascript
// App.jsx - Static Implementation
import HomePage from './pages/system-page/HomePage';
import LoginPage from './pages/system-page/LoginPage';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
// ... 10+ more imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        {/* ... 10+ more route definitions */}
      </Routes>
    </Router>
  );
}
```

**Issues:**
- ❌ All components loaded upfront
- ❌ Repetitive route definitions
- ❌ No centralized access control
- ❌ Hard to maintain
- ❌ No role-based filtering
- ❌ Large initial bundle size

### After: Dynamic Routes

```javascript
// App.jsx - Dynamic Implementation
import { useDynamicRoutes } from './hooks/useDynamicRoutes';
import DynamicRouteGuard from './context/DynamicRouteGuard';
import RouteLoader from './components/system-components/RouteLoader';

const DynamicRoutes = () => {
  const { routes, loading } = useDynamicRoutes();

  if (loading) return <div>Loading...</div>;

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
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <DynamicRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

**Benefits:**
- ✅ Lazy loading (code splitting)
- ✅ Centralized configuration
- ✅ Role-based access control
- ✅ Easy to maintain
- ✅ Automatic route filtering
- ✅ Smaller initial bundle

## Migration Steps

### Step 1: Create Route Configuration

Create `client/src/config/routeConfig.js`:

```javascript
import { lazy } from 'react';

// Convert all imports to lazy loading
const HomePage = lazy(() => import('../pages/system-page/HomePage'));
const LoginPage = lazy(() => import('../pages/system-page/LoginPage'));
const AdminDashboard = lazy(() => import('../pages/admin-pages/AdminDashboard'));
// ... convert all other imports

export const routeConfig = [
  // Convert each <Route> to a config object
  {
    id: 'home',
    path: '/',
    component: HomePage,
    isPublic: true,
    title: 'Home',
    roles: ['*'],
  },
  {
    id: 'login',
    path: '/admin/login',
    component: LoginPage,
    isPublic: true,
    title: 'Login',
    roles: ['*'],
  },
  {
    id: 'admin-dashboard',
    path: '/admin/dashboard',
    component: AdminDashboard,
    isPublic: false,
    title: 'Dashboard',
    roles: ['admin'],
    requiresAuth: true,
  },
  // ... convert all other routes
];
```

### Step 2: Create Dynamic Routes Hook

Create `client/src/hooks/useDynamicRoutes.js`:

```javascript
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { routeConfig, getRoutesByRole } from '../config/routeConfig';

export const useDynamicRoutes = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = useMemo(() => {
    if (!user) return null;
    return user.role || user.user_type || null;
  }, [user]);

  useEffect(() => {
    const loadRoutes = async () => {
      setLoading(true);
      try {
        const filteredRoutes = getRoutesByRole(userRole);
        setRoutes(filteredRoutes);
      } catch (error) {
        console.error('Error loading routes:', error);
        setRoutes(routeConfig.filter(route => route.isPublic));
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadRoutes();
    }
  }, [userRole, authLoading]);

  return {
    routes,
    loading: loading || authLoading,
    userRole,
    isAuthenticated,
  };
};
```

### Step 3: Create Route Guard

Create `client/src/context/DynamicRouteGuard.jsx`:

```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { hasRouteAccess } from '../config/routeConfig';

const DynamicRouteGuard = ({ children, route }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
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
    const redirectTo = isAuthenticated ? '/admin/dashboard' : '/admin/login';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default DynamicRouteGuard;
```

### Step 4: Create Route Loader

Create `client/src/components/system-components/RouteLoader.jsx`:

```javascript
import { Suspense } from 'react';

const RouteLoader = ({ children, fallback }) => {
  const defaultFallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading page...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default RouteLoader;
```

### Step 5: Update App.jsx

Replace the entire routing section in `App.jsx`:

```javascript
// Remove all static imports
// Remove: import HomePage from './pages/system-page/HomePage';
// Remove: import LoginPage from './pages/system-page/LoginPage';
// etc.

// Add new imports
import { useDynamicRoutes } from './hooks/useDynamicRoutes';
import DynamicRouteGuard from './context/DynamicRouteGuard';
import RouteLoader from './components/system-components/RouteLoader';
import { specialRoutes } from './config/routeConfig';

// Add DynamicRoutes component
const DynamicRoutes = () => {
  const { routes, loading } = useDynamicRoutes();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
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

      <Route 
        path={specialRoutes.adminRedirect.from} 
        element={<Navigate to={specialRoutes.adminRedirect.to} replace />} 
      />
      
      <Route 
        path={specialRoutes.notFound.from} 
        element={<Navigate to={specialRoutes.notFound.to} replace />} 
      />
    </Routes>
  );
};

// Update App function
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <DynamicRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### Step 6: Optional - Add Backend API

Create `server/app/Http/Controllers/RouteController.php` (see implementation guide).

Add routes to `server/routes/api.php`:

```php
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::get('routes', [App\Http\Controllers\RouteController::class, 'index']);
    Route::post('routes/check-access', [App\Http\Controllers\RouteController::class, 'checkAccess']);
});
```

### Step 7: Test Migration

Run through this checklist:

```javascript
// Test 1: Public access
// - Open app without login
// - Should see only public routes (home, login)

// Test 2: Admin access
// - Login as admin
// - Should see all admin routes
// - Try accessing /admin/dashboard - should work

// Test 3: Faculty access
// - Login as faculty
// - Should see faculty-allowed routes
// - Try accessing /admin/user-management - should redirect

// Test 4: Student access
// - Login as student
// - Should see student routes
// - Try accessing admin routes - should redirect

// Test 5: Direct URL access
// - Copy protected route URL
// - Logout
// - Paste URL - should redirect to login

// Test 6: Lazy loading
// - Open Network tab
// - Navigate between pages
// - Should see separate chunk files loading
```

## Conversion Table

| Old Pattern | New Pattern |
|-------------|-------------|
| `import Component from './path'` | `const Component = lazy(() => import('./path'))` |
| `<Route path="/" element={<Component />} />` | Config object in `routeConfig` |
| `<ProtectedRoute><Component /></ProtectedRoute>` | `<DynamicRouteGuard route={route}>` |
| Manual role checking | Automatic via `roles` array |
| All routes visible | Filtered by `getRoutesByRole()` |

## Breaking Changes

1. **Import Changes**: All page imports must be converted to lazy loading
2. **Route Structure**: Routes defined in config instead of JSX
3. **Protection**: Use `DynamicRouteGuard` instead of `ProtectedRoute`
4. **Role Field**: Ensure user object has `role` or `user_type` field

## Rollback Plan

If issues occur, you can rollback by:

1. Restore original `App.jsx` from git
2. Keep new files for future use
3. Fix issues and retry migration

```bash
# Rollback command
git checkout HEAD -- client/src/App.jsx
```

## Post-Migration Tasks

- [ ] Remove unused `ProtectedRoute.jsx` (optional)
- [ ] Update navigation components to use dynamic routes
- [ ] Add route analytics
- [ ] Update tests
- [ ] Update documentation
- [ ] Train team on new system

## Performance Comparison

### Bundle Size (Example)

**Before:**
- Initial bundle: ~500KB
- All components loaded upfront

**After:**
- Initial bundle: ~200KB
- Components loaded on-demand
- 60% reduction in initial load

### Load Time (Example)

**Before:**
- First load: 3.5s
- Route change: instant (already loaded)

**After:**
- First load: 1.2s (65% faster)
- Route change: 0.3s (lazy load)
- Overall better UX

## Troubleshooting

### Issue: "Cannot read property 'component' of undefined"
**Cause**: Route not found in config
**Fix**: Check route ID and path in `routeConfig.js`

### Issue: Infinite loading
**Cause**: Auth loading never completes
**Fix**: Check `AuthContext` loading state logic

### Issue: All routes visible to everyone
**Cause**: Role filtering not working
**Fix**: Verify `getRoutesByRole()` logic and user role field

### Issue: Lazy loading errors
**Cause**: Incorrect import path
**Fix**: Verify component paths in lazy imports

## Support

For issues or questions:
1. Check [README.md](./README.md)
2. Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
3. Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. Review console errors
5. Check network tab for failed requests

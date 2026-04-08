# Dynamic Routing API Reference

## Frontend API

### Configuration

#### routeConfig

Array of route configuration objects.

```javascript
import { routeConfig } from '../config/routeConfig';
```

**Type:**
```typescript
Array<{
  id: string;
  path: string;
  component: LazyExoticComponent;
  isPublic: boolean;
  title: string;
  roles: string[];
  requiresAuth?: boolean;
}>
```

**Example:**
```javascript
const routes = routeConfig;
console.log(routes.length); // Total number of routes
```

---

#### specialRoutes

Special route configurations for redirects and catch-all.

```javascript
import { specialRoutes } from '../config/routeConfig';
```

**Type:**
```typescript
{
  adminRedirect: { from: string; to: string };
  notFound: { from: string; to: string };
}
```

**Example:**
```javascript
console.log(specialRoutes.adminRedirect); 
// { from: '/admin', to: '/admin/login' }
```

---

### Helper Functions

#### getRoutesByRole(userRole)

Filters routes based on user role.

**Parameters:**
- `userRole` (string | null): User role or null for unauthenticated

**Returns:** `Array<RouteConfig>`

**Example:**
```javascript
import { getRoutesByRole } from '../config/routeConfig';

// Get public routes
const publicRoutes = getRoutesByRole(null);

// Get admin routes
const adminRoutes = getRoutesByRole('admin');

// Get faculty routes
const facultyRoutes = getRoutesByRole('faculty');
```

---

#### hasRouteAccess(routePath, userRole)

Checks if a user role has access to a specific route.

**Parameters:**
- `routePath` (string): Route path to check
- `userRole` (string | null): User role or null

**Returns:** `boolean`

**Example:**
```javascript
import { hasRouteAccess } from '../config/routeConfig';

const canAccessDashboard = hasRouteAccess('/admin/dashboard', 'admin');
// Returns: true

const canAccessUserMgmt = hasRouteAccess('/admin/user-management', 'student');
// Returns: false
```

---

### Hooks

#### useDynamicRoutes()

Custom hook for loading and filtering routes dynamically.

**Returns:**
```typescript
{
  routes: Array<RouteConfig>;
  loading: boolean;
  userRole: string | null;
  isAuthenticated: boolean;
}
```

**Example:**
```javascript
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';

function MyComponent() {
  const { routes, loading, userRole, isAuthenticated } = useDynamicRoutes();

  if (loading) {
    return <div>Loading routes...</div>;
  }

  return (
    <div>
      <p>User Role: {userRole}</p>
      <p>Available Routes: {routes.length}</p>
      <ul>
        {routes.map(route => (
          <li key={route.id}>{route.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Components

#### DynamicRouteGuard

Route guard component for access control.

**Props:**
```typescript
{
  children: ReactNode;
  route: RouteConfig;
}
```

**Example:**
```javascript
import DynamicRouteGuard from '../context/DynamicRouteGuard';

<DynamicRouteGuard route={routeObject}>
  <YourProtectedComponent />
</DynamicRouteGuard>
```

**Behavior:**
- Shows loading state while checking auth
- Allows access to public routes
- Redirects to login if auth required but not authenticated
- Redirects to dashboard if role doesn't have access
- Renders children if all checks pass

---

#### RouteLoader

Suspense wrapper for lazy-loaded components.

**Props:**
```typescript
{
  children: ReactNode;
  fallback?: ReactNode;
}
```

**Example:**
```javascript
import RouteLoader from '../components/system-components/RouteLoader';

// With default fallback
<RouteLoader>
  <LazyComponent />
</RouteLoader>

// With custom fallback
<RouteLoader fallback={<CustomLoader />}>
  <LazyComponent />
</RouteLoader>
```

---

## Backend API

### Endpoints

#### GET /api/routes

Get available routes for authenticated user.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "routes": [
    {
      "id": "admin-dashboard",
      "path": "/admin/dashboard",
      "component": "AdminDashboard",
      "isPublic": false,
      "title": "Dashboard",
      "roles": ["admin"],
      "requiresAuth": true
    }
  ],
  "role": "admin"
}
```

**Example:**
```javascript
const response = await fetch('/api/routes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log(data.routes);
```

---

#### POST /api/routes/check-access

Check if user has access to a specific route.

**Authentication:** Required

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "path": "/admin/dashboard"
}
```

**Response:**
```json
{
  "success": true,
  "hasAccess": true,
  "role": "admin"
}
```

**Example:**
```javascript
const response = await fetch('/api/routes/check-access', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ path: '/admin/dashboard' })
});
const data = await response.json();
console.log(data.hasAccess); // true or false
```

---

### Service Layer

#### routeService.getRoutes()

Fetch routes from API.

**Returns:** `Promise<{ success: boolean; routes?: Array; role?: string; error?: string }>`

**Example:**
```javascript
import { routeService } from '../services/system-service/routeService';

const result = await routeService.getRoutes();
if (result.success) {
  console.log('Routes:', result.routes);
  console.log('Role:', result.role);
} else {
  console.error('Error:', result.error);
}
```

---

#### routeService.checkAccess(path)

Check route access via API.

**Parameters:**
- `path` (string): Route path to check

**Returns:** `Promise<{ success: boolean; hasAccess?: boolean; role?: string; error?: string }>`

**Example:**
```javascript
import { routeService } from '../services/system-service/routeService';

const result = await routeService.checkAccess('/admin/dashboard');
if (result.success) {
  console.log('Has Access:', result.hasAccess);
  console.log('Role:', result.role);
} else {
  console.error('Error:', result.error);
}
```

---

## Type Definitions

### RouteConfig

```typescript
interface RouteConfig {
  id: string;                    // Unique identifier
  path: string;                  // URL path
  component: LazyExoticComponent; // Lazy-loaded component
  isPublic: boolean;             // Public access flag
  title: string;                 // Page title
  roles: string[];               // Allowed roles
  requiresAuth?: boolean;        // Requires authentication
}
```

### SpecialRoutes

```typescript
interface SpecialRoutes {
  adminRedirect: {
    from: string;
    to: string;
  };
  notFound: {
    from: string;
    to: string;
  };
}
```

### UseDynamicRoutesReturn

```typescript
interface UseDynamicRoutesReturn {
  routes: RouteConfig[];
  loading: boolean;
  userRole: string | null;
  isAuthenticated: boolean;
}
```

---

## Constants

### Role Constants

```javascript
const ROLES = {
  ALL: '*',
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};
```

### Default Paths

```javascript
const DEFAULT_PATHS = {
  HOME: '/',
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
};
```

---

## Error Handling

### Frontend Errors

```javascript
try {
  const routes = getRoutesByRole(userRole);
} catch (error) {
  console.error('Route loading error:', error);
  // Fallback to public routes
  const publicRoutes = routeConfig.filter(r => r.isPublic);
}
```

### API Errors

```javascript
const result = await routeService.getRoutes();
if (!result.success) {
  switch (result.error) {
    case 'Unauthorized':
      // Redirect to login
      break;
    case 'Network Error':
      // Show offline message
      break;
    default:
      // Show generic error
  }
}
```

---

## Usage Examples

### Example 1: Navigation Menu

```javascript
import { useDynamicRoutes } from '../hooks/useDynamicRoutes';
import { Link } from 'react-router-dom';

function Navigation() {
  const { routes, loading } = useDynamicRoutes();

  if (loading) return <div>Loading...</div>;

  const navRoutes = routes.filter(r => !r.isPublic);

  return (
    <nav>
      {navRoutes.map(route => (
        <Link key={route.id} to={route.path}>
          {route.title}
        </Link>
      ))}
    </nav>
  );
}
```

### Example 2: Breadcrumbs

```javascript
import { useLocation } from 'react-router-dom';
import { routeConfig } from '../config/routeConfig';

function Breadcrumbs() {
  const location = useLocation();
  const currentRoute = routeConfig.find(r => r.path === location.pathname);

  return (
    <div>
      <span>Home</span>
      {currentRoute && (
        <>
          <span> / </span>
          <span>{currentRoute.title}</span>
        </>
      )}
    </div>
  );
}
```

### Example 3: Route Analytics

```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeConfig } from '../config/routeConfig';

function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const route = routeConfig.find(r => r.path === location.pathname);
    if (route) {
      // Track page view
      analytics.track('Page View', {
        routeId: route.id,
        routePath: route.path,
        routeTitle: route.title,
      });
    }
  }, [location]);

  return null;
}
```

### Example 4: Conditional Rendering

```javascript
import { hasRouteAccess } from '../config/routeConfig';
import { useAuth } from '../context/AuthContext';

function AdminButton() {
  const { user } = useAuth();
  const userRole = user?.role;
  const canAccessAdmin = hasRouteAccess('/admin/dashboard', userRole);

  if (!canAccessAdmin) return null;

  return <button>Go to Admin</button>;
}
```

---

## Testing

### Unit Tests

```javascript
import { getRoutesByRole, hasRouteAccess } from '../config/routeConfig';

describe('Route Configuration', () => {
  test('public routes accessible without role', () => {
    const routes = getRoutesByRole(null);
    expect(routes.every(r => r.isPublic)).toBe(true);
  });

  test('admin has access to all routes', () => {
    const routes = getRoutesByRole('admin');
    expect(routes.length).toBeGreaterThan(5);
  });

  test('hasRouteAccess validates correctly', () => {
    expect(hasRouteAccess('/', null)).toBe(true);
    expect(hasRouteAccess('/admin/dashboard', 'admin')).toBe(true);
    expect(hasRouteAccess('/admin/dashboard', 'student')).toBe(false);
  });
});
```

### Integration Tests

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders dynamic routes', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Wait for routes to load
  await screen.findByText(/home/i);
  
  // Verify public routes are accessible
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});
```

---

## Performance Optimization

### Memoization

```javascript
import { useMemo } from 'react';
import { getRoutesByRole } from '../config/routeConfig';

const routes = useMemo(() => {
  return getRoutesByRole(userRole);
}, [userRole]);
```

### Route Preloading

```javascript
import { useEffect } from 'react';

function preloadRoute(routePath) {
  const route = routeConfig.find(r => r.path === routePath);
  if (route) {
    // Trigger lazy load
    route.component.preload?.();
  }
}

// Preload likely next route
useEffect(() => {
  preloadRoute('/admin/dashboard');
}, []);
```

---

## Security Notes

1. Always validate access on the backend
2. Don't expose sensitive route information
3. Use HTTPS for API calls
4. Validate tokens before serving routes
5. Log unauthorized access attempts
6. Implement rate limiting on route endpoints
7. Clear route cache on logout

---

## Version History

- v1.0.0 - Initial dynamic routing implementation
- v1.1.0 - Added API integration
- v1.2.0 - Added route analytics support
- v1.3.0 - Performance optimizations

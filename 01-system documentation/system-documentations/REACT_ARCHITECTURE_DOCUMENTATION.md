# React Architecture Documentation
## Student Data Profiling System

---

## Table of Contents
1. [Client-Side Routing](#client-side-routing)
2. [Dynamic Routes](#dynamic-routes)
3. [Props (Component Communication)](#props-component-communication)
4. [Local State Management](#local-state-management)
5. [Global State Management](#global-state-management)
6. [Data Flow Architecture](#data-flow-architecture)

---

## 1. Client-Side Routing

### Overview
The application uses **React Router v6** for client-side routing, enabling single-page application (SPA) navigation without full page reloads.

### Implementation Location
- **File**: `client/src/App.jsx`
- **Router**: `BrowserRouter` (aliased as `Router`)

### Route Structure

```javascript
<Router>
  <Routes>
    {/* System Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/admin/login" element={<LoginPage />} />
    
    {/* Protected Admin Routes */}
    <Route path="/admin/dashboard" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />
    
    {/* Redirect Routes */}
    <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</Router>
```

### Route Types

#### 1. Public Routes
- `/` - Home page (accessible to all)
- `/admin/login` - Login page (accessible to all)

#### 2. Protected Routes
All admin routes are wrapped with `<ProtectedRoute>` component:
- `/admin/dashboard` - Admin dashboard
- `/admin/students` - Student profiles management
- `/admin/faculty` - Faculty profiles management
- `/admin/events` - Events management
- `/admin/scheduling` - Scheduling management
- `/admin/research` - Research materials
- `/admin/instructions` - Instructions page
- `/admin/user-management` - User management
- `/profile/settings` - User profile settings

#### 3. Redirect Routes
- `/admin` → redirects to `/admin/login`
- `*` (catch-all) → redirects to `/`

### Protected Route Implementation

**File**: `client/src/context/ProtectedRoute.jsx`

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};
```

**How it works:**
1. Checks if user is authenticated via global `AuthContext`
2. Shows loading state while validating session
3. Redirects to login if not authenticated
4. Renders protected content if authenticated

### Navigation Methods

#### 1. Declarative Navigation (Link Component)
```javascript
import { Link } from 'react-router-dom';

<Link to="/admin/dashboard">Dashboard</Link>
```

#### 2. Programmatic Navigation (useNavigate Hook)
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/admin/students');
```

**Example from AdminDashboard.jsx:**
```javascript
const handleNavigateToStudents = () => {
  navigate('/admin/students');
};
```

---

## 2. Dynamic Routes

### Current Implementation Status
The application currently does **NOT** implement dynamic routes with URL parameters.

### What Dynamic Routes Would Look Like
If implemented, dynamic routes would follow this pattern:

```javascript
// Route definition
<Route path="/admin/students/:id" element={<StudentDetail />} />

// Component usage
import { useParams } from 'react-router-dom';

const StudentDetail = () => {
  const { id } = useParams();
  // Fetch student data using id
};
```

### Current Alternative Approach
Instead of dynamic routes, the application uses:
- **Modal-based detail views** - Student/Faculty details shown in modals
- **State-based navigation** - Data passed through component state
- **Query parameters** (if needed for filtering/searching)

**Example**: Student profiles are viewed in a modal overlay rather than a separate route:
```javascript
<StudentProfileModal 
  student={selectedStudent} 
  onClose={handleCloseModal}
/>
```

---

## 3. Props (Component Communication)

### Overview
Props enable parent-to-child component communication, passing data and functions down the component tree.

### Props Patterns Used

#### 1. Data Props
Passing data from parent to child:

```javascript
// Parent: AdminDashboard.jsx
<DashboardStats />

// Child: DashboardStats.jsx receives data from hook
const DashboardStats = () => {
  const { data: statsData, isLoading } = useDashboardStats();
  // Render stats
};
```

#### 2. Callback Props
Passing functions to handle child events:

```javascript
// Parent: AdminLayout.jsx
<AdminNavbar onToggleSidebar={toggleSidebar} />

// Child: AdminNavbar.jsx
const AdminNavbar = ({ onToggleSidebar }) => {
  return <button onClick={onToggleSidebar}>Toggle</button>;
};
```

#### 3. Children Props
Passing components as children:

```javascript
// Parent: App.jsx
<ProtectedRoute>
  <AdminDashboard />
</ProtectedRoute>

// Wrapper: ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};
```

#### 4. Configuration Props
Passing configuration options:

```javascript
// Parent: UserProfileSettings.jsx
<AdminLayout hideSidebar>
  <UserProfileSettingsSkeleton activeTab={activeTab} />
</AdminLayout>

// Child: AdminLayout.jsx
const AdminLayout = ({ children, hideSidebar = false }) => {
  const shouldHideSidebar = hideSidebar || location.pathname === '/admin/profile-settings';
  // Conditionally render sidebar
};
```

### Complex Props Examples

#### Modal Components
```javascript
// StudentFormModal.jsx
const StudentFormModal = ({ 
  student,        // Data prop
  onClose,        // Callback prop
  onSubmit,       // Callback prop
  loading,        // State prop
  serverErrors    // Error prop
}) => {
  // Modal implementation
};
```

#### List Components
```javascript
// StudentList.jsx
const StudentList = ({ 
  searchTerm,         // Filter prop
  onViewStudent,      // Callback prop
  onEditStudent,      // Callback prop
  onDeleteStudent,    // Callback prop
  loading,            // State prop
  error,              // Error prop
  students            // Data prop
}) => {
  // List implementation
};
```

### Props Best Practices in the Project
1. **Destructuring**: Props are destructured in function parameters
2. **Default values**: Optional props have default values (`hideSidebar = false`)
3. **Type clarity**: Prop names clearly indicate their purpose
4. **Callback naming**: Event handlers prefixed with `on` (onClose, onSubmit)

---

## 4. Local State Management

### Overview
Local state is component-specific data managed with React's `useState` hook.

### Use Cases

#### 1. Form State
Managing form inputs and validation:

```javascript
// ResearchForm.jsx
const [formData, setFormData] = useState({
  title: '',
  author: '',
  department: '',
  research_type: '',
  keywords: []
});

const [selectedFile, setSelectedFile] = useState(null);
const [keywordInput, setKeywordInput] = useState('');
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
```

#### 2. UI State
Managing component visibility and interactions:

```javascript
// AdminLayout.jsx
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
  const saved = localStorage.getItem('sidebarCollapsed');
  return saved === 'true';
});
```

#### 3. Modal State
Controlling modal visibility:

```javascript
// StudentProfiles.jsx
const [showModal, setShowModal] = useState(false);
const [selectedStudent, setSelectedStudent] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
```

#### 4. Pagination State
Managing list pagination:

```javascript
// StudentList.jsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
```

#### 5. Toggle State
Managing boolean flags:

```javascript
// PasswordField.jsx
const [showPassword, setShowPassword] = useState(false);

// ChangePasswordTab.jsx
const [showPasswords, setShowPasswords] = useState({
  current: false,
  new: false,
  confirm: false
});
```

### State Update Patterns

#### 1. Direct Update
```javascript
setLoading(true);
setShowModal(false);
```

#### 2. Functional Update
```javascript
setFormData(prev => ({
  ...prev,
  [name]: value
}));
```

#### 3. Computed Initial State
```javascript
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
  const saved = localStorage.getItem('sidebarCollapsed');
  return saved === 'true';
});
```

---

## 5. Global State Management

### Overview
The application uses **React Context API** for global state management, specifically for authentication.

### Implementation

#### AuthContext Structure

**File**: `client/src/context/AuthContext.jsx`

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = {
    user,                    // Current user object
    setUser,                 // Update user function
    logout,                  // Logout function
    loading,                 // Loading state
    isAuthenticated: !!user, // Computed auth status
    clearAuthData,           // Clear auth data function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Global State Scope

**Provider Wrapping** (App.jsx):
```javascript
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Router>
      {/* All routes have access to auth state */}
    </Router>
  </AuthProvider>
</QueryClientProvider>
```

### Accessing Global State

#### Custom Hook Pattern
```javascript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### Usage in Components
```javascript
// AdminNavbar.jsx
const { logout, user } = useAuth();

// ProtectedRoute.jsx
const { isAuthenticated, loading } = useAuth();
```

### Global State Features

#### 1. Session Validation
```javascript
const validateSession = async () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  // Load from localStorage for fast initial render
  if (userData) {
    setUser(JSON.parse(userData));
  }

  // Validate with server in background
  try {
    const response = await authService.me();
    if (response.success && response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } else {
      clearAuthData();
    }
  } catch (error) {
    clearAuthData();
  } finally {
    setLoading(false);
  }
};
```

#### 2. Logout Functionality
```javascript
const logout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Server logout error:', error);
  } finally {
    clearAuthData();
  }
};
```

#### 3. Event Listeners
```javascript
useEffect(() => {
  validateSession();

  const handleAuthCleared = () => {
    setUser(null);
  };

  window.addEventListener('auth-cleared', handleAuthCleared);
  
  return () => {
    window.removeEventListener('auth-cleared', handleAuthCleared);
  };
}, []);
```

### Why Only Auth is Global?

**Design Decision**: Only authentication state is global because:
1. **Needed everywhere**: Auth status required across all protected routes
2. **Single source of truth**: User data should be consistent app-wide
3. **Performance**: Prevents prop drilling through many component layers
4. **Security**: Centralized auth logic easier to maintain and secure

**Other data** (students, faculty, events) uses:
- **React Query** for server state management
- **Local state** for component-specific data
- **Props** for parent-child communication

---

## 6. Data Flow Architecture

### Overview
The application follows a **unidirectional data flow** pattern with multiple data sources.

### Data Flow Layers

```
┌─────────────────────────────────────────────────────────┐
│                    User Interaction                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Component Layer                         │
│  (Local State + Props + Global State + React Query)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│         (API calls, data transformation)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend API                            │
│              (Laravel Server)                            │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

#### 1. Server State Management (React Query)

**Configuration** (App.jsx):
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

**Hook Pattern**:
```javascript
// hooks/admin-dashboard-hook/useDashboardStats.js
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const result = await dashboardService.getDashboardStats();
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
```

**Component Usage**:
```javascript
// DashboardStats.jsx
const DashboardStats = () => {
  const { data: statsData, isLoading, isError } = useDashboardStats();
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading stats</div>;
  
  return <div>{/* Render stats */}</div>;
};
```

#### 2. Loading State Flow

**Pattern**: Skeleton Loading
```javascript
// AdminDashboard.jsx
const { isLoading } = useDashboardStats();

if (isLoading) {
  return (
    <AdminLayout>
      <AdminDashboardSkeleton />
    </AdminLayout>
  );
}

return (
  <AdminLayout>
    <DashboardStats />
  </AdminLayout>
);
```

**Flow**:
1. Component mounts
2. React Query hook triggers API call
3. `isLoading = true` → Skeleton component renders
4. Data arrives → `isLoading = false` → Real component renders

#### 3. Form Submission Flow

```javascript
// Example: Student Form
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Validate locally
  const validationErrors = validateForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  // 2. Set loading state
  setLoading(true);
  
  // 3. Call service
  try {
    const result = await studentService.createStudent(formData);
    
    // 4. Handle success
    if (result.success) {
      onSubmit(result.data);
      onClose();
    }
  } catch (error) {
    // 5. Handle errors
    setErrors(error.errors || {});
  } finally {
    // 6. Reset loading
    setLoading(false);
  }
};
```

#### 4. Authentication Flow

```
User Login
    │
    ▼
LoginForm (local state)
    │
    ▼
authService.login()
    │
    ▼
Store token + user in localStorage
    │
    ▼
Update AuthContext (global state)
    │
    ▼
Navigate to /admin/dashboard
    │
    ▼
ProtectedRoute checks isAuthenticated
    │
    ▼
Render protected content
```

**Code Flow**:
```javascript
// 1. Login form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await authService.login(credentials);
  
  if (result.success) {
    // 2. Store in localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    // 3. Update global state
    setUser(result.user);
    
    // 4. Navigate
    navigate('/admin/dashboard');
  }
};

// 5. Protected route checks auth
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};
```

### Data Flow Best Practices

#### 1. Separation of Concerns
- **Components**: UI rendering and user interaction
- **Hooks**: Data fetching and state management logic
- **Services**: API communication
- **Utils**: Helper functions and validation

#### 2. Single Source of Truth
- **Auth state**: AuthContext (global)
- **Server data**: React Query cache
- **UI state**: Local component state
- **Form data**: Local component state

#### 3. Optimistic Updates
React Query supports optimistic updates (not heavily used in current implementation):
```javascript
const mutation = useMutation({
  mutationFn: updateStudent,
  onMutate: async (newStudent) => {
    // Optimistically update UI
    await queryClient.cancelQueries(['students']);
    const previousStudents = queryClient.getQueryData(['students']);
    queryClient.setQueryData(['students'], old => [...old, newStudent]);
    return { previousStudents };
  },
  onError: (err, newStudent, context) => {
    // Rollback on error
    queryClient.setQueryData(['students'], context.previousStudents);
  },
});
```

#### 4. Error Handling
```javascript
// Service layer
try {
  const response = await api.get('/students');
  return { success: true, data: response.data };
} catch (error) {
  return { 
    success: false, 
    message: error.response?.data?.message || 'An error occurred' 
  };
}

// Component layer
const { data, isError, error } = useQuery(['students'], fetchStudents);

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

### Complete Data Flow Example

**Scenario**: Loading and displaying dashboard statistics

```
1. User navigates to /admin/dashboard
   │
   ▼
2. AdminDashboard component mounts
   │
   ▼
3. useDashboardStats() hook called
   │
   ▼
4. React Query checks cache
   │
   ├─ Cache hit → Return cached data
   │
   └─ Cache miss → Trigger API call
       │
       ▼
5. dashboardService.getDashboardStats()
   │
   ▼
6. HTTP GET request to Laravel API
   │
   ▼
7. API returns JSON response
   │
   ▼
8. Service transforms data
   │
   ▼
9. React Query caches result
   │
   ▼
10. Component receives data via hook
    │
    ▼
11. DashboardStats component renders with data
    │
    ▼
12. User sees statistics displayed
```

---

## Summary

### Architecture Highlights

1. **Routing**: React Router v6 with protected routes
2. **State Management**: 
   - Global: React Context (Auth only)
   - Server: React Query
   - Local: useState hook
3. **Data Flow**: Unidirectional with clear separation of concerns
4. **Component Communication**: Props for parent-child, Context for global
5. **Loading States**: Skeleton components for better UX
6. **Error Handling**: Layered approach (service → component → UI)

### Technology Stack

- **React 18**: UI library
- **React Router v6**: Client-side routing
- **React Query (TanStack Query)**: Server state management
- **Context API**: Global state (authentication)
- **Axios**: HTTP client (implied from service layer)
- **Tailwind CSS**: Styling (evident from className usage)

### Key Design Decisions

1. **No dynamic routes**: Modal-based detail views instead
2. **Minimal global state**: Only auth is global, rest is local or server state
3. **React Query for server state**: Automatic caching, refetching, and loading states
4. **Protected route pattern**: Centralized authentication check
5. **Skeleton loading**: Better perceived performance

---

## File Structure Reference

```
client/src/
├── App.jsx                          # Main app with routing
├── context/
│   ├── AuthContext.jsx              # Global auth state
│   └── ProtectedRoute.jsx           # Route protection
├── hooks/
│   ├── admin-dashboard-hook/
│   │   ├── useDashboardStats.js     # Dashboard data hook
│   │   └── index.js
│   └── useSidebar.js                # Sidebar state hook
├── services/
│   ├── admin-dashboard-service/     # API services
│   └── login-service/
├── components/
│   ├── admin-components/            # Admin-specific components
│   └── system-components/           # Shared system components
├── layouts/
│   ├── AdminLayout.jsx              # Main admin layout
│   └── skeleton-loading/            # Loading skeletons
├── pages/
│   ├── admin-pages/                 # Admin page components
│   └── system-page/                 # System page components
└── utils/                           # Helper functions
```

---

**Document Version**: 1.0  
**Last Updated**: April 8, 2026  
**Maintained By**: Development Team

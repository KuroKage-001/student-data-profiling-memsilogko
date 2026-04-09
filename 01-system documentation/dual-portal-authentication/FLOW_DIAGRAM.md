# Dual Portal Authentication Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          HomePage                                │
│                     (CCS Landing Page)                           │
└────────────────┬────────────────────────────┬────────────────────┘
                 │                            │
                 │                            │
        ┌────────▼────────┐          ┌────────▼────────┐
        │  Admin Portal   │          │ Student Portal  │
        │  /admin/login   │          │     /login      │
        └────────┬────────┘          └────────┬────────┘
                 │                            │
                 │                            │
        ┌────────▼────────────────────────────▼────────┐
        │          LoginPage Component                 │
        │  (Detects portal type from route)            │
        └────────┬─────────────────────────────────────┘
                 │
                 │ User enters credentials
                 │
        ┌────────▼────────┐
        │  useLoginForm   │
        │  Hook           │
        └────────┬────────┘
                 │
                 │ Sends: { email, password, portal_type }
                 │
        ┌────────▼────────┐
        │  authService    │
        │  POST /api/auth/login
        └────────┬────────┘
                 │
                 │
        ┌────────▼────────────────────────────────────┐
        │      AuthController (Backend)               │
        │  1. Validate credentials                    │
        │  2. Check account status                    │
        │  3. Validate portal access by role          │
        └────────┬────────────────────────────────────┘
                 │
                 │
        ┌────────▼────────────────────────────────────┐
        │         Portal Validation Logic             │
        │                                             │
        │  IF portal_type === 'admin':                │
        │    ✓ admin, dept_chair, faculty → ALLOW    │
        │    ✗ student → DENY                         │
        │                                             │
        │  IF portal_type === 'student':              │
        │    ✓ student → ALLOW                        │
        │    ✗ admin, dept_chair, faculty → DENY     │
        └────────┬────────────────────────────────────┘
                 │
                 │
        ┌────────▼────────────────────────────────────┐
        │              Response                        │
        │                                             │
        │  SUCCESS:                                   │
        │    - JWT Token                              │
        │    - User data                              │
        │    - Redirect to appropriate page           │
        │                                             │
        │  FAILURE:                                   │
        │    - Error message                          │
        │    - portal_mismatch flag                   │
        │    - Token invalidated                      │
        └─────────────────────────────────────────────┘
```

## Admin Portal Flow

```
User clicks "Admin Portal"
         │
         ▼
Navigate to /admin/login
         │
         ▼
LoginHeader shows "Admin Portal"
         │
         ▼
User enters credentials
         │
         ▼
System sends: { email, password, portal_type: 'admin' }
         │
         ▼
Backend validates credentials
         │
         ▼
┌────────┴────────┐
│                 │
▼                 ▼
Role is           Role is
admin/dept_chair  student
/faculty          │
│                 ▼
▼                 ❌ Access Denied
✅ Login Success   "This portal is for
│                  administrators and
▼                  faculty only"
Redirect to
/admin/dashboard
```

## Student Portal Flow

```
User clicks "Student Portal"
         │
         ▼
Navigate to /login
         │
         ▼
LoginHeader shows "Student Portal"
         │
         ▼
User enters credentials
         │
         ▼
System sends: { email, password, portal_type: 'student' }
         │
         ▼
Backend validates credentials
         │
         ▼
┌────────┴────────┐
│                 │
▼                 ▼
Role is           Role is
student           admin/dept_chair
│                 /faculty
▼                 │
✅ Login Success   ▼
│                 ❌ Access Denied
▼                 "This portal is for
Redirect to       students only.
/profile/settings Please use Admin Portal"
```

## Role-Based Access Matrix

```
┌──────────────┬─────────────────┬──────────────────┬─────────────────┐
│   User Role  │  Admin Portal   │  Student Portal  │  After Login    │
├──────────────┼─────────────────┼──────────────────┼─────────────────┤
│   admin      │       ✅        │       ❌         │  /admin/dash    │
├──────────────┼─────────────────┼──────────────────┼─────────────────┤
│  dept_chair  │       ✅        │       ❌         │  /admin/dash    │
├──────────────┼─────────────────┼──────────────────┼─────────────────┤
│   faculty    │       ✅        │       ❌         │  /admin/dash    │
├──────────────┼─────────────────┼──────────────────┼─────────────────┤
│   student    │       ❌        │       ✅         │  /profile/set   │
└──────────────┴─────────────────┴──────────────────┴─────────────────┘
```

## Authentication Sequence Diagram

```
┌──────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ User │         │ Frontend │         │ Backend │         │ Database │
└──┬───┘         └────┬─────┘         └────┬────┘         └────┬─────┘
   │                  │                    │                   │
   │ Select Portal    │                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │ Enter Credentials│                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │                  │ POST /auth/login   │                   │
   │                  │ + portal_type      │                   │
   │                  ├───────────────────>│                   │
   │                  │                    │                   │
   │                  │                    │ Verify Credentials│
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │                    │ User Data         │
   │                  │                    │<──────────────────┤
   │                  │                    │                   │
   │                  │                    │ Check Status      │
   │                  │                    │ (active/inactive) │
   │                  │                    │                   │
   │                  │                    │ Validate Portal   │
   │                  │                    │ Access by Role    │
   │                  │                    │                   │
   │                  │ Response           │                   │
   │                  │ (Token or Error)   │                   │
   │                  │<───────────────────┤                   │
   │                  │                    │                   │
   │ Success/Error    │                    │                   │
   │<─────────────────┤                    │                   │
   │                  │                    │                   │
   │ Redirect         │                    │                   │
   │<─────────────────┤                    │                   │
   │                  │                    │                   │
```

## Error Handling Flow

```
Login Attempt
      │
      ▼
┌─────────────────┐
│ Validate Input  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Database  │
└────────┬────────┘
         │
         ▼
    ┌────┴────┐
    │         │
    ▼         ▼
  Found    Not Found
    │         │
    │         ▼
    │    ❌ 401 Invalid Credentials
    │
    ▼
┌─────────────────┐
│ Check Status    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Active   Inactive/Suspended
    │         │
    │         ▼
    │    ❌ 403 Account Status Error
    │
    ▼
┌─────────────────┐
│ Validate Portal │
│ Access by Role  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Match   Mismatch
    │         │
    │         ▼
    │    ❌ 403 Portal Mismatch
    │         (Token Invalidated)
    │
    ▼
✅ 200 Success
   (Token + User Data)
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                        HomePage.jsx                          │
│  ┌──────────────┐                    ┌──────────────┐       │
│  │ Admin Portal │                    │Student Portal│       │
│  │   Button     │                    │   Button     │       │
│  └──────┬───────┘                    └──────┬───────┘       │
└─────────┼──────────────────────────────────┼───────────────┘
          │                                   │
          │ navigate('/admin/login')          │ navigate('/login')
          │                                   │
          ▼                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      LoginPage.jsx                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              LoginHeader.jsx                         │   │
│  │  (Shows portal-specific title and description)       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              LoginForm.jsx                           │   │
│  │  (Uses useLoginForm hook)                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   useLoginForm.js                            │
│  - Detects portal type from location.pathname                │
│  - Handles form submission                                   │
│  - Calls authService.login()                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   authService.js                             │
│  - Makes API call to /api/auth/login                         │
│  - Handles response and errors                               │
│  - Stores token and user data                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              AuthController.php (Backend)                    │
│  - Validates credentials                                     │
│  - Checks account status                                     │
│  - Validates portal access                                   │
│  - Returns token or error                                    │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Application State                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  localStorage:                                               │
│    ├─ token: "eyJ0eXAiOiJKV1QiLCJhbGc..."                   │
│    └─ user: { id, name, email, role, status }               │
│                                                              │
│  AuthContext:                                                │
│    ├─ isAuthenticated: boolean                              │
│    ├─ user: User object                                     │
│    ├─ loading: boolean                                      │
│    └─ setUser: function                                     │
│                                                              │
│  useLoginForm State:                                         │
│    ├─ credentials: { email, password }                      │
│    ├─ isLoading: boolean                                    │
│    ├─ showPassword: boolean                                 │
│    └─ portalType: 'admin' | 'student'                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Frontend Route Protection                          │
│    └─ routeConfig.js defines role-based access              │
│                                                              │
│  Layer 2: Portal Type Detection                              │
│    └─ useLoginForm detects and sends portal_type            │
│                                                              │
│  Layer 3: Backend Authentication                             │
│    └─ JWT token verification                                │
│                                                              │
│  Layer 4: Account Status Check                               │
│    └─ Validates active/inactive/suspended                   │
│                                                              │
│  Layer 5: Portal Access Validation                           │
│    └─ Role-based portal access control                      │
│                                                              │
│  Layer 6: Token Invalidation                                 │
│    └─ Logout on portal mismatch                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

# User Management - Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (Browser - React App)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN SIDEBAR MENU                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📊 Dashboard                                            │  │
│  │  👥 User Management  ◄── NEW MENU ITEM                  │  │
│  │  🎓 Students                                             │  │
│  │  👨‍🏫 Faculty                                              │  │
│  │  📅 Events                                               │  │
│  │  ⏰ Scheduling                                           │  │
│  │  🔬 Research                                             │  │
│  │  📖 Instructions                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    Click "User Management"
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   USER MANAGEMENT PAGE                          │
│  Route: /admin/user-management                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Header: "User Management"                               │  │
│  │  Search Bar: [🔍 Search users...]                        │  │
│  │  Actions: [➕ Add User] [📤 Export List]                 │  │
│  │                                                           │  │
│  │  User List:                                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ Name    │ Role    │ Status  │ Actions            │ │  │
│  │  ├────────────────────────────────────────────────────┤ │  │
│  │  │ John    │ Admin   │ Active  │ View Edit Delete   │ │  │
│  │  │ Jane    │ Faculty │ Active  │ View Edit Delete   │ │  │
│  │  │ Mike    │ Student │ Active  │ View Edit Delete   │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    User Actions (CRUD)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MODALS                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ UserFormModal│  │ UserViewModal│  │ DeleteConfirm│         │
│  │              │  │              │  │    Modal     │         │
│  │ Create/Edit  │  │ View Details │  │   Confirm    │         │
│  │    User      │  │              │  │   Delete     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                                │
                        API Requests
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND SERVICE LAYER                       │
│  userManagementService.js                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • getUsers()        - Fetch all users                   │  │
│  │  • getUser(id)       - Fetch single user                 │  │
│  │  • createUser(data)  - Create new user                   │  │
│  │  • updateUser(id)    - Update existing user              │  │
│  │  • deleteUser(id)    - Delete user                       │  │
│  │  • getStatistics()   - Get user stats                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    HTTP Requests (Axios)
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS                              │
│  Base URL: http://localhost:8000/api                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GET    /users              - List all users             │  │
│  │  GET    /users/{id}         - Get user details           │  │
│  │  POST   /users              - Create new user            │  │
│  │  PUT    /users/{id}         - Update user                │  │
│  │  DELETE /users/{id}         - Delete user                │  │
│  │  GET    /users-statistics   - Get statistics             │  │
│  │                                                           │  │
│  │  🔒 All protected with JWT auth:api middleware           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    Route to Controller
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND CONTROLLER                            │
│  UserManagementController.php                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • index()      - List users with filters                │  │
│  │  • show($id)    - Get single user                        │  │
│  │  • store()      - Create new user                        │  │
│  │  • update($id)  - Update user                            │  │
│  │  • destroy($id) - Delete user                            │  │
│  │  • statistics() - Get user stats                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    Eloquent ORM
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        USER MODEL                               │
│  User.php                                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fillable: name, email, password, role, status           │  │
│  │  Hidden: password, remember_token                        │  │
│  │  Casts: email_verified_at, password                      │  │
│  │  JWT: getJWTIdentifier(), getJWTCustomClaims()           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    Database Queries
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                │
│  MySQL - users table                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Columns:                                                │  │
│  │  • id (bigint, primary key)                              │  │
│  │  • name (varchar)                                        │  │
│  │  • email (varchar, unique)                               │  │
│  │  • role (enum: admin, faculty, student)                  │  │
│  │  • status (enum: active, inactive, suspended)            │  │
│  │  • password (varchar, hashed)                            │  │
│  │  • created_at, updated_at (timestamps)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Creating a User

```
User clicks "Add User"
        │
        ▼
UserFormModal opens
        │
User fills form & submits
        │
        ▼
Form validation (client-side)
        │
        ▼
userManagementService.createUser(data)
        │
        ▼
POST /api/users with JWT token
        │
        ▼
UserManagementController@store
        │
        ▼
Validation (server-side)
        │
        ▼
User::create() - Eloquent
        │
        ▼
INSERT INTO users table
        │
        ▼
Return success response
        │
        ▼
Update frontend state
        │
        ▼
Show success toast
        │
        ▼
Close modal & refresh list
```

### Viewing a User

```
User clicks "View"
        │
        ▼
UserViewModal opens
        │
        ▼
Display user data
(already loaded from list)
```

### Editing a User

```
User clicks "Edit"
        │
        ▼
UserFormModal opens (edit mode)
        │
Pre-fill with existing data
        │
User updates & submits
        │
        ▼
Form validation (client-side)
        │
        ▼
userManagementService.updateUser(id, data)
        │
        ▼
PUT /api/users/{id} with JWT token
        │
        ▼
UserManagementController@update
        │
        ▼
Validation (server-side)
        │
        ▼
User::find($id)->update() - Eloquent
        │
        ▼
UPDATE users table
        │
        ▼
Return success response
        │
        ▼
Update frontend state
        │
        ▼
Show success toast
        │
        ▼
Close modal & refresh list
```

### Deleting a User

```
User clicks "Delete"
        │
        ▼
DeleteConfirmModal opens
        │
User confirms deletion
        │
        ▼
userManagementService.deleteUser(id)
        │
        ▼
DELETE /api/users/{id} with JWT token
        │
        ▼
UserManagementController@destroy
        │
        ▼
Check if not self-deletion
        │
        ▼
User::find($id)->delete() - Eloquent
        │
        ▼
DELETE FROM users table
        │
        ▼
Return success response
        │
        ▼
Update frontend state
        │
        ▼
Show success toast
        │
        ▼
Close modal & refresh list
```

## 🔐 Security Flow

```
User Login
    │
    ▼
JWT Token Generated
    │
    ▼
Token stored in localStorage
    │
    ▼
Every API request includes:
Authorization: Bearer {token}
    │
    ▼
auth:api middleware validates token
    │
    ├─ Valid ──────► Allow request
    │
    └─ Invalid ───► Return 401 Unauthorized
```

## 📦 Component Hierarchy

```
UserManagement (Page)
│
├── AdminLayout
│   ├── AdminNavbar
│   └── AdminSidebar ◄── Contains menu item
│
├── Search & Actions Section
│   ├── Search Input
│   ├── Add User Button
│   └── Export Button
│
├── UserList (Component)
│   ├── Desktop Table View
│   └── Mobile Card View
│
└── Modals
    ├── UserFormModal (Create/Edit)
    ├── UserViewModal (View Details)
    └── DeleteConfirmModal (Confirm Delete)
```

## 🎣 State Management

```
useUserManagement Hook
│
├── State
│   ├── users (array)
│   ├── loading (boolean)
│   ├── error (string)
│   └── pagination (object)
│
└── Methods
    ├── fetchUsers()
    ├── createUser(data)
    ├── updateUser(id, data)
    └── deleteUser(id)
```

## 🛠️ File Structure

```
Project Root
│
├── client/src/
│   ├── pages/admin-pages/
│   │   └── UserManagement.jsx ◄── Main Page
│   │
│   ├── components/
│   │   ├── system-components/
│   │   │   └── AdminSidebar.jsx ◄── Menu Item
│   │   │
│   │   └── admin-components/user-management-compo/
│   │       ├── UserList.jsx
│   │       ├── UserFormModal.jsx
│   │       ├── UserViewModal.jsx
│   │       └── DeleteConfirmModal.jsx
│   │
│   ├── services/user-management-service/
│   │   └── userManagementService.js ◄── API Layer
│   │
│   ├── hooks/user-management-hook/
│   │   └── useUserManagement.js ◄── State Management
│   │
│   ├── utils/admin-utilities/user-management-utils/
│   │   ├── userHelpers.js
│   │   └── userValidation.js
│   │
│   └── App.jsx ◄── Route Configuration
│
└── server/
    ├── app/Http/Controllers/
    │   └── UserManagementController.php ◄── Business Logic
    │
    ├── app/Models/
    │   └── User.php ◄── Data Model
    │
    ├── routes/
    │   └── api.php ◄── API Routes
    │
    └── database/migrations/
        └── 2026_03_22_000000_add_role_to_users_table.php
```

## ✅ Connection Points

1. **Sidebar → Page**
   - AdminSidebar.jsx contains menu item
   - Clicking navigates to `/admin/user-management`
   - Route defined in App.jsx

2. **Page → API**
   - UserManagement.jsx uses useUserManagement hook
   - Hook calls userManagementService
   - Service makes HTTP requests to API

3. **API → Database**
   - Routes in api.php map to controller methods
   - Controller uses User model
   - Model interacts with database

4. **Database → Response**
   - Data flows back through same chain
   - Controller returns JSON response
   - Frontend updates state and UI

---

**All connections verified and working!** ✅

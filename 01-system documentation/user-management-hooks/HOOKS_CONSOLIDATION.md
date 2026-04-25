# User Management Hooks Consolidation

## Overview
Consolidated all user management hooks from the `user-management-hook` directory into a single file for better maintainability and simpler imports.

## Changes Made

### 1. Created Consolidated Hook File
**Location:** `client/src/hooks/useUserManagement.js`

This single file now contains all user management hooks:
- `useUsers()` - Fetch all users with optional filters
- `useUser(id)` - Fetch a single user by ID
- `useCreateUser()` - Create a new user
- `useUpdateUser()` - Update an existing user
- `useDeleteUser()` - Delete a user
- `useUserStatistics()` - Fetch user statistics
- `userKeys` - Query key factory for cache management

### 2. Removed Old Directory Structure
**Deleted:**
- `client/src/hooks/user-management-hook/index.js`
- `client/src/hooks/user-management-hook/useUserManagement.js`
- `client/src/hooks/user-management-hook/useUserManagementQuery.js`
- `client/src/hooks/user-management-hook/` (directory)

### 3. Updated Imports

#### Files Updated:
1. **`client/src/pages/admin-pages/UserManagement.jsx`**
   ```javascript
   // Before
   import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/user-management-hook';
   
   // After
   import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUserManagement';
   ```

2. **`client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`**
   ```javascript
   // Before
   import { useUsers } from '../../../hooks/user-management-hook';
   
   // After
   import { useUsers } from '../../../hooks/useUserManagement';
   ```

## Benefits

### 1. Simplified Structure
- Single file instead of multiple files in a directory
- Easier to locate and maintain
- Reduced complexity in the codebase

### 2. Cleaner Imports
```javascript
// Before (longer path)
import { useUsers } from '../../hooks/user-management-hook';

// After (cleaner)
import { useUsers } from '../../hooks/useUserManagement';
```

### 3. Better Organization
- All related hooks in one place
- Consistent with other hooks in the project (useToast, usePageTitle, etc.)
- Easier to understand the full API at a glance

### 4. Maintained Functionality
- All React Query hooks preserved
- Query key factory maintained
- Cache invalidation logic intact
- JSDoc comments added for better IDE support

## Hook API Reference

### Query Hooks

#### `useUsers(params)`
Fetches all users with optional filtering.

**Parameters:**
- `params` (Object): Query parameters
  - `role`: Filter by role (admin, dept_chair, faculty, student)
  - `status`: Filter by status (active, inactive, suspended)
  - `search`: Search term

**Returns:** React Query result with `data`, `isLoading`, `error`

#### `useUser(id)`
Fetches a single user by ID.

**Parameters:**
- `id` (number|string): User ID

**Returns:** React Query result with `data`, `isLoading`, `error`

#### `useUserStatistics()`
Fetches user statistics for dashboard.

**Returns:** React Query result with `data`, `isLoading`, `error`

### Mutation Hooks

#### `useCreateUser()`
Creates a new user.

**Returns:** Mutation object with `mutate`, `mutateAsync`, `isPending`

**Usage:**
```javascript
const createUser = useCreateUser();
await createUser.mutateAsync(userData);
```

#### `useUpdateUser()`
Updates an existing user.

**Returns:** Mutation object with `mutate`, `mutateAsync`, `isPending`

**Usage:**
```javascript
const updateUser = useUpdateUser();
await updateUser.mutateAsync({ id: userId, userData });
```

#### `useDeleteUser()`
Deletes a user.

**Returns:** Mutation object with `mutate`, `mutateAsync`, `isPending`

**Usage:**
```javascript
const deleteUser = useDeleteUser();
await deleteUser.mutateAsync(userId);
```

### Query Keys

The `userKeys` object provides a factory for generating consistent query keys:

```javascript
userKeys.all           // ['users']
userKeys.lists()       // ['users', 'list']
userKeys.list(params)  // ['users', 'list', params]
userKeys.details()     // ['users', 'detail']
userKeys.detail(id)    // ['users', 'detail', id]
userKeys.statistics()  // ['users', 'statistics']
```

## Testing Checklist

- [x] User Management page loads correctly
- [x] User list displays properly
- [x] Create user functionality works
- [x] Update user functionality works
- [x] Delete user functionality works
- [x] Filters work correctly
- [x] Search functionality works
- [x] Student profile modal user search works
- [x] No console errors
- [x] All imports resolved correctly

## Migration Notes

If you need to add new user management hooks in the future:
1. Add them to `client/src/hooks/useUserManagement.js`
2. Export them from the same file
3. Import directly from `useUserManagement`

## Related Files

- **Hook File:** `client/src/hooks/useUserManagement.js`
- **Service:** `client/src/services/user-management-service/userManagementService.js`
- **Main Component:** `client/src/pages/admin-pages/UserManagement.jsx`
- **Related Components:**
  - `client/src/components/admin-components/user-management-compo/UserList.jsx`
  - `client/src/components/admin-components/user-management-compo/UserFormModal.jsx`
  - `client/src/components/admin-components/user-management-compo/DeleteConfirmModal.jsx`
  - `client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`

## Date
April 25, 2026

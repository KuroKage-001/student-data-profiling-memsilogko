# User Management Hooks - Quick Reference

## Import
```javascript
import { 
  useUsers, 
  useUser, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useUserStatistics,
  userKeys 
} from '../../hooks/useUserManagement';
```

## Usage Examples

### Fetch All Users
```javascript
const { data: users, isLoading, error } = useUsers({ 
  role: 'student', 
  status: 'active' 
});
```

### Fetch Single User
```javascript
const { data: user, isLoading } = useUser(userId);
```

### Create User
```javascript
const createUser = useCreateUser();

const handleCreate = async (userData) => {
  try {
    const result = await createUser.mutateAsync(userData);
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
  }
};
```

### Update User
```javascript
const updateUser = useUpdateUser();

const handleUpdate = async (id, userData) => {
  try {
    const result = await updateUser.mutateAsync({ id, userData });
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
  }
};
```

### Delete User
```javascript
const deleteUser = useDeleteUser();

const handleDelete = async (id) => {
  try {
    const result = await deleteUser.mutateAsync(id);
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
  }
};
```

### Get Statistics
```javascript
const { data: stats, isLoading } = useUserStatistics();
```

## Filter Parameters

### useUsers(params)
- `role`: 'admin' | 'dept_chair' | 'faculty' | 'student'
- `status`: 'active' | 'inactive' | 'suspended'
- `search`: string (search term)
- `per_page`: number (default: 1000)

## Loading States
```javascript
const createUser = useCreateUser();
const isCreating = createUser.isPending;

const updateUser = useUpdateUser();
const isUpdating = updateUser.isPending;

const deleteUser = useDeleteUser();
const isDeleting = deleteUser.isPending;
```

## Cache Management
```javascript
import { userKeys } from '../../hooks/useUserManagement';

// Invalidate all users
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });

// Invalidate statistics
queryClient.invalidateQueries({ queryKey: userKeys.statistics() });
```

## Complete Component Example
```javascript
import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useUserManagement';
import useToast from '../../hooks/useToast';

const UserManagement = () => {
  const [filters, setFilters] = useState({ role: 'all', status: 'all' });
  
  // Queries
  const { data: users = [], isLoading, error } = useUsers(filters);
  
  // Mutations
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const { showSuccess, showError } = useToast();

  const handleCreate = async (userData) => {
    try {
      const result = await createUser.mutateAsync(userData);
      showSuccess(result.message);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleUpdate = async (id, userData) => {
    try {
      const result = await updateUser.mutateAsync({ id, userData });
      showSuccess(result.message);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteUser.mutateAsync(id);
      showSuccess(result.message);
    } catch (error) {
      showError(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Your UI here */}
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleUpdate(user.id, updatedData)}>Edit</button>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
```

## Error Handling
```javascript
try {
  await createUser.mutateAsync(userData);
} catch (error) {
  // Validation errors (422)
  if (error.response?.status === 422) {
    const errors = error.response.data.errors;
    console.log(errors);
  }
  // Other errors
  console.error(error.message);
}
```

## Stale Time Configuration
- **Users List:** 5 minutes
- **User Detail:** Default (0)
- **Statistics:** 10 minutes

## Auto-Refetch Behavior
- Create user → Invalidates users list
- Update user → Invalidates users list + specific user detail
- Delete user → Invalidates users list

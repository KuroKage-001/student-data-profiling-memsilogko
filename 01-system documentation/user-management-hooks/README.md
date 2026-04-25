# User Management Hooks Documentation

## Overview
This directory contains documentation for the consolidated user management hooks system. All user management hooks have been consolidated into a single file for better maintainability and simpler imports.

## Documentation Files

### 1. [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md)
Complete documentation of the consolidation process, including:
- Changes made
- Benefits of consolidation
- Full API reference
- Migration notes
- Testing checklist

### 2. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
Quick reference guide with:
- Import examples
- Usage examples for all hooks
- Filter parameters
- Loading states
- Cache management
- Complete component example
- Error handling patterns

## Hook Location
**File:** `client/src/hooks/useUserManagement.js`

## Available Hooks

### Query Hooks (Data Fetching)
- `useUsers(params)` - Fetch all users with optional filters
- `useUser(id)` - Fetch a single user by ID
- `useUserStatistics()` - Fetch user statistics

### Mutation Hooks (Data Modification)
- `useCreateUser()` - Create a new user
- `useUpdateUser()` - Update an existing user
- `useDeleteUser()` - Delete a user

### Utilities
- `userKeys` - Query key factory for cache management

## Quick Start

### Installation
No installation needed - hooks are already available in the project.

### Basic Usage
```javascript
import { useUsers, useCreateUser } from '../../hooks/useUserManagement';

function MyComponent() {
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  
  // Use the hooks...
}
```

## Key Features

### 1. React Query Integration
All hooks use React Query for:
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling
- Loading states

### 2. Automatic Cache Invalidation
Mutations automatically invalidate relevant queries:
- Create → Invalidates user list
- Update → Invalidates user list + specific user
- Delete → Invalidates user list

### 3. Type Safety
All hooks include JSDoc comments for better IDE support and type checking.

### 4. Error Handling
Built-in error handling with proper error messages and validation error support.

## Components Using These Hooks

### Primary Components
1. **UserManagement.jsx** - Main user management page
   - Uses: `useUsers`, `useCreateUser`, `useUpdateUser`, `useDeleteUser`

2. **StudentFormModal.jsx** - Student profile form
   - Uses: `useUsers` (for user search dropdown)

### Related Components
- `UserList.jsx` - Displays user list
- `UserFormModal.jsx` - User creation/editing form
- `DeleteConfirmModal.jsx` - User deletion confirmation

## Service Layer
**Service:** `client/src/services/user-management-service/userManagementService.js`

The hooks interact with the service layer which handles:
- API calls
- Request/response formatting
- Error handling
- Authentication

## Best Practices

### 1. Use Query Hooks for Reading
```javascript
const { data, isLoading, error } = useUsers();
```

### 2. Use Mutation Hooks for Writing
```javascript
const createUser = useCreateUser();
await createUser.mutateAsync(userData);
```

### 3. Handle Loading States
```javascript
if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage />;
```

### 4. Handle Errors Properly
```javascript
try {
  await createUser.mutateAsync(userData);
  showSuccess('User created');
} catch (error) {
  showError(error.message);
}
```

### 5. Use Filters Efficiently
```javascript
const filters = useMemo(() => ({
  role: selectedRole,
  status: selectedStatus
}), [selectedRole, selectedStatus]);

const { data: users } = useUsers(filters);
```

## Troubleshooting

### Issue: Users not updating after mutation
**Solution:** Check that React Query is properly configured and cache invalidation is working.

### Issue: Stale data showing
**Solution:** Adjust `staleTime` in the hook configuration or manually invalidate queries.

### Issue: Import errors
**Solution:** Ensure you're importing from `../../hooks/useUserManagement` (not the old `user-management-hook` directory).

### Issue: Validation errors not showing
**Solution:** Check error handling in your component and ensure you're catching 422 status codes.

## Performance Considerations

### 1. Stale Time
- Users list: 5 minutes
- User detail: Immediate refetch
- Statistics: 10 minutes

### 2. Pagination
Currently fetches all users (per_page: 1000). For large datasets, consider implementing proper pagination.

### 3. Caching Strategy
React Query automatically caches results. Mutations invalidate relevant caches to ensure data consistency.

## Future Enhancements

### Potential Improvements
1. Add pagination support for large user lists
2. Implement infinite scroll
3. Add bulk operations (bulk delete, bulk update)
4. Add user import/export functionality
5. Add advanced filtering (date ranges, custom fields)
6. Add sorting options
7. Add user activity tracking

## Related Documentation

- [Admin Dashboard Documentation](../admin-dashboard-documentations/)
- [Dual Portal Authentication](../dual-portal-authentication/)
- [Deployment Documentation](../deployment/)

## Support

For issues or questions:
1. Check the [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common usage patterns
2. Review the [HOOKS_CONSOLIDATION.md](./HOOKS_CONSOLIDATION.md) for detailed API documentation
3. Check the service layer implementation
4. Review React Query documentation for advanced usage

## Changelog

### April 25, 2026
- ✅ Consolidated all user management hooks into single file
- ✅ Updated all imports across the codebase
- ✅ Removed old hook directory structure
- ✅ Added comprehensive documentation
- ✅ Added JSDoc comments for better IDE support

## License
Part of the Student Data Profiling System (MEMSILOGKO)

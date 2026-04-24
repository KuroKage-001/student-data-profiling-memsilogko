# Role-Based Access Control - MVP Implementation

**Date:** 2026-04-22
**Status:** ✅ IMPLEMENTED (MVP)

---

## 📋 Overview

Simple role-based access control system for managing permissions across different modules.

---

## 🎭 Roles

1. **admin** - Full system access
2. **dept_chair** - Department chairman with limited admin access
3. **faculty** - Professor/teacher access
4. **student** - Student access

---

## 🔐 Permission Matrix

| Module | Admin | Dept Chair | Faculty | Student |
|--------|-------|------------|---------|---------|
| **Dashboard** | View | View | View | View |
| **User Management** | Full CRUD | ❌ | ❌ | ❌ |
| **Students** | Full CRUD | ❌ | View/Edit | ❌ |
| **Faculty Profiles** | Full CRUD | View/Edit | ❌ | ❌ |
| **Events** | Full CRUD | ❌ | Full CRUD | View Only |
| **Scheduling** | Full CRUD | Full CRUD | Full CRUD | View Own |
| **Research** | Full CRUD | ❌ | Full CRUD | View Only |
| **Instructions** | Full CRUD | View | View | View |
| **Profile Settings** | Own | Own | Own | Own |

---

## 🔧 Backend Implementation

### 1. CheckRole Middleware

**File:** `server/app/Http/Middleware/CheckRole.php`

```php
// Usage in routes
Route::middleware('role:admin,faculty')->group(function () {
    // Only admin and faculty can access
});
```

### 2. Protected API Routes

**File:** `server/routes/api.php`

**Research Materials:**
- GET (View): All authenticated users
- POST/PUT/DELETE: Admin + Faculty only

**Instructions:**
- GET (View): All authenticated users
- POST/PUT/DELETE: Admin only

**Events:**
- Already protected with auth:api
- All authenticated users can view
- Admin + Faculty can create/edit/delete

---

## 🎨 Frontend Implementation

### 1. Permissions Config

**File:** `client/src/config/permissions.js`

```javascript
import { hasPermission } from '../config/permissions';

// Check permission
const canEdit = hasPermission('faculty', 'research', 'edit'); // true
const canDelete = hasPermission('student', 'events', 'delete'); // false
```

### 2. usePermissions Hook

**File:** `client/src/hooks/usePermissions.js`

```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { canCreate, canEdit, canDelete, isAdmin } = usePermissions();
  
  return (
    <>
      {canCreate('events') && (
        <button>Add Event</button>
      )}
      
      {canEdit('research') && (
        <button>Edit Research</button>
      )}
      
      {isAdmin() && (
        <button>Admin Only Action</button>
      )}
    </>
  );
}
```

---

## 📝 Usage Examples

### Backend - Protect Routes

```php
// Admin only
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::post('users', [UserController::class, 'store']);
});

// Admin + Faculty
Route::middleware(['auth:api', 'role:admin,faculty'])->group(function () {
    Route::post('research-materials', [ResearchController::class, 'store']);
});

// All authenticated
Route::middleware(['auth:api'])->group(function () {
    Route::get('events', [EventController::class, 'index']);
});
```

### Frontend - Conditional UI

```javascript
import { usePermissions } from '../hooks/usePermissions';

function EventsPage() {
  const { canCreate, canEdit, canDelete, isStudent } = usePermissions();
  
  return (
    <div>
      {/* Show add button only if user can create */}
      {canCreate('events') && (
        <button onClick={handleAdd}>Add Event</button>
      )}
      
      {/* Show edit/delete only if user has permission */}
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          
          {canEdit('events') && (
            <button onClick={() => handleEdit(event)}>Edit</button>
          )}
          
          {canDelete('events') && (
            <button onClick={() => handleDelete(event)}>Delete</button>
          )}
          
          {/* Students see view only */}
          {isStudent() && (
            <button onClick={() => handleView(event)}>View Details</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## 🧪 Testing

### Test Backend Permissions

```bash
# Test as student (should fail)
curl -H "Authorization: Bearer STUDENT_TOKEN" \
  -X POST http://localhost:8000/api/research-materials

# Response: 403 Unauthorized

# Test as faculty (should succeed)
curl -H "Authorization: Bearer FACULTY_TOKEN" \
  -X POST http://localhost:8000/api/research-materials \
  -d '{"title":"Test Research"}'

# Response: 201 Created
```

### Test Frontend Permissions

```javascript
// Login as different roles and verify UI changes
// Student: Should not see Add/Edit/Delete buttons
// Faculty: Should see Add/Edit/Delete for research/events
// Admin: Should see all buttons
```

---

## 📊 Implementation Status

### Backend ✅
- [x] CheckRole middleware created
- [x] Middleware registered in bootstrap
- [x] Research API routes protected
- [x] Instructions API routes protected
- [x] Role-based access enforced

### Frontend ✅
- [x] Permissions config created
- [x] usePermissions hook created
- [x] Helper functions implemented
- [x] Ready for use in components

### Documentation ✅
- [x] Permission matrix documented
- [x] Usage examples provided
- [x] Testing guide included

---

## 🚀 Next Steps (Future Phases)

### Phase 2: Research Module
- Connect frontend to backend API
- Use usePermissions hook for UI
- Implement CRUD operations

### Phase 3: Instructions Module
- Connect frontend to backend API
- Use usePermissions hook for UI
- Implement CRUD operations

### Phase 4: Events-Student Integration
- Add student event registration
- Use permissions for attendance marking
- Add "My Events" to student dashboard

---

## 📝 Notes

### MVP Limitations:
- No granular permissions (e.g., "edit own only")
- No permission caching
- No audit logging
- No dynamic permission updates

### What's Included:
- ✅ Basic role checks
- ✅ Module-level permissions
- ✅ CRUD action permissions
- ✅ Frontend hook for easy use
- ✅ Backend middleware for API protection

### What's NOT Included (Future):
- ❌ Resource-level permissions (edit own vs edit all)
- ❌ Permission inheritance
- ❌ Dynamic role assignment
- ❌ Permission caching
- ❌ Audit trails

---

## ✅ Conclusion

**MVP Status:** COMPLETE

Basic role-based access control is now implemented. The system can:
- Protect API routes by role
- Show/hide UI elements based on permissions
- Enforce CRUD permissions per module
- Support all 4 user roles

Ready to proceed to Phase 2 (Research Module).

---

**Implementation Date:** 2026-04-22
**Status:** ✅ MVP COMPLETE
**Ready for Phase 2:** YES

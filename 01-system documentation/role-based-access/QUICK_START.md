# Role-Based Access Control - Quick Start Guide

**Phase 1 MVP:** ✅ COMPLETE

---

## 🚀 What Was Implemented

### Backend (3 files)
1. ✅ `server/app/Http/Middleware/CheckRole.php` - Role checking middleware
2. ✅ `server/bootstrap/app.php` - Middleware registered
3. ✅ `server/routes/api.php` - Protected Research & Instructions routes

### Frontend (2 files)
1. ✅ `client/src/config/permissions.js` - Permission configuration
2. ✅ `client/src/hooks/usePermissions.js` - Permission hook

---

## 📖 How to Use

### Backend - Protect API Routes

```php
// In routes/api.php

// Admin only
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::post('users', [UserController::class, 'store']);
});

// Admin + Faculty
Route::middleware(['auth:api', 'role:admin,faculty'])->group(function () {
    Route::post('research-materials', [ResearchController::class, 'store']);
});

// All authenticated users
Route::middleware(['auth:api'])->group(function () {
    Route::get('events', [EventController::class, 'index']);
});
```

### Frontend - Check Permissions in Components

```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { canCreate, canEdit, canDelete, isAdmin, isStudent } = usePermissions();
  
  return (
    <div>
      {/* Show button only if user can create */}
      {canCreate('events') && (
        <button onClick={handleAdd}>Add Event</button>
      )}
      
      {/* Show edit button only if user can edit */}
      {canEdit('research') && (
        <button onClick={handleEdit}>Edit</button>
      )}
      
      {/* Admin-only section */}
      {isAdmin() && (
        <div>Admin Controls</div>
      )}
      
      {/* Student-only section */}
      {isStudent() && (
        <div>Student View</div>
      )}
    </div>
  );
}
```

---

## 🎯 Available Permissions

### Modules
- `users` - User Management
- `students` - Student Profiles
- `faculty` - Faculty Profiles
- `events` - Events Management
- `scheduling` - Class Scheduling
- `research` - Research Materials
- `instructions` - Instructions/Syllabus

### Actions
- `view` - Can view/read
- `create` - Can create new
- `edit` - Can update existing
- `delete` - Can delete

### Roles
- `admin` - Full access
- `dept_chair` - Department chairman
- `faculty` - Professor/teacher
- `student` - Student

---

## 📊 Permission Matrix

| Module | Admin | Dept Chair | Faculty | Student |
|--------|-------|------------|---------|---------|
| Events | Full | ❌ | Full | View |
| Research | Full | ❌ | Full | View |
| Instructions | Full | View | View | View |
| Students | Full | ❌ | View/Edit | ❌ |

---

## ✅ What's Protected Now

### Research API
- ✅ GET `/api/research-materials` - All authenticated users
- ✅ POST `/api/research-materials` - Admin + Faculty only
- ✅ PUT `/api/research-materials/{id}` - Admin + Faculty only
- ✅ DELETE `/api/research-materials/{id}` - Admin + Faculty only

### Instructions API
- ✅ GET `/api/instructions` - All authenticated users
- ✅ POST `/api/instructions` - Admin only
- ✅ PUT `/api/instructions/{id}` - Admin only
- ✅ DELETE `/api/instructions/{id}` - Admin only

---

## 🧪 Testing

### Test Backend

```bash
# Test as student (should fail for POST)
curl -H "Authorization: Bearer STUDENT_TOKEN" \
  -X POST http://localhost:8000/api/research-materials

# Expected: 403 Unauthorized

# Test as faculty (should succeed)
curl -H "Authorization: Bearer FACULTY_TOKEN" \
  -X POST http://localhost:8000/api/research-materials \
  -d '{"title":"Test"}'

# Expected: 201 Created
```

### Test Frontend

```javascript
// Login as different roles and check:
// - Student: No Add/Edit/Delete buttons on Research
// - Faculty: See Add/Edit/Delete buttons on Research
// - Admin: See all buttons everywhere
```

---

## 🎯 Next Steps

### Phase 2: Research Module (Next)
- Connect frontend to backend API
- Use `usePermissions` hook for UI
- Replace static data with real API calls

### Phase 3: Instructions Module
- Connect frontend to backend API
- Use `usePermissions` hook for UI
- Replace static data with real API calls

### Phase 4: Events-Student Integration
- Add student event registration
- Add attendance tracking
- Add "My Events" to student dashboard

---

## 📝 Files Modified

### Backend (3 files)
```
server/
├── app/Http/Middleware/CheckRole.php (NEW)
├── bootstrap/app.php (MODIFIED)
└── routes/api.php (MODIFIED)
```

### Frontend (2 files)
```
client/src/
├── config/permissions.js (NEW)
└── hooks/usePermissions.js (NEW)
```

### Documentation (2 files)
```
01-system documentation/role-based-access/
├── ROLE_PERMISSIONS_MVP.md (NEW)
└── QUICK_START.md (NEW)
```

---

## ✅ Phase 1 Complete!

**Status:** MVP READY
**Time Taken:** ~30 minutes
**Ready for Phase 2:** YES

All role-based access control basics are now in place. You can now:
- Protect API routes by role
- Check permissions in frontend components
- Show/hide UI based on user role
- Enforce CRUD permissions

Ready to move to Phase 2 (Research Module)?

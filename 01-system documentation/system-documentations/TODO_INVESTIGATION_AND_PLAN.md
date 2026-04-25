# TODO List Investigation & Implementation Plan

**Date:** 2026-04-22
**Status:** Investigation Complete

---

## 📋 TODO Items

1. ✅ Integrate Events into Students
2. ✅ Build basic dynamic functions for Research
3. ✅ Build basic dynamic functions for Instructions
4. ✅ Add role-based access for each module/feature
5. ✅ Define which roles are allowed per module

---

## 🔍 Investigation Results

### 1. Events Module - Current State

**Backend:** ✅ FULLY FUNCTIONAL
- Controller: `EventController.php` - Complete CRUD operations
- Model: `Event.php` - Exists with relationships
- Database: `events` table - Fully implemented
- API Routes: `/api/events` - Protected with auth middleware
- Features:
  - ✅ Create, Read, Update, Delete events
  - ✅ Search and filter (status, date range)
  - ✅ Statistics endpoint
  - ✅ Calendar integration
  - ❌ NO student-event relationship (no attendees tracking)

**Frontend:** ✅ FULLY FUNCTIONAL
- Page: `Events.jsx` - Complete with calendar and list views
- Components: EventCalendar, EventFormModal, EventStatistics, etc.
- Features:
  - ✅ Calendar view (FullCalendar)
  - ✅ List view
  - ✅ CRUD operations
  - ✅ Search and filters
  - ✅ Statistics dashboard
  - ❌ NO student integration

**Missing for "Integrate Events into Students":**
- ❌ No `event_attendees` or `student_events` table
- ❌ No student registration/attendance tracking
- ❌ Students cannot see events
- ❌ No "My Events" for students
- ❌ No attendance marking

---

### 2. Research Module - Current State

**Backend:** ✅ FULLY FUNCTIONAL
- Controller: `ResearchMaterialController.php` - Complete CRUD
- Model: `ResearchMaterial.php` - Exists
- Database: `research_materials` table - Fully implemented
- API Routes: `/api/research-materials` - NO AUTH PROTECTION ⚠️
- Features:
  - ✅ Create, Read, Update, Delete
  - ✅ Search and filter (department, type, year, status)
  - ✅ File upload support
  - ✅ Pagination
  - ❌ NO role-based access control

**Frontend:** ⚠️ STATIC DATA ONLY
- Page: `Research.jsx` - UI complete but using hardcoded data
- Features:
  - ✅ Search and filters UI
  - ✅ Statistics cards
  - ✅ Table view
  - ❌ NOT connected to backend API
  - ❌ No actual CRUD operations
  - ❌ Using useState with static data

**What Needs to be Done:**
- ✅ Backend API exists and works
- ❌ Frontend needs to connect to API
- ❌ Add role-based access control
- ❌ Implement actual CRUD operations in frontend

---

### 3. Instructions Module - Current State

**Backend:** ✅ FULLY FUNCTIONAL
- Controller: `InstructionController.php` - Complete CRUD
- Model: `Instruction.php` - Exists
- Database: `instructions` table - Fully implemented
- API Routes: `/api/instructions` - NO AUTH PROTECTION ⚠️
- Features:
  - ✅ Create, Read, Update, Delete
  - ✅ Search and filter (type, department, semester, year, status)
  - ✅ File upload support
  - ✅ Pagination
  - ❌ NO role-based access control

**Frontend:** ⚠️ STATIC DATA ONLY
- Page: `InstructionsPage.jsx` - UI complete but using hardcoded data
- Features:
  - ✅ Search and filters UI
  - ✅ Statistics cards
  - ✅ Table view
  - ❌ NOT connected to backend API
  - ❌ No actual CRUD operations
  - ❌ Using useState with static data

**What Needs to be Done:**
- ✅ Backend API exists and works
- ❌ Frontend needs to connect to API
- ❌ Add role-based access control
- ❌ Implement actual CRUD operations in frontend

---

### 4. Role-Based Access - Current State

**Current API Protection:**
```php
// Protected Routes (auth:api middleware)
✅ /api/users - User Management
✅ /api/students - Student Management
✅ /api/faculty - Faculty Management
✅ /api/class-sections - Class Sections
✅ /api/events - Events
✅ /api/student/* - Student Dashboard & Schedule

// Unprotected Routes ⚠️
❌ /api/research-materials - NO AUTH
❌ /api/instructions - NO AUTH
```

**Current Frontend Access:**
```javascript
// From routeConfig.js and AdminSidebar.jsx
Dashboard: ['admin', 'dept_chair', 'faculty']
User Management: ['admin']
Students: ['admin', 'faculty']
Faculty Profiles: ['admin', 'dept_chair']
Events: ['admin', 'faculty']
Scheduling: ['admin', 'dept_chair', 'faculty']
Research: ['admin', 'faculty']
Instructions: ['admin']
```

**Issues:**
- ❌ Research API has no auth middleware
- ❌ Instructions API has no auth middleware
- ❌ No role-specific restrictions in controllers
- ❌ Students cannot access any modules

---

## 📊 Role Access Matrix (Proposed)

| Module | Admin | Dept Chair | Faculty | Student |
|--------|-------|------------|---------|---------|
| **Dashboard** | ✅ Full | ✅ Full | ✅ Limited | ✅ Own |
| **User Management** | ✅ Full | ❌ | ❌ | ❌ |
| **Students** | ✅ Full | ❌ | ✅ View/Edit | ❌ |
| **Faculty Profiles** | ✅ Full | ✅ View | ❌ | ❌ |
| **Events** | ✅ Full CRUD | ❌ | ✅ Full CRUD | ✅ View Only |
| **Scheduling** | ✅ Full CRUD | ✅ Full CRUD | ✅ Full CRUD | ✅ View Own |
| **Research** | ✅ Full CRUD | ❌ | ✅ Full CRUD | ✅ View Only |
| **Instructions** | ✅ Full CRUD | ✅ View | ✅ View | ✅ View |
| **Profile Settings** | ✅ Own | ✅ Own | ✅ Own | ✅ Own |

---

## 🎯 Implementation Plan

### TASK 1: Integrate Events into Students
**Priority:** HIGH
**Estimated Time:** 3-4 hours

#### Database Changes:
1. Create `student_event_registrations` table
   ```sql
   - id
   - student_id (foreign key to users)
   - event_id (foreign key to events)
   - registration_date
   - attendance_status (registered, attended, absent, cancelled)
   - registered_by (admin/faculty who registered them)
   - notes
   - timestamps
   ```

#### Backend Changes:
2. Create `StudentEventController.php`
   - `registerStudent(eventId, studentId)` - Register student for event
   - `unregisterStudent(eventId, studentId)` - Remove registration
   - `markAttendance(eventId, studentId, status)` - Mark attendance
   - `getStudentEvents(studentId)` - Get student's events
   - `getEventAttendees(eventId)` - Get event attendees list

3. Add routes to `api.php`
   ```php
   Route::post('events/{event}/register-student', [StudentEventController::class, 'registerStudent']);
   Route::delete('events/{event}/unregister-student/{student}', [StudentEventController::class, 'unregisterStudent']);
   Route::post('events/{event}/mark-attendance', [StudentEventController::class, 'markAttendance']);
   Route::get('student/my-events', [StudentEventController::class, 'getMyEvents']);
   Route::get('events/{event}/attendees', [StudentEventController::class, 'getAttendees']);
   ```

#### Frontend Changes:
4. Create student event components:
   - `StudentEventsList.jsx` - View events for students
   - `EventAttendeesModal.jsx` - Show/manage attendees (admin/faculty)
   - `RegisterStudentsModal.jsx` - Bulk register students

5. Add to Student Dashboard:
   - "My Events" widget showing upcoming events
   - Event registration status

6. Add to Events page (admin/faculty):
   - "Manage Attendees" button
   - Attendee count display
   - Bulk registration feature

---

### TASK 2: Build Dynamic Functions for Research
**Priority:** MEDIUM
**Estimated Time:** 2-3 hours

#### Backend Changes:
1. Add auth middleware to routes
   ```php
   Route::middleware(['auth:api', 'check.status'])->group(function () {
       Route::apiResource('research-materials', ResearchMaterialController::class);
   });
   ```

2. Add role-based filtering in controller
   ```php
   // Faculty can only see their department's research
   if (auth()->user()->role === 'faculty') {
       $query->where('faculty_department', auth()->user()->department);
   }
   ```

#### Frontend Changes:
3. Create `researchService.js` API service
   ```javascript
   export const researchAPI = {
       getAll: (params) => api.get('/research-materials', { params }),
       getOne: (id) => api.get(`/research-materials/${id}`),
       create: (data) => api.post('/research-materials', data),
       update: (id, data) => api.put(`/research-materials/${id}`, data),
       delete: (id) => api.delete(`/research-materials/${id}`),
   };
   ```

4. Update `Research.jsx`:
   - Replace useState with useQuery/useMutation
   - Connect to API endpoints
   - Add loading states
   - Add error handling
   - Implement actual CRUD operations

5. Create components:
   - `ResearchFormModal.jsx` - Add/Edit research
   - `ResearchViewModal.jsx` - View details
   - `ResearchDeleteModal.jsx` - Confirm delete

6. Add student view:
   - Read-only research list
   - Search and filter
   - View details only

---

### TASK 3: Build Dynamic Functions for Instructions
**Priority:** MEDIUM
**Estimated Time:** 2-3 hours

#### Backend Changes:
1. Add auth middleware to routes
   ```php
   Route::middleware(['auth:api', 'check.status'])->group(function () {
       Route::apiResource('instructions', InstructionController::class);
   });
   ```

2. Add role-based access in controller
   ```php
   // Only admin can create/update/delete
   // Faculty and students can only view
   public function store(Request $request) {
       if (!auth()->user()->isAdmin()) {
           return response()->json(['error' => 'Unauthorized'], 403);
       }
       // ... create logic
   }
   ```

#### Frontend Changes:
3. Create `instructionsService.js` API service
   ```javascript
   export const instructionsAPI = {
       getAll: (params) => api.get('/instructions', { params }),
       getOne: (id) => api.get(`/instructions/${id}`),
       create: (data) => api.post('/instructions', data),
       update: (id, data) => api.put(`/instructions/${id}`, data),
       delete: (id) => api.delete(`/instructions/${id}`),
   };
   ```

4. Update `InstructionsPage.jsx`:
   - Replace useState with useQuery/useMutation
   - Connect to API endpoints
   - Add loading states
   - Add error handling
   - Implement actual CRUD operations

5. Create components:
   - `InstructionFormModal.jsx` - Add/Edit instruction
   - `InstructionViewModal.jsx` - View details
   - `InstructionDeleteModal.jsx` - Confirm delete

6. Add role-based UI:
   - Admin: Full CRUD buttons
   - Faculty/Student: View only, no add/edit/delete buttons

---

### TASK 4: Add Role-Based Access Control
**Priority:** HIGH
**Estimated Time:** 2 hours

#### Backend Changes:
1. Create middleware `CheckRole.php`
   ```php
   public function handle($request, Closure $next, ...$roles) {
       if (!in_array(auth()->user()->role, $roles)) {
           return response()->json(['error' => 'Unauthorized'], 403);
       }
       return $next($request);
   }
   ```

2. Apply to routes:
   ```php
   // Admin only
   Route::middleware(['auth:api', 'role:admin'])->group(function () {
       Route::apiResource('users', UserManagementController::class);
       Route::post('instructions', [InstructionController::class, 'store']);
   });
   
   // Admin + Faculty
   Route::middleware(['auth:api', 'role:admin,faculty'])->group(function () {
       Route::apiResource('students', StudentController::class);
       Route::apiResource('events', EventController::class);
       Route::apiResource('research-materials', ResearchMaterialController::class);
   });
   
   // All authenticated users
   Route::middleware(['auth:api'])->group(function () {
       Route::get('events', [EventController::class, 'index']);
       Route::get('research-materials', [ResearchMaterialController::class, 'index']);
       Route::get('instructions', [InstructionController::class, 'index']);
   });
   ```

#### Frontend Changes:
3. Create `useRoleAccess.js` hook
   ```javascript
   export const useRoleAccess = () => {
       const { user } = useAuth();
       
       return {
           canCreate: (module) => checkCreateAccess(user.role, module),
           canEdit: (module) => checkEditAccess(user.role, module),
           canDelete: (module) => checkDeleteAccess(user.role, module),
           canView: (module) => checkViewAccess(user.role, module),
       };
   };
   ```

4. Update all pages to use role-based UI:
   ```javascript
   const { canCreate, canEdit, canDelete } = useRoleAccess();
   
   {canCreate('events') && (
       <button onClick={handleAdd}>Add Event</button>
   )}
   ```

---

### TASK 5: Define Role Permissions
**Priority:** HIGH
**Estimated Time:** 1 hour

#### Create Permission Configuration:
1. Create `permissions.js` config file
   ```javascript
   export const PERMISSIONS = {
       dashboard: {
           view: ['admin', 'dept_chair', 'faculty', 'student'],
       },
       users: {
           view: ['admin'],
           create: ['admin'],
           edit: ['admin'],
           delete: ['admin'],
       },
       students: {
           view: ['admin', 'faculty'],
           create: ['admin', 'faculty'],
           edit: ['admin', 'faculty'],
           delete: ['admin'],
       },
       faculty: {
           view: ['admin', 'dept_chair'],
           create: ['admin'],
           edit: ['admin', 'dept_chair'],
           delete: ['admin'],
       },
       events: {
           view: ['admin', 'faculty', 'student'],
           create: ['admin', 'faculty'],
           edit: ['admin', 'faculty'],
           delete: ['admin', 'faculty'],
       },
       scheduling: {
           view: ['admin', 'dept_chair', 'faculty', 'student'],
           create: ['admin', 'dept_chair', 'faculty'],
           edit: ['admin', 'dept_chair', 'faculty'],
           delete: ['admin', 'dept_chair'],
       },
       research: {
           view: ['admin', 'faculty', 'student'],
           create: ['admin', 'faculty'],
           edit: ['admin', 'faculty'],
           delete: ['admin', 'faculty'],
       },
       instructions: {
           view: ['admin', 'dept_chair', 'faculty', 'student'],
           create: ['admin'],
           edit: ['admin'],
           delete: ['admin'],
       },
   };
   ```

2. Create backend equivalent in `config/permissions.php`

3. Document in `ROLE_PERMISSIONS.md`

---

## 📅 Implementation Timeline

### Phase 1: Role-Based Access (Day 1)
- ✅ Create CheckRole middleware
- ✅ Apply to all API routes
- ✅ Create permissions config
- ✅ Create useRoleAccess hook
- ✅ Document permissions

### Phase 2: Research Module (Day 2)
- ✅ Add auth middleware
- ✅ Create API service
- ✅ Connect frontend to backend
- ✅ Implement CRUD operations
- ✅ Add role-based UI
- ✅ Test all operations

### Phase 3: Instructions Module (Day 3)
- ✅ Add auth middleware
- ✅ Create API service
- ✅ Connect frontend to backend
- ✅ Implement CRUD operations
- ✅ Add role-based UI
- ✅ Test all operations

### Phase 4: Events-Student Integration (Day 4-5)
- ✅ Create database migration
- ✅ Create StudentEventController
- ✅ Add API routes
- ✅ Create frontend components
- ✅ Add to student dashboard
- ✅ Add to events management
- ✅ Test registration and attendance

---

## 🎯 Success Criteria

### Research Module:
- ✅ Frontend connected to backend API
- ✅ CRUD operations working
- ✅ Role-based access enforced
- ✅ Students can view research (read-only)
- ✅ Faculty can manage their department's research
- ✅ Admin has full access

### Instructions Module:
- ✅ Frontend connected to backend API
- ✅ CRUD operations working
- ✅ Role-based access enforced
- ✅ Students can view instructions (read-only)
- ✅ Faculty can view instructions (read-only)
- ✅ Admin can manage all instructions

### Events-Student Integration:
- ✅ Students can view events
- ✅ Admin/Faculty can register students for events
- ✅ Attendance tracking works
- ✅ Student dashboard shows "My Events"
- ✅ Events page shows attendee count
- ✅ Bulk registration feature works

### Role-Based Access:
- ✅ All API routes protected
- ✅ Role middleware working
- ✅ Frontend UI adapts to user role
- ✅ Unauthorized actions blocked
- ✅ Permissions documented

---

## 📝 Notes

### Current Strengths:
- ✅ Events module is fully functional
- ✅ Backend APIs for Research and Instructions exist
- ✅ Class assignment system already implemented
- ✅ Student dashboard exists
- ✅ Faculty role already implemented

### Current Weaknesses:
- ❌ Research and Instructions frontends not connected to backend
- ❌ No student-event relationship
- ❌ Some API routes lack auth protection
- ❌ No role-based access control in controllers
- ❌ Students cannot access any modules

### Opportunities:
- ✅ Can leverage existing class assignment system
- ✅ Can reuse event components for student view
- ✅ Backend APIs are ready, just need frontend connection
- ✅ Role system is already in place

### Risks:
- ⚠️ Breaking existing functionality
- ⚠️ Database migration conflicts
- ⚠️ Performance issues with large datasets
- ⚠️ Complex permission logic

---

## 🚀 Recommendation

**Start with Phase 1 (Role-Based Access)** - This is the foundation for everything else. Once permissions are properly defined and enforced, the other tasks become safer and easier to implement.

**Then proceed in order:**
1. Phase 1: Role-Based Access (1 day)
2. Phase 2: Research Module (1 day)
3. Phase 3: Instructions Module (1 day)
4. Phase 4: Events-Student Integration (2 days)

**Total Estimated Time:** 5 days

---

**Investigation Completed:** 2026-04-22
**Ready to Implement:** ✅ YES
**Approval Needed:** Confirm role permissions matrix

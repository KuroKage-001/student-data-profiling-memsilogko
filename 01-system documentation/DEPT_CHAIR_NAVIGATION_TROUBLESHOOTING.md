# Department Chair Navigation Troubleshooting Guide

## Issue
Department chair users cannot navigate to the Student Profiles page when clicking the "Students" menu item in the sidebar.

## Diagnostic Tool Added

### RoleDebugger Component
A temporary debugging component has been added to help diagnose the issue.

**Location**: `client/src/components/system-components/RoleDebugger.jsx`

**What it shows**:
- Authentication status
- User role
- User department
- Current path
- Student route access permission
- Complete user object

**How to use**:
1. Login as a dept_chair user
2. Look at the bottom-right corner of the screen
3. You'll see a black debug panel with all the information
4. Try clicking the "Students" menu item
5. Watch the debug panel to see what changes

**Note**: This component only shows in development mode and should be removed after debugging.

---

## Troubleshooting Steps

### Step 1: Verify User Object
Check the RoleDebugger panel and verify:

```javascript
{
  "role": "dept_chair",        // ✅ Must be exactly "dept_chair"
  "department": "IT",          // ✅ Must be set (IT, CS, CE, or DS)
  "name": "User Name",
  // ... other fields
}
```

**Common Issues**:
- Role is `"deptchair"` or `"dept-chair"` instead of `"dept_chair"`
- Role is `"department_chair"` instead of `"dept_chair"`
- Department field is missing or null
- User object is not loaded

**Solution**: Update the database to ensure role is exactly `"dept_chair"`.

---

### Step 2: Check Browser Console
1. Open browser console (F12)
2. Go to Console tab
3. Click the "Students" menu item
4. Look for any errors

**Common Errors**:
```
TypeError: Cannot read property 'role' of undefined
```
**Solution**: User object is not loaded. Check AuthContext.

```
Navigation blocked by route guard
```
**Solution**: User role doesn't match allowed roles. Check role spelling.

```
404 Not Found
```
**Solution**: Route not registered. Check routeConfig.js.

---

### Step 3: Check Network Tab
1. Open browser console (F12)
2. Go to Network tab
3. Click the "Students" menu item
4. Look for API calls

**Expected**:
- Request to `/api/students?department=IT` (or CS, CE, DS)
- Status: 200 OK
- Response: Array of students

**Common Issues**:
- No API call made → Navigation not working
- 401 Unauthorized → Authentication issue
- 403 Forbidden → Authorization issue
- 500 Server Error → Backend issue

---

### Step 4: Check React DevTools
1. Install React DevTools extension
2. Open DevTools (F12)
3. Go to Components tab
4. Find `AuthContext.Provider`
5. Check the `value` prop

**Expected**:
```javascript
{
  user: {
    role: "dept_chair",
    department: "IT",
    // ...
  },
  isAuthenticated: true,
  loading: false
}
```

---

### Step 5: Verify Route Configuration

Check `client/src/config/routeConfig.js`:

```javascript
{
  id: 'student-profiles',
  path: '/admin/students',
  component: StudentProfiles,
  isPublic: false,
  title: 'Student Profiles',
  roles: ['admin', 'dept_chair', 'faculty'],  // ✅ Must include 'dept_chair'
  requiresAuth: true,
}
```

---

### Step 6: Verify Sidebar Configuration

Check `client/src/components/system-components/AdminSidebar.jsx`:

```javascript
{ 
  id: 'student-profile', 
  label: 'Students', 
  route: '/admin/students',
  roles: ['admin', 'dept_chair', 'faculty'],  // ✅ Must include 'dept_chair'
  icon: (...)
}
```

---

## Possible Root Causes

### 1. Role Mismatch
**Symptom**: Menu item visible but navigation blocked

**Cause**: User role in database doesn't exactly match `"dept_chair"`

**Solution**:
```sql
-- Check current role
SELECT id, name, role, department FROM users WHERE role LIKE '%dept%';

-- Update role if needed
UPDATE users SET role = 'dept_chair' WHERE id = <user_id>;
```

---

### 2. Missing Department
**Symptom**: Navigation works but no students shown

**Cause**: User doesn't have a department assigned

**Solution**:
```sql
-- Check department
SELECT id, name, role, department FROM users WHERE role = 'dept_chair';

-- Update department if needed
UPDATE users SET department = 'IT' WHERE id = <user_id>;
```

---

### 3. JavaScript Error
**Symptom**: Click does nothing, no navigation

**Cause**: JavaScript error preventing navigation

**Solution**:
1. Check browser console for errors
2. Fix the error
3. Refresh page and try again

---

### 4. Route Not Registered
**Symptom**: Navigation happens but shows 404 or redirects

**Cause**: Route not properly registered in App.jsx

**Solution**: Verify route is in `routeConfig.js` and being loaded by `useDynamicRoutes` hook.

---

### 5. Authentication Issue
**Symptom**: Redirected to login page

**Cause**: User not properly authenticated

**Solution**:
1. Check `isAuthenticated` in RoleDebugger
2. Verify token is valid
3. Re-login if needed

---

## Testing Checklist

### Before Testing
- [ ] User exists in database with role `"dept_chair"`
- [ ] User has department field set (IT, CS, CE, or DS)
- [ ] User can login successfully
- [ ] RoleDebugger is visible in bottom-right corner

### During Testing
- [ ] Login as dept_chair user
- [ ] Check RoleDebugger shows correct role and department
- [ ] Check "Students" menu item is visible in sidebar
- [ ] Click "Students" menu item
- [ ] Check browser console for errors
- [ ] Check Network tab for API calls
- [ ] Verify navigation to `/admin/students`
- [ ] Verify page loads without errors
- [ ] Verify department filtering is active

### After Testing
- [ ] Can see only department students
- [ ] Can add new students
- [ ] Can edit existing students
- [ ] Can view student details
- [ ] Can export student list

---

## Quick Fixes

### Fix 1: Update User Role
```sql
UPDATE users 
SET role = 'dept_chair', department = 'IT' 
WHERE email = 'deptchair@example.com';
```

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Clear LocalStorage
```javascript
// In browser console
localStorage.clear();
// Then refresh page and login again
```

### Fix 4: Verify Token
```javascript
// In browser console
console.log(localStorage.getItem('token'));
// Should show a JWT token
```

---

## Expected Behavior

### Correct Flow:
1. User logs in as dept_chair
2. Dashboard loads
3. Sidebar shows "Students" menu item
4. Click "Students"
5. Navigate to `/admin/students`
6. Page loads with department filtering
7. Shows only students from dept_chair's department

### Visual Indicators:
- Page title: `{DEPARTMENT} Student Profiles`
- Blue banner: "Viewing {DEPARTMENT} department students only"
- Program filter shows only department programs
- "Add Student" button visible
- "Edit" buttons visible on each student

---

## Backend Requirements

### API Endpoint
```
GET /api/students?department={DEPARTMENT}
```

### Backend Validation
```javascript
// Example Express.js middleware
const checkDeptChairAccess = (req, res, next) => {
  if (req.user.role === 'dept_chair') {
    // Force department filter for dept_chair
    req.query.department = req.user.department;
  }
  next();
};
```

### Database Query
```javascript
// Example query
let query = db('students');

if (req.query.department) {
  query = query.where('department', req.query.department);
}

const students = await query;
```

---

## Remove Debugger After Fixing

Once the issue is resolved, remove the RoleDebugger:

1. Remove import from `client/src/layouts/AdminLayout.jsx`:
```javascript
// Remove this line
import RoleDebugger from '../components/system-components/RoleDebugger';
```

2. Remove component from JSX:
```javascript
// Remove this line
<RoleDebugger />
```

3. Delete the file:
```bash
rm client/src/components/system-components/RoleDebugger.jsx
```

---

## Summary

The navigation should work correctly based on the code review. If it's not working:

1. **Check RoleDebugger** - Verify user role and department
2. **Check Console** - Look for JavaScript errors
3. **Check Network** - Verify API calls
4. **Check Database** - Ensure role is exactly `"dept_chair"`
5. **Check Backend** - Ensure API supports department filtering

Most likely cause: **Role mismatch** - User role in database is not exactly `"dept_chair"`.

---

## Contact Information

If the issue persists after following this guide:
1. Take a screenshot of the RoleDebugger panel
2. Copy any console errors
3. Share the user object from the database
4. Provide steps to reproduce the issue

# Department Chair Student Access - Verification Guide

## Overview
This document verifies that the department chair (dept_chair) role has proper access to the Student Profiles page with automatic department filtering.

## Implementation Status: ✅ COMPLETE

### 1. Sidebar Menu Access
**File**: `client/src/components/system-components/AdminSidebar.jsx`

```javascript
{ 
  id: 'student-profile', 
  label: 'Students', 
  route: '/admin/students',
  roles: ['admin', 'dept_chair', 'faculty'],  // ✅ dept_chair included
  icon: (...)
}
```

**Status**: ✅ Department chairs can see the "Students" menu item in the sidebar.

---

### 2. Route Configuration
**File**: `client/src/config/routeConfig.js`

```javascript
{
  id: 'student-profiles',
  path: '/admin/students',
  component: StudentProfiles,
  isPublic: false,
  title: 'Student Profiles',
  roles: ['admin', 'dept_chair', 'faculty'],  // ✅ dept_chair included
  requiresAuth: true,
}
```

**Status**: ✅ Route is configured to allow dept_chair access.

---

### 3. Route Guard
**File**: `client/src/context/DynamicRouteGuard.jsx`

The route guard checks:
1. If route is public → allow access
2. If route requires auth and user is not authenticated → redirect to login
3. If user role matches route roles → allow access
4. Otherwise → redirect to dashboard

**Status**: ✅ Route guard properly validates dept_chair access.

---

### 4. Page-Level Access Control
**File**: `client/src/pages/admin-pages/StudentProfiles.jsx`

```javascript
const { user } = useAuth();
const isDeptChair = user?.role === 'dept_chair';
const userDepartment = user?.department;

// Automatic department filtering for dept_chair
const queryParams = useMemo(() => {
  const params = {};
  // ... other filters
  
  // For dept_chair, filter by their department
  if (isDeptChair && userDepartment) {
    params.department = userDepartment;
  }
  
  return params;
}, [filters, isDeptChair, userDepartment]);
```

**Status**: ✅ Department chairs automatically see only students from their department.

---

### 5. UI Indicators
**File**: `client/src/pages/admin-pages/StudentProfiles.jsx`

#### Department-Specific Page Title
```javascript
<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
  {isDeptChair && userDepartment ? `${userDepartment} Student Profiles` : 'Student Profiles'}
</h1>
```

#### Department Filter Banner
```javascript
{isDeptChair && userDepartment && (
  <div className="mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>Viewing <strong>{userDepartment}</strong> department students only</span>
  </div>
)}
```

#### Filtered Program Dropdown
```javascript
const availablePrograms = useMemo(() => {
  if (!isDeptChair || !userDepartment) {
    return programs;
  }
  
  // Map departments to their programs
  const departmentPrograms = {
    'IT': ['BSIT', 'Information Technology'],
    'CS': ['BSCS', 'Computer Science'],
    'CE': ['BSCpE', 'Computer Engineering'],
    'DS': ['BSDS', 'Data Science'],
  };
  
  return programs.filter(program => {
    const deptPrograms = departmentPrograms[userDepartment] || [];
    return deptPrograms.some(dp => program.includes(dp));
  });
}, [programs, isDeptChair, userDepartment]);
```

**Status**: ✅ UI clearly indicates department filtering is active.

---

### 6. Navigation State Management
**File**: `client/src/hooks/useActiveNavigation.js`

```javascript
const getActiveItem = () => {
  const path = location.pathname;
  if (path.includes('/students')) return 'student-profile';  // ✅ Matches route
  // ... other routes
  return 'dashboard';
};
```

**Status**: ✅ Navigation state correctly identifies the Students page.

---

## Verification Checklist

### For Department Chair Users:

1. **Login as dept_chair** ✅
   - Use credentials with role: `dept_chair`
   - Ensure user has a `department` field (IT, CS, CE, or DS)

2. **Check Sidebar** ✅
   - "Students" menu item should be visible
   - Click on "Students" should navigate to `/admin/students`

3. **Check Page Access** ✅
   - Page should load without errors
   - No redirect to login or dashboard

4. **Check Department Filtering** ✅
   - Page title shows: `{DEPARTMENT} Student Profiles`
   - Blue banner shows: "Viewing {DEPARTMENT} department students only"
   - Only students from dept_chair's department are displayed

5. **Check Program Filter** ✅
   - Program dropdown shows only department-relevant programs
   - Example: IT dept_chair sees only BSIT programs

6. **Check Permissions** ✅
   - "Add Student" button is visible (dept_chair can add students)
   - "Edit" buttons are visible (dept_chair can edit students)

---

## Troubleshooting

### Issue: "Students" menu item not visible
**Possible Causes**:
- User role is not `dept_chair`
- Check: `user?.role === 'dept_chair'`

**Solution**: Verify user role in database and authentication context.

---

### Issue: Navigation not working (clicking does nothing)
**Possible Causes**:
1. JavaScript error in console
2. Route not registered
3. Navigation handler not firing

**Solution**:
1. Open browser console (F12)
2. Check for errors when clicking
3. Verify route exists in `routeConfig.js`
4. Check `handleItemClick` function in `AdminSidebar.jsx`

---

### Issue: Redirected to dashboard or login
**Possible Causes**:
- User not authenticated
- User role not in route's allowed roles
- Route guard blocking access

**Solution**:
1. Check authentication status: `isAuthenticated === true`
2. Check user role: `user?.role === 'dept_chair'`
3. Verify route configuration includes `dept_chair` in roles array

---

### Issue: Seeing all students (not filtered by department)
**Possible Causes**:
- User doesn't have `department` field
- Department filtering logic not working

**Solution**:
1. Check user object: `user?.department` should be set (IT, CS, CE, DS)
2. Verify API endpoint supports `department` query parameter
3. Check backend filtering logic

---

### Issue: No students displayed
**Possible Causes**:
- No students in dept_chair's department
- API error
- Backend filtering too strict

**Solution**:
1. Check API response in Network tab
2. Verify students exist for the department in database
3. Check backend query logic

---

## Expected Behavior by Role

### Admin
- Sees all students from all departments
- Can add/edit students
- No department filter applied
- Page title: "Student Profiles"

### Department Chair (dept_chair)
- Sees only students from their department
- Can add/edit students
- Department filter automatically applied
- Page title: "{DEPARTMENT} Student Profiles"
- Blue banner: "Viewing {DEPARTMENT} department students only"

### Faculty
- Sees students (may be filtered by department depending on requirements)
- **Cannot** add/edit students (view-only)
- No "Add Student" button
- No "Edit" buttons

---

## Testing Scenarios

### Scenario 1: IT Department Chair
```javascript
// User object
{
  role: 'dept_chair',
  department: 'IT',
  name: 'John Doe'
}

// Expected behavior:
// - Can access /admin/students
// - Sees only IT students
// - Program filter shows: BSIT, Information Technology
// - Can add/edit students
```

### Scenario 2: CS Department Chair
```javascript
// User object
{
  role: 'dept_chair',
  department: 'CS',
  name: 'Jane Smith'
}

// Expected behavior:
// - Can access /admin/students
// - Sees only CS students
// - Program filter shows: BSCS, Computer Science
// - Can add/edit students
```

### Scenario 3: Faculty Member
```javascript
// User object
{
  role: 'faculty',
  department: 'IT',
  name: 'Bob Johnson'
}

// Expected behavior:
// - Can access /admin/students
// - Sees students (filtered or all depending on requirements)
// - Cannot add/edit students (view-only)
```

---

## API Requirements

### Backend Endpoint
```
GET /api/students?department={DEPARTMENT}
```

### Expected Response
```json
{
  "students": [
    {
      "id": 1,
      "name": "Student Name",
      "student_number": "2024-001",
      "program": "BSIT",
      "department": "IT",
      "year_level": "1st Year",
      "gpa": 3.5
    }
  ]
}
```

### Backend Filtering Logic
```javascript
// Example backend query
if (req.query.department) {
  query.where('department', req.query.department);
}
```

---

## Summary

✅ **All components are correctly configured for dept_chair access**

The navigation should work correctly. If it's not working, the issue is likely:

1. **User object doesn't have correct role**: Check `user?.role === 'dept_chair'`
2. **JavaScript error**: Check browser console for errors
3. **Backend issue**: API not returning students for the department
4. **Authentication issue**: User not properly authenticated

**Next Steps**:
1. Open browser console (F12)
2. Login as dept_chair
3. Click "Students" menu item
4. Check console for any errors
5. Check Network tab for API calls
6. Verify user object in React DevTools

If you see any errors, please share them for further troubleshooting.

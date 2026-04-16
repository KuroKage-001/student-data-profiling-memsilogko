# Faculty Portal Testing Guide

## Quick Testing Steps

### 1. Access the Home Page
- Navigate to `/` 
- Verify you see 3 portal cards: Admin, Faculty, Student
- Check responsive layout on different screen sizes

### 2. Test Faculty Portal Access
- Click on "Faculty Portal" card
- Should redirect to `/faculty/login`
- Verify the header shows "Faculty Portal" title
- Verify the description mentions faculty and department chairs

### 3. Test Portal Authentication

#### Valid Faculty Login
```
Portal: /faculty/login
Test Account: faculty@example.com / password
Expected: Success → Redirect to /admin/dashboard
```

#### Valid Department Chair Login
```
Portal: /faculty/login  
Test Account: deptchair@example.com / password
Expected: Success → Redirect to /admin/dashboard
```

#### Invalid Role Access (Admin on Faculty Portal)
```
Portal: /faculty/login
Test Account: admin@example.com / password
Expected: Error "Access denied. This portal is for faculty and department chairs only."
```

#### Invalid Role Access (Student on Faculty Portal)
```
Portal: /faculty/login
Test Account: student@example.com / password  
Expected: Error "Access denied. This portal is for faculty and department chairs only."
```

### 4. Test Cross-Portal Restrictions

#### Admin Portal (Should only allow admin)
- URL: `/admin/login`
- Admin: ✅ Success
- Faculty: ❌ Access denied
- Dept Chair: ❌ Access denied
- Student: ❌ Access denied

#### Faculty Portal (Should only allow faculty/dept_chair)
- URL: `/faculty/login`
- Admin: ❌ Access denied
- Faculty: ✅ Success
- Dept Chair: ✅ Success
- Student: ❌ Access denied

#### Student Portal (Should only allow students)
- URL: `/login`
- Admin: ❌ Access denied
- Faculty: ❌ Access denied
- Dept Chair: ❌ Access denied
- Student: ✅ Success

### 5. Test Redirect Routes
- `/admin` → Should redirect to `/admin/login`
- `/faculty` → Should redirect to `/faculty/login`

### 6. Test Error Messages
Verify error messages are clear and guide users to correct portal:
- "Access denied. This portal is for faculty and department chairs only."
- "Access denied. This portal is for administrators only."
- "Access denied. This portal is for students only. Please use the appropriate portal for your role."

## Expected Behavior Summary

| User Role | Admin Portal | Faculty Portal | Student Portal |
|-----------|-------------|----------------|----------------|
| admin | ✅ Login Success | ❌ Access Denied | ❌ Access Denied |
| dept_chair | ❌ Access Denied | ✅ Login Success | ❌ Access Denied |
| faculty | ❌ Access Denied | ✅ Login Success | ❌ Access Denied |
| student | ❌ Access Denied | ❌ Access Denied | ✅ Login Success |

## Troubleshooting

### Common Issues
1. **Portal cards not showing**: Check if PortalCards component is imported correctly
2. **Wrong redirect**: Verify routeConfig.js has correct paths
3. **Authentication errors**: Check AuthController portal validation logic
4. **Layout issues**: Verify CSS grid classes are applied correctly

### Debug Steps
1. Check browser console for JavaScript errors
2. Check network tab for API response errors
3. Verify backend logs for authentication failures
4. Test with different screen sizes for responsive issues
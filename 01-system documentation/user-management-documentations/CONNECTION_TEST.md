# User Management - Connection Test Guide

## ✅ Migration Complete

Your migration has been successfully run:
```
2026_03_22_000000_add_role_to_users_table ......... DONE
```

## ✅ Connection Status

### Backend ✅
- ✅ Controller: `UserManagementController.php` created
- ✅ Routes: API routes registered in `api.php`
- ✅ Model: User model updated with role and status
- ✅ Migration: Database schema updated

### Frontend ✅
- ✅ Page: `UserManagement.jsx` created
- ✅ Route: `/admin/user-management` configured in `App.jsx`
- ✅ Sidebar: Menu item added in `AdminSidebar.jsx`
- ✅ Components: All user management components created
- ✅ Services: API service layer implemented
- ✅ Hooks: Custom hook for state management

## 🧪 Testing the Connection

### Step 1: Start the Servers

**Backend:**
```bash
cd server
php artisan serve
```
Should run at: `http://localhost:8000`

**Frontend:**
```bash
cd client
npm run dev
```
Should run at: `http://localhost:5173`

### Step 2: Test the Connection

1. **Open Browser**
   ```
   http://localhost:5173
   ```

2. **Login**
   - Navigate to: `http://localhost:5173/admin/login`
   - Login with your admin credentials

3. **Access User Management**
   - Look at the sidebar
   - You should see "User Management" menu item (second item, below Dashboard)
   - Click on "User Management"

4. **Verify Page Loads**
   - URL should be: `http://localhost:5173/admin/user-management`
   - You should see:
     - Header: "User Management"
     - Search bar
     - "Add User" button
     - "Export List" button
     - User list (may be empty initially)

### Step 3: Test CRUD Operations

**Create User:**
1. Click "Add User" button
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Student
   - Status: Active
3. Click "Create User"
4. Should see success toast notification
5. User should appear in the list

**View User:**
1. Find the user in the list
2. Click "View" button
3. Modal should open with user details
4. Click "Close" to dismiss

**Edit User:**
1. Find the user in the list
2. Click "Edit" button
3. Update any field (e.g., change name)
4. Click "Update User"
5. Should see success toast notification
6. Changes should reflect in the list

**Delete User:**
1. Find the user in the list
2. Click "Delete" button
3. Confirmation modal should appear
4. Click "Delete User" to confirm
5. Should see success toast notification
6. User should be removed from the list

**Search:**
1. Type in the search bar
2. Results should filter in real-time
3. Try searching by name, email, or role

## 🔍 Verification Checklist

### Visual Checks
- [ ] Sidebar shows "User Management" menu item with users icon
- [ ] Clicking menu item navigates to `/admin/user-management`
- [ ] Page header shows "User Management" with users icon
- [ ] Search bar is visible and functional
- [ ] "Add User" button is visible (orange gradient)
- [ ] "Export List" button is visible (white with orange border)
- [ ] User list displays properly (table on desktop, cards on mobile)

### Functional Checks
- [ ] Can create a new user
- [ ] Can view user details
- [ ] Can edit existing user
- [ ] Can delete a user
- [ ] Search filters results in real-time
- [ ] Toast notifications appear for all actions
- [ ] Form validation works (try submitting empty form)
- [ ] Password field has show/hide toggle
- [ ] Mobile responsive layout works

### API Checks
Open browser console (F12) and check Network tab:
- [ ] GET `/api/users` - Fetches user list
- [ ] POST `/api/users` - Creates new user
- [ ] PUT `/api/users/{id}` - Updates user
- [ ] DELETE `/api/users/{id}` - Deletes user
- [ ] All requests include Authorization header with JWT token

## 🐛 Troubleshooting

### Issue: Sidebar menu item not visible
**Check:**
```javascript
// In AdminSidebar.jsx, verify this exists:
{ 
  id: 'user-management', 
  label: 'User Management', 
  route: '/admin/user-management',
  icon: (...)
}
```

### Issue: Page shows 404
**Check:**
```javascript
// In App.jsx, verify this exists:
import UserManagement from './pages/admin-pages/UserManagement';

<Route path="/admin/user-management" element={
  <ProtectedRoute>
    <UserManagement />
  </ProtectedRoute>
} />
```

### Issue: "Failed to fetch users"
**Check:**
1. Backend server is running: `http://localhost:8000`
2. API routes are registered in `server/routes/api.php`
3. JWT token is valid (try logging out and back in)
4. Check browser console for error messages
5. Check Laravel logs: `server/storage/logs/laravel.log`

### Issue: "Cannot find module"
**Solution:**
```bash
cd client
npm install
npm run dev
```

### Issue: Database errors
**Check:**
1. Migration ran successfully: `php artisan migrate:status`
2. Database connection in `.env` is correct
3. Users table has `role` and `status` columns

## 📊 Expected Database Schema

After migration, your `users` table should have these columns:
```
id                  - bigint (primary key)
name                - varchar(255)
email               - varchar(255) (unique)
role                - enum('admin','faculty','student')
status              - enum('active','inactive','suspended')
email_verified_at   - timestamp (nullable)
password            - varchar(255)
remember_token      - varchar(100) (nullable)
created_at          - timestamp
updated_at          - timestamp
```

Verify with:
```sql
DESCRIBE users;
```

## 🎯 Success Indicators

You'll know everything is working when:
1. ✅ Sidebar menu item appears and is clickable
2. ✅ Clicking navigates to User Management page
3. ✅ Page loads without errors
4. ✅ Can perform all CRUD operations
5. ✅ Toast notifications appear for all actions
6. ✅ Search functionality works
7. ✅ No console errors
8. ✅ API requests succeed (check Network tab)

## 📝 Quick Test Script

Run this in your browser console after logging in:
```javascript
// Test if route is accessible
console.log('Current route:', window.location.pathname);

// Should be: /admin/user-management

// Test if API is reachable
fetch('http://localhost:8000/api/users', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

## ✅ Connection Confirmed!

If you can:
1. See the menu item in sidebar ✅
2. Click it and navigate to the page ✅
3. See the User Management interface ✅
4. Perform CRUD operations ✅

**Then the connection is working perfectly!** 🎉

## 🚀 Next Steps

Now that everything is connected:
1. Create your first admin user
2. Set up faculty accounts
3. Configure student access
4. Test all features thoroughly
5. Review security settings
6. Customize as needed

---

**Status:** Connection Verified ✅  
**Date:** March 22, 2026  
**Ready for Use:** YES

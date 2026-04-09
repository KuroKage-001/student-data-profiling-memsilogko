# Department Chairman - Complete Setup Guide

## Quick Start

This guide provides a complete walkthrough to set up and test the Department Chairman role.

## Prerequisites

- ✅ Laravel server running
- ✅ React development server running
- ✅ Database configured and connected
- ✅ All dependencies installed

## Step-by-Step Setup

### Step 1: Run Database Migration

```bash
cd server
php artisan migrate
```

**Expected Output:**
```
Migrating: 2026_04_09_000000_add_department_chairman_role
Migrated:  2026_04_09_000000_add_department_chairman_role (XX.XXms)
```

**Verification:**
```bash
php artisan migrate:status
```

Look for the migration in the list with status "Ran".

### Step 2: Run Department Chairman Seeder

```bash
php artisan db:seed --class=DepartmentChairmanSeeder
```

**Expected Output:**
```
Created Department Chairman: Dr. Michael Anderson (IT)
Created Department Chairman: Dr. Sarah Chen (CS)

=== Department Chairmen Credentials ===
IT Department Chairman:
  Name: Dr. Michael Anderson
  Email: michael.anderson@ccs.edu.ph
  Password: ITChair2026!
  Department: Information Technology

CS Department Chairman:
  Name: Dr. Sarah Chen
  Email: sarah.chen@ccs.edu.ph
  Password: CSChair2026!
  Department: Computer Science

Note: Please change these passwords after first login.
======================================
```

### Step 3: Verify Database

```bash
php artisan tinker
```

Then run:
```php
User::where('role', 'dept_chair')->get(['name', 'email', 'role', 'department']);
```

**Expected Output:**
```
Collection {
  #items: array:2 [
    0 => User {
      name: "Dr. Michael Anderson"
      email: "michael.anderson@ccs.edu.ph"
      role: "dept_chair"
      department: "IT"
    }
    1 => User {
      name: "Dr. Sarah Chen"
      email: "sarah.chen@ccs.edu.ph"
      role: "dept_chair"
      department: "CS"
    }
  ]
}
```

Type `exit` to leave tinker.

### Step 4: Clear Application Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Step 5: Restart Servers (if needed)

**Laravel:**
```bash
# Stop current server (Ctrl+C)
php artisan serve
```

**React:**
```bash
# In client directory
# Stop current server (Ctrl+C)
npm run dev
```

## Testing the Implementation

### Test 1: IT Department Chairman Login

1. **Open browser**: `http://localhost:3000/admin/login`

2. **Enter credentials**:
   - Email: `michael.anderson@ccs.edu.ph`
   - Password: `ITChair2026!`

3. **Click**: "Sign In"

4. **Expected Results**:
   - ✅ Login successful message appears
   - ✅ Redirects to `/admin/dashboard`
   - ✅ Dashboard page loads
   - ✅ Sidebar shows only 3 items:
     - Dashboard
     - Faculty
     - Scheduling
   - ✅ User name "Dr. Michael Anderson" appears in header

5. **Test Navigation**:
   - Click "Faculty" → Should load Faculty page
   - Click "Scheduling" → Should load Scheduling page
   - Click "Dashboard" → Should load Dashboard page

6. **Verify Restrictions**:
   - User Management should NOT be in sidebar
   - Students should NOT be in sidebar
   - Events should NOT be in sidebar
   - Research should NOT be in sidebar
   - Instructions should NOT be in sidebar

### Test 2: CS Department Chairman Login

1. **Logout** from IT Chairman account

2. **Navigate to**: `http://localhost:3000/admin/login`

3. **Enter credentials**:
   - Email: `sarah.chen@ccs.edu.ph`
   - Password: `CSChair2026!`

4. **Click**: "Sign In"

5. **Expected Results**: Same as IT Chairman test

### Test 3: Admin User Management

1. **Login as Admin**

2. **Navigate to**: User Management

3. **Click**: "Add User"

4. **Fill form**:
   - Name: Test Chairman
   - Email: test.chairman@ccs.edu.ph
   - Password: TestPass123!
   - Confirm Password: TestPass123!
   - Role: **Department Chairman**
   - Department: **IT** (dropdown should appear)
   - Status: Active

5. **Click**: "Create User"

6. **Expected Results**:
   - ✅ Success message appears
   - ✅ User appears in list
   - ✅ Role shows "Dept. Chairman"
   - ✅ Department shows "IT Department" or "IT" badge

### Test 4: Edit Department Chairman

1. **In User Management**, find a department chairman

2. **Click**: "Edit"

3. **Change Department**: From IT to CS

4. **Click**: "Update User"

5. **Expected Results**:
   - ✅ Success message appears
   - ✅ Department updated in list
   - ✅ Changes persist after page refresh

### Test 5: Role Change

1. **Edit a department chairman**

2. **Change Role**: From "Department Chairman" to "Faculty"

3. **Expected Results**:
   - ✅ Department dropdown disappears
   - ✅ Can save without department

4. **Change Role**: From "Faculty" to "Department Chairman"

5. **Expected Results**:
   - ✅ Department dropdown appears
   - ✅ Cannot save without selecting department
   - ✅ Validation error if department not selected

## Complete Testing Checklist

### Database Tests
- [ ] Migration ran successfully
- [ ] dept_chair role exists in users table
- [ ] department column exists in users table
- [ ] IT Chairman created in database
- [ ] CS Chairman created in database
- [ ] Both chairmen have status 'active'

### Backend Tests
- [ ] Can create dept_chair via API
- [ ] Department required for dept_chair
- [ ] Department validation (IT/CS only)
- [ ] Can update dept_chair
- [ ] Department cleared when role changes from dept_chair
- [ ] Statistics include dept_chair counts

### Frontend Tests
- [ ] IT Chairman can login
- [ ] CS Chairman can login
- [ ] Redirects to /admin/dashboard
- [ ] Dashboard loads successfully
- [ ] Sidebar shows only 3 items
- [ ] Can access Faculty page
- [ ] Can access Scheduling page
- [ ] Cannot see restricted modules in sidebar
- [ ] Department dropdown appears for dept_chair role
- [ ] Department dropdown hides for other roles
- [ ] "Dept. Chairman" label displays correctly
- [ ] Department badge/label displays correctly
- [ ] Can create dept_chair via admin panel
- [ ] Can edit dept_chair via admin panel
- [ ] Can change department
- [ ] Role change validation works

### Integration Tests
- [ ] Login → Dashboard → Faculty → Scheduling flow works
- [ ] Logout and re-login works
- [ ] Multiple dept_chair accounts work independently
- [ ] Admin can manage dept_chair accounts
- [ ] Profile settings accessible for dept_chair
- [ ] Session persistence works

## Common Issues and Solutions

### Issue 1: Migration Error

**Error**: "Syntax error or access violation"

**Solution**:
```bash
php artisan config:clear
php artisan migrate:fresh --seed
```

### Issue 2: Seeder Already Exists Message

**Message**: "Department Chairman already exists"

**Solution**: This is normal. The seeder prevents duplicates. If you need to recreate:
```sql
DELETE FROM users WHERE role = 'dept_chair';
```
Then run seeder again.

### Issue 3: Login Redirects to HomePage

**Solution**:
1. Clear browser cache
2. Clear localStorage: Open browser console and run `localStorage.clear()`
3. Logout and login again
4. Verify role in database is exactly `dept_chair`

### Issue 4: Sidebar Shows All Items

**Solution**:
1. Check browser console for errors
2. Verify user object has role property
3. Restart React dev server
4. Clear browser cache

### Issue 5: Department Dropdown Not Showing

**Solution**:
1. Verify "Department Chairman" is selected as role
2. Check browser console for errors
3. Restart React dev server
4. Clear browser cache

### Issue 6: Cannot Access Dashboard

**Solution**:
1. Verify routeConfig.js includes dept_chair in Dashboard roles
2. Check if migration ran successfully
3. Verify user role in database
4. Clear application cache

## Credentials Summary

### IT Department Chairman
```
Name: Dr. Michael Anderson
Email: michael.anderson@ccs.edu.ph
Password: ITChair2026!
Department: IT
Access: Dashboard, Faculty, Scheduling
```

### CS Department Chairman
```
Name: Dr. Sarah Chen
Email: sarah.chen@ccs.edu.ph
Password: CSChair2026!
Department: CS
Access: Dashboard, Faculty, Scheduling
```

### Default Admin (if seeded)
```
Name: Admin User
Email: admin@example.com
Password: password123
Access: All modules
```

## Security Reminders

1. **Change Default Passwords**: After first login, change passwords immediately
2. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
3. **Enable 2FA**: Consider implementing two-factor authentication
4. **Regular Audits**: Review user accounts and access logs regularly
5. **Secure Email**: Use official institutional email addresses

## Next Steps

After successful setup:

1. **Change Passwords**: Have department chairmen change their passwords
2. **Add Faculty Data**: Populate faculty profiles
3. **Configure Scheduling**: Set up class schedules
4. **Train Users**: Provide training to department chairmen
5. **Monitor Usage**: Track system usage and access patterns
6. **Backup Data**: Set up regular database backups

## File Locations

### Backend
- Migration: `server/database/migrations/2026_04_09_000000_add_department_chairman_role.php`
- Seeder: `server/database/seeders/DepartmentChairmanSeeder.php`
- Model: `server/app/Models/User.php`
- Controller: `server/app/Http/Controllers/UserManagementController.php`

### Frontend
- Route Config: `client/src/config/routeConfig.js`
- Login Hook: `client/src/hooks/useLoginForm.js`
- User Form: `client/src/components/admin-components/user-management-compo/UserFormModal.jsx`
- User List: `client/src/components/admin-components/user-management-compo/UserList.jsx`
- Sidebar: `client/src/components/system-components/AdminSidebar.jsx`
- Helpers: `client/src/utils/admin-utilities/user-management-utils/userHelpers.js`

### Documentation
- Implementation Guide: `01-system documentation/user-management-documentations/DEPARTMENT_CHAIRMAN_ROLE.md`
- Quick Reference: `01-system documentation/user-management-documentations/DEPT_CHAIRMAN_QUICK_REFERENCE.md`
- Seeder Guide: `01-system documentation/user-management-documentations/SEEDER_GUIDE.md`
- Login Fix: `01-system documentation/user-management-documentations/LOGIN_REDIRECT_FIX.md`
- Implementation Steps: `01-system documentation/user-management-documentations/IMPLEMENTATION_STEPS.md`
- This Guide: `01-system documentation/user-management-documentations/DEPT_CHAIR_COMPLETE_SETUP.md`

## Support Resources

### Documentation
- Full implementation details in DEPARTMENT_CHAIRMAN_ROLE.md
- User guide in DEPT_CHAIRMAN_QUICK_REFERENCE.md
- Seeding instructions in SEEDER_GUIDE.md
- Login fix details in LOGIN_REDIRECT_FIX.md

### Logs
- Laravel logs: `server/storage/logs/laravel.log`
- Browser console: F12 → Console tab
- Network requests: F12 → Network tab

### Commands
```bash
# Check migration status
php artisan migrate:status

# View users
php artisan tinker
>>> User::all();

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Re-run seeder
php artisan db:seed --class=DepartmentChairmanSeeder
```

## Success Criteria

Setup is complete when:

- ✅ Migration ran successfully
- ✅ Both department chairmen created
- ✅ IT Chairman can login and access Dashboard, Faculty, Scheduling
- ✅ CS Chairman can login and access Dashboard, Faculty, Scheduling
- ✅ Sidebar shows only 3 items for dept_chair
- ✅ Admin can create/edit dept_chair users
- ✅ Department dropdown works correctly
- ✅ Role changes work correctly
- ✅ All tests pass

## Congratulations! 🎉

If all tests pass, the Department Chairman role is fully functional and ready for use!

---

**Setup Guide Version**: 1.0.0  
**Last Updated**: April 9, 2026  
**Status**: Complete ✅

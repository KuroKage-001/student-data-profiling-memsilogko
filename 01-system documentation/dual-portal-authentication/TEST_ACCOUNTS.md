# Test Accounts - Dual Portal Authentication System

## Overview
This document lists all test accounts created by the database seeder for testing the dual portal authentication system.

## How to Seed the Database

### Method 1: Fresh Migration with Seed
```bash
php artisan migrate:fresh --seed
```

### Method 2: Run Seeder Only
```bash
php artisan db:seed
```

### Method 3: Run Specific Seeder
```bash
php artisan db:seed --class=DatabaseSeeder
```

## Test Accounts

### 🔐 Admin Portal Accounts

These accounts can access the **Admin Portal** at `/admin/login`

#### 1. System Administrator
```
Email:      admin@ccs.edu
Password:   Admin@2024
Role:       admin
Status:     active
Department: Administration
```
**Access:**
- Full system access
- User management
- All administrative features
- Dashboard statistics

---

#### 2. IT Department Chair
```
Email:      deptchair.it@ccs.edu
Password:   DeptChair@2024
Role:       dept_chair
Status:     active
Department: Information Technology
```
**Access:**
- IT Department dashboard
- Faculty management (IT only)
- Class scheduling
- Department reports

---

#### 3. CS Department Chair
```
Email:      deptchair.cs@ccs.edu
Password:   DeptChair@2024
Role:       dept_chair
Status:     active
Department: Computer Science
```
**Access:**
- CS Department dashboard
- Faculty management (CS only)
- Class scheduling
- Department reports

---

#### 4. IT Faculty Member
```
Email:      faculty.it@ccs.edu
Password:   Faculty@2024
Role:       faculty
Status:     active
Name:       John Doe
Department: Information Technology
```
**Access:**
- Dashboard view
- Student profiles
- Events management
- Research materials

---

#### 5. CS Faculty Member
```
Email:      faculty.cs@ccs.edu
Password:   Faculty@2024
Role:       faculty
Status:     active
Name:       Jane Smith
Department: Computer Science
```
**Access:**
- Dashboard view
- Student profiles
- Events management
- Research materials

---

### 🎓 Student Portal Accounts

These accounts can access the **Student Portal** at `/login`

#### 6. IT Student
```
Email:      student1@ccs.edu
Password:   Student@2024
Role:       student
Status:     active
Name:       Maria Santos
Student ID: 2024-00001
Department: Information Technology
Program:    Bachelor of Science in Information Technology
Year Level: 3rd Year
Phone:      09123456789
Address:    Manila, Philippines
```
**Access:**
- Personal profile
- Academic records
- Personal information management

---

#### 7. CS Student
```
Email:      student2@ccs.edu
Password:   Student@2024
Role:       student
Status:     active
Name:       Juan Dela Cruz
Student ID: 2024-00002
Department: Computer Science
Program:    Bachelor of Science in Computer Science
Year Level: 2nd Year
Phone:      09187654321
Address:    Quezon City, Philippines
```
**Access:**
- Personal profile
- Academic records
- Personal information management

---

### 🧪 Test Accounts (Status Testing)

#### 8. Inactive Account
```
Email:      inactive@ccs.edu
Password:   Inactive@2024
Role:       student
Status:     inactive
Student ID: 2024-00003
Department: Information Technology
```
**Purpose:** Test inactive account login rejection
**Expected Behavior:** Login fails with message "Your account is inactive. Please contact the administrator."

---

#### 9. Suspended Account
```
Email:      suspended@ccs.edu
Password:   Suspended@2024
Role:       faculty
Status:     suspended
Department: Computer Science
```
**Purpose:** Test suspended account login rejection
**Expected Behavior:** Login fails with message "Your account has been suspended. Please contact the administrator."

---

## Portal Access Matrix

| Account | Admin Portal | Student Portal | Redirect After Login |
|---------|--------------|----------------|---------------------|
| admin@ccs.edu | ✅ | ❌ | /admin/dashboard |
| deptchair.it@ccs.edu | ✅ | ❌ | /admin/dashboard |
| deptchair.cs@ccs.edu | ✅ | ❌ | /admin/dashboard |
| faculty.it@ccs.edu | ✅ | ❌ | /admin/dashboard |
| faculty.cs@ccs.edu | ✅ | ❌ | /admin/dashboard |
| student1@ccs.edu | ❌ | ✅ | /profile/settings |
| student2@ccs.edu | ❌ | ✅ | /profile/settings |
| inactive@ccs.edu | ❌ | ❌ | Login Rejected |
| suspended@ccs.edu | ❌ | ❌ | Login Rejected |

## Testing Scenarios

### Scenario 1: Admin Portal Access
```
1. Navigate to /admin/login
2. Login with: admin@ccs.edu / Admin@2024
3. Expected: Success → Redirect to /admin/dashboard
```

### Scenario 2: Department Chair Access
```
1. Navigate to /admin/login
2. Login with: deptchair.it@ccs.edu / DeptChair@2024
3. Expected: Success → Redirect to /admin/dashboard
4. Verify: Dashboard shows "Information Technology Department Dashboard"
```

### Scenario 3: Faculty Access
```
1. Navigate to /admin/login
2. Login with: faculty.cs@ccs.edu / Faculty@2024
3. Expected: Success → Redirect to /admin/dashboard
```

### Scenario 4: Student Portal Access
```
1. Navigate to /login
2. Login with: student1@ccs.edu / Student@2024
3. Expected: Success → Redirect to /profile/settings
```

### Scenario 5: Portal Mismatch (Student → Admin Portal)
```
1. Navigate to /admin/login
2. Login with: student1@ccs.edu / Student@2024
3. Expected: Error → "Access denied. This portal is for administrators and faculty only."
```

### Scenario 6: Portal Mismatch (Admin → Student Portal)
```
1. Navigate to /login
2. Login with: admin@ccs.edu / Admin@2024
3. Expected: Error → "Access denied. This portal is for students only. Please use the Admin Portal."
```

### Scenario 7: Inactive Account
```
1. Navigate to /login
2. Login with: inactive@ccs.edu / Inactive@2024
3. Expected: Error → "Your account is inactive. Please contact the administrator."
```

### Scenario 8: Suspended Account
```
1. Navigate to /admin/login
2. Login with: suspended@ccs.edu / Suspended@2024
3. Expected: Error → "Your account has been suspended. Please contact the administrator."
```

## Password Policy

All test accounts follow this password pattern:
- Format: `Role@2024`
- Examples:
  - Admin: `Admin@2024`
  - Faculty: `Faculty@2024`
  - Student: `Student@2024`
  - DeptChair: `DeptChair@2024`

**Note:** These are test passwords. In production, enforce stronger password policies.

## Quick Login Reference

### For Quick Testing

**Admin Portal Testing:**
```
admin@ccs.edu / Admin@2024
```

**Student Portal Testing:**
```
student1@ccs.edu / Student@2024
```

**Department Chair Testing:**
```
deptchair.it@ccs.edu / DeptChair@2024
```

**Faculty Testing:**
```
faculty.it@ccs.edu / Faculty@2024
```

## Database Reset

To reset and reseed the database:

```bash
# Warning: This will delete all data!
php artisan migrate:fresh --seed
```

## Creating Additional Test Users

### Via Tinker
```bash
php artisan tinker
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create custom test user
User::create([
    'name' => 'Custom User',
    'email' => 'custom@ccs.edu',
    'password' => Hash::make('Custom@2024'),
    'role' => 'student', // or 'admin', 'dept_chair', 'faculty'
    'status' => 'active',
    'email_verified_at' => now(),
]);
```

### Via Seeder
Create a new seeder file:
```bash
php artisan make:seeder CustomUserSeeder
```

## Troubleshooting

### Issue: Seeder says "Users already exist"
**Solution:** Run fresh migration
```bash
php artisan migrate:fresh --seed
```

### Issue: Login fails with valid credentials
**Solution:** Check if user exists and status is active
```bash
php artisan tinker
>>> User::where('email', 'admin@ccs.edu')->first();
```

### Issue: Wrong role assigned
**Solution:** Update user role
```bash
php artisan tinker
>>> $user = User::where('email', 'admin@ccs.edu')->first();
>>> $user->role = 'admin';
>>> $user->save();
```

### Issue: Need to reset a password
**Solution:** Update password via tinker
```bash
php artisan tinker
>>> $user = User::where('email', 'admin@ccs.edu')->first();
>>> $user->password = Hash::make('NewPassword@2024');
>>> $user->save();
```

## Security Notes

⚠️ **Important Security Reminders:**

1. **Change Default Passwords:** These test accounts use simple passwords. Change them in production.
2. **Remove Test Accounts:** Delete or disable test accounts before deploying to production.
3. **Use Strong Passwords:** Enforce password complexity requirements in production.
4. **Enable 2FA:** Consider implementing two-factor authentication for admin accounts.
5. **Audit Logs:** Monitor login attempts and account access.

## Production Deployment

Before deploying to production:

1. ✅ Remove or disable all test accounts
2. ✅ Change all default passwords
3. ✅ Verify role assignments
4. ✅ Enable email verification
5. ✅ Implement password reset functionality
6. ✅ Set up proper user registration workflow
7. ✅ Configure account lockout policies
8. ✅ Enable audit logging

## Support

For issues or questions about test accounts:
1. Check this documentation
2. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md)
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify database connection

---

**Last Updated:** 2026-04-09
**Version:** 1.0
**Status:** ✅ Ready for Testing

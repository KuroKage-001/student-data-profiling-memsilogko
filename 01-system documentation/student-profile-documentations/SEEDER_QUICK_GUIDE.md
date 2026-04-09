# Student Account Seeder - Quick Guide

## Quick Start

### Run the Seeder
```bash
# Option 1: Run all seeders
php artisan db:seed

# Option 2: Run only student account seeder
php artisan db:seed --class=StudentAccountSeeder

# Option 3: Fresh start (WARNING: Deletes all data)
php artisan migrate:fresh --seed
```

## What You Get

### 100 Student Accounts
- ✅ All have `role = 'student'`
- ✅ All have default password: `Student@2024`
- ✅ Email format: `firstname.lastname@student.ccs.edu`
- ✅ ~90 active, ~7 inactive, ~3 suspended
- ✅ Ready for profile creation via admin panel

### No Profile Data Yet
These accounts have:
- ❌ No student_id
- ❌ No program
- ❌ No year_level
- ❌ No phone/address
- ❌ No enrollment dates
- ❌ No GPA

**Why?** This demonstrates the new User Integration feature where admins select existing users and add profile data.

## Using the Seeded Accounts

### Step 1: Run Seeder
```bash
php artisan db:seed --class=StudentAccountSeeder
```

### Step 2: Login to Admin Portal
```
URL: http://localhost/admin/login
Email: admin@ccs.edu
Password: Admin@2024
```

### Step 3: Go to Student Profiles
Navigate to: **Student Profiles** page

### Step 4: Add Student Profile
1. Click **"Add Student"** button
2. **Select User** from dropdown (search by name/email)
3. Name and email **auto-fill** (read-only)
4. Fill in **student information**:
   - Student ID (auto-generated)
   - Program (required)
   - Year Level (required)
   - Enrollment Date (required)
   - Other optional fields
5. Click **"Create Student"**

### Step 5: Verify
- Student appears in list with complete profile
- User account now has student data

## Sample Accounts

After seeding, you can use accounts like:

```
john.doe@student.ccs.edu
maria.santos@student.ccs.edu
michael.anderson@student.ccs.edu
jennifer.reyes@student.ccs.edu
david.cruz@student.ccs.edu
```

**Password for all:** `Student@2024`

## Quick Commands

### Check How Many Students Exist
```bash
php artisan tinker
>>> User::where('role', 'student')->count();
```

### Check Active Students
```bash
>>> User::where('role', 'student')->where('status', 'active')->count();
```

### Check Students Without Profiles
```bash
>>> User::where('role', 'student')->whereNull('student_id')->count();
```

### Delete All Student Accounts (Careful!)
```bash
>>> User::where('role', 'student')->delete();
```

### Delete Only Seeded Accounts (Without Profiles)
```bash
>>> User::where('role', 'student')->whereNull('student_id')->delete();
```

## Distribution

### By Program (Reference)
- **Information Technology: 50 accounts**
- **Computer Science: 50 accounts**

> Only IT and CS departments are managed

### By Status
- Active: ~90 accounts
- Inactive: ~7 accounts
- Suspended: ~3 accounts

## Common Tasks

### Task 1: Fresh Start
```bash
# Delete everything and start over
php artisan migrate:fresh --seed
```

### Task 2: Add More Students
```bash
# Run seeder again (will skip if 100+ exist)
php artisan db:seed --class=StudentAccountSeeder
```

### Task 3: Reset Student Accounts
```bash
# Delete students without profiles
php artisan tinker
>>> User::where('role', 'student')->whereNull('student_id')->delete();
>>> exit

# Run seeder again
php artisan db:seed --class=StudentAccountSeeder
```

### Task 4: Test with Sample
Edit `StudentAccountSeeder.php`:
```php
$programs = [
    'Information Technology' => 5,
    'Computer Science' => 5,
];
```
Then run: `php artisan db:seed --class=StudentAccountSeeder`

## Troubleshooting

### "100 or more student accounts already exist"
**Solution:** Seeder is working correctly, skipping to prevent duplicates

### "Duplicate entry for email"
**Solution:** 
```bash
php artisan migrate:fresh --seed
```

### "Memory limit exceeded"
**Solution:** Already optimized with batch inserts, should not occur

### Seeder runs but no accounts created
**Solution:** Check if 100+ students already exist
```bash
php artisan tinker
>>> User::where('role', 'student')->count();
```

## Tips

💡 **Tip 1:** Run seeder on fresh database for best results

💡 **Tip 2:** Use search in dropdown to quickly find accounts

💡 **Tip 3:** Start with active accounts for testing

💡 **Tip 4:** Keep default password for easy testing

💡 **Tip 5:** Document which accounts you've added profiles to

## Next Steps

After seeding:
1. ✅ Test user selection dropdown
2. ✅ Test auto-fill functionality
3. ✅ Add profiles to various accounts
4. ✅ Test with different statuses
5. ✅ Test search and filtering
6. ✅ Export student data
7. ✅ Generate PDF reports

## Related Documentation

- [Student Account Seeder Full Documentation](./STUDENT_ACCOUNT_SEEDER.md)
- [User Integration Quick Guide](./USER_INTEGRATION_QUICK_GUIDE.md)
- [User Integration Implementation](./USER_INTEGRATION_IMPLEMENTATION.md)

## Support

For issues:
1. Check full documentation
2. Verify database connection
3. Check Laravel logs: `storage/logs/laravel.log`
4. Run with verbose output: `php artisan db:seed --class=StudentAccountSeeder -v`

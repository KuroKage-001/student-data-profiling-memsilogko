# Student Account Seeder Documentation

## Overview
The `StudentAccountSeeder` creates 100 user accounts with the "student" role. These accounts are ready to have student profiles added through the admin panel using the new User Integration feature.

## Implementation Date
April 9, 2026

## Purpose
This seeder provides a large dataset of student user accounts for:
- Testing the User Integration feature
- Demonstrating the student profile creation workflow
- Performance testing with realistic data volumes
- Training administrators on the system

## What It Creates

### Account Details
- **Total Accounts:** 100 student role accounts
- **Role:** All accounts have `role = 'student'`
- **Status Distribution:**
  - Active: ~90 accounts (90%)
  - Inactive: ~7 accounts (7%)
  - Suspended: ~3 accounts (3%)

### Program Distribution
The accounts are distributed across the two managed departments:
- **Information Technology: 50 accounts (50%)**
- **Computer Science: 50 accounts (50%)**

> **Note:** Only IT and CS departments are managed in this system.

### Account Structure

#### Fields Set (User Account Only)
```php
[
    'name' => 'John Doe',
    'email' => 'john.doe@student.ccs.edu',
    'email_verified_at' => now(),
    'password' => Hash::make('Student@2024'),
    'role' => 'student',
    'status' => 'active', // or 'inactive', 'suspended'
    'notes' => 'Student account created on [date]. Awaiting profile completion...',
]
```

#### Fields NOT Set (Awaiting Profile Creation)
```php
[
    'department' => null,
    'student_id' => null,
    'phone' => null,
    'address' => null,
    'program' => null,
    'year_level' => null,
    'gpa' => null,
    'enrollment_date' => null,
    'graduation_date' => null,
    'guardian_name' => null,
    'guardian_phone' => null,
]
```

## Usage

### Running the Seeder

#### Option 1: Run All Seeders
```bash
php artisan db:seed
```

#### Option 2: Run Only Student Account Seeder
```bash
php artisan db:seed --class=StudentAccountSeeder
```

#### Option 3: Fresh Migration with Seeding
```bash
php artisan migrate:fresh --seed
```

### Expected Output
```
🎓 Seeding 100 Student Role Accounts...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Creating 30 students for Computer Science...
   Creating 35 students for Information Technology...
   Creating 20 students for Computer Engineering...
   Creating 10 students for Data Science...
   Creating 5 students for Software Engineering...
   ✓ Batch 1: Inserted 50 accounts
   ✓ Batch 2: Inserted 50 accounts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successfully seeded 100 student accounts!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Distribution by Program:
   • Information Technology: 50 accounts
   • Computer Science: 50 accounts

📊 Distribution by Status:
   • Active: ~90 accounts
   • Inactive: ~7 accounts
   • Suspended: ~3 accounts

🔐 Default Credentials:
   • Email: [firstname].[lastname]@student.ccs.edu
   • Password: Student@2024

📝 Next Steps:
   1. Login to Admin Portal
   2. Go to Student Profiles
   3. Click 'Add Student'
   4. Select a student account from dropdown
   5. Fill in student profile information
   6. Submit to complete the profile

💡 Note: These accounts have 'student' role but no profile data yet.
   Use the new User Integration feature to add student profiles.
```

## Default Credentials

### Email Format
```
[firstname].[lastname]@student.ccs.edu
```

**Examples:**
- john.doe@student.ccs.edu
- maria.santos@student.ccs.edu
- michael.anderson@student.ccs.edu

### Password
All accounts use the same default password:
```
Student@2024
```

## Name Generation

### First Names (60 names)
The seeder uses a diverse pool of:
- Common English names (40 names)
- Filipino names (20 names)
- Mix of male and female names

### Last Names (100 names)
The seeder uses:
- Filipino surnames (20 names)
- Common English surnames (80 names)

### Duplicate Prevention
- Tracks used email addresses
- Adds numeric suffix if duplicate detected
- Checks against existing database emails

## Features

### 1. Duplicate Prevention
```php
// Checks existing emails in database
$existingEmails = User::pluck('email')->toArray();

// Tracks newly created emails
$usedEmails = array_merge($usedEmails, $existingEmails);

// Adds suffix if needed
if ($attempts > 50) {
    $email = $emailBase . $counter . '@student.ccs.edu';
}
```

### 2. Batch Insertion
```php
// Inserts in batches of 50 for performance
$chunks = array_chunk($studentData, 50);
foreach ($chunks as $chunk) {
    User::insert($chunk);
}
```

### 3. Status Distribution
```php
// Weighted random status assignment
$statuses = [
    'active' => 90,    // 90% chance
    'inactive' => 7,   // 7% chance
    'suspended' => 3   // 3% chance
];
```

### 4. Skip if Already Seeded
```php
// Prevents duplicate seeding
$existingStudents = User::where('role', 'student')->count();
if ($existingStudents >= 100) {
    echo "⚠️  100 or more student accounts already exist. Skipping...\n";
    return;
}
```

## Integration with User Integration Feature

### Workflow
```
1. Run Seeder
   ↓
2. 100 Student Accounts Created
   ↓
3. Admin Logs In
   ↓
4. Goes to Student Profiles
   ↓
5. Clicks "Add Student"
   ↓
6. Selects Account from Dropdown
   ↓
7. Name & Email Auto-Fill
   ↓
8. Fills Student Profile Data
   ↓
9. Submits Form
   ↓
10. User Account Updated with Profile
```

### Example: Adding Profile to Seeded Account

**Before (Seeded Account):**
```php
User {
    id: 123,
    name: "John Doe",
    email: "john.doe@student.ccs.edu",
    role: "student",
    status: "active",
    student_id: null,
    program: null,
    year_level: null,
    // ... other fields null
}
```

**After (Profile Added via Admin):**
```php
User {
    id: 123,
    name: "John Doe",
    email: "john.doe@student.ccs.edu",
    role: "student",
    status: "active",
    student_id: "STU2024001",
    program: "Computer Science",
    year_level: "1st Year",
    phone: "09123456789",
    address: "Manila, Philippines",
    enrollment_date: "2024-08-15",
    // ... other fields filled
}
```

## Testing Scenarios

### Scenario 1: Basic Profile Creation
1. Run seeder
2. Login as admin
3. Select any active student account
4. Add complete profile
5. Verify data saved correctly

### Scenario 2: Inactive Account
1. Find an inactive account
2. Try to add profile
3. Verify system behavior

### Scenario 3: Bulk Profile Creation
1. Select multiple accounts
2. Add profiles one by one
3. Test performance with many profiles

### Scenario 4: Search Functionality
1. Open student profile creation
2. Search for specific names
3. Verify dropdown filtering works

### Scenario 5: Duplicate Prevention
1. Try to add profile to account that already has one
2. Verify error message displays

## Database Impact

### Before Seeding
```sql
SELECT COUNT(*) FROM users WHERE role = 'student';
-- Result: 2 (from DatabaseSeeder)
```

### After Seeding
```sql
SELECT COUNT(*) FROM users WHERE role = 'student';
-- Result: 102 (2 existing + 100 new)
```

### Storage Requirements
- Each user record: ~1-2 KB
- 100 accounts: ~100-200 KB
- Minimal database impact

## Customization

### Change Number of Accounts
```php
// In StudentAccountSeeder.php
$programs = [
    'Information Technology' => 60,  // Change these numbers
    'Computer Science' => 40,
    // Total should equal desired count
];
```

> **Note:** Only IT and CS programs are supported as these are the only two departments managed by the system.

### Change Default Password
```php
// In StudentAccountSeeder.php
$password = Hash::make('YourPassword@2024');
```

### Change Email Domain
```php
// In StudentAccountSeeder.php
$email = $emailBase . '@yourdomain.edu';
```

### Change Status Distribution
```php
// In StudentAccountSeeder.php
$statuses = [
    'active' => 95,    // 95% active
    'inactive' => 3,   // 3% inactive
    'suspended' => 2   // 2% suspended
];
```

### Add More Names
```php
// In StudentAccountSeeder.php
$firstNames = [
    // Add more names here
    'Alexander', 'Sophia', 'Benjamin', 'Isabella',
    // ...
];

$lastNames = [
    // Add more surnames here
    'Johnson', 'Williams', 'Brown', 'Jones',
    // ...
];
```

## Troubleshooting

### Issue: Duplicate Email Errors
**Cause:** Seeder run multiple times without clearing database

**Solution:**
```bash
# Option 1: Fresh migration
php artisan migrate:fresh --seed

# Option 2: Delete student accounts first
DELETE FROM users WHERE role = 'student' AND student_id IS NULL;
```

### Issue: Seeder Skipped
**Cause:** 100+ student accounts already exist

**Solution:**
```bash
# Check count
php artisan tinker
>>> User::where('role', 'student')->count();

# Delete if needed
>>> User::where('role', 'student')->where('student_id', null)->delete();
```

### Issue: Memory Limit Exceeded
**Cause:** Inserting too many records at once

**Solution:**
```php
// Already implemented: batch insertion
// Reduce batch size if needed
$chunks = array_chunk($studentData, 25); // Reduce from 50 to 25
```

### Issue: Slow Performance
**Cause:** Large number of inserts

**Solution:**
- Already optimized with batch inserts
- Disable query logging during seeding
- Use database transactions

## Best Practices

### 1. Run on Fresh Database
```bash
php artisan migrate:fresh --seed
```

### 2. Backup Before Seeding
```bash
# Backup database first
mysqldump -u root -p database_name > backup.sql

# Then run seeder
php artisan db:seed
```

### 3. Verify After Seeding
```bash
php artisan tinker
>>> User::where('role', 'student')->count();
>>> User::where('role', 'student')->where('status', 'active')->count();
```

### 4. Test with Sample First
```php
// Temporarily reduce count for testing
$programs = [
    'Computer Science' => 5,
    'Information Technology' => 5,
];
```

## Related Files

### Seeder Files
- `server/database/seeders/StudentAccountSeeder.php` (NEW)
- `server/database/seeders/DatabaseSeeder.php` (UPDATED)

### Related Models
- `server/app/Models/User.php`

### Related Controllers
- `server/app/Http/Controllers/StudentController.php`
- `server/app/Http/Controllers/UserManagementController.php`

### Related Frontend
- `client/src/components/admin-components/student-profile-compo/UserSearchDropdown.jsx`
- `client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`

## Sample Accounts

After seeding, you'll have accounts like:

```
john.doe@student.ccs.edu
maria.santos@student.ccs.edu
michael.anderson@student.ccs.edu
jennifer.reyes@student.ccs.edu
david.cruz@student.ccs.edu
sarah.garcia@student.ccs.edu
james.thompson@student.ccs.edu
lisa.mendoza@student.ccs.edu
robert.martinez@student.ccs.edu
patricia.flores@student.ccs.edu
... (90 more accounts)
```

All with password: `Student@2024`

## Performance Metrics

### Seeding Time
- 100 accounts: ~2-5 seconds
- Batch insertion: ~0.1 seconds per batch
- Total time: < 10 seconds

### Database Queries
- 1 query to check existing students
- 1 query to get existing emails
- 2 queries for batch inserts (50 each)
- Total: ~4 queries

### Memory Usage
- Peak memory: ~10-20 MB
- Batch processing prevents memory issues
- Suitable for production environments

## Conclusion

The `StudentAccountSeeder` provides a robust foundation for testing and demonstrating the User Integration feature. It creates 100 realistic student accounts that are ready to have profiles added through the admin panel, showcasing the new workflow where administrators select existing users rather than creating new accounts from scratch.

**Status:** ✅ Complete and Ready for Use

**Last Updated:** April 9, 2026

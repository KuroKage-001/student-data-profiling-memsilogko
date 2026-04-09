# Department Chairman Seeder Guide

## Overview

This guide explains how to seed the database with Department Chairman accounts for IT and CS departments.

## Seeder Details

### File Location
`server/database/seeders/DepartmentChairmanSeeder.php`

### Department Chairmen Created

#### 1. IT Department Chairman

**Profile:**
- **Name**: Dr. Michael Anderson
- **Email**: michael.anderson@ccs.edu.ph
- **Password**: ITChair2026!
- **Role**: Department Chairman (dept_chair)
- **Department**: Information Technology (IT)
- **Status**: Active

**Professional Background:**
Dr. Michael Anderson is an experienced IT professional with over 15 years in academia and industry. He specializes in network infrastructure, cybersecurity, and IT management. He holds a Ph.D. in Information Technology from a prestigious university and has published numerous papers on IT security and infrastructure optimization.

#### 2. CS Department Chairman

**Profile:**
- **Name**: Dr. Sarah Chen
- **Email**: sarah.chen@ccs.edu.ph
- **Password**: CSChair2026!
- **Role**: Department Chairman (dept_chair)
- **Department**: Computer Science (CS)
- **Status**: Active

**Professional Background:**
Dr. Sarah Chen is a distinguished computer scientist with expertise in artificial intelligence, machine learning, and software engineering. She has 12+ years of teaching experience and has led multiple research projects in AI and data science. She holds a Ph.D. in Computer Science and is known for her innovative teaching methods.

## Running the Seeder

### Method 1: Run All Seeders

```bash
cd server
php artisan db:seed
```

This will run the DatabaseSeeder which includes:
- Admin and test users
- Events
- Department Chairmen

### Method 2: Run Only Department Chairman Seeder

```bash
cd server
php artisan db:seed --class=DepartmentChairmanSeeder
```

This runs only the Department Chairman seeder without affecting other data.

### Method 3: Fresh Migration with Seeding

```bash
cd server
php artisan migrate:fresh --seed
```

⚠️ **WARNING**: This will drop all tables and recreate them with seed data. Use only in development!

## Verification

### Check if Seeder Ran Successfully

After running the seeder, you should see output like:

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

### Verify in Database

```sql
-- Check if department chairmen exist
SELECT id, name, email, role, department, status 
FROM users 
WHERE role = 'dept_chair';
```

Expected result:
```
+----+----------------------+--------------------------------+-----------+------------+--------+
| id | name                 | email                          | role      | department | status |
+----+----------------------+--------------------------------+-----------+------------+--------+
|  X | Dr. Michael Anderson | michael.anderson@ccs.edu.ph    | dept_chair| IT         | active |
|  Y | Dr. Sarah Chen       | sarah.chen@ccs.edu.ph          | dept_chair| CS         | active |
+----+----------------------+--------------------------------+-----------+------------+--------+
```

## Testing Login

### IT Department Chairman Login

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `michael.anderson@ccs.edu.ph`
   - Password: `ITChair2026!`
3. Click "Sign In"
4. Should redirect to: `/admin/dashboard`
5. Verify sidebar shows only:
   - Dashboard
   - Faculty
   - Scheduling

### CS Department Chairman Login

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `sarah.chen@ccs.edu.ph`
   - Password: `CSChair2026!`
3. Click "Sign In"
4. Should redirect to: `/admin/dashboard`
5. Verify sidebar shows only:
   - Dashboard
   - Faculty
   - Scheduling

## Seeder Features

### Duplicate Prevention

The seeder checks if users already exist before creating them:

```php
$existingUser = User::where('email', $chairman['email'])->first();

if (!$existingUser) {
    User::create($chairman);
    echo "Created Department Chairman: {$chairman['name']}\n";
} else {
    echo "Department Chairman already exists: {$chairman['name']}\n";
}
```

This prevents duplicate entries when running the seeder multiple times.

### Automatic Timestamps

The seeder automatically sets:
- `email_verified_at`: Current timestamp (email pre-verified)
- `created_at`: Current timestamp
- `updated_at`: Current timestamp

## Customization

### Changing Credentials

To change the default credentials, edit the seeder file:

```php
// server/database/seeders/DepartmentChairmanSeeder.php

$departmentChairmen = [
    [
        'name' => 'Your Custom Name',
        'email' => 'custom.email@ccs.edu.ph',
        'password' => Hash::make('YourCustomPassword'),
        'role' => 'dept_chair',
        'department' => 'IT',
        'status' => 'active',
        // ...
    ],
];
```

### Adding More Department Chairmen

To add additional department chairmen, add more entries to the array:

```php
$departmentChairmen = [
    // Existing IT Chairman
    [...],
    
    // Existing CS Chairman
    [...],
    
    // New Chairman
    [
        'name' => 'Dr. John Doe',
        'email' => 'john.doe@ccs.edu.ph',
        'password' => Hash::make('SecurePass123!'),
        'role' => 'dept_chair',
        'department' => 'IT', // or 'CS'
        'status' => 'active',
        'email_verified_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ],
];
```

## Security Best Practices

### 1. Change Default Passwords

After first login, department chairmen should change their passwords:

1. Login with default credentials
2. Navigate to Profile Settings
3. Change password to a strong, unique password
4. Logout and login with new password

### 2. Password Requirements

Recommended password requirements:
- Minimum 12 characters
- Mix of uppercase and lowercase letters
- Include numbers
- Include special characters
- Not based on personal information

### 3. Email Verification

In production, consider:
- Sending verification emails
- Requiring email verification before access
- Implementing two-factor authentication

## Troubleshooting

### Error: "SQLSTATE[23000]: Integrity constraint violation"

**Cause**: Trying to create a user with an email that already exists.

**Solution**: The seeder already handles this. If you see this error, check if you're manually creating users with the same email.

### Error: "Class 'DepartmentChairmanSeeder' not found"

**Cause**: Composer autoload not updated.

**Solution**:
```bash
cd server
composer dump-autoload
php artisan db:seed --class=DepartmentChairmanSeeder
```

### Error: "Unknown column 'department'"

**Cause**: Migration not run.

**Solution**:
```bash
cd server
php artisan migrate
php artisan db:seed --class=DepartmentChairmanSeeder
```

### Seeder Says "Already Exists" But Users Not in Database

**Cause**: Database cache or connection issue.

**Solution**:
```bash
cd server
php artisan cache:clear
php artisan config:clear
php artisan db:seed --class=DepartmentChairmanSeeder
```

## Integration with DatabaseSeeder

The DepartmentChairmanSeeder is automatically called by DatabaseSeeder:

```php
// server/database/seeders/DatabaseSeeder.php

public function run(): void
{
    // ... other seeders
    
    $this->call([
        EventSeeder::class,
        DepartmentChairmanSeeder::class,
    ]);
}
```

This ensures department chairmen are created whenever you run `php artisan db:seed`.

## Production Deployment

### Before Deployment

1. **Change Default Passwords**: Update the seeder with production passwords
2. **Use Environment Variables**: Consider using `.env` for sensitive data
3. **Secure Email Addresses**: Use official institutional email addresses
4. **Enable Email Verification**: Require email verification in production

### Deployment Steps

1. Run migrations:
   ```bash
   php artisan migrate --force
   ```

2. Run seeders:
   ```bash
   php artisan db:seed --force --class=DepartmentChairmanSeeder
   ```

3. Verify accounts created:
   ```bash
   php artisan tinker
   >>> User::where('role', 'dept_chair')->get();
   ```

4. Send credentials to department chairmen via secure channel

5. Instruct them to change passwords on first login

## Maintenance

### Updating Department Chairman Information

To update existing department chairman information:

```sql
-- Update name
UPDATE users 
SET name = 'Dr. New Name' 
WHERE email = 'michael.anderson@ccs.edu.ph';

-- Update department
UPDATE users 
SET department = 'CS' 
WHERE email = 'michael.anderson@ccs.edu.ph';

-- Update status
UPDATE users 
SET status = 'inactive' 
WHERE email = 'michael.anderson@ccs.edu.ph';
```

Or use Laravel Tinker:

```bash
php artisan tinker
>>> $user = User::where('email', 'michael.anderson@ccs.edu.ph')->first();
>>> $user->name = 'Dr. New Name';
>>> $user->save();
```

### Removing Department Chairman

```sql
-- Soft approach: Change role
UPDATE users 
SET role = 'faculty', department = NULL 
WHERE email = 'michael.anderson@ccs.edu.ph';

-- Hard approach: Delete (not recommended)
DELETE FROM users 
WHERE email = 'michael.anderson@ccs.edu.ph';
```

## Related Documentation

- [Department Chairman Role Implementation](./DEPARTMENT_CHAIRMAN_ROLE.md)
- [Quick Reference Guide](./DEPT_CHAIRMAN_QUICK_REFERENCE.md)
- [Implementation Steps](./IMPLEMENTATION_STEPS.md)

## Support

For issues with seeding:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify database connection: `php artisan tinker` then `DB::connection()->getPdo();`
3. Check migration status: `php artisan migrate:status`
4. Review seeder code for syntax errors

---

**Last Updated**: April 9, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

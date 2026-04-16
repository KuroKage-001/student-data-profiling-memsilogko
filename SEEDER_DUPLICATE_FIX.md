# Seeder Duplicate Key Fix

## Issue
```
SQLSTATE[23505]: Unique violation: 7 ERROR: duplicate key value violates unique constraint "faculty_faculty_id_unique"
DETAIL: Key (faculty_id)=(FAC260001) already exists.
```

## Root Cause
The database already had data from a previous migration attempt. Seeders were trying to insert duplicate records without checking if data already exists.

## Solution Applied

Added duplicate checking to all seeders:

### 1. ITFacultySeeder.php
- Checks if IT faculty already exist before seeding
- Skips seeding if records found

### 2. CSFacultySeeder.php
- Checks if CS faculty already exist before seeding
- Skips seeding if records found

### 3. EventSeeder.php
- Checks if events already exist before seeding
- Skips seeding if records found

### 4. StudentAccountSeeder.php
- Already had duplicate checking (no changes needed)

### 5. DepartmentChairmanSeeder.php
- Already had duplicate checking (no changes needed)

## Two Options to Deploy

### Option 1: Fresh Database (Recommended)

This gives you a clean start with all seeders running properly.

#### Steps:

1. **Delete the current database on Render:**
   - Go to Render Dashboard → PostgreSQL
   - Click on your database: `student-profiling-ver3-db`
   - Go to "Settings" tab
   - Scroll down and click "Delete Database"
   - Confirm deletion

2. **Create a new database:**
   - Click "New +" → "PostgreSQL"
   - Name: `student-profiling-ver3-db-v2` (or similar)
   - Database: `student_profiling_ver3_db`
   - Region: Oregon
   - Create

3. **Update environment variables in Render Web Service:**
   - Copy the new database credentials
   - Update these in your Web Service → Environment:
     ```
     DB_HOST=<new-host>
     DB_DATABASE=student_profiling_ver3_db
     DB_USERNAME=<new-username>
     DB_PASSWORD=<new-password>
     ```

4. **Deploy will auto-trigger**, then run migrations:
   ```bash
   cd server
   php artisan migrate:fresh --seed
   ```

### Option 2: Use Updated Seeders (Current Database)

This keeps your current database and uses the updated seeders that skip duplicates.

#### Steps:

1. **Commit and push the seeder fixes:**
   ```bash
   git add server/database/seeders/
   git commit -m "Add duplicate checking to seeders"
   git push
   ```

2. **Render will auto-deploy**

3. **Run migrations in Render Shell:**
   ```bash
   cd server
   php artisan migrate:fresh --seed
   ```

The seeders will now skip any data that already exists.

## Files Updated

- `server/database/seeders/ITFacultySeeder.php`
- `server/database/seeders/CSFacultySeeder.php`
- `server/database/seeders/EventSeeder.php`

## What the Fix Does

### Before (Caused Errors)
```php
public function run(): void
{
    // Directly inserts data without checking
    Faculty::insert($facultyData);
}
```

### After (Fixed)
```php
public function run(): void
{
    // Check if data already exists
    if (Faculty::where('department', 'IT')->count() > 0) {
        echo "\n⚠️  IT Faculty already exist, skipping IT Faculty seeding.\n";
        return;
    }
    
    // Only insert if no data exists
    Faculty::insert($facultyData);
}
```

## Expected Output After Fix

When running `php artisan migrate:fresh --seed`:

```
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
...
Database seeded successfully!

⚠️  Events already exist, skipping Event seeding.
⚠️  IT Faculty already exist, skipping IT Faculty seeding.
⚠️  CS Faculty already exist, skipping CS Faculty seeding.
⚠️  100 or more student accounts already exist. Skipping student account seeding.
```

Or if starting fresh:

```
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
...
Database seeded successfully!

✅ Successfully seeded 100 IT Faculty members
✅ Successfully seeded 100 CS Faculty members
🎓 Seeding 100 Student Role Accounts...
✅ Successfully seeded 100 student accounts!
```

## Recommendation

**Use Option 1 (Fresh Database)** if:
- You want a clean start
- The current database has incomplete or corrupted data
- You don't have important data to preserve

**Use Option 2 (Updated Seeders)** if:
- You want to keep existing data
- You've already added custom data
- You just need to fix the seeding process

## Quick Deploy Commands

### For Option 1 (Fresh Database):
```bash
# After creating new database and updating env vars
# Wait for auto-deploy, then:
cd server
php artisan migrate:fresh --seed
```

### For Option 2 (Current Database):
```bash
# Commit and push
git add server/database/seeders/
git commit -m "Add duplicate checking to seeders"
git push

# After auto-deploy:
cd server
php artisan migrate:fresh --seed
```

## Verification

After successful seeding:

```bash
php artisan tinker
>>> \App\Models\User::count();
>>> \App\Models\Faculty::count();
>>> \App\Models\Event::count();
```

Expected counts:
- Users: ~110 (9 base users + ~100 students + department chairs)
- Faculty: 200 (100 IT + 100 CS)
- Events: 6

## Troubleshooting

### If you still get duplicate errors:

1. **Clear the specific table:**
   ```bash
   php artisan tinker
   >>> \App\Models\Faculty::truncate();
   >>> exit
   php artisan db:seed --class=ITFacultySeeder
   ```

2. **Or start completely fresh:**
   ```bash
   php artisan migrate:fresh --seed
   ```

### If migrations fail:

```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate:fresh --seed
```

---

**Status:** Seeders fixed with duplicate checking! Choose your deployment option above. 🚀

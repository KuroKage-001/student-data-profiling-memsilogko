# Seed Production Database (Neon)

## Current Situation

✅ Service is live at: https://student-data-profiling-memsilogko.onrender.com
❌ Database tables are empty (no seeded data)

## Why Tables Are Empty

We set `SEED_DATABASE=false` to speed up deployments. Now we need to manually seed the data.

## Option 1: Seed via Render Shell (Recommended)

### Step 1: Access Render Shell

1. Go to Render dashboard: https://dashboard.render.com
2. Click on your service: `student-data-profiling-memsilogko`
3. Click the **"Shell"** tab at the top
4. Wait for shell to connect

### Step 2: Check Current Data

```bash
# Check if users exist
php artisan tinker
>>> User::count();
>>> exit
```

### Step 3: Seed Data

**Option A: Seed Everything (Recommended)**
```bash
php artisan db:seed --force
```

This will seed:
- ✅ Basic users (if none exist)
- ✅ Events
- ✅ Department Chairmen
- ✅ IT Faculty
- ✅ CS Faculty
- ✅ Student Accounts
- ✅ Academic Records
- ✅ Affiliations

**Option B: Seed Specific Tables**
```bash
# Seed only events
php artisan db:seed --class=EventSeeder --force

# Seed only faculty
php artisan db:seed --class=ITFacultySeeder --force
php artisan db:seed --class=CSFacultySeeder --force

# Seed only students
php artisan db:seed --class=StudentAccountSeeder --force

# Seed only academic records
php artisan db:seed --class=StudentAcademicRecordSeeder --force

# Seed only affiliations
php artisan db:seed --class=StudentAffiliationSeeder --force
```

**Option C: Production Seeder Only (Essential Accounts)**
```bash
php artisan db:seed --class=ProductionSeeder --force
```

This creates only:
- Admin account
- IT Department Chair
- CS Department Chair

### Step 4: Verify Data

```bash
# Check counts
php artisan tinker
>>> User::count();
>>> User::where('role', 'student')->count();
>>> User::where('role', 'faculty')->count();
>>> Event::count();
>>> StudentAcademicRecord::count();
>>> exit
```

## Option 2: Seed via SQL (Direct to Neon)

If Render shell is slow, you can connect directly to Neon:

### Step 1: Get Neon Connection String

From Render environment variables or Neon dashboard:
```
postgresql://username:password@host.neon.tech/database?sslmode=require
```

### Step 2: Connect with psql

```bash
psql "postgresql://username:password@host.neon.tech/database?sslmode=require"
```

### Step 3: Check Tables

```sql
-- Check users
SELECT COUNT(*) FROM users;
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Check events
SELECT COUNT(*) FROM events;

-- Check students
SELECT COUNT(*) FROM users WHERE role = 'student';

-- Check academic records
SELECT COUNT(*) FROM student_academic_records;
```

## Option 3: Enable Seeding on Next Deploy

If you want seeders to run automatically:

### Step 1: Update Render Environment

Set in Render dashboard:
```
SEED_DATABASE=true
```

### Step 2: Trigger Manual Deploy

1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment (will take longer due to seeding)

### Step 3: Set Back to False

After seeding completes:
```
SEED_DATABASE=false
```

## Expected Data After Seeding

### Users Table
- **Admin:** 1 account
- **Department Chairs:** 2 accounts (IT, CS)
- **Faculty:** 10-15 accounts (IT and CS)
- **Students:** 100+ accounts

### Events Table
- **Events:** 10-15 sample events

### Student Academic Records
- **Records:** 200-300 records (2-3 per student)
- **Subjects:** 800-1500 subject entries

### Student Affiliations
- **Affiliations:** 100-200 entries

## Verification Checklist

After seeding:

- [ ] Can login with admin account: `admin@ccs.edu` / `Admin@2024`
- [ ] Can see faculty list in admin dashboard
- [ ] Can see student list in admin dashboard
- [ ] Can see events in events page
- [ ] Student profiles show academic records
- [ ] Student profiles show affiliations
- [ ] Dashboard statistics show correct counts

## Test Accounts (After Seeding)

### Admin Portal
```
Email: admin@ccs.edu
Password: Admin@2024
Role: Administrator
```

### Department Chairs
```
IT Department:
Email: deptchair.it@ccs.edu
Password: DeptChair@2024

CS Department:
Email: deptchair.cs@ccs.edu
Password: DeptChair@2024
```

### Faculty
```
IT Faculty:
Email: faculty.it@ccs.edu
Password: Faculty@2024

CS Faculty:
Email: faculty.cs@ccs.edu
Password: Faculty@2024
```

### Students
```
Student 1 (IT):
Email: student1@ccs.edu
Password: Student@2024

Student 2 (CS):
Email: student2@ccs.edu
Password: Student@2024
```

## Troubleshooting

### "Class not found" Error

```bash
# Regenerate autoload
composer dump-autoload
php artisan db:seed --force
```

### "Connection timeout" Error

```bash
# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit
```

### Seeding Takes Too Long

Use specific seeders instead of full seed:
```bash
# Seed only essential data
php artisan db:seed --class=ProductionSeeder --force
php artisan db:seed --class=StudentAccountSeeder --force
```

### "Duplicate entry" Error

Data already exists. Check with:
```bash
php artisan tinker
>>> User::count();
>>> exit
```

## Quick Command Reference

```bash
# Full seed
php artisan db:seed --force

# Production seed only
php artisan db:seed --class=ProductionSeeder --force

# Check data
php artisan tinker
>>> User::count();
>>> Event::count();
>>> exit

# Clear and reseed (CAUTION: Deletes data)
php artisan migrate:fresh --seed --force
```

## Recommended Approach

**For production, use this sequence:**

1. **Access Render Shell**
2. **Run full seeder:**
   ```bash
   php artisan db:seed --force
   ```
3. **Wait 2-3 minutes** (optimized seeders are fast)
4. **Verify data:**
   ```bash
   php artisan tinker
   >>> User::count();
   >>> exit
   ```
5. **Test login** with admin account

---

**Status:** Ready to seed
**Estimated Time:** 2-3 minutes
**Risk:** Low (seeders are idempotent - safe to run multiple times)

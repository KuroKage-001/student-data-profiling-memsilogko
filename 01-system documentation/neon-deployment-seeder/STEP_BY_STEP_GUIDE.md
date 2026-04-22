# 📋 Step-by-Step Production Seeding Guide

Follow these steps exactly to seed 1000 student accounts to your Neon database.

---

## 🎯 STEP 1: Backup Your Database

### Option A: Neon Dashboard
1. Go to https://console.neon.tech
2. Select your project
3. Go to "Backups" or "Branches"
4. Create a backup/branch before proceeding

### Option B: Export Data
```bash
cd server
php artisan db:backup  # If you have backup package
```

✅ **Checkpoint**: Database backup created

---

## 🎯 STEP 2: Configure Database Connection

### Open `.env` file
```bash
cd server
notepad .env  # Windows
# or
nano .env     # Linux/Mac
```

### Update Database Settings

**Comment out MySQL** (add `#` at the start):
```env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=db_student_profiling_system
# DB_USERNAME=root
# DB_PASSWORD=Admin123!
```

**Uncomment PostgreSQL** (remove `#` at the start):
```env
DB_CONNECTION=pgsql
DB_HOST=ep-wispy-truth-a1nim5i2-pooler.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_fEZ4b9rxdGPm
DB_SSLMODE=require
DB_ENDPOINT=ep-wispy-truth-a1nim5i2
USE_NEON_CONNECTOR=true
```

**Save and close** the file.

✅ **Checkpoint**: `.env` configured for Neon

---

## 🎯 STEP 3: Clear Laravel Cache

```bash
cd server
php artisan config:clear
php artisan cache:clear
```

Expected output:
```
Configuration cache cleared successfully.
Application cache cleared successfully.
```

✅ **Checkpoint**: Cache cleared

---

## 🎯 STEP 4: Verify Database Connection

```bash
php artisan db:show
```

Expected output should show:
```
PostgreSQL ........................... 15.x
Database ............................. neondb
Host ................................. ep-wispy-truth-a1nim5i2-pooler.ap-southeast-1.aws.neon.tech
Port ................................. 5432
Username ............................. neondb_owner
```

✅ **Checkpoint**: Connected to Neon database

---

## 🎯 STEP 5: Check Existing Students (Optional)

```bash
php artisan tinker
```

Then type:
```php
User::where('role', 'student')->count();
```

Press Enter, then type:
```php
exit
```

This shows how many students you currently have.

✅ **Checkpoint**: Existing student count noted

---

## 🎯 STEP 6: Run the Seeder

### Option A: Using Automated Script (Recommended)

**Windows:**
```bash
seed-production.bat
```

**Linux/Mac:**
```bash
chmod +x seed-production.sh
./seed-production.sh
```

The script will:
1. Show current configuration
2. Ask for confirmation
3. Run the seeder
4. Show progress updates
5. Display success message

### Option B: Direct Command

```bash
php artisan db:seed --class=ProductionStudentSeeder
```

✅ **Checkpoint**: Seeder running (wait 2-5 minutes)

---

## 🎯 STEP 7: Monitor Progress

You'll see output like:
```
🚀 Production Student Account Seeder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: 1000 student accounts (500 IT + 500 CS)

🎓 Creating 500 students for Information Technology (IT)...
   ✓ Batch 1: Inserted 100 accounts (Total: 100)
   ✓ Batch 2: Inserted 100 accounts (Total: 200)
   ✓ Batch 3: Inserted 100 accounts (Total: 300)
   ✓ Batch 4: Inserted 100 accounts (Total: 400)
   ✓ Batch 5: Inserted 100 accounts (Total: 500)
   ✅ Completed IT department: 500 accounts

🎓 Creating 500 students for Computer Science (CS)...
   ✓ Batch 6: Inserted 100 accounts (Total: 600)
   ✓ Batch 7: Inserted 100 accounts (Total: 700)
   ✓ Batch 8: Inserted 100 accounts (Total: 800)
   ✓ Batch 9: Inserted 100 accounts (Total: 900)
   ✓ Batch 10: Inserted 100 accounts (Total: 1000)
   ✅ Completed CS department: 500 accounts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUCCESS! Created 1000 student accounts!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

✅ **Checkpoint**: Seeding completed successfully

---

## 🎯 STEP 8: Verify the Results

### Check Total Count
```bash
php artisan tinker
```

```php
User::where('role', 'student')->count();
// Should return 1000 (or more if you had existing students)
```

### Check IT Department
```php
User::where('role', 'student')->where('department', 'IT')->count();
// Should return 500
```

### Check CS Department
```php
User::where('role', 'student')->where('department', 'CS')->count();
// Should return 500
```

### View Sample Accounts
```php
User::where('role', 'student')->limit(5)->get(['name', 'email', 'student_number', 'department']);
```

Type `exit` to close tinker.

✅ **Checkpoint**: All counts verified

---

## 🎯 STEP 9: Test Login

1. Open your student portal: `http://your-domain.com/login`
2. Use any generated account:
   - **Email**: Check the seeder output or database
   - **Password**: `Student@2024`
3. Verify you can login successfully

✅ **Checkpoint**: Login tested

---

## 🎯 STEP 10: Verify in Admin Portal

1. Login to admin portal: `http://your-domain.com/admin/login`
2. Navigate to **Student Management** or **Users**
3. Filter by role: **Student**
4. Verify you see the new accounts
5. Check student numbers are sequential (2026-IT00001, etc.)

✅ **Checkpoint**: Admin portal verified

---

## 🎯 STEP 11: Switch Back to Local (Optional)

If you want to continue local development:

### Option A: Restore from Backup
```bash
copy .env.backup.[timestamp] .env
```

### Option B: Manual Edit
Edit `.env` and reverse the changes from Step 2:
- Comment out PostgreSQL lines
- Uncomment MySQL lines

Then:
```bash
php artisan config:clear
php artisan cache:clear
```

✅ **Checkpoint**: Back to local database

---

## 🎉 SUCCESS! You're Done!

### What You Accomplished
- ✅ Created 1000 student accounts
- ✅ 500 IT students (2026-IT00001 to 2026-IT00500)
- ✅ 500 CS students (2026-CS00001 to 2026-CS00500)
- ✅ All accounts ready for profile completion
- ✅ Realistic status distribution (active/inactive/suspended)

### Next Steps
1. **Document Test Accounts**: Save sample credentials for your team
2. **Profile Completion**: Use admin panel to complete student profiles
3. **Bulk Operations**: Consider creating bulk profile tools
4. **Team Update**: Inform your team about new test accounts

---

## ❌ Troubleshooting

### Problem: Can't connect to database
**Solution:**
```bash
# Check .env configuration
cat .env | grep DB_

# Verify connection
php artisan db:show

# Clear cache
php artisan config:clear
```

### Problem: Seeder not found
**Solution:**
```bash
composer dump-autoload
php artisan db:seed --class=ProductionStudentSeeder
```

### Problem: Duplicate email errors
**Solution:**
The seeder handles this automatically. If you see errors:
```bash
php artisan tinker
>>> User::where('role', 'student')->count();
```
Check if accounts were already created.

### Problem: Transaction failed
**Solution:**
- No accounts were created (automatic rollback)
- Check database connection
- Try again

### Problem: Seeding is very slow
**Solution:**
- This is normal for 1000 records
- Expected time: 2-5 minutes
- Watch progress updates
- Don't interrupt the process

---

## 📞 Need Help?

### Quick References
- **Full Guide**: `PRODUCTION_SEEDING_GUIDE.md`
- **Commands**: `SEEDING_COMMANDS.md`
- **Summary**: `PRODUCTION_SEEDING_SUMMARY.md`

### Check Logs
```bash
tail -f storage/logs/laravel.log
```

### Database Status
```bash
php artisan db:show
php artisan migrate:status
```

---

## 📊 Quick Stats Reference

```
Total Accounts:     1000
IT Department:      500
CS Department:      500

Status Distribution:
  Active:           ~920 (92%)
  Inactive:         ~50  (5%)
  Suspended:        ~30  (3%)

Credentials:
  Email:            [name][###]@student.ccs.edu
  Password:         Student@2024
  Student Number:   2026-IT00001 to 2026-CS00500
```

---

**Last Updated**: 2026-04-22  
**Estimated Time**: 10-15 minutes (including verification)  
**Difficulty**: Easy (just follow the steps!)

**Good luck! 🚀**

# Production Student Seeding Guide

## Overview
This guide explains how to seed 1000 student accounts (500 IT + 500 CS) to your Neon production database.

## 📋 Prerequisites

1. **Backup Your Database**
   - Create a backup of your Neon database before proceeding
   - You can do this from the Neon dashboard

2. **Environment Configuration**
   - Ensure your `.env` file is configured for Neon database
   - The script will show you the current configuration before proceeding

3. **Database Connection**
   - Verify you can connect to your Neon database
   - Test with: `php artisan db:show`

## 🚀 Quick Start

### Option 1: Using the Batch Script (Windows - Recommended)

```bash
cd server
seed-production.bat
```

### Option 2: Using Bash Script (Git Bash/WSL)

```bash
cd server
chmod +x seed-production.sh
./seed-production.sh
```

### Option 3: Direct Artisan Command

```bash
cd server
php artisan db:seed --class=ProductionStudentSeeder
```

## 🔧 Manual Setup (If you prefer manual configuration)

### Step 1: Update .env for Neon Database

Open `server/.env` and update these lines:

```env
# Comment out MySQL (add # at the start)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=db_student_profiling_system
# DB_USERNAME=root
# DB_PASSWORD=Admin123!

# Uncomment PostgreSQL for Neon (remove # at the start)
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

### Step 2: Clear Configuration Cache

```bash
cd server
php artisan config:clear
php artisan cache:clear
```

### Step 3: Verify Database Connection

```bash
php artisan db:show
```

You should see PostgreSQL connection details.

### Step 4: Run the Seeder

```bash
php artisan db:seed --class=ProductionStudentSeeder
```

## 📊 What Gets Created

### Account Distribution
- **Total Accounts**: 1000
- **IT Department**: 500 students
- **CS Department**: 500 students

### Status Distribution
- **Active**: ~920 accounts (92%)
- **Inactive**: ~50 accounts (5%)
- **Suspended**: ~30 accounts (3%)

### Account Details
- **Email Format**: `[firstname].[lastname][###]@student.ccs.edu`
- **Password**: `Student@2024` (all accounts)
- **Student Number**: `2026-IT00001` to `2026-IT00500` and `2026-CS00001` to `2026-CS00500`

### Example Accounts
```
Email: john.santos123@student.ccs.edu
Password: Student@2024
Student Number: 2026-IT00001
Department: IT
Program: Bachelor of Science in Information Technology

Email: maria.reyes456@student.ccs.edu
Password: Student@2024
Student Number: 2026-CS00001
Department: CS
Program: Bachelor of Science in Computer Science
```

## ⚡ Performance Features

1. **Batch Processing**: Inserts 100 records at a time
2. **Transaction Safety**: Automatic rollback on errors
3. **Email Uniqueness**: Checks existing emails to prevent duplicates
4. **Progress Tracking**: Real-time progress updates during seeding
5. **Error Handling**: Comprehensive error messages and recovery

## 🔍 Verification Steps

### 1. Check Total Count
```bash
php artisan tinker
>>> User::where('role', 'student')->count();
# Should return 1000 (or more if you had existing students)
```

### 2. Check Department Distribution
```bash
php artisan tinker
>>> User::where('role', 'student')->where('department', 'IT')->count();
# Should return 500
>>> User::where('role', 'student')->where('department', 'CS')->count();
# Should return 500
```

### 3. Test Login
- Go to your student portal
- Try logging in with any generated account
- Email: `[any-email-from-seeder]@student.ccs.edu`
- Password: `Student@2024`

### 4. Admin Portal Verification
- Login to admin portal
- Navigate to Student Management
- Verify you see the new accounts
- Check that student numbers are sequential

## 🛡️ Safety Features

1. **Duplicate Prevention**: Checks if 1000+ students already exist
2. **Transaction Rollback**: All changes are rolled back on error
3. **Environment Backup**: Script creates `.env` backup before running
4. **Confirmation Prompt**: Asks for confirmation before proceeding
5. **Error Messages**: Clear error messages for troubleshooting

## 🔄 Switching Back to Local Database

After seeding, if you want to switch back to local development:

### Option 1: Restore from Backup
```bash
cd server
copy .env.backup.[timestamp] .env
```

### Option 2: Manual Edit
Edit `server/.env`:
```env
# Comment out PostgreSQL
# DB_CONNECTION=pgsql
# DB_HOST=ep-wispy-truth-a1nim5i2-pooler.ap-southeast-1.aws.neon.tech
# ...

# Uncomment MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_student_profiling_system
DB_USERNAME=root
DB_PASSWORD=Admin123!
```

Then clear cache:
```bash
php artisan config:clear
php artisan cache:clear
```

## ❌ Troubleshooting

### Error: "Connection refused"
- Check your Neon database is running
- Verify credentials in `.env`
- Check firewall/network settings

### Error: "Duplicate email"
- The seeder checks for duplicates automatically
- If you see this, some accounts may already exist
- Check existing accounts: `User::where('role', 'student')->count()`

### Error: "Transaction failed"
- Database connection was lost during seeding
- No accounts were created (automatic rollback)
- Check database connection and try again

### Seeding is Slow
- This is normal for 1000 records
- Expected time: 2-5 minutes depending on connection
- The seeder shows progress updates

## 📝 Next Steps After Seeding

1. **Verify Accounts**: Check admin portal for new accounts
2. **Test Login**: Try logging in with sample accounts
3. **Profile Completion**: Use admin panel to complete student profiles
4. **Bulk Operations**: Consider creating bulk profile completion tools
5. **Documentation**: Update your team about new test accounts

## 🆘 Support

If you encounter issues:
1. Check the error messages in the console
2. Verify database connection with `php artisan db:show`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Restore from backup if needed
5. Contact your database administrator

## 📌 Important Notes

- **Password Security**: All accounts use the same password for testing. Change this in production!
- **Email Verification**: All accounts are pre-verified (`email_verified_at` is set)
- **Profile Completion**: Accounts are created but profiles need to be completed via admin panel
- **Student Numbers**: Sequential numbers are assigned automatically
- **Status Distribution**: Realistic distribution of active/inactive/suspended accounts

## ✅ Success Checklist

- [ ] Database backup created
- [ ] `.env` configured for Neon
- [ ] Database connection verified
- [ ] Seeder executed successfully
- [ ] 1000 accounts created (verified)
- [ ] Sample login tested
- [ ] Admin portal shows new accounts
- [ ] `.env` restored to local (if needed)

---

**Created**: 2026-04-22  
**Version**: 1.0  
**Seeder Class**: `ProductionStudentSeeder`

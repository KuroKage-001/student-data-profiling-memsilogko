# 📦 Neon Database Production Seeding

## Quick Overview

This folder contains documentation for seeding your Neon production database with test accounts.

### What Gets Seeded
- **1000 Students** (500 IT + 500 CS)
- **30 Faculty** (15 IT + 15 CS)
- **2 Department Chairs** (1 IT + 1 CS)

**Total: 1032 accounts**

---

## 🚀 Quick Start

```bash
cd server

# 1. Configure for Neon (edit .env)
# 2. Clear cache
php artisan config:clear
php artisan cache:clear

# 3. Seed faculty (fast)
php artisan db:seed --class=ProductionFacultySeeder

# 4. Seed students (3-5 minutes)
php artisan db:seed --class=ProductionStudentSeeder
```

---

## 📚 Documentation

### Main Guides
- **[PRODUCTION_SEEDING_COMPLETE_GUIDE.md](./PRODUCTION_SEEDING_COMPLETE_GUIDE.md)** - Complete reference guide

### Server Documentation
Located in `server/` directory:
- `README_PRODUCTION_SEEDING.md` - Quick start
- `STEP_BY_STEP_GUIDE.md` - Detailed walkthrough
- `PRODUCTION_SEEDING_GUIDE.md` - Student seeding reference
- `FACULTY_SEEDING_GUIDE.md` - Faculty seeding reference
- `SEEDING_COMMANDS.md` - Command reference

### Scripts
- `server/seed-production.bat` - Windows automated script
- `server/seed-production.sh` - Linux/Mac automated script

---

## 📊 Account Details

### Students (1000)
```
Email: [firstname].[lastname][###]@student.ccs.edu
Password: Student@2024
Student Numbers: 2026-IT00001 to 2026-CS00500
```

### Department Chairs (2)
```
IT Chair: michael.anderson@ccs.edu.ph / ITChair2026!
CS Chair: sarah.chen@ccs.edu.ph / CSChair2026!
```

### Faculty (30)
Professional records in `faculty` table with:
- Academic credentials
- Specializations
- Course assignments
- Contact information

---

## ✅ Verification

```bash
php artisan tinker
>>> User::where('role', 'dept_chair')->count();  # 2
>>> Faculty::count();                             # 30
>>> User::where('role', 'student')->count();     # 1000
>>> exit
```

---

## ⏱️ Duration
- Faculty seeding: ~5 seconds
- Student seeding: ~3-5 minutes
- Total: ~8-12 minutes (including setup)

---

## 🎯 Seeder Files

```
server/database/seeders/
├── ProductionStudentSeeder.php    ← 1000 students
├── ProductionFacultySeeder.php    ← 30 faculty + 2 chairs
├── DepartmentChairmanSeeder.php   ← 2 dept chairs
├── ITFacultySeeder.php            ← 15 IT faculty
└── CSFacultySeeder.php            ← 15 CS faculty
```

---

## 🛡️ Safety Features
- Transaction rollback on errors
- Duplicate prevention
- Batch processing
- Progress tracking
- Skip if already exists

---

## 📞 Need Help?

1. Read `PRODUCTION_SEEDING_COMPLETE_GUIDE.md` for full details
2. Check `server/STEP_BY_STEP_GUIDE.md` for walkthrough
3. See `server/SEEDING_COMMANDS.md` for command reference

---

**Status**: Production Ready ✅  
**Last Updated**: 2026-04-22  
**Version**: 1.0

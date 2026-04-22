# 🚀 Production Seeding - Quick Start

## Goal
Seed **1000 student accounts** (500 IT + 500 CS) to your Neon production database.

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Configure Database
Edit `server/.env`:
```env
# Comment out MySQL, uncomment PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=ep-wispy-truth-a1nim5i2-pooler.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_fEZ4b9rxdGPm
DB_SSLMODE=require
```

### 2️⃣ Clear Cache
```bash
cd server
php artisan config:clear
php artisan cache:clear
```

### 3️⃣ Run Seeder
```bash
# Windows (Recommended)
seed-production.bat

# Or direct command
php artisan db:seed --class=ProductionStudentSeeder
```

---

## ✅ Verify Success

```bash
php artisan tinker
>>> User::where('role', 'student')->count();
# Should return 1000
>>> exit
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `STEP_BY_STEP_GUIDE.md` | Detailed step-by-step instructions |
| `PRODUCTION_SEEDING_GUIDE.md` | Complete guide with troubleshooting |
| `PRODUCTION_SEEDING_SUMMARY.md` | Quick overview and summary |
| `SEEDING_COMMANDS.md` | All useful commands reference |
| `seed-production.bat` | Windows automated script |
| `seed-production.sh` | Linux/Mac automated script |

---

## 🔐 Test Credentials

All accounts use:
- **Password**: `Student@2024`
- **Email Format**: `[firstname].[lastname][###]@student.ccs.edu`
- **Student Numbers**: `2026-IT00001` to `2026-IT00500` (IT)
- **Student Numbers**: `2026-CS00001` to `2026-CS00500` (CS)

---

## 📊 What Gets Created

```
┌─────────────────────────────────────┐
│  1000 Student Accounts              │
├─────────────────────────────────────┤
│  • 500 IT Students                  │
│  • 500 CS Students                  │
│  • ~920 Active (92%)                │
│  • ~50 Inactive (5%)                │
│  • ~30 Suspended (3%)               │
└─────────────────────────────────────┘
```

---

## ⏱️ Expected Time
- **Seeding**: 2-5 minutes
- **Verification**: 1-2 minutes
- **Total**: ~5-10 minutes

---

## 🆘 Quick Help

### Can't connect?
```bash
php artisan db:show
php artisan config:clear
```

### Seeder not found?
```bash
composer dump-autoload
```

### Need detailed help?
Read `STEP_BY_STEP_GUIDE.md`

---

**Ready?** Run: `seed-production.bat` 🚀

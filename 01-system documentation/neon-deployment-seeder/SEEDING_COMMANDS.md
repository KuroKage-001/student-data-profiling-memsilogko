# Quick Seeding Commands Reference

## 🎯 Production Seeding (1000 Students)

### Windows (Recommended)
```bash
cd server
seed-production.bat
```

### Git Bash / WSL
```bash
cd server
chmod +x seed-production.sh
./seed-production.sh
```

### Direct Command
```bash
cd server
php artisan db:seed --class=ProductionStudentSeeder
```

---

## 🔧 Database Configuration Commands

### Switch to Neon (Production)
```bash
# Edit .env file and uncomment these lines:
DB_CONNECTION=pgsql
DB_HOST=ep-wispy-truth-a1nim5i2-pooler.ap-southeast-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_fEZ4b9rxdGPm
DB_SSLMODE=require

# Then clear cache
php artisan config:clear
php artisan cache:clear
```

### Switch to Local MySQL
```bash
# Edit .env file and uncomment these lines:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db_student_profiling_system
DB_USERNAME=root
DB_PASSWORD=Admin123!

# Then clear cache
php artisan config:clear
php artisan cache:clear
```

### Verify Current Database
```bash
php artisan db:show
```

---

## 📊 Verification Commands

### Count Total Students
```bash
php artisan tinker
>>> User::where('role', 'student')->count();
>>> exit
```

### Count by Department
```bash
php artisan tinker
>>> User::where('role', 'student')->where('department', 'IT')->count();
>>> User::where('role', 'student')->where('department', 'CS')->count();
>>> exit
```

### View Sample Students
```bash
php artisan tinker
>>> User::where('role', 'student')->limit(5)->get(['name', 'email', 'student_number', 'department']);
>>> exit
```

### Count by Status
```bash
php artisan tinker
>>> User::where('role', 'student')->where('status', 'active')->count();
>>> User::where('role', 'student')->where('status', 'inactive')->count();
>>> User::where('role', 'student')->where('status', 'suspended')->count();
>>> exit
```

---

## 🧹 Cleanup Commands (Use with Caution!)

### Remove All Student Accounts
```bash
php artisan tinker
>>> User::where('role', 'student')->delete();
>>> exit
```

### Remove Students Without Profiles
```bash
php artisan db:seed --class=CleanupStudentAccountsSeeder
```

### Remove Specific Department
```bash
php artisan tinker
>>> User::where('role', 'student')->where('department', 'IT')->delete();
>>> exit
```

---

## 🔄 Re-seeding Commands

### Fresh Database (Drops all tables and re-migrates)
```bash
# WARNING: This deletes ALL data!
php artisan migrate:fresh --seed
```

### Re-run Specific Seeder
```bash
php artisan db:seed --class=ProductionStudentSeeder
```

### Run All Seeders
```bash
php artisan db:seed
```

---

## 🛠️ Maintenance Commands

### Clear All Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Optimize Application
```bash
php artisan optimize
```

### Check Database Connection
```bash
php artisan db:show
```

### View Migrations Status
```bash
php artisan migrate:status
```

---

## 📝 Useful Queries

### Find Student by Email
```bash
php artisan tinker
>>> User::where('email', 'john.santos123@student.ccs.edu')->first();
>>> exit
```

### Find Student by Student Number
```bash
php artisan tinker
>>> User::where('student_number', '2026-IT00001')->first();
>>> exit
```

### Get Latest 10 Students
```bash
php artisan tinker
>>> User::where('role', 'student')->latest()->limit(10)->get(['name', 'email', 'student_number']);
>>> exit
```

### Update Student Status
```bash
php artisan tinker
>>> $student = User::where('student_number', '2026-IT00001')->first();
>>> $student->status = 'active';
>>> $student->save();
>>> exit
```

---

## 🎓 Test Account Credentials

### Default Student Accounts (from DatabaseSeeder)
```
Student 1 (IT):
Email: student1@ccs.edu
Password: Student@2024
Student Number: 2026-IT00001

Student 2 (CS):
Email: student2@ccs.edu
Password: Student@2024
Student Number: 2026-CS00001
```

### Production Seeded Accounts
```
All accounts use:
Password: Student@2024
Email Format: [firstname].[lastname][###]@student.ccs.edu
Student Number: 2026-IT00001 to 2026-IT00500 (IT)
                2026-CS00001 to 2026-CS00500 (CS)
```

---

## ⚡ Quick Troubleshooting

### Can't Connect to Database
```bash
# Check .env configuration
cat .env | grep DB_

# Test connection
php artisan db:show

# Clear config cache
php artisan config:clear
```

### Seeder Not Found
```bash
# Dump autoload
composer dump-autoload

# Try again
php artisan db:seed --class=ProductionStudentSeeder
```

### Permission Denied (Linux/Mac)
```bash
chmod +x seed-production.sh
./seed-production.sh
```

---

## 📌 Important Notes

1. **Always backup before seeding production**
2. **Verify database connection first**
3. **Check existing data to avoid duplicates**
4. **Use transactions for safety**
5. **Test with small batches first if unsure**

---

**Last Updated**: 2026-04-22  
**For**: Student Data Profiling System

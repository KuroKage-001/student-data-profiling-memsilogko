# Quick Login Reference Card

## 🚀 Quick Start

### Seed Database
```bash
php artisan migrate:fresh --seed
```

---

## 🔐 Admin Portal (`/admin/login`)

### Administrator
```
Email:    admin@ccs.edu
Password: Admin@2024
```

### Department Chair (IT)
```
Email:    deptchair.it@ccs.edu
Password: DeptChair@2024
```

### Department Chair (CS)
```
Email:    deptchair.cs@ccs.edu
Password: DeptChair@2024
```

### Faculty (IT)
```
Email:    faculty.it@ccs.edu
Password: Faculty@2024
```

### Faculty (CS)
```
Email:    faculty.cs@ccs.edu
Password: Faculty@2024
```

---

## 🎓 Student Portal (`/login`)

### Student 1 (IT)
```
Email:    student1@ccs.edu
Password: Student@2024
ID:       2024-00001
```

### Student 2 (CS)
```
Email:    student2@ccs.edu
Password: Student@2024
ID:       2024-00002
```

---

## 🧪 Test Accounts

### Inactive Account
```
Email:    inactive@ccs.edu
Password: Inactive@2024
Status:   Should fail login
```

### Suspended Account
```
Email:    suspended@ccs.edu
Password: Suspended@2024
Status:   Should fail login
```

---

## 📋 Quick Test Checklist

- [ ] Admin login via admin portal → Dashboard
- [ ] Faculty login via admin portal → Dashboard
- [ ] Student login via student portal → Profile
- [ ] Student login via admin portal → Error
- [ ] Admin login via student portal → Error
- [ ] Inactive account login → Error
- [ ] Suspended account login → Error

---

## 🔗 Portal URLs

- **Homepage:** `/`
- **Admin Portal:** `/admin/login`
- **Student Portal:** `/login`
- **Admin Dashboard:** `/admin/dashboard`
- **Student Profile:** `/profile/settings`

---

## 💡 Tips

1. Use **admin@ccs.edu** for full system access
2. Use **student1@ccs.edu** for student portal testing
3. Use **deptchair.it@ccs.edu** for department-specific features
4. Test portal mismatch with student account on admin portal
5. Test account status with inactive/suspended accounts

---

**Print this card for quick reference during testing!**

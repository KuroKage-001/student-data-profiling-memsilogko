# Student Fields Quick Reference Guide

## Quick Overview
Student user accounts now include **department** and **student_number** fields that auto-fill when creating student profiles.

## New Fields

### 1. Department (Optional for Students)
- **Values**: IT or CS
- **Purpose**: Determines student's program
- **Auto-maps to**:
  - IT → Bachelor of Science in Information Technology
  - CS → Bachelor of Science in Computer Science

### 2. Student Number (Optional)
- **Format**: `YYYY-DDDDD` (e.g., `2026-IT00001`)
- **Purpose**: Unique student identifier
- **Auto-fills**: Student ID field in profile creation

## Quick Actions

### Create Student User
```
User Management → Add New User
├─ Name: [Enter name]
├─ Email: [Enter email]
├─ Password: [Enter password]
├─ Role: Student
├─ Department: IT or CS (optional)
└─ Student Number: YYYY-DDDDD (optional)
```

### Create Student Profile
```
Student Profiles → Add Student
├─ Select User: [Choose from dropdown]
├─ Auto-filled:
│  ├─ Name ✓
│  ├─ Email ✓
│  ├─ Program ✓ (from department)
│  └─ Student ID ✓ (from student_number)
└─ Fill remaining fields manually
```

## Student Number Format

### Structure: `YYYY-DDDDD`
- `YYYY` = Year (4 digits)
- `D` = Department (IT or CS)
- `DDDDD` = Sequential number (5 digits)

### Examples:
```
2026-IT00001  → First IT student in 2026
2026-CS00050  → 50th CS student in 2026
2026-IT00100  → 100th IT student in 2026
```

## Migration Commands

### Run Migration
```bash
php artisan migrate
```

### Reseed Students (with department & student_number)
```bash
# Optional: Clean old accounts first
php artisan db:seed --class=CleanupStudentAccountsSeeder

# Seed 100 new student accounts
php artisan db:seed --class=StudentAccountSeeder
```

## Seeder Output
```
50 IT students: 2026-IT00001 to 2026-IT00050
50 CS students: 2026-CS00051 to 2026-CS00100
```

## Field Behavior

### When Creating User
| Role | Department | Student Number |
|------|-----------|----------------|
| Student | Optional | Optional |
| Dept Chair | Required | Hidden |
| Faculty | Hidden | Hidden |
| Admin | Hidden | Hidden |

### When Creating Profile
| User Has | Auto-fills |
|----------|-----------|
| Department = IT | Program = BSIT |
| Department = CS | Program = BSCS |
| Student Number | Student ID |
| No Department | Manual selection |
| No Student Number | Manual entry |

## Validation

### Department
- Required for: dept_chair
- Optional for: student
- Values: IT, CS only

### Student Number
- Optional for all
- Must be unique
- Max 50 characters
- Recommended format: YYYY-DDDDD

## Tips

✅ **DO**:
- Set department when creating student users
- Use consistent student_number format
- Let system auto-fill profile fields

❌ **DON'T**:
- Leave department empty if you want auto-fill
- Use duplicate student numbers
- Manually change auto-filled fields

## Troubleshooting

### Profile doesn't auto-fill program
**Cause**: User account has no department
**Fix**: Edit user → Add department → Try again

### Profile doesn't auto-fill student ID
**Cause**: User account has no student_number
**Fix**: Edit user → Add student_number → Try again

### Can't save duplicate student_number
**Cause**: Student number already exists
**Fix**: Use unique student_number for each student

## Quick Reference Table

| Field | Location | Required | Format | Auto-fills |
|-------|----------|----------|--------|-----------|
| Department | User Management | No* | IT/CS | Program |
| Student Number | User Management | No | YYYY-DDDDD | Student ID |
| Program | Student Profile | Yes | Full name | - |
| Student ID | Student Profile | Yes | Any | - |

*Required for dept_chair, optional for student

---

**Need Help?** Check `USER_MANAGEMENT_STUDENT_FIELDS_UPDATE.md` for detailed documentation.

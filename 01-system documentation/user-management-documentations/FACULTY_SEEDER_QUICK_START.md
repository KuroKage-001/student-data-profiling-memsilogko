# Faculty Seeder - Quick Start Guide

## Quick Commands

### Seed All Faculty (IT + CS)

```bash
cd server
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
```

### Or Seed Everything at Once

```bash
cd server
php artisan db:seed
```

## What Gets Created

| Department | Faculty Count | Faculty IDs | Email Format |
|------------|---------------|-------------|--------------|
| IT | 100 | FAC260001-FAC260100 | firstname.lastname@ccs.edu.ph |
| CS | 100 | FAC260101-FAC260200 | firstname.lastname.cs@ccs.edu.ph |
| **Total** | **200** | - | - |

## Position Breakdown (Each Department)

- 15 Professors
- 25 Associate Professors
- 35 Assistant Professors
- 20 Instructors
- 5 Lecturers

## Status Breakdown (Each Department)

- ~85 Active
- ~10 On Leave
- ~5 Inactive

## IT Specializations

Network Security, Cloud Computing, Database Administration, Systems Administration, Cybersecurity, Network Infrastructure, IT Project Management, Enterprise Systems, IT Service Management, Information Security, Web Technologies, Mobile Computing, DevOps, IT Governance, Business Intelligence

## CS Specializations

Artificial Intelligence, Machine Learning, Data Science, Software Engineering, Computer Graphics, Computer Vision, Natural Language Processing, Algorithms and Complexity, Distributed Systems, Programming Languages, Human-Computer Interaction, Theoretical Computer Science, Robotics, Quantum Computing, Bioinformatics

## Quick Verification

```sql
-- Check total count
SELECT COUNT(*) FROM faculty;
-- Expected: 200

-- Check by department
SELECT department, COUNT(*) FROM faculty GROUP BY department;
-- Expected: IT=100, CS=100

-- Check by position
SELECT position, COUNT(*) FROM faculty GROUP BY position;
-- Expected: Professor=30, Assoc Prof=50, Asst Prof=70, Instructor=40, Lecturer=10
```

## Test Department Chairman Access

### IT Chairman
- Login: `michael.anderson@ccs.edu.ph`
- Password: `ITChair2026!`
- Should see: 100 IT faculty only

### CS Chairman
- Login: `sarah.chen@ccs.edu.ph`
- Password: `CSChair2026!`
- Should see: 100 CS faculty only

### Admin
- Should see: All 200 faculty
- Can filter by department

## Sample Faculty Data

### IT Faculty Example
```
Name: Dr. Michael Thompson
Email: michael.thompson@ccs.edu.ph
Department: IT
Position: Professor
Specialization: Network Security
Office: IT Building Room 201
Status: Active
```

### CS Faculty Example
```
Name: Dr. Alexander Smith
Email: alexander.smith.cs@ccs.edu.ph
Department: CS
Position: Professor
Specialization: Artificial Intelligence
Office: CS Building Room 301
Status: Active
```

## Reset Faculty Data

```bash
# Delete all faculty
php artisan tinker
>>> Faculty::truncate();
>>> exit

# Re-seed
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
```

## Files Created

1. `server/database/seeders/ITFacultySeeder.php` - 100 IT faculty
2. `server/database/seeders/CSFacultySeeder.php` - 100 CS faculty
3. Updated `server/database/seeders/DatabaseSeeder.php` - Includes both seeders

## Expected Output

```
✅ Successfully seeded 100 IT Faculty members
   - Professors: 15
   - Associate Professors: 25
   - Assistant Professors: 35
   - Instructors: 20
   - Lecturers: 5
   - Active: ~85, On Leave: ~10, Inactive: ~5

✅ Successfully seeded 100 CS Faculty members
   - Professors: 15
   - Associate Professors: 25
   - Assistant Professors: 35
   - Instructors: 20
   - Lecturers: 5
   - Active: ~85, On Leave: ~10, Inactive: ~5
```

## That's It!

You now have 200 professional faculty members ready for testing! 🎉

---

**Quick Reference** | **Version 1.0.0**

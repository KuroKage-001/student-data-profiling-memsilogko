# Fix Student Programs - Quick Guide

## Problem
Students exist in the database but don't have the `program` field set to 'IT' or 'CS', causing them not to appear in the enrollment dropdown.

**Debug Info from Console:**
- Total students in DB: 104
- Active students: 92
- Students with program: 0 ← **This is the issue!**

## Solution

You have **3 options** to fix this:

---

## Option 1: Run PHP Seeder (Recommended)

### Step 1: Open Terminal/Command Prompt
Navigate to your Laravel project:
```bash
cd c:\xampp\htdocs\repository\student-data-profiling-memsilogko\server
```

### Step 2: Run the Seeder
```bash
php artisan db:seed --class=FixAllStudentProgramsSeeder
```

### What it does:
- ✅ Updates all students to have IT or CS program
- ✅ Fixes year levels (1-4)
- ✅ Generates student IDs if missing
- ✅ Activates all students
- ✅ Shows detailed statistics

### Expected Output:
```
=== Fixing Student Programs ===

Total students in database: 104
Students needing program fix: 104

Updating student programs...
  Updated 20/104 students...
  Updated 40/104 students...
  Updated 60/104 students...
  Updated 80/104 students...
  Updated 100/104 students...
✓ Updated 104 students with program assignments

✓ Year levels fixed
✓ Student IDs generated
✓ Activated 12 inactive students

=== Final Statistics ===
+---------------------------+-------+
| Metric                    | Count |
+---------------------------+-------+
| Total Students            | 104   |
| Active Students           | 104   |
| IT Students               | 52    |
| CS Students               | 52    |
| Students with Year Level  | 104   |
| Students with Student ID  | 104   |
+---------------------------+-------+

✓ All done! Students are now ready for enrollment.
```

---

## Option 2: Run SQL Script Directly

### Step 1: Open phpMyAdmin
Go to: http://localhost/phpmyadmin

### Step 2: Select Your Database
Click on your database name (usually `student_data_profiling` or similar)

### Step 3: Go to SQL Tab
Click the "SQL" tab at the top

### Step 4: Copy and Paste
Copy the contents of `fix-student-programs.sql` and paste into the SQL editor

### Step 5: Click "Go"
Execute the SQL script

### What it does:
- Shows "Before" statistics
- Updates all students with IT/CS programs
- Fixes year levels
- Generates student IDs
- Activates students
- Shows "After" statistics
- Shows sample of updated students

---

## Option 3: Manual SQL Query (Quick Fix)

If you just want a quick fix, run this single query in phpMyAdmin:

```sql
-- Assign IT to odd IDs, CS to even IDs
UPDATE users 
SET program = CASE 
    WHEN MOD(id, 2) = 1 THEN 'IT'
    ELSE 'CS'
END,
status = 'active',
year_level = COALESCE(year_level, FLOOR(1 + RAND() * 4))
WHERE role = 'student';
```

---

## Verify the Fix

### Check in Database
```sql
SELECT 
    program,
    COUNT(*) as count,
    GROUP_CONCAT(name SEPARATOR ', ') as sample_names
FROM users 
WHERE role = 'student'
GROUP BY program;
```

Expected result:
```
+----------+-------+------------------+
| program  | count | sample_names     |
+----------+-------+------------------+
| IT       | 52    | John, Jane, ...  |
| CS       | 52    | Bob, Alice, ...  |
+----------+-------+------------------+
```

### Check in Application
1. Refresh your browser
2. Go to Scheduling page
3. Click "Enroll Students" on any class
4. You should now see students in the dropdown!

---

## Troubleshooting

### Still No Students?

1. **Check the course code format:**
   - IT courses must start with "IT " (e.g., "IT 101")
   - CS courses must start with "CS " (e.g., "CS 201")

2. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for debug info showing student counts

4. **Verify database:**
   ```sql
   SELECT id, name, role, program, status 
   FROM users 
   WHERE role = 'student' 
   LIMIT 10;
   ```

### Students Still Not Showing for Specific Course?

**For IT Course (e.g., "IT 101"):**
```sql
-- Check IT students
SELECT COUNT(*) as it_students 
FROM users 
WHERE role = 'student' 
AND program = 'IT' 
AND status = 'active';
```

**For CS Course (e.g., "CS 201"):**
```sql
-- Check CS students
SELECT COUNT(*) as cs_students 
FROM users 
WHERE role = 'student' 
AND program = 'CS' 
AND status = 'active';
```

---

## What Each Field Means

### `program` Field
- **IT** = Information Technology students
- **CS** = Computer Science students
- **NULL or empty** = Not assigned (causes the issue)

### `year_level` Field
- **1** = First year
- **2** = Second year
- **3** = Third year
- **4** = Fourth year

### `status` Field
- **active** = Can enroll in classes
- **inactive** = Cannot enroll
- **suspended** = Cannot enroll

### `student_id` Field
- Format: `IT-2026-001`, `CS-2026-002`
- Used for identification

---

## After Running the Fix

You should see:
- ✅ IT students appear when enrolling in IT courses
- ✅ CS students appear when enrolling in CS courses
- ✅ IT students DON'T appear for CS courses (and vice versa)
- ✅ Console shows: `Students with this program: 52` (or similar)

---

## Need More Help?

Check these files:
- `STUDENT_ENROLLMENT_TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `PROGRAM_BASED_ENROLLMENT.md` - How the system works
- `SCHEDULING_FIXES_SUMMARY.md` - All recent fixes

Or check the Laravel logs:
```bash
cd c:\xampp\htdocs\repository\student-data-profiling-memsilogko\server
tail -f storage/logs/laravel.log
```

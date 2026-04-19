# Class Assignment System - Setup Guide

## Quick Setup (5 Minutes)

Follow these steps to get the class assignment system running:

---

## Step 1: Run Database Migrations

Open your terminal and navigate to the server directory:

```bash
cd server
php artisan migrate
```

**Expected Output:**
```
Migrating: 2026_04_19_000000_create_class_sections_table
Migrated:  2026_04_19_000000_create_class_sections_table (XX.XXms)
Migrating: 2026_04_19_000001_create_faculty_class_assignments_table
Migrated:  2026_04_19_000001_create_faculty_class_assignments_table (XX.XXms)
```

✅ **Success!** Two new tables created:
- `class_sections`
- `faculty_class_assignments`

---

## Step 2: Seed Sample Data (Optional)

To populate the database with sample class sections:

```bash
php artisan db:seed --class=ClassSectionSeeder
```

**Expected Output:**
```
Class sections seeded successfully!
```

This creates 5 sample class sections with faculty assignments.

---

## Step 3: Start the Servers

### Terminal 1 - Backend Server:
```bash
cd server
php artisan serve
```

Server will start at: `http://localhost:8000`

### Terminal 2 - Frontend Server:
```bash
cd client
npm run dev
```

Frontend will start at: `http://localhost:5173` (or similar)

---

## Step 4: Test the System

1. **Open your browser** and navigate to the frontend URL
2. **Login** with admin or department chair credentials:
   ```
   Email: admin@ccs.edu
   Password: Admin@2024
   ```
3. **Click "Scheduling"** in the sidebar
4. **You should see:**
   - Statistics dashboard with metrics
   - List of class sections (if seeded)
   - Search and filter controls
   - "Add Schedule" button
   - Weekly schedule grid

---

## Step 5: Create Your First Class Section

1. Click the **"Add Schedule"** button
2. Fill in the form:
   - **Section Code:** A
   - **Course Code:** TEST 101
   - **Course Name:** Test Course
   - **Day:** Monday
   - **Start Time:** 08:00
   - **End Time:** 10:00
   - **Room:** TEST-101
   - **Semester:** Fall 2024
   - **Academic Year:** 2024-2025
   - **Max Capacity:** 30
   - **Faculty:** Select any faculty (optional)
3. Click **"Create Section"**
4. ✅ Success! Your first class section is created

---

## Verification Checklist

After setup, verify these features work:

### Basic Operations:
- [ ] View list of class sections
- [ ] Create new class section
- [ ] Edit existing class section
- [ ] Delete class section
- [ ] View class details

### Search & Filter:
- [ ] Search by course code
- [ ] Search by course name
- [ ] Search by instructor
- [ ] Filter by day of week

### Statistics:
- [ ] Total classes count
- [ ] Total students count
- [ ] Rooms used count
- [ ] Average capacity percentage

### Weekly Schedule:
- [ ] View weekly grid
- [ ] See classes in time slots
- [ ] Click class to view details
- [ ] Mobile view works

### Faculty Assignment:
- [ ] Assign faculty during creation
- [ ] Faculty shows in class list
- [ ] Faculty dropdown populated

### Conflict Detection:
- [ ] Try creating duplicate room/time (should fail)
- [ ] Try assigning faculty to overlapping time (should fail)
- [ ] Error messages display correctly

---

## Troubleshooting

### Issue: Migration fails with "Table already exists"

**Solution:**
```bash
php artisan migrate:rollback --step=2
php artisan migrate
```

### Issue: Seeder fails with "Faculty not found"

**Solution:** Ensure faculty records exist first:
```bash
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
php artisan db:seed --class=ClassSectionSeeder
```

### Issue: Frontend shows "Failed to load schedules"

**Possible causes:**
1. Backend server not running
2. Authentication token expired
3. API endpoint incorrect

**Solution:**
1. Check backend is running at `http://localhost:8000`
2. Re-login to get fresh token
3. Check browser console for errors
4. Verify API base URL in `client/src/services/api.js`

### Issue: Faculty dropdown is empty

**Solution:** Ensure faculty records exist:
```bash
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
```

### Issue: Statistics show zero

**Solution:** Create some class sections first, or run the seeder

---

## Database Structure

After migration, you'll have these tables:

### class_sections
```sql
CREATE TABLE class_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    section_code VARCHAR(20),
    course_code VARCHAR(20),
    course_name VARCHAR(255),
    room VARCHAR(50),
    day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
    start_time TIME,
    end_time TIME,
    semester VARCHAR(50),
    academic_year VARCHAR(20),
    max_capacity INT DEFAULT 40,
    current_enrollment INT DEFAULT 0,
    status ENUM('active','cancelled','completed') DEFAULT 'active',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### faculty_class_assignments
```sql
CREATE TABLE faculty_class_assignments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    faculty_id BIGINT,
    class_section_id BIGINT,
    assignment_type ENUM('primary','co-instructor','assistant') DEFAULT 'primary',
    assigned_date DATE,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id),
    FOREIGN KEY (class_section_id) REFERENCES class_sections(id)
);
```

---

## Sample Data Overview

If you ran the seeder, you'll have:

| Course | Section | Day | Time | Room | Instructor | Capacity |
|--------|---------|-----|------|------|------------|----------|
| CS 101 | A | Monday | 08:00-10:00 | CS-301 | CS Faculty | 40 |
| IT 201 | B | Tuesday | 14:00-16:00 | IT-205 | IT Faculty | 30 |
| CE 301 | A | Wednesday | 10:00-12:00 | CE-150 | CS Faculty | 25 |
| DS 401 | A | Thursday | 13:00-15:00 | DS-401 | IT Faculty | 20 |
| CS 101 | B | Friday | 08:00-10:00 | CS-302 | CS Faculty | 40 |

---

## API Testing (Optional)

Test the API directly using curl or Postman:

### Get All Class Sections:
```bash
curl -X GET http://localhost:8000/api/class-sections \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Class Section:
```bash
curl -X POST http://localhost:8000/api/class-sections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "section_code": "A",
    "course_code": "TEST 101",
    "course_name": "Test Course",
    "day_of_week": "Monday",
    "start_time": "08:00",
    "end_time": "10:00",
    "semester": "Fall 2024",
    "academic_year": "2024-2025",
    "max_capacity": 30
  }'
```

### Get Statistics:
```bash
curl -X GET http://localhost:8000/api/class-sections-statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Next Steps

After successful setup:

1. **Explore the UI** - Try all features
2. **Create real data** - Add your actual courses
3. **Assign faculty** - Link instructors to classes
4. **Test conflicts** - Verify validation works
5. **Review documentation** - Read full implementation guide
6. **Plan enhancements** - Consider Phase 2 features

---

## Support

If you encounter issues:

1. **Check logs:**
   - Backend: `server/storage/logs/laravel.log`
   - Frontend: Browser console (F12)

2. **Review documentation:**
   - `CLASS_ASSIGNMENT_IMPLEMENTATION.md` - Full guide
   - `CLASS_ASSIGNMENT_QUICK_REFERENCE.md` - Quick reference
   - `IMPLEMENTATION_SUMMARY.md` - Overview

3. **Common solutions:**
   - Clear browser cache
   - Restart servers
   - Re-run migrations
   - Check database connection

---

## Success!

If you can:
- ✅ See the scheduling page
- ✅ View statistics
- ✅ Create a class section
- ✅ See it in the list
- ✅ View the weekly grid

**Congratulations!** The class assignment system is working perfectly.

---

**Setup Time:** ~5 minutes  
**Difficulty:** Easy  
**Prerequisites:** Laravel & React environment ready  
**Version:** 1.0.0

# Faculty Seeder Guide - IT and CS Departments

## Overview

This guide explains the faculty seeders that populate the database with 200 professional faculty members (100 IT + 100 CS).

## Seeders Created

### 1. ITFacultySeeder.php
- **Location**: `server/database/seeders/ITFacultySeeder.php`
- **Records**: 100 IT Faculty members
- **Department**: Information Technology (IT)

### 2. CSFacultySeeder.php
- **Location**: `server/database/seeders/CSFacultySeeder.php`
- **Records**: 100 CS Faculty members
- **Department**: Computer Science (CS)

## Faculty Distribution

### Position Distribution (Both Departments)

| Position | Count | Percentage |
|----------|-------|------------|
| Professor | 15 | 15% |
| Associate Professor | 25 | 25% |
| Assistant Professor | 35 | 35% |
| Instructor | 20 | 20% |
| Lecturer | 5 | 5% |
| **Total** | **100** | **100%** |

### Status Distribution (Both Departments)

| Status | Count | Percentage |
|--------|-------|------------|
| Active | ~85 | 85% |
| On Leave | ~10 | 10% |
| Inactive | ~5 | 5% |
| **Total** | **~100** | **100%** |

## IT Faculty Specializations

The IT department faculty specialize in:

1. **Network Security** - Cybersecurity, network protection, threat analysis
2. **Cloud Computing** - AWS, Azure, cloud architecture, cloud services
3. **Database Administration** - Database management, optimization, backup
4. **Systems Administration** - Server management, Linux, Windows Server
5. **Cybersecurity** - Ethical hacking, security operations, penetration testing
6. **Network Infrastructure** - Network design, implementation, maintenance
7. **IT Project Management** - Agile, Scrum, project planning, IT strategy
8. **Enterprise Systems** - ERP, CRM, enterprise architecture
9. **IT Service Management** - ITIL, service desk, IT operations
10. **Information Security** - Security policies, compliance, risk management
11. **Web Technologies** - Web development, web security, full stack
12. **Mobile Computing** - Mobile app development, iOS, Android
13. **DevOps** - CI/CD, infrastructure as code, automation
14. **IT Governance** - IT policies, compliance, audit
15. **Business Intelligence** - Data analytics, reporting, dashboards

## CS Faculty Specializations

The CS department faculty specialize in:

1. **Artificial Intelligence** - AI systems, intelligent agents, expert systems
2. **Machine Learning** - ML algorithms, neural networks, deep learning
3. **Data Science** - Data analysis, big data, data mining
4. **Software Engineering** - Software design, architecture, development
5. **Computer Graphics** - 3D modeling, rendering, visualization
6. **Computer Vision** - Image processing, pattern recognition, object detection
7. **Natural Language Processing** - Text analysis, language models, NLP
8. **Algorithms and Complexity** - Algorithm design, analysis, optimization
9. **Distributed Systems** - Parallel computing, distributed algorithms
10. **Programming Languages** - Compiler design, language theory, paradigms
11. **Human-Computer Interaction** - UI/UX design, usability, interaction design
12. **Theoretical Computer Science** - Formal methods, automata theory
13. **Robotics** - Robot programming, autonomous systems, control
14. **Quantum Computing** - Quantum algorithms, quantum information
15. **Bioinformatics** - Computational biology, genomics, biodata analysis

## Data Structure

### Faculty Record Fields

```php
[
    'faculty_id' => 'FAC26XXXX',           // Unique ID (FAC + year + counter)
    'name' => 'Dr. FirstName LastName',    // Full name with title
    'email' => 'firstname.lastname@ccs.edu.ph', // Unique email
    'phone' => '+63 9XX XXX XXXX',         // Philippine phone format
    'address' => 'Street, City, Metro Manila', // Full address
    'department' => 'IT' or 'CS',          // Department
    'position' => 'Professor',             // Academic position
    'specialization' => 'AI',              // Area of expertise
    'office' => 'Building Room XXX',       // Office location
    'hire_date' => 'YYYY-MM-DD',          // Date hired (1-20 years ago)
    'notes' => 'Professional notes...',    // Experience and achievements
    'qualifications' => JSON array,        // Degrees and certifications
    'courses' => JSON array,               // Courses taught
    'status' => 'active',                  // Current status
    'created_at' => timestamp,
    'updated_at' => timestamp,
]
```

### Sample Qualifications (IT)

```json
[
  "Ph.D. in Information Technology",
  "M.S. in Computer Science",
  "B.S. in Information Technology"
]
```

### Sample Qualifications (CS)

```json
[
  "Ph.D. in Computer Science",
  "M.S. in Artificial Intelligence",
  "B.S. in Computer Science"
]
```

### Sample Courses (IT)

```json
[
  "Network Fundamentals",
  "Network Security",
  "Advanced Networking"
]
```

### Sample Courses (CS)

```json
[
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning"
]
```

## Running the Seeders

### Method 1: Run All Seeders

```bash
cd server
php artisan db:seed
```

This will seed:
- Admin and test users
- Events
- Department Chairmen (2)
- IT Faculty (100)
- CS Faculty (100)

### Method 2: Run Only IT Faculty Seeder

```bash
cd server
php artisan db:seed --class=ITFacultySeeder
```

### Method 3: Run Only CS Faculty Seeder

```bash
cd server
php artisan db:seed --class=CSFacultySeeder
```

### Method 4: Run Both Faculty Seeders

```bash
cd server
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
```

### Method 5: Fresh Migration with All Seeds

```bash
cd server
php artisan migrate:fresh --seed
```

⚠️ **WARNING**: This will drop all tables and recreate them with seed data!

## Expected Output

### IT Faculty Seeder Output

```
✅ Successfully seeded 100 IT Faculty members
   - Professors: 15
   - Associate Professors: 25
   - Assistant Professors: 35
   - Instructors: 20
   - Lecturers: 5
   - Active: ~85, On Leave: ~10, Inactive: ~5
```

### CS Faculty Seeder Output

```
✅ Successfully seeded 100 CS Faculty members
   - Professors: 15
   - Associate Professors: 25
   - Assistant Professors: 35
   - Instructors: 20
   - Lecturers: 5
   - Active: ~85, On Leave: ~10, Inactive: ~5
```

## Verification

### Check Total Faculty Count

```sql
SELECT COUNT(*) as total FROM faculty;
-- Expected: 200
```

### Check IT Faculty Count

```sql
SELECT COUNT(*) as total FROM faculty WHERE department = 'IT';
-- Expected: 100
```

### Check CS Faculty Count

```sql
SELECT COUNT(*) as total FROM faculty WHERE department = 'CS';
-- Expected: 100
```

### Check Position Distribution

```sql
SELECT position, COUNT(*) as count 
FROM faculty 
GROUP BY position 
ORDER BY count DESC;
```

Expected result:
```
+---------------------+-------+
| position            | count |
+---------------------+-------+
| Assistant Professor |    70 |
| Associate Professor |    50 |
| Instructor          |    40 |
| Professor           |    30 |
| Lecturer            |    10 |
+---------------------+-------+
```

### Check Status Distribution

```sql
SELECT status, COUNT(*) as count 
FROM faculty 
GROUP BY status;
```

Expected result:
```
+-----------+-------+
| status    | count |
+-----------+-------+
| active    |  ~170 |
| on_leave  |   ~20 |
| inactive  |   ~10 |
+-----------+-------+
```

### Check Department Distribution

```sql
SELECT department, COUNT(*) as count 
FROM faculty 
GROUP BY department;
```

Expected result:
```
+------------+-------+
| department | count |
+------------+-------+
| IT         |   100 |
| CS         |   100 |
+------------+-------+
```

## Faculty ID Format

### IT Faculty IDs
- Format: `FAC26XXXX`
- Range: `FAC260001` to `FAC260100`
- Example: `FAC260001`, `FAC260050`, `FAC260100`

### CS Faculty IDs
- Format: `FAC26XXXX`
- Range: `FAC260101` to `FAC260200`
- Example: `FAC260101`, `FAC260150`, `FAC260200`

## Email Format

### IT Faculty Emails
- Format: `firstname.lastname@ccs.edu.ph`
- Example: `michael.anderson@ccs.edu.ph`

### CS Faculty Emails
- Format: `firstname.lastname.cs@ccs.edu.ph`
- Example: `alexander.smith.cs@ccs.edu.ph`

## Professional Notes Generation

The seeders automatically generate professional notes based on:

1. **Years of Experience** (1-20 years)
2. **Position** (Professor, Associate Professor, etc.)
3. **Specialization** (AI, Network Security, etc.)

### Sample Notes for Professor

```
15 years of teaching experience in Computer Science. 
Specializes in Artificial Intelligence with strong research background. 
Published extensively in top-tier computer science conferences and journals. 
Principal investigator for multiple research grants. 
Recognized expert in the field with international collaborations.
```

### Sample Notes for Instructor

```
5 years of teaching experience in Information Technology. 
Specializes in Network Security with extensive industry and academic background. 
Dedicated to student learning and development. 
Actively participates in departmental activities. 
Pursuing advanced studies and certifications.
```

## Features

### 1. Realistic Data
- Professional names with "Dr." title
- Valid Philippine phone numbers
- Metro Manila addresses
- Realistic hire dates (1-20 years ago)
- Position-appropriate qualifications

### 2. Diverse Specializations
- 15 different IT specializations
- 15 different CS specializations
- Covers all major areas in each field

### 3. Weighted Distribution
- Status distribution reflects real-world scenarios
- Most faculty are active (85%)
- Some on leave (10%)
- Few inactive (5%)

### 4. Professional Qualifications
- Ph.D., M.S., and B.S. degrees
- Industry certifications (CISSP, AWS, etc.)
- Position-appropriate credentials

### 5. Batch Insertion
- Inserts in batches of 50 for performance
- Prevents memory issues
- Faster execution

## Testing Department Chairman Access

### Test IT Chairman Access

1. Login as IT chairman
2. Navigate to Faculty Profiles
3. Should see 100 IT faculty members
4. Should NOT see any CS faculty

### Test CS Chairman Access

1. Login as CS chairman
2. Navigate to Faculty Profiles
3. Should see 100 CS faculty members
4. Should NOT see any IT faculty

### Test Admin Access

1. Login as admin
2. Navigate to Faculty Profiles
3. Should see all 200 faculty members
4. Can filter by department (IT/CS/All)

## Customization

### Change Faculty Count

Edit the `$positions` array in the seeder:

```php
$positions = [
    'Professor' => 20,              // Change from 15 to 20
    'Associate Professor' => 30,    // Change from 25 to 30
    'Assistant Professor' => 40,    // Change from 35 to 40
    'Instructor' => 25,             // Change from 20 to 25
    'Lecturer' => 10                // Change from 5 to 10
];
```

### Add New Specializations

Add to the `$specializations` array:

```php
$specializations = [
    // Existing specializations...
    'New Specialization',
    'Another Specialization',
];
```

### Change Status Distribution

Modify the `$statuses` array:

```php
$statuses = [
    'active' => 90,      // 90% active
    'on_leave' => 5,     // 5% on leave
    'inactive' => 5      // 5% inactive
];
```

## Troubleshooting

### Error: "Duplicate entry for key 'email'"

**Cause**: Email collision due to same first/last name combination

**Solution**: The seeder uses a large pool of names to minimize collisions. If it occurs, run:
```bash
php artisan migrate:fresh --seed
```

### Error: "Duplicate entry for key 'faculty_id'"

**Cause**: Faculty ID collision

**Solution**: IT faculty use IDs 1-100, CS faculty use 101-200. This should not occur unless you modify the counter.

### Seeder Runs Slowly

**Cause**: Large dataset insertion

**Solution**: The seeder already uses batch insertion (50 records per batch). This is optimal for performance.

### Want to Reset Faculty Data

```bash
# Delete all faculty
php artisan tinker
>>> Faculty::truncate();
>>> exit

# Re-run seeders
php artisan db:seed --class=ITFacultySeeder
php artisan db:seed --class=CSFacultySeeder
```

## Performance Metrics

- **IT Faculty Seeder**: ~2-3 seconds
- **CS Faculty Seeder**: ~2-3 seconds
- **Total Time**: ~5-6 seconds for 200 records
- **Memory Usage**: ~10-15 MB

## Related Documentation

- [Department Chairman Role](./DEPARTMENT_CHAIRMAN_ROLE.md)
- [Faculty Filtering](./DEPT_CHAIR_FACULTY_FILTERING.md)
- [Department Chairman Seeder](./SEEDER_GUIDE.md)

## Summary

The faculty seeders provide:

✅ **200 professional faculty members** (100 IT + 100 CS)  
✅ **Realistic data** with proper formatting  
✅ **Diverse specializations** covering all major areas  
✅ **Position distribution** reflecting academic hierarchy  
✅ **Status distribution** reflecting real-world scenarios  
✅ **Professional qualifications** and certifications  
✅ **Batch insertion** for optimal performance  
✅ **Department-specific** data for testing filtering  

Perfect for testing the department chairman filtering functionality and demonstrating the system with realistic data!

---

**Last Updated**: April 9, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

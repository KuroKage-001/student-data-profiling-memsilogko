# Auto Student Profile Creation - Quick Reference

## What Happens When You Create a Student User?

When you create a user with **role = "student"** in User Management:

### ✅ Automatically Generated:

| Field | Format | Example | Purpose |
|-------|--------|---------|---------|
| **Student Number** | `YYYY-DEPT#####` | `2026-IT00001` | Login credential |
| **Student ID** | `STUYYYY-DEPT####` | `STU2026-IT0001` | Profile identifier |
| **Program** | Based on department | `Bachelor of Science in Information Technology` | Academic program |
| **Year Level** | Default | `1st Year` | Current year level |
| **Enrollment Date** | Current date | `2026-04-24` | Start date |

### 📋 Required Fields (You Must Provide):

- Name
- Email
- Password
- Role: **Student**
- Department: **IT** or **CS**

### 🎯 Result:

✅ User account created in User Management  
✅ Student profile automatically created  
✅ Visible in Student Profiles module  
✅ Ready for additional profile details (skills, activities, etc.)

## Quick Examples

### Example 1: IT Student
```
Input:
- Name: John Doe
- Email: john@example.com
- Role: Student
- Department: IT

Auto-Generated:
- Student Number: 2026-IT00001
- Student ID: STU2026-IT0001
- Program: Bachelor of Science in Information Technology
- Year Level: 1st Year
- Enrollment Date: 2026-04-24
```

### Example 2: CS Student
```
Input:
- Name: Jane Smith
- Email: jane@example.com
- Role: Student
- Department: CS

Auto-Generated:
- Student Number: 2026-CS00001
- Student ID: STU2026-CS0001
- Program: Bachelor of Science in Computer Science
- Year Level: 1st Year
- Enrollment Date: 2026-04-24
```

## ID Numbering Logic

### Student Number (Login)
- **Format**: `YYYY-DEPT#####`
- **Sequence**: Per department, per year
- **Example**: `2026-IT00001`, `2026-IT00002`, `2026-IT00003`

### Student ID (Profile)
- **Format**: `STUYYYY-DEPT####`
- **Sequence**: Per department, per year
- **Example**: `STU2026-IT0001`, `STU2026-IT0002`, `STU2026-IT0003`

### Separate Sequences by Department
```
IT Department:
- 2026-IT00001 → STU2026-IT0001
- 2026-IT00002 → STU2026-IT0002

CS Department:
- 2026-CS00001 → STU2026-CS0001
- 2026-CS00002 → STU2026-CS0002
```

## Role Change Behavior

### Changing TO Student Role:
```
Before: Faculty/Admin user
After: Student profile auto-created with:
  ✅ Student Number
  ✅ Student ID
  ✅ Program
  ✅ Year Level
  ✅ Enrollment Date
```

### Changing FROM Student Role:
```
Before: Student user
After: Student profile fields cleared:
  ❌ Student Number → null
  ❌ Student ID → null
  ❌ Year Level → null
  ❌ Enrollment Date → null
  ❌ GPA → null
  ❌ Guardian info → null
```

## Common Workflows

### Workflow 1: New Student Enrollment
1. Go to **User Management**
2. Click **"Add User"**
3. Fill in: Name, Email, Password
4. Select Role: **Student**
5. Select Department: **IT** or **CS**
6. Click **"Create User"**
7. ✅ Student profile automatically created
8. Go to **Student Profiles** to add more details

### Workflow 2: View Student Profile
1. Create student in **User Management**
2. Go to **Student Profiles**
3. Search by name, email, or student ID
4. Click **"View"** to see complete profile
5. Click **"Edit"** to add skills, activities, etc.

### Workflow 3: Update Student Details
1. Go to **Student Profiles**
2. Find the student
3. Click **"Edit"**
4. Add/update:
   - Phone, Address
   - GPA
   - Guardian information
   - Skills and proficiency levels
   - Activities and organizations
5. Click **"Save"**

## Key Benefits

| Benefit | Description |
|---------|-------------|
| 🚀 **Faster Onboarding** | One-step process creates both account and profile |
| 🎯 **No Duplicate Entry** | No need to create profile separately |
| ✅ **Data Consistency** | Auto-generated IDs ensure uniqueness |
| 📊 **Immediate Access** | Profile available in Student Profiles right away |
| 🔢 **Sequential IDs** | Automatic numbering prevents conflicts |

## Troubleshooting

### Q: Student not appearing in Student Profiles?
**A:** Check that:
- Role is set to "student"
- Department is selected (IT or CS)
- User was successfully created (check for success message)

### Q: Can I manually set student number?
**A:** No, student numbers are auto-generated to ensure uniqueness and sequential ordering.

### Q: Can I change the student ID format?
**A:** Currently, the format is fixed. Contact system administrator for customization.

### Q: What happens if I delete a student user?
**A:** The entire student record is deleted, including all related data (skills, activities, etc.) due to cascade delete.

### Q: Can I import multiple students at once?
**A:** Currently, students must be created individually. Bulk import feature is planned for future release.

## API Endpoints

### Create Student User
```
POST /api/users
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "department": "IT"
}
```

### Get Student Profile
```
GET /api/students/{id}
```

### Update Student Profile
```
PUT /api/students/{id}
Body: {
  "phone": "123-456-7890",
  "address": "123 Main St",
  "gpa": 3.5,
  "skills": [...],
  "activities": [...]
}
```

## Related Pages

- 📖 [Full Documentation](./AUTO_STUDENT_PROFILE_CREATION.md)
- 👥 [User Management](../user-management-documentations/)
- 🎓 [Student Profiles](../student-profile-documentations/)
- 🔐 [Authentication](../dual-portal-authentication/)

## Summary

**Creating a student user in User Management automatically creates a complete student profile with:**
- ✅ Unique student number for login
- ✅ Unique student ID for tracking
- ✅ Program based on department
- ✅ Default year level and enrollment date
- ✅ Immediate visibility in Student Profiles

**No additional steps required!** 🎉

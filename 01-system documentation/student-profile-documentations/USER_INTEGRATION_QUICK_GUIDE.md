# User Integration Quick Guide

## Quick Overview
When creating a new student profile, you now select an existing user account instead of creating a new one.

## Step-by-Step: Creating a Student Profile

### 1. Prerequisites
- User account must exist with "student" role
- User must NOT already have a student profile

### 2. Create Student Profile
1. Go to **Student Profiles** page
2. Click **"Add Student"** button
3. **Select User Account** from dropdown
   - Search by name or email
   - Click to select
   - Name and email auto-fill (read-only)
4. Fill in **Student Information**:
   - Student ID (auto-generated)
   - Program (required)
   - Year Level (required)
   - Enrollment Date (required)
   - Other optional fields
5. Click **"Create Student"**

## Key Changes

### What's New
✅ User selection dropdown with search
✅ Auto-fill name and email from selected user
✅ Prevents duplicate student profiles
✅ Better data consistency

### What's Different
❌ No longer creates new user accounts
❌ No default passwords
❌ Can't manually enter name/email for new students

## Form Fields

### Auto-Filled (Read-Only)
- Name
- Email

### Required Fields
- User Account (dropdown)
- Student ID
- Program
- Year Level
- Enrollment Date

### Optional Fields
- Phone
- Address
- GPA
- Graduation Date
- Guardian Information
- Skills
- Activities
- Notes

## Common Scenarios

### Scenario 1: Create User First
```
1. User Management → Add User
   - Name: John Doe
   - Email: john@example.com
   - Role: Student
   
2. Student Profiles → Add Student
   - Select: John Doe
   - Fill student info
   - Submit
```

### Scenario 2: User Already Has Profile
```
Error: "This user already has a student profile"
Solution: Edit existing profile instead
```

### Scenario 3: User Not a Student
```
Error: "Selected user must have student role"
Solution: Change user role to "student" first
```

## Validation Rules

| Field | Rule |
|-------|------|
| User Account | Required, must be student role |
| Student ID | Required, unique |
| Program | Required |
| Year Level | Required |
| Enrollment Date | Required |
| Phone | Optional, 11 digits, starts with 09 |
| GPA | Optional, 0.0-4.0, max 2 decimals |
| Graduation Date | Optional, must be after enrollment |

## Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Please select a user account" | No user selected | Select a user from dropdown |
| "This user already has a student profile" | User has existing profile | Edit existing profile |
| "Selected user must have student role" | Wrong user role | Change user role to student |
| "Student ID already exists" | Duplicate ID | Use different student ID |

## Tips

💡 **Search Tip:** Type name or email to quickly find users

💡 **Bulk Setup:** Create multiple user accounts first, then add student profiles

💡 **Data Entry:** Focus on student-specific fields; name/email are auto-filled

💡 **Editing:** When editing, user selection is not shown (already linked)

## API Reference

### Create Student Profile
```
POST /api/students

Body:
{
  "user_id": 123,
  "student_id": "STU2024001",
  "program": "Computer Science",
  "year_level": "1st Year",
  "enrollment_date": "2024-08-15",
  ...
}
```

### Get Users (Student Role)
```
GET /api/users?role=student

Response:
[
  {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  },
  ...
]
```

## Troubleshooting

### Dropdown is Empty
- Check if any users have "student" role
- Create user accounts first in User Management

### Can't Select User
- Verify user has "student" role
- Check if user already has a student profile

### Auto-Fill Not Working
- Ensure user is properly selected
- Check browser console for errors

### Submit Button Disabled
- Select a user account
- Fill all required fields
- Check for validation errors

## Related Documentation
- [Full Implementation Guide](./USER_INTEGRATION_IMPLEMENTATION.md)
- [Student Profile Documentation](./README.md)
- [User Management Documentation](../user-management-documentations/README.md)

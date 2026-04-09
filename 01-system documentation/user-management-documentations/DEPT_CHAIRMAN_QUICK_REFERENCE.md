# Department Chairman - Quick Reference Guide

## What is a Department Chairman?

A Department Chairman is a user role with limited administrative access to manage faculty and scheduling for their specific department (IT or CS).

## Quick Facts

- **Role Name**: Department Chairman (dept_chair)
- **Departments**: IT (Information Technology) or CS (Computer Science)
- **Access Level**: Limited Admin
- **Modules Accessible**: Dashboard, Faculty Profiles, Scheduling

## Creating a Department Chairman

### Step-by-Step

1. **Login as Admin**
2. **Navigate to User Management**
3. **Click "Add User" button**
4. **Fill in the form:**
   - Full Name: Enter chairman's name
   - Email: Enter valid email address
   - Password: Create secure password
   - Confirm Password: Re-enter password
   - **Role: Select "Department Chairman"**
   - **Department: Select "IT" or "CS"** (appears after selecting role)
   - Status: Active (default)
5. **Click "Create User"**

### Important Notes

- Department field is **required** for Department Chairman role
- Only **one chairman per department** is recommended
- Chairman cannot access User Management or Student modules

## Editing a Department Chairman

### Changing Department

1. Click "Edit" on the chairman user
2. Change the Department dropdown
3. Click "Update User"

### Changing Role

**From Dept Chairman to Another Role:**
- Department field will be automatically cleared
- User will lose access to chairman-specific modules

**From Another Role to Dept Chairman:**
- Department field will appear and become required
- Must select IT or CS before saving

## Access Permissions

### ✅ Can Access

| Module | Description |
|--------|-------------|
| **Dashboard** | View system statistics and overview |
| **Faculty Profiles** | Manage faculty members (ideally filtered by department) |
| **Scheduling** | Manage class schedules and timetables |

### ❌ Cannot Access

| Module | Reason |
|--------|--------|
| User Management | Admin-only feature |
| Students | Admin-only feature |
| Events | Admin-only feature |
| Research | Admin-only feature |
| Instructions | Admin-only feature |

## Department Chairman Login Experience

### What They See

1. **Sidebar Menu** (3 items only):
   - Dashboard
   - Faculty
   - Scheduling

2. **Header**:
   - Their name and role
   - Logout option

3. **Dashboard**:
   - System-wide statistics
   - Quick access to Faculty and Scheduling

### What They Don't See

- User Management module
- Student Profiles module
- Events module
- Research module
- Instructions module

## Common Tasks

### Task 1: View Faculty Members

1. Click "Faculty" in sidebar
2. View all faculty members
3. Use search and filters
4. Click on faculty to view details

### Task 2: Manage Schedules

1. Click "Scheduling" in sidebar
2. View weekly schedule grid
3. Add/edit class schedules
4. Assign rooms and time slots

### Task 3: Generate Reports

1. Navigate to Faculty module
2. Click "Export" to download faculty list
3. Click on individual faculty to generate PDF report

## Troubleshooting

### Problem: Cannot see User Management

**Solution**: This is expected. Department Chairmen don't have access to User Management. Contact an Administrator if you need user-related changes.

### Problem: Cannot see Students module

**Solution**: This is expected. Department Chairmen focus on faculty and scheduling. Contact an Administrator for student-related tasks.

### Problem: Department field not showing

**Solution**: Make sure "Department Chairman" is selected as the role. The department dropdown only appears for this role.

### Problem: Cannot save without selecting department

**Solution**: Department is required for Department Chairman role. Select either IT or CS before saving.

## Best Practices

### For Administrators

1. **Create one chairman per department**
   - IT Department Chairman
   - CS Department Chairman

2. **Use descriptive names**
   - Example: "John Doe - IT Chairman"
   - Example: "Jane Smith - CS Chairman"

3. **Set strong passwords**
   - Minimum 8 characters
   - Mix of letters, numbers, and symbols

4. **Keep accounts active**
   - Set status to "Active" for current chairmen
   - Set to "Inactive" when chairman changes

### For Department Chairmen

1. **Focus on your department**
   - Manage faculty in your department
   - Schedule classes for your department

2. **Regular updates**
   - Keep faculty information current
   - Update schedules each semester

3. **Report issues**
   - Contact administrators for system issues
   - Request access if you need additional modules

## Visual Guide

### User Form - Department Chairman

```
┌─────────────────────────────────────┐
│ Add New User                        │
├─────────────────────────────────────┤
│ Full Name: [John Doe              ] │
│ Email:     [john.doe@example.com  ] │
│ Password:  [••••••••              ] │
│ Confirm:   [••••••••              ] │
│ Role:      [Department Chairman ▼ ] │
│ Department:[IT ▼                  ] │ ← Appears only for Dept Chairman
│                                     │
│ [Cancel]  [Create User]             │
└─────────────────────────────────────┘
```

### Sidebar - Department Chairman View

```
┌─────────────────┐
│ CCS PnC         │
│ Profiling System│
├─────────────────┤
│ 📊 Dashboard    │ ← Accessible
│ 👥 Faculty      │ ← Accessible
│ 🕐 Scheduling   │ ← Accessible
└─────────────────┘
```

### User List - Department Display

```
Desktop View:
┌────────────────────────────────────────────────────┐
│ Name          │ Role              │ Status │ Actions│
├────────────────────────────────────────────────────┤
│ John Doe      │ Dept. Chairman    │ Active │ Edit   │
│ john@email.com│ IT Department     │        │ Delete │
└────────────────────────────────────────────────────┘

Mobile View:
┌─────────────────────────────────┐
│ John Doe                        │
│ john@email.com                  │
│ [Dept. Chairman] [IT] [Active]  │
│ Created: Jan 15, 2026           │
│ [Edit] [Delete]                 │
└─────────────────────────────────┘
```

## API Reference (For Developers)

### Create Department Chairman

```javascript
POST /api/users
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "dept_chair",
  "department": "IT"
}
```

### Update Department Chairman

```javascript
PUT /api/users/{id}
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "dept_chair",
  "department": "CS"  // Changed from IT to CS
}
```

## Statistics

View department chairman statistics:

```javascript
GET /api/users-statistics

Response:
{
  "total_users": 150,
  "dept_chairs": 2,
  "dept_chair_it": 1,
  "dept_chair_cs": 1,
  ...
}
```

## Related Documentation

- [Full Implementation Guide](./DEPARTMENT_CHAIRMAN_ROLE.md)
- [User Management README](./README.md)
- [Installation Guide](./INSTALLATION.md)

## Support

For additional help:
1. Check the full documentation
2. Contact system administrator
3. Review system logs for errors

---

**Last Updated**: April 9, 2026  
**Version**: 1.0.0

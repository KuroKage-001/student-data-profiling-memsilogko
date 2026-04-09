# Role-Specific Fields Quick Reference

## Field Requirements by Role

### Student Role
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Name | ✅ Yes | Text | John Doe |
| Email | ✅ Yes | Email | john.doe@student.edu |
| Password | ✅ Yes (Create) | Password | ******** |
| Department | ✅ Yes | Dropdown | IT or CS |
| Student Number | ✅ Yes | Text | 2026-IT00001 |
| Program | ⚙️ Auto-set | Text | Bachelor of Science in Information Technology |

**Profile Display:**
- Student Number
- Program

---

### Faculty Role
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Name | ✅ Yes | Text | Dr. Jane Smith |
| Email | ✅ Yes | Email | jane.smith@faculty.edu |
| Password | ✅ Yes (Create) | Password | ******** |
| Department | ✅ Yes | Dropdown | IT or CS |
| Position | ✅ Yes | Dropdown | Associate Professor |

**Profile Display:**
- Department (full name)
- Position

**Position Options:**
- Professor
- Associate Professor
- Assistant Professor
- Lecturer
- Instructor
- Adjunct Professor
- Department Head
- Dean

---

### Admin Role
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Name | ✅ Yes | Text | Admin User |
| Email | ✅ Yes | Email | admin@system.edu |
| Password | ✅ Yes (Create) | Password | ******** |
| Department | ✅ Yes | Dropdown | IT or CS |
| Position | ✅ Yes | Dropdown | Department Head |

**Profile Display:**
- Department (full name)
- Position

---

### Department Chairman Role
| Field | Required | Type | Example |
|-------|----------|------|---------|
| Name | ✅ Yes | Text | Dr. Robert Johnson |
| Email | ✅ Yes | Email | robert.j@dept.edu |
| Password | ✅ Yes (Create) | Password | ******** |
| Department | ✅ Yes | Dropdown | IT or CS |
| Position | ✅ Yes | Dropdown | Department Head |

**Profile Display:**
- Department (full name)
- Position

---

## Department Options
- **IT** - Information Technology
- **CS** - Computer Science

## Position Options (Faculty/Admin/Dept Chair)
1. Professor
2. Associate Professor
3. Assistant Professor
4. Lecturer
5. Instructor
6. Adjunct Professor
7. Department Head
8. Dean

## Student Number Format
- Pattern: `YYYY-DDDDD`
- Example: `2026-IT00001`, `2026-CS00050`
- Year: Current year (4 digits)
- Department: IT or CS
- Sequence: 5-digit zero-padded number

## Program Auto-Assignment (Students)
- **IT Department** → Bachelor of Science in Information Technology
- **CS Department** → Bachelor of Science in Computer Science

## Where to Manage

### User Management (Admin Only)
- Create new users with all fields
- Edit existing users
- Change roles and update fields accordingly
- Set status (active/inactive/suspended)

### User Profile Settings (All Users)
- View role-specific information
- Edit name and email only
- All other fields are read-only
- Contact admin to change role-specific fields

## Common Workflows

### Creating a Student Account
1. Open User Management
2. Click "Add User"
3. Fill in name and email
4. Set password
5. Select role: "Student"
6. Select department: IT or CS
7. Enter student number: YYYY-DDDDD format
8. Click "Create User"
9. Program is auto-assigned based on department

### Creating a Faculty Account
1. Open User Management
2. Click "Add User"
3. Fill in name and email
4. Set password
5. Select role: "Faculty"
6. Select department: IT or CS
7. Select position from dropdown
8. Click "Create User"

### Viewing Profile Information
1. Click profile icon
2. Go to "Profile Settings"
3. View role-specific fields:
   - **Student**: See student number and program
   - **Faculty/Admin/Dept Chair**: See department and position
4. Edit name/email if needed
5. Save changes

## Validation Messages

### Department
- "Department is required" - When role requires department but not selected

### Position
- "Position is required" - When role is faculty/admin/dept_chair but position not selected

### Student Number
- "Student number is required" - When role is student but number not provided
- "Invalid format. Use: YYYY-DDDDD" - When format doesn't match pattern

## Tips
- ✅ Department is required for ALL roles
- ✅ Position is required for Faculty, Admin, and Dept Chairman
- ✅ Student Number is required for Students only
- ✅ Program is automatically set based on department for students
- ✅ All profile fields except name/email are read-only for users
- ✅ Only admins can change role-specific fields through User Management

# Student Fields Visual Guide

## User Management - Add New User (Student Role)

### Before (Old Version)
```
┌─────────────────────────────────────┐
│      Add New User                   │
├─────────────────────────────────────┤
│ Full Name:     [____________]       │
│ Email:         [____________]       │
│ Password:      [____________]       │
│ Confirm Pass:  [____________]       │
│ Role:          [Student ▼]          │
│ Status:        [Active ▼]           │
│                                     │
│        [Cancel]  [Create User]      │
└─────────────────────────────────────┘
```

### After (New Version)
```
┌─────────────────────────────────────┐
│      Add New User                   │
├─────────────────────────────────────┤
│ Full Name:     [____________]       │
│ Email:         [____________]       │
│ Password:      [____________]       │
│ Confirm Pass:  [____________]       │
│ Role:          [Student ▼]          │
│                                     │
│ ⭐ NEW FIELDS (when Student role):  │
│ Department:    [IT ▼] (optional)    │
│ Student #:     [2026-IT00001]       │
│                (optional)           │
│                                     │
│        [Cancel]  [Create User]      │
└─────────────────────────────────────┘
```

## Student Profiles - Add Student

### Before (Old Version)
```
┌─────────────────────────────────────┐
│      Add New Student                │
├─────────────────────────────────────┤
│ Select User:   [Choose user ▼]     │
│                                     │
│ Name:          [____________]       │
│ Email:         [____________]       │
│ Student ID:    [____________]       │
│ Program:       [Select ▼]           │
│                                     │
│ (10 program options)                │
└─────────────────────────────────────┘
```

### After (New Version)
```
┌─────────────────────────────────────┐
│      Add New Student                │
├─────────────────────────────────────┤
│ Select User:   [John Doe ▼]        │
│                                     │
│ Name:          [John Doe] 🔒        │
│                ↑ Auto-filled        │
│                                     │
│ Email:         [john@student...] 🔒 │
│                ↑ Auto-filled        │
│                                     │
│ Student ID:    [2026-IT00001] 🔒    │
│                ↑ Auto-filled        │
│                                     │
│ Program:       [BSIT] 🔒            │
│                ↑ Auto-filled (IT)   │
│                                     │
│ (Only 2 program options: BSIT, BSCS)│
└─────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER MANAGEMENT                          │
│                                                             │
│  Create Student User                                        │
│  ├─ Name: "John Doe"                                       │
│  ├─ Email: "john.doe@student.ccs.edu"                     │
│  ├─ Role: "student"                                        │
│  ├─ Department: "IT" ⭐                                     │
│  └─ Student Number: "2026-IT00001" ⭐                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ User selects from dropdown
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   STUDENT PROFILES                          │
│                                                             │
│  Create Student Profile                                     │
│  ├─ Name: "John Doe" ✓ (auto-filled)                      │
│  ├─ Email: "john.doe@student.ccs.edu" ✓ (auto-filled)    │
│  ├─ Student ID: "2026-IT00001" ✓ (auto-filled)           │
│  ├─ Program: "BSIT" ✓ (auto-mapped from IT)              │
│  ├─ Year Level: [Manual entry]                            │
│  ├─ Phone: [Manual entry]                                 │
│  └─ ... other fields                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Department to Program Mapping

```
┌──────────────┐         ┌────────────────────────────────────────┐
│ Department   │         │ Program                                │
├──────────────┤   ───>  ├────────────────────────────────────────┤
│ IT           │         │ Bachelor of Science in                 │
│              │         │ Information Technology                 │
└──────────────┘         └────────────────────────────────────────┘

┌──────────────┐         ┌────────────────────────────────────────┐
│ Department   │         │ Program                                │
├──────────────┤   ───>  ├────────────────────────────────────────┤
│ CS           │         │ Bachelor of Science in                 │
│              │         │ Computer Science                       │
└──────────────┘         └────────────────────────────────────────┘
```

## Student Number Format

```
┌─────────────────────────────────────────────────────────────┐
│                  Student Number Format                      │
│                                                             │
│              2026  -  IT  -  00001                         │
│              ────     ──     ─────                         │
│               │       │        │                           │
│               │       │        └─ Sequential (5 digits)    │
│               │       └────────── Department (IT/CS)       │
│               └────────────────── Year (4 digits)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Examples:
  2026-IT00001  →  First IT student in 2026
  2026-IT00050  →  50th IT student in 2026
  2026-CS00001  →  First CS student in 2026
  2026-CS00050  →  50th CS student in 2026
```

## Field States

### User Management Modal

#### When Role = "Student"
```
┌─────────────────────────────────────┐
│ Role:          [Student ▼]          │
│                                     │
│ Department:    [Select ▼] 👁️        │
│                ↑ VISIBLE            │
│                                     │
│ Student #:     [________] 👁️        │
│                ↑ VISIBLE            │
└─────────────────────────────────────┘
```

#### When Role = "Faculty" or "Admin"
```
┌─────────────────────────────────────┐
│ Role:          [Faculty ▼]          │
│                                     │
│ Department:    [Hidden] 🚫          │
│                                     │
│ Student #:     [Hidden] 🚫          │
└─────────────────────────────────────┘
```

#### When Role = "Dept Chair"
```
┌─────────────────────────────────────┐
│ Role:          [Dept Chair ▼]       │
│                                     │
│ Department:    [Select ▼] 👁️        │
│                ↑ VISIBLE (required) │
│                                     │
│ Student #:     [Hidden] 🚫          │
└─────────────────────────────────────┘
```

### Student Profile Modal

#### User WITH Department & Student Number
```
┌─────────────────────────────────────┐
│ Select User:   [John Doe ▼]        │
│                (IT, 2026-IT00001)   │
│                                     │
│ Name:          [John Doe] 🔒        │
│ Email:         [john@...] 🔒        │
│ Student ID:    [2026-IT00001] 🔒    │
│ Program:       [BSIT] 🔒            │
│                                     │
│ 🔒 = Disabled (auto-filled)         │
└─────────────────────────────────────┘
```

#### User WITHOUT Department & Student Number
```
┌─────────────────────────────────────┐
│ Select User:   [Jane Smith ▼]      │
│                (No dept/number)     │
│                                     │
│ Name:          [Jane Smith] 🔒      │
│ Email:         [jane@...] 🔒        │
│ Student ID:    [STU2600123] ✏️      │
│                ↑ Manual entry       │
│ Program:       [Select ▼] ✏️        │
│                ↑ Manual selection   │
│                                     │
│ ✏️ = Enabled (manual entry)         │
└─────────────────────────────────────┘
```

## Workflow Comparison

### Old Workflow (Before)
```
Step 1: Create User
  └─ Enter: Name, Email, Password, Role

Step 2: Create Profile
  └─ Enter: Name, Email, Student ID, Program
  └─ Select from 10 programs
  └─ All fields manual entry
```

### New Workflow (After)
```
Step 1: Create User
  └─ Enter: Name, Email, Password, Role
  └─ Optional: Department, Student Number

Step 2: Create Profile
  └─ Select: User from dropdown
  └─ Auto-fill: Name, Email, Student ID, Program
  └─ Only 2 programs (BSIT, BSCS)
  └─ Reduced manual entry
```

## Seeder Output

### Student Account Seeder
```
🎓 Seeding 100 Student Role Accounts...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Creating 50 students for Information Technology (IT)...
   ✓ Batch 1: Inserted 50 accounts

   Creating 50 students for Computer Science (CS)...
   ✓ Batch 2: Inserted 50 accounts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successfully seeded 100 student accounts!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Distribution by Program:
   • Information Technology (IT): 50 accounts
   • Computer Science (CS): 50 accounts

🔐 Default Credentials:
   • Email: [firstname].[lastname]@student.ccs.edu
   • Password: Student@2024
   • Student Number: 2026-[DEPT][00001-00100]
     (e.g., 2026-IT00001, 2026-CS00050)
```

## Icon Legend

- 🔒 = Field is disabled (auto-filled)
- ✏️ = Field is enabled (manual entry)
- 👁️ = Field is visible
- 🚫 = Field is hidden
- ⭐ = New feature
- ✓ = Auto-filled successfully
- ▼ = Dropdown menu

---

**Visual Guide Version**: 1.0.0
**Last Updated**: April 9, 2026

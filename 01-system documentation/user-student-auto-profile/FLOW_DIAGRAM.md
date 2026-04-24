# Auto Student Profile Creation - Flow Diagrams

## 🔄 Main Process Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER MANAGEMENT INTERFACE                     │
│                                                                  │
│  Admin fills form:                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Name:        John Doe                                  │    │
│  │ Email:       john@example.com                          │    │
│  │ Password:    ********                                  │    │
│  │ Role:        Student ◄── TRIGGER                       │    │
│  │ Department:  IT                                        │    │
│  │ Status:      Active                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                          [Create User]                          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│              UserManagementController::store()                   │
│                                                                  │
│  1. Validate input data                                         │
│  2. Check if role === 'student'                                 │
│     ↓                                                            │
│     YES → Execute auto-profile creation                         │
│     NO  → Create regular user account                           │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                  AUTO-PROFILE CREATION LOGIC                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 1: Generate Student Number                          │  │
│  │ generateStudentNumber('IT')                              │  │
│  │ → Query: Get last student number for IT dept            │  │
│  │ → Extract: Last number from 2026-IT00001                │  │
│  │ → Increment: 00001 + 1 = 00002                          │  │
│  │ → Format: 2026-IT00002                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 2: Generate Student ID                              │  │
│  │ generateStudentId('IT')                                  │  │
│  │ → Query: Get last student ID for IT dept                │  │
│  │ → Extract: Last number from STU2026-IT0001              │  │
│  │ → Increment: 0001 + 1 = 0002                            │  │
│  │ → Format: STU2026-IT0002                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 3: Set Program                                      │  │
│  │ if (department === 'IT')                                 │  │
│  │   → 'Bachelor of Science in Information Technology'     │  │
│  │ else if (department === 'CS')                            │  │
│  │   → 'Bachelor of Science in Computer Science'           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 4: Set Default Year Level                           │  │
│  │ year_level = '1st Year'                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 5: Set Enrollment Date                              │  │
│  │ enrollment_date = now()->toDateString()                  │  │
│  │ → '2026-04-24'                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE USER RECORD                            │
│                                                                  │
│  User::create([                                                 │
│    'name' => 'John Doe',                                        │
│    'email' => 'john@example.com',                               │
│    'password' => Hash::make('password'),                        │
│    'role' => 'student',                                         │
│    'department' => 'IT',                                        │
│    'status' => 'active',                                        │
│    'student_number' => '2026-IT00002',      ✨ AUTO             │
│    'student_id' => 'STU2026-IT0002',        ✨ AUTO             │
│    'program' => 'Bachelor of Science in IT', ✨ AUTO            │
│    'year_level' => '1st Year',              ✨ AUTO             │
│    'enrollment_date' => '2026-04-24'        ✨ AUTO             │
│  ])                                                             │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SUCCESS RESPONSE                            │
│                                                                  │
│  {                                                              │
│    "success": true,                                             │
│    "message": "User created successfully",                      │
│    "data": {                                                    │
│      "id": 2,                                                   │
│      "name": "John Doe",                                        │
│      "email": "john@example.com",                               │
│      "role": "student",                                         │
│      "department": "IT",                                        │
│      "student_number": "2026-IT00002",                          │
│      "student_id": "STU2026-IT0002",                            │
│      "program": "Bachelor of Science in IT",                    │
│      "year_level": "1st Year",                                  │
│      "enrollment_date": "2026-04-24"                            │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│              STUDENT PROFILE IMMEDIATELY AVAILABLE               │
│                                                                  │
│  Student Profiles Module:                                       │
│  ✅ Student appears in list                                     │
│  ✅ All profile fields populated                                │
│  ✅ Ready for additional details (skills, activities)           │
│  ✅ Can be viewed/edited immediately                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔢 ID Generation Algorithm

### Student Number Generation

```
┌─────────────────────────────────────────────────────────────┐
│         generateStudentNumber($department)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: department = 'IT'                                   │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 1: Build prefix                                 │  │
│  │ year = date('Y')           → '2026'                  │  │
│  │ prefix = year + '-' + dept → '2026-IT'               │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 2: Query last student number                    │  │
│  │ SELECT * FROM users                                  │  │
│  │ WHERE student_number LIKE '2026-IT%'                 │  │
│  │ ORDER BY student_number DESC                         │  │
│  │ LIMIT 1                                              │  │
│  │                                                       │  │
│  │ Result: '2026-IT00001'                               │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 3: Extract and increment                        │  │
│  │ lastNumber = substr('2026-IT00001', -5)              │  │
│  │            = '00001'                                 │  │
│  │ nextNumber = (int)'00001' + 1                        │  │
│  │            = 2                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 4: Format with leading zeros                    │  │
│  │ formatted = str_pad(2, 5, '0', STR_PAD_LEFT)         │  │
│  │           = '00002'                                  │  │
│  │                                                       │  │
│  │ result = '2026-IT' + '00002'                         │  │
│  │        = '2026-IT00002'                              │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  Output: '2026-IT00002'                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Student ID Generation

```
┌─────────────────────────────────────────────────────────────┐
│            generateStudentId($department)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: department = 'IT'                                   │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 1: Build prefix                                 │  │
│  │ year = date('Y')                → '2026'             │  │
│  │ prefix = 'STU' + year + '-' + dept                   │  │
│  │        = 'STU2026-IT'                                │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 2: Query last student ID                        │  │
│  │ SELECT * FROM users                                  │  │
│  │ WHERE student_id LIKE 'STU2026-IT%'                  │  │
│  │ ORDER BY student_id DESC                             │  │
│  │ LIMIT 1                                              │  │
│  │                                                       │  │
│  │ Result: 'STU2026-IT0001'                             │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 3: Extract and increment                        │  │
│  │ lastNumber = substr('STU2026-IT0001', -4)            │  │
│  │            = '0001'                                  │  │
│  │ nextNumber = (int)'0001' + 1                         │  │
│  │            = 2                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Step 4: Format with leading zeros                    │  │
│  │ formatted = str_pad(2, 4, '0', STR_PAD_LEFT)         │  │
│  │           = '0002'                                   │  │
│  │                                                       │  │
│  │ result = 'STU2026-IT' + '0002'                       │  │
│  │        = 'STU2026-IT0002'                            │  │
│  └──────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  Output: 'STU2026-IT0002'                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Role Change Flow

### Changing TO Student Role

```
┌─────────────────────────────────────────────────────────────┐
│  User exists with role = 'faculty'                          │
│  Admin changes role to 'student'                            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  UserManagementController::update()                         │
│                                                              │
│  Check: $request->role === 'student'                        │
│         ↓                                                    │
│         YES                                                  │
│         ↓                                                    │
│  Check: Does user already have student_id?                  │
│         ↓                                                    │
│         NO                                                   │
│         ↓                                                    │
│  Execute auto-profile creation:                             │
│  ├─ Generate student_number                                 │
│  ├─ Generate student_id                                     │
│  ├─ Set program based on department                         │
│  ├─ Set year_level = '1st Year'                             │
│  └─ Set enrollment_date = today                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  User updated with student profile fields                   │
│  ✅ Student profile now available                           │
└─────────────────────────────────────────────────────────────┘
```

### Changing FROM Student Role

```
┌─────────────────────────────────────────────────────────────┐
│  User exists with role = 'student'                          │
│  Admin changes role to 'faculty'                            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  UserManagementController::update()                         │
│                                                              │
│  Check: $oldRole === 'student' && $request->role !== 'student' │
│         ↓                                                    │
│         YES                                                  │
│         ↓                                                    │
│  Clear student profile fields:                              │
│  ├─ student_id = null                                       │
│  ├─ student_number = null                                   │
│  ├─ year_level = null                                       │
│  ├─ enrollment_date = null                                  │
│  ├─ graduation_date = null                                  │
│  ├─ gpa = null                                              │
│  ├─ guardian_name = null                                    │
│  └─ guardian_phone = null                                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  User updated without student profile fields                │
│  ✅ Student profile removed                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │  User Management     │         │  Student Profiles    │     │
│  │  UserManagement.jsx  │         │  StudentProfiles.jsx │     │
│  └──────────────────────┘         └──────────────────────┘     │
│           │                                  │                   │
│           │ POST /api/users                  │ GET /api/students│
│           │ (role=student)                   │                  │
└───────────┼──────────────────────────────────┼──────────────────┘
            │                                  │
            ↓                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  UserManagementController                                │  │
│  │  ├─ store()                                              │  │
│  │  │  ├─ Validate input                                    │  │
│  │  │  ├─ Check role === 'student'                          │  │
│  │  │  ├─ generateStudentNumber()  ✨                       │  │
│  │  │  ├─ generateStudentId()      ✨                       │  │
│  │  │  ├─ Set program              ✨                       │  │
│  │  │  ├─ Set year_level           ✨                       │  │
│  │  │  └─ Set enrollment_date      ✨                       │  │
│  │  └─ update()                                             │  │
│  │     └─ Handle role changes                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  StudentController                                       │  │
│  │  ├─ index()  - List students                             │  │
│  │  ├─ show()   - View student profile                      │  │
│  │  └─ update() - Edit student profile                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  users table                                             │  │
│  │  ├─ id (PK)                                              │  │
│  │  ├─ name                                                 │  │
│  │  ├─ email                                                │  │
│  │  ├─ password                                             │  │
│  │  ├─ role                                                 │  │
│  │  ├─ department                                           │  │
│  │  ├─ student_number  ✨ AUTO                              │  │
│  │  ├─ student_id      ✨ AUTO                              │  │
│  │  ├─ program         ✨ AUTO                              │  │
│  │  ├─ year_level      ✨ AUTO                              │  │
│  │  ├─ enrollment_date ✨ AUTO                              │  │
│  │  ├─ phone                                                │  │
│  │  ├─ address                                              │  │
│  │  ├─ gpa                                                  │  │
│  │  ├─ guardian_name                                        │  │
│  │  └─ guardian_phone                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ Foreign Key: user_id              │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Related Tables (Cascade Delete)                         │  │
│  │  ├─ student_skills                                       │  │
│  │  ├─ student_activities                                   │  │
│  │  ├─ student_violations                                   │  │
│  │  ├─ student_affiliations                                 │  │
│  │  └─ student_academic_records                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Sequence Diagram

```
Admin          Frontend         Backend              Database
  │                │                │                    │
  │ Fill Form      │                │                    │
  │ (role=student) │                │                    │
  │───────────────>│                │                    │
  │                │                │                    │
  │ Click Submit   │                │                    │
  │───────────────>│                │                    │
  │                │                │                    │
  │                │ POST /api/users│                    │
  │                │───────────────>│                    │
  │                │                │                    │
  │                │                │ Validate Input     │
  │                │                │─────────┐          │
  │                │                │         │          │
  │                │                │<────────┘          │
  │                │                │                    │
  │                │                │ Check role=student │
  │                │                │─────────┐          │
  │                │                │         │          │
  │                │                │<────────┘          │
  │                │                │                    │
  │                │                │ Query last student │
  │                │                │ number for dept    │
  │                │                │───────────────────>│
  │                │                │                    │
  │                │                │ Return: 2026-IT00001│
  │                │                │<───────────────────│
  │                │                │                    │
  │                │                │ Generate next:     │
  │                │                │ 2026-IT00002       │
  │                │                │─────────┐          │
  │                │                │         │          │
  │                │                │<────────┘          │
  │                │                │                    │
  │                │                │ Query last student │
  │                │                │ ID for dept        │
  │                │                │───────────────────>│
  │                │                │                    │
  │                │                │ Return: STU2026-IT0001│
  │                │                │<───────────────────│
  │                │                │                    │
  │                │                │ Generate next:     │
  │                │                │ STU2026-IT0002     │
  │                │                │─────────┐          │
  │                │                │         │          │
  │                │                │<────────┘          │
  │                │                │                    │
  │                │                │ Set program, year, │
  │                │                │ enrollment date    │
  │                │                │─────────┐          │
  │                │                │         │          │
  │                │                │<────────┘          │
  │                │                │                    │
  │                │                │ INSERT user record │
  │                │                │───────────────────>│
  │                │                │                    │
  │                │                │ Success            │
  │                │                │<───────────────────│
  │                │                │                    │
  │                │ Success Response│                   │
  │                │<───────────────│                    │
  │                │                │                    │
  │ Success Toast  │                │                    │
  │<───────────────│                │                    │
  │                │                │                    │
  │ Navigate to    │                │                    │
  │ Student Profiles│               │                    │
  │───────────────>│                │                    │
  │                │                │                    │
  │                │ GET /api/students                   │
  │                │───────────────>│                    │
  │                │                │                    │
  │                │                │ SELECT * FROM users│
  │                │                │ WHERE role=student │
  │                │                │───────────────────>│
  │                │                │                    │
  │                │                │ Return students    │
  │                │                │<───────────────────│
  │                │                │                    │
  │                │ Student List   │                    │
  │                │ (includes new  │                    │
  │                │  student)      │                    │
  │                │<───────────────│                    │
  │                │                │                    │
  │ View Profile   │                │                    │
  │<───────────────│                │                    │
  │                │                │                    │
```

---

## 🎯 Decision Tree

```
                    Create User
                         │
                         ↓
                 ┌───────────────┐
                 │ Role = student?│
                 └───────┬───────┘
                         │
            ┌────────────┴────────────┐
            │                         │
           YES                       NO
            │                         │
            ↓                         ↓
    ┌───────────────┐         ┌──────────────┐
    │ Auto-generate │         │ Create user  │
    │ student fields│         │ normally     │
    └───────┬───────┘         └──────────────┘
            │
            ↓
    ┌───────────────────────┐
    │ Department = IT or CS?│
    └───────┬───────────────┘
            │
    ┌───────┴───────┐
    │               │
   IT              CS
    │               │
    ↓               ↓
Program:        Program:
BSIT            BSCS
    │               │
    └───────┬───────┘
            │
            ↓
    ┌───────────────────┐
    │ Generate IDs:     │
    │ • Student Number  │
    │ • Student ID      │
    └───────┬───────────┘
            │
            ↓
    ┌───────────────────┐
    │ Set Defaults:     │
    │ • Year: 1st Year  │
    │ • Date: Today     │
    └───────┬───────────┘
            │
            ↓
    ┌───────────────────┐
    │ Create User       │
    │ with all fields   │
    └───────┬───────────┘
            │
            ↓
    ┌───────────────────┐
    │ Profile Available │
    │ in Student Module │
    └───────────────────┘
```

---

## 📈 Data Transformation

```
INPUT (User Form)                    OUTPUT (Database Record)
─────────────────                    ────────────────────────

name: "John Doe"          ────────>  name: "John Doe"
email: "john@example.com" ────────>  email: "john@example.com"
password: "password123"   ────────>  password: [hashed]
role: "student"           ────────>  role: "student"
department: "IT"          ────────>  department: "IT"
status: "active"          ────────>  status: "active"

                          ✨ AUTO ─> student_number: "2026-IT00002"
                          ✨ AUTO ─> student_id: "STU2026-IT0002"
                          ✨ AUTO ─> program: "Bachelor of Science in IT"
                          ✨ AUTO ─> year_level: "1st Year"
                          ✨ AUTO ─> enrollment_date: "2026-04-24"
```

---

**These diagrams provide a comprehensive visual representation of the auto student profile creation feature implementation.**

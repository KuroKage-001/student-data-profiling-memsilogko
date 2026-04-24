# Automatic Student Profile Creation

## Overview
When a user with the **student** role is created in the User Management module, the system automatically creates a complete student profile with all necessary fields populated. This eliminates the need for duplicate data entry and ensures data consistency between User Management and Student Profiles.

## Feature Implementation

### Automatic Field Population

When creating a student user account, the following fields are automatically populated:

#### 1. **Student Number** (Login Credential)
- **Format**: `YYYY-DEPT#####` (e.g., `2026-IT00001`)
- **Auto-generated** based on department and year
- **Sequential numbering** per department
- **Used for**: Login authentication

#### 2. **Student ID** (Profile Identifier)
- **Format**: `STUYYYY-DEPT####` (e.g., `STU2026-IT0001`)
- **Auto-generated** based on department and year
- **Unique identifier** for student profile
- **Used for**: Student profile tracking and reports

#### 3. **Program**
- **Auto-set** based on department:
  - `IT` → "Bachelor of Science in Information Technology"
  - `CS` → "Bachelor of Science in Computer Science"

#### 4. **Year Level**
- **Default**: `1st Year`
- Can be updated later in Student Profiles

#### 5. **Enrollment Date**
- **Default**: Current date
- Automatically set when student account is created

#### 6. **Status**
- **Default**: `active`
- Inherited from user account status

### Backend Implementation

#### File: `server/app/Http/Controllers/UserManagementController.php`

**New Method Added:**
```php
private function generateStudentId($department)
{
    $year = date('Y');
    $prefix = 'STU' . $year . '-' . $department;
    
    // Get the highest existing student ID
    $lastStudent = User::where('student_id', 'LIKE', $prefix . '%')
        ->orderBy('student_id', 'desc')
        ->first();
    
    if ($lastStudent) {
        $lastNumber = (int) substr($lastStudent->student_id, -4);
        $nextNumber = $lastNumber + 1;
    } else {
        $nextNumber = 1;
    }
    
    return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
}
```

**Modified `store()` Method:**
```php
if ($request->role === 'student') {
    // Auto-generate student number
    $userData['student_number'] = $this->generateStudentNumber($request->department);
    
    // Auto-set program based on department
    if ($request->department === 'IT') {
        $userData['program'] = 'Bachelor of Science in Information Technology';
    } elseif ($request->department === 'CS') {
        $userData['program'] = 'Bachelor of Science in Computer Science';
    }
    
    // Auto-generate student_id for student profile
    $userData['student_id'] = $this->generateStudentId($request->department);
    
    // Set default enrollment date
    $userData['enrollment_date'] = now()->toDateString();
    
    // Set default year level
    $userData['year_level'] = '1st Year';
}
```

**Modified `update()` Method:**
```php
if ($request->role === 'student' && $request->has('student_number')) {
    $updateData['student_number'] = $request->student_number;
    
    // Auto-generate student_id if not already set
    if (!$user->student_id) {
        $updateData['student_id'] = $this->generateStudentId($request->department);
    }
    
    // Set defaults if not already set
    if (!$user->enrollment_date) {
        $updateData['enrollment_date'] = now()->toDateString();
    }
    
    if (!$user->year_level) {
        $updateData['year_level'] = '1st Year';
    }
}
```

## User Workflow

### Creating a Student Account

1. **Admin navigates to User Management**
2. **Clicks "Add User" button**
3. **Fills in the form:**
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `********`
   - Role: `Student` ← **Select this**
   - Department: `IT` ← **Required for students**
   - Status: `Active` (default)

4. **Clicks "Create User"**

5. **System automatically generates:**
   - Student Number: `2026-IT00001`
   - Student ID: `STU2026-IT0001`
   - Program: `Bachelor of Science in Information Technology`
   - Year Level: `1st Year`
   - Enrollment Date: `2026-04-24` (today's date)

6. **Student profile is immediately available in Student Profiles module**

### Viewing the Student Profile

1. **Navigate to Student Profiles**
2. **Search for the student** by name, email, or student ID
3. **View complete profile** with all auto-populated fields
4. **Edit additional details** as needed:
   - Phone number
   - Address
   - GPA
   - Guardian information
   - Skills
   - Activities
   - Academic records

## Data Flow

```
User Management (Create Student)
         ↓
Auto-generate Student Number (2026-IT00001)
         ↓
Auto-generate Student ID (STU2026-IT0001)
         ↓
Auto-set Program (BSIT/BSCS)
         ↓
Set Default Year Level (1st Year)
         ↓
Set Enrollment Date (Today)
         ↓
Student Profile Created in Database
         ↓
Visible in Student Profiles Module
```

## Database Structure

### Users Table (stores both user account and student profile)

```sql
users
├── id (Primary Key)
├── name
├── email
├── password
├── role (student)
├── department (IT/CS)
├── status (active/inactive/suspended)
├── student_number (2026-IT00001) ← Login credential
├── student_id (STU2026-IT0001) ← Profile identifier
├── program (Bachelor of Science in...)
├── year_level (1st Year, 2nd Year, etc.)
├── enrollment_date
├── graduation_date
├── phone
├── address
├── gpa
├── guardian_name
├── guardian_phone
├── notes
└── timestamps
```

### Related Tables

```sql
student_skills
├── id
├── user_id (Foreign Key → users.id)
├── skill_name
├── proficiency_level
└── description

student_activities
├── id
├── user_id (Foreign Key → users.id)
├── activity_name
├── activity_type
├── organization
├── role
├── start_date
├── end_date
└── description
```

## Benefits

### 1. **Eliminates Duplicate Entry**
- No need to create user account first, then create student profile separately
- Single action creates both user account and student profile

### 2. **Data Consistency**
- Student Number and Student ID are automatically synchronized
- Program is correctly set based on department
- No risk of mismatched data between modules

### 3. **Improved User Experience**
- Faster student onboarding process
- Reduced administrative workload
- Immediate access to student profile after account creation

### 4. **Automatic ID Generation**
- Sequential numbering ensures unique identifiers
- Format consistency across all student records
- No manual ID assignment needed

### 5. **Default Values**
- Sensible defaults (1st Year, current date) reduce data entry
- Can be updated later as needed

## Role Change Handling

### When changing FROM student role TO another role:
- Student-specific fields are cleared:
  - `student_id` → `null`
  - `student_number` → `null`
  - `year_level` → `null`
  - `enrollment_date` → `null`
  - `graduation_date` → `null`
  - `gpa` → `null`
  - `guardian_name` → `null`
  - `guardian_phone` → `null`

### When changing TO student role FROM another role:
- Student profile fields are auto-populated:
  - `student_number` → Auto-generated
  - `student_id` → Auto-generated
  - `program` → Set based on department
  - `year_level` → `1st Year`
  - `enrollment_date` → Current date

## Testing Scenarios

### Test Case 1: Create New Student User
1. Create user with role "student" and department "IT"
2. Verify student_number is generated (e.g., `2026-IT00001`)
3. Verify student_id is generated (e.g., `STU2026-IT0001`)
4. Verify program is set to "Bachelor of Science in Information Technology"
5. Verify year_level is set to "1st Year"
6. Verify enrollment_date is set to today's date
7. Verify student appears in Student Profiles module

### Test Case 2: Sequential ID Generation
1. Create first student: `2026-IT00001`, `STU2026-IT0001`
2. Create second student: `2026-IT00002`, `STU2026-IT0002`
3. Create third student: `2026-IT00003`, `STU2026-IT0003`
4. Verify sequential numbering is correct

### Test Case 3: Department-Specific IDs
1. Create IT student: `2026-IT00001`, `STU2026-IT0001`
2. Create CS student: `2026-CS00001`, `STU2026-CS0001`
3. Verify separate numbering sequences per department

### Test Case 4: Role Change
1. Create faculty user
2. Change role to student
3. Verify student profile fields are auto-populated
4. Change role back to faculty
5. Verify student profile fields are cleared

## API Response Example

### Creating a Student User

**Request:**
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "student",
  "department": "IT",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "department": "IT",
    "status": "active",
    "student_number": "2026-IT00001",
    "student_id": "STU2026-IT0001",
    "program": "Bachelor of Science in Information Technology",
    "year_level": "1st Year",
    "enrollment_date": "2026-04-24",
    "created_at": "2026-04-24T10:30:00.000000Z",
    "updated_at": "2026-04-24T10:30:00.000000Z"
  }
}
```

## Future Enhancements

### Potential Improvements:
1. **Customizable ID Formats** - Allow admins to configure ID format patterns
2. **Bulk Student Import** - Import multiple students from CSV/Excel with auto-profile creation
3. **Email Notifications** - Send welcome email with student number and login credentials
4. **Profile Completion Wizard** - Guide students to complete their profile after first login
5. **Academic Year Integration** - Auto-increment year level based on academic calendar

## Related Documentation

- [User Management Documentation](../user-management-documentations/)
- [Student Profiles Documentation](../student-profile-documentations/)
- [Database Schema](../diagrams/erd-dbml-format.dbml)
- [Dual Portal Authentication](../dual-portal-authentication/)

## Summary

The automatic student profile creation feature streamlines the student onboarding process by:
- ✅ Auto-generating unique student numbers and IDs
- ✅ Setting appropriate defaults based on department
- ✅ Eliminating duplicate data entry
- ✅ Ensuring data consistency across modules
- ✅ Providing immediate access to student profiles

This feature significantly improves administrative efficiency and reduces the potential for data entry errors.

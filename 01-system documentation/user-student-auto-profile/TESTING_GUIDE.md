# Testing Guide: Auto Student Profile Creation

## 🧪 Testing Overview

This guide provides comprehensive test cases to verify the automatic student profile creation feature works correctly.

---

## ✅ Pre-Testing Checklist

Before running tests, ensure:
- [ ] Backend server is running
- [ ] Database is accessible
- [ ] User Management module is accessible
- [ ] Student Profiles module is accessible
- [ ] You have admin credentials

---

## 🔬 Test Cases

### Test Case 1: Create IT Student (Basic)

**Objective**: Verify basic student profile auto-creation for IT department

**Steps**:
1. Navigate to User Management
2. Click "Add User" button
3. Fill in the form:
   - Name: `Test Student IT`
   - Email: `test.it@example.com`
   - Password: `password123`
   - Role: `Student`
   - Department: `IT`
   - Status: `Active`
4. Click "Create User"

**Expected Results**:
- ✅ Success message displayed
- ✅ User created with:
  - Student Number: `2026-IT#####` (sequential)
  - Student ID: `STU2026-IT####` (sequential)
  - Program: `Bachelor of Science in Information Technology`
  - Year Level: `1st Year`
  - Enrollment Date: Current date

**Verification**:
1. Go to Student Profiles
2. Search for `Test Student IT`
3. Verify all auto-generated fields are present
4. Click "View" to see complete profile

**Status**: [ ] Pass [ ] Fail

---

### Test Case 2: Create CS Student (Basic)

**Objective**: Verify basic student profile auto-creation for CS department

**Steps**:
1. Navigate to User Management
2. Click "Add User" button
3. Fill in the form:
   - Name: `Test Student CS`
   - Email: `test.cs@example.com`
   - Password: `password123`
   - Role: `Student`
   - Department: `CS`
   - Status: `Active`
4. Click "Create User"

**Expected Results**:
- ✅ Success message displayed
- ✅ User created with:
  - Student Number: `2026-CS#####` (sequential)
  - Student ID: `STU2026-CS####` (sequential)
  - Program: `Bachelor of Science in Computer Science`
  - Year Level: `1st Year`
  - Enrollment Date: Current date

**Verification**:
1. Go to Student Profiles
2. Search for `Test Student CS`
3. Verify program is set to Computer Science
4. Verify department-specific ID format

**Status**: [ ] Pass [ ] Fail

---

### Test Case 3: Sequential ID Generation

**Objective**: Verify IDs are generated sequentially

**Steps**:
1. Create first IT student:
   - Name: `Student IT 1`
   - Email: `student.it.1@example.com`
   - Role: `Student`
   - Department: `IT`
2. Note the generated IDs
3. Create second IT student:
   - Name: `Student IT 2`
   - Email: `student.it.2@example.com`
   - Role: `Student`
   - Department: `IT`
4. Note the generated IDs
5. Create third IT student:
   - Name: `Student IT 3`
   - Email: `student.it.3@example.com`
   - Role: `Student`
   - Department: `IT`
6. Note the generated IDs

**Expected Results**:
```
Student IT 1:
- Student Number: 2026-IT00001
- Student ID: STU2026-IT0001

Student IT 2:
- Student Number: 2026-IT00002
- Student ID: STU2026-IT0002

Student IT 3:
- Student Number: 2026-IT00003
- Student ID: STU2026-IT0003
```

**Verification**:
- ✅ Numbers increment by 1
- ✅ No gaps in sequence
- ✅ No duplicates

**Status**: [ ] Pass [ ] Fail

---

### Test Case 4: Department-Specific Sequences

**Objective**: Verify IT and CS have separate ID sequences

**Steps**:
1. Create IT student:
   - Name: `IT Student A`
   - Email: `it.a@example.com`
   - Department: `IT`
2. Create CS student:
   - Name: `CS Student A`
   - Email: `cs.a@example.com`
   - Department: `CS`
3. Create IT student:
   - Name: `IT Student B`
   - Email: `it.b@example.com`
   - Department: `IT`
4. Create CS student:
   - Name: `CS Student B`
   - Email: `cs.b@example.com`
   - Department: `CS`

**Expected Results**:
```
IT Student A: 2026-IT00001, STU2026-IT0001
CS Student A: 2026-CS00001, STU2026-CS0001
IT Student B: 2026-IT00002, STU2026-IT0002
CS Student B: 2026-CS00002, STU2026-CS0002
```

**Verification**:
- ✅ IT sequence: 00001, 00002
- ✅ CS sequence: 00001, 00002
- ✅ Sequences are independent

**Status**: [ ] Pass [ ] Fail

---

### Test Case 5: Profile Visibility in Student Profiles

**Objective**: Verify student profile is immediately visible after creation

**Steps**:
1. Create student in User Management:
   - Name: `Visibility Test Student`
   - Email: `visibility@example.com`
   - Role: `Student`
   - Department: `IT`
2. Immediately navigate to Student Profiles
3. Search for the student

**Expected Results**:
- ✅ Student appears in list immediately
- ✅ All auto-generated fields are visible
- ✅ Profile can be viewed
- ✅ Profile can be edited

**Verification**:
1. Click "View" on the student
2. Verify all fields are populated:
   - Student Number
   - Student ID
   - Program
   - Year Level
   - Enrollment Date
3. Click "Edit" and verify form loads correctly

**Status**: [ ] Pass [ ] Fail

---

### Test Case 6: Role Change TO Student

**Objective**: Verify student profile is created when changing role to student

**Steps**:
1. Create faculty user:
   - Name: `Faculty to Student`
   - Email: `faculty.to.student@example.com`
   - Role: `Faculty`
   - Department: `IT`
   - Position: `Instructor`
2. Edit the user
3. Change role to `Student`
4. Save changes

**Expected Results**:
- ✅ Student profile fields auto-generated:
  - Student Number
  - Student ID
  - Program
  - Year Level
  - Enrollment Date
- ✅ Faculty-specific fields cleared (position)

**Verification**:
1. Go to Student Profiles
2. Search for `Faculty to Student`
3. Verify student profile exists with all fields

**Status**: [ ] Pass [ ] Fail

---

### Test Case 7: Role Change FROM Student

**Objective**: Verify student profile is cleared when changing role from student

**Steps**:
1. Create student user:
   - Name: `Student to Faculty`
   - Email: `student.to.faculty@example.com`
   - Role: `Student`
   - Department: `IT`
2. Note the generated student IDs
3. Edit the user
4. Change role to `Faculty`
5. Add position: `Instructor`
6. Save changes

**Expected Results**:
- ✅ Student profile fields cleared:
  - Student Number → null
  - Student ID → null
  - Year Level → null
  - Enrollment Date → null
  - GPA → null
  - Guardian info → null
- ✅ Faculty fields populated

**Verification**:
1. Go to Student Profiles
2. Search for `Student to Faculty`
3. Verify student does NOT appear in list

**Status**: [ ] Pass [ ] Fail

---

### Test Case 8: Edit Student Profile

**Objective**: Verify student profile can be edited after auto-creation

**Steps**:
1. Create student:
   - Name: `Edit Test Student`
   - Email: `edit.test@example.com`
   - Role: `Student`
   - Department: `IT`
2. Go to Student Profiles
3. Find the student and click "Edit"
4. Add additional information:
   - Phone: `123-456-7890`
   - Address: `123 Test Street`
   - GPA: `3.5`
   - Guardian Name: `Test Guardian`
   - Guardian Phone: `098-765-4321`
5. Add a skill:
   - Skill Name: `JavaScript`
   - Proficiency: `Intermediate`
6. Add an activity:
   - Activity Name: `Programming Club`
   - Type: `Extracurricular`
7. Save changes

**Expected Results**:
- ✅ All fields saved successfully
- ✅ Auto-generated fields remain unchanged
- ✅ Additional fields updated
- ✅ Skills and activities added

**Verification**:
1. View the student profile
2. Verify all fields are present
3. Verify auto-generated IDs are unchanged

**Status**: [ ] Pass [ ] Fail

---

### Test Case 9: Validation - Missing Department

**Objective**: Verify validation prevents student creation without department

**Steps**:
1. Navigate to User Management
2. Click "Add User"
3. Fill in the form:
   - Name: `No Department Student`
   - Email: `no.dept@example.com`
   - Password: `password123`
   - Role: `Student`
   - Department: (leave empty)
4. Click "Create User"

**Expected Results**:
- ✅ Validation error displayed
- ✅ User NOT created
- ✅ Error message: "Department is required for student role"

**Status**: [ ] Pass [ ] Fail

---

### Test Case 10: Duplicate Email Prevention

**Objective**: Verify duplicate emails are prevented

**Steps**:
1. Create first student:
   - Name: `First Student`
   - Email: `duplicate@example.com`
   - Role: `Student`
   - Department: `IT`
2. Try to create second student with same email:
   - Name: `Second Student`
   - Email: `duplicate@example.com`
   - Role: `Student`
   - Department: `CS`

**Expected Results**:
- ✅ First student created successfully
- ✅ Second student creation fails
- ✅ Error message: "Email already exists"

**Status**: [ ] Pass [ ] Fail

---

### Test Case 11: Bulk Creation Performance

**Objective**: Test performance with multiple student creations

**Steps**:
1. Create 10 students in succession:
   - Students 1-5: IT department
   - Students 6-10: CS department
2. Note the time taken for each creation
3. Verify all IDs are sequential

**Expected Results**:
- ✅ All students created successfully
- ✅ IDs are sequential without gaps
- ✅ Creation time is reasonable (<2 seconds each)
- ✅ No duplicate IDs

**Verification**:
1. Go to Student Profiles
2. Verify all 10 students appear
3. Check ID sequences:
   - IT: 00001-00005
   - CS: 00001-00005

**Status**: [ ] Pass [ ] Fail

---

### Test Case 12: API Response Verification

**Objective**: Verify API returns correct data structure

**Steps**:
1. Use API client (Postman/Insomnia) or browser DevTools
2. Send POST request to `/api/users`:
```json
{
  "name": "API Test Student",
  "email": "api.test@example.com",
  "password": "password123",
  "role": "student",
  "department": "IT",
  "status": "active"
}
```
3. Inspect response

**Expected Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "API Test Student",
    "email": "api.test@example.com",
    "role": "student",
    "department": "IT",
    "status": "active",
    "student_number": "2026-IT00001",
    "student_id": "STU2026-IT0001",
    "program": "Bachelor of Science in Information Technology",
    "year_level": "1st Year",
    "enrollment_date": "2026-04-24",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Verification**:
- ✅ Response status: 201 Created
- ✅ All auto-generated fields present
- ✅ Correct data types
- ✅ Valid date format

**Status**: [ ] Pass [ ] Fail

---

## 🔍 Edge Cases

### Edge Case 1: Year Rollover

**Scenario**: Test ID generation at year boundary

**Steps**:
1. Manually set system date to December 31, 2026
2. Create student → IDs should have 2026
3. Change system date to January 1, 2027
4. Create student → IDs should have 2027

**Expected**: Separate sequences for each year

**Status**: [ ] Pass [ ] Fail

---

### Edge Case 2: Maximum ID Number

**Scenario**: Test behavior near maximum ID number

**Steps**:
1. Manually create student with ID: `2026-IT99999`
2. Create new student via UI
3. Verify next ID: `2026-IT100000`

**Expected**: System handles 6-digit numbers

**Status**: [ ] Pass [ ] Fail

---

### Edge Case 3: Concurrent Creation

**Scenario**: Test concurrent student creation

**Steps**:
1. Open two browser windows
2. Simultaneously create students in both windows
3. Verify no duplicate IDs

**Expected**: No ID collisions

**Status**: [ ] Pass [ ] Fail

---

## 📊 Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC1: Create IT Student | [ ] | |
| TC2: Create CS Student | [ ] | |
| TC3: Sequential IDs | [ ] | |
| TC4: Department Sequences | [ ] | |
| TC5: Profile Visibility | [ ] | |
| TC6: Role Change TO Student | [ ] | |
| TC7: Role Change FROM Student | [ ] | |
| TC8: Edit Profile | [ ] | |
| TC9: Validation | [ ] | |
| TC10: Duplicate Prevention | [ ] | |
| TC11: Bulk Creation | [ ] | |
| TC12: API Response | [ ] | |
| EC1: Year Rollover | [ ] | |
| EC2: Maximum ID | [ ] | |
| EC3: Concurrent Creation | [ ] | |

---

## 🐛 Bug Report Template

If you find issues during testing, use this template:

```
Bug ID: [AUTO-XXX]
Test Case: [Test case number]
Severity: [Critical/High/Medium/Low]

Description:
[What went wrong]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach screenshots if applicable]

Environment:
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Backend: [PHP version]
- Database: [MySQL version]
```

---

## ✅ Acceptance Criteria

Feature is considered complete when:
- [ ] All test cases pass
- [ ] No critical bugs found
- [ ] Edge cases handled correctly
- [ ] Performance is acceptable
- [ ] Documentation is complete
- [ ] Code review approved

---

## 🚀 Post-Testing Actions

After successful testing:
1. [ ] Update test results in this document
2. [ ] Document any issues found
3. [ ] Create bug reports for failures
4. [ ] Notify development team of results
5. [ ] Prepare for production deployment

---

**Testing Date**: _______________  
**Tested By**: _______________  
**Overall Status**: [ ] Pass [ ] Fail  
**Ready for Production**: [ ] Yes [ ] No

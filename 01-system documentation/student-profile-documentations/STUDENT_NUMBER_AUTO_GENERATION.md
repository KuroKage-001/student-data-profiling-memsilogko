# Student Number Auto-Generation Implementation

## Overview
Implemented automatic student number generation and fixed the display of student numbers in both Add and Edit modals for Student Profiles.

## Changes Made

### 1. Backend Changes

#### StudentController.php
- **New Method**: `getNextStudentNumber()`
  - Generates the next available student number based on department
  - Format: `YYYY-DDDDD` (e.g., 2026-IT00001, 2026-CS00050)
  - Queries the last student number for the given department and year
  - Increments the sequence number automatically
  - Returns the next available number

#### api.php (Routes)
- **New Route**: `GET /next-student-number?department={IT|CS}`
  - Protected by auth:api and check.status middleware
  - Accepts department query parameter (defaults to IT)
  - Returns the next available student number

### 2. Frontend Changes

#### studentProfileService.js
- **New Method**: `getNextStudentNumber(department)`
  - Calls the backend API to fetch next student number
  - Accepts department parameter (IT or CS)
  - Returns the generated student number

#### useStudentProfileQuery.js
- **New Hook**: `useNextStudentNumber(department)`
  - React Query hook for fetching next student number
  - Enabled only when department is provided
  - Always fetches fresh data (staleTime: 0)
  - Auto-refetches when department changes

#### index.js (Hooks Export)
- Exported `useNextStudentNumber` hook for use in components

#### StudentFormModal.jsx
- **Import**: Added `useNextStudentNumber` hook
- **State**: Added `userDepartment` state to track selected user's department
- **Auto-Generation Logic**:
  - When user selects a student account, sets the department
  - Triggers automatic fetch of next student number
  - Auto-fills the student_id field with generated number
  - Shows "Generating..." placeholder while loading
  - Displays "Auto-generated next available number for {department}" message

- **Edit Mode Fix**:
  - Changed initialization to use `student.student_number` first, then fallback to `student.student_id`
  - This ensures the correct student number (e.g., 2026-CS00050) is shown instead of old ID (e.g., 203)

- **Field Updates**:
  - Changed all "Student ID" labels to "Student Number"
  - Added "(auto-generated)" label in add mode
  - Added "(editable)" label in edit mode
  - Field is disabled in add mode until user is selected and number is generated
  - Field is editable in edit mode with format validation

## How It Works

### Add New Student Flow
1. User opens "Add New Student" modal
2. User selects a student account from dropdown
3. System detects the user's department (IT or CS)
4. System automatically fetches the next available student number for that department
5. Student Number field is auto-filled with the generated number (e.g., 2026-IT00051)
6. Field shows "Auto-generated next available number for IT/CS" message
7. User can see but cannot edit the auto-generated number
8. User fills in other required fields and submits

### Edit Student Flow
1. User opens "Edit Student" modal
2. Student Number field shows the actual student_number (e.g., 2026-CS00050)
3. Field is editable with format validation
4. User can update the student number if needed
5. Format validation ensures: YYYY-DDDDD pattern (e.g., 2026-IT00001)

## Student Number Format
- **Pattern**: `YYYY-DDDDD`
- **Year**: Current year (4 digits)
- **Department**: IT or CS (2 letters)
- **Sequence**: 5-digit zero-padded number (00001-99999)

### Examples
- `2026-IT00001` - First IT student in 2026
- `2026-IT00050` - 50th IT student in 2026
- `2026-CS00001` - First CS student in 2026
- `2026-CS00092` - 92nd CS student in 2026

## Validation
- **Required**: Student Number is required for all students
- **Format**: Must match `^\d{4}-(IT|CS)\d{5}$` regex pattern
- **Uniqueness**: Backend validates uniqueness in database
- **Real-time**: Frontend validates format as user types (edit mode)

## API Endpoint

### Get Next Student Number
```
GET /api/next-student-number?department={IT|CS}
```

**Query Parameters:**
- `department` (optional): IT or CS (defaults to IT)

**Response:**
```json
{
  "success": true,
  "data": {
    "next_student_number": "2026-IT00051"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to generate next student number: {error}"
}
```

## Files Modified

### Backend
1. `server/app/Http/Controllers/StudentController.php`
   - Added `getNextStudentNumber()` method

2. `server/routes/api.php`
   - Added route for next student number endpoint

### Frontend
1. `client/src/services/student-profile-service/studentProfileService.js`
   - Added `getNextStudentNumber()` service method

2. `client/src/hooks/student-profile-hook/useStudentProfileQuery.js`
   - Added `useNextStudentNumber()` hook

3. `client/src/hooks/student-profile-hook/index.js`
   - Exported `useNextStudentNumber` hook

4. `client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`
   - Imported and used `useNextStudentNumber` hook
   - Added auto-generation logic
   - Fixed edit mode to show student_number
   - Updated all labels from "Student ID" to "Student Number"

## Benefits
1. **Consistency**: All student numbers follow the same format
2. **No Duplicates**: System ensures unique sequential numbers
3. **Department-Specific**: Each department has its own sequence
4. **User-Friendly**: Automatic generation reduces manual errors
5. **Transparent**: Users can see the generated number before submitting
6. **Editable**: Admin can still modify in edit mode if needed

## Testing Checklist
- [x] Backend endpoint returns correct next number
- [x] Frontend fetches and displays next number
- [x] Add modal auto-fills student number
- [x] Edit modal shows correct student_number (not old student_id)
- [x] Format validation works in edit mode
- [x] Different departments get different sequences
- [x] No syntax errors in any files

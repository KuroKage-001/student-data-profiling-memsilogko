# Student Number Auto-Generation Fix

## Issue
Users were getting 422 errors when creating students because student numbers like "2026-IT00007" were already taken by seeded data.

## Solution
Implemented automatic student number generation that:

1. **Auto-generates unique student numbers** when not provided or when duplicates exist
2. **Makes student_number optional** in the frontend form
3. **Uses department and year** to create format: `YYYY-DEPT#####` (e.g., `2026-IT00008`)

## Changes Made

### Backend (`UserManagementController.php`)
- Added `generateStudentNumber()` method that finds the next available number
- Modified validation to make `student_number` optional (`nullable` instead of `required_if`)
- Enhanced student creation logic to auto-generate numbers when needed

### Frontend (`UserFormModal.jsx`)
- Made student number field optional with helpful placeholder text
- Added auto-generation explanation in the UI
- Removes empty student_number from submission to trigger auto-generation

### Validation (`userValidation.js`)
- Updated validation to make student_number optional for students
- Only validates format if a student number is provided

## How It Works

1. **User creates student without student number**: Backend auto-generates next available number
2. **User provides existing student number**: Backend detects duplicate and auto-generates new one
3. **User provides unique student number**: Backend uses the provided number

## Testing

Try creating a student with:
```json
{
  "name": "Jose Manalo",
  "email": "josemanalo@gmail.com", 
  "password": "Jose@2024",
  "role": "student",
  "department": "IT",
  "status": "active"
}
```

The system will automatically assign the next available student number (e.g., `2026-IT00008`).

## Benefits

- **No more duplicate student number errors**
- **Seamless user experience** - users don't need to guess available numbers
- **Maintains data integrity** - all student numbers remain unique
- **Flexible** - users can still provide custom student numbers if desired
# Test After Deployment

## Quick Test Script

### Test 1: Auto-Generated Student Number
```json
POST https://student-data-profiling-memsilogko.onrender.com/api/users
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "Test Student Auto",
  "email": "test.auto@example.com",
  "password": "password123",
  "role": "student",
  "department": "IT"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "name": "Test Student Auto",
    "email": "test.auto@example.com",
    "role": "student",
    "department": "IT",
    "student_number": "2026-IT00001",
    "student_id": "STU2026-IT0001",
    "program": "Bachelor of Science in Information Technology",
    "year_level": "1st Year",
    "enrollment_date": "2026-04-26",
    "status": "active"
  }
}
```

### Test 2: Custom Student Number
```json
POST https://student-data-profiling-memsilogko.onrender.com/api/users
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "Test Student Custom",
  "email": "test.custom@example.com",
  "password": "password123",
  "role": "student",
  "department": "CS",
  "student_number": "2026-CS99999"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "student_number": "2026-CS99999",
    "student_id": "STU2026-CS0001",
    ...
  }
}
```

### Test 3: Faculty User
```json
POST https://student-data-profiling-memsilogko.onrender.com/api/users
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "name": "Test Faculty",
  "email": "test.faculty@example.com",
  "password": "password123",
  "role": "faculty",
  "department": "IT",
  "position": "Instructor"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User created successfully with faculty profile",
  "data": {
    "role": "faculty",
    "department": "IT",
    "position": "Instructor",
    ...
  }
}
```

## Using the UI

### Test via User Management Page

1. **Login to Admin Portal**
   - Go to: https://student-data-profiling-memsilogko.onrender.com
   - Login with admin credentials

2. **Navigate to User Management**
   - Click "User Management" in sidebar

3. **Test Auto-Generation**
   - Click "Add User" button
   - Fill in form:
     - Name: Test Student
     - Email: test@example.com
     - Password: password123
     - Confirm Password: password123
     - Role: Student
     - Department: IT
     - **Leave Student Number field BLANK**
   - Click "Create User"
   - ✅ Should show success message
   - ✅ User should appear in list with auto-generated number

4. **Verify in Database**
   - Check the users table in PostgreSQL
   - Verify student_number format: `2026-IT00001`
   - Verify student_id format: `STU2026-IT0001`

## Troubleshooting

### Still Getting 500 Error?

1. **Check if deployment completed:**
   ```bash
   # In Render dashboard, check:
   - Deployment status: "Live"
   - Last deployed: Should be recent timestamp
   - Build logs: Should show no errors
   ```

2. **Check the actual SQL in error:**
   ```
   ❌ If you see: where student_id::text LIKE STU2026-IT%
   → Code not deployed yet, missing quotes
   
   ✅ If you see: where student_id::text LIKE 'STU2026-IT%'
   → Code deployed, but different issue
   ```

3. **Check Render logs:**
   - Go to Render dashboard → Logs tab
   - Look for the full error stack trace
   - Check for database connection issues
   - Check for migration issues

### Getting Different Error?

If you get a different error after deployment, it means the PostgreSQL fix worked but there's another issue. Common ones:

1. **Unique constraint violation:**
   ```
   SQLSTATE[23505]: Unique violation
   ```
   Solution: The student_number or email already exists

2. **Foreign key constraint:**
   ```
   SQLSTATE[23503]: Foreign key violation
   ```
   Solution: Check if referenced records exist

3. **Not null constraint:**
   ```
   SQLSTATE[23502]: Not null violation
   ```
   Solution: Check required fields in migration

## Success Criteria

✅ Can create student with blank student_number
✅ Student_number is auto-generated (format: YYYY-DEPT00001)
✅ Student_id is auto-generated (format: STUYYYY-DEPT0001)
✅ Can create student with custom student_number
✅ Can create faculty user
✅ No 500 errors
✅ No transaction abort errors

## Cleanup Test Data

After testing, you may want to delete test users:

```sql
-- Connect to PostgreSQL database
DELETE FROM users WHERE email LIKE 'test%@example.com';
```

Or via UI:
1. Go to User Management
2. Find test users
3. Click delete icon
4. Confirm deletion

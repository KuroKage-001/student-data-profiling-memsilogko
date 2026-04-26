# Deployment Checklist - User Management Fix

## Current Status
❌ Code changes made locally but NOT deployed to production yet
❌ Production is still running the old code with PostgreSQL compatibility issues

## Evidence
The error message shows:
```sql
where student_id::text LIKE STU2026-IT%
```

This is missing quotes around the pattern, which means the old code (without proper parameter binding) is still running in production.

## Files That Need to be Deployed
- ✅ `server/app/Http/Controllers/UserManagementController.php`

## Deployment Steps

### Option 1: Git Push (Recommended)
```bash
# 1. Stage the changes
cd server
git add app/Http/Controllers/UserManagementController.php

# 2. Commit with descriptive message
git commit -m "Fix: PostgreSQL compatibility for user auto-generation

- Add explicit ::text casting for LIKE queries
- Fix student_number validation (remove required_if)
- Add empty string preprocessing
- Support auto-generation for student_number, student_id, faculty_id"

# 3. Push to your deployment branch (usually main or master)
git push origin main

# 4. Wait for Render to auto-deploy (if auto-deploy is enabled)
# OR manually trigger deployment from Render dashboard
```

### Option 2: Manual Deployment via Render Dashboard
1. Go to https://dashboard.render.com
2. Find your service: `student-data-profiling-memsilogko`
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete (check logs)

### Option 3: Direct File Upload (Not Recommended)
If you have SSH access to the server, you can directly replace the file, but this is not recommended as it bypasses version control.

## Verification Steps

### 1. Check Deployment Status
- Go to Render dashboard
- Check deployment logs for errors
- Verify deployment completed successfully

### 2. Test the Fix
After deployment, test these scenarios:

#### Test 1: Create Student with Auto-Generated Number
```
1. Go to User Management
2. Click "Add User"
3. Fill in:
   - Name: Test Student
   - Email: test.student@example.com
   - Password: password123
   - Role: Student
   - Department: IT
4. Leave "Student Number" field BLANK
5. Click "Create User"
6. ✅ Should succeed with auto-generated number (e.g., 2026-IT00001)
```

#### Test 2: Create Student with Custom Number
```
1. Same as above but enter custom student number: 2026-IT99999
2. ✅ Should succeed with custom number
```

#### Test 3: Create Faculty User
```
1. Create user with role: Faculty
2. ✅ Should succeed with auto-generated faculty_id
```

### 3. Check Logs
If still failing, check Render logs:
```bash
# In Render dashboard, go to Logs tab
# Look for the actual error message
# Check if the SQL now shows proper quotes:
# ✅ where student_id::text LIKE 'STU2026-IT%'
# ❌ where student_id::text LIKE STU2026-IT%
```

## Common Issues

### Issue 1: Changes Not Reflected
**Symptom**: Still getting the same error after deployment
**Cause**: Deployment didn't complete or wrong branch deployed
**Solution**: 
- Check Render dashboard for deployment status
- Verify you pushed to the correct branch
- Check if auto-deploy is enabled
- Try manual deploy from dashboard

### Issue 2: Cache Issues
**Symptom**: Old code still running after successful deployment
**Cause**: PHP opcache or application cache
**Solution**:
- Restart the service from Render dashboard
- Or add cache clear to deployment:
  ```bash
  php artisan cache:clear
  php artisan config:clear
  php artisan route:clear
  ```

### Issue 3: Different Error After Deployment
**Symptom**: New error message appears
**Cause**: The fix revealed a different underlying issue
**Solution**:
- Check the new error message
- Look for database constraints or validation issues
- Check Render logs for full stack trace

## Rollback Plan
If the deployment causes issues:

```bash
# 1. Revert the commit
git revert HEAD

# 2. Push the revert
git push origin main

# 3. Or manually deploy previous commit from Render dashboard
```

## Expected Behavior After Fix

### Before (Current - Broken)
```
POST /api/users
❌ 500 Internal Server Error
SQLSTATE[25P02]: In failed sql transaction
SQL: where student_id::text LIKE STU2026-IT%
```

### After (Fixed)
```
POST /api/users
✅ 201 Created
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 123,
    "name": "Test Student",
    "email": "test.student@example.com",
    "role": "student",
    "student_number": "2026-IT00001",
    "student_id": "STU2026-IT0001",
    ...
  }
}
```

## Next Steps
1. ✅ Deploy the changes to production
2. ✅ Test user creation with auto-generated numbers
3. ✅ Verify in production database
4. ✅ Update this checklist with results

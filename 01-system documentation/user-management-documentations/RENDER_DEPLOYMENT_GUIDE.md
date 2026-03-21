# Render Deployment Guide - User Management Migration

## ✅ Your Setup is Ready!

Your Dockerfile and startup script are already configured to automatically run migrations on every deployment.

## 🚀 How to Deploy the Migration to Render

### Step 1: Commit Your Changes

```bash
# Navigate to your project root
cd c:\xampp\htdocs\repository\student-data-profiling-memsilogko

# Add all changes
git add .

# Commit with a clear message
git commit -m "Add user management feature with role and status migration"

# Push to your repository
git push origin main
```

### Step 2: Deploy on Render

#### Option A: Auto-Deploy (Recommended)
If your Render service is connected to GitHub/GitLab:
1. After pushing, Render will automatically detect the changes
2. It will start building and deploying
3. Wait for the deployment to complete (usually 2-5 minutes)

#### Option B: Manual Deploy
If auto-deploy is not enabled:
1. Go to https://dashboard.render.com
2. Select your Laravel backend service
3. Click "Manual Deploy" button (top right)
4. Select "Deploy latest commit"
5. Click "Deploy"

### Step 3: Monitor the Deployment

1. Click on your service in Render dashboard
2. Go to "Logs" tab
3. Watch for these key messages:

```
Starting Laravel application...
Running database migrations...
2026_03_22_000000_add_role_to_users_table ......... DONE
Migration status:
+------+------------------------------------------------+-------+
| Ran? | Migration                                      | Batch |
+------+------------------------------------------------+-------+
| Yes  | 2026_03_22_000000_add_role_to_users_table     | X     |
+------+------------------------------------------------+-------+
Laravel setup completed!
Starting Apache server...
```

### Step 4: Verify the Migration

After deployment completes:

1. **Test the API:**
   ```bash
   # Check if the backend is running
   curl https://your-render-app.onrender.com/api/users
   ```

2. **Test the Frontend:**
   - Open your deployed frontend
   - Login as admin
   - Navigate to User Management
   - Try creating a new user
   - Verify role and status fields work

## 🔍 What Happens During Deployment

Your `startup.sh` script automatically:

1. ✅ Sets up environment variables
2. ✅ Generates application keys
3. ✅ **Runs all pending migrations** (`php artisan migrate --force`)
4. ✅ Shows migration status for verification
5. ✅ Caches configuration
6. ✅ Starts Apache server

## 📋 Migration Details

**Migration File:** `2026_03_22_000000_add_role_to_users_table.php`

**Changes:**
- Adds `role` column (enum: admin, faculty, student) - default: 'student'
- Adds `status` column (enum: active, inactive, suspended) - default: 'active'

**Existing Users:**
All existing users will automatically get:
- `role` = 'student'
- `status` = 'active'

## ⚠️ Important Notes

### 1. Update Admin Users After Deployment

After the migration runs, you'll need to update existing admin users:

**Option A: Using API (Recommended)**
1. Login to your deployed app
2. Go to User Management
3. Edit existing admin users
4. Change their role to "Admin"

**Option B: Using Database (If you have access)**
```sql
-- Update specific user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin@email.com';

-- Verify the update
SELECT id, name, email, role, status FROM users;
```

### 2. No Downtime

This migration is **non-destructive** (only adds columns), so:
- ✅ No downtime required
- ✅ Existing functionality continues to work
- ✅ Safe to deploy anytime

### 3. Rollback (If Needed)

If something goes wrong, you can rollback:

```bash
# In your local environment
php artisan migrate:rollback --step=1

# Then commit and deploy
git add .
git commit -m "Rollback user management migration"
git push origin main
```

## 🐛 Troubleshooting

### Issue: Migration Doesn't Run

**Check Logs:**
1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for error messages

**Common Causes:**
- Database connection issues
- Migration file not committed
- Build failed before reaching migration step

**Solution:**
1. Verify database credentials in Render environment variables
2. Ensure migration file is committed: `git status`
3. Check build logs for errors

### Issue: "Column already exists" Error

**Cause:** Migration already ran on this database

**Solution:**
This is actually good - it means the migration already succeeded!

### Issue: Deployment Fails

**Check:**
1. All files are committed: `git status`
2. No syntax errors in migration file
3. Database is accessible from Render
4. Environment variables are set correctly

## ✅ Deployment Checklist

Before deploying:
- [ ] All changes committed locally
- [ ] Migration file exists: `server/database/migrations/2026_03_22_000000_add_role_to_users_table.php`
- [ ] Controller created: `server/app/Http/Controllers/UserManagementController.php`
- [ ] Routes updated: `server/routes/api.php`
- [ ] Model updated: `server/app/Models/User.php`
- [ ] Changes pushed to Git repository

After deploying:
- [ ] Check Render logs for successful migration
- [ ] Test User Management page on production
- [ ] Create a test user with different roles
- [ ] Update existing admin users' roles
- [ ] Verify all CRUD operations work

## 📊 Expected Timeline

| Step | Duration |
|------|----------|
| Git push | 1-2 seconds |
| Render detects changes | 5-30 seconds |
| Build Docker image | 2-4 minutes |
| Run migrations | 5-10 seconds |
| Start server | 10-20 seconds |
| **Total** | **3-5 minutes** |

## 🎯 Success Indicators

You'll know the deployment succeeded when:

1. ✅ Render shows "Live" status (green)
2. ✅ Logs show "Migration status" with your new migration
3. ✅ User Management page loads without errors
4. ✅ Can create users with role and status fields
5. ✅ API endpoint `/api/users` returns users with role and status

## 📞 Need Help?

If you encounter issues:

1. **Check Render Logs:**
   - Dashboard → Your Service → Logs
   - Look for error messages

2. **Verify Environment Variables:**
   - Dashboard → Your Service → Environment
   - Ensure DB credentials are correct

3. **Test Locally First:**
   ```bash
   php artisan migrate:fresh
   php artisan serve
   ```

4. **Check Migration File:**
   ```bash
   php artisan migrate:status
   ```

## 🚀 Ready to Deploy!

Your configuration is correct. Just:

1. Commit your changes
2. Push to Git
3. Wait for Render to deploy
4. Check the logs
5. Test the User Management feature

**The migration will run automatically!** 🎉

---

**Last Updated:** March 22, 2026  
**Migration:** 2026_03_22_000000_add_role_to_users_table  
**Status:** Ready for Deployment ✅

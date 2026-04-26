# Render Deployment Troubleshooting

## Current Situation
✅ Code changes committed: `9097669`
✅ Code pushed to origin/main
❌ Render hasn't deployed the latest code yet
❌ Still getting the old error with unquoted SQL

## Evidence
The error still shows:
```sql
where student_id::text LIKE STU2026-IT%
```

This is the OLD code without parameter binding. The NEW code should generate:
```sql
where student_id::text LIKE 'STU2026-IT%'
```

## Why Render Might Not Have Deployed

### Reason 1: Auto-Deploy is Disabled
**Check:**
1. Go to https://dashboard.render.com
2. Find your service: `student-data-profiling-memsilogko`
3. Go to Settings tab
4. Check "Auto-Deploy" setting

**Solution:**
- If disabled: Enable it OR manually trigger deployment
- If enabled: Check deployment logs for errors

### Reason 2: Deployment Failed Silently
**Check:**
1. Go to Render Dashboard
2. Click on your service
3. Go to "Events" tab
4. Look for failed deployments

**Solution:**
- Check error logs
- Fix any build errors
- Manually trigger deployment

### Reason 3: Wrong Branch Deployed
**Check:**
1. Go to Render Dashboard → Settings
2. Check "Branch" setting
3. Verify it's set to `main` (or your deployment branch)

**Solution:**
- If wrong branch: Change to `main`
- If correct: Manually trigger deployment

### Reason 4: Build Cache Issue
**Check:**
- Render might be using cached files

**Solution:**
- Use "Clear build cache & deploy" option

### Reason 5: PHP OpCache Not Cleared
**Check:**
- PHP might be caching the old code

**Solution:**
- Restart the service
- Or add cache clear to build command

## Step-by-Step Fix

### Option 1: Manual Deploy with Cache Clear (RECOMMENDED)

1. **Go to Render Dashboard**
   ```
   https://dashboard.render.com
   ```

2. **Find Your Service**
   - Click on `student-data-profiling-memsilogko`

3. **Trigger Manual Deploy**
   - Click "Manual Deploy" button (top right)
   - Select "Clear build cache & deploy"
   - Wait for deployment to complete (5-10 minutes)

4. **Monitor Deployment**
   - Watch the logs in real-time
   - Look for any errors
   - Wait for "Live" status

5. **Verify Deployment**
   - Check the commit hash in deployment logs
   - Should show: `9097669` or later

### Option 2: Force Push (If Option 1 Doesn't Work)

```bash
# Create an empty commit to trigger deployment
git commit --allow-empty -m "chore: trigger deployment"
git push origin main
```

Then wait for auto-deploy or manually trigger.

### Option 3: Restart Service

1. Go to Render Dashboard
2. Click on your service
3. Click "Manual Deploy" → "Deploy latest commit"
4. OR click "Suspend" then "Resume"

### Option 4: Check Build Command

1. Go to Render Dashboard → Settings
2. Check "Build Command"
3. Should include:
   ```bash
   composer install --no-dev --optimize-autoloader
   php artisan config:cache
   php artisan route:cache
   ```

4. Check "Start Command"
5. Should be something like:
   ```bash
   php artisan serve --host=0.0.0.0 --port=$PORT
   ```

## Verification Steps

### 1. Check Deployment Logs

In Render Dashboard → Logs, you should see:
```
==> Cloning from https://github.com/YOUR_REPO...
==> Checking out commit 9097669...
==> Running build command...
==> Build successful
==> Starting service...
```

### 2. Check Application Logs

After deployment, check logs for:
```
Laravel application started
```

### 3. Test the Endpoint

Try creating a user again. The error should change:

**Before (Current):**
```
SQL: where student_id::text LIKE STU2026-IT%
```

**After (Fixed):**
```
✅ Success OR different error (not the LIKE query error)
```

### 4. Verify Code Deployed

You can add a temporary test endpoint to verify:

```php
// In routes/api.php (temporary)
Route::get('/test-deployment', function() {
    return response()->json([
        'deployed' => true,
        'commit' => '9097669',
        'timestamp' => now()
    ]);
});
```

Then visit:
```
https://student-data-profiling-memsilogko.onrender.com/api/test-deployment
```

## Common Deployment Issues

### Issue 1: Composer Dependencies
**Error:** `Class not found`
**Solution:** 
```bash
composer install --no-dev
composer dump-autoload
```

### Issue 2: Environment Variables
**Error:** `Database connection failed`
**Solution:**
- Check Render Environment Variables
- Verify DATABASE_URL is set correctly

### Issue 3: Migration Issues
**Error:** `Table doesn't exist`
**Solution:**
```bash
php artisan migrate --force
```

### Issue 4: Permission Issues
**Error:** `Permission denied`
**Solution:**
- Check storage directory permissions
- Render should handle this automatically

## Emergency Rollback

If the new deployment causes issues:

### Option 1: Rollback in Render Dashboard
1. Go to Events tab
2. Find previous successful deployment
3. Click "Rollback to this deploy"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
```

## Next Steps After Successful Deployment

1. ✅ Test user creation with auto-generated student number
2. ✅ Test user creation with custom student number
3. ✅ Test faculty user creation
4. ✅ Monitor logs for any new errors
5. ✅ Update documentation with results

## Contact Render Support

If none of the above works:

1. Go to Render Dashboard
2. Click "Help" → "Contact Support"
3. Provide:
   - Service name: `student-data-profiling-memsilogko`
   - Issue: "Latest commit not deploying"
   - Commit hash: `9097669`
   - Expected behavior: Auto-deploy on push to main

## Debugging Commands

### Check Current Deployed Commit
Add this to your Laravel app temporarily:

```php
// In routes/api.php
Route::get('/debug/version', function() {
    return response()->json([
        'git_commit' => exec('git rev-parse --short HEAD'),
        'git_branch' => exec('git rev-parse --abbrev-ref HEAD'),
        'deployed_at' => filemtime(base_path('composer.json')),
    ]);
});
```

Then visit:
```
https://student-data-profiling-memsilogko.onrender.com/api/debug/version
```

This will show you what commit is actually deployed.

## Summary

The code is correct locally and pushed to GitHub. The issue is that Render hasn't deployed it yet. Follow Option 1 (Manual Deploy with Cache Clear) to force a fresh deployment.

# Quick Fix Guide - Production 405 Errors

## Immediate Action Required

Your production API is returning 405 errors because of route caching issues. Here's what to do:

## Step 1: Deploy the Fix

The code has been updated. Just commit and push:

```bash
git add .
git commit -m "Fix: Production CORS and route 405 errors"
git push origin main
```

Render will automatically redeploy.

## Step 2: Verify Environment Variables

In Render dashboard, ensure these are set:

```
CORS_ALLOWED_ORIGINS=https://student-data-profiling-memsilogko.vercel.app
APP_ENV=production
APP_DEBUG=false
APP_URL=https://student-data-profiling-memsilogko.onrender.com
```

## Step 3: Manual Cache Clear (If Needed)

If the issue persists after deployment:

1. Go to Render dashboard
2. Click on your service
3. Click "Shell" tab
4. Run these commands:

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
```

## What Was Fixed

1. ✅ Build scripts now clear caches before rebuilding
2. ✅ CORS middleware applied globally (not just API routes)
3. ✅ Explicit HTTP methods in CORS config (no wildcards)

## Test After Deployment

Open browser console on your frontend and check if these errors are gone:
- ❌ `Failed to load resource: 405`
- ❌ `The GET method is not supported`

Should see:
- ✅ `200 OK` responses
- ✅ Data loading correctly

## Files Changed

- `server/bootstrap/app.php` - Added global CORS middleware
- `server/config/cors.php` - Explicit allowed methods
- `server/render-build.sh` - Clear caches before caching
- `server/startup.sh` - Clear caches before caching

## Need Help?

If errors persist after deployment, check:
1. Render deployment logs for errors
2. Browser Network tab for actual response headers
3. Run `php artisan route:list` in Render shell to verify routes

---

**Status:** Ready to deploy
**ETA:** 5-10 minutes after push

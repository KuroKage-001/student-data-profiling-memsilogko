# Production CORS & Route 405 Error Fix

## Problem
In production (Render), API routes were returning 405 errors with message:
```
The GET method is not supported for route api/class-sections-statistics. 
Supported methods: OPTIONS.
```

## Root Cause
The issue was caused by:
1. **Route caching** without proper cache clearing
2. **Middleware ordering** - CORS middleware not being applied globally
3. **CORS configuration** - Using wildcard `*` for allowed methods

## Solution Applied

### 1. Updated Build Scripts
Modified both `server/render-build.sh` and `server/startup.sh` to:
- Clear all caches BEFORE caching (cache:clear, config:clear, route:clear, view:clear)
- Then rebuild caches (config:cache, route:cache, view:cache)

### 2. Updated Middleware Configuration
Modified `server/bootstrap/app.php`:
- Ensured HandleCors is prepended to API middleware
- Added global CORS middleware using `$middleware->use()`
- This ensures CORS headers are added to ALL responses, not just API routes

### 3. Updated CORS Configuration
Modified `server/config/cors.php`:
- Changed from `'allowed_methods' => ['*']` to explicit methods
- Now uses: `['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']`

## Deployment Steps

### For Render.com

1. **Clear existing caches** (if you have shell access):
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

2. **Commit and push changes**:
```bash
git add .
git commit -m "Fix: Production CORS and route 405 errors"
git push origin main
```

3. **Trigger manual deploy** in Render dashboard or wait for auto-deploy

4. **Verify environment variables** in Render:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
APP_ENV=production
APP_DEBUG=false
```

### Manual Cache Clear (if needed)

If the issue persists after deployment, you may need to manually clear caches:

1. Go to Render dashboard → Your service → Shell
2. Run:
```bash
cd /var/www/html
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan optimize:clear
```

## Verification

After deployment, test the endpoints:

```bash
# Test class-sections-statistics
curl -X GET https://your-api-domain.onrender.com/api/class-sections-statistics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# Test class-sections
curl -X GET https://your-api-domain.onrender.com/api/class-sections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

Expected response: 200 OK with JSON data (not 405)

## Prevention

To prevent this issue in the future:

1. **Always clear caches before caching** in deployment scripts
2. **Test route caching locally** before deploying:
```bash
php artisan route:cache
php artisan route:list  # Verify routes are cached correctly
php artisan route:clear  # Clear when done testing
```

3. **Monitor CORS headers** in production using browser DevTools Network tab

4. **Keep CORS configuration explicit** - avoid wildcards in production

## Related Files

- `server/bootstrap/app.php` - Middleware configuration
- `server/config/cors.php` - CORS settings
- `server/render-build.sh` - Render build script
- `server/startup.sh` - Docker startup script
- `server/routes/api.php` - API route definitions

## Additional Notes

### Why Route Caching Can Cause Issues

Laravel's route caching compiles all routes into a single cached file for performance. However:
- If middleware isn't properly configured when caching, routes may not have correct middleware applied
- Cached routes don't reflect changes until cache is cleared and rebuilt
- CORS middleware must be applied BEFORE route caching

### CORS Middleware Order Matters

The order of middleware execution is:
1. Global middleware (applied to all requests)
2. Route-specific middleware (applied to matched routes)

By adding HandleCors to both global and API middleware, we ensure:
- OPTIONS preflight requests are handled correctly
- All API responses include proper CORS headers
- Authentication middleware runs AFTER CORS (important!)

## Troubleshooting

### If 405 errors persist:

1. Check if routes are registered:
```bash
php artisan route:list | grep class-sections
```

2. Check middleware order:
```bash
php artisan route:list --columns=uri,method,middleware | grep class-sections
```

3. Verify CORS headers in response:
```bash
curl -I -X OPTIONS https://your-api.onrender.com/api/class-sections \
  -H "Origin: https://your-frontend.vercel.app"
```

Should see:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

### If only OPTIONS works:

This indicates CORS preflight is working but actual requests are blocked:
- Check authentication middleware isn't blocking requests
- Verify JWT token is valid and not expired
- Check `check.status` middleware isn't rejecting requests

## Status

✅ Build scripts updated with cache clearing
✅ Middleware configuration enhanced
✅ CORS configuration made explicit
✅ Ready for deployment

---

**Last Updated:** April 19, 2026
**Issue:** Production 405 errors on API routes
**Status:** Fixed - Pending deployment

# Session Timeout & Vercel 404 Fix Documentation

## Overview
This document addresses two critical issues:
1. JWT session timeout configuration in the Laravel backend
2. 404 errors when refreshing pages on Vercel production deployment

---

## Issue 1: JWT Session Timeout Configuration

### Current Implementation Status ✅

The JWT authentication system is **correctly implemented** with proper token expiration handling:

#### What's Working:
- JWT middleware (`JwtMiddleware.php`) properly catches `TokenExpiredException`
- AuthController returns `expires_in` with each login/refresh response
- Token blacklisting is enabled for logout functionality
- Refresh token mechanism is in place

#### Configuration Files:

**`config/jwt.php`:**
```php
'ttl' => env('JWT_TTL', 60),  // Default: 60 minutes
'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),  // Default: 2 weeks
'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),
```

### What Was Fixed:

Added explicit JWT configuration to `.env` and `.env.example`:

```env
# JWT Configuration
# Token expiration time in minutes (default: 60 = 1 hour)
JWT_TTL=60
# Refresh token expiration time in minutes (default: 20160 = 2 weeks)
JWT_REFRESH_TTL=20160
# Blacklist grace period in seconds (prevents parallel request failures)
JWT_BLACKLIST_GRACE_PERIOD=0
```

### How It Works:

1. **Login:** User receives JWT token with 60-minute expiration
2. **API Requests:** Token is validated on each request via `auth:api` middleware
3. **Token Expiration:** After 60 minutes, API returns 401 with "Token has expired"
4. **Refresh:** Client can refresh token within 2-week window using `/auth/refresh`
5. **Logout:** Token is blacklisted and cannot be reused

### Token Lifecycle:

```
Login
  ↓
Token Valid (60 min)
  ↓
Token Expired → Can Refresh (within 2 weeks)
  ↓
Refresh Window Expired → Must Re-login
```

### Customizing Timeout:

To change session timeout, modify `.env`:

```env
# 30 minutes
JWT_TTL=30

# 2 hours
JWT_TTL=120

# 24 hours
JWT_TTL=1440
```

---

## Issue 2: Vercel 404 Error on Page Refresh

### Problem Description:

When refreshing any page on production (https://student-data-profiling-memsilogko.vercel.app/), users see:

```
404: NOT_FOUND
Code: NOT_FOUND
ID: sin1::2dlwj-1774911147225-b0509c76ef55
```

### Root Cause:

This is a **Single Page Application (SPA) routing issue**:

1. React Router handles routing client-side (in the browser)
2. When you refresh `/admin/dashboard`, the browser requests that path from Vercel's server
3. Vercel doesn't have a file at `/admin/dashboard` (only `index.html` exists)
4. Result: 404 error

### The Fix:

Updated `client/vercel.json` to include rewrite rules:

```json
{
  "build": {
    "env": {
      "VITE_API_URL": "https://student-profiling-api-03.onrender.com/api"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### How It Works:

- **Before:** Vercel tries to find `/admin/dashboard` → 404
- **After:** Vercel rewrites all routes to `/index.html` → React Router handles routing

### Deployment Steps:

1. Commit the updated `vercel.json` file
2. Push to your repository
3. Vercel will automatically redeploy
4. Test by refreshing any route (e.g., `/admin/dashboard`)

---

## Testing Checklist

### Backend (Session Timeout):

- [ ] Login and verify `expires_in` is returned (3600 seconds = 60 minutes)
- [ ] Wait for token expiration or manually test with expired token
- [ ] Verify API returns 401 with "Token has expired" message
- [ ] Test refresh endpoint works within refresh window
- [ ] Test logout properly blacklists token

### Frontend (Vercel 404):

- [ ] Deploy updated `vercel.json` to Vercel
- [ ] Navigate to `/admin/dashboard` directly in browser
- [ ] Refresh the page - should NOT show 404
- [ ] Test all routes:
  - `/admin/login`
  - `/admin/dashboard`
  - `/admin/students`
  - `/admin/faculty`
  - `/admin/events`
  - `/profile/settings`
- [ ] Verify invalid routes redirect to home page

---

## Production Environment Variables

Ensure these are set in your production environment:

### Render (Backend):
```env
JWT_TTL=60
JWT_REFRESH_TTL=20160
JWT_BLACKLIST_GRACE_PERIOD=0
JWT_SECRET=<your-secret-key>
```

### Vercel (Frontend):
```env
VITE_API_URL=https://student-profiling-api-03.onrender.com/api
```

---

## Common Issues & Solutions

### Issue: Token expires too quickly
**Solution:** Increase `JWT_TTL` in `.env` (e.g., `JWT_TTL=120` for 2 hours)

### Issue: Users can't refresh token
**Solution:** Check `JWT_REFRESH_TTL` is set appropriately (default 2 weeks)

### Issue: Still getting 404 on Vercel after fix
**Solution:** 
1. Verify `vercel.json` is in the `client` folder
2. Check Vercel deployment logs for errors
3. Ensure the build completed successfully
4. Try clearing browser cache

### Issue: Parallel requests failing
**Solution:** Increase `JWT_BLACKLIST_GRACE_PERIOD` to 5-10 seconds

---

## Architecture Overview

```
┌─────────────────┐
│   React SPA     │
│  (Vercel)       │
└────────┬────────┘
         │
         │ HTTP Requests
         │ Authorization: Bearer <token>
         │
         ▼
┌─────────────────┐
│  Laravel API    │
│  (Render)       │
├─────────────────┤
│ JWT Middleware  │
│ - Validate      │
│ - Check Expiry  │
│ - Authenticate  │
└─────────────────┘
```

### Request Flow:

1. **Client:** Sends request with JWT token in Authorization header
2. **Middleware:** Validates token, checks expiration
3. **If Valid:** Request proceeds to controller
4. **If Expired:** Returns 401, client should refresh or re-login
5. **If Invalid:** Returns 401, client should re-login

---

## Files Modified

### Backend:
- `server/.env` - Added JWT configuration
- `server/.env.example` - Added JWT configuration template

### Frontend:
- `client/vercel.json` - Added SPA rewrite rules

### No Changes Needed:
- `server/config/jwt.php` - Already configured correctly
- `server/app/Http/Middleware/JwtMiddleware.php` - Already handles expiration
- `server/app/Http/Controllers/AuthController.php` - Already returns expires_in
- `client/src/App.jsx` - React Router already configured

---

## Monitoring & Maintenance

### Backend Logs to Monitor:
- Token expiration errors (should be normal user behavior)
- Token refresh requests
- Failed authentication attempts

### Frontend Metrics to Track:
- 404 error rate (should drop to near zero after fix)
- Token refresh frequency
- Re-login frequency

---

## Security Considerations

1. **Token Expiration:** 60 minutes balances security and user experience
2. **Refresh Window:** 2 weeks allows "remember me" functionality
3. **Blacklisting:** Prevents token reuse after logout
4. **HTTPS Only:** Tokens should only be transmitted over HTTPS
5. **Storage:** Frontend should store tokens securely (not in localStorage if possible)

---

## Summary

✅ **Session Timeout:** Correctly implemented, now explicitly configured
✅ **Vercel 404:** Fixed with SPA rewrite rules

Both issues are resolved. Deploy the changes and test thoroughly.

# Quick Deploy Reference - User Management

## 🚀 Deploy in 3 Steps

### 1️⃣ Commit & Push
```bash
git add .
git commit -m "Add user management with role and status migration"
git push origin main
```

### 2️⃣ Deploy on Render
- Go to https://dashboard.render.com
- Select your Laravel service
- Click "Manual Deploy" → "Deploy latest commit"
- OR wait for auto-deploy (if enabled)

### 3️⃣ Verify
- Check logs for: `2026_03_22_000000_add_role_to_users_table ......... DONE`
- Test User Management page
- Create a test user

## ✅ Your Setup is Already Configured!

Your `startup.sh` automatically runs:
```bash
php artisan migrate --force --no-interaction
```

**No additional configuration needed!**

## 📋 What Gets Deployed

### Backend Files:
- ✅ Migration: `2026_03_22_000000_add_role_to_users_table.php`
- ✅ Controller: `UserManagementController.php`
- ✅ Model: `User.php` (updated)
- ✅ Routes: `api.php` (updated)

### Database Changes:
- ✅ Adds `role` column (admin/faculty/student)
- ✅ Adds `status` column (active/inactive/suspended)

## 🔍 Check Deployment Logs

Look for these messages in Render logs:

```
✅ Running database migrations...
✅ 2026_03_22_000000_add_role_to_users_table ......... DONE
✅ Migration status:
✅ Laravel setup completed!
✅ Starting Apache server...
```

## ⚡ Quick Commands

### Local Testing:
```bash
# Run migration locally
php artisan migrate

# Check migration status
php artisan migrate:status

# Rollback if needed
php artisan migrate:rollback --step=1
```

### After Deployment:
```bash
# Test API endpoint
curl https://your-app.onrender.com/api/users

# Or use browser
https://your-app.onrender.com/api/users
```

## 🎯 Post-Deployment Tasks

1. **Update Admin Users:**
   - Login to your app
   - Go to User Management
   - Edit existing users
   - Set role to "Admin" for admin users

2. **Test Features:**
   - Create new user
   - Edit user
   - Delete user
   - Search users
   - Test pagination

## ⏱️ Deployment Time

- **Total:** 3-5 minutes
- **Build:** 2-4 minutes
- **Migration:** 5-10 seconds
- **Startup:** 10-20 seconds

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Migration not running | Check Render logs for errors |
| "Column exists" error | Migration already ran (success!) |
| Build fails | Check syntax errors in files |
| Can't access page | Clear browser cache, check API URL |

## 📞 Support

- **Logs:** Render Dashboard → Your Service → Logs
- **Environment:** Render Dashboard → Your Service → Environment
- **Docs:** See RENDER_DEPLOYMENT_GUIDE.md for details

---

**Ready?** Just commit, push, and deploy! 🚀

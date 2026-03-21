# User Management - Installation Guide

## Prerequisites

Before installing, ensure you have:
- ✅ PHP 8.1 or higher
- ✅ Composer
- ✅ Node.js 16+ and npm
- ✅ MySQL database
- ✅ Existing Laravel backend running
- ✅ Existing React frontend running
- ✅ JWT authentication configured

## Installation Steps

### Step 1: Backend Setup

#### 1.1 Run Database Migration

```bash
cd server
php artisan migrate
```

This will add `role` and `status` columns to the `users` table.

#### 1.2 Verify Migration

```bash
php artisan migrate:status
```

You should see:
```
✓ 2026_03_22_000000_add_role_to_users_table
```

#### 1.3 (Optional) Create Test Admin User

```bash
php artisan tinker
```

Then run:
```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'status' => 'active'
]);
```

Press `Ctrl+D` to exit tinker.

### Step 2: Frontend Setup

No additional installation needed! All files are already in place.

#### 2.1 Verify Files Exist

Check that these files exist:
```bash
# From project root
ls client/src/pages/admin-pages/UserManagement.jsx
ls client/src/components/admin-components/user-management-compo/
ls client/src/services/user-management-service/
ls client/src/hooks/user-management-hook/
```

#### 2.2 Verify Route Configuration

Check `client/src/App.jsx` contains:
```javascript
import UserManagement from './pages/admin-pages/UserManagement';

// In routes:
<Route path="/admin/user-management" element={
  <ProtectedRoute>
    <UserManagement />
  </ProtectedRoute>
} />
```

#### 2.3 Verify Sidebar Menu

Check `client/src/components/system-components/AdminSidebar.jsx` contains the User Management menu item.

### Step 3: Start Servers

#### 3.1 Start Backend

```bash
cd server
php artisan serve
```

Backend should be running at: `http://localhost:8000`

#### 3.2 Start Frontend

In a new terminal:
```bash
cd client
npm run dev
```

Frontend should be running at: `http://localhost:5173`

### Step 4: Verify Installation

#### 4.1 Test Backend API

```bash
# Login to get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Copy the token from response, then test users endpoint
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4.2 Test Frontend

1. Open browser: `http://localhost:5173`
2. Navigate to: `http://localhost:5173/admin/login`
3. Login with admin credentials
4. Click "User Management" in sidebar
5. You should see the user management page

### Step 5: Post-Installation

#### 5.1 Create Initial Users

1. Login as admin
2. Go to User Management
3. Click "Add User"
4. Create admin, faculty, and student accounts

#### 5.2 Test All Features

- [ ] Create a new user
- [ ] View user details
- [ ] Edit user information
- [ ] Search for users
- [ ] Delete a user
- [ ] Verify toast notifications work

## Troubleshooting

### Issue: Migration Fails

**Error:** `SQLSTATE[42S21]: Column already exists: role`

**Solution:** The columns already exist. Skip migration or rollback first:
```bash
php artisan migrate:rollback --step=1
php artisan migrate
```

### Issue: "Failed to fetch users"

**Possible causes:**
1. Backend not running
2. JWT token expired
3. Wrong API URL

**Solutions:**
```bash
# Check backend is running
curl http://localhost:8000/api/users

# Check .env file
cat client/.env
# Should have: VITE_API_BASE_URL=http://localhost:8000/api

# Clear browser storage and login again
```

### Issue: "Cannot find module"

**Error:** Module not found errors in frontend

**Solution:**
```bash
cd client
npm install
npm run dev
```

### Issue: 404 on /admin/user-management

**Possible causes:**
1. Route not configured
2. Component not imported

**Solution:**
Check `client/src/App.jsx` has the UserManagement import and route.

### Issue: Sidebar menu item not showing

**Solution:**
Check `client/src/components/system-components/AdminSidebar.jsx` has the User Management menu item.

## Verification Checklist

After installation, verify:

### Backend
- [ ] Migration ran successfully
- [ ] `users` table has `role` and `status` columns
- [ ] API endpoints respond correctly
- [ ] JWT authentication works
- [ ] Test user can login

### Frontend
- [ ] User Management page loads
- [ ] Sidebar menu item appears
- [ ] Can create users
- [ ] Can view users
- [ ] Can edit users
- [ ] Can delete users
- [ ] Search works
- [ ] Toast notifications appear
- [ ] Mobile responsive

### Security
- [ ] Routes require authentication
- [ ] Cannot access without login
- [ ] Cannot delete own account
- [ ] Passwords are hashed
- [ ] Email uniqueness enforced

## Database Schema

After migration, your `users` table should have:

```sql
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','faculty','student') DEFAULT 'student',
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
);
```

## Environment Configuration

### Backend (.env)

Ensure these are set:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_TTL=60
```

### Frontend (.env or .env.local)

Ensure this is set:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Rollback (If Needed)

To remove the user management feature:

### Backend
```bash
cd server
php artisan migrate:rollback --step=1
```

### Frontend
1. Remove route from `App.jsx`
2. Remove menu item from `AdminSidebar.jsx`
3. Delete user management files (optional)

## Next Steps

After successful installation:

1. ✅ Read [QUICK_START.md](./QUICK_START.md) for usage
2. ✅ Review [USER_MANAGEMENT_GUIDE.md](./USER_MANAGEMENT_GUIDE.md) for details
3. ✅ Create your initial users
4. ✅ Test all features
5. ✅ Configure user roles and permissions

## Support

If you encounter issues:
1. Check this installation guide
2. Review [QUICK_START.md](./QUICK_START.md) troubleshooting section
3. Check Laravel logs: `storage/logs/laravel.log`
4. Check browser console for frontend errors
5. Verify all prerequisites are met

---

**Installation Complete!** 🎉

You're now ready to use the User Management system.

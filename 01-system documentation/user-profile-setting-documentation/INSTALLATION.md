# User Profile Settings - Installation Guide

## Prerequisites

### Backend Requirements
- PHP 8.1 or higher
- Composer
- MySQL 5.7 or higher
- Laravel 10+
- JWT Auth package (tymon/jwt-auth)

### Frontend Requirements
- Node.js 16+ or higher
- npm or yarn
- React 18+

## Installation Steps

### 1. Backend Setup

#### Step 1.1: Verify JWT Auth Package
```bash
cd server
composer show tymon/jwt-auth
```

If not installed:
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

#### Step 1.2: Add Controller
The `UserProfileController.php` has been created at:
```
server/app/Http/Controllers/UserProfileController.php
```

#### Step 1.3: Update Routes
Routes have been added to `server/routes/api.php`:
```php
// User Profile API Routes (Protected)
Route::middleware('auth:api')->group(function () {
    Route::get('profile', [App\Http\Controllers\UserProfileController::class, 'show']);
    Route::put('profile', [App\Http\Controllers\UserProfileController::class, 'updateProfile']);
    Route::post('profile/change-password', [App\Http\Controllers\UserProfileController::class, 'changePassword']);
});
```

#### Step 1.4: Verify Database
Ensure the `users` table has the required columns:
```sql
-- Check if columns exist
DESCRIBE users;

-- Required columns:
-- id, name, email, password, role, status, created_at, updated_at
```

If `role` or `status` columns are missing, create a migration:
```bash
php artisan make:migration add_role_and_status_to_users_table
```

Add to migration:
```php
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        if (!Schema::hasColumn('users', 'role')) {
            $table->string('role')->default('student')->after('email');
        }
        if (!Schema::hasColumn('users', 'status')) {
            $table->string('status')->default('active')->after('role');
        }
    });
}
```

Run migration:
```bash
php artisan migrate
```

#### Step 1.5: Clear Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

#### Step 1.6: Test Backend
```bash
php artisan serve
```

Test the endpoints:
```bash
# Get profile (requires authentication)
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Frontend Setup

#### Step 2.1: Verify Dependencies
```bash
cd client
npm list react react-router-dom react-icons axios
```

If missing, install:
```bash
npm install react-router-dom react-icons axios
```

#### Step 2.2: Verify File Structure
All files have been created in the correct locations:

```
client/src/
├── pages/system-page/
│   └── UserProfileSettings.jsx ✅
├── components/system-components/user-profile-setting-compo/
│   ├── ProfileInfoTab.jsx ✅
│   ├── ChangePasswordTab.jsx ✅
│   └── index.js ✅
├── hooks/user-profile-setting-hook/
│   └── useUserProfile.js ✅
├── services/user-profile-setting-servive/
│   └── userProfileService.js ✅
└── utils/system-utils/user-profile-settings-utils/
    └── profileValidation.js ✅
```

#### Step 2.3: Verify Axios Configuration
Check if `axiosConfig.js` exists:
```bash
ls client/src/services/login-service/axiosConfig.js
```

If missing, create it:
```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

#### Step 2.4: Verify Environment Variables
Check `.env` or `.env.local`:
```bash
cat client/.env.local
```

Should contain:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

#### Step 2.5: Verify Toast Hook
Check if `useToast` hook exists:
```bash
ls client/src/hooks/useToast.js
```

If missing, create a basic implementation:
```javascript
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return { toasts, showToast };
};
```

#### Step 2.6: Install and Build
```bash
npm install
npm run dev
```

### 3. Verification

#### Step 3.1: Test Backend Endpoints

**Get Profile:**
```bash
curl -X GET http://localhost:8000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

**Update Profile:**
```bash
curl -X PUT http://localhost:8000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'
```

**Change Password:**
```bash
curl -X POST http://localhost:8000/api/profile/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"current_password":"Old123!","password":"New123!","password_confirmation":"New123!"}'
```

#### Step 3.2: Test Frontend

1. Start the development server:
```bash
cd client
npm run dev
```

2. Login to the application
3. Click on user menu in navbar
4. Click "Profile Settings"
5. Verify the page loads correctly
6. Test profile update
7. Test password change

### 4. Troubleshooting

#### Backend Issues

**Error: Class 'UserProfileController' not found**
```bash
composer dump-autoload
php artisan config:clear
```

**Error: Route not found**
```bash
php artisan route:list | grep profile
php artisan route:clear
```

**Error: Unauthenticated**
- Verify JWT token is valid
- Check token expiration
- Verify middleware is applied

#### Frontend Issues

**Error: Module not found**
```bash
npm install
npm run dev
```

**Error: Cannot read property of undefined**
- Check if all files are created
- Verify import paths
- Check component exports

**Error: Network request failed**
- Verify backend is running
- Check API base URL in .env
- Verify CORS settings

### 5. Post-Installation

#### Step 5.1: Update Documentation
- Add route to navigation documentation
- Update API documentation
- Add to user manual

#### Step 5.2: Configure Production
Update production environment variables:

Backend `.env`:
```env
APP_ENV=production
APP_DEBUG=false
JWT_TTL=60
```

Frontend `.env.production`:
```env
VITE_API_BASE_URL=https://your-domain.com/api
```

#### Step 5.3: Security Checklist
- [ ] HTTPS enabled in production
- [ ] JWT secret is secure
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] Error messages don't expose sensitive info

#### Step 5.4: Performance Optimization
- [ ] Enable caching
- [ ] Optimize database queries
- [ ] Minify frontend assets
- [ ] Enable compression
- [ ] Configure CDN (if applicable)

### 6. Deployment

#### Backend Deployment
```bash
cd server
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Frontend Deployment
```bash
cd client
npm run build
```

Deploy the `dist` folder to your web server.

### 7. Monitoring

#### Backend Logs
```bash
tail -f server/storage/logs/laravel.log
```

#### Frontend Console
Check browser console for errors:
- Press F12
- Go to Console tab
- Look for errors or warnings

### 8. Backup

Before deployment, backup:
- Database
- Environment files
- User data
- Configuration files

```bash
# Backup database
mysqldump -u username -p database_name > backup.sql

# Backup files
tar -czf backup.tar.gz server/ client/
```

## Quick Commands Reference

### Backend
```bash
# Start server
php artisan serve

# Clear cache
php artisan cache:clear

# Run migrations
php artisan migrate

# View routes
php artisan route:list
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs
3. Verify all prerequisites
4. Check documentation
5. Contact development team

---

**Last Updated**: March 23, 2026
**Version**: 1.0.0

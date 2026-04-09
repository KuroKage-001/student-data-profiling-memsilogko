# Dual Portal Authentication - Testing Guide

## Test Environment Setup

### Prerequisites
1. Backend server running on configured port
2. Frontend development server running
3. Database with test users created
4. JWT authentication configured

### Create Test Users

Run these commands in Laravel Tinker:
```bash
php artisan tinker
```

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Admin User
User::create([
    'name' => 'Admin Test',
    'email' => 'admin@test.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'status' => 'active'
]);

// Department Chair User
User::create([
    'name' => 'Dept Chair Test',
    'email' => 'deptchair@test.com',
    'password' => Hash::make('password123'),
    'role' => 'dept_chair',
    'status' => 'active'
]);

// Faculty User
User::create([
    'name' => 'Faculty Test',
    'email' => 'faculty@test.com',
    'password' => Hash::make('password123'),
    'role' => 'faculty',
    'status' => 'active'
]);

// Student User
User::create([
    'name' => 'Student Test',
    'email' => 'student@test.com',
    'password' => Hash::make('password123'),
    'role' => 'student',
    'status' => 'active'
]);

// Inactive User
User::create([
    'name' => 'Inactive Test',
    'email' => 'inactive@test.com',
    'password' => Hash::make('password123'),
    'role' => 'student',
    'status' => 'inactive'
]);

// Suspended User
User::create([
    'name' => 'Suspended Test',
    'email' => 'suspended@test.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'status' => 'suspended'
]);
```

## Test Cases

### Test Suite 1: Admin Portal Access

#### Test 1.1: Admin Login via Admin Portal ✅
**Steps:**
1. Navigate to homepage
2. Click "Admin Portal" button
3. Verify URL is `/admin/login`
4. Verify header shows "Admin Portal"
5. Enter credentials:
   - Email: `admin@test.com`
   - Password: `password123`
6. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Success toast: "Login Successful..."
- ✅ Redirected to `/admin/dashboard`
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage

**Verification:**
```javascript
// Check localStorage
console.log(localStorage.getItem('token'));
console.log(JSON.parse(localStorage.getItem('user')));
```

#### Test 1.2: Department Chair Login via Admin Portal ✅
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `deptchair@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to `/admin/dashboard`

#### Test 1.3: Faculty Login via Admin Portal ✅
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `faculty@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to `/admin/dashboard`

#### Test 1.4: Student Login via Admin Portal ❌
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `student@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Access denied. This portal is for administrators and faculty only."
- ❌ No token stored
- ❌ Remains on login page

### Test Suite 2: Student Portal Access

#### Test 2.1: Student Login via Student Portal ✅
**Steps:**
1. Navigate to homepage
2. Click "Student Portal" button
3. Verify URL is `/login`
4. Verify header shows "Student Portal"
5. Enter credentials:
   - Email: `student@test.com`
   - Password: `password123`
6. Click "Sign In"

**Expected Result:**
- ✅ Login successful
- ✅ Success toast: "Login Successful..."
- ✅ Redirected to `/profile/settings`
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage

#### Test 2.2: Admin Login via Student Portal ❌
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Access denied. This portal is for students only. Please use the Admin Portal."
- ❌ No token stored
- ❌ Remains on login page

#### Test 2.3: Faculty Login via Student Portal ❌
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: `faculty@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Access denied. This portal is for students only. Please use the Admin Portal."

#### Test 2.4: Dept Chair Login via Student Portal ❌
**Steps:**
1. Navigate to `/login`
2. Enter credentials:
   - Email: `deptchair@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Access denied. This portal is for students only. Please use the Admin Portal."

### Test Suite 3: Account Status Validation

#### Test 3.1: Inactive Account Login ❌
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `inactive@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Your account is inactive. Please contact the administrator."
- ❌ No token stored

#### Test 3.2: Suspended Account Login ❌
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `suspended@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Your account has been suspended. Please contact the administrator."
- ❌ No token stored

### Test Suite 4: Invalid Credentials

#### Test 4.1: Wrong Password ❌
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `admin@test.com`
   - Password: `wrongpassword`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Invalid email or password"

#### Test 4.2: Non-existent Email ❌
**Steps:**
1. Navigate to `/admin/login`
2. Enter credentials:
   - Email: `nonexistent@test.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ❌ Login failed
- ❌ Error toast: "Invalid email or password"

#### Test 4.3: Empty Fields ❌
**Steps:**
1. Navigate to `/admin/login`
2. Leave email and password empty
3. Click "Sign In"

**Expected Result:**
- ❌ Form validation error
- ❌ Error toast with validation message

### Test Suite 5: UI/UX Validation

#### Test 5.1: Portal Header Display
**Steps:**
1. Navigate to `/admin/login`
2. Verify header text

**Expected Result:**
- ✅ Header shows "Admin Portal"
- ✅ Description: "Sign in to access the administrative dashboard and management tools"

**Steps:**
1. Navigate to `/login`
2. Verify header text

**Expected Result:**
- ✅ Header shows "Student Portal"
- ✅ Description: "Sign in to access your student profile and academic information"

#### Test 5.2: Loading State
**Steps:**
1. Navigate to `/admin/login`
2. Enter valid credentials
3. Click "Sign In"
4. Observe button state during request

**Expected Result:**
- ✅ Button shows loading state
- ✅ Button is disabled during request
- ✅ Loading indicator visible

#### Test 5.3: Password Visibility Toggle
**Steps:**
1. Navigate to `/admin/login`
2. Enter password
3. Click eye icon to toggle visibility

**Expected Result:**
- ✅ Password toggles between visible and hidden
- ✅ Icon changes appropriately

### Test Suite 6: API Response Validation

#### Test 6.1: Successful Login Response
**Expected Response Structure:**
```json
{
  "success": true,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "name": "Admin Test",
    "email": "admin@test.com",
    "role": "admin",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

#### Test 6.2: Portal Mismatch Response
**Expected Response Structure:**
```json
{
  "success": false,
  "message": "Access denied. This portal is for administrators and faculty only.",
  "portal_mismatch": true
}
```

#### Test 6.3: Invalid Credentials Response
**Expected Response Structure:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Test Suite 7: Security Validation

#### Test 7.1: Token Invalidation on Portal Mismatch
**Steps:**
1. Monitor network requests
2. Attempt student login via admin portal
3. Check if token is created then invalidated

**Expected Result:**
- ✅ No token stored in localStorage
- ✅ Backend calls auth()->logout()
- ✅ Token is invalidated if created

#### Test 7.2: Direct URL Access
**Steps:**
1. Without logging in, navigate to `/admin/dashboard`

**Expected Result:**
- ✅ Redirected to login page
- ✅ Protected route not accessible

#### Test 7.3: Token Expiration
**Steps:**
1. Login successfully
2. Wait for token to expire (or manually expire)
3. Try to access protected route

**Expected Result:**
- ✅ Redirected to login page
- ✅ Token refresh attempted or login required

## Automated Testing

### API Testing with Postman/Insomnia

#### Test: Admin Portal Login
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123",
  "portal_type": "admin"
}
```

#### Test: Student Portal Login
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123",
  "portal_type": "student"
}
```

#### Test: Portal Mismatch
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "student@test.com",
  "password": "password123",
  "portal_type": "admin"
}
```

### Unit Testing (Jest/React Testing Library)

```javascript
// Example test for useLoginForm hook
describe('useLoginForm', () => {
  it('should detect admin portal type', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/admin/login']}>
          {children}
        </MemoryRouter>
      ),
    });
    
    expect(result.current.portalType).toBe('admin');
  });

  it('should detect student portal type', () => {
    const { result } = renderHook(() => useLoginForm(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/login']}>
          {children}
        </MemoryRouter>
      ),
    });
    
    expect(result.current.portalType).toBe('student');
  });
});
```

### Backend Testing (PHPUnit)

```php
// Example test for AuthController
public function test_admin_can_login_via_admin_portal()
{
    $user = User::factory()->create([
        'role' => 'admin',
        'status' => 'active'
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
        'portal_type' => 'admin'
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'success',
                 'access_token',
                 'user'
             ]);
}

public function test_student_cannot_login_via_admin_portal()
{
    $user = User::factory()->create([
        'role' => 'student',
        'status' => 'active'
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => $user->email,
        'password' => 'password',
        'portal_type' => 'admin'
    ]);

    $response->assertStatus(403)
             ->assertJson([
                 'success' => false,
                 'portal_mismatch' => true
             ]);
}
```

## Test Results Template

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Execution Report                     │
├─────────────────────────────────────────────────────────────┤
│ Date: _______________                                        │
│ Tester: _____________                                        │
│ Environment: _________                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Test Suite 1: Admin Portal Access                            │
│   [ ] Test 1.1: Admin Login                                  │
│   [ ] Test 1.2: Dept Chair Login                             │
│   [ ] Test 1.3: Faculty Login                                │
│   [ ] Test 1.4: Student Login (should fail)                  │
│                                                              │
│ Test Suite 2: Student Portal Access                          │
│   [ ] Test 2.1: Student Login                                │
│   [ ] Test 2.2: Admin Login (should fail)                    │
│   [ ] Test 2.3: Faculty Login (should fail)                  │
│   [ ] Test 2.4: Dept Chair Login (should fail)               │
│                                                              │
│ Test Suite 3: Account Status                                 │
│   [ ] Test 3.1: Inactive Account                             │
│   [ ] Test 3.2: Suspended Account                            │
│                                                              │
│ Test Suite 4: Invalid Credentials                            │
│   [ ] Test 4.1: Wrong Password                               │
│   [ ] Test 4.2: Non-existent Email                           │
│   [ ] Test 4.3: Empty Fields                                 │
│                                                              │
│ Test Suite 5: UI/UX                                          │
│   [ ] Test 5.1: Portal Headers                               │
│   [ ] Test 5.2: Loading State                                │
│   [ ] Test 5.3: Password Toggle                              │
│                                                              │
│ Test Suite 6: API Responses                                  │
│   [ ] Test 6.1: Success Response                             │
│   [ ] Test 6.2: Portal Mismatch Response                     │
│   [ ] Test 6.3: Invalid Credentials Response                 │
│                                                              │
│ Test Suite 7: Security                                       │
│   [ ] Test 7.1: Token Invalidation                           │
│   [ ] Test 7.2: Direct URL Access                            │
│   [ ] Test 7.3: Token Expiration                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Overall Result: [ ] PASS  [ ] FAIL                           │
│ Notes: _____________________________________________________ │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting Common Issues

### Issue 1: Portal type not being sent
**Symptom:** All users can login regardless of portal
**Solution:** Check that `portal_type` is included in login request payload

### Issue 2: Wrong error messages
**Symptom:** Generic error instead of portal-specific message
**Solution:** Verify `portal_mismatch` flag is being handled in authService

### Issue 3: Token not invalidated on mismatch
**Symptom:** Token exists in localStorage after portal mismatch
**Solution:** Ensure `auth('api')->logout()` is called in AuthController

### Issue 4: Headers not changing
**Symptom:** Same header on both portals
**Solution:** Check LoginHeader component is using `useLocation` correctly

## Performance Testing

### Load Testing Scenarios
1. 100 concurrent admin logins
2. 100 concurrent student logins
3. Mixed portal access attempts
4. Portal mismatch scenarios under load

### Expected Performance
- Login response time: < 500ms
- Portal validation: < 50ms
- Token generation: < 100ms
- Database query: < 100ms

## Regression Testing Checklist

After any changes to authentication system:
- [ ] All test suites pass
- [ ] No new console errors
- [ ] Token storage working
- [ ] Redirects functioning
- [ ] Error messages correct
- [ ] UI displays properly
- [ ] Backend logs clean
- [ ] No security vulnerabilities introduced

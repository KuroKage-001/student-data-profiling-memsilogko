# Portal Separation - Quick Reference

## Portal URLs

### Public Access (No Authentication Required)
| Portal | URL | Description |
|--------|-----|-------------|
| Home | `/` | Main landing page with portal selection |
| Admin Portal | `/admin/portal` | Admin portal information and sign-in |
| Faculty Portal | `/faculty/portal` | Faculty portal information and sign-in |
| Student Portal | `/student/portal` | Student portal information and sign-in |

### Login Pages
| Portal | URL | Accessible From |
|--------|-----|-----------------|
| Admin Login | `/admin/login` | Admin Portal page |
| Faculty Login | `/faculty/login` | Faculty Portal page |
| Student Login | `/login` | Student Portal page |

### Dashboards (Authentication Required)
| Role | URL | Accessible After Login |
|------|-----|------------------------|
| Admin/Faculty/Dept Chair | `/admin/dashboard` | Admin/Faculty login |
| Student | `/student/dashboard` | Student login |

## Portal Color Schemes

| Portal | Primary Color | Hex Code | Usage |
|--------|---------------|----------|-------|
| Admin | Orange | `#ea580c` | Buttons, icons, hover states |
| Faculty | Blue | `#2563eb` | Buttons, icons, hover states |
| Student | Green | `#16a34a` | Buttons, icons, hover states |

## Component Files

### Portal Pages
```
client/src/pages/system-page/
├── HomePage.jsx              - Main landing page
├── AdminPortalPage.jsx       - Admin portal entry
├── FacultyPortalPage.jsx     - Faculty portal entry
└── StudentPortalPage.jsx     - Student portal entry
```

### Supporting Components
```
client/src/components/system-components/home-compo/
└── PortalCards.jsx           - Portal selection cards
```

### Configuration
```
client/src/config/
└── routeConfig.js            - Route definitions
```

## User Flow Diagrams

### Unauthenticated User
```
1. Visit Home (/)
2. Click Portal Card
3. View Portal Page (/admin|faculty|student/portal)
4. Click "Sign In" Button
5. Login Page (/admin/login | /faculty/login | /login)
6. Enter Credentials
7. Redirect to Dashboard
```

### Authenticated User
```
1. Visit Portal Page (/admin|faculty|student/portal)
2. Auto-redirect to Dashboard (based on role)
```

## Key Features by Portal

### Admin Portal (`/admin/portal`)
- 🔧 User Management
- 📊 Analytics & Reports
- ⚙️ System Configuration

### Faculty Portal (`/faculty/portal`)
- 📋 Student Profiling
- 📅 Class Scheduling
- 📈 Academic Reports

### Student Portal (`/student/portal`)
- 🆔 Personal Profile
- 📅 Class Schedule
- 📆 Events & Activities

## Common Tasks

### Adding a New Portal Feature
1. Open the portal page file (e.g., `AdminPortalPage.jsx`)
2. Add feature to the `features` array:
```javascript
{
  icon: <YourIcon className="text-3xl" />,
  title: 'Feature Title',
  description: 'Feature description'
}
```

### Changing Portal Colors
1. Open the portal page file
2. Update the color classes:
   - `bg-{color}-600` for buttons
   - `text-{color}-600` for icons/text
   - `hover:bg-{color}-700` for hover states

### Updating Portal Description
1. Open the portal page file
2. Find the `<p>` tag with description
3. Update the text content

### Modifying Navigation
1. Open `client/src/components/system-components/home-compo/PortalCards.jsx`
2. Update the `portals` array with new paths or descriptions

## Authentication Logic

### Portal Page Authentication Check
```javascript
useEffect(() => {
  if (!loading && isAuthenticated && user) {
    const userRole = user.role;
    
    // Redirect based on role
    if (userRole === 'admin' || userRole === 'dept_chair' || userRole === 'faculty') {
      navigate('/admin/dashboard', { replace: true });
    } else if (userRole === 'student') {
      navigate('/student/dashboard', { replace: true });
    }
  }
}, [isAuthenticated, user, loading, navigate]);
```

### Loading State
```javascript
if (loading) {
  return <LoadingPage message="Loading Portal..." subMessage="Please wait..." />;
}
```

## Troubleshooting

### Issue: Portal page not redirecting authenticated users
**Solution:** Check if `useAuth()` hook is properly imported and AuthContext is wrapping the app

### Issue: Portal cards not navigating
**Solution:** Verify the paths in `PortalCards.jsx` match the routes in `routeConfig.js`

### Issue: Colors not showing correctly
**Solution:** Ensure Tailwind CSS is configured to include the color variants used

### Issue: Icons not displaying
**Solution:** Check that `react-icons` is installed and icons are imported correctly

## Best Practices

1. **Keep portal pages focused** - Only show portal information and sign-in option
2. **Maintain consistent branding** - Use designated colors for each portal
3. **Clear call-to-action** - Make sign-in buttons prominent
4. **Responsive design** - Test on mobile, tablet, and desktop
5. **Loading states** - Always show loading indicators during auth checks
6. **Error handling** - Handle authentication errors gracefully

## Related Documentation

- [Full Implementation Guide](./PORTAL_SEPARATION_IMPLEMENTATION.md)
- [Authentication Context](../dual-portal-authentication/README.md)
- [Route Configuration](../dynamic-routing-documentations/)

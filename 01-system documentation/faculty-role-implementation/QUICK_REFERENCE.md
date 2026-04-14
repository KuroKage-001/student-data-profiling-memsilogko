# Faculty Role - Quick Reference Guide

## 🎯 Quick Overview

Faculty members can now access the admin dashboard and manage students, events, scheduling, and research materials.

---

## 🔑 Test Accounts

### IT Faculty
```
Email: faculty.it@ccs.edu
Password: Faculty@2024
Department: IT
Position: Associate Professor
```

### CS Faculty
```
Email: faculty.cs@ccs.edu
Password: Faculty@2024
Department: CS
Position: Assistant Professor
```

---

## 📱 Faculty Access

### ✅ Can Access
- Dashboard (faculty-specific view)
- Student Profiles (view all, edit academic records)
- Events (full CRUD)
- Scheduling (full CRUD)
- Research Materials (full CRUD)
- Profile Settings (own profile)

### ❌ Cannot Access
- User Management
- Faculty Profiles
- Instructions

---

## 🎨 Faculty Dashboard

### What Faculty Sees
**Header:** "Faculty Dashboard"
**Subtitle:** "Teaching and Academic Management"

**Stats (3 cards):**
1. Active Faculty
2. Total Faculty
3. Faculty on Leave

**Navigation Cards (2 cards):**
1. Faculty Profiles
2. Class Scheduling

---

## 📋 Sidebar Menu

Faculty sees these menu items:
1. Dashboard
2. Students
3. Events
4. Scheduling
5. Research

---

## 🔧 Implementation Files

### Frontend
- `client/src/config/routeConfig.js`
- `client/src/components/system-components/AdminSidebar.jsx`
- `client/src/pages/admin-pages/AdminDashboard.jsx`
- `client/src/components/admin-components/dashboard/DashboardStats.jsx`

### Backend
No changes needed - faculty role already exists.

---

## ✅ Quick Test

1. Login: `faculty.it@ccs.edu` / `Faculty@2024`
2. Should see: Faculty Dashboard
3. Check sidebar: 5 menu items
4. Check stats: 3 cards (no student count)
5. Test navigation: All pages should load

---

## 🚀 What's Different from Admin?

| Feature | Admin | Faculty |
|---------|-------|---------|
| Dashboard Title | "Admin Dashboard" | "Faculty Dashboard" |
| Stats Cards | 4 cards | 3 cards (no students) |
| Navigation Cards | 2 cards (Students, Faculty) | 2 cards (Faculty, Scheduling) |
| Sidebar Items | 9 items | 5 items |
| User Management | ✅ | ❌ |
| Faculty Profiles | ✅ | ❌ |
| Instructions | ✅ | ❌ |

---

## 📊 Permissions Matrix

| Action | Students | Events | Scheduling | Research |
|--------|----------|--------|------------|----------|
| View | ✅ | ✅ | ✅ | ✅ |
| Create | ❌ | ✅ | ✅ | ✅ |
| Edit | ✅ | ✅ | ✅ | ✅ |
| Delete | ❌ | ✅ | ✅ | ✅ |

---

## 🔍 Troubleshooting

### Faculty can't login
- Check email/password
- Verify role is 'faculty' in database
- Check status is 'active'

### Dashboard not showing
- Check routeConfig.js has 'faculty' in roles
- Clear browser cache
- Check console for errors

### Sidebar missing items
- Check AdminSidebar.jsx role arrays
- Verify user object has role property
- Check authentication token

---

## 📝 Notes

- Faculty has full access to existing features
- No ownership filtering implemented yet
- No advisee system implemented yet
- No class assignment system implemented yet

---

**Last Updated:** 2026-04-13
**Version:** 1.0.0

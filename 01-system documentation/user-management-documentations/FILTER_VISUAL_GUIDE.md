# User Management Filter - Visual Guide

## Before and After Comparison

### Before (No Filters)
```
┌─────────────────────────────────────────────────────────┐
│  User Management                                        │
├─────────────────────────────────────────────────────────┤
│  🔍 Search: [________________]  [+ Add User]           │
├─────────────────────────────────────────────────────────┤
│  User List                                              │
│  • All users shown                                      │
│  • Manual scrolling to find users                       │
│  • No quick filtering                                   │
└─────────────────────────────────────────────────────────┘
```

### After (With Filters)
```
┌─────────────────────────────────────────────────────────┐
│  User Management                                        │
├─────────────────────────────────────────────────────────┤
│  🔍 Search: [________________]  [+ Add User]           │
├─────────────────────────────────────────────────────────┤
│  Filters:                                               │
│  Role: [All Roles ▼]    Status: [All Statuses ▼]      │
├─────────────────────────────────────────────────────────┤
│  User List (Filtered)                                   │
│  • Quick role filtering                                 │
│  • Status filtering                                     │
│  • Combined filters                                     │
└─────────────────────────────────────────────────────────┘
```

## Desktop Layout

### Full View
```
╔═══════════════════════════════════════════════════════════╗
║  👥 User Management                                       ║
║  Manage system users and access control                  ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ┌─ Search ──────────────────┐  ┌──────────────┐        ║
║  │ 🔍 Search users...         │  │ + Add User   │        ║
║  └────────────────────────────┘  └──────────────┘        ║
║                                                           ║
║  ─────────────────────────────────────────────────────   ║
║                                                           ║
║  ┌─ Role ──────────────┐  ┌─ Status ──────────────┐     ║
║  │ All Roles        ▼  │  │ All Statuses       ▼  │     ║
║  └─────────────────────┘  └───────────────────────┘     ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║  User List                                                ║
║  ┌─────────────────────────────────────────────────┐     ║
║  │ 👤 John Doe                              ✏️ 🗑️  │     ║
║  │    john.doe@ccs.edu                              │     ║
║  │    Role: Student | Status: Active                │     ║
║  ├─────────────────────────────────────────────────┤     ║
║  │ 👤 Jane Smith                            ✏️ 🗑️  │     ║
║  │    jane.smith@ccs.edu                            │     ║
║  │    Role: Faculty | Status: Active                │     ║
║  └─────────────────────────────────────────────────┘     ║
╚═══════════════════════════════════════════════════════════╝
```

## Mobile Layout

### Collapsed Filters
```
┌───────────────────────────┐
│  👥 User Management       │
├───────────────────────────┤
│  🔍 [Search...]           │
│  [+ Add User]             │
├───────────────────────────┤
│  🔍 Filters (2) ▼         │
├───────────────────────────┤
│  User List                │
│  ┌─────────────────────┐ │
│  │ 👤 John Doe         │ │
│  │    Student          │ │
│  │    Active      ✏️ 🗑️│ │
│  ├─────────────────────┤ │
│  │ 👤 Jane Smith       │ │
│  │    Faculty          │ │
│  │    Active      ✏️ 🗑️│ │
│  └─────────────────────┘ │
└───────────────────────────┘
```

### Expanded Filters
```
┌───────────────────────────┐
│  👥 User Management       │
├───────────────────────────┤
│  🔍 [Search...]           │
│  [+ Add User]             │
├───────────────────────────┤
│  🔍 Filters (2) ▲         │
├───────────────────────────┤
│  Role:                    │
│  [Student ▼]              │
│                           │
│  Status:                  │
│  [Active ▼]               │
├───────────────────────────┤
│  User List (Filtered)     │
│  ┌─────────────────────┐ │
│  │ 👤 John Doe         │ │
│  │    Student          │ │
│  │    Active      ✏️ 🗑️│ │
│  └─────────────────────┘ │
└───────────────────────────┘
```

## Filter Dropdowns

### Role Dropdown
```
┌─────────────────────────┐
│ Role                    │
├─────────────────────────┤
│ ✓ All Roles             │
│   Administrator         │
│   Department Chairman   │
│   Faculty               │
│   Student               │
└─────────────────────────┘
```

### Status Dropdown
```
┌─────────────────────────┐
│ Status                  │
├─────────────────────────┤
│ ✓ All Statuses          │
│   Active                │
│   Inactive              │
│   Suspended             │
└─────────────────────────┘
```

## Filter States

### No Filters Active
```
┌─────────────────────────────────────┐
│ Role: [All Roles ▼]                 │
│ Status: [All Statuses ▼]            │
└─────────────────────────────────────┘
Badge: None
Results: All users
```

### One Filter Active
```
┌─────────────────────────────────────┐
│ Role: [Student ▼]                   │
│ Status: [All Statuses ▼]            │
└─────────────────────────────────────┘
Badge: (1)
Results: All students
```

### Two Filters Active
```
┌─────────────────────────────────────┐
│ Role: [Faculty ▼]                   │
│ Status: [Active ▼]                  │
└─────────────────────────────────────┘
Badge: (2)
Results: Active faculty only
```

## Filter Badge

### Mobile Toggle Button
```
No Filters:
┌─────────────────────────┐
│ 🔍 Filters ▼            │
└─────────────────────────┘

One Filter:
┌─────────────────────────┐
│ 🔍 Filters (1) ▼        │
└─────────────────────────┘

Two Filters:
┌─────────────────────────┐
│ 🔍 Filters (2) ▼        │
└─────────────────────────┘
```

## User List with Filters

### All Users (No Filter)
```
┌─────────────────────────────────────┐
│ 👤 Admin User                       │
│    admin@ccs.edu                    │
│    Administrator | Active           │
├─────────────────────────────────────┤
│ 👤 IT Chairman                      │
│    chair.it@ccs.edu                 │
│    Dept Chairman | Active           │
├─────────────────────────────────────┤
│ 👤 John Faculty                     │
│    john.faculty@ccs.edu             │
│    Faculty | Active                 │
├─────────────────────────────────────┤
│ 👤 Jane Student                     │
│    jane.student@ccs.edu             │
│    Student | Active                 │
└─────────────────────────────────────┘
```

### Students Only (Role Filter)
```
┌─────────────────────────────────────┐
│ 👤 Jane Student                     │
│    jane.student@ccs.edu             │
│    Student | Active                 │
├─────────────────────────────────────┤
│ 👤 John Student                     │
│    john.student@ccs.edu             │
│    Student | Inactive               │
├─────────────────────────────────────┤
│ 👤 Bob Student                      │
│    bob.student@ccs.edu              │
│    Student | Active                 │
└─────────────────────────────────────┘
```

### Active Faculty (Combined Filters)
```
┌─────────────────────────────────────┐
│ 👤 John Faculty                     │
│    john.faculty@ccs.edu             │
│    Faculty | Active                 │
├─────────────────────────────────────┤
│ 👤 Mary Faculty                     │
│    mary.faculty@ccs.edu             │
│    Faculty | Active                 │
└─────────────────────────────────────┘
```

## Workflow Diagrams

### Filter Selection Flow
```
Start
  ↓
Select Role Filter
  ↓
Select Status Filter
  ↓
API Request with Filters
  ↓
Results Update
  ↓
Display Filtered Users
```

### Combined Filter + Search Flow
```
Start
  ↓
Set Role: Student
  ↓
Set Status: Active
  ↓
Type Search: "john"
  ↓
API: ?role=student&status=active&search=john
  ↓
Display: Active students named John
```

## Color Coding

### Filter States
```
🟢 Default (All)
┌─────────────────────┐
│ All Roles       ▼   │
└─────────────────────┘
Gray background

🔵 Active Filter
┌─────────────────────┐
│ Student         ▼   │
└─────────────────────┘
White background

🟡 Focus State
┌─────────────────────┐
│ Faculty         ▼   │
└─────────────────────┘
Orange border
```

### Badge Colors
```
No Filters:
No badge shown

Active Filters:
┌───┐
│ 2 │ Orange background
└───┘ White text
```

## Responsive Breakpoints

### Desktop (≥1024px)
```
┌────────────────────────────────────────┐
│  [Search]  [Add User]                  │
│  [Role Filter]  [Status Filter]        │
│  [User List - Full Width]              │
└────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────────────────────┐
│  [Search]                              │
│  [Add User]                            │
│  [Role Filter]  [Status Filter]        │
│  [User List - Full Width]              │
└────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────┐
│  [Search]        │
│  [Add User]      │
│  [Filters (2) ▼] │
│  [User List]     │
└──────────────────┘
```

## Interactive Elements

### Hover States
```
Default:
┌─────────────────────┐
│ All Roles       ▼   │
└─────────────────────┘

Hover:
┌─────────────────────┐
│ All Roles       ▼   │ ← Lighter background
└─────────────────────┘

Active:
┌─────────────────────┐
│ All Roles       ▼   │ ← Slightly darker
└─────────────────────┘
```

### Focus States
```
Not Focused:
┌─────────────────────┐
│ All Roles       ▼   │
└─────────────────────┘

Focused:
┌═════════════════════┐
║ All Roles       ▼   ║ ← Orange border
└═════════════════════┘
```

## Loading States

### Filters Loading
```
┌─────────────────────────────────────┐
│ Role: [Loading... ⏳]               │
│ Status: [Loading... ⏳]             │
└─────────────────────────────────────┘
```

### Results Loading
```
┌─────────────────────────────────────┐
│ Role: [Student ▼]                   │
│ Status: [Active ▼]                  │
├─────────────────────────────────────┤
│                                     │
│        ⏳ Loading users...          │
│                                     │
└─────────────────────────────────────┘
```

## Empty States

### No Results
```
┌─────────────────────────────────────┐
│ Role: [Faculty ▼]                   │
│ Status: [Suspended ▼]               │
├─────────────────────────────────────┤
│                                     │
│   ℹ️ No users found                 │
│   Try different filters             │
│                                     │
└─────────────────────────────────────┘
```

## Icons Reference

| Icon | Meaning | Usage |
|------|---------|-------|
| 👥 | Users | Page header |
| 🔍 | Search | Search input, filter button |
| ➕ | Add | Add user button |
| 🔽 | Dropdown | Filter dropdowns |
| 🔼 | Collapse | Expanded filters |
| ✏️ | Edit | Edit user action |
| 🗑️ | Delete | Delete user action |
| ⏳ | Loading | Loading state |
| ℹ️ | Info | Empty state message |
| ✓ | Selected | Selected dropdown option |

## Accessibility Features

```
✓ Keyboard Navigation
  - Tab through filters
  - Arrow keys in dropdowns
  - Enter to select

✓ Screen Reader Support
  - ARIA labels on filters
  - Role descriptions
  - Status announcements

✓ Visual Indicators
  - Focus states
  - Active filters
  - Clear labels

✓ Color Contrast
  - WCAG AA compliant
  - Clear text visibility
  - Distinct states
```

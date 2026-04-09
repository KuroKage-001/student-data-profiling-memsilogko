# Student Dashboard - Visual Guide

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVBAR (Fixed Top)                       │
│  [☰] CCS Logo    [Student Name ▼] [Profile] [Logout]           │
└─────────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────────┐
│          │                                                       │
│ SIDEBAR  │                  MAIN CONTENT                        │
│          │                                                       │
│ [📊]     │  ┌─────────────────────────────────────────────┐    │
│Dashboard │  │         Welcome back, [Name]!                │    │
│          │  │    Your Academic Dashboard and Progress      │    │
│          │  └─────────────────────────────────────────────┘    │
│          │                                                       │
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│          │  │ GPA  │ │Units │ │Achiev│ │Events│              │
│          │  │ 3.45 │ │ 120  │ │  5   │ │  3   │              │
│          │  └──────┘ └──────┘ └──────┘ └──────┘              │
│          │                                                       │
│          │  ┌─────────────────────┐ ┌──────────────────┐      │
│          │  │ Academic Progress   │ │ Student Profile  │      │
│          │  │ ▓▓▓▓▓▓▓▓░░░ 80%    │ │ [👤] John Doe   │      │
│          │  │ 120/150 Units       │ │ 📧 Email        │      │
│          │  └─────────────────────┘ │ 🆔 Student ID   │      │
│          │                           │ 🎓 Program      │      │
│          │  ┌──────┐ ┌──────┐      └──────────────────┘      │
│          │  │Academ│ │Events│                                 │
│          │  │Records│ │      │      ┌──────────────────┐      │
│          │  └──────┘ └──────┘      │ Upcoming Events  │      │
│          │                          │ • Career Fair    │      │
│          │                          │ • Workshop       │      │
│          │                          │ • Seminar        │      │
│          │                          └──────────────────┘      │
│          │                                                       │
│          │  ┌─────────────────────────────────────────────┐    │
│          │  │           Need Help? Contact Support         │    │
│          │  │  [Contact Support] [View FAQs]              │    │
│          │  └─────────────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Header Section
```
┌─────────────────────────────────────────────────────────┐
│ [Orange Bar] Welcome back, John!                        │
│              Your Academic Dashboard and Progress       │
└─────────────────────────────────────────────────────────┘
```
- Personalized greeting
- Subtitle describing the page
- Orange accent bar on left

### 2. Statistics Cards (4 Cards)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Current GPA  │ │Units Complete│ │ Achievements │ │Upcoming Event│
│              │ │              │ │              │ │              │
│    3.45      │ │     120      │ │      5       │ │      3       │
│              │ │              │ │              │ │              │
│ [📊 Icon]    │ │ [📚 Icon]    │ │ [🏆 Icon]    │ │ [📅 Icon]    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```
- White cards with shadow
- Icon in colored background
- Large number display
- Hover effect: shadow increase

### 3. Main Content Grid (2 Columns on Desktop)

#### Left Column (2/3 width)

**Academic Progress Card**
```
┌─────────────────────────────────────────────┐
│ [📚] Academic Progress                      │
│                                             │
│ Course Completion              80%         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░          │
│                                             │
│ ┌──────────────┐ ┌──────────────┐         │
│ │     120      │ │     150      │         │
│ │Units Complete│ │ Total Units  │         │
│ └──────────────┘ └──────────────┘         │
│                                             │
│ ✓ Currently enrolled in SY 2025-2026 - S1 │
└─────────────────────────────────────────────┘
```
- Progress bar with percentage
- Units breakdown
- Current semester info

**Quick Links (2 Cards)**
```
┌──────────────────────┐ ┌──────────────────────┐
│ [📚] Academic Records│ │ [📅] Campus Events   │
│                      │ │                      │
│ View your grades,    │ │ Stay updated with    │
│ transcripts, and     │ │ campus activities    │
│ academic history     │ │ and events           │
└──────────────────────┘ └──────────────────────┘
```
- Hover effect: lift and shadow
- Icon with gradient background
- Descriptive text

#### Right Column (1/3 width)

**Student Profile Card**
```
┌─────────────────────────────────┐
│ [👤] John Doe                   │
│      Student                    │
│                                 │
│ [📧] Email                      │
│      john.doe@example.com       │
│                                 │
│ [🆔] Student ID                 │
│      2021-00001                 │
│                                 │
│ [🎓] Program                    │
│      BSCS                       │
└─────────────────────────────────┘
```
- Profile avatar (circular)
- Information rows with icons
- Clean, organized layout

**Upcoming Events Card**
```
┌─────────────────────────────────┐
│ [📅] Upcoming Events            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Career Fair                 │ │
│ │ 🕐 May 15, 2026            │ │
│ │ 📍 Main Auditorium         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Tech Workshop               │ │
│ │ 🕐 May 20, 2026            │ │
│ │ 📍 Computer Lab            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Research Seminar            │ │
│ │ 🕐 May 25, 2026            │ │
│ │ 📍 Conference Room         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```
- List of events (max 5)
- Event title, date, location
- Hover effect on event items

### 4. Help Section
```
┌─────────────────────────────────────────────────────────┐
│                      Need Help?                          │
│                                                          │
│ If you have any questions or need assistance, please    │
│ contact your academic advisor or visit the student      │
│ services office.                                         │
│                                                          │
│ [Contact Support]  [View FAQs]                          │
└─────────────────────────────────────────────────────────┘
```
- Orange gradient background
- White text
- Action buttons

## Responsive Layouts

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│                        NAVBAR                            │
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  HEADER                                      │
│          │  STATS (4 columns)                           │
│          │  ┌─────────────────┐ ┌──────────────┐       │
│          │  │ LEFT COLUMN     │ │ RIGHT COLUMN │       │
│          │  │ (2/3 width)     │ │ (1/3 width)  │       │
│          │  └─────────────────┘ └──────────────┘       │
│          │  HELP SECTION                                │
└──────────┴──────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────────────────────────┐
│                        NAVBAR                            │
├──────────┬──────────────────────────────────────────────┤
│ SIDEBAR  │  HEADER                                      │
│          │  STATS (2 columns)                           │
│          │  LEFT COLUMN (full width)                    │
│          │  RIGHT COLUMN (full width)                   │
│          │  HELP SECTION                                │
└──────────┴──────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│            NAVBAR                    │
│  [☰] Logo    [Profile ▼]           │
├─────────────────────────────────────┤
│  HEADER                             │
│  STATS (1 column)                   │
│  LEFT COLUMN (full width)           │
│  RIGHT COLUMN (full width)          │
│  HELP SECTION                       │
└─────────────────────────────────────┘
```
- Sidebar hidden by default
- Hamburger menu to toggle
- Single column layout
- Touch-friendly spacing

## Color Scheme

### Primary Colors
```
Orange:   #EA580C (Primary actions, accents)
Gray-900: #111827 (Text)
Gray-600: #4B5563 (Secondary text)
Gray-50:  #F9FAFB (Background)
White:    #FFFFFF (Cards)
```

### Stat Card Colors
```
GPA:          Orange (#EA580C)
Units:        Blue (#2563EB)
Achievements: Green (#16A34A)
Events:       Yellow (#CA8A04)
```

### Gradients
```
Header:     linear-gradient(to-br, from-gray-50 via-orange-50/30 to-gray-50)
Orange:     linear-gradient(to-r, from-orange-500 to-orange-600)
Progress:   linear-gradient(to-r, from-orange-500 to-orange-600)
```

## Icons

### Dashboard Icons
- 📊 Dashboard (sidebar)
- 📈 GPA (stat card)
- 📚 Units (stat card)
- 🏆 Achievements (stat card)
- 📅 Events (stat card)
- 👤 Profile (profile card)
- 📧 Email (profile card)
- 🆔 Student ID (profile card)
- 🎓 Program (profile card)
- 🕐 Time (events)
- 📍 Location (events)

## Animations

### Hover Effects
```
Cards:        transform: translateY(-4px)
              shadow: increase
              duration: 300ms

Buttons:      background: lighten
              scale: 1.05
              duration: 200ms

Progress Bar: width: animate
              duration: 500ms
```

### Loading States
```
Skeleton:     pulse animation
              gray background
              rounded corners
```

## Spacing System

### Padding
```
Cards:        p-6 (24px)
Sections:     p-8 (32px)
Mobile:       p-4 (16px)
```

### Gaps
```
Grid:         gap-6 (24px)
Stats:        gap-5 (20px)
Mobile:       gap-4 (16px)
```

### Margins
```
Sections:     mb-10 (40px)
Cards:        mb-6 (24px)
Mobile:       mb-4 (16px)
```

## Typography

### Font Sizes
```
Page Title:   text-4xl (36px)
Card Title:   text-xl (20px)
Stat Value:   text-3xl (30px)
Body Text:    text-base (16px)
Small Text:   text-sm (14px)
```

### Font Weights
```
Titles:       font-bold (700)
Stats:        font-bold (700)
Labels:       font-medium (500)
Body:         font-normal (400)
```

## Accessibility

### Focus States
- Visible focus rings
- Keyboard navigation support
- ARIA labels on interactive elements

### Color Contrast
- Text: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: clear visual feedback

### Screen Readers
- Semantic HTML
- Alt text for images
- Descriptive labels

## Print Layout
```
┌─────────────────────────────────────┐
│ Student Dashboard                    │
│ [Student Name]                       │
│                                      │
│ Statistics:                          │
│ • GPA: 3.45                         │
│ • Units: 120                        │
│ • Achievements: 5                   │
│                                      │
│ Academic Progress:                   │
│ • Completed: 120/150 units          │
│ • Progress: 80%                     │
│                                      │
│ Upcoming Events:                     │
│ • Career Fair - May 15, 2026        │
│ • Tech Workshop - May 20, 2026      │
└─────────────────────────────────────┘
```

## Loading States

### Initial Load
```
┌─────────────────────────────────────┐
│ [Gray Bar] ░░░░░░░░░░░░░░░░░░░░░░ │
│            ░░░░░░░░░░░░░░░░░░░░░░ │
│                                     │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ │░░░░░░│ │░░░░░░│ │░░░░░░│ │░░░░░░│
│ │░░░░░░│ │░░░░░░│ │░░░░░░│ │░░░░░░│
│ └──────┘ └──────┘ └──────┘ └──────┘
│                                     │
│ ┌─────────────────┐ ┌──────────┐  │
│ │░░░░░░░░░░░░░░░░│ │░░░░░░░░░░│  │
│ │░░░░░░░░░░░░░░░░│ │░░░░░░░░░░│  │
│ └─────────────────┘ └──────────┘  │
└─────────────────────────────────────┘
```
- Pulsing animation
- Gray placeholders
- Maintains layout structure

## Error States

### API Error
```
┌─────────────────────────────────────┐
│ ⚠️ Failed to load dashboard data    │
│                                      │
│ Please try refreshing the page or   │
│ contact support if the problem      │
│ persists.                           │
│                                      │
│ [Retry] [Contact Support]           │
└─────────────────────────────────────┘
```

### No Data
```
┌─────────────────────────────────────┐
│ 📭 No upcoming events                │
│                                      │
│ Check back later for new events!    │
└─────────────────────────────────────┘
```

This visual guide provides a comprehensive overview of the Student Dashboard layout, components, and design system.

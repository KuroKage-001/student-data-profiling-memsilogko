# Student Profile PDF Report - Format Specification

## Overview
This document specifies the exact format for displaying student data in the PDF report's second page.

## Page 2 Sections

### 1. VIOLATIONS Section

**Format:**
```
┌────────────────────────────────────────────────────────────┐
│ Violation Type │ Severity │ Date       │ Action Taken     │
├────────────────────────────────────────────────────────────┤
│ Late Arrival   │ Minor    │ Jan 5,2024 │ Warning issued   │
│ Dress Code     │ Minor    │ Feb 2,2024 │ Verbal warning   │
└────────────────────────────────────────────────────────────┘
```

**Columns:**
- Violation Type (50mm width)
- Severity (25mm width) - Minor/Moderate/Major
- Date (30mm width) - Formatted as "Mon DD, YYYY"
- Action Taken (81mm width)

**Display Rules:**
- Shows up to 6 violations
- Alternating row colors (white/light orange)
- If more than 6: Shows "+ X more violation(s)"
- Empty state: "No violations recorded"

---

### 2. AFFILIATIONS & ORGANIZATIONS Section

**Format:**
```
┌────────────────────────────────────────────────────────────┐
│ Organization Name │ Type      │ Role      │ Status        │
├────────────────────────────────────────────────────────────┤
│ Computer Society  │ Academic  │ President │ Active        │
│ Basketball Team   │ Sports    │ Member    │ Active        │
└────────────────────────────────────────────────────────────┘
```

**Columns:**
- Organization Name (60mm width)
- Type (40mm width) - Academic Org/Sports/Civic/Religious/Political/Other
- Role (40mm width)
- Status (46mm width) - Active/Inactive

**Display Rules:**
- Shows up to 6 affiliations
- Alternating row colors (white/light orange)
- Type values: Capitalize and replace underscores with spaces
- If more than 6: Shows "+ X more affiliation(s)"
- Empty state: "No affiliations recorded"

---

### 3. ACADEMIC HISTORY Section

**Format:**
```
┌────────────────────────────────────────────────────────────┐
│ 1st Sem — 2020-2021                GPA: 2.00  |  Passed   │
├────────────────────────────────────────────────────────────┤
│ Subject Code │ Subject Name            │ Units │ Grade    │
├────────────────────────────────────────────────────────────┤
│ CS101        │ Intro to Programming    │ 3.0   │ 1.75     │
│ MATH101      │ Calculus I              │ 3.0   │ 2.00     │
│ ENG101       │ English Composition     │ 3.0   │ 2.25     │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ 2nd Sem — 2020-2021                GPA: 2.25  |  Passed   │
├────────────────────────────────────────────────────────────┤
│ Subject Code │ Subject Name            │ Units │ Grade    │
├────────────────────────────────────────────────────────────┤
│ CS102        │ Data Structures         │ 3.0   │ 2.00     │
│ MATH102      │ Calculus II             │ 3.0   │ 2.50     │
└────────────────────────────────────────────────────────────┘
```

**Semester Header:**
- Format: `{semester} — {academic_year}     GPA: {gpa}  |  {remarks}`
- Example: "1st Sem — 2020-2021     GPA: 2.00  |  Passed"
- Background: Orange-600 (#EA580C)
- Text color: White
- Height: 7mm

**Subjects Table Columns:**
- Subject Code (35mm width)
- Subject Name (95mm width)
- Units (20mm width)
- Grade (36mm width)

**Display Rules:**
- Shows up to 3 academic records (semesters)
- Each semester shows up to 5 subjects
- Alternating row colors for subjects (white/very light orange)
- If more subjects: Shows "+ X more subject(s)" under each semester
- If more semesters: Shows "+ X more academic record(s)" at the end
- Empty state: "No academic records available"

---

## Data Formatting

### Date Format
- Input: ISO date string (YYYY-MM-DD)
- Output: "Mon DD, YYYY" (e.g., "Jan 5, 2024")
- Function: `formatDate(dateString)`

### GPA Format
- Input: Decimal number
- Output: Two decimal places (e.g., "2.00")
- Function: `formatGPA(gpa)`

### Text Capitalization
- Severity: Capitalize first letter (Minor, Moderate, Major)
- Affiliation Type: Capitalize and replace underscores (Academic Org, Sports)
- Function: `capitalize(str)`

---

## Color Scheme

### Primary Colors
- Orange-600: `rgb(234, 88, 12)` - Headers, accents
- Orange-700: `rgb(194, 65, 12)` - Section titles
- White: `rgb(255, 255, 255)` - Header text, backgrounds

### Background Colors
- Orange-50: `rgb(255, 247, 237)` - Section headers, alternating rows
- Orange-100: `rgb(255, 237, 213)` - Subject table headers
- Very Light Orange: `rgb(255, 251, 245)` - Subject alternating rows

### Text Colors
- Text Dark: `rgb(17, 24, 39)` - Primary text
- Text Medium: `rgb(75, 85, 99)` - Secondary text
- Text Light: `rgb(156, 163, 175)` - Tertiary text, hints

---

## Font Specifications

### Section Titles
- Font: Helvetica Bold
- Size: 10pt
- Color: Orange-700

### Table Headers
- Font: Helvetica Bold
- Size: 7pt (Violations/Affiliations), 6pt (Subjects)
- Color: White (on orange background)

### Table Content
- Font: Helvetica Normal
- Size: 7pt
- Color: Text Dark

### Semester Headers
- Font: Helvetica Bold
- Size: 8pt
- Color: White

---

## Space Management

### Maximum Items Per Section
- Violations: 6 items
- Affiliations: 6 items
- Academic Records: 3 semesters
- Subjects per Semester: 5 subjects

### Vertical Spacing
- Between sections: 4mm
- After section title: 9mm
- Between table rows: 5-6mm
- After overflow message: 3-5mm

### Page Boundaries
- Top margin: 12mm
- Bottom margin: 12mm (footer at 285mm)
- Left/Right margins: 12mm
- Content width: 186mm

---

## Implementation Notes

1. **Data Source**: Student object must include:
   - `violations` array
   - `affiliations` array
   - `academic_records` array with nested `subjects` array

2. **Overflow Handling**: When items exceed display limits, show count message

3. **Empty States**: Display friendly message when no data exists

4. **Responsive Layout**: Adjust spacing based on available content

5. **Page Break**: Academic History section checks for space (page2Y < 240mm)

---

## Testing Checklist

- [ ] Violations display correctly with all 4 columns
- [ ] Affiliations show Organization Name, Type, Role, Status
- [ ] Academic records show semester header with GPA and remarks
- [ ] Subjects table displays under each semester
- [ ] Overflow messages appear when limits exceeded
- [ ] Empty states display when no data
- [ ] Colors match specification
- [ ] Text is readable and properly aligned
- [ ] Page doesn't overflow (stays within margins)
- [ ] Footer shows "Page 2 of 2"

# Faculty Profile PDF Generation Update

## Overview
Updated the Faculty Profile PDF generation to match the Student Profile implementation, using jsPDF instead of @react-pdf/renderer for consistency and better performance.

## Changes Made

### 1. PDF Library Migration
- **Before**: Used `@react-pdf/renderer` with React components
- **After**: Uses `jsPDF` for direct PDF generation (same as Student Profiles)

### 2. Design Consistency
The Faculty PDF now matches the Student PDF design with:
- Professional header with institutional logo support
- Orange-600 (#EA580C) and Orange-700 (#C2410C) color scheme
- Four-column layout for efficient space utilization
- Status badge with color coding (Active: Green, Inactive: Red, On Leave: Yellow)
- Enhanced sections with decorative borders
- Professional footer with confidential marking

### 3. Layout Structure

#### Header Section
- Institutional logo (left)
- "FACULTY PROFILE REPORT" title
- Generated date and Faculty ID (right)
- Status badge with color coding
- Orange accent line separator

#### Content Sections (4-Column Layout)
1. **Personal Information**
   - Phone
   - Address

2. **Professional Information**
   - Department
   - Position
   - Specialization

3. **Office Information**
   - Office Location
   - Hire Date

4. **Status Highlight**
   - Current status in a card format

#### Full-Width Sections
- **Additional Notes** (if available)
  - Orange-accented design with left border
  - Enhanced background styling

#### Footer
- System branding
- "CONFIDENTIAL DOCUMENT" marking

### 4. File Naming Convention
```
faculty_report_[FACULTY_ID]_[DATE].pdf
```
Example: `faculty_report_FAC001_2026-03-30.pdf`

### 5. Function Signature
```javascript
export const generateFacultyPDF = async (faculty) => {
  // Generates and downloads PDF
  // Returns: filename string
  // Throws: Error if generation fails
}
```

### 6. Usage in FacultyProfiles.jsx
```javascript
const handleGenerateReport = async (faculty) => {
  try {
    await generateFacultyPDF(faculty);
    showSuccess(`PDF report generated for ${faculty.name}`);
  } catch (err) {
    showError('Failed to generate PDF report');
  }
};
```

## Benefits

1. **Consistency**: Matches Student Profile PDF design and implementation
2. **Performance**: jsPDF is faster and more lightweight than @react-pdf/renderer
3. **Maintainability**: Single PDF generation approach across the system
4. **Professional Output**: Clean, modern design with institutional branding
5. **Space Optimization**: Four-column layout maximizes page usage

## Technical Details

### Dependencies
- `jspdf`: ^2.5.2 (already installed)

### Color Palette
- Orange-600: RGB(234, 88, 12) - Primary accent
- Orange-700: RGB(194, 65, 12) - Secondary accent
- Gray-900: RGB(17, 24, 39) - Primary text
- Gray-600: RGB(75, 85, 99) - Secondary text
- Gray-400: RGB(156, 163, 175) - Tertiary text
- White: RGB(255, 255, 255) - Background

### Status Colors
- Active: RGB(16, 185, 129) - Green
- Inactive: RGB(239, 68, 68) - Red
- On Leave: RGB(245, 158, 11) - Yellow

## Files Modified

1. `client/src/components/admin-components/faculty-profile-compo/facultyReportPdf.jsx`
   - Complete rewrite using jsPDF
   - Matches student PDF generator structure

2. `client/src/pages/admin-pages/FacultyProfiles.jsx`
   - No changes needed (already using correct function signature)

## Testing Checklist

- [ ] PDF generates successfully for faculty with all fields
- [ ] PDF generates successfully for faculty with minimal data
- [ ] Logo displays correctly (if available)
- [ ] Status badge shows correct color
- [ ] All sections render properly
- [ ] Notes section displays when available
- [ ] File downloads with correct naming convention
- [ ] Error handling works when generation fails

## Notes

- Logo path: `/ccs-logo.png` (loaded from public folder)
- Logo loading is optional - PDF generates without it if unavailable
- All date fields use format: "MMM DD, YYYY" (e.g., "Mar 30, 2026")
- Text wrapping is automatic for long content
- PDF size: A4 (210mm x 297mm)

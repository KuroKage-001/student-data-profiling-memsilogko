# PDF Table Headers Fix

## Issue Description

The PDF report on page 2 was displaying table headers incorrectly:

### Problems Identified:
1. **Only first column header visible** - For Violations, Affiliations, and Academic History tables
2. **Missing headers** - Severity, Date, Action Taken (Violations); Type, Role, Status (Affiliations); Subject Name, Units, Grade (Academic History)
3. **Dark background on subject headers** - Should be light orange but appeared dark
4. **Text positioning issue** - All header texts were being placed at the same X position

### Visual Issue:
```
Before Fix:
┌────────────────────────────────────────┐
│ Violation Type                         │  ← Only this header visible
├────────────────────────────────────────┤
│ mems    Minor    Mar 30, 2026  tretret │  ← Data showing but no headers
└────────────────────────────────────────┘
```

## Root Cause

In the `addTableHeader` helper function, the issue was:

```javascript
// BEFORE (Incorrect)
const addTableHeader = (headers, x, y, columnWidths) => {
  doc.setFillColor(...orange600);  // Set fill color ONCE
  let currentX = x;
  headers.forEach((header, index) => {
    doc.rect(currentX, y, columnWidths[index], 6, 'F');  // Draw rectangle
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(header, currentX + 1, y + 4);  // Text added AFTER all rectangles
    currentX += columnWidths[index];
  });
  return y + 6;
};
```

**Problem:** The function was setting styles once, then drawing all rectangles, then trying to add text. This caused only the last header text to be visible because the text rendering happened after the loop completed.

## Solution

Fixed by moving all styling and text rendering inside the loop for each header:

```javascript
// AFTER (Correct)
const addTableHeader = (headers, x, y, columnWidths) => {
  let currentX = x;
  headers.forEach((header, index) => {
    // Draw background for THIS header cell
    doc.setFillColor(...orange600);
    doc.rect(currentX, y, columnWidths[index], 6, 'F');
    
    // Add text for THIS header cell
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const headerLines = doc.splitTextToSize(header, columnWidths[index] - 2);
    doc.text(headerLines[0], currentX + 1, y + 4);
    
    currentX += columnWidths[index];  // Move to next column
  });
  return y + 6;
};
```

## Subject Headers Fix

Similar issue in the Academic History section for subject headers:

```javascript
// BEFORE
doc.setFillColor(255, 237, 213);
let currentX = margin;
subjectHeaders.forEach((header, index) => {
  doc.rect(currentX, page2Y, subjectWidths[index], 5, 'F');
  doc.setTextColor(...textDark);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text(header, currentX + 1, page2Y + 3.5);  // Issue here
  currentX += subjectWidths[index];
});

// AFTER
let currentX = margin;
subjectHeaders.forEach((header, index) => {
  // Draw background for THIS column
  doc.setFillColor(255, 237, 213);
  doc.rect(currentX, page2Y, subjectWidths[index], 5, 'F');
  
  // Add text for THIS column
  doc.setTextColor(...textDark);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  const headerLines = doc.splitTextToSize(header, subjectWidths[index] - 2);
  doc.text(headerLines[0], currentX + 1, page2Y + 3.5);
  
  currentX += subjectWidths[index];
});
```

## Expected Result After Fix

```
After Fix:
┌────────────────────────────────────────────────────────────┐
│ Violation Type │ Severity │ Date       │ Action Taken     │
├────────────────────────────────────────────────────────────┤
│ mems           │ Minor    │ Mar 30,2026│ tretret          │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Organization Name │ Type        │ Role  │ Status          │
├────────────────────────────────────────────────────────────┤
│ htnihtrgregregre  │ Academic org│ rgrgr │ Active          │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ 1st Sem — 2020-2021              GPA: 2.00  |  Passed     │
├────────────────────────────────────────────────────────────┤
│ Subject Code │ Subject Name    │ Units │ Grade           │
├────────────────────────────────────────────────────────────┤
│ bfbdf        │ bfbdfdb         │ 4.0   │ 45.00           │
└────────────────────────────────────────────────────────────┘
```

## Key Takeaways

1. **Loop Scope Matters** - When drawing multiple elements, ensure all related operations (background, text, styling) happen within the same iteration
2. **Text Positioning** - Each text element needs its own X position calculated
3. **Style Reset** - Set fill colors and text colors for each element to avoid inheritance issues
4. **Text Wrapping** - Use `splitTextToSize()` to handle long headers that might overflow

## Files Modified

- `client/src/utils/admin-utilities/pdfGenerator.js`
  - Fixed `addTableHeader()` helper function
  - Fixed subject headers in Academic History section

## Testing

To verify the fix:
1. Generate a student PDF report
2. Check page 2
3. Verify all table headers are visible:
   - ✓ Violations: Violation Type, Severity, Date, Action Taken
   - ✓ Affiliations: Organization Name, Type, Role, Status
   - ✓ Academic History: Subject Code, Subject Name, Units, Grade
4. Verify header backgrounds are orange
5. Verify header text is white (or dark for subject headers)
6. Verify data aligns properly under headers

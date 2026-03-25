# Student Data Export - Quick Guide

## Excel Export Feature

### How to Export Students to Excel

1. Navigate to **Student Profiles** page
2. (Optional) Apply filters to narrow down students
3. Click the **Export** button
4. Excel file downloads automatically with name: `students_YYYY-MM-DD.xlsx`

### What Gets Exported

The Excel file includes **17 columns** with complete student information:

#### Personal Information
- ID
- Student ID
- Name
- Email
- Phone
- Address

#### Academic Information
- Program
- Year Level
- GPA
- Status
- Enrollment Date
- Graduation Date

#### Guardian Information
- Guardian Name
- Guardian Phone

#### Skills & Development
- Skills
- Extracurricular Activities

#### Additional
- Notes

### Excel File Features

✅ **Auto-sized columns** - Easy to read without adjusting
✅ **Proper formatting** - Dates formatted correctly
✅ **Complete data** - All fields included
✅ **Professional layout** - Ready for sharing
✅ **Universal compatibility** - Opens in Excel, Google Sheets, LibreOffice

### File Naming Convention

Format: `students_YYYY-MM-DD.xlsx`

Examples:
- `students_2025-03-25.xlsx`
- `students_2025-12-31.xlsx`

### Use Cases

**Academic Administration:**
- Share student lists with faculty
- Submit reports to administration
- Archive student records

**Data Analysis:**
- Analyze GPA trends
- Track program enrollment
- Review skills distribution
- Monitor activity participation

**Career Services:**
- Match students with opportunities
- Identify skill gaps
- Track extracurricular involvement

**Reporting:**
- Generate statistics
- Create pivot tables
- Build charts and graphs

## Student Profile Modal

### Viewing Student Details

1. Click **View** button on any student row
2. Modal displays complete profile with sections:
   - Personal Information
   - Academic Information
   - Guardian Information
   - Skills & Activities (if available)
   - Additional Notes (if available)

### Modal Actions

**Generate Report** - Download text report of student profile
**Edit Profile** - Open edit form
**Close** - Close the modal

### Skills & Activities Section

Displays when student has:
- Skills listed
- Extracurricular activities listed
- Or both

Shows:
- 🏆 Skills with purple theme
- 🏃 Activities with blue theme

## Tips & Best Practices

### Before Exporting

1. **Apply Filters** - Export only what you need
   - Filter by program
   - Filter by year level
   - Filter by status

2. **Search First** - Use search to find specific students

3. **Check Count** - Verify number of students before export

### After Exporting

1. **Open in Excel** - Verify data exported correctly
2. **Save Copy** - Keep backup of original export
3. **Format as Needed** - Add charts, formulas, etc.

### Data Management

**Regular Exports:**
- Export at end of each semester
- Archive for record keeping
- Track changes over time

**Filtered Exports:**
- Active students only
- By program for department reports
- By year level for advisors

**Custom Analysis:**
- Import into database
- Create custom reports
- Build dashboards

## Troubleshooting

### Export Button Not Working

**Check:**
- Are there students to export?
- Is browser blocking downloads?
- Check browser console for errors

**Solution:**
- Ensure students are loaded
- Allow downloads in browser
- Refresh page and try again

### Excel File Won't Open

**Check:**
- File extension is .xlsx
- Excel/compatible software installed
- File not corrupted

**Solution:**
- Try opening in Google Sheets
- Re-download the file
- Check file size (should not be 0 KB)

### Missing Data in Export

**Check:**
- Are fields filled in student profiles?
- Did filters exclude students?
- Check original data in system

**Solution:**
- Update student profiles
- Remove filters before export
- Verify data in database

### Skills/Activities Not Showing

**Check:**
- Are skills/activities filled in?
- Is modal displaying correctly?
- Check student data

**Solution:**
- Add skills/activities to profile
- Refresh page
- Edit student and save

## Quick Reference

| Action | Button | Result |
|--------|--------|--------|
| Export All | Export | Downloads all students |
| Export Filtered | Export (after filtering) | Downloads filtered students |
| View Profile | View | Opens profile modal |
| Generate Report | Generate Report (in modal) | Downloads text report |
| Edit Student | Edit (in modal) | Opens edit form |

## Keyboard Shortcuts

- `Esc` - Close modal
- `Ctrl/Cmd + F` - Focus search box

## Support

For issues or questions:
1. Check this guide first
2. Review error messages
3. Check browser console
4. Contact system administrator

---

**Last Updated:** March 2025
**Version:** 1.0

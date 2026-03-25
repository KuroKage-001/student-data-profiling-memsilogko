# Student Profile Filters - Quick Guide

## Available Filters

### 1. Program Filter (Dropdown)
**Type:** Select from list
**Options:**
- All Programs
- Computer Science
- Information Technology
- Computer Engineering
- Data Science
- Software Engineering
- Information Systems
- Cybersecurity
- Artificial Intelligence
- Computer Networks
- Web Development

**How to Use:**
1. Click the Program dropdown
2. Select a program
3. Results filter immediately
4. Select "All Programs" to clear

### 2. Year Level Filter (Dropdown)
**Type:** Select from list
**Options:**
- All Year Levels
- 1st Year
- 2nd Year
- 3rd Year
- 4th Year
- 5th Year

**How to Use:**
1. Click the Year Level dropdown
2. Select a year level
3. Results filter immediately
4. Select "All Year Levels" to clear

### 3. Skills Filter (Text Input) 🆕
**Type:** Free text search
**Searches:** Student skills field

**How to Use:**
1. Type skill name (e.g., "Python", "Leadership")
2. Results filter as you type
3. Partial matches included
4. Delete text to clear

**Examples:**
- "Python" - Finds students with Python skills
- "Java" - Finds students with Java skills
- "Lead" - Finds students with Leadership skills
- "Design" - Finds students with Design skills

### 4. Activities Filter (Text Input) 🆕
**Type:** Free text search
**Searches:** Extracurricular activities field

**How to Use:**
1. Type activity name (e.g., "Basketball", "Debate")
2. Results filter as you type
3. Partial matches included
4. Delete text to clear

**Examples:**
- "Basketball" - Finds basketball players
- "Club" - Finds students in any club
- "Volunteer" - Finds students doing volunteer work
- "Music" - Finds students in music activities

## Filter Combinations

### Example 1: Find Python Developers in CS
```
Program: Computer Science
Skills: Python
```
**Result:** CS students who know Python

### Example 2: Find 3rd Year Students in Sports
```
Year Level: 3rd Year
Activities: Basketball
```
**Result:** 3rd year students playing basketball

### Example 3: Find IT Students with Leadership
```
Program: Information Technology
Skills: Leadership
```
**Result:** IT students with leadership skills

### Example 4: Find Students in Multiple Activities
```
Activities: Club
```
**Result:** All students in any club

### Example 5: Advanced Search
```
Search Bar: React
Program: Computer Science
Skills: JavaScript
```
**Result:** CS students with JavaScript, searching for React

## Search Bar vs Filters

### Search Bar
- Searches: Name, ID, Email, Program, Skills, Activities
- Use for: Quick general search
- Example: "John" finds John Doe

### Filters
- Specific field filtering
- Use for: Targeted search
- Example: Skills="Python" finds only students with Python

### Combined
- Search + Filters work together
- Most powerful search method
- Example: Search "John" + Skills="Python" = John with Python skills

## Tips & Tricks

### 1. Start Broad, Then Narrow
```
Step 1: Select Program
Step 2: Add Skills filter
Step 3: Add Activities filter
```

### 2. Use Partial Matches
```
Instead of: "JavaScript Programming"
Type: "Java"
Finds: JavaScript, Java, etc.
```

### 3. Clear Filters Quickly
```
Dropdowns: Select "All"
Text Inputs: Delete text
Search Bar: Clear button
```

### 4. Case Insensitive
```
"python" = "Python" = "PYTHON"
All work the same
```

### 5. Real-time Results
```
No need to press Enter
Results update as you type
```

## Common Use Cases

### Career Services

**Find Students for Job Posting:**
```
Skills: [Required skill from job]
Program: [Relevant program]
Year Level: [Graduation year]
```

**Find Students for Internship:**
```
Year Level: 3rd Year
Skills: [Internship requirements]
```

### Academic Advising

**Find Students Needing Support:**
```
Program: [Specific program]
Year Level: [Target year]
Activities: [Empty - no activities]
```

**Find Well-Rounded Students:**
```
Skills: Leadership
Activities: [Any activity]
```

### Club Recruitment

**Find Potential Members:**
```
Activities: [Related activity]
Skills: [Relevant skills]
```

**Find Club Leaders:**
```
Skills: Leadership
Activities: Club
```

### Research Projects

**Find Research Assistants:**
```
Program: [Relevant program]
Skills: [Research skills]
Year Level: 3rd Year or 4th Year
```

### Event Planning

**Find Event Volunteers:**
```
Activities: Volunteer
Skills: [Event-related skills]
```

## Filter Behavior

### AND Logic
All filters work together:
```
Program: CS + Skills: Python
= CS students AND Python skills
```

### Partial Matching
Text filters match anywhere:
```
Skills: "Script"
Matches: JavaScript, TypeScript, Scripting
```

### Empty Filters
Empty = No filter applied:
```
Skills: [empty]
= All students (no skills filter)
```

## Keyboard Shortcuts

- `Tab` - Move between filters
- `Enter` - Apply dropdown selection
- `Esc` - Close dropdown
- `Ctrl/Cmd + F` - Focus search bar

## Mobile Usage

### Portrait Mode
- Filters stack vertically
- One filter per row
- Easy thumb access

### Landscape Mode
- 2 filters per row
- More compact layout
- Faster filtering

## Troubleshooting

### No Results Found

**Check:**
1. Are filters too restrictive?
2. Is spelling correct?
3. Try partial match instead

**Solution:**
- Remove one filter at a time
- Use broader search terms
- Check if data exists

### Too Many Results

**Solution:**
- Add more filters
- Use more specific terms
- Combine multiple filters

### Filter Not Working

**Check:**
1. Is field populated in database?
2. Is backend supporting filter?
3. Check browser console

**Solution:**
- Verify data exists
- Contact administrator
- Refresh page

## Best Practices

### 1. Start Simple
Begin with one filter, add more as needed

### 2. Use Relevant Filters
Choose filters that match your goal

### 3. Combine Strategically
Use 2-3 filters for best results

### 4. Clear When Done
Reset filters for next search

### 5. Save Common Searches
Note down useful filter combinations

## Quick Reference Table

| Filter | Type | Matching | Clear Method |
|--------|------|----------|--------------|
| Program | Dropdown | Exact | Select "All Programs" |
| Year Level | Dropdown | Exact | Select "All Year Levels" |
| Skills | Text | Partial | Delete text |
| Activities | Text | Partial | Delete text |
| Search Bar | Text | Partial | Clear button |

## Examples by Role

### Administrator
```
Use: All filters
Goal: Comprehensive student management
```

### Career Counselor
```
Focus: Skills + Program
Goal: Match students with opportunities
```

### Club Advisor
```
Focus: Activities + Year Level
Goal: Recruit and manage members
```

### Faculty
```
Focus: Program + Year Level
Goal: Track student progress
```

### Research Coordinator
```
Focus: Skills + Program
Goal: Find research assistants
```

## Support

Need help with filters?
1. Check this guide
2. Try example searches
3. Contact system administrator

---

**Last Updated:** March 2025
**Version:** 1.1.0

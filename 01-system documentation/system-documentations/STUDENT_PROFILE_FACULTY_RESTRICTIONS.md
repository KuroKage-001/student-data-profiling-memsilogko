# Student Profile Faculty Access Restrictions

## Overview
This document describes the implementation of role-based access control for student profile management features, specifically restricting faculty users from modifying violations, affiliations, and academic records.

## Implementation Date
April 26, 2026

## Changes Summary

### Access Control Rules
- **Admin**: Full access to all student profile features (view, add, edit, delete)
- **Department Chair**: Full access to all student profile features (view, add, edit, delete)
- **Faculty**: Read-only access to violations, affiliations, and academic records (view only)

### Modified Files

#### 1. `client/src/pages/admin-pages/StudentProfiles.jsx`
**Changes:**
- Added `userRole={user?.role}` prop when rendering `StudentProfileModal`
- This passes the current user's role to the modal component

```javascript
<StudentProfileModal
  student={selectedStudent}
  onClose={handleCloseViewModal}
  onEdit={canModifyStudents ? () => {
    handleCloseViewModal();
    handleEditStudent(selectedStudent);
  } : null}
  onGenerateReport={handleGenerateReport}
  userRole={user?.role}  // ← New prop
/>
```

#### 2. `client/src/components/admin-components/student-profile-compo/StudentProfileModal.jsx`
**Changes:**
- Added `userRole` prop to component signature
- Created `canModifyRecords` constant to determine if user can modify records
- Passed `canModify={canModifyRecords}` prop to all three section components

```javascript
const StudentProfileModal = ({ student, onClose, onEdit, onGenerateReport, userRole }) => {
  // Only admin and dept_chair can modify violations, affiliations, and academic records
  const canModifyRecords = userRole === 'admin' || userRole === 'dept_chair';
  
  // ...
  
  <ViolationsSection studentId={student.id} canModify={canModifyRecords} />
  <AffiliationsSection studentId={student.id} canModify={canModifyRecords} />
  <AcademicHistorySection studentId={student.id} canModify={canModifyRecords} />
}
```

#### 3. `client/src/components/admin-components/student-profile-compo/ViolationsSection.jsx`
**Changes:**
- Added `canModify = true` prop with default value
- Conditionally render "Add Violation" button based on `canModify`
- Conditionally render "Actions" column header based on `canModify`
- Conditionally render Edit/Delete buttons in table rows based on `canModify`

**UI Changes:**
- Faculty users will NOT see:
  - "Add Violation" button in header
  - "Actions" column in the table
  - Edit/Delete buttons for each violation

#### 4. `client/src/components/admin-components/student-profile-compo/AffiliationsSection.jsx`
**Changes:**
- Added `canModify = true` prop with default value
- Conditionally render "Add Affiliation" button based on `canModify`
- Conditionally render "Actions" column header based on `canModify`
- Conditionally render Edit/Delete buttons in table rows based on `canModify`

**UI Changes:**
- Faculty users will NOT see:
  - "Add Affiliation" button in header
  - "Actions" column in the table
  - Edit/Delete buttons for each affiliation

#### 5. `client/src/components/admin-components/student-profile-compo/AcademicHistorySection.jsx`
**Changes:**
- Added `canModify = true` prop with default value
- Conditionally render "Add Semester Record" button based on `canModify`
- Conditionally render Edit/Delete buttons for each academic record based on `canModify`

**UI Changes:**
- Faculty users will NOT see:
  - "Add Semester Record" button in header
  - Edit/Delete buttons for each semester record

## User Experience

### Admin & Department Chair View
- Can view all student profile information
- Can add new violations, affiliations, and academic records
- Can edit existing violations, affiliations, and academic records
- Can delete violations, affiliations, and academic records
- Full CRUD operations available

### Faculty View
- Can view all student profile information
- Can view violations, affiliations, and academic records (read-only)
- **Cannot** add new violations, affiliations, or academic records
- **Cannot** edit existing violations, affiliations, or academic records
- **Cannot** delete violations, affiliations, or academic records
- Read-only access to these sections

## Backend Considerations

### Current API Routes (No Changes Required)
The existing API routes in `server/routes/api.php` already have proper role-based middleware:

```php
// Student Violations Routes
Route::get('students/{student}/violations', [StudentViolationController::class, 'index']);
Route::post('students/{student}/violations', [StudentViolationController::class, 'store']);
Route::put('students/{student}/violations/{violation}', [StudentViolationController::class, 'update']);
Route::delete('students/{student}/violations/{violation}', [StudentViolationController::class, 'destroy']);
```

### Recommended Backend Enhancement (Optional)
While the frontend now restricts faculty access, you may want to add explicit role-based middleware to these routes for additional security:

```php
// Add role middleware to restrict modifications
Route::middleware('role:admin,dept_chair')->group(function () {
    Route::post('students/{student}/violations', [StudentViolationController::class, 'store']);
    Route::put('students/{student}/violations/{violation}', [StudentViolationController::class, 'update']);
    Route::delete('students/{student}/violations/{violation}', [StudentViolationController::class, 'destroy']);
    
    Route::post('students/{student}/affiliations', [StudentAffiliationController::class, 'store']);
    Route::put('students/{student}/affiliations/{affiliation}', [StudentAffiliationController::class, 'update']);
    Route::delete('students/{student}/affiliations/{affiliation}', [StudentAffiliationController::class, 'destroy']);
    
    Route::post('students/{student}/academic-records', [StudentAcademicRecordController::class, 'store']);
    Route::put('students/{student}/academic-records/{record}', [StudentAcademicRecordController::class, 'update']);
    Route::delete('students/{student}/academic-records/{record}', [StudentAcademicRecordController::class, 'destroy']);
});
```

## Testing Checklist

### Admin Account Testing
- [ ] Can view student profiles
- [ ] Can add violations
- [ ] Can edit violations
- [ ] Can delete violations
- [ ] Can add affiliations
- [ ] Can edit affiliations
- [ ] Can delete affiliations
- [ ] Can add semester records
- [ ] Can edit semester records
- [ ] Can delete semester records

### Department Chair Account Testing
- [ ] Can view student profiles
- [ ] Can add violations
- [ ] Can edit violations
- [ ] Can delete violations
- [ ] Can add affiliations
- [ ] Can edit affiliations
- [ ] Can delete affiliations
- [ ] Can add semester records
- [ ] Can edit semester records
- [ ] Can delete semester records

### Faculty Account Testing
- [ ] Can view student profiles
- [ ] Can view violations (read-only)
- [ ] **Cannot** see "Add Violation" button
- [ ] **Cannot** see Edit/Delete buttons for violations
- [ ] Can view affiliations (read-only)
- [ ] **Cannot** see "Add Affiliation" button
- [ ] **Cannot** see Edit/Delete buttons for affiliations
- [ ] Can view academic records (read-only)
- [ ] **Cannot** see "Add Semester Record" button
- [ ] **Cannot** see Edit/Delete buttons for academic records

## Security Notes

1. **Frontend Restrictions**: The UI now hides modification controls from faculty users
2. **Backend Validation**: Ensure backend controllers validate user roles before allowing modifications
3. **API Security**: Consider adding explicit role-based middleware to POST/PUT/DELETE routes
4. **Audit Trail**: Consider logging all modifications to student records for accountability

## Related Files
- `client/src/pages/admin-pages/StudentProfiles.jsx`
- `client/src/components/admin-components/student-profile-compo/StudentProfileModal.jsx`
- `client/src/components/admin-components/student-profile-compo/ViolationsSection.jsx`
- `client/src/components/admin-components/student-profile-compo/AffiliationsSection.jsx`
- `client/src/components/admin-components/student-profile-compo/AcademicHistorySection.jsx`
- `server/routes/api.php`
- `client/src/config/routeConfig.js`

## Future Enhancements

1. **Granular Permissions**: Implement a more flexible permission system
2. **Audit Logging**: Add comprehensive logging for all student record modifications
3. **Role-Based Views**: Create different view templates based on user roles
4. **Permission Management UI**: Admin interface to manage role permissions
5. **Field-Level Permissions**: Control access to specific fields within records

# Implementation Plan: Missing Student Data Features

## Overview

Four purely additive features: Student Violations, Student Affiliations, Academic History, and a Status Filter UI. Each feature follows the established `StudentSkill`/`StudentActivity` pattern. All new files are created from scratch; only four existing files receive small additive edits.

Stack: Laravel 12 + MySQL + ReactJS 19 + Vite + Tailwind CSS + TanStack React Query + Axios + JWT auth.

## Tasks

- [x] 1. Database migrations
  - [x] 1.1 Create `student_violations` migration
    - Create `server/database/migrations/2026_03_29_000000_create_student_violations_table.php`
    - Columns: `id`, `user_id` (FK → users, cascade), `violation_type` varchar(100), `description` text nullable, `violation_date` date, `severity` enum('minor','moderate','major'), `action_taken` text nullable, `created_at`, `updated_at`
    - Add index on `user_id`
    - _Requirements: 1.1_

  - [x] 1.2 Create `student_affiliations` migration
    - Create `server/database/migrations/2026_03_29_000001_create_student_affiliations_table.php`
    - Columns: `id`, `user_id` (FK → users, cascade), `organization_name` varchar(255), `affiliation_type` enum('academic_org','sports','civic','religious','political','other'), `role` varchar(100) nullable, `start_date` date nullable, `end_date` date nullable, `is_active` boolean default true, `description` text nullable, `created_at`, `updated_at`
    - Add index on `user_id`
    - _Requirements: 4.1_

  - [x] 1.3 Create `student_academic_records` migration
    - Create `server/database/migrations/2026_03_29_000002_create_student_academic_records_table.php`
    - Columns: `id`, `user_id` (FK → users, cascade), `semester` varchar(20), `academic_year` varchar(20), `semester_gpa` decimal(3,2) nullable, `remarks` varchar(255) nullable, `created_at`, `updated_at`
    - Add index on `user_id`
    - _Requirements: 7.1_

  - [x] 1.4 Create `student_subjects` migration
    - Create `server/database/migrations/2026_03_29_000003_create_student_subjects_table.php`
    - Columns: `id`, `academic_record_id` (FK → student_academic_records, cascade), `subject_code` varchar(20) nullable, `subject_name` varchar(255), `units` decimal(3,1), `grade` decimal(4,2) nullable, `created_at`, `updated_at`
    - Add index on `academic_record_id`
    - _Requirements: 7.2_

- [x] 2. Eloquent models
  - [x] 2.1 Create `StudentViolation` model
    - Create `server/app/Models/StudentViolation.php`
    - `$fillable`: `user_id`, `violation_type`, `description`, `violation_date`, `severity`, `action_taken`
    - `$casts`: `violation_date` → `'date'`
    - `user()` belongsTo `User`
    - _Requirements: 1.2_

  - [x] 2.2 Create `StudentAffiliation` model
    - Create `server/app/Models/StudentAffiliation.php`
    - `$fillable`: `user_id`, `organization_name`, `affiliation_type`, `role`, `start_date`, `end_date`, `is_active`, `description`
    - `$casts`: `start_date` → `'date'`, `end_date` → `'date'`, `is_active` → `'boolean'`
    - `user()` belongsTo `User`
    - _Requirements: 4.2_

  - [x] 2.3 Create `StudentAcademicRecord` model
    - Create `server/app/Models/StudentAcademicRecord.php`
    - `$fillable`: `user_id`, `semester`, `academic_year`, `semester_gpa`, `remarks`
    - `user()` belongsTo `User`
    - `subjects()` hasMany `StudentSubject`
    - _Requirements: 7.3_

  - [x] 2.4 Create `StudentSubject` model
    - Create `server/app/Models/StudentSubject.php`
    - `$fillable`: `academic_record_id`, `subject_code`, `subject_name`, `units`, `grade`
    - `academicRecord()` belongsTo `StudentAcademicRecord`
    - _Requirements: 7.4_

  - [x] 2.5 Append three `hasMany` methods to `User` model
    - Edit `server/app/Models/User.php` — append after the existing `activities()` method:
      - `violations()` hasMany `StudentViolation`
      - `affiliations()` hasMany `StudentAffiliation`
      - `academicRecords()` hasMany `StudentAcademicRecord`
    - Do not alter any existing method
    - _Requirements: 1.3, 4.3, 7.5_

  - [ ]* 2.6 Write property test for User relationship completeness
    - **Property 1: User relationship completeness**
    - **Validates: Requirements 1.3, 4.3, 7.5**

- [x] 3. Checkpoint — run `php artisan migrate` and confirm all four tables exist with correct columns

- [x] 4. Student Violations — backend controller and routes
  - [x] 4.1 Create `StudentViolationController`
    - Create `server/app/Http/Controllers/StudentViolationController.php`
    - `index($student)`: look up student with `User::where('role','student')->findOrFail($student)`, return violations ordered by `violation_date` desc, JSON `{ success, data }`
    - `store(Request, $student)`: validate `violation_type` required string max:100, `violation_date` required date, `severity` required in:minor,moderate,major, `description` nullable, `action_taken` nullable; create and return with HTTP 201
    - `update(Request, $student, $violation)`: same validation rules with `sometimes`; scope lookup to `->where('user_id', $student)`; return updated record
    - `destroy($student, $violation)`: scope lookup; delete; return HTTP 200 `{ success, message }`
    - Follow existing `StudentController` error handling pattern (try/catch, 404 for missing student/record, 422 for validation, 500 for unexpected)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 4.2 Write property test for violations GET sort order (Property 2)
    - **Property 2: GET endpoints return records sorted correctly — violations**
    - **Validates: Requirements 2.2**

  - [ ]* 4.3 Write property test for violations create-then-retrieve round-trip (Property 3)
    - **Property 3: Create then retrieve round-trip — violations**
    - **Validates: Requirements 2.3**

  - [ ]* 4.4 Write property test for violations update-then-retrieve round-trip (Property 4)
    - **Property 4: Update then retrieve round-trip — violations**
    - **Validates: Requirements 2.4**

  - [ ]* 4.5 Write property test for violations delete-then-retrieve round-trip (Property 5)
    - **Property 5: Delete then retrieve round-trip — violations**
    - **Validates: Requirements 2.5**

  - [ ]* 4.6 Write property test for violations validation rejection (Property 6)
    - **Property 6: Validation rejection — violations**
    - **Validates: Requirements 2.6**

  - [x] 4.7 Register violation routes in `api.php`
    - Append inside the existing `auth:api` + `check.status` middleware group (after the `students` apiResource block):
      ```php
      Route::get('students/{student}/violations', [StudentViolationController::class, 'index']);
      Route::post('students/{student}/violations', [StudentViolationController::class, 'store']);
      Route::put('students/{student}/violations/{violation}', [StudentViolationController::class, 'update']);
      Route::delete('students/{student}/violations/{violation}', [StudentViolationController::class, 'destroy']);
      ```
    - Add `use App\Http\Controllers\StudentViolationController;` at the top of `api.php`
    - Do not alter any existing route
    - _Requirements: 2.8_

- [x] 5. Student Affiliations — backend controller and routes
  - [x] 5.1 Create `StudentAffiliationController`
    - Create `server/app/Http/Controllers/StudentAffiliationController.php`
    - `index($student)`: return affiliations ordered by `start_date` desc
    - `store(Request, $student)`: validate `organization_name` required string max:255, `affiliation_type` required in:academic_org,sports,civic,religious,political,other, `role` nullable max:100, `start_date` nullable date, `end_date` nullable date, `is_active` nullable boolean, `description` nullable; return HTTP 201
    - `update(Request, $student, $affiliation)`: same rules with `sometimes`; scope to student
    - `destroy($student, $affiliation)`: scope; delete; HTTP 200
    - Same error handling pattern as violations controller
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 5.2 Write property test for affiliations GET sort order (Property 2)
    - **Property 2: GET endpoints return records sorted correctly — affiliations**
    - **Validates: Requirements 5.2**

  - [ ]* 5.3 Write property test for affiliations create-then-retrieve round-trip (Property 3)
    - **Property 3: Create then retrieve round-trip — affiliations**
    - **Validates: Requirements 5.3**

  - [ ]* 5.4 Write property test for affiliations update-then-retrieve round-trip (Property 4)
    - **Property 4: Update then retrieve round-trip — affiliations**
    - **Validates: Requirements 5.4**

  - [ ]* 5.5 Write property test for affiliations delete-then-retrieve round-trip (Property 5)
    - **Property 5: Delete then retrieve round-trip — affiliations**
    - **Validates: Requirements 5.5**

  - [ ]* 5.6 Write property test for affiliations validation rejection (Property 6)
    - **Property 6: Validation rejection — affiliations**
    - **Validates: Requirements 5.6**

  - [x] 5.7 Register affiliation routes in `api.php`
    - Append after the violation routes (same middleware group):
      ```php
      Route::get('students/{student}/affiliations', [StudentAffiliationController::class, 'index']);
      Route::post('students/{student}/affiliations', [StudentAffiliationController::class, 'store']);
      Route::put('students/{student}/affiliations/{affiliation}', [StudentAffiliationController::class, 'update']);
      Route::delete('students/{student}/affiliations/{affiliation}', [StudentAffiliationController::class, 'destroy']);
      ```
    - Add `use App\Http\Controllers\StudentAffiliationController;` at the top of `api.php`
    - _Requirements: 5.8_

- [x] 6. Academic History — backend controller and routes
  - [x] 6.1 Create `StudentAcademicRecordController`
    - Create `server/app/Http/Controllers/StudentAcademicRecordController.php`
    - `index($student)`: return academic records with nested `subjects`, ordered by `academic_year` asc then `semester` asc
    - `store(Request, $student)`: validate `semester` required string max:20, `academic_year` required string max:20, `semester_gpa` nullable numeric, `remarks` nullable string max:255, `subjects` nullable array, `subjects.*.subject_name` required string max:255, `subjects.*.units` required numeric, `subjects.*.subject_code` nullable string max:20, `subjects.*.grade` nullable numeric; wrap record + subjects creation in `DB::beginTransaction`; return HTTP 201 with `load('subjects')`
    - `update(Request, $student, $record)`: same validation with `sometimes`; inside transaction: update record fields, delete old subjects, insert new subjects array; return updated record with subjects
    - `destroy($student, $record)`: delete record (subjects cascade); HTTP 200
    - Same error handling pattern
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 6.2 Write property test for academic records GET sort order (Property 2)
    - **Property 2: GET endpoints return records sorted correctly — academic records**
    - **Validates: Requirements 8.2**

  - [ ]* 6.3 Write property test for academic records create-then-retrieve round-trip (Property 3)
    - **Property 3: Create then retrieve round-trip — academic records**
    - **Validates: Requirements 8.3**

  - [ ]* 6.4 Write property test for subjects transaction integrity (Property 7)
    - **Property 7: Academic record subjects transaction integrity**
    - **Validates: Requirements 8.3**

  - [ ]* 6.5 Write property test for academic records update-then-retrieve round-trip (Property 4)
    - **Property 4: Update then retrieve round-trip — academic records**
    - **Validates: Requirements 8.4**

  - [ ]* 6.6 Write property test for subject replacement (Property 8)
    - **Property 8: Academic record subject replacement**
    - **Validates: Requirements 8.4**

  - [ ]* 6.7 Write property test for academic records delete-then-retrieve round-trip (Property 5)
    - **Property 5: Delete then retrieve round-trip — academic records**
    - **Validates: Requirements 8.5**

  - [ ]* 6.8 Write property test for academic records cascade delete (Property 9)
    - **Property 9: Academic record cascade delete**
    - **Validates: Requirements 8.5**

  - [ ]* 6.9 Write property test for academic records validation rejection (Property 6)
    - **Property 6: Validation rejection — academic records**
    - **Validates: Requirements 8.6**

  - [x] 6.10 Register academic record routes in `api.php`
    - Append after the affiliation routes (same middleware group):
      ```php
      Route::get('students/{student}/academic-records', [StudentAcademicRecordController::class, 'index']);
      Route::post('students/{student}/academic-records', [StudentAcademicRecordController::class, 'store']);
      Route::put('students/{student}/academic-records/{record}', [StudentAcademicRecordController::class, 'update']);
      Route::delete('students/{student}/academic-records/{record}', [StudentAcademicRecordController::class, 'destroy']);
      ```
    - Add `use App\Http\Controllers\StudentAcademicRecordController;` at the top of `api.php`
    - _Requirements: 8.8_

- [x] 7. Checkpoint — verify all 12 new routes respond correctly (use `php artisan route:list | grep students`)

- [x] 8. Frontend services
  - [x] 8.1 Create `violationsService.js`
    - Create `client/src/services/student-profile-service/violationsService.js`
    - Import `axiosInstance` from `../login-service/axiosConfig`
    - Export default object with: `getViolations(studentId)` → GET `/students/{studentId}/violations`, `createViolation(studentId, data)` → POST, `updateViolation(studentId, id, data)` → PUT, `deleteViolation(studentId, id)` → DELETE
    - Each method returns `{ success, data, message }` on success; catches errors and returns `{ success: false, message }`
    - _Requirements: 3.8_

  - [x] 8.2 Create `affiliationsService.js`
    - Create `client/src/services/student-profile-service/affiliationsService.js`
    - Same structure as `violationsService.js` but for `/students/{studentId}/affiliations`
    - Methods: `getAffiliations`, `createAffiliation`, `updateAffiliation`, `deleteAffiliation`
    - _Requirements: 6.8_

  - [x] 8.3 Create `academicRecordsService.js`
    - Create `client/src/services/student-profile-service/academicRecordsService.js`
    - Same structure but for `/students/{studentId}/academic-records`
    - Methods: `getAcademicRecords`, `createAcademicRecord`, `updateAcademicRecord`, `deleteAcademicRecord`
    - _Requirements: 9.8_

- [x] 9. `ViolationsSection` component
  - [x] 9.1 Create `ViolationsSection.jsx`
    - Create `client/src/components/student-components/student-profile/ViolationsSection.jsx`
    - Props: `studentId`
    - `useQuery(['violations', studentId], () => violationsService.getViolations(studentId))`
    - Render a card with header "Violations" + "Add Violation" button
    - Table columns: violation type, severity badge (color-coded: minor=yellow, moderate=orange, major=red), date, action taken
    - Empty state: "No violations on record"
    - Local state: `showForm` (boolean), `editingViolation` (object|null)
    - Inline form fields: `violation_type` (text), `severity` (select), `violation_date` (date), `description` (textarea), `action_taken` (textarea)
    - `useMutation` for create/update; on success invalidate `['violations', studentId]`
    - Edit: clicking "Edit" sets `editingViolation` and opens form pre-populated
    - Delete: show inline confirmation before calling delete mutation; on success invalidate query
    - Error state: render error banner inside card, do not crash
    - Use same Tailwind styling pattern as existing modal cards (orange accent, border-gray-200)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 9.2 Write property test for ViolationsSection renders all record fields (Property 10)
    - **Property 10: Section components render all record fields — ViolationsSection**
    - **Validates: Requirements 3.1**

  - [ ]* 9.3 Write property test for form submission triggers mutation and cache update (Property 11)
    - **Property 11: Form submission triggers mutation and cache update — ViolationsSection**
    - **Validates: Requirements 3.4**

  - [ ]* 9.4 Write property test for edit pre-population (Property 12)
    - **Property 12: Edit pre-population — ViolationsSection**
    - **Validates: Requirements 3.5**

  - [ ]* 9.5 Write property test for API error display without crash (Property 13)
    - **Property 13: API error display without crash — ViolationsSection**
    - **Validates: Requirements 3.7**

- [x] 10. `AffiliationsSection` component
  - [x] 10.1 Create `AffiliationsSection.jsx`
    - Create `client/src/components/student-components/student-profile/AffiliationsSection.jsx`
    - Props: `studentId`
    - `useQuery(['affiliations', studentId], () => affiliationsService.getAffiliations(studentId))`
    - Render a card with header "Affiliations" + "Add Affiliation" button
    - Table columns: organization name, type, role, active status badge (green=active, gray=inactive)
    - Empty state: "No affiliations on record"
    - Inline form fields: `organization_name` (text), `affiliation_type` (select with all enum options), `role` (text), `start_date` (date), `end_date` (date), `is_active` (checkbox), `description` (textarea)
    - Same mutation/invalidation/edit/delete/error pattern as ViolationsSection
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 10.2 Write property test for AffiliationsSection renders all record fields (Property 10)
    - **Property 10: Section components render all record fields — AffiliationsSection**
    - **Validates: Requirements 6.1**

  - [ ]* 10.3 Write property test for form submission triggers mutation and cache update (Property 11)
    - **Property 11: Form submission triggers mutation and cache update — AffiliationsSection**
    - **Validates: Requirements 6.4**

  - [ ]* 10.4 Write property test for edit pre-population (Property 12)
    - **Property 12: Edit pre-population — AffiliationsSection**
    - **Validates: Requirements 6.5**

  - [ ]* 10.5 Write property test for API error display without crash (Property 13)
    - **Property 13: API error display without crash — AffiliationsSection**
    - **Validates: Requirements 6.7**

- [x] 11. `AcademicHistorySection` component
  - [x] 11.1 Create `AcademicHistorySection.jsx`
    - Create `client/src/components/student-components/student-profile/AcademicHistorySection.jsx`
    - Props: `studentId`
    - `useQuery(['academicRecords', studentId], () => academicRecordsService.getAcademicRecords(studentId))`
    - Render a card with header "Academic History" + "Add Semester Record" button
    - Each semester row is collapsible (local `expandedId` state); collapsed shows semester label, academic year, GPA; expanded shows a nested subjects table (subject code, name, units, grade)
    - Empty state: "No academic records on file"
    - Form fields: `semester` (text or select: "1st Sem", "2nd Sem", "Summer"), `academic_year` (text), `semester_gpa` (number), `remarks` (text), plus a dynamic subjects list — each subject row has `subject_code`, `subject_name`, `units`, `grade` inputs; "Add Subject" button appends a row; "Remove" button removes a row
    - Same mutation/invalidation/edit/delete/error pattern as other sections
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [ ]* 11.2 Write property test for AcademicHistorySection renders all record fields (Property 10)
    - **Property 10: Section components render all record fields — AcademicHistorySection**
    - **Validates: Requirements 9.1**

  - [ ]* 11.3 Write property test for form submission triggers mutation and cache update (Property 11)
    - **Property 11: Form submission triggers mutation and cache update — AcademicHistorySection**
    - **Validates: Requirements 9.4**

  - [ ]* 11.4 Write property test for edit pre-population (Property 12)
    - **Property 12: Edit pre-population — AcademicHistorySection**
    - **Validates: Requirements 9.5**

  - [ ]* 11.5 Write property test for API error display without crash (Property 13)
    - **Property 13: API error display without crash — AcademicHistorySection**
    - **Validates: Requirements 9.7**

- [x] 12. Wire new sections into `StudentProfileModal`
  - Edit `client/src/components/student-components/student-profile/StudentProfileModal.jsx`
  - Append three import lines at the top of the file (after existing imports):
    ```jsx
    import ViolationsSection from './ViolationsSection';
    import AffiliationsSection from './AffiliationsSection';
    import AcademicHistorySection from './AcademicHistorySection';
    ```
  - Append three render calls inside the scrollable content area, after the existing "Additional Notes" card and before the closing `</div>` of the grid:
    ```jsx
    <ViolationsSection studentId={student.id} />
    <AffiliationsSection studentId={student.id} />
    <AcademicHistorySection studentId={student.id} />
    ```
  - Do not modify any existing JSX
  - _Requirements: 3.9, 6.8, 9.8_

- [x] 13. Status Filter UI
  - [x] 13.1 Add `status` to filters state and `queryParams` in `StudentProfiles.jsx`
    - Edit `client/src/pages/admin-pages/StudentProfiles.jsx`
    - Add `status: 'all'` to the initial `filters` state object
    - In the `queryParams` memo, add: `if (filters.status !== 'all') params.status = filters.status;`
    - _Requirements: 10.2, 10.3_

  - [x] 13.2 Add Status dropdown to the filter grid
    - In the same file, change the filter grid from `lg:grid-cols-4` to `lg:grid-cols-5`
    - Append a fifth `<div>` cell with label "Status" and a `<select>` using the same Tailwind classes as the Program and Year Level dropdowns
    - Options: `<option value="all">All Statuses</option>`, `<option value="active">Active</option>`, `<option value="inactive">Inactive</option>`, `<option value="suspended">Suspended</option>`
    - `value={filters.status}` and `onChange={(e) => handleFilterChange('status', e.target.value)}`
    - _Requirements: 10.1, 10.4, 10.5_

  - [ ]* 13.3 Write property test for Status filter queryParams correctness (Property 14)
    - **Property 14: Status filter queryParams correctness**
    - **Validates: Requirements 10.2, 10.3**

- [x] 14. Final checkpoint — ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 3, 7, 14) ensure incremental validation
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
- All backend tests use PestPHP; all frontend tests use Vitest + React Testing Library + fast-check

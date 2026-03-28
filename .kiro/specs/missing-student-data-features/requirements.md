# Requirements Document

## Introduction

This document defines requirements for four missing features in the existing Student Profiling System. The system is built on Laravel 12 (backend) and ReactJS 19 + Vite + Tailwind CSS (frontend) with PostgreSQL as the database. All additions are purely additive — no existing files, routes, migrations, or components are modified or relocated.

The four features are:
1. **Student Violations** — a dedicated section to record, view, add, edit, and delete disciplinary violations per student.
2. **Student Affiliations** — a separate section for organizational and sports memberships, distinct from the existing Extracurricular Activities section.
3. **Academic History** — structured per-semester academic records (subjects, grades, GPA per semester), supplementing the existing single GPA field.
4. **Status Filter UI** — a dropdown on the Student Profiles page that sends the existing `?status=` query parameter already supported by `StudentController@index`.

---

## Glossary

- **System**: The Student Profiling System as a whole.
- **Admin**: An authenticated user with the `admin` role who manages student records.
- **Student**: A user record with `role = 'student'` in the `users` table.
- **Violation_Module**: The new backend + frontend subsystem for student violations.
- **Affiliation_Module**: The new backend + frontend subsystem for student affiliations.
- **AcademicHistory_Module**: The new backend + frontend subsystem for per-semester academic records.
- **StatusFilter**: The new status dropdown UI element on the Student Profiles page.
- **StudentController**: The existing `server/app/Http/Controllers/StudentController.php`.
- **StudentProfiles_Page**: The existing `client/src/pages/admin-pages/StudentProfiles.jsx`.
- **StudentFormModal**: The existing `client/src/components/admin-components/student-profile-compo/StudentFormModal.jsx`.
- **StudentProfileModal**: The existing `client/src/components/student-components/student-profile/StudentProfileModal.jsx`.
- **studentProfileService**: The existing `client/src/services/student-profile-service/studentProfileService.js`.
- **Violation**: A disciplinary record linked to a student, containing a type, description, date, and severity.
- **Affiliation**: An organizational or sports membership record linked to a student, containing an organization name, type, role, and date range.
- **AcademicRecord**: A per-semester record linked to a student, containing semester label, academic year, subjects with grades, and a computed semester GPA.
- **Subject**: A single course entry within an AcademicRecord, containing a subject name, units, and grade.

---

## Requirements

### Requirement 1: Student Violations — Database

**User Story:** As an Admin, I want violations stored in a dedicated database table, so that disciplinary records are persisted and queryable independently of other student data.

#### Acceptance Criteria

1. THE System SHALL provide a new migration that creates a `student_violations` table with columns: `id`, `user_id` (foreign key to `users`, cascade delete), `violation_type` (string, max 100), `description` (text, nullable), `violation_date` (date), `severity` (enum: `minor`, `moderate`, `major`), `action_taken` (text, nullable), `created_at`, `updated_at`.
2. THE System SHALL provide a new `StudentViolation` Eloquent model with a `belongsTo` relationship to `User` and a `user_id` fillable field.
3. THE System SHALL add a `violations()` `hasMany` relationship method to the `User` model without removing or altering any existing method on that model.

---

### Requirement 2: Student Violations — API

**User Story:** As an Admin, I want a RESTful API for student violations, so that the frontend can perform full CRUD operations on violation records.

#### Acceptance Criteria

1. THE System SHALL provide a new `StudentViolationController` with `index`, `store`, `update`, and `destroy` actions scoped to a specific student (`/students/{student}/violations`).
2. WHEN an Admin requests `GET /students/{student}/violations`, THE StudentViolationController SHALL return all violations for that student ordered by `violation_date` descending.
3. WHEN an Admin submits a valid `POST /students/{student}/violations` request, THE StudentViolationController SHALL create a new violation record and return it with HTTP 201.
4. WHEN an Admin submits a valid `PUT /students/{student}/violations/{violation}` request, THE StudentViolationController SHALL update the specified violation and return the updated record.
5. WHEN an Admin submits a `DELETE /students/{student}/violations/{violation}` request, THE StudentViolationController SHALL delete the specified violation and return HTTP 200 with a success message.
6. IF a request body fails validation (missing `violation_type`, `violation_date`, or invalid `severity`), THEN THE StudentViolationController SHALL return HTTP 422 with field-level error messages.
7. IF the specified student does not exist, THEN THE StudentViolationController SHALL return HTTP 404.
8. THE System SHALL register the violation routes inside the existing `auth:api` + `check.status` middleware group in `api.php` without altering any existing route definition.

---

### Requirement 3: Student Violations — Frontend

**User Story:** As an Admin, I want a Violations tab or section inside the student profile view, so that I can see, add, edit, and delete a student's violations without leaving the profile.

#### Acceptance Criteria

1. THE System SHALL provide a new `ViolationsSection` React component that displays a list of violations for a given student, with columns for violation type, severity, date, and action taken.
2. WHEN the Violations section is rendered with no violations, THE ViolationsSection SHALL display an empty-state message indicating no violations on record.
3. WHEN an Admin clicks "Add Violation", THE ViolationsSection SHALL display an inline form or modal with fields for `violation_type`, `severity`, `violation_date`, `description`, and `action_taken`.
4. WHEN an Admin submits a valid add-violation form, THE ViolationsSection SHALL call the violations API, optimistically update the list via TanStack React Query, and display a success notification.
5. WHEN an Admin clicks "Edit" on a violation row, THE ViolationsSection SHALL populate the form with the existing violation data for editing.
6. WHEN an Admin clicks "Delete" on a violation row, THE ViolationsSection SHALL display a confirmation prompt before calling the delete API.
7. IF the violations API returns an error, THEN THE ViolationsSection SHALL display the error message to the Admin without crashing the page.
8. THE System SHALL add a new `violationsService` object (or extend `studentProfileService` in a new file) with `getViolations`, `createViolation`, `updateViolation`, and `deleteViolation` methods.
9. THE System SHALL render the ViolationsSection inside `StudentProfileModal` as an additional card/section appended after the existing content, without modifying any existing JSX in that file beyond adding the new section import and render call.

---

### Requirement 4: Student Affiliations — Database

**User Story:** As an Admin, I want affiliations stored in a dedicated database table separate from activities, so that organizational and sports memberships are tracked distinctly.

#### Acceptance Criteria

1. THE System SHALL provide a new migration that creates a `student_affiliations` table with columns: `id`, `user_id` (foreign key to `users`, cascade delete), `organization_name` (string, max 255), `affiliation_type` (enum: `academic_org`, `sports`, `civic`, `religious`, `political`, `other`), `role` (string, max 100, nullable), `start_date` (date, nullable), `end_date` (date, nullable), `is_active` (boolean, default true), `description` (text, nullable), `created_at`, `updated_at`.
2. THE System SHALL provide a new `StudentAffiliation` Eloquent model with a `belongsTo` relationship to `User`.
3. THE System SHALL add an `affiliations()` `hasMany` relationship method to the `User` model without removing or altering any existing method on that model.

---

### Requirement 5: Student Affiliations — API

**User Story:** As an Admin, I want a RESTful API for student affiliations, so that the frontend can perform full CRUD operations on affiliation records.

#### Acceptance Criteria

1. THE System SHALL provide a new `StudentAffiliationController` with `index`, `store`, `update`, and `destroy` actions scoped to a specific student (`/students/{student}/affiliations`).
2. WHEN an Admin requests `GET /students/{student}/affiliations`, THE StudentAffiliationController SHALL return all affiliations for that student ordered by `start_date` descending.
3. WHEN an Admin submits a valid `POST /students/{student}/affiliations` request, THE StudentAffiliationController SHALL create a new affiliation record and return it with HTTP 201.
4. WHEN an Admin submits a valid `PUT /students/{student}/affiliations/{affiliation}` request, THE StudentAffiliationController SHALL update the specified affiliation and return the updated record.
5. WHEN an Admin submits a `DELETE /students/{student}/affiliations/{affiliation}` request, THE StudentAffiliationController SHALL delete the specified affiliation and return HTTP 200 with a success message.
6. IF a request body fails validation (missing `organization_name` or invalid `affiliation_type`), THEN THE StudentAffiliationController SHALL return HTTP 422 with field-level error messages.
7. IF the specified student does not exist, THEN THE StudentAffiliationController SHALL return HTTP 404.
8. THE System SHALL register the affiliation routes inside the existing `auth:api` + `check.status` middleware group in `api.php` without altering any existing route definition.

---

### Requirement 6: Student Affiliations — Frontend

**User Story:** As an Admin, I want an Affiliations section inside the student profile view, so that I can manage organizational and sports memberships separately from extracurricular activities.

#### Acceptance Criteria

1. THE System SHALL provide a new `AffiliationsSection` React component that displays a list of affiliations for a given student, with columns for organization name, type, role, and active status.
2. WHEN the Affiliations section is rendered with no affiliations, THE AffiliationsSection SHALL display an empty-state message indicating no affiliations on record.
3. WHEN an Admin clicks "Add Affiliation", THE AffiliationsSection SHALL display a form with fields for `organization_name`, `affiliation_type`, `role`, `start_date`, `end_date`, `is_active`, and `description`.
4. WHEN an Admin submits a valid add-affiliation form, THE AffiliationsSection SHALL call the affiliations API, update the list via TanStack React Query, and display a success notification.
5. WHEN an Admin clicks "Edit" on an affiliation row, THE AffiliationsSection SHALL populate the form with the existing affiliation data for editing.
6. WHEN an Admin clicks "Delete" on an affiliation row, THE AffiliationsSection SHALL display a confirmation prompt before calling the delete API.
7. IF the affiliations API returns an error, THEN THE AffiliationsSection SHALL display the error message to the Admin without crashing the page.
8. THE System SHALL render the AffiliationsSection inside `StudentProfileModal` as an additional card/section appended after the existing content, without modifying any existing JSX in that file beyond adding the new section import and render call.

---

### Requirement 7: Academic History — Database

**User Story:** As an Admin, I want per-semester academic records stored in the database, so that a student's academic progression is tracked beyond a single GPA field.

#### Acceptance Criteria

1. THE System SHALL provide a new migration that creates a `student_academic_records` table with columns: `id`, `user_id` (foreign key to `users`, cascade delete), `semester` (string, max 20, e.g. "1st Sem", "2nd Sem", "Summer"), `academic_year` (string, max 20, e.g. "2024-2025"), `semester_gpa` (decimal 3,2, nullable), `remarks` (string, max 255, nullable), `created_at`, `updated_at`.
2. THE System SHALL provide a new migration that creates a `student_subjects` table with columns: `id`, `academic_record_id` (foreign key to `student_academic_records`, cascade delete), `subject_code` (string, max 20, nullable), `subject_name` (string, max 255), `units` (decimal 3,1), `grade` (decimal 4,2, nullable), `created_at`, `updated_at`.
3. THE System SHALL provide a new `StudentAcademicRecord` Eloquent model with a `belongsTo` relationship to `User` and a `subjects()` `hasMany` relationship to `StudentSubject`.
4. THE System SHALL provide a new `StudentSubject` Eloquent model with a `belongsTo` relationship to `StudentAcademicRecord`.
5. THE System SHALL add an `academicRecords()` `hasMany` relationship method to the `User` model without removing or altering any existing method on that model.

---

### Requirement 8: Academic History — API

**User Story:** As an Admin, I want a RESTful API for academic history, so that the frontend can create, read, update, and delete semester records including their subjects.

#### Acceptance Criteria

1. THE System SHALL provide a new `StudentAcademicRecordController` with `index`, `store`, `update`, and `destroy` actions scoped to a specific student (`/students/{student}/academic-records`).
2. WHEN an Admin requests `GET /students/{student}/academic-records`, THE StudentAcademicRecordController SHALL return all academic records for that student with their nested subjects, ordered by `academic_year` and `semester`.
3. WHEN an Admin submits a valid `POST /students/{student}/academic-records` request (including a `subjects` array), THE StudentAcademicRecordController SHALL create the academic record and all nested subjects in a single database transaction and return the record with HTTP 201.
4. WHEN an Admin submits a valid `PUT /students/{student}/academic-records/{record}` request, THE StudentAcademicRecordController SHALL update the academic record and replace its subjects (delete old, insert new) within a single database transaction.
5. WHEN an Admin submits a `DELETE /students/{student}/academic-records/{record}` request, THE StudentAcademicRecordController SHALL delete the record and its subjects (via cascade) and return HTTP 200.
6. IF a request body fails validation (missing `semester`, `academic_year`, or invalid subject fields), THEN THE StudentAcademicRecordController SHALL return HTTP 422 with field-level error messages.
7. IF the specified student does not exist, THEN THE StudentAcademicRecordController SHALL return HTTP 404.
8. THE System SHALL register the academic record routes inside the existing `auth:api` + `check.status` middleware group in `api.php` without altering any existing route definition.

---

### Requirement 9: Academic History — Frontend

**User Story:** As an Admin, I want an Academic History section inside the student profile view, so that I can view and manage per-semester records with subject-level detail.

#### Acceptance Criteria

1. THE System SHALL provide a new `AcademicHistorySection` React component that displays a list of semester records, each expandable to show its subjects with subject code, name, units, and grade.
2. WHEN the Academic History section is rendered with no records, THE AcademicHistorySection SHALL display an empty-state message indicating no academic records on file.
3. WHEN an Admin clicks "Add Semester Record", THE AcademicHistorySection SHALL display a form with fields for `semester`, `academic_year`, `semester_gpa`, `remarks`, and a dynamic list of subjects (each with `subject_code`, `subject_name`, `units`, `grade`).
4. WHEN an Admin submits a valid semester record form, THE AcademicHistorySection SHALL call the academic records API, update the list via TanStack React Query, and display a success notification.
5. WHEN an Admin clicks "Edit" on a semester record, THE AcademicHistorySection SHALL populate the form with the existing record and its subjects for editing.
6. WHEN an Admin clicks "Delete" on a semester record, THE AcademicHistorySection SHALL display a confirmation prompt before calling the delete API.
7. IF the academic records API returns an error, THEN THE AcademicHistorySection SHALL display the error message to the Admin without crashing the page.
8. THE System SHALL render the AcademicHistorySection inside `StudentProfileModal` as an additional card/section appended after the existing content, without modifying any existing JSX in that file beyond adding the new section import and render call.

---

### Requirement 10: Status Filter UI

**User Story:** As an Admin, I want a Status dropdown on the Student Profiles page, so that I can filter the student list by active, inactive, or suspended status using the backend filter already in place.

#### Acceptance Criteria

1. THE StudentProfiles_Page SHALL render a new "Status" dropdown filter alongside the existing Program, Year Level, Skills, and Activities filters, without removing or reordering any existing filter.
2. WHEN the Status dropdown value is changed to a non-"all" value, THE StudentProfiles_Page SHALL include a `status` key in the `queryParams` object passed to the `useStudents` hook, triggering a refetch.
3. WHEN the Status dropdown value is "All Statuses", THE StudentProfiles_Page SHALL omit the `status` key from `queryParams`, matching the existing behavior for other "all" filters.
4. THE StatusFilter SHALL offer exactly four options: "All Statuses" (value `all`), "Active" (value `active`), "Inactive" (value `inactive`), and "Suspended" (value `suspended`).
5. THE StatusFilter SHALL use the same Tailwind CSS styling class pattern as the existing Program and Year Level dropdowns in `StudentProfiles_Page`.

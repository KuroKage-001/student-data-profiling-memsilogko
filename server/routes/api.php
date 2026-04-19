<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResearchMaterialController;
use App\Http\Controllers\InstructionController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\StudentViolationController;
use App\Http\Controllers\StudentAffiliationController;
use App\Http\Controllers\StudentAcademicRecordController;

// Handle preflight OPTIONS requests
Route::options('{any}', function () {
    return response('', 200);
})->where('any', '.*');

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware(['auth:api', 'check.status'])->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

// Research Materials API Routes
Route::apiResource('research-materials', ResearchMaterialController::class);

// Instructions API Routes
Route::apiResource('instructions', InstructionController::class);

// User Management API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::apiResource('users', App\Http\Controllers\UserManagementController::class);
    Route::get('users-statistics', [App\Http\Controllers\UserManagementController::class, 'statistics']);
});

// User Profile API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::get('profile', [App\Http\Controllers\UserProfileController::class, 'show']);
    Route::put('profile', [App\Http\Controllers\UserProfileController::class, 'updateProfile']);
    Route::post('profile/change-password', [App\Http\Controllers\UserProfileController::class, 'changePassword']);
});

// Student Management API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::apiResource('students', App\Http\Controllers\StudentController::class);
    Route::get('students-statistics', [App\Http\Controllers\StudentController::class, 'statistics']);
    Route::get('next-student-number', [App\Http\Controllers\StudentController::class, 'getNextStudentNumber']);

    // Student Violations Routes
    Route::get('students/{student}/violations', [StudentViolationController::class, 'index']);
    Route::post('students/{student}/violations', [StudentViolationController::class, 'store']);
    Route::put('students/{student}/violations/{violation}', [StudentViolationController::class, 'update']);
    Route::delete('students/{student}/violations/{violation}', [StudentViolationController::class, 'destroy']);

    // Student Affiliations Routes
    Route::get('students/{student}/affiliations', [StudentAffiliationController::class, 'index']);
    Route::post('students/{student}/affiliations', [StudentAffiliationController::class, 'store']);
    Route::put('students/{student}/affiliations/{affiliation}', [StudentAffiliationController::class, 'update']);
    Route::delete('students/{student}/affiliations/{affiliation}', [StudentAffiliationController::class, 'destroy']);

    // Student Academic Records Routes
    Route::get('students/{student}/academic-records', [StudentAcademicRecordController::class, 'index']);
    Route::post('students/{student}/academic-records', [StudentAcademicRecordController::class, 'store']);
    Route::put('students/{student}/academic-records/{record}', [StudentAcademicRecordController::class, 'update']);
    Route::delete('students/{student}/academic-records/{record}', [StudentAcademicRecordController::class, 'destroy']);
});

// Faculty Management API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::apiResource('faculty', App\Http\Controllers\FacultyController::class);
    Route::get('faculty-statistics', [App\Http\Controllers\FacultyController::class, 'statistics']);
});

// Class Sections API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::apiResource('class-sections', App\Http\Controllers\ClassSectionController::class);
    Route::get('class-sections-statistics', [App\Http\Controllers\ClassSectionController::class, 'statistics']);
});

// Faculty Class Assignments API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::post('faculty-assignments', [App\Http\Controllers\FacultyAssignmentController::class, 'assign']);
    Route::put('faculty-assignments/{id}', [App\Http\Controllers\FacultyAssignmentController::class, 'update']);
    Route::delete('faculty-assignments/{id}', [App\Http\Controllers\FacultyAssignmentController::class, 'unassign']);
    Route::get('faculty/{facultyId}/classes', [App\Http\Controllers\FacultyAssignmentController::class, 'getFacultyClasses']);
    Route::get('class-sections/{classSectionId}/faculty', [App\Http\Controllers\FacultyAssignmentController::class, 'getClassFaculty']);
    Route::post('faculty-assignments/available', [App\Http\Controllers\FacultyAssignmentController::class, 'getAvailableFaculty']);
});

// Events API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::apiResource('events', EventController::class);
    Route::get('events-statistics', [EventController::class, 'statistics']);
});

// Student Dashboard API Routes (Protected)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::get('student/dashboard-stats', [App\Http\Controllers\StudentDashboardController::class, 'getDashboardStats']);
    Route::get('student/profile', [App\Http\Controllers\StudentDashboardController::class, 'getProfile']);
    Route::get('student/academic-records', [App\Http\Controllers\StudentDashboardController::class, 'getAcademicRecords']);
    Route::get('student/upcoming-events', [App\Http\Controllers\StudentDashboardController::class, 'getUpcomingEvents']);
});

// Dynamic Routes API (Optional - for database-driven routing)
Route::middleware(['auth:api', 'check.status'])->group(function () {
    Route::get('routes', [App\Http\Controllers\RouteController::class, 'index']);
    Route::post('routes/check-access', [App\Http\Controllers\RouteController::class, 'checkAccess']);
});

// Faculty portal redirect route
Route::get('faculty', function () {
    return redirect('/faculty/login');
});

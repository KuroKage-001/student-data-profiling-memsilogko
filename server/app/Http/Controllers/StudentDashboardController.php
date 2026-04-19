<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentAcademicRecord;
use App\Models\StudentAffiliation;
use App\Models\Event;
use Carbon\Carbon;

class StudentDashboardController extends Controller
{
    /**
     * Get student dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Verify user is a student
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Calculate GPA from academic records and subjects
            $academicRecords = StudentAcademicRecord::where('user_id', $user->id)
                ->with('subjects')
                ->get();
            
            $totalGradePoints = 0;
            $totalUnits = 0;
            
            foreach ($academicRecords as $record) {
                foreach ($record->subjects as $subject) {
                    $gradePoint = $this->convertGradeToPoint($subject->grade);
                    $units = $subject->units ?? 3;
                    $totalGradePoints += $gradePoint * $units;
                    $totalUnits += $units;
                }
            }
            
            $gpa = $totalUnits > 0 ? round($totalGradePoints / $totalUnits, 2) : ($user->gpa ?? 0);

            // Count enrolled classes
            $enrolledClasses = \App\Models\StudentEnrollment::where('user_id', $user->id)
                ->where('enrollment_status', 'enrolled')
                ->count();

            // Count upcoming events
            $upcomingEvents = Event::where('date', '>=', Carbon::now())
                ->where('status', 'active')
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'gpa' => $gpa,
                    'units_completed' => $totalUnits,
                    'enrolled_classes' => $enrolledClasses,
                    'upcoming_events' => $upcomingEvents
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student profile summary
     */
    public function getProfile(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Verify user is a student
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'student_id' => $user->student_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'program' => $user->program,
                    'year_level' => $user->year_level,
                    'phone' => $user->phone,
                    'address' => $user->address
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch student profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student academic records
     */
    public function getAcademicRecords(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Verify user is a student
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $academicRecords = StudentAcademicRecord::where('user_id', $user->id)
                ->with('subjects')
                ->orderBy('academic_year', 'desc')
                ->orderBy('semester', 'desc')
                ->get();

            // Calculate totals
            $totalUnits = 0;
            $completedUnits = 0;
            
            foreach ($academicRecords as $record) {
                foreach ($record->subjects as $subject) {
                    $units = $subject->units ?? 3;
                    $totalUnits += $units;
                    
                    // Consider passed if grade is not F or INC
                    if (!in_array($subject->grade, ['F', 'INC', '5.0'])) {
                        $completedUnits += $units;
                    }
                }
            }

            // Get current semester info
            $currentRecord = $academicRecords->first();
            $currentSemester = $currentRecord 
                ? "SY {$currentRecord->academic_year} - Semester {$currentRecord->semester}"
                : null;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_units' => $totalUnits,
                    'completed_units' => $completedUnits,
                    'current_semester' => $currentSemester,
                    'records' => $academicRecords
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch academic records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get upcoming events for student
     */
    public function getUpcomingEvents(Request $request)
    {
        try {
            $events = Event::where('date', '>=', Carbon::now())
                ->where('status', 'active')
                ->orderBy('date', 'asc')
                ->limit(10)
                ->get(['id', 'title', 'description', 'date', 'time', 'location', 'type']);

            return response()->json([
                'success' => true,
                'data' => [
                    'events' => $events
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch upcoming events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Convert letter grade to grade point
     */
    private function convertGradeToPoint($grade)
    {
        $gradeMap = [
            '1.0' => 4.0,
            '1.25' => 3.75,
            '1.5' => 3.5,
            '1.75' => 3.25,
            '2.0' => 3.0,
            '2.25' => 2.75,
            '2.5' => 2.5,
            '2.75' => 2.25,
            '3.0' => 2.0,
            '4.0' => 1.0,
            '5.0' => 0.0,
            'INC' => 0.0,
            'F' => 0.0
        ];

        return $gradeMap[$grade] ?? 0.0;
    }
}

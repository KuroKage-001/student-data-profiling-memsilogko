<?php

namespace App\Http\Controllers;

use App\Models\ClassSection;
use App\Models\StudentEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentScheduleController extends Controller
{
    /**
     * Get student's enrolled schedules
     */
    public function getMySchedules(Request $request)
    {
        try {
            $user = Auth::user();

            // Get student's enrollments with class section details
            $enrollments = StudentEnrollment::where('user_id', $user->id)
                ->where('enrollment_status', 'enrolled')
                ->with(['classSection' => function($query) {
                    $query->where('status', 'active')
                          ->with(['facultyAssignments' => function($q) {
                              $q->where('status', 'active')
                                ->where('assignment_type', 'primary')
                                ->with('faculty');
                          }]);
                }])
                ->get();

            // Format the response
            $schedules = $enrollments->map(function($enrollment) {
                $section = $enrollment->classSection;
                if (!$section) return null;

                $primaryFaculty = $section->facultyAssignments->first();
                
                return [
                    'id' => $section->id,
                    'enrollment_id' => $enrollment->id,
                    'section_code' => $section->section_code,
                    'course_code' => $section->course_code,
                    'course_name' => $section->course_name,
                    'room' => $section->room,
                    'day_of_week' => $section->day_of_week,
                    'start_time' => date('h:i A', strtotime($section->start_time)),
                    'end_time' => date('h:i A', strtotime($section->end_time)),
                    'semester' => $section->semester,
                    'academic_year' => $section->academic_year,
                    'instructor' => $primaryFaculty && $primaryFaculty->faculty 
                        ? $primaryFaculty->faculty->name 
                        : 'TBA',
                    'max_capacity' => $section->max_capacity,
                    'current_enrollment' => $section->current_enrollment,
                    'enrollment_percentage' => $section->enrollment_percentage,
                    'enrollment_date' => $enrollment->enrollment_date->format('M d, Y'),
                    'status' => $section->status,
                ];
            })->filter()->values();

            return response()->json([
                'success' => true,
                'data' => $schedules,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch schedules: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available class sections for enrollment
     */
    public function getAvailableClasses(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Get query parameters
            $search = $request->input('search', '');
            $day = $request->input('day', '');
            $semester = $request->input('semester', 'Spring 2026');
            $academicYear = $request->input('academic_year', '2025-2026');

            // Get student's current enrollments
            $enrolledClassIds = StudentEnrollment::where('user_id', $user->id)
                ->where('enrollment_status', 'enrolled')
                ->pluck('class_section_id')
                ->toArray();

            // Query available classes
            $query = ClassSection::where('status', 'active')
                ->where('semester', $semester)
                ->where('academic_year', $academicYear)
                ->whereNotIn('id', $enrolledClassIds)
                ->with(['facultyAssignments' => function($q) {
                    $q->where('status', 'active')
                      ->where('assignment_type', 'primary')
                      ->with('faculty');
                }]);

            // Apply search filter
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('course_code', 'like', "%{$search}%")
                      ->orWhere('course_name', 'like', "%{$search}%")
                      ->orWhere('section_code', 'like', "%{$search}%");
                });
            }

            // Apply day filter
            if ($day && $day !== 'All') {
                $query->where('day_of_week', $day);
            }

            $classes = $query->orderBy('course_code')
                ->orderBy('section_code')
                ->get();

            // Format the response
            $formattedClasses = $classes->map(function($section) {
                $primaryFaculty = $section->facultyAssignments->first();
                
                return [
                    'id' => $section->id,
                    'section_code' => $section->section_code,
                    'course_code' => $section->course_code,
                    'course_name' => $section->course_name,
                    'room' => $section->room,
                    'day_of_week' => $section->day_of_week,
                    'start_time' => date('h:i A', strtotime($section->start_time)),
                    'end_time' => date('h:i A', strtotime($section->end_time)),
                    'semester' => $section->semester,
                    'academic_year' => $section->academic_year,
                    'instructor' => $primaryFaculty && $primaryFaculty->faculty 
                        ? $primaryFaculty->faculty->name 
                        : 'TBA',
                    'max_capacity' => $section->max_capacity,
                    'current_enrollment' => $section->current_enrollment,
                    'enrollment_percentage' => $section->enrollment_percentage,
                    'is_full' => $section->isFull(),
                    'status' => $section->status,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedClasses,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch available classes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get student schedule statistics
     */
    public function getStatistics()
    {
        try {
            $user = Auth::user();

            $stats = [
                'total_enrolled' => StudentEnrollment::where('user_id', $user->id)
                    ->where('enrollment_status', 'enrolled')
                    ->count(),
                'total_units' => 0, // Can be calculated if units are stored
                'completed_courses' => StudentEnrollment::where('user_id', $user->id)
                    ->where('enrollment_status', 'completed')
                    ->count(),
                'current_semester' => 'Spring 2026',
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Enroll in a class section
     */
    public function enroll(Request $request)
    {
        try {
            $request->validate([
                'class_section_id' => 'required|exists:class_sections,id',
            ]);

            $user = Auth::user();
            $classSectionId = $request->class_section_id;

            // Check if already enrolled
            $existingEnrollment = StudentEnrollment::where('user_id', $user->id)
                ->where('class_section_id', $classSectionId)
                ->where('enrollment_status', 'enrolled')
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already enrolled in this class',
                ], 400);
            }

            // Check if class is full
            $classSection = ClassSection::findOrFail($classSectionId);
            if ($classSection->isFull()) {
                return response()->json([
                    'success' => false,
                    'message' => 'This class is full',
                ], 400);
            }

            // Create enrollment
            DB::beginTransaction();
            
            $enrollment = StudentEnrollment::create([
                'user_id' => $user->id,
                'class_section_id' => $classSectionId,
                'enrollment_status' => 'enrolled',
                'enrollment_date' => now(),
            ]);

            // Update class enrollment count
            $classSection->increment('current_enrollment');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Successfully enrolled in class',
                'data' => $enrollment,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to enroll: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Drop a class section
     */
    public function drop(Request $request, $enrollmentId)
    {
        try {
            $user = Auth::user();

            $enrollment = StudentEnrollment::where('id', $enrollmentId)
                ->where('user_id', $user->id)
                ->where('enrollment_status', 'enrolled')
                ->firstOrFail();

            DB::beginTransaction();

            // Update enrollment status
            $enrollment->update([
                'enrollment_status' => 'dropped',
                'drop_date' => now(),
            ]);

            // Decrement class enrollment count
            $classSection = ClassSection::findOrFail($enrollment->class_section_id);
            $classSection->decrement('current_enrollment');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Successfully dropped class',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to drop class: ' . $e->getMessage(),
            ], 500);
        }
    }
}

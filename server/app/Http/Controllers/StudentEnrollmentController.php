<?php

namespace App\Http\Controllers;

use App\Models\StudentEnrollment;
use App\Models\ClassSection;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StudentEnrollmentController extends Controller
{
    /**
     * Get all enrollments for a class section
     */
    public function getClassEnrollments($classSectionId)
    {
        try {
            $enrollments = StudentEnrollment::where('class_section_id', $classSectionId)
                ->with('student')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $enrollments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch enrollments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get eligible students for enrollment (filtered by program)
     */
    public function getEligibleStudents(Request $request)
    {
        try {
            $classSectionId = $request->query('class_section_id');
            $program = $request->query('program'); // IT or CS
            
            $query = User::where('role', 'student')
                ->where('status', 'active');
            
            // Filter by program if provided
            if ($program) {
                $query->where('program', $program);
            }
            
            // Exclude already enrolled students if class section is provided
            if ($classSectionId) {
                $query->whereDoesntHave('enrollments', function($q) use ($classSectionId) {
                    $q->where('class_section_id', $classSectionId)
                      ->where('enrollment_status', 'enrolled');
                });
            }
            
            $students = $query->select('id', 'name', 'email', 'student_id', 'program', 'year_level')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $students
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch eligible students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Enroll a student in a class section
     */
    public function enrollStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'class_section_id' => 'required|exists:class_sections,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Check if student is already enrolled
            $existingEnrollment = StudentEnrollment::where('user_id', $request->user_id)
                ->where('class_section_id', $request->class_section_id)
                ->where('enrollment_status', 'enrolled')
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student is already enrolled in this class'
                ], 409);
            }

            // Check class capacity
            $classSection = ClassSection::findOrFail($request->class_section_id);
            if ($classSection->current_enrollment >= $classSection->max_capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Class is at full capacity'
                ], 409);
            }

            // Verify student program matches course program
            $student = User::findOrFail($request->user_id);
            $courseProgram = $this->extractProgramFromCourseCode($classSection->course_code);
            
            if ($courseProgram && $student->program !== $courseProgram) {
                return response()->json([
                    'success' => false,
                    'message' => "Only {$courseProgram} students can enroll in this course"
                ], 403);
            }

            // Create enrollment
            $enrollment = StudentEnrollment::create([
                'user_id' => $request->user_id,
                'class_section_id' => $request->class_section_id,
                'enrollment_status' => 'enrolled',
                'enrollment_date' => now(),
            ]);

            // Update class enrollment count
            $classSection->increment('current_enrollment');

            DB::commit();

            // Load student relationship
            $enrollment->load('student');

            return response()->json([
                'success' => true,
                'message' => 'Student enrolled successfully',
                'data' => $enrollment
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to enroll student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Drop a student from a class section
     */
    public function dropStudent($enrollmentId)
    {
        try {
            DB::beginTransaction();

            $enrollment = StudentEnrollment::findOrFail($enrollmentId);
            
            if ($enrollment->enrollment_status !== 'enrolled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Student is not currently enrolled in this class'
                ], 409);
            }

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
                'message' => 'Student dropped successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to drop student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Extract program from course code (e.g., "IT 101" -> "IT", "CS 201" -> "CS")
     */
    private function extractProgramFromCourseCode($courseCode)
    {
        if (preg_match('/^(IT|CS)\s/i', $courseCode, $matches)) {
            return strtoupper($matches[1]);
        }
        return null;
    }

    /**
     * Faculty enroll student (only in their assigned classes)
     */
    public function facultyEnrollStudent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'class_section_id' => 'required|exists:class_sections,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();
            
            // Verify faculty has access to this class
            if (!$user->facultyProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty profile not found'
                ], 403);
            }

            $classSection = ClassSection::findOrFail($request->class_section_id);
            
            // Check if faculty is assigned to this class
            $isAssigned = $classSection->facultyAssignments()
                ->where('faculty_id', $user->facultyProfile->id)
                ->where('status', 'active')
                ->exists();

            if (!$isAssigned) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only enroll students in your assigned classes'
                ], 403);
            }

            // Use the same enrollment logic
            DB::beginTransaction();

            // Check if student is already enrolled
            $existingEnrollment = StudentEnrollment::where('user_id', $request->user_id)
                ->where('class_section_id', $request->class_section_id)
                ->where('enrollment_status', 'enrolled')
                ->first();

            if ($existingEnrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student is already enrolled in this class'
                ], 409);
            }

            // Check class capacity
            if ($classSection->current_enrollment >= $classSection->max_capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Class is at full capacity'
                ], 409);
            }

            // Verify student program matches course program
            $student = User::findOrFail($request->user_id);
            $courseProgram = $this->extractProgramFromCourseCode($classSection->course_code);
            
            if ($courseProgram && $student->program !== $courseProgram) {
                return response()->json([
                    'success' => false,
                    'message' => "Only {$courseProgram} students can enroll in this course"
                ], 403);
            }

            // Create enrollment
            $enrollment = StudentEnrollment::create([
                'user_id' => $request->user_id,
                'class_section_id' => $request->class_section_id,
                'enrollment_status' => 'enrolled',
                'enrollment_date' => now(),
            ]);

            // Update class enrollment count
            $classSection->increment('current_enrollment');

            DB::commit();

            // Load student relationship
            $enrollment->load('student');

            return response()->json([
                'success' => true,
                'message' => 'Student enrolled successfully',
                'data' => $enrollment
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to enroll student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Faculty drop student (only from their assigned classes)
     */
    public function facultyDropStudent($enrollmentId)
    {
        try {
            $user = auth()->user();
            
            // Verify faculty has access
            if (!$user->facultyProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty profile not found'
                ], 403);
            }

            DB::beginTransaction();

            $enrollment = StudentEnrollment::findOrFail($enrollmentId);
            $classSection = ClassSection::findOrFail($enrollment->class_section_id);
            
            // Check if faculty is assigned to this class
            $isAssigned = $classSection->facultyAssignments()
                ->where('faculty_id', $user->facultyProfile->id)
                ->where('status', 'active')
                ->exists();

            if (!$isAssigned) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only drop students from your assigned classes'
                ], 403);
            }
            
            if ($enrollment->enrollment_status !== 'enrolled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Student is not currently enrolled in this class'
                ], 409);
            }

            // Update enrollment status
            $enrollment->update([
                'enrollment_status' => 'dropped',
                'drop_date' => now(),
            ]);

            // Decrement class enrollment count
            $classSection->decrement('current_enrollment');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Student dropped successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to drop student',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ClassSection;
use App\Models\FacultyClassAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ClassSectionController extends Controller
{
    /**
     * Display a listing of class sections
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            $query = ClassSection::query()->with(['facultyAssignments.faculty']);

            // If user is faculty (not admin or dept_chair), only show their assigned classes
            if ($user && in_array($user->role, ['faculty']) && $user->facultyProfile) {
                $facultyId = $user->facultyProfile->id;
                $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
                    $q->where('faculty_id', $facultyId)
                      ->where('status', 'active');
                });
            }

            // Filter by semester
            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            // Filter by academic year
            if ($request->has('academic_year')) {
                $query->where('academic_year', $request->academic_year);
            }

            // Filter by day
            if ($request->has('day')) {
                $query->where('day_of_week', $request->day);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->where('status', 'active');
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('course_code', 'like', "%{$search}%")
                      ->orWhere('course_name', 'like', "%{$search}%")
                      ->orWhere('section_code', 'like', "%{$search}%")
                      ->orWhere('room', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'day_of_week');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $classSections = $query->get();

            // Add instructor information
            $classSections->each(function($section) {
                $primaryFaculty = $section->primaryFaculty();
                $section->instructor = $primaryFaculty ? $primaryFaculty->faculty->name : 'Unassigned';
                $section->instructor_id = $primaryFaculty ? $primaryFaculty->faculty_id : null;
            });

            return response()->json([
                'success' => true,
                'data' => $classSections
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch class sections',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created class section
     */
    public function store(Request $request)
    {
        // Only admin and dept_chair can create class sections
        $user = auth()->user();
        if ($user && $user->role === 'faculty') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators and department chairs can create class sections.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'section_code' => 'required|string|max:20',
            'course_code' => 'required|string|max:20',
            'course_name' => 'required|string|max:255',
            'room' => 'nullable|string|max:50',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'semester' => 'required|string|max:50',
            'academic_year' => 'required|string|max:20',
            'max_capacity' => 'required|integer|min:1',
            'faculty_id' => 'nullable|exists:faculty,id',
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

            // Check for conflicts
            $conflict = $this->checkScheduleConflict(
                $request->room,
                $request->day_of_week,
                $request->start_time,
                $request->end_time,
                $request->semester,
                $request->academic_year
            );

            if ($conflict) {
                return response()->json([
                    'success' => false,
                    'message' => 'Schedule conflict detected',
                    'conflict' => $conflict
                ], 409);
            }

            // Create class section
            $classSection = ClassSection::create([
                'section_code' => $request->section_code,
                'course_code' => $request->course_code,
                'course_name' => $request->course_name,
                'room' => $request->room,
                'day_of_week' => $request->day_of_week,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'semester' => $request->semester,
                'academic_year' => $request->academic_year,
                'max_capacity' => $request->max_capacity,
                'current_enrollment' => 0,
                'status' => 'active',
            ]);

            // Assign faculty if provided
            if ($request->has('faculty_id') && $request->faculty_id) {
                FacultyClassAssignment::create([
                    'faculty_id' => $request->faculty_id,
                    'class_section_id' => $classSection->id,
                    'assignment_type' => 'primary',
                    'assigned_date' => now(),
                    'status' => 'active',
                ]);
            }

            DB::commit();

            // Reload with relationships
            $classSection->load('facultyAssignments.faculty');
            $primaryFaculty = $classSection->primaryFaculty();
            $classSection->instructor = $primaryFaculty ? $primaryFaculty->faculty->name : 'Unassigned';

            return response()->json([
                'success' => true,
                'message' => 'Class section created successfully',
                'data' => $classSection
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create class section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified class section
     */
    public function show($id)
    {
        try {
            $classSection = ClassSection::with(['facultyAssignments.faculty'])->findOrFail($id);
            
            $primaryFaculty = $classSection->primaryFaculty();
            $classSection->instructor = $primaryFaculty ? $primaryFaculty->faculty->name : 'Unassigned';

            return response()->json([
                'success' => true,
                'data' => $classSection
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Class section not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified class section
     */
    public function update(Request $request, $id)
    {
        // Only admin and dept_chair can update class sections
        $user = auth()->user();
        if ($user && $user->role === 'faculty') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators and department chairs can update class sections.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'section_code' => 'sometimes|required|string|max:20',
            'course_code' => 'sometimes|required|string|max:20',
            'course_name' => 'sometimes|required|string|max:255',
            'room' => 'nullable|string|max:50',
            'day_of_week' => 'sometimes|required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i',
            'semester' => 'sometimes|required|string|max:50',
            'academic_year' => 'sometimes|required|string|max:20',
            'max_capacity' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|required|in:active,cancelled,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $classSection = ClassSection::findOrFail($id);

            // Check for conflicts if schedule details are being updated
            if ($request->has(['room', 'day_of_week', 'start_time', 'end_time'])) {
                $conflict = $this->checkScheduleConflict(
                    $request->room ?? $classSection->room,
                    $request->day_of_week ?? $classSection->day_of_week,
                    $request->start_time ?? $classSection->start_time,
                    $request->end_time ?? $classSection->end_time,
                    $request->semester ?? $classSection->semester,
                    $request->academic_year ?? $classSection->academic_year,
                    $id
                );

                if ($conflict) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Schedule conflict detected',
                        'conflict' => $conflict
                    ], 409);
                }
            }

            $classSection->update($request->all());
            $classSection->load('facultyAssignments.faculty');
            
            $primaryFaculty = $classSection->primaryFaculty();
            $classSection->instructor = $primaryFaculty ? $primaryFaculty->faculty->name : 'Unassigned';

            return response()->json([
                'success' => true,
                'message' => 'Class section updated successfully',
                'data' => $classSection
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update class section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified class section
     */
    public function destroy($id)
    {
        // Only admin and dept_chair can delete class sections
        $user = auth()->user();
        if ($user && $user->role === 'faculty') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators and department chairs can delete class sections.'
            ], 403);
        }

        try {
            $classSection = ClassSection::findOrFail($id);
            
            // Check if there are enrolled students
            if ($classSection->current_enrollment > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete class section with enrolled students'
                ], 409);
            }

            $classSection->delete();

            return response()->json([
                'success' => true,
                'message' => 'Class section deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete class section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for class sections
     */
    public function statistics(Request $request)
    {
        try {
            $user = auth()->user();
            $semester = $request->get('semester');
            $academicYear = $request->get('academic_year');

            $query = ClassSection::query();

            // If user is faculty (not admin or dept_chair), only show their assigned classes
            if ($user && in_array($user->role, ['faculty']) && $user->facultyProfile) {
                $facultyId = $user->facultyProfile->id;
                $query->whereHas('facultyAssignments', function($q) use ($facultyId) {
                    $q->where('faculty_id', $facultyId)
                      ->where('status', 'active');
                });
            }

            if ($semester) {
                $query->where('semester', $semester);
            }

            if ($academicYear) {
                $query->where('academic_year', $academicYear);
            }

            $totalClasses = $query->count();
            $activeClasses = (clone $query)->where('status', 'active')->count();
            $totalStudents = (clone $query)->sum('current_enrollment');
            $totalCapacity = (clone $query)->sum('max_capacity');
            $uniqueRooms = (clone $query)->distinct('room')->count('room');
            $avgCapacity = $totalCapacity > 0 ? round(($totalStudents / $totalCapacity) * 100, 2) : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_classes' => $totalClasses,
                    'active_classes' => $activeClasses,
                    'total_students' => $totalStudents,
                    'total_capacity' => $totalCapacity,
                    'unique_rooms' => $uniqueRooms,
                    'avg_capacity_percentage' => $avgCapacity,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check for schedule conflicts
     */
    private function checkScheduleConflict($room, $day, $startTime, $endTime, $semester, $academicYear, $excludeId = null)
    {
        $query = ClassSection::where('room', $room)
            ->where('day_of_week', $day)
            ->where('semester', $semester)
            ->where('academic_year', $academicYear)
            ->where('status', 'active')
            ->where(function($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function($q2) use ($startTime, $endTime) {
                      $q2->where('start_time', '<=', $startTime)
                         ->where('end_time', '>=', $endTime);
                  });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->first();
    }
}

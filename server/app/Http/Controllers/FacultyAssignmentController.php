<?php

namespace App\Http\Controllers;

use App\Models\FacultyClassAssignment;
use App\Models\ClassSection;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class FacultyAssignmentController extends Controller
{
    /**
     * Assign a faculty member to a class section
     */
    public function assign(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'faculty_id' => 'required|exists:faculty,id',
            'class_section_id' => 'required|exists:class_sections,id',
            'assignment_type' => 'required|in:primary,co-instructor,assistant',
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

            $facultyId = $request->faculty_id;
            $classSectionId = $request->class_section_id;
            $assignmentType = $request->assignment_type;

            // Check if assignment already exists
            $existingAssignment = FacultyClassAssignment::where('faculty_id', $facultyId)
                ->where('class_section_id', $classSectionId)
                ->first();

            if ($existingAssignment) {
                // Update existing assignment
                $existingAssignment->update([
                    'assignment_type' => $assignmentType,
                    'status' => 'active',
                    'assigned_date' => now(),
                ]);

                DB::commit();

                $existingAssignment->load(['faculty', 'classSection']);

                return response()->json([
                    'success' => true,
                    'message' => 'Faculty assignment updated successfully',
                    'data' => $existingAssignment
                ]);
            }

            // Check for schedule conflicts if assigning as primary instructor
            if ($assignmentType === 'primary') {
                $classSection = ClassSection::findOrFail($classSectionId);
                
                $conflict = $this->checkFacultyScheduleConflict(
                    $facultyId,
                    $classSection->day_of_week,
                    $classSection->start_time,
                    $classSection->end_time,
                    $classSection->semester,
                    $classSection->academic_year
                );

                if ($conflict) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Faculty schedule conflict detected',
                        'conflict' => $conflict
                    ], 409);
                }

                // If assigning as primary, deactivate any existing primary assignment for this class
                FacultyClassAssignment::where('class_section_id', $classSectionId)
                    ->where('assignment_type', 'primary')
                    ->where('status', 'active')
                    ->update(['status' => 'inactive']);
            }

            // Create new assignment
            $assignment = FacultyClassAssignment::create([
                'faculty_id' => $facultyId,
                'class_section_id' => $classSectionId,
                'assignment_type' => $assignmentType,
                'assigned_date' => now(),
                'status' => 'active',
            ]);

            DB::commit();

            $assignment->load(['faculty', 'classSection']);

            return response()->json([
                'success' => true,
                'message' => 'Faculty assigned successfully',
                'data' => $assignment
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign faculty',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unassign a faculty member from a class section
     */
    public function unassign($id)
    {
        try {
            $assignment = FacultyClassAssignment::findOrFail($id);
            $assignment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Faculty unassigned successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to unassign faculty',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all classes assigned to a specific faculty member
     */
    public function getFacultyClasses($facultyId)
    {
        try {
            // Try to find faculty by ID first, then by user_id
            $faculty = Faculty::find($facultyId);
            
            if (!$faculty) {
                // If not found by ID, try finding by user_id
                $faculty = Faculty::where('user_id', $facultyId)->first();
            }
            
            if (!$faculty) {
                return response()->json([
                    'success' => false,
                    'message' => 'Faculty not found'
                ], 404);
            }

            $assignments = FacultyClassAssignment::where('faculty_id', $faculty->id)
                ->where('status', 'active')
                ->with(['classSection', 'faculty'])
                ->get();

            $classes = $assignments->map(function($assignment) use ($faculty) {
                $section = $assignment->classSection;
                
                // Skip if class section doesn't exist
                if (!$section) {
                    return null;
                }
                
                // Build the class section data with instructor name
                $sectionData = $section->toArray();
                $sectionData['instructor'] = $faculty->name;
                $sectionData['time_range'] = $section->time_range;
                $sectionData['enrollment_percentage'] = $section->enrollment_percentage;
                
                return [
                    'assignment_id' => $assignment->id,
                    'assignment_type' => $assignment->assignment_type,
                    'class_section' => $sectionData,
                ];
            })->filter(); // Remove null values

            return response()->json([
                'success' => true,
                'data' => [
                    'faculty' => $faculty,
                    'classes' => $classes->values(), // Re-index array after filtering
                    'total_classes' => $classes->count(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch faculty classes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all faculty members assigned to a specific class section
     */
    public function getClassFaculty($classSectionId)
    {
        try {
            $classSection = ClassSection::findOrFail($classSectionId);

            $assignments = FacultyClassAssignment::where('class_section_id', $classSectionId)
                ->where('status', 'active')
                ->with('faculty')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'class_section' => $classSection,
                    'faculty_assignments' => $assignments,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch class faculty',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update assignment type or status
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'assignment_type' => 'sometimes|required|in:primary,co-instructor,assistant',
            'status' => 'sometimes|required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $assignment = FacultyClassAssignment::findOrFail($id);
            $assignment->update($request->all());
            $assignment->load(['faculty', 'classSection']);

            return response()->json([
                'success' => true,
                'message' => 'Assignment updated successfully',
                'data' => $assignment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update assignment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check for faculty schedule conflicts
     */
    private function checkFacultyScheduleConflict($facultyId, $day, $startTime, $endTime, $semester, $academicYear)
    {
        $assignments = FacultyClassAssignment::where('faculty_id', $facultyId)
            ->where('status', 'active')
            ->whereHas('classSection', function($query) use ($day, $startTime, $endTime, $semester, $academicYear) {
                $query->where('day_of_week', $day)
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
            })
            ->with('classSection')
            ->first();

        return $assignments ? $assignments->classSection : null;
    }
}

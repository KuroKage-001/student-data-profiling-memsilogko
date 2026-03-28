<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StudentAcademicRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StudentAcademicRecordController extends Controller
{
    /**
     * Display a listing of academic records for a student
     */
    public function index($student)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $records = $student->academicRecords()
                ->with('subjects')
                ->orderBy('academic_year', 'asc')
                ->orderBy('semester', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $records
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch academic records: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created academic record for a student
     */
    public function store(Request $request, $student)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $validator = Validator::make($request->all(), [
                'semester'                        => 'required|string|max:20',
                'academic_year'                   => 'required|string|max:20',
                'semester_gpa'                    => 'nullable|numeric|min:0|max:4',
                'remarks'                         => 'nullable|string|max:255',
                'subjects'                        => 'nullable|array',
                'subjects.*.subject_name'         => 'required|string|max:255',
                'subjects.*.units'                => 'nullable|numeric|min:0',
                'subjects.*.subject_code'         => 'nullable|string|max:20',
                'subjects.*.grade'                => 'nullable|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $record = $student->academicRecords()->create([
                'semester'     => $request->semester,
                'academic_year' => $request->academic_year,
                'semester_gpa' => $request->semester_gpa,
                'remarks'      => $request->remarks,
            ]);

            if ($request->has('subjects') && is_array($request->subjects)) {
                foreach ($request->subjects as $subject) {
                    $record->subjects()->create($subject);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Academic record created successfully',
                'data' => $record->load('subjects')
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create academic record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified academic record for a student
     */
    public function update(Request $request, $student, $record)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $record = StudentAcademicRecord::where('user_id', $student->id)->findOrFail($record);

            $validator = Validator::make($request->all(), [
                'semester'                        => 'sometimes|required|string|max:20',
                'academic_year'                   => 'sometimes|required|string|max:20',
                'semester_gpa'                    => 'nullable|numeric|min:0|max:4',
                'remarks'                         => 'nullable|string|max:255',
                'subjects'                        => 'nullable|array',
                'subjects.*.subject_name'         => 'required|string|max:255',
                'subjects.*.units'                => 'nullable|numeric|min:0',
                'subjects.*.subject_code'         => 'nullable|string|max:20',
                'subjects.*.grade'                => 'nullable|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $record->update($request->only(['semester', 'academic_year', 'semester_gpa', 'remarks']));

            if ($request->has('subjects')) {
                $record->subjects()->delete();

                if (is_array($request->subjects)) {
                    foreach ($request->subjects as $subject) {
                        $record->subjects()->create($subject);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Academic record updated successfully',
                'data' => $record->load('subjects')
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Student or academic record not found'
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update academic record: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified academic record for a student
     */
    public function destroy($student, $record)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $record = StudentAcademicRecord::where('user_id', $student->id)->findOrFail($record);

            $record->delete();

            return response()->json([
                'success' => true,
                'message' => 'Academic record deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student or academic record not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete academic record: ' . $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StudentViolation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentViolationController extends Controller
{
    /**
     * Display a listing of violations for a student
     */
    public function index($student)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $violations = $student->violations()->orderBy('violation_date', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $violations
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch violations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created violation for a student
     */
    public function store(Request $request, $student)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $validator = Validator::make($request->all(), [
                'violation_type' => 'required|string|max:100',
                'violation_date' => 'required|date',
                'severity'       => 'required|in:minor,moderate,major',
                'description'    => 'nullable|string',
                'action_taken'   => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $violation = $student->violations()->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Violation created successfully',
                'data' => $violation
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create violation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified violation for a student
     */
    public function update(Request $request, $student, $violation)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $violation = StudentViolation::where('user_id', $student->id)->findOrFail($violation);

            $validator = Validator::make($request->all(), [
                'violation_type' => 'sometimes|required|string|max:100',
                'violation_date' => 'sometimes|required|date',
                'severity'       => 'sometimes|required|in:minor,moderate,major',
                'description'    => 'nullable|string',
                'action_taken'   => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $violation->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Violation updated successfully',
                'data' => $violation
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student or violation not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update violation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified violation for a student
     */
    public function destroy($student, $violation)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $violation = StudentViolation::where('user_id', $student->id)->findOrFail($violation);

            $violation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Violation deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student or violation not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete violation: ' . $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StudentAffiliation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentAffiliationController extends Controller
{
    /**
     * Display a listing of affiliations for a student
     */
    public function index($student)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $affiliations = $student->affiliations()->orderBy('start_date', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $affiliations
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch affiliations: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created affiliation for a student
     */
    public function store(Request $request, $student)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $validator = Validator::make($request->all(), [
                'organization_name' => 'required|string|max:255',
                'affiliation_type'  => 'required|in:academic_org,sports,civic,religious,political,other',
                'role'              => 'nullable|string|max:100',
                'start_date'        => 'nullable|date',
                'end_date'          => 'nullable|date',
                'is_active'         => 'nullable|boolean',
                'description'       => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $affiliation = $student->affiliations()->create($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Affiliation created successfully',
                'data' => $affiliation
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create affiliation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified affiliation for a student
     */
    public function update(Request $request, $student, $affiliation)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $affiliation = StudentAffiliation::where('user_id', $student->id)->findOrFail($affiliation);

            $validator = Validator::make($request->all(), [
                'organization_name' => 'sometimes|required|string|max:255',
                'affiliation_type'  => 'sometimes|required|in:academic_org,sports,civic,religious,political,other',
                'role'              => 'nullable|string|max:100',
                'start_date'        => 'nullable|date',
                'end_date'          => 'nullable|date',
                'is_active'         => 'nullable|boolean',
                'description'       => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $affiliation->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Affiliation updated successfully',
                'data' => $affiliation
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student or affiliation not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update affiliation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified affiliation for a student
     */
    public function destroy($student, $affiliation)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($student);

            $affiliation = StudentAffiliation::where('user_id', $student->id)->findOrFail($affiliation);

            $affiliation->delete();

            return response()->json([
                'success' => true,
                'message' => 'Affiliation deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student or affiliation not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete affiliation: ' . $e->getMessage()
            ], 500);
        }
    }
}

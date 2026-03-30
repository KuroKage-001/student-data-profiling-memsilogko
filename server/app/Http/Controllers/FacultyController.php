<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Faculty::query();

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('faculty_id', 'like', "%{$search}%")
                      ->orWhere('department', 'like', "%{$search}%")
                      ->orWhere('specialization', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by department
            if ($request->has('department') && $request->department !== 'all') {
                $query->where('department', $request->department);
            }

            // Filter by position
            if ($request->has('position') && $request->position !== 'all') {
                $query->where('position', $request->position);
            }

            $faculty = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $faculty
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch faculty members',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:faculty,email',
            'faculty_id' => 'nullable|string|unique:faculty,faculty_id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'department' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'office' => 'nullable|string|max:255',
            'hire_date' => 'required|date',
            'notes' => 'nullable|string',
            'qualifications' => 'nullable|array',
            'courses' => 'nullable|array',
            'status' => 'nullable|in:active,inactive,on leave'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate faculty ID if not provided
            $facultyId = $request->faculty_id ?? $this->generateFacultyId();

            $faculty = Faculty::create(array_merge(
                $request->all(),
                ['faculty_id' => $facultyId]
            ));

            return response()->json([
                'success' => true,
                'message' => 'Faculty member created successfully',
                'data' => $faculty
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create faculty member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $faculty = Faculty::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $faculty
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Faculty member not found'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:faculty,email,' . $id,
            'faculty_id' => 'sometimes|string|unique:faculty,faculty_id,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'department' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'office' => 'nullable|string|max:255',
            'hire_date' => 'sometimes|required|date',
            'notes' => 'nullable|string',
            'qualifications' => 'nullable|array',
            'courses' => 'nullable|array',
            'status' => 'nullable|in:active,inactive,on leave'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $faculty->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Faculty member updated successfully',
                'data' => $faculty
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update faculty member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $faculty = Faculty::findOrFail($id);
            $faculty->delete();

            return response()->json([
                'success' => true,
                'message' => 'Faculty member deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete faculty member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function statistics()
    {
        try {
            $total = Faculty::count();
            $active = Faculty::where('status', 'active')->count();
            $inactive = Faculty::where('status', 'inactive')->count();
            $onLeave = Faculty::where('status', 'on_leave')->count();

            $byDepartment = Faculty::selectRaw('department, count(*) as count')
                ->groupBy('department')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $total,
                    'active' => $active,
                    'inactive' => $inactive,
                    'on_leave' => $onLeave,
                    'by_department' => $byDepartment
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function generateFacultyId()
    {
        $prefix = 'FAC';
        $year = date('y');
        
        // Get the last faculty ID
        $lastFaculty = Faculty::where('faculty_id', 'like', $prefix . $year . '%')
            ->orderBy('faculty_id', 'desc')
            ->first();

        if ($lastFaculty) {
            $lastNumber = intval(substr($lastFaculty->faculty_id, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return $prefix . $year . $newNumber;
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of students
     */
    public function index(Request $request)
    {
        try {
            $query = User::where('role', 'student');

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('student_id', 'like', "%{$search}%")
                      ->orWhere('program', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by year level
            if ($request->has('year_level') && $request->year_level !== 'all') {
                $query->where('year_level', $request->year_level);
            }

            // Filter by program
            if ($request->has('program') && $request->program !== 'all') {
                $query->where('program', $request->program);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $students = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $students
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch students: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created student
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'student_id' => 'required|string|max:50|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'program' => 'required|string|max:100',
            'year_level' => 'required|string|max:20',
            'gpa' => 'nullable|numeric|min:0|max:4.0',
            'enrollment_date' => 'required|date',
            'graduation_date' => 'nullable|date|after:enrollment_date',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,suspended'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $student = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'student',
                'status' => $request->get('status', 'active'),
                'student_id' => $request->student_id,
                'phone' => $request->phone,
                'address' => $request->address,
                'program' => $request->program,
                'year_level' => $request->year_level,
                'gpa' => $request->gpa,
                'enrollment_date' => $request->enrollment_date,
                'graduation_date' => $request->graduation_date,
                'guardian_name' => $request->guardian_name,
                'guardian_phone' => $request->guardian_phone,
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Student created successfully',
                'data' => $student
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create student: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified student
     */
    public function show($id)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $student
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }
    }

    /**
     * Update the specified student
     */
    public function update(Request $request, $id)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|nullable|string|min:8',
                'student_id' => 'sometimes|required|string|max:50|unique:users,student_id,' . $id,
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'program' => 'sometimes|required|string|max:100',
                'year_level' => 'sometimes|required|string|max:20',
                'gpa' => 'nullable|numeric|min:0|max:4.0',
                'enrollment_date' => 'sometimes|required|date',
                'graduation_date' => 'nullable|date|after:enrollment_date',
                'guardian_name' => 'nullable|string|max:255',
                'guardian_phone' => 'nullable|string|max:20',
                'notes' => 'nullable|string',
                'status' => 'sometimes|required|in:active,inactive,suspended'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only([
                'name', 'email', 'student_id', 'phone', 'address', 
                'program', 'year_level', 'gpa', 'enrollment_date', 
                'graduation_date', 'guardian_name', 'guardian_phone', 
                'notes', 'status'
            ]);
            
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $student->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Student updated successfully',
                'data' => $student
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update student: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified student
     */
    public function destroy($id)
    {
        try {
            $student = User::where('role', 'student')->findOrFail($id);
            $student->delete();

            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete student: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_students' => User::where('role', 'student')->count(),
                'active_students' => User::where('role', 'student')->where('status', 'active')->count(),
                'inactive_students' => User::where('role', 'student')->where('status', 'inactive')->count(),
                'suspended_students' => User::where('role', 'student')->where('status', 'suspended')->count(),
                'by_program' => User::where('role', 'student')
                    ->select('program', \DB::raw('count(*) as count'))
                    ->groupBy('program')
                    ->get(),
                'by_year_level' => User::where('role', 'student')
                    ->select('year_level', \DB::raw('count(*) as count'))
                    ->groupBy('year_level')
                    ->get(),
                'average_gpa' => User::where('role', 'student')->avg('gpa'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch student statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
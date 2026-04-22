<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->has('role') && $request->role !== 'all') {
                $query->where('role', $request->role);
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        // Log the incoming request for debugging
        \Log::info('User creation request:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,faculty,student,dept_chair',
            'department' => 'required_if:role,dept_chair,student,faculty,admin|nullable|in:IT,CS',
            'position' => 'required_if:role,faculty,admin,dept_chair|nullable|string|max:100',
            'student_number' => 'required_if:role,student|nullable|string|max:50|unique:users',
            'status' => 'sometimes|in:active,inactive,suspended'
        ]);

        if ($validator->fails()) {
            \Log::error('User creation validation failed:', [
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'status' => $request->get('status', 'active')
            ];

            // Add department if role requires it
            if (in_array($request->role, ['dept_chair', 'student', 'faculty', 'admin'])) {
                $userData['department'] = $request->department;
            }

            // Add position if role is faculty, admin, or dept_chair
            if (in_array($request->role, ['faculty', 'admin', 'dept_chair']) && $request->filled('position')) {
                $userData['position'] = $request->position;
            }

            // Add student_number and program if role is student
            if ($request->role === 'student' && $request->filled('student_number')) {
                $userData['student_number'] = $request->student_number;
                
                // Auto-set program based on department
                if ($request->department === 'IT') {
                    $userData['program'] = 'Bachelor of Science in Information Technology';
                } elseif ($request->department === 'CS') {
                    $userData['program'] = 'Bachelor of Science in Computer Science';
                }
            }

            $user = User::create($userData);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|nullable|string|min:8',
                'role' => 'sometimes|required|in:admin,faculty,student,dept_chair',
                'department' => 'required_if:role,dept_chair,student,faculty,admin|nullable|in:IT,CS',
                'position' => 'required_if:role,faculty,admin,dept_chair|nullable|string|max:100',
                'student_number' => 'required_if:role,student|nullable|string|max:50|unique:users,student_number,' . $id,
                'status' => 'sometimes|required|in:active,inactive,suspended'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only(['name', 'email', 'role', 'status']);
            
            // Handle department and position based on role
            if ($request->has('role')) {
                // Handle department
                if (in_array($request->role, ['dept_chair', 'student', 'faculty', 'admin']) && $request->has('department')) {
                    $updateData['department'] = $request->department;
                    
                    // Auto-set program for student based on department
                    if ($request->role === 'student') {
                        if ($request->department === 'IT') {
                            $updateData['program'] = 'Bachelor of Science in Information Technology';
                        } elseif ($request->department === 'CS') {
                            $updateData['program'] = 'Bachelor of Science in Computer Science';
                        }
                    }
                } else {
                    $updateData['department'] = null;
                    $updateData['program'] = null;
                }

                // Handle position for faculty, admin, and dept_chair
                if (in_array($request->role, ['faculty', 'admin', 'dept_chair']) && $request->has('position')) {
                    $updateData['position'] = $request->position;
                } else {
                    $updateData['position'] = null;
                }

                // Handle student_number for student role
                if ($request->role === 'student' && $request->has('student_number')) {
                    $updateData['student_number'] = $request->student_number;
                } else {
                    $updateData['student_number'] = null;
                }
            }
            
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deleting own account
            if (auth('api')->id() === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot delete your own account'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Debug endpoint to test user creation validation
     */
    public function debug(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Debug endpoint working',
            'received_data' => $request->all(),
            'validation_rules' => [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,faculty,student,dept_chair',
                'department' => 'required_if:role,dept_chair,student,faculty,admin|nullable|in:IT,CS',
                'position' => 'required_if:role,faculty,admin,dept_chair|nullable|string|max:100',
                'student_number' => 'required_if:role,student|nullable|string|max:50|unique:users',
                'status' => 'sometimes|in:active,inactive,suspended'
            ]
        ]);
    }

    /**
     * Get user statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'inactive_users' => User::where('status', 'inactive')->count(),
                'suspended_users' => User::where('status', 'suspended')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'faculty' => User::where('role', 'faculty')->count(),
                'students' => User::where('role', 'student')->count(),
                'dept_chairs' => User::where('role', 'dept_chair')->count(),
                'dept_chair_it' => User::where('role', 'dept_chair')->where('department', 'IT')->count(),
                'dept_chair_cs' => User::where('role', 'dept_chair')->where('department', 'CS')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}

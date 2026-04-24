<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    /**
     * Generate next available student number for a department
     */
    private function generateStudentNumber($department)
    {
        $year = date('Y');
        $prefix = $year . '-' . $department;
        
        // Get the highest existing student number for this department and year
        $lastStudent = User::where('student_number', 'LIKE', $prefix . '%')
            ->orderBy('student_number', 'desc')
            ->first();
        
        if ($lastStudent) {
            // Extract the number part and increment
            $lastNumber = (int) substr($lastStudent->student_number, -5);
            $nextNumber = $lastNumber + 1;
        } else {
            // Start from 1 if no existing students
            $nextNumber = 1;
        }
        
        // Format with leading zeros
        return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    /**
     * Generate unique student ID for student profile
     */
    private function generateStudentId($department)
    {
        $year = date('Y');
        $prefix = 'STU' . $year . '-' . $department;
        
        // Get the highest existing student ID for this department and year
        $lastStudent = User::where('student_id', 'LIKE', $prefix . '%')
            ->orderBy('student_id', 'desc')
            ->first();
        
        if ($lastStudent) {
            // Extract the number part and increment
            $lastNumber = (int) substr($lastStudent->student_id, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            // Start from 1 if no existing students
            $nextNumber = 1;
        }
        
        // Format with leading zeros (4 digits)
        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,faculty,student,dept_chair',
            'department' => 'required_if:role,dept_chair,student,faculty,admin|nullable|in:IT,CS',
            'position' => 'required_if:role,faculty,admin,dept_chair|nullable|string|max:100',
            'student_number' => 'nullable|string|max:50|unique:users',
            'status' => 'sometimes|in:active,inactive,suspended'
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
            if ($request->role === 'student') {
                // Auto-generate student number if not provided or if it already exists
                if (!$request->filled('student_number') || User::where('student_number', $request->student_number)->exists()) {
                    $userData['student_number'] = $this->generateStudentNumber($request->department);
                } else {
                    $userData['student_number'] = $request->student_number;
                }
                
                // Auto-set program based on department
                if ($request->department === 'IT') {
                    $userData['program'] = 'Bachelor of Science in Information Technology';
                } elseif ($request->department === 'CS') {
                    $userData['program'] = 'Bachelor of Science in Computer Science';
                }
                
                // Auto-generate student_id for student profile
                $userData['student_id'] = $this->generateStudentId($request->department);
                
                // Set default enrollment date to today
                $userData['enrollment_date'] = now()->toDateString();
                
                // Set default year level to 1st Year if not provided
                $userData['year_level'] = '1st Year';
            }

            $user = User::create($userData);

            // Auto-create Faculty record if role is faculty
            if ($request->role === 'faculty') {
                $facultyId = $this->generateFacultyId();
                
                Faculty::create([
                    'user_id' => $user->id,
                    'faculty_id' => $facultyId,
                    'name' => $request->name,
                    'email' => $request->email,
                    'department' => $request->department ?? 'IT',
                    'position' => $request->position ?? 'Instructor',
                    'specialization' => 'General',
                    'hire_date' => now(),
                    'status' => 'active'
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully' . ($request->role === 'faculty' ? ' with faculty profile' : ''),
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Generate a unique faculty ID
     */
    private function generateFacultyId()
    {
        $prefix = 'FAC';
        $year = date('y');
        
        // Get the last faculty ID for this year
        $lastFaculty = Faculty::where('faculty_id', 'like', "{$prefix}{$year}%")
            ->orderBy('faculty_id', 'desc')
            ->first();
        
        if ($lastFaculty) {
            // Extract the number and increment
            $lastNumber = intval(substr($lastFaculty->faculty_id, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            // Start with 0001
            $newNumber = '0001';
        }
        
        return "{$prefix}{$year}{$newNumber}";
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
            DB::beginTransaction();
            
            $user = User::findOrFail($id);
            $oldRole = $user->role;

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
                DB::rollBack();
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
                    
                    // Auto-generate student_id if not already set
                    if (!$user->student_id) {
                        $updateData['student_id'] = $this->generateStudentId($request->department);
                    }
                    
                    // Set default enrollment date if not already set
                    if (!$user->enrollment_date) {
                        $updateData['enrollment_date'] = now()->toDateString();
                    }
                    
                    // Set default year level if not already set
                    if (!$user->year_level) {
                        $updateData['year_level'] = '1st Year';
                    }
                } else {
                    $updateData['student_number'] = null;
                    // Clear student profile fields when role changes from student
                    if ($oldRole === 'student' && $request->role !== 'student') {
                        $updateData['student_id'] = null;
                        $updateData['year_level'] = null;
                        $updateData['enrollment_date'] = null;
                        $updateData['graduation_date'] = null;
                        $updateData['gpa'] = null;
                        $updateData['guardian_name'] = null;
                        $updateData['guardian_phone'] = null;
                    }
                }
            }
            
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            // Handle Faculty record creation/update when role changes to faculty
            if ($request->has('role') && $request->role === 'faculty' && $oldRole !== 'faculty') {
                // Create faculty record if it doesn't exist
                $existingFaculty = Faculty::where('user_id', $user->id)->first();
                
                if (!$existingFaculty) {
                    $facultyId = $this->generateFacultyId();
                    
                    Faculty::create([
                        'user_id' => $user->id,
                        'faculty_id' => $facultyId,
                        'name' => $user->name,
                        'email' => $user->email,
                        'department' => $request->department ?? 'IT',
                        'position' => $request->position ?? 'Instructor',
                        'specialization' => 'General',
                        'hire_date' => now(),
                        'status' => 'active'
                    ]);
                }
            }
            
            // Update faculty record if user is faculty and name/email changed
            if ($user->role === 'faculty' && ($request->has('name') || $request->has('email'))) {
                Faculty::where('user_id', $user->id)->update([
                    'name' => $user->name,
                    'email' => $user->email,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
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

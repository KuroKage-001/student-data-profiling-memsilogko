<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Get authenticated user
            $user = auth('api')->user();

            // Generate cache parameters
            $cacheParams = [
                'user_id' => $user ? $user->id : 'guest',
                'user_role' => $user ? $user->role : 'guest',
                'user_department' => ($user && $user->department) ? $user->department : 'all',
                'search' => $request->get('search', ''),
                'status' => $request->get('status', 'all'),
                'department' => $request->get('department', 'all'),
                'position' => $request->get('position', 'all'),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
            ];

            $result = CacheService::remember(
                CacheService::PREFIX_FACULTY,
                $cacheParams,
                function () use ($request, $user) {
                    $query = Faculty::query();

                    // Department-based filtering for department chairmen
                    if ($user && $user->role === 'dept_chair' && $user->department) {
                        // Department chairmen can only see faculty from their department
                        $query->where('department', $user->department);
                    }

                    // Search functionality
                    if ($request->has('search') && $request->search) {
                        $search = $request->search;
                        $query->where(function($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('faculty_id', 'like', "%{$search}%")
                              ->orWhere('department', 'like', "%{$search}%")
                              ->orWhere('specialization', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                        });
                    }

                    // Filter by status
                    if ($request->has('status') && $request->status !== 'all') {
                        $query->where('status', $request->status);
                    }

                    // Filter by department (only for admins)
                    if ($request->has('department') && $request->department !== 'all') {
                        // Only apply if user is admin (dept chairs already filtered above)
                        if (!$user || $user->role !== 'dept_chair') {
                            $query->where('department', $request->department);
                        }
                    }

                    // Filter by position
                    if ($request->has('position') && $request->position !== 'all') {
                        $query->where('position', $request->position);
                    }

                    // Sorting
                    $sortBy = $request->get('sort_by', 'created_at');
                    $sortOrder = $request->get('sort_order', 'desc');
                    
                    // Validate sort fields
                    $allowedSortFields = ['name', 'faculty_id', 'department', 'position', 'hire_date', 'created_at', 'status'];
                    if (in_array($sortBy, $allowedSortFields)) {
                        $query->orderBy($sortBy, $sortOrder);
                    } else {
                        $query->orderBy('created_at', 'desc');
                    }

                    $faculty = $query->get();

                    return [
                        'faculty' => $faculty,
                        'total' => $faculty->count(),
                        'filtered_by_department' => $user && $user->role === 'dept_chair' ? $user->department : null
                    ];
                },
                CacheService::DEFAULT_TTL
            );

            return response()->json([
                'success' => true,
                'data' => $result['faculty'],
                'meta' => [
                    'total' => $result['total'],
                    'filtered_by_department' => $result['filtered_by_department']
                ]
            ], 200)->header('X-Cache-Enabled', 'true');
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

            // Invalidate faculty and statistics caches
            CacheService::invalidateRelated(CacheService::PREFIX_FACULTY);

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
            $faculty = CacheService::remember(
                CacheService::PREFIX_FACULTY,
                ['id' => $id],
                function () use ($id) {
                    return Faculty::findOrFail($id);
                },
                CacheService::DEFAULT_TTL
            );

            return response()->json([
                'success' => true,
                'data' => $faculty
            ], 200)->header('X-Cache-Enabled', 'true');
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

            // Invalidate faculty and statistics caches
            CacheService::invalidateRelated(CacheService::PREFIX_FACULTY);

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

            // Invalidate faculty and statistics caches
            CacheService::invalidateRelated(CacheService::PREFIX_FACULTY);

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
            // Get authenticated user
            $user = auth('api')->user();
            
            $cacheParams = [
                'user_id' => $user ? $user->id : 'guest',
                'user_role' => $user ? $user->role : 'guest',
                'user_department' => ($user && $user->department) ? $user->department : 'all',
            ];

            $statistics = CacheService::remember(
                CacheService::PREFIX_STATISTICS . '_' . CacheService::PREFIX_FACULTY,
                $cacheParams,
                function () use ($user) {
                    $query = Faculty::query();
                    
                    // Filter by department for department chairmen
                    if ($user && $user->role === 'dept_chair' && $user->department) {
                        $query->where('department', $user->department);
                    }
                    
                    $total = (clone $query)->count();
                    $active = (clone $query)->where('status', 'active')->count();
                    $inactive = (clone $query)->where('status', 'inactive')->count();
                    $onLeave = (clone $query)->where('status', 'on_leave')->count();

                    $byDepartment = (clone $query)->selectRaw('department, count(*) as count')
                        ->groupBy('department')
                        ->get();

                    return [
                        'total' => $total,
                        'active' => $active,
                        'inactive' => $inactive,
                        'on_leave' => $onLeave,
                        'by_department' => $byDepartment,
                        'filtered_by_department' => $user && $user->role === 'dept_chair' ? $user->department : null
                    ];
                },
                CacheService::DEFAULT_TTL
            );

            return response()->json([
                'success' => true,
                'data' => $statistics
            ], 200)->header('X-Cache-Enabled', 'true');
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

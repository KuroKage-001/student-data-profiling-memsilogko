<?php

namespace App\Http\Controllers;

use App\Models\Instruction;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class InstructionController extends Controller
{
    /**
     * Display a listing of the resource with search and filter.
     * Implements caching for improved performance.
     */
    public function index(Request $request)
    {
        // Generate cache parameters from request
        $cacheParams = [
            'search' => $request->get('search', ''),
            'type' => $request->get('type', ''),
            'department' => $request->get('department', ''),
            'semester' => $request->get('semester', ''),
            'academic_year' => $request->get('academic_year', ''),
            'status' => $request->get('status', ''),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_order' => $request->get('sort_order', 'desc'),
            'per_page' => $request->get('per_page', 10),
            'page' => $request->get('page', 1),
        ];

        // Use cache service to remember the query result
        $instructions = CacheService::remember(
            CacheService::PREFIX_INSTRUCTIONS,
            $cacheParams,
            function () use ($request) {
                $query = Instruction::query();

                // Search functionality
                if ($request->has('search') && $request->search) {
                    $search = $request->search;
                    $query->where(function($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                          ->orWhere('course_name', 'like', "%{$search}%")
                          ->orWhere('course_code', 'like', "%{$search}%")
                          ->orWhere('instructor', 'like', "%{$search}%");
                    });
                }

                // Filter by type
                if ($request->has('type') && $request->type) {
                    $query->where('type', $request->type);
                }

                // Filter by department
                if ($request->has('department') && $request->department) {
                    $query->where('department', $request->department);
                }

                // Filter by semester
                if ($request->has('semester') && $request->semester) {
                    $query->where('semester', $request->semester);
                }

                // Filter by academic year
                if ($request->has('academic_year') && $request->academic_year) {
                    $query->where('academic_year', $request->academic_year);
                }

                // Filter by status
                if ($request->has('status') && $request->status) {
                    $query->where('status', $request->status);
                }

                // Sort
                $sortBy = $request->get('sort_by', 'created_at');
                $sortOrder = $request->get('sort_order', 'desc');
                $query->orderBy($sortBy, $sortOrder);

                return $query->paginate($request->get('per_page', 10));
            },
            CacheService::DEFAULT_TTL
        );

        return response()->json($instructions)
            ->header('X-Cache-Enabled', 'true');
    }

    /**
     * Store a newly created resource in storage.
     * Invalidates cache after successful creation.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:syllabus,curriculum,lesson',
            'course_code' => 'nullable|string|max:50',
            'course_name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'instructor' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:20',
            'semester' => 'nullable|string|max:20',
            'units' => 'nullable|integer|min:0',
            'learning_outcomes' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'topics' => 'nullable|array',
            'status' => 'nullable|in:active,draft,archived'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('file');

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('instructions', $filename, 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $instruction = Instruction::create($data);

        // Invalidate all instruction caches
        CacheService::invalidate(CacheService::PREFIX_INSTRUCTIONS);

        return response()->json([
            'message' => 'Instruction created successfully',
            'data' => $instruction
        ], 201);
    }

    /**
     * Display the specified resource.
     * Implements caching for individual instruction retrieval.
     */
    public function show(string $id)
    {
        $instruction = CacheService::remember(
            CacheService::PREFIX_INSTRUCTIONS,
            ['id' => $id],
            function () use ($id) {
                return Instruction::findOrFail($id);
            },
            CacheService::DEFAULT_TTL
        );

        return response()->json($instruction)
            ->header('X-Cache-Enabled', 'true');
    }

    /**
     * Update the specified resource in storage.
     * Invalidates cache after successful update.
     */
    public function update(Request $request, string $id)
    {
        $instruction = Instruction::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:syllabus,curriculum,lesson',
            'course_code' => 'nullable|string|max:50',
            'course_name' => 'sometimes|required|string|max:255',
            'department' => 'sometimes|required|string|max:255',
            'instructor' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:20',
            'semester' => 'nullable|string|max:20',
            'units' => 'nullable|integer|min:0',
            'learning_outcomes' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'topics' => 'nullable|array',
            'status' => 'nullable|in:active,draft,archived'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('file');

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('instructions', $filename, 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $instruction->update($data);

        // Invalidate all instruction caches
        CacheService::invalidate(CacheService::PREFIX_INSTRUCTIONS);

        return response()->json([
            'message' => 'Instruction updated successfully',
            'data' => $instruction
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Invalidates cache after successful deletion.
     */
    public function destroy(string $id)
    {
        $instruction = Instruction::findOrFail($id);
        $instruction->delete();

        // Invalidate all instruction caches
        CacheService::invalidate(CacheService::PREFIX_INSTRUCTIONS);

        return response()->json([
            'message' => 'Instruction deleted successfully'
        ]);
    }
}

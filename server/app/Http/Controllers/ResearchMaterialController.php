<?php

namespace App\Http\Controllers;

use App\Models\ResearchMaterial;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class ResearchMaterialController extends Controller
{
    /**
     * Display a listing of the resource with search and filter.
     * Implements caching for improved performance
     */
    public function index(Request $request)
    {
        $cacheParams = [
            'search' => $request->get('search', ''),
            'department' => $request->get('department', ''),
            'research_type' => $request->get('research_type', ''),
            'year' => $request->get('year', ''),
            'status' => $request->get('status', ''),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_order' => $request->get('sort_order', 'desc'),
            'per_page' => $request->get('per_page', 10),
            'page' => $request->get('page', 1),
        ];

        $materials = CacheService::remember(
            'research_materials',
            $cacheParams,
            function () use ($request) {
                $query = ResearchMaterial::query();

                // Search functionality
                if ($request->has('search') && $request->search) {
                    $search = $request->search;
                    $query->where(function($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                          ->orWhere('author', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                    });
                }

                // Filter by department
                if ($request->has('department') && $request->department) {
                    $query->where('faculty_department', $request->department);
                }

                // Filter by research type
                if ($request->has('research_type') && $request->research_type) {
                    $query->where('research_type', $request->research_type);
                }

                // Filter by publication year
                if ($request->has('year') && $request->year) {
                    $query->where('publication_year', $request->year);
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

        return response()->json($materials)
            ->header('X-Cache-Enabled', 'true');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'required|string|max:255',
            'faculty_department' => 'required|string|max:255',
            'research_type' => 'required|string|max:255',
            'publication_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240', // 10MB max
            'external_link' => 'nullable|url',
            'keywords' => 'nullable|array',
            'status' => 'nullable|in:published,draft,archived'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('file');

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('research_materials', $filename, 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $material = ResearchMaterial::create($data);

        // Invalidate research materials cache
        CacheService::invalidate('research_materials');

        return response()->json([
            'message' => 'Research material created successfully',
            'data' => $material
        ], 201);
    }

    /**
     * Display the specified resource.
     * Implements caching for individual research material retrieval
     */
    public function show(string $id)
    {
        $material = CacheService::remember(
            'research_materials',
            ['id' => $id],
            function () use ($id) {
                return ResearchMaterial::findOrFail($id);
            },
            CacheService::DEFAULT_TTL
        );
        
        return response()->json($material)
            ->header('X-Cache-Enabled', 'true');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $material = ResearchMaterial::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'author' => 'sometimes|required|string|max:255',
            'faculty_department' => 'sometimes|required|string|max:255',
            'research_type' => 'sometimes|required|string|max:255',
            'publication_year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            'external_link' => 'nullable|url',
            'keywords' => 'nullable|array',
            'status' => 'nullable|in:published,draft,archived'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('file');

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('research_materials', $filename, 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $material->update($data);

        // Invalidate research materials cache
        CacheService::invalidate('research_materials');

        return response()->json([
            'message' => 'Research material updated successfully',
            'data' => $material
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Invalidates cache after deletion
     */
    public function destroy(string $id)
    {
        $material = ResearchMaterial::findOrFail($id);
        $material->delete();

        // Invalidate research materials cache
        CacheService::invalidate('research_materials');

        return response()->json([
            'message' => 'Research material deleted successfully'
        ]);
    }
}

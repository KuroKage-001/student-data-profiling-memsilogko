<?php

namespace App\Http\Controllers;

use App\Models\Instruction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstructionController extends Controller
{
    /**
     * Display a listing of the resource with search and filter.
     */
    public function index(Request $request)
    {
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

        $instructions = $query->paginate($request->get('per_page', 10));

        return response()->json($instructions);
    }

    /**
     * Store a newly created resource in storage.
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

        return response()->json([
            'message' => 'Instruction created successfully',
            'data' => $instruction
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $instruction = Instruction::findOrFail($id);
        return response()->json($instruction);
    }

    /**
     * Update the specified resource in storage.
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

        return response()->json([
            'message' => 'Instruction updated successfully',
            'data' => $instruction
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $instruction = Instruction::findOrFail($id);
        $instruction->delete();

        return response()->json([
            'message' => 'Instruction deleted successfully'
        ]);
    }
}

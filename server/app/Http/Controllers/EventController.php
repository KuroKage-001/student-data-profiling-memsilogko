<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Search by title or location
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by date range (for calendar view)
        if ($request->has('start') && $request->has('end')) {
            $query->whereBetween('date', [$request->start, $request->end]);
        }

        $events = $query->orderBy('date', 'asc')->orderBy('time', 'asc')->get();

        // Transform for frontend
        $events = $events->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->formatted_date,
                'time' => $event->formatted_time,
                'location' => $event->location,
                'type' => $event->type,
                'status' => $event->status,
                'attendees' => $event->attendees,
                'description' => $event->description,
                'created_by' => $event->created_by,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'status' => 'in:Upcoming,Ongoing,Completed,Cancelled',
            'attendees' => 'integer|min:0',
            'description' => 'nullable|string',
        ]);

        // Convert 12-hour time to 24-hour if needed
        if (preg_match('/\d{1,2}:\d{2}\s*(AM|PM)/i', $validated['time'])) {
            $validated['time'] = date('H:i:s', strtotime($validated['time']));
        }

        $validated['created_by'] = auth()->id();
        $validated['status'] = $validated['status'] ?? 'Upcoming';
        $validated['attendees'] = $validated['attendees'] ?? 0;

        $event = Event::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->formatted_date,
                'time' => $event->formatted_time,
                'location' => $event->location,
                'type' => $event->type,
                'status' => $event->status,
                'attendees' => $event->attendees,
                'description' => $event->description,
            ],
        ], 201);
    }

    public function show(Event $event): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->formatted_date,
                'time' => $event->formatted_time,
                'location' => $event->location,
                'type' => $event->type,
                'status' => $event->status,
                'attendees' => $event->attendees,
                'description' => $event->description,
            ],
        ]);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'date' => 'date',
            'time' => 'string',
            'location' => 'string|max:255',
            'type' => 'string|max:100',
            'status' => 'in:Upcoming,Ongoing,Completed,Cancelled',
            'attendees' => 'integer|min:0',
            'description' => 'nullable|string',
        ]);

        // Convert 12-hour time to 24-hour if needed
        if (isset($validated['time']) && preg_match('/\d{1,2}:\d{2}\s*(AM|PM)/i', $validated['time'])) {
            $validated['time'] = date('H:i:s', strtotime($validated['time']));
        }

        $event->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->formatted_date,
                'time' => $event->formatted_time,
                'location' => $event->location,
                'type' => $event->type,
                'status' => $event->status,
                'attendees' => $event->attendees,
                'description' => $event->description,
            ],
        ]);
    }

    public function destroy(Event $event): JsonResponse
    {
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully',
        ]);
    }

    public function statistics(): JsonResponse
    {
        $total = Event::count();
        $upcoming = Event::where('status', 'Upcoming')->count();
        $ongoing = Event::where('status', 'Ongoing')->count();
        $completed = Event::where('status', 'Completed')->count();
        $cancelled = Event::where('status', 'Cancelled')->count();
        $totalAttendees = Event::sum('attendees');

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'upcoming' => $upcoming,
                'ongoing' => $ongoing,
                'completed' => $completed,
                'cancelled' => $cancelled,
                'totalAttendees' => $totalAttendees,
            ],
        ]);
    }
}

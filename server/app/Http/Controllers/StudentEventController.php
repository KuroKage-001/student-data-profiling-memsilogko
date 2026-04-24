<?php

namespace App\Http\Controllers;

use App\Models\StudentEventRegistration;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentEventController extends Controller
{
    /**
     * Get student's registered events
     */
    public function getMyEvents()
    {
        $studentId = Auth::id();
        
        $registrations = StudentEventRegistration::with('event')
            ->where('student_id', $studentId)
            ->get();

        $events = $registrations->map(function ($registration) {
            $event = $registration->event;
            return [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->formatted_date,
                'time' => $event->formatted_time,
                'location' => $event->location,
                'type' => $event->type,
                'status' => $event->status,
                'description' => $event->description,
                'attendance_status' => $registration->attendance_status,
                'registration_id' => $registration->id,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Get all events (for students to view)
     */
    public function getAllEvents(Request $request)
    {
        $query = Event::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $events = $query->orderBy('date', 'asc')->orderBy('time', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Register student for event (Admin/Faculty only)
     */
    public function registerStudent(Request $request, $eventId)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        try {
            $registration = StudentEventRegistration::create([
                'student_id' => $request->student_id,
                'event_id' => $eventId,
                'attendance_status' => 'registered',
                'registered_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Student registered successfully',
                'data' => $registration,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Student is already registered for this event',
            ], 422);
        }
    }

    /**
     * Unregister student from event (Admin/Faculty only)
     */
    public function unregisterStudent($eventId, $studentId)
    {
        $registration = StudentEventRegistration::where('event_id', $eventId)
            ->where('student_id', $studentId)
            ->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Registration not found',
            ], 404);
        }

        $registration->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student unregistered successfully',
        ]);
    }

    /**
     * Mark attendance (Admin/Faculty only)
     */
    public function markAttendance(Request $request, $eventId)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'attendance_status' => 'required|in:registered,attended,absent,cancelled',
        ]);

        $registration = StudentEventRegistration::where('event_id', $eventId)
            ->where('student_id', $request->student_id)
            ->first();

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Registration not found',
            ], 404);
        }

        $registration->update([
            'attendance_status' => $request->attendance_status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attendance marked successfully',
            'data' => $registration,
        ]);
    }

    /**
     * Get event attendees (Admin/Faculty only)
     */
    public function getEventAttendees($eventId)
    {
        $registrations = StudentEventRegistration::with('student')
            ->where('event_id', $eventId)
            ->get();

        $attendees = $registrations->map(function ($registration) {
            return [
                'id' => $registration->id,
                'student_id' => $registration->student_id,
                'student_name' => $registration->student->name,
                'student_email' => $registration->student->email,
                'student_number' => $registration->student->student_number,
                'attendance_status' => $registration->attendance_status,
                'registered_at' => $registration->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $attendees,
            'total' => $attendees->count(),
        ]);
    }

    /**
     * Bulk register students (Admin/Faculty only)
     */
    public function bulkRegister(Request $request, $eventId)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id',
        ]);

        $registered = [];
        $failed = [];

        foreach ($request->student_ids as $studentId) {
            try {
                $registration = StudentEventRegistration::create([
                    'student_id' => $studentId,
                    'event_id' => $eventId,
                    'attendance_status' => 'registered',
                    'registered_by' => Auth::id(),
                ]);
                $registered[] = $studentId;
            } catch (\Exception $e) {
                $failed[] = $studentId;
            }
        }

        return response()->json([
            'success' => true,
            'message' => count($registered) . ' students registered successfully',
            'registered' => $registered,
            'failed' => $failed,
        ]);
    }
}

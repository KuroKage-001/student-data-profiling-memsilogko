<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentEventRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'event_id',
        'attendance_status',
        'registered_by',
        'notes',
    ];

    /**
     * Get the student
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the event
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the user who registered the student
     */
    public function registeredBy()
    {
        return $this->belongsTo(User::class, 'registered_by');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'time',
        'location',
        'type',
        'status',
        'attendees',
        'description',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'attendees' => 'integer',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Format time for display (e.g., "09:00 AM")
    public function getFormattedTimeAttribute()
    {
        return date('h:i A', strtotime($this->time));
    }

    // Format date for display
    public function getFormattedDateAttribute()
    {
        return $this->date->format('Y-m-d');
    }
}

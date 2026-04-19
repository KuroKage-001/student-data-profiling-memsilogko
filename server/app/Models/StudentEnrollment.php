<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'class_section_id',
        'enrollment_status',
        'enrollment_date',
        'drop_date',
        'grade',
        'notes',
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'drop_date' => 'date',
        'grade' => 'decimal:2',
    ];

    /**
     * Get the student (user) that owns the enrollment
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the class section that owns the enrollment
     */
    public function classSection()
    {
        return $this->belongsTo(ClassSection::class);
    }

    /**
     * Scope a query to only include enrolled students
     */
    public function scopeEnrolled($query)
    {
        return $query->where('enrollment_status', 'enrolled');
    }

    /**
     * Scope a query to only include dropped students
     */
    public function scopeDropped($query)
    {
        return $query->where('enrollment_status', 'dropped');
    }

    /**
     * Scope a query to only include completed students
     */
    public function scopeCompleted($query)
    {
        return $query->where('enrollment_status', 'completed');
    }
}

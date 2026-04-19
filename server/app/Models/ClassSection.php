<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_code',
        'course_code',
        'course_name',
        'room',
        'day_of_week',
        'start_time',
        'end_time',
        'semester',
        'academic_year',
        'max_capacity',
        'current_enrollment',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'max_capacity' => 'integer',
        'current_enrollment' => 'integer',
    ];

    /**
     * Get the faculty assignments for this class section
     */
    public function facultyAssignments()
    {
        return $this->hasMany(FacultyClassAssignment::class);
    }

    /**
     * Get the primary faculty member assigned to this class
     */
    public function primaryFaculty()
    {
        return $this->facultyAssignments()
            ->where('assignment_type', 'primary')
            ->where('status', 'active')
            ->with('faculty')
            ->first();
    }

    /**
     * Get all active faculty members assigned to this class
     */
    public function activeFaculty()
    {
        return $this->facultyAssignments()
            ->where('status', 'active')
            ->with('faculty')
            ->get();
    }

    /**
     * Check if the class is full
     */
    public function isFull()
    {
        return $this->current_enrollment >= $this->max_capacity;
    }

    /**
     * Get enrollment percentage
     */
    public function getEnrollmentPercentageAttribute()
    {
        if ($this->max_capacity == 0) {
            return 0;
        }
        return round(($this->current_enrollment / $this->max_capacity) * 100, 2);
    }

    /**
     * Get formatted time range
     */
    public function getTimeRangeAttribute()
    {
        return date('h:i A', strtotime($this->start_time)) . ' - ' . date('h:i A', strtotime($this->end_time));
    }

    /**
     * Scope to filter by semester
     */
    public function scopeBySemester($query, $semester, $academicYear = null)
    {
        $query->where('semester', $semester);
        
        if ($academicYear) {
            $query->where('academic_year', $academicYear);
        }
        
        return $query;
    }

    /**
     * Scope to filter by status
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to filter by day
     */
    public function scopeByDay($query, $day)
    {
        return $query->where('day_of_week', $day);
    }
}

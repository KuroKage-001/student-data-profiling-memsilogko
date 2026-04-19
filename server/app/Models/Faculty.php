<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';

    protected $fillable = [
        'faculty_id',
        'name',
        'email',
        'phone',
        'address',
        'department',
        'position',
        'specialization',
        'office',
        'hire_date',
        'notes',
        'qualifications',
        'courses',
        'status'
    ];

    protected $casts = [
        'hire_date' => 'date',
        'courses' => 'array',
        'qualifications' => 'array'
    ];

    /**
     * Get the class assignments for this faculty member
     */
    public function classAssignments()
    {
        return $this->hasMany(FacultyClassAssignment::class);
    }

    /**
     * Get active class assignments
     */
    public function activeClassAssignments()
    {
        return $this->hasMany(FacultyClassAssignment::class)
            ->where('status', 'active')
            ->with('classSection');
    }

    /**
     * Get classes assigned to this faculty member
     */
    public function assignedClasses()
    {
        return $this->hasManyThrough(
            ClassSection::class,
            FacultyClassAssignment::class,
            'faculty_id',
            'id',
            'id',
            'class_section_id'
        )->where('faculty_class_assignments.status', 'active');
    }
}

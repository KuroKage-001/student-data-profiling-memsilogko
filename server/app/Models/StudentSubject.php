<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_record_id',
        'subject_code',
        'subject_name',
        'units',
        'grade',
    ];

    /**
     * Get the academic record that owns the subject
     */
    public function academicRecord()
    {
        return $this->belongsTo(StudentAcademicRecord::class);
    }
}

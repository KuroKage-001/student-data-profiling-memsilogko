<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAcademicRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'semester',
        'academic_year',
        'semester_gpa',
        'remarks',
    ];

    /**
     * Get the user that owns the academic record
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subjects for the academic record
     */
    public function subjects()
    {
        return $this->hasMany(StudentSubject::class, 'academic_record_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instruction extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'course_code',
        'course_name',
        'department',
        'instructor',
        'academic_year',
        'semester',
        'units',
        'learning_outcomes',
        'file_url',
        'topics',
        'status'
    ];

    protected $casts = [
        'topics' => 'array',
        'units' => 'integer'
    ];
}

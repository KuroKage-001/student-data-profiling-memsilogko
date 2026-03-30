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
}

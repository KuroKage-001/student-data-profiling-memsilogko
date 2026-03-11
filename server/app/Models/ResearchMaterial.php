<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResearchMaterial extends Model
{
    protected $fillable = [
        'title',
        'description',
        'author',
        'faculty_department',
        'research_type',
        'publication_year',
        'file_url',
        'external_link',
        'keywords',
        'status'
    ];

    protected $casts = [
        'keywords' => 'array',
        'publication_year' => 'integer'
    ];
}

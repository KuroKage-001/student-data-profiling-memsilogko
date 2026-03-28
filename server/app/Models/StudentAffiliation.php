<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentAffiliation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_name',
        'affiliation_type',
        'role',
        'start_date',
        'end_date',
        'is_active',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the affiliation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

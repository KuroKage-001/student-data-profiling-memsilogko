<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentViolation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'violation_type',
        'description',
        'violation_date',
        'severity',
        'action_taken',
    ];

    protected $casts = [
        'violation_date' => 'date',
    ];

    /**
     * Get the user that owns the violation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

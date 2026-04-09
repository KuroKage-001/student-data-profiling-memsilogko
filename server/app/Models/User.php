<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department',
        'position',
        'status',
        'student_id',
        'student_number',
        'phone',
        'address',
        'program',
        'year_level',
        'gpa',
        'enrollment_date',
        'graduation_date',
        'guardian_name',
        'guardian_phone',
        'notes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Check if user is active
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Check if user is inactive
     *
     * @return bool
     */
    public function isInactive()
    {
        return $this->status === 'inactive';
    }

    /**
     * Check if user is suspended
     *
     * @return bool
     */
    public function isSuspended()
    {
        return $this->status === 'suspended';
    }

    /**
     * Get status label
     *
     * @return string
     */
    public function getStatusLabelAttribute()
    {
        return ucfirst($this->status);
    }

    /**
     * Check if user is department chairman
     *
     * @return bool
     */
    public function isDeptChair()
    {
        return $this->role === 'dept_chair';
    }

    /**
     * Check if user is admin
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Get role label
     *
     * @return string
     */
    public function getRoleLabelAttribute()
    {
        return match($this->role) {
            'dept_chair' => 'Department Chairman',
            'admin' => 'Administrator',
            'faculty' => 'Faculty',
            'student' => 'Student',
            default => ucfirst($this->role)
        };
    }

    /**
     * Get the skills for the student
     */
    public function skills()
    {
        return $this->hasMany(StudentSkill::class);
    }

    /**
     * Get the activities for the student
     */
    public function activities()
    {
        return $this->hasMany(StudentActivity::class);
    }

    public function violations()
    {
        return $this->hasMany(StudentViolation::class);
    }

    public function affiliations()
    {
        return $this->hasMany(StudentAffiliation::class);
    }

    public function academicRecords()
    {
        return $this->hasMany(StudentAcademicRecord::class);
    }
}

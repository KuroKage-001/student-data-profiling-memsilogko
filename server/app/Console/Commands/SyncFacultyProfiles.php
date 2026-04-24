<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Faculty;
use Illuminate\Console\Command;

class SyncFacultyProfiles extends Command
{
    protected $signature = 'faculty:sync';
    protected $description = 'Create faculty profiles for users with faculty role who don\'t have one';

    public function handle()
    {
        $this->info('Syncing faculty profiles...');
        
        // Get all users with faculty role
        $facultyUsers = User::where('role', 'faculty')->get();
        
        $created = 0;
        $skipped = 0;
        
        foreach ($facultyUsers as $user) {
            // Check if faculty profile already exists
            $existingFaculty = Faculty::where('user_id', $user->id)
                ->orWhere('email', $user->email)
                ->first();
            
            if ($existingFaculty) {
                // Update user_id if missing
                if (!$existingFaculty->user_id) {
                    $existingFaculty->update(['user_id' => $user->id]);
                    $this->info("Updated user_id for: {$user->name}");
                }
                $skipped++;
                continue;
            }
            
            // Generate faculty ID
            $facultyId = $this->generateFacultyId();
            
            // Create faculty profile
            Faculty::create([
                'user_id' => $user->id,
                'faculty_id' => $facultyId,
                'name' => $user->name,
                'email' => $user->email,
                'department' => $user->department ?? 'IT',
                'position' => $user->position ?? 'Instructor',
                'specialization' => 'General',
                'hire_date' => now(),
                'status' => 'active'
            ]);
            
            $this->info("Created faculty profile for: {$user->name} ({$user->email})");
            $created++;
        }
        
        $this->info("\nSync complete!");
        $this->info("Created: {$created}");
        $this->info("Skipped: {$skipped}");
        
        return 0;
    }
    
    private function generateFacultyId()
    {
        $prefix = 'FAC';
        $year = date('y');
        
        // Get the last faculty ID for this year
        $lastFaculty = Faculty::where('faculty_id', 'like', "{$prefix}{$year}%")
            ->orderBy('faculty_id', 'desc')
            ->first();
        
        if ($lastFaculty) {
            // Extract the number and increment
            $lastNumber = intval(substr($lastFaculty->faculty_id, -4));
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            // Start with 0001
            $newNumber = '0001';
        }
        
        return "{$prefix}{$year}{$newNumber}";
    }
}

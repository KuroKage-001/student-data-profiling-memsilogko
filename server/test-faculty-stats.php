<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$userId = 112;

$user = App\Models\User::find($userId);
echo "User ID: {$user->id}\n";
echo "User Role: {$user->role}\n";

$faculty = App\Models\Faculty::where('user_id', $userId)->first();
if ($faculty) {
    echo "Faculty ID: {$faculty->id}\n";
    echo "Faculty Name: {$faculty->name}\n";
    
    $assignments = App\Models\FacultyClassAssignment::where('faculty_id', $faculty->id)
        ->where('status', 'active')
        ->get();
    
    echo "Active Assignments: " . $assignments->count() . "\n";
    
    if ($assignments->count() > 0) {
        echo "\nAssignments:\n";
        foreach ($assignments as $assignment) {
            echo "  - Class Section ID: {$assignment->class_section_id}\n";
        }
    }
} else {
    echo "Faculty Profile: NOT FOUND\n";
}

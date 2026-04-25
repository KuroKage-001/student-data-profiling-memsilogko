<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class FixAllStudentProgramsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder fixes ALL student accounts to have proper program assignments (IT or CS).
     * It handles:
     * - Students with NULL program
     * - Students with empty program
     * - Students with invalid program values
     * - Students without year_level
     * - Students without student_id
     */
    public function run(): void
    {
        $this->command->info('=== Fixing Student Programs ===');
        $this->command->info('');

        // Get all students
        $allStudents = User::where('role', 'student')->get();
        $this->command->info("Total students in database: {$allStudents->count()}");

        // Find students with issues
        $studentsNeedingFix = User::where('role', 'student')
            ->where(function($query) {
                $query->whereNull('program')
                      ->orWhere('program', '')
                      ->orWhereNotIn('program', ['IT', 'CS']);
            })
            ->get();

        $this->command->info("Students needing program fix: {$studentsNeedingFix->count()}");

        if ($studentsNeedingFix->isEmpty()) {
            $this->command->info('✓ All students already have valid program assignments!');
        } else {
            $this->command->info('');
            $this->command->info('Updating student programs...');
            
            $programs = ['IT', 'CS'];
            $updated = 0;

            foreach ($studentsNeedingFix as $index => $student) {
                // Alternate between IT and CS
                $program = $programs[$index % 2];
                
                $student->update([
                    'program' => $program
                ]);
                
                $updated++;
                
                if ($updated % 20 == 0) {
                    $this->command->info("  Updated {$updated}/{$studentsNeedingFix->count()} students...");
                }
            }

            $this->command->info("✓ Updated {$updated} students with program assignments");
        }

        // Fix year levels
        $this->command->info('');
        $studentsWithoutYear = User::where('role', 'student')
            ->where(function($query) {
                $query->whereNull('year_level')
                      ->orWhere('year_level', 0)
                      ->orWhere('year_level', '<', 1)
                      ->orWhere('year_level', '>', 4);
            })
            ->get();
            
        if ($studentsWithoutYear->count() > 0) {
            $this->command->info("Fixing year levels for {$studentsWithoutYear->count()} students...");
            
            foreach ($studentsWithoutYear as $student) {
                // Assign random year level between 1-4
                $student->update([
                    'year_level' => rand(1, 4)
                ]);
            }
            
            $this->command->info("✓ Year levels fixed");
        } else {
            $this->command->info('✓ All students have valid year levels');
        }

        // Fix student IDs
        $this->command->info('');
        $studentsWithoutId = User::where('role', 'student')
            ->where(function($query) {
                $query->whereNull('student_id')
                      ->orWhere('student_id', '');
            })
            ->get();
            
        if ($studentsWithoutId->count() > 0) {
            $this->command->info("Generating student IDs for {$studentsWithoutId->count()} students...");
            
            $year = date('Y');
            $counter = 1;
            
            foreach ($studentsWithoutId as $student) {
                $program = $student->program ?? 'IT';
                $studentId = "{$program}-{$year}-" . str_pad($counter, 3, '0', STR_PAD_LEFT);
                
                $student->update([
                    'student_id' => $studentId
                ]);
                
                $counter++;
            }
            
            $this->command->info("✓ Student IDs generated");
        } else {
            $this->command->info('✓ All students have student IDs');
        }

        // Ensure all students are active
        $this->command->info('');
        $inactiveStudents = User::where('role', 'student')
            ->where('status', '!=', 'active')
            ->count();
            
        if ($inactiveStudents > 0) {
            User::where('role', 'student')
                ->where('status', '!=', 'active')
                ->update(['status' => 'active']);
                
            $this->command->info("✓ Activated {$inactiveStudents} inactive students");
        } else {
            $this->command->info('✓ All students are active');
        }

        // Show final statistics
        $this->command->info('');
        $this->command->info('=== Final Statistics ===');
        
        $totalStudents = User::where('role', 'student')->count();
        $activeStudents = User::where('role', 'student')->where('status', 'active')->count();
        $itStudents = User::where('role', 'student')->where('program', 'IT')->count();
        $csStudents = User::where('role', 'student')->where('program', 'CS')->count();
        $studentsWithYear = User::where('role', 'student')->whereNotNull('year_level')->count();
        $studentsWithId = User::where('role', 'student')->whereNotNull('student_id')->count();
        
        $this->command->table(
            ['Metric', 'Count'],
            [
                ['Total Students', $totalStudents],
                ['Active Students', $activeStudents],
                ['IT Students', $itStudents],
                ['CS Students', $csStudents],
                ['Students with Year Level', $studentsWithYear],
                ['Students with Student ID', $studentsWithId],
            ]
        );
        
        // Show year level distribution
        $this->command->info('');
        $this->command->info('Year Level Distribution:');
        for ($year = 1; $year <= 4; $year++) {
            $count = User::where('role', 'student')->where('year_level', $year)->count();
            $this->command->info("  Year {$year}: {$count} students");
        }
        
        $this->command->info('');
        $this->command->info('✓ All done! Students are now ready for enrollment.');
        $this->command->info('');
        $this->command->info('You can now:');
        $this->command->info('  1. Refresh the enrollment modal');
        $this->command->info('  2. IT students will appear for IT courses');
        $this->command->info('  3. CS students will appear for CS courses');
    }
}

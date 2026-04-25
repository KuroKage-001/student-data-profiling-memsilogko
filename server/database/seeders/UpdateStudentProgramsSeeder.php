<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UpdateStudentProgramsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder updates existing student accounts to have proper program assignments (IT or CS).
     * It distributes students evenly between IT and CS programs.
     */
    public function run(): void
    {
        $this->command->info('Starting to update student programs...');

        // Get all students without a program or with NULL program
        $studentsWithoutProgram = User::where('role', 'student')
            ->whereNull('program')
            ->orWhere('program', '')
            ->get();

        $this->command->info("Found {$studentsWithoutProgram->count()} students without program assignment");

        if ($studentsWithoutProgram->isEmpty()) {
            $this->command->info('All students already have program assignments!');
            
            // Show current distribution
            $itCount = User::where('role', 'student')->where('program', 'IT')->count();
            $csCount = User::where('role', 'student')->where('program', 'CS')->count();
            $this->command->info("Current distribution: IT={$itCount}, CS={$csCount}");
            
            return;
        }

        // Distribute students evenly between IT and CS
        $programs = ['IT', 'CS'];
        $updated = 0;

        foreach ($studentsWithoutProgram as $index => $student) {
            // Alternate between IT and CS
            $program = $programs[$index % 2];
            
            $student->update([
                'program' => $program
            ]);
            
            $updated++;
            
            if ($updated % 10 == 0) {
                $this->command->info("Updated {$updated} students...");
            }
        }

        $this->command->info("✓ Successfully updated {$updated} students with program assignments");

        // Show final distribution
        $itCount = User::where('role', 'student')->where('program', 'IT')->count();
        $csCount = User::where('role', 'student')->where('program', 'CS')->count();
        $totalStudents = User::where('role', 'student')->count();
        
        $this->command->info("\n=== Final Student Distribution ===");
        $this->command->info("Total Students: {$totalStudents}");
        $this->command->info("IT Students: {$itCount}");
        $this->command->info("CS Students: {$csCount}");
        $this->command->info("Students without program: " . User::where('role', 'student')->whereNull('program')->count());
        
        // Also update year_level if NULL
        $studentsWithoutYear = User::where('role', 'student')
            ->whereNull('year_level')
            ->get();
            
        if ($studentsWithoutYear->count() > 0) {
            $this->command->info("\nUpdating year levels for {$studentsWithoutYear->count()} students...");
            
            foreach ($studentsWithoutYear as $student) {
                // Assign random year level between 1-4
                $student->update([
                    'year_level' => rand(1, 4)
                ]);
            }
            
            $this->command->info("✓ Year levels updated");
        }
        
        $this->command->info("\n✓ All done! Students are now ready for enrollment.");
    }
}

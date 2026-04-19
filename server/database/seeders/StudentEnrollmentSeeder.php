<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ClassSection;
use App\Models\StudentEnrollment;
use Illuminate\Support\Facades\DB;

class StudentEnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reconnect to ensure fresh connection
        DB::reconnect();
        
        // Get all active students
        $students = User::where('role', 'student')
            ->where('status', 'active')
            ->get();

        // Get all active class sections
        $classSections = ClassSection::where('status', 'active')
            ->where('semester', 'Spring 2026')
            ->get();

        if ($students->isEmpty() || $classSections->isEmpty()) {
            $this->command->info('No students or class sections found. Skipping enrollment seeding.');
            return;
        }

        $this->command->info('Starting student enrollment seeding...');
        $this->command->info("Found {$students->count()} students and {$classSections->count()} classes");
        $enrollmentCount = 0;

        try {
            // Reset current enrollment counts (without transaction)
            $this->command->info('Resetting enrollment counts...');
            ClassSection::where('status', 'active')->update(['current_enrollment' => 0]);
            
            // Delete existing enrollments to avoid duplicates
            $this->command->info('Clearing existing enrollments...');
            StudentEnrollment::truncate();

            $studentProgress = 0;
            foreach ($students as $student) {
                $studentProgress++;
                
                // Reconnect every 10 students to avoid timeout
                if ($studentProgress % 10 == 0) {
                    DB::reconnect();
                    $this->command->info("Processing student {$studentProgress}/{$students->count()}...");
                }
                
                // Each student enrolls in 4-6 random classes
                $numberOfClasses = rand(4, 6);
                $selectedClasses = $classSections->random(min($numberOfClasses, $classSections->count()));

                foreach ($selectedClasses as $classSection) {
                    // Refresh class section to get latest enrollment count
                    $classSection->refresh();
                    
                    // Check if class is not full
                    if ($classSection->current_enrollment < $classSection->max_capacity) {
                        // Check for time conflicts
                        $hasConflict = StudentEnrollment::where('user_id', $student->id)
                            ->where('enrollment_status', 'enrolled')
                            ->whereHas('classSection', function($query) use ($classSection) {
                                $query->where('day_of_week', $classSection->day_of_week)
                                      ->where(function($q) use ($classSection) {
                                          $q->whereBetween('start_time', [$classSection->start_time, $classSection->end_time])
                                            ->orWhereBetween('end_time', [$classSection->start_time, $classSection->end_time])
                                            ->orWhere(function($q2) use ($classSection) {
                                                $q2->where('start_time', '<=', $classSection->start_time)
                                                   ->where('end_time', '>=', $classSection->end_time);
                                            });
                                      });
                            })
                            ->exists();

                        if (!$hasConflict) {
                            try {
                                StudentEnrollment::create([
                                    'user_id' => $student->id,
                                    'class_section_id' => $classSection->id,
                                    'enrollment_status' => 'enrolled',
                                    'enrollment_date' => now()->subDays(rand(1, 30)),
                                ]);

                                // Increment enrollment count
                                $classSection->increment('current_enrollment');
                                $enrollmentCount++;
                            } catch (\Exception $e) {
                                // Skip duplicate enrollments
                                continue;
                            }
                        }
                    }
                }
            }

            $this->command->info("Successfully created {$enrollmentCount} student enrollments!");
            
            // Display enrollment statistics
            $this->displayStatistics();

        } catch (\Exception $e) {
            $this->command->error('Error seeding enrollments: ' . $e->getMessage());
            $this->command->error('Stack trace: ' . $e->getTraceAsString());
        }
    }

    /**
     * Display enrollment statistics
     */
    private function displayStatistics()
    {
        $totalStudents = User::where('role', 'student')->where('status', 'active')->count();
        $totalClasses = ClassSection::where('status', 'active')->count();
        $totalEnrollments = StudentEnrollment::where('enrollment_status', 'enrolled')->count();
        
        $classStats = ClassSection::where('status', 'active')
            ->selectRaw('
                COUNT(*) as total_classes,
                AVG(current_enrollment) as avg_enrollment,
                MAX(current_enrollment) as max_enrollment,
                MIN(current_enrollment) as min_enrollment
            ')
            ->first();

        $this->command->info("\n=== Enrollment Statistics ===");
        $this->command->info("Total Students: {$totalStudents}");
        $this->command->info("Total Classes: {$totalClasses}");
        $this->command->info("Total Enrollments: {$totalEnrollments}");
        $this->command->info("Average Enrollment per Class: " . round($classStats->avg_enrollment, 2));
        $this->command->info("Max Enrollment in a Class: {$classStats->max_enrollment}");
        $this->command->info("Min Enrollment in a Class: {$classStats->min_enrollment}");
        $this->command->info("============================\n");
    }
}

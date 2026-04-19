<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ClassSection;
use App\Models\StudentEnrollment;
use Illuminate\Support\Facades\DB;

class QuickEnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Optimized for Neon PostgreSQL with connection pooling
     */
    public function run(): void
    {
        $this->command->info('🚀 Quick Enrollment Seeder for Neon PostgreSQL');
        $this->command->newLine();

        // Reconnect to ensure fresh connection
        DB::reconnect();
        
        // Get counts first
        $studentCount = User::where('role', 'student')->where('status', 'active')->count();
        $classCount = ClassSection::where('status', 'active')->where('semester', 'Spring 2026')->count();

        if ($studentCount == 0 || $classCount == 0) {
            $this->command->error('❌ No students or class sections found!');
            $this->command->info('Please run: php artisan db:seed --class=DatabaseSeeder');
            $this->command->info('Then run: php artisan db:seed --class=ClassSectionSeeder');
            return;
        }

        $this->command->info("✅ Found {$studentCount} students and {$classCount} classes");
        $this->command->newLine();

        try {
            // Step 1: Clear existing enrollments
            $this->command->info('🧹 Clearing existing enrollments...');
            DB::table('student_enrollments')->delete();
            
            // Step 2: Reset enrollment counts
            $this->command->info('🔄 Resetting enrollment counts...');
            DB::table('class_sections')
                ->where('status', 'active')
                ->update(['current_enrollment' => 0]);
            
            DB::reconnect();
            
            // Step 3: Get data in chunks
            $this->command->info('📚 Loading students and classes...');
            $students = User::where('role', 'student')
                ->where('status', 'active')
                ->select('id')
                ->get()
                ->pluck('id')
                ->toArray();
            
            $classes = ClassSection::where('status', 'active')
                ->where('semester', 'Spring 2026')
                ->select('id', 'day_of_week', 'start_time', 'end_time', 'max_capacity', 'current_enrollment')
                ->get();
            
            DB::reconnect();
            
            // Step 4: Create enrollments in bulk
            $this->command->info('✏️  Creating enrollments...');
            $enrollments = [];
            $classEnrollmentCounts = [];
            
            foreach ($students as $index => $studentId) {
                if ($index % 20 == 0) {
                    $this->command->info("   Processing student " . ($index + 1) . "/{$studentCount}...");
                    DB::reconnect();
                }
                
                // Each student gets 4-6 random classes
                $numberOfClasses = rand(4, 6);
                $selectedClasses = $classes->random(min($numberOfClasses, $classes->count()));
                
                $studentSchedule = [];
                
                foreach ($selectedClasses as $class) {
                    // Check capacity
                    $currentCount = $classEnrollmentCounts[$class->id] ?? $class->current_enrollment;
                    if ($currentCount >= $class->max_capacity) {
                        continue;
                    }
                    
                    // Simple conflict check (same day and overlapping time)
                    $hasConflict = false;
                    foreach ($studentSchedule as $scheduled) {
                        if ($scheduled['day'] == $class->day_of_week) {
                            // Check time overlap
                            if (
                                ($class->start_time >= $scheduled['start'] && $class->start_time < $scheduled['end']) ||
                                ($class->end_time > $scheduled['start'] && $class->end_time <= $scheduled['end']) ||
                                ($class->start_time <= $scheduled['start'] && $class->end_time >= $scheduled['end'])
                            ) {
                                $hasConflict = true;
                                break;
                            }
                        }
                    }
                    
                    if (!$hasConflict) {
                        $enrollments[] = [
                            'user_id' => $studentId,
                            'class_section_id' => $class->id,
                            'enrollment_status' => 'enrolled',
                            'enrollment_date' => now()->subDays(rand(1, 30))->format('Y-m-d'),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                        
                        $studentSchedule[] = [
                            'day' => $class->day_of_week,
                            'start' => $class->start_time,
                            'end' => $class->end_time,
                        ];
                        
                        // Track enrollment count
                        if (!isset($classEnrollmentCounts[$class->id])) {
                            $classEnrollmentCounts[$class->id] = $class->current_enrollment;
                        }
                        $classEnrollmentCounts[$class->id]++;
                    }
                }
            }
            
            DB::reconnect();
            
            // Step 5: Insert enrollments in chunks
            $this->command->info('💾 Saving enrollments to database...');
            $chunks = array_chunk($enrollments, 100);
            foreach ($chunks as $index => $chunk) {
                $this->command->info("   Inserting chunk " . ($index + 1) . "/" . count($chunks) . "...");
                DB::table('student_enrollments')->insert($chunk);
                DB::reconnect();
            }
            
            // Step 6: Update class enrollment counts
            $this->command->info('📊 Updating class enrollment counts...');
            foreach ($classEnrollmentCounts as $classId => $count) {
                DB::table('class_sections')
                    ->where('id', $classId)
                    ->update(['current_enrollment' => $count]);
            }
            
            DB::reconnect();
            
            $this->command->newLine();
            $this->command->info('✅ Successfully created ' . count($enrollments) . ' enrollments!');
            $this->command->newLine();
            
            // Display statistics
            $this->displayStatistics();
            
        } catch (\Exception $e) {
            $this->command->error('❌ Error: ' . $e->getMessage());
            $this->command->error('Line: ' . $e->getLine());
        }
    }

    /**
     * Display enrollment statistics
     */
    private function displayStatistics()
    {
        DB::reconnect();
        
        $totalStudents = User::where('role', 'student')->where('status', 'active')->count();
        $totalClasses = ClassSection::where('status', 'active')->count();
        $totalEnrollments = StudentEnrollment::where('enrollment_status', 'enrolled')->count();
        
        $classStats = ClassSection::where('status', 'active')
            ->selectRaw('
                AVG(current_enrollment) as avg_enrollment,
                MAX(current_enrollment) as max_enrollment,
                MIN(current_enrollment) as min_enrollment
            ')
            ->first();

        $this->command->info('═══════════════════════════════════════');
        $this->command->info('📈 ENROLLMENT STATISTICS');
        $this->command->info('═══════════════════════════════════════');
        $this->command->info("👥 Total Students: {$totalStudents}");
        $this->command->info("📚 Total Classes: {$totalClasses}");
        $this->command->info("✏️  Total Enrollments: {$totalEnrollments}");
        $this->command->info("📊 Average per Class: " . round($classStats->avg_enrollment, 1));
        $this->command->info("📈 Max in a Class: {$classStats->max_enrollment}");
        $this->command->info("📉 Min in a Class: {$classStats->min_enrollment}");
        $this->command->info('═══════════════════════════════════════');
        $this->command->newLine();
        $this->command->info('🎉 Your Neon database is ready!');
    }
}

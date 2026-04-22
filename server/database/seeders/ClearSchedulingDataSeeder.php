<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ClassSection;
use App\Models\FacultyClassAssignment;
use App\Models\StudentEnrollment;

class ClearSchedulingDataSeeder extends Seeder
{
    /**
     * Clear all scheduling-related data from the database.
     * This includes:
     * - Student enrollments
     * - Faculty class assignments
     * - Class sections
     */
    public function run(): void
    {
        $this->command->info('🗑️  Starting to clear scheduling data...');
        $this->command->info('');

        // Disable foreign key checks to avoid constraint issues
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            // 1. Clear Student Enrollments
            $enrollmentCount = StudentEnrollment::count();
            if ($enrollmentCount > 0) {
                $this->command->info("📋 Clearing {$enrollmentCount} student enrollments...");
                StudentEnrollment::truncate();
                $this->command->info("   ✅ Student enrollments cleared");
            } else {
                $this->command->info("📋 No student enrollments to clear");
            }

            // 2. Clear Faculty Class Assignments
            $assignmentCount = FacultyClassAssignment::count();
            if ($assignmentCount > 0) {
                $this->command->info("👨‍🏫 Clearing {$assignmentCount} faculty assignments...");
                FacultyClassAssignment::truncate();
                $this->command->info("   ✅ Faculty assignments cleared");
            } else {
                $this->command->info("👨‍🏫 No faculty assignments to clear");
            }

            // 3. Clear Class Sections
            $sectionCount = ClassSection::count();
            if ($sectionCount > 0) {
                $this->command->info("📚 Clearing {$sectionCount} class sections...");
                ClassSection::truncate();
                $this->command->info("   ✅ Class sections cleared");
            } else {
                $this->command->info("📚 No class sections to clear");
            }

            $this->command->info('');
            $this->command->info('✅ All scheduling data has been cleared successfully!');
            $this->command->info('');
            $this->command->info('📊 Summary:');
            $this->command->info("   • Student Enrollments Deleted: {$enrollmentCount}");
            $this->command->info("   • Faculty Assignments Deleted: {$assignmentCount}");
            $this->command->info("   • Class Sections Deleted: {$sectionCount}");
            $this->command->info('');
            $this->command->info('🎯 Next steps:');
            $this->command->info('   1. Run: php artisan db:seed --class=ClassSectionSeeder');
            $this->command->info('   2. Or run: php artisan db:seed --class=CompleteSystemSeeder');
            $this->command->info('');

        } catch (\Exception $e) {
            $this->command->error('❌ Error clearing scheduling data: ' . $e->getMessage());
            $this->command->error('   Stack trace: ' . $e->getTraceAsString());
        } finally {
            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}

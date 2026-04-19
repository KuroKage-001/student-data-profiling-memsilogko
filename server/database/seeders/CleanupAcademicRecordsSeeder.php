<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StudentAcademicRecord;
use App\Models\StudentSubject;
use Illuminate\Support\Facades\DB;

class CleanupAcademicRecordsSeeder extends Seeder
{
    /**
     * Clean up orphaned academic records (records without subjects)
     * This fixes issues from previous failed seeding attempts
     */
    public function run(): void
    {
        $this->command->info('Starting cleanup of orphaned academic records...');

        try {
            // Find academic records that have no subjects
            $recordsWithoutSubjects = StudentAcademicRecord::doesntHave('subjects')->get();

            if ($recordsWithoutSubjects->isEmpty()) {
                $this->command->info('✓ No orphaned records found. Database is clean!');
                return;
            }

            $this->command->warn("Found {$recordsWithoutSubjects->count()} orphaned academic records (records without subjects)");
            $this->command->info('Deleting orphaned records...');

            // Delete orphaned records
            $deleted = StudentAcademicRecord::doesntHave('subjects')->delete();

            $this->command->info("✓ Successfully deleted {$deleted} orphaned academic records!");
            $this->command->info('Database is now clean and ready for seeding.');

        } catch (\Exception $e) {
            $this->command->error('Error during cleanup: ' . $e->getMessage());
            throw $e;
        }
    }
}

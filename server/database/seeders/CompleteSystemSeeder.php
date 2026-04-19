<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CompleteSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder runs all seeders in the correct order for a complete system setup.
     */
    public function run(): void
    {
        $this->command->info('========================================');
        $this->command->info('Starting Complete System Seeding...');
        $this->command->info('========================================');
        $this->command->newLine();

        // Step 1: Seed base users (admin, dept chairs, faculty, students)
        $this->command->info('Step 1: Seeding base users...');
        $this->call(DatabaseSeeder::class);
        $this->command->newLine();

        // Step 2: Seed class sections
        $this->command->info('Step 2: Seeding class sections...');
        $this->call(ClassSectionSeeder::class);
        $this->command->newLine();

        // Step 3: Seed student enrollments
        $this->command->info('Step 3: Seeding student enrollments...');
        $this->call(StudentEnrollmentSeeder::class);
        $this->command->newLine();

        $this->command->info('========================================');
        $this->command->info('Complete System Seeding Finished!');
        $this->command->info('========================================');
        $this->command->newLine();
        
        $this->displaySummary();
    }

    /**
     * Display seeding summary
     */
    private function displaySummary()
    {
        $totalUsers = \App\Models\User::count();
        $totalStudents = \App\Models\User::where('role', 'student')->where('status', 'active')->count();
        $totalFaculty = \App\Models\User::where('role', 'faculty')->where('status', 'active')->count();
        $totalClasses = \App\Models\ClassSection::where('status', 'active')->count();
        $totalEnrollments = \App\Models\StudentEnrollment::where('enrollment_status', 'enrolled')->count();

        $this->command->info('=== System Summary ===');
        $this->command->info("Total Users: {$totalUsers}");
        $this->command->info("Active Students: {$totalStudents}");
        $this->command->info("Active Faculty: {$totalFaculty}");
        $this->command->info("Active Classes: {$totalClasses}");
        $this->command->info("Total Enrollments: {$totalEnrollments}");
        $this->command->info('=====================');
        $this->command->newLine();

        $this->command->info('Your Neon PostgreSQL database is now fully seeded!');
        $this->command->info('You can now use the system with real data.');
    }
}

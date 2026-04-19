<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class ProductionSeeder extends Seeder
{
    /**
     * Optimized seeder for production - only essential data
     * Run with: php artisan db:seed --class=ProductionSeeder
     */
    public function run(): void
    {
        $this->command->info('Starting production seeding (essential data only)...');

        try {
            DB::beginTransaction();

            // Only seed if no users exist
            if (User::count() === 0) {
                $this->command->info('Creating essential admin accounts...');

                // Create Admin User
                User::create([
                    'name' => 'System Administrator',
                    'email' => 'admin@ccs.edu',
                    'email_verified_at' => now(),
                    'password' => Hash::make('Admin@2024'),
                    'role' => 'admin',
                    'status' => 'active',
                    'department' => 'IT',
                    'position' => 'System Administrator',
                ]);

                // Create IT Department Chair
                User::create([
                    'name' => 'IT Department Chair',
                    'email' => 'deptchair.it@ccs.edu',
                    'email_verified_at' => now(),
                    'password' => Hash::make('DeptChair@2024'),
                    'role' => 'dept_chair',
                    'status' => 'active',
                    'department' => 'IT',
                    'position' => 'Department Head',
                ]);

                // Create CS Department Chair
                User::create([
                    'name' => 'CS Department Chair',
                    'email' => 'deptchair.cs@ccs.edu',
                    'email_verified_at' => now(),
                    'password' => Hash::make('DeptChair@2024'),
                    'role' => 'dept_chair',
                    'status' => 'active',
                    'department' => 'CS',
                    'position' => 'Department Head',
                ]);

                $this->command->info('✓ Created 3 essential admin accounts');
            } else {
                $this->command->warn('⚠️  Users already exist, skipping user creation');
            }

            DB::commit();

            $this->command->info('');
            $this->command->info('========================================');
            $this->command->info('Production Seeding Complete!');
            $this->command->info('========================================');
            $this->command->info('');
            $this->command->info('Essential Accounts:');
            $this->command->info('1. Admin: admin@ccs.edu / Admin@2024');
            $this->command->info('2. IT Dept Chair: deptchair.it@ccs.edu / DeptChair@2024');
            $this->command->info('3. CS Dept Chair: deptchair.cs@ccs.edu / DeptChair@2024');
            $this->command->info('');
            $this->command->info('⚠️  IMPORTANT: Change these passwords after first login!');
            $this->command->info('========================================');

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error during production seeding: ' . $e->getMessage());
            throw $e;
        }
    }
}

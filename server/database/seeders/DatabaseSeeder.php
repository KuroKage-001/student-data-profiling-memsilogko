<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Only seed if users don't already exist
        if (User::count() == 0) {
            // Create Admin User
            User::create([
                'name' => 'System Administrator',
                'email' => 'admin@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Admin@2024'),
                'role' => 'admin',
                'status' => 'active',
                'department' => 'Administration',
            ]);

            // Create Department Chair User (IT Department)
            User::create([
                'name' => 'IT Department Chair',
                'email' => 'deptchair.it@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('DeptChair@2024'),
                'role' => 'dept_chair',
                'status' => 'active',
                'department' => 'Information Technology',
            ]);

            // Create Department Chair User (CS Department)
            User::create([
                'name' => 'CS Department Chair',
                'email' => 'deptchair.cs@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('DeptChair@2024'),
                'role' => 'dept_chair',
                'status' => 'active',
                'department' => 'Computer Science',
            ]);

            // Create Faculty User (IT)
            User::create([
                'name' => 'John Doe',
                'email' => 'faculty.it@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Faculty@2024'),
                'role' => 'faculty',
                'status' => 'active',
                'department' => 'Information Technology',
            ]);

            // Create Faculty User (CS)
            User::create([
                'name' => 'Jane Smith',
                'email' => 'faculty.cs@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Faculty@2024'),
                'role' => 'faculty',
                'status' => 'active',
                'department' => 'Computer Science',
            ]);

            // Create Student User 1
            User::create([
                'name' => 'Maria Santos',
                'email' => 'student1@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Student@2024'),
                'role' => 'student',
                'status' => 'active',
                'student_id' => '2024-00001',
                'department' => 'Information Technology',
                'program' => 'Bachelor of Science in Information Technology',
                'year_level' => '3rd Year',
                'phone' => '09123456789',
                'address' => 'Manila, Philippines',
            ]);

            // Create Student User 2
            User::create([
                'name' => 'Juan Dela Cruz',
                'email' => 'student2@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Student@2024'),
                'role' => 'student',
                'status' => 'active',
                'student_id' => '2024-00002',
                'department' => 'Computer Science',
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => '2nd Year',
                'phone' => '09187654321',
                'address' => 'Quezon City, Philippines',
            ]);

            // Create Inactive User (for testing)
            User::create([
                'name' => 'Inactive Test User',
                'email' => 'inactive@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Inactive@2024'),
                'role' => 'student',
                'status' => 'inactive',
                'student_id' => '2024-00003',
                'department' => 'Information Technology',
            ]);

            // Create Suspended User (for testing)
            User::create([
                'name' => 'Suspended Test User',
                'email' => 'suspended@ccs.edu',
                'email_verified_at' => now(),
                'password' => Hash::make('Suspended@2024'),
                'role' => 'faculty',
                'status' => 'suspended',
                'department' => 'Computer Science',
            ]);
            
            echo "\n";
            echo "========================================\n";
            echo "Database seeded successfully!\n";
            echo "========================================\n";
            echo "\n";
            echo "Test Accounts Created:\n";
            echo "----------------------------------------\n";
            echo "ADMIN PORTAL ACCOUNTS:\n";
            echo "----------------------------------------\n";
            echo "1. Admin Account\n";
            echo "   Email: admin@ccs.edu\n";
            echo "   Password: Admin@2024\n";
            echo "   Role: Administrator\n";
            echo "\n";
            echo "2. IT Department Chair\n";
            echo "   Email: deptchair.it@ccs.edu\n";
            echo "   Password: DeptChair@2024\n";
            echo "   Role: Department Chairman\n";
            echo "\n";
            echo "3. CS Department Chair\n";
            echo "   Email: deptchair.cs@ccs.edu\n";
            echo "   Password: DeptChair@2024\n";
            echo "   Role: Department Chairman\n";
            echo "\n";
            echo "4. IT Faculty\n";
            echo "   Email: faculty.it@ccs.edu\n";
            echo "   Password: Faculty@2024\n";
            echo "   Role: Faculty\n";
            echo "\n";
            echo "5. CS Faculty\n";
            echo "   Email: faculty.cs@ccs.edu\n";
            echo "   Password: Faculty@2024\n";
            echo "   Role: Faculty\n";
            echo "\n";
            echo "----------------------------------------\n";
            echo "STUDENT PORTAL ACCOUNTS:\n";
            echo "----------------------------------------\n";
            echo "6. Student 1 (IT)\n";
            echo "   Email: student1@ccs.edu\n";
            echo "   Password: Student@2024\n";
            echo "   Role: Student\n";
            echo "   ID: 2024-00001\n";
            echo "\n";
            echo "7. Student 2 (CS)\n";
            echo "   Email: student2@ccs.edu\n";
            echo "   Password: Student@2024\n";
            echo "   Role: Student\n";
            echo "   ID: 2024-00002\n";
            echo "\n";
            echo "----------------------------------------\n";
            echo "TEST ACCOUNTS (Status Testing):\n";
            echo "----------------------------------------\n";
            echo "8. Inactive Account\n";
            echo "   Email: inactive@ccs.edu\n";
            echo "   Password: Inactive@2024\n";
            echo "   Status: Inactive\n";
            echo "\n";
            echo "9. Suspended Account\n";
            echo "   Email: suspended@ccs.edu\n";
            echo "   Password: Suspended@2024\n";
            echo "   Status: Suspended\n";
            echo "\n";
            echo "========================================\n";
            echo "Portal URLs:\n";
            echo "----------------------------------------\n";
            echo "Admin Portal: /admin/login\n";
            echo "Student Portal: /login\n";
            echo "========================================\n";
            echo "\n";
        } else {
            echo "Users already exist, skipping user seeding.\n";
        }

        // Seed events, department chairmen, faculty, and student accounts
        $this->call([
            EventSeeder::class,
            DepartmentChairmanSeeder::class,
            ITFacultySeeder::class,
            CSFacultySeeder::class,
            StudentAccountSeeder::class,
        ]);
    }
}

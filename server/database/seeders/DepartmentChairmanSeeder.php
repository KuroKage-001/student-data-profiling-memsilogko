<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DepartmentChairmanSeeder extends Seeder
{
    /**
     * Seed the Department Chairmen for IT and CS departments.
     */
    public function run(): void
    {
        $departmentChairmen = [
            [
                'name' => 'Dr. Michael Anderson',
                'email' => 'michael.anderson@ccs.edu.ph',
                'password' => Hash::make('ITChair2026!'),
                'role' => 'dept_chair',
                'department' => 'IT',
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Sarah Chen',
                'email' => 'sarah.chen@ccs.edu.ph',
                'password' => Hash::make('CSChair2026!'),
                'role' => 'dept_chair',
                'department' => 'CS',
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($departmentChairmen as $chairman) {
            // Check if user already exists
            $existingUser = User::where('email', $chairman['email'])->first();
            
            if (!$existingUser) {
                User::create($chairman);
                echo "Created Department Chairman: {$chairman['name']} ({$chairman['department']})\n";
            } else {
                echo "Department Chairman already exists: {$chairman['name']} ({$chairman['department']})\n";
            }
        }

        echo "\n=== Department Chairmen Credentials ===\n";
        echo "IT Department Chairman:\n";
        echo "  Name: Dr. Michael Anderson\n";
        echo "  Email: michael.anderson@ccs.edu.ph\n";
        echo "  Password: ITChair2026!\n";
        echo "  Department: Information Technology\n\n";
        
        echo "CS Department Chairman:\n";
        echo "  Name: Dr. Sarah Chen\n";
        echo "  Email: sarah.chen@ccs.edu.ph\n";
        echo "  Password: CSChair2026!\n";
        echo "  Department: Computer Science\n\n";
        
        echo "Note: Please change these passwords after first login.\n";
        echo "======================================\n";
    }
}


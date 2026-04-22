<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DepartmentChairmanSeeder extends Seeder
{
    /**
     * Seed the Department Chairmen for IT and CS departments.
     * Creates 1 Department Chair for IT and 1 for CS.
     */
    public function run(): void
    {
        echo "\n🎓 Seeding Department Chairmen...\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        $departmentChairmen = [
            [
                'name' => 'Dr. Michael Anderson',
                'email' => 'michael.anderson@ccs.edu.ph',
                'password' => Hash::make('ITChair2026!'),
                'role' => 'dept_chair',
                'department' => 'IT',
                'position' => 'Department Chairman',
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
                'position' => 'Department Chairman',
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $created = 0;
        $skipped = 0;

        foreach ($departmentChairmen as $chairman) {
            // Check if user already exists
            $existingUser = User::where('email', $chairman['email'])->first();
            
            if (!$existingUser) {
                User::create($chairman);
                echo "   ✓ Created: {$chairman['name']} ({$chairman['department']} Department)\n";
                $created++;
            } else {
                echo "   ⚠️  Already exists: {$chairman['name']} ({$chairman['department']} Department)\n";
                $skipped++;
            }
        }

        echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "✅ Department Chairmen Seeding Complete!\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        
        echo "📊 Summary:\n";
        echo "   • Created: $created\n";
        echo "   • Skipped (already exists): $skipped\n";
        echo "   • Total: 2 Department Chairmen (1 IT + 1 CS)\n\n";

        echo "🔐 Department Chairmen Credentials:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "IT Department Chairman:\n";
        echo "  Name: Dr. Michael Anderson\n";
        echo "  Email: michael.anderson@ccs.edu.ph\n";
        echo "  Password: ITChair2026!\n";
        echo "  Department: Information Technology\n";
        echo "  Role: dept_chair\n\n";
        
        echo "CS Department Chairman:\n";
        echo "  Name: Dr. Sarah Chen\n";
        echo "  Email: sarah.chen@ccs.edu.ph\n";
        echo "  Password: CSChair2026!\n";
        echo "  Department: Computer Science\n";
        echo "  Role: dept_chair\n\n";
        
        echo "⚠️  Security Note: Please change these passwords after first login.\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    }
}


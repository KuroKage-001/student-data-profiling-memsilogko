<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionFacultySeeder extends Seeder
{
    /**
     * Seed all faculty and department chair accounts for production.
     * - 1 IT Department Chair
     * - 1 CS Department Chair
     * - 15 IT Faculty
     * - 15 CS Faculty
     * Total: 32 accounts
     */
    public function run(): void
    {
        echo "\n";
        echo "╔════════════════════════════════════════════════════════════╗\n";
        echo "║     Production Faculty & Department Chair Seeder          ║\n";
        echo "╚════════════════════════════════════════════════════════════╝\n";
        echo "\n";
        echo "Target Accounts:\n";
        echo "  • 2 Department Chairmen (1 IT + 1 CS)\n";
        echo "  • 30 Faculty Members (15 IT + 15 CS)\n";
        echo "  • Total: 32 accounts\n";
        echo "\n";
        echo "Environment: " . config('app.env') . "\n";
        echo "Database: " . config('database.default') . "\n";
        echo "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";

        // Seed in order
        $this->call([
            DepartmentChairmanSeeder::class,
            ITFacultySeeder::class,
            CSFacultySeeder::class,
        ]);

        echo "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "🎉 Production Faculty Seeding Complete!\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        
        echo "📊 Final Summary:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        echo "Department Chairmen (2):\n";
        echo "  ✓ IT Department Chair: 1\n";
        echo "  ✓ CS Department Chair: 1\n";
        echo "\n";
        echo "Faculty Members (30):\n";
        echo "  ✓ IT Faculty: 15\n";
        echo "    - Professors: 3\n";
        echo "    - Associate Professors: 4\n";
        echo "    - Assistant Professors: 5\n";
        echo "    - Instructors: 3\n";
        echo "\n";
        echo "  ✓ CS Faculty: 15\n";
        echo "    - Professors: 3\n";
        echo "    - Associate Professors: 4\n";
        echo "    - Assistant Professors: 5\n";
        echo "    - Instructors: 3\n";
        echo "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        
        echo "🔐 Test Credentials:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        echo "Department Chairmen:\n";
        echo "  IT Chair:\n";
        echo "    Email: michael.anderson@ccs.edu.ph\n";
        echo "    Password: ITChair2026!\n";
        echo "\n";
        echo "  CS Chair:\n";
        echo "    Email: sarah.chen@ccs.edu.ph\n";
        echo "    Password: CSChair2026!\n";
        echo "\n";
        echo "Faculty Accounts:\n";
        echo "  Check the faculty table for email addresses\n";
        echo "  Faculty IDs: FAC26XXXX format\n";
        echo "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        
        echo "✅ Verification Commands:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        echo "Check Department Chairs:\n";
        echo "  php artisan tinker\n";
        echo "  >>> User::where('role', 'dept_chair')->count();\n";
        echo "  >>> User::where('role', 'dept_chair')->get(['name', 'email', 'department']);\n";
        echo "\n";
        echo "Check Faculty:\n";
        echo "  >>> Faculty::where('department', 'IT')->count();\n";
        echo "  >>> Faculty::where('department', 'CS')->count();\n";
        echo "  >>> Faculty::all()->count();\n";
        echo "\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "\n";
        
        echo "💡 Next Steps:\n";
        echo "  1. Verify accounts in admin portal\n";
        echo "  2. Test login with department chair accounts\n";
        echo "  3. Review faculty profiles\n";
        echo "  4. Update passwords as needed\n";
        echo "\n";
    }
}

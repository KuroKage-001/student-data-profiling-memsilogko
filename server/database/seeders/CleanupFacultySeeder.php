<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Seeder;

class CleanupFacultySeeder extends Seeder
{
    /**
     * Remove all faculty records to allow fresh seeding.
     * This will delete all faculty from the faculty table.
     * Department chairs in users table are NOT deleted.
     */
    public function run(): void
    {
        echo "\n";
        echo "╔════════════════════════════════════════════════════════════╗\n";
        echo "║           Faculty Cleanup Seeder                          ║\n";
        echo "╚════════════════════════════════════════════════════════════╝\n";
        echo "\n";

        // Check current counts
        $totalFaculty = Faculty::count();
        $itFaculty = Faculty::where('department', 'IT')->count();
        $csFaculty = Faculty::where('department', 'CS')->count();
        $deptChairs = User::where('role', 'dept_chair')->count();

        echo "📊 Current Status:\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "  Total Faculty: $totalFaculty\n";
        echo "  IT Faculty: $itFaculty\n";
        echo "  CS Faculty: $csFaculty\n";
        echo "  Department Chairs: $deptChairs\n";
        echo "\n";

        if ($totalFaculty === 0) {
            echo "✅ No faculty records found.\n";
            echo "   Ready for fresh seeding.\n\n";
            return;
        }

        if ($totalFaculty <= 30) {
            echo "⚠️  Found $totalFaculty faculty records.\n";
            echo "   Expected: 30 (15 IT + 15 CS)\n";
            echo "   Proceeding with cleanup...\n\n";
        } else {
            echo "⚠️  Found $totalFaculty faculty records (expected: 30)\n";
            echo "   Deleting all faculty to allow fresh seeding...\n\n";
        }

        echo "🧹 Cleaning up faculty records...\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        try {
            // Delete all faculty records
            $deletedCount = $totalFaculty;
            Faculty::truncate();
            
            echo "   ✓ Deleted $deletedCount faculty records\n";
            echo "   ✓ Faculty table is now empty\n";
            echo "   ✓ Department chairs preserved (in users table)\n";
            
            echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            echo "✅ Cleanup Complete!\n";
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            
            echo "📝 Next Steps:\n";
            echo "   Run: php artisan db:seed --class=ProductionFacultySeeder\n";
            echo "   This will create:\n";
            echo "     • 15 IT Faculty\n";
            echo "     • 15 CS Faculty\n";
            echo "     • 2 Department Chairs (if not exist)\n";
            echo "     • Total: 30 faculty + 2 chairs = 32 accounts\n";
            echo "\n";
            
            echo "✅ Verification:\n";
            echo "   php artisan tinker\n";
            echo "   >>> Faculty::count(); // Should be 30 after re-seeding\n";
            echo "   >>> Faculty::where('department', 'IT')->count(); // Should be 15\n";
            echo "   >>> Faculty::where('department', 'CS')->count(); // Should be 15\n";
            echo "   >>> User::where('role', 'dept_chair')->count(); // Should be 2\n";
            echo "\n";
            
        } catch (\Exception $e) {
            echo "\n❌ Error: " . $e->getMessage() . "\n\n";
            throw $e;
        }
    }
}

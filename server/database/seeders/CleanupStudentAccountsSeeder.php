<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class CleanupStudentAccountsSeeder extends Seeder
{
    /**
     * Remove student accounts that were created without profiles
     * (from the previous seeding before the IT/CS only fix)
     */
    public function run(): void
    {
        echo "\n🧹 Cleaning up student accounts without profiles...\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        // Count students without profiles
        $studentsWithoutProfiles = User::where('role', 'student')
            ->whereNull('student_id')
            ->count();

        if ($studentsWithoutProfiles === 0) {
            echo "   ℹ️  No student accounts without profiles found.\n";
            echo "   Nothing to clean up.\n\n";
            return;
        }

        echo "   Found $studentsWithoutProfiles student account(s) without profiles.\n";
        echo "   These will be deleted to allow re-seeding with IT/CS only.\n\n";

        // Delete students without profiles
        $deleted = User::where('role', 'student')
            ->whereNull('student_id')
            ->delete();

        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "✅ Successfully deleted $deleted student account(s)!\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        echo "📝 Next Step:\n";
        echo "   Run: php artisan db:seed --class=StudentAccountSeeder\n";
        echo "   This will create 100 new accounts (50 IT + 50 CS)\n\n";
    }
}

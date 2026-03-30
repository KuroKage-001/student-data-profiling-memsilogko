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
            // Create admin user
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]);

            // Create test user
            User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]);
            
            echo "Database seeded successfully with admin and test users.\n";
        } else {
            echo "Users already exist, skipping seeding.\n";
        }

        // Seed events
        $this->call([
            EventSeeder::class,
        ]);
    }
}

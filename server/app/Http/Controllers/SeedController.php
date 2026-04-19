<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;

class SeedController extends Controller
{
    /**
     * Seed the database with a secret key
     * 
     * Usage: GET /api/seed?secret=YOUR_SECRET_KEY
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function seed(Request $request)
    {
        // Check if seeding is allowed
        $allowSeeding = env('ALLOW_API_SEEDING', false);
        
        if (!$allowSeeding) {
            return response()->json([
                'success' => false,
                'message' => 'API seeding is disabled. Set ALLOW_API_SEEDING=true in environment variables.'
            ], 403);
        }

        // Verify secret key
        $secret = $request->query('secret');
        $expectedSecret = env('SEEDING_SECRET_KEY');
        
        if (!$secret || !$expectedSecret || $secret !== $expectedSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing secret key.'
            ], 401);
        }

        try {
            // Get seeder class from query parameter (optional)
            $seederClass = $request->query('seeder', 'Database\\Seeders\\DatabaseSeeder');
            
            // Run the seeder
            Artisan::call('db:seed', [
                '--class' => $seederClass,
                '--force' => true,
            ]);

            $output = Artisan::output();

            return response()->json([
                'success' => true,
                'message' => 'Database seeded successfully!',
                'output' => $output,
                'seeder' => $seederClass
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Seeding failed: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get seeding status
     * 
     * Usage: GET /api/seed/status?secret=YOUR_SECRET_KEY
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function status(Request $request)
    {
        // Verify secret key
        $secret = $request->query('secret');
        $expectedSecret = env('SEEDING_SECRET_KEY');
        
        if (!$secret || !$expectedSecret || $secret !== $expectedSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing secret key.'
            ], 401);
        }

        try {
            $stats = [
                'users' => \App\Models\User::count(),
                'admins' => \App\Models\User::where('role', 'admin')->count(),
                'dept_chairs' => \App\Models\User::where('role', 'dept_chair')->count(),
                'faculty' => \App\Models\User::where('role', 'faculty')->count(),
                'students' => \App\Models\User::where('role', 'student')->count(),
                'events' => \App\Models\Event::count(),
                'academic_records' => \App\Models\StudentAcademicRecord::count(),
                'affiliations' => \App\Models\StudentAffiliation::count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Database statistics retrieved successfully.',
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Available seeders list
     * 
     * Usage: GET /api/seed/list?secret=YOUR_SECRET_KEY
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listSeeders(Request $request)
    {
        // Verify secret key
        $secret = $request->query('secret');
        $expectedSecret = env('SEEDING_SECRET_KEY');
        
        if (!$secret || !$expectedSecret || $secret !== $expectedSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing secret key.'
            ], 401);
        }

        $seeders = [
            'Database\\Seeders\\DatabaseSeeder' => 'Full database seed (all tables)',
            'Database\\Seeders\\ProductionSeeder' => 'Essential accounts only (fast)',
            'Database\\Seeders\\EventSeeder' => 'Events only',
            'Database\\Seeders\\DepartmentChairmanSeeder' => 'Department chairmen only',
            'Database\\Seeders\\ITFacultySeeder' => 'IT faculty only',
            'Database\\Seeders\\CSFacultySeeder' => 'CS faculty only',
            'Database\\Seeders\\StudentAccountSeeder' => 'Student accounts only',
            'Database\\Seeders\\StudentAcademicRecordSeeder' => 'Academic records only',
            'Database\\Seeders\\StudentAffiliationSeeder' => 'Affiliations only',
        ];

        return response()->json([
            'success' => true,
            'message' => 'Available seeders',
            'seeders' => $seeders,
            'usage' => 'Add ?seeder=ClassName to seed endpoint'
        ], 200);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MassStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Generates 1000 test students
     */
    public function run(): void
    {
        $this->command->info('Creating 1000 test students...');

        $departments = ['BSIT', 'BSCS', 'BSIS', 'ACT', 'BSBA'];
        $yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        $statuses = ['active', 'inactive', 'suspended'];
        
        $batchSize = 100;
        $totalStudents = 1000;
        $batches = $totalStudents / $batchSize;

        for ($batch = 0; $batch < $batches; $batch++) {
            $students = [];
            
            for ($i = 1; $i <= $batchSize; $i++) {
                $studentNumber = ($batch * $batchSize) + $i;
                $paddedNumber = str_pad($studentNumber, 6, '0', STR_PAD_LEFT);
                
                $firstName = $this->generateFirstName();
                $lastName = $this->generateLastName();
                $email = strtolower($firstName . '.' . $lastName . $studentNumber . '@student.edu');
                
                $students[] = [
                    'student_number' => '2024-' . $paddedNumber,
                    'name' => $firstName . ' ' . $lastName,
                    'email' => $email,
                    'password' => Hash::make('password123'),
                    'role' => 'student',
                    'phone' => '09' . rand(100000000, 999999999),
                    'address' => $this->generateAddress(),
                    'program' => $departments[array_rand($departments)],
                    'year_level' => $yearLevels[array_rand($yearLevels)],
                    'status' => $statuses[array_rand($statuses)],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
            
            DB::table('users')->insert($students);
            $this->command->info('Batch ' . ($batch + 1) . '/' . $batches . ' completed (' . (($batch + 1) * $batchSize) . ' students)');
        }

        $this->command->info('✅ Successfully created 1000 test students!');
        $this->command->info('Default password for all students: password123');
    }

    private function generateFirstName(): string
    {
        $names = [
            'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma',
            'Robert', 'Olivia', 'William', 'Ava', 'Richard', 'Isabella', 'Joseph', 'Sophia',
            'Thomas', 'Mia', 'Charles', 'Charlotte', 'Daniel', 'Amelia', 'Matthew', 'Harper',
            'Anthony', 'Evelyn', 'Mark', 'Abigail', 'Donald', 'Elizabeth', 'Steven', 'Sofia',
            'Paul', 'Ella', 'Andrew', 'Madison', 'Joshua', 'Scarlett', 'Kenneth', 'Victoria',
            'Kevin', 'Aria', 'Brian', 'Grace', 'George', 'Chloe', 'Edward', 'Camila',
            'Ronald', 'Penelope', 'Timothy', 'Riley', 'Jason', 'Layla', 'Jeffrey', 'Lillian',
            'Ryan', 'Nora', 'Jacob', 'Zoey', 'Gary', 'Mila', 'Nicholas', 'Aubrey',
        ];
        return $names[array_rand($names)];
    }

    private function generateLastName(): string
    {
        $names = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
            'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
            'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
            'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
            'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
            'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
            'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
        ];
        return $names[array_rand($names)];
    }

    private function generateAddress(): string
    {
        $streets = [
            'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd',
            'Elm St', 'Washington Ave', 'Park Blvd', 'Lake Dr', 'Hill St'
        ];
        $cities = [
            'Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig',
            'Mandaluyong', 'San Juan', 'Caloocan', 'Valenzuela', 'Malabon'
        ];
        
        $number = rand(1, 999);
        $street = $streets[array_rand($streets)];
        $city = $cities[array_rand($cities)];
        
        return $number . ' ' . $street . ', ' . $city;
    }
}

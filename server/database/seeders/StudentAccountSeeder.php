<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class StudentAccountSeeder extends Seeder
{
    /**
     * Seed 100 student role accounts with realistic data.
     * These accounts are ready to have student profiles added via the admin panel.
     */
    public function run(): void
    {
        // Check if student accounts already exist
        $existingStudents = User::where('role', 'student')->count();
        
        if ($existingStudents >= 100) {
            echo "\n⚠️  100 or more student accounts already exist. Skipping student account seeding.\n\n";
            return;
        }

        $programs = [
            'IT' => 50,  // Information Technology
            'CS' => 50,  // Computer Science
        ];

        $firstNames = [
            // Male names
            'John', 'Michael', 'David', 'James', 'Robert', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher',
            'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
            'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
            // Female names
            'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen',
            'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna',
            'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia',
            // Filipino names
            'Jose', 'Maria', 'Juan', 'Ana', 'Pedro', 'Rosa', 'Antonio', 'Carmen', 'Manuel', 'Teresa',
            'Francisco', 'Luz', 'Ricardo', 'Angelica', 'Roberto', 'Cristina', 'Carlos', 'Isabel', 'Miguel', 'Sofia'
        ];

        $lastNames = [
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Gonzales', 'Lopez',
            'Flores', 'Rivera', 'Ramos', 'Castillo', 'Aquino', 'Fernandez', 'Valdez', 'Santiago', 'Morales', 'Pascual',
            'Anderson', 'Thompson', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall',
            'Allen', 'Young', 'King', 'Wright', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson',
            'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards',
            'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy',
            'Bailey', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Peterson', 'Gray', 'Ramirez', 'James',
            'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson',
            'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler',
            'Simmons', 'Foster', 'Bryant', 'Alexander', 'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers', 'Ford'
        ];

        $statuses = [
            'active' => 90,
            'inactive' => 7,
            'suspended' => 3
        ];

        $studentData = [];
        $counter = 1;
        $year = date('Y');
        $usedEmails = [];
        
        // Get existing emails to avoid duplicates
        $existingEmails = User::pluck('email')->toArray();
        $usedEmails = array_merge($usedEmails, $existingEmails);

        echo "\n🎓 Seeding 100 Student Role Accounts...\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

        // Generate students based on program distribution
        foreach ($programs as $department => $count) {
            $programName = $department === 'IT' ? 'Information Technology' : 'Computer Science';
            echo "   Creating $count students for $programName ($department)...\n";
            
            for ($i = 0; $i < $count; $i++) {
                // Generate unique name and email combination
                $attempts = 0;
                do {
                    $firstName = $firstNames[array_rand($firstNames)];
                    $lastName = $lastNames[array_rand($lastNames)];
                    $emailBase = strtolower($firstName . '.' . $lastName);
                    $email = $emailBase . '@student.ccs.edu';
                    $attempts++;
                    
                    // If we've tried too many times, add a number suffix
                    if ($attempts > 50) {
                        $email = $emailBase . $counter . '@student.ccs.edu';
                        break;
                    }
                } while (in_array($email, $usedEmails));
                
                $usedEmails[] = $email;
                $fullName = "$firstName $lastName";
                
                // Determine status based on distribution
                $status = $this->getWeightedStatus($statuses);
                
                // Generate student number: YYYY-DDDDD (Year-Department-Sequential)
                $studentNumber = sprintf('%s-%s%05d', $year, $department, $counter);
                
                // Map department to program
                $program = $department === 'IT' 
                    ? 'Bachelor of Science in Information Technology' 
                    : 'Bachelor of Science in Computer Science';
                
                // Default password for all student accounts
                $password = Hash::make('Student@2024');
                
                $studentData[] = [
                    'name' => $fullName,
                    'email' => $email,
                    'email_verified_at' => now(),
                    'password' => $password,
                    'role' => 'student',
                    'status' => $status,
                    'department' => $department,
                    'student_number' => $studentNumber,
                    'student_id' => null, // Will be set when student profile is added
                    'phone' => null,
                    'address' => null,
                    'program' => $program, // Set program based on department
                    'year_level' => null,
                    'gpa' => null,
                    'enrollment_date' => null,
                    'graduation_date' => null,
                    'guardian_name' => null,
                    'guardian_phone' => null,
                    'notes' => "Student account created on " . now()->format('F d, Y') . ". Awaiting profile completion by administrator.",
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $counter++;
            }
        }

        // Insert in batches for better performance
        $chunks = array_chunk($studentData, 50);
        $totalInserted = 0;
        
        foreach ($chunks as $chunkIndex => $chunk) {
            User::insert($chunk);
            $totalInserted += count($chunk);
            echo "   ✓ Batch " . ($chunkIndex + 1) . ": Inserted " . count($chunk) . " accounts\n";
        }

        echo "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "✅ Successfully seeded $totalInserted student accounts!\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        
        echo "📊 Distribution by Program:\n";
        echo "   • Information Technology (IT): 50 accounts\n";
        echo "   • Computer Science (CS): 50 accounts\n\n";
        
        echo "📊 Distribution by Status:\n";
        echo "   • Active: ~90 accounts\n";
        echo "   • Inactive: ~7 accounts\n";
        echo "   • Suspended: ~3 accounts\n\n";
        
        echo "🔐 Default Credentials:\n";
        echo "   • Email: [firstname].[lastname]@student.ccs.edu\n";
        echo "   • Password: Student@2024\n";
        echo "   • Student Number: $year-[DEPT][00001-00100]\n";
        echo "     (e.g., $year-IT00001, $year-CS00050)\n\n";
        
        echo "📝 Next Steps:\n";
        echo "   1. Login to Admin Portal\n";
        echo "   2. Go to Student Profiles\n";
        echo "   3. Click 'Add Student'\n";
        echo "   4. Select a student account from dropdown\n";
        echo "   5. Fill in student profile information\n";
        echo "   6. Submit to complete the profile\n\n";
        
        echo "💡 Note: These accounts have 'student' role with department, student number, and program.\n";
        echo "   Use the User Integration feature in Student Profiles to complete their profiles.\n\n";
    }

    /**
     * Get status based on weighted distribution
     */
    private function getWeightedStatus($statuses)
    {
        $rand = rand(1, 100);
        $cumulative = 0;
        
        foreach ($statuses as $status => $weight) {
            $cumulative += $weight;
            if ($rand <= $cumulative) {
                return $status;
            }
        }
        
        return 'active';
    }
}

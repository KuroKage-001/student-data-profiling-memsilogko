<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductionStudentSeeder extends Seeder
{
    /**
     * Seed 1000 student role accounts for production (500 IT + 500 CS).
     * Optimized for large-scale seeding with batch processing.
     */
    public function run(): void
    {
        echo "\n🚀 Production Student Account Seeder\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "Target: 1000 student accounts (500 IT + 500 CS)\n";
        echo "Environment: " . config('app.env') . "\n";
        echo "Database: " . config('database.default') . "\n\n";

        // Safety check for production
        if (config('app.env') === 'production') {
            echo "⚠️  PRODUCTION ENVIRONMENT DETECTED\n";
            echo "This will create 1000 student accounts in your production database.\n";
            echo "Make sure you have a backup before proceeding.\n\n";
        }

        // Check existing student count
        $existingStudents = User::where('role', 'student')->count();
        echo "📊 Current student accounts: $existingStudents\n";

        if ($existingStudents >= 1000) {
            echo "\n⚠️  1000 or more student accounts already exist.\n";
            echo "Skipping seeding to prevent duplicates.\n\n";
            return;
        }

        $programs = [
            'IT' => 500,  // Information Technology
            'CS' => 500,  // Computer Science
        ];

        // Extended name lists for better variety
        $firstNames = [
            // Filipino Male Names
            'Jose', 'Juan', 'Pedro', 'Antonio', 'Manuel', 'Francisco', 'Ricardo', 'Roberto', 'Carlos', 'Miguel',
            'Rafael', 'Angel', 'Alejandro', 'Diego', 'Daniel', 'Adrian', 'Fernando', 'Eduardo', 'Sergio', 'Jorge',
            'Mario', 'Luis', 'Raul', 'Oscar', 'Cesar', 'Victor', 'Hector', 'Arturo', 'Enrique', 'Gerardo',
            'Armando', 'Pablo', 'Emilio', 'Guillermo', 'Salvador', 'Ignacio', 'Lorenzo', 'Esteban', 'Rodrigo', 'Andres',
            
            // Filipino Female Names
            'Maria', 'Ana', 'Rosa', 'Carmen', 'Teresa', 'Luz', 'Angelica', 'Cristina', 'Isabel', 'Sofia',
            'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy',
            'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy', 'Kimberly', 'Emily', 'Donna', 'Michelle',
            'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Laura', 'Sharon', 'Cynthia', 'Amy',
            
            // International Names
            'John', 'Michael', 'David', 'James', 'Robert', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher',
            'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
            'Kevin', 'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob',
            'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin'
        ];

        $lastNames = [
            // Common Filipino Surnames
            'Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Gonzales', 'Lopez',
            'Flores', 'Rivera', 'Ramos', 'Castillo', 'Aquino', 'Fernandez', 'Valdez', 'Santiago', 'Morales', 'Pascual',
            'De Leon', 'Villanueva', 'Francisco', 'Soriano', 'Hernandez', 'Castro', 'Del Rosario', 'Panganiban', 'Luna', 'Manalo',
            'Aguilar', 'Mercado', 'Diaz', 'Marquez', 'Gutierrez', 'Jimenez', 'Rosales', 'Alvarez', 'Romero', 'Herrera',
            
            // International Surnames
            'Anderson', 'Thompson', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall',
            'Allen', 'Young', 'King', 'Wright', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson',
            'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards',
            'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy',
            'Bailey', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Peterson', 'Gray', 'Ramirez', 'James',
            'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson'
        ];

        // Status distribution for realistic data
        $statuses = [
            'active' => 92,      // 920 students
            'inactive' => 5,     // 50 students  
            'suspended' => 3     // 30 students
        ];

        $year = date('Y');
        $usedEmails = [];
        $totalCreated = 0;
        
        // Get existing emails to avoid duplicates
        echo "🔍 Checking existing emails...\n";
        $existingEmails = User::pluck('email')->toArray();
        $usedEmails = array_merge($usedEmails, $existingEmails);
        echo "   Found " . count($existingEmails) . " existing emails\n\n";

        // Start transaction for data integrity
        DB::beginTransaction();
        
        try {
            foreach ($programs as $department => $count) {
                $programName = $department === 'IT' ? 'Information Technology' : 'Computer Science';
                echo "🎓 Creating $count students for $programName ($department)...\n";
                
                $studentData = [];
                $batchSize = 100; // Process in batches of 100
                $departmentCounter = 1;
                
                for ($i = 0; $i < $count; $i++) {
                    // Generate unique name and email combination
                    $attempts = 0;
                    do {
                        $firstName = $firstNames[array_rand($firstNames)];
                        $lastName = $lastNames[array_rand($lastNames)];
                        $emailBase = strtolower($firstName . '.' . $lastName);
                        
                        // Add random number for uniqueness in large datasets
                        $randomSuffix = rand(100, 999);
                        $email = $emailBase . $randomSuffix . '@student.ccs.edu';
                        $attempts++;
                        
                        // Fallback for extreme cases
                        if ($attempts > 100) {
                            $email = $emailBase . time() . rand(10, 99) . '@student.ccs.edu';
                            break;
                        }
                    } while (in_array($email, $usedEmails));
                    
                    $usedEmails[] = $email;
                    $fullName = "$firstName $lastName";
                    
                    // Determine status based on weighted distribution
                    $status = $this->getWeightedStatus($statuses);
                    
                    // Generate student number: YYYY-DDDDD (Year-Department-Sequential)
                    $studentNumber = sprintf('%s-%s%05d', $year, $department, $departmentCounter);
                    
                    // Map department to program
                    $program = $department === 'IT' 
                        ? 'Bachelor of Science in Information Technology' 
                        : 'Bachelor of Science in Computer Science';
                    
                    // Use consistent password for all accounts
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
                        'student_id' => null,
                        'phone' => null,
                        'address' => null,
                        'program' => $program,
                        'year_level' => null,
                        'gpa' => null,
                        'enrollment_date' => null,
                        'graduation_date' => null,
                        'guardian_name' => null,
                        'guardian_phone' => null,
                        'notes' => "Production student account created on " . now()->format('F d, Y') . ". Awaiting profile completion.",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    
                    $departmentCounter++;
                    
                    // Insert in batches for better performance
                    if (count($studentData) >= $batchSize || $i === $count - 1) {
                        User::insert($studentData);
                        $totalCreated += count($studentData);
                        
                        $batchNumber = ceil($totalCreated / $batchSize);
                        echo "   ✓ Batch $batchNumber: Inserted " . count($studentData) . " accounts (Total: $totalCreated)\n";
                        
                        $studentData = []; // Reset for next batch
                        
                        // Small delay to prevent overwhelming the database
                        usleep(100000); // 0.1 second
                    }
                }
                
                echo "   ✅ Completed $department department: $departmentCounter accounts\n\n";
            }
            
            // Commit the transaction
            DB::commit();
            
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
            echo "🎉 SUCCESS! Created $totalCreated student accounts!\n";
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
            
        } catch (\Exception $e) {
            // Rollback on error
            DB::rollback();
            echo "\n❌ ERROR: " . $e->getMessage() . "\n";
            echo "Transaction rolled back. No accounts were created.\n\n";
            throw $e;
        }
        
        // Final statistics
        $finalCount = User::where('role', 'student')->count();
        echo "📊 Final Statistics:\n";
        echo "   • Total Student Accounts: $finalCount\n";
        echo "   • Information Technology (IT): 500 accounts\n";
        echo "   • Computer Science (CS): 500 accounts\n\n";
        
        echo "📊 Status Distribution (Approximate):\n";
        echo "   • Active: ~920 accounts (92%)\n";
        echo "   • Inactive: ~50 accounts (5%)\n";
        echo "   • Suspended: ~30 accounts (3%)\n\n";
        
        echo "🔐 Account Details:\n";
        echo "   • Email Format: [firstname].[lastname][###]@student.ccs.edu\n";
        echo "   • Password: Student@2024 (for all accounts)\n";
        echo "   • Student Number Format: $year-[DEPT][00001-00500]\n";
        echo "     Examples: $year-IT00001, $year-CS00500\n\n";
        
        echo "🚀 Production Ready:\n";
        echo "   • All accounts are ready for profile completion\n";
        echo "   • Use Admin Portal → Student Profiles → Add Student\n";
        echo "   • Select accounts from dropdown to complete profiles\n";
        echo "   • Batch profile creation recommended for efficiency\n\n";
        
        echo "💡 Performance Notes:\n";
        echo "   • Seeding completed with batch processing\n";
        echo "   • Transaction safety ensured\n";
        echo "   • Email uniqueness verified\n";
        echo "   • Ready for production use\n\n";
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
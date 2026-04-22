<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ITFacultySeeder extends Seeder
{
    /**
     * Seed 15 IT Faculty members with professional data.
     */
    public function run(): void
    {
        // Skip if faculty already exist
        if (Faculty::where('department', 'IT')->count() > 0) {
            echo "\n⚠️  IT Faculty already exist, skipping IT Faculty seeding.\n";
            return;
        }

        $positions = [
            'Professor' => 3,
            'Associate Professor' => 4,
            'Assistant Professor' => 5,
            'Instructor' => 3
        ];

        $specializations = [
            'Network Security',
            'Cloud Computing',
            'Database Administration',
            'Systems Administration',
            'Cybersecurity',
            'Network Infrastructure',
            'IT Project Management',
            'Enterprise Systems',
            'IT Service Management',
            'Information Security',
            'Web Technologies',
            'Mobile Computing',
            'DevOps',
            'IT Governance',
            'Business Intelligence'
        ];

        $qualifications = [
            ['Ph.D. in Information Technology', 'M.S. in Computer Science', 'B.S. in Information Technology'],
            ['Ph.D. in Computer Science', 'M.S. in Information Technology', 'B.S. in Computer Engineering'],
            ['M.S. in Information Technology', 'B.S. in Information Technology', 'CISSP Certified'],
            ['M.S. in Cybersecurity', 'B.S. in Information Technology', 'CEH Certified'],
            ['M.S. in Information Systems', 'B.S. in Information Technology', 'PMP Certified'],
            ['Ph.D. in Information Systems', 'M.S. in IT Management', 'B.S. in Information Technology'],
            ['M.S. in Network Security', 'B.S. in Information Technology', 'CCNP Certified'],
            ['M.S. in Information Technology', 'B.S. in Computer Science', 'AWS Certified Solutions Architect'],
            ['Ph.D. in Information Technology', 'M.S. in Software Engineering', 'B.S. in IT'],
            ['M.S. in Database Systems', 'B.S. in Information Technology', 'Oracle Certified Professional']
        ];

        $courses = [
            ['Network Fundamentals', 'Network Security', 'Advanced Networking'],
            ['Database Management Systems', 'Advanced Database', 'Data Warehousing'],
            ['Systems Administration', 'Linux Administration', 'Windows Server'],
            ['Cybersecurity Fundamentals', 'Ethical Hacking', 'Security Operations'],
            ['Cloud Computing', 'AWS Fundamentals', 'Cloud Architecture'],
            ['IT Project Management', 'Agile Methodologies', 'IT Strategy'],
            ['Web Development', 'Web Security', 'Full Stack Development'],
            ['Mobile Application Development', 'iOS Development', 'Android Development'],
            ['DevOps Practices', 'CI/CD Pipeline', 'Infrastructure as Code'],
            ['IT Service Management', 'ITIL Fundamentals', 'IT Operations']
        ];

        $firstNames = [
            'Michael', 'David', 'James', 'Robert', 'John', 'William', 'Richard', 'Thomas', 'Christopher', 'Daniel',
            'Sarah', 'Jennifer', 'Lisa', 'Karen', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Dorothy',
            'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Edward',
            'Mary', 'Patricia', 'Linda', 'Barbara', 'Elizabeth', 'Jessica', 'Susan', 'Carol', 'Ruth', 'Emily',
            'Anthony', 'Donald', 'Matthew', 'Joseph', 'Charles', 'Ryan', 'Jason', 'Justin', 'Frank', 'Scott',
            'Michelle', 'Laura', 'Kimberly', 'Deborah', 'Donna', 'Rebecca', 'Sharon', 'Cynthia', 'Angela', 'Helen',
            'Raymond', 'Gary', 'Timothy', 'Jose', 'Larry', 'Jeffrey', 'Dennis', 'Jacob', 'Nicholas', 'Douglas',
            'Melissa', 'Stephanie', 'Catherine', 'Christine', 'Samantha', 'Debra', 'Janet', 'Rachel', 'Carolyn', 'Maria',
            'Eric', 'Stephen', 'Jonathan', 'Larry', 'Justin', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander',
            'Amy', 'Kathleen', 'Anna', 'Shirley', 'Virginia', 'Brenda', 'Pamela', 'Nicole', 'Katherine', 'Heather'
        ];

        $lastNames = [
            'Anderson', 'Thompson', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall',
            'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker',
            'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans',
            'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell',
            'Murphy', 'Bailey', 'Rivera', 'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson',
            'Gray', 'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett', 'Wood',
            'Barnes', 'Ross', 'Henderson', 'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long', 'Patterson', 'Hughes',
            'Flores', 'Washington', 'Butler', 'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander', 'Russell', 'Griffin',
            'Diaz', 'Hayes', 'Myers', 'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace', 'Woods', 'Cole',
            'West', 'Jordan', 'Owens', 'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson', 'McDonald', 'Cruz'
        ];

        $offices = [
            'IT Building Room 101', 'IT Building Room 102', 'IT Building Room 103', 'IT Building Room 104',
            'IT Building Room 201', 'IT Building Room 202', 'IT Building Room 203', 'IT Building Room 204',
            'IT Building Room 301', 'IT Building Room 302', 'IT Building Room 303', 'IT Building Room 304',
            'IT Building Room 401', 'IT Building Room 402', 'IT Building Room 403', 'IT Building Room 404',
            'CCS Building Room 105', 'CCS Building Room 106', 'CCS Building Room 205', 'CCS Building Room 206'
        ];

        $statuses = ['active' => 85, 'on_leave' => 10, 'inactive' => 5];

        $facultyData = [];
        $counter = 1;
        $year = date('y');
        $usedEmails = []; // Track used emails to prevent duplicates

        // Generate faculty based on position distribution
        foreach ($positions as $position => $count) {
            for ($i = 0; $i < $count; $i++) {
                // Generate unique name and email combination
                $attempts = 0;
                do {
                    $firstName = $firstNames[array_rand($firstNames)];
                    $lastName = $lastNames[array_rand($lastNames)];
                    $emailBase = strtolower($firstName . '.' . $lastName);
                    $email = $emailBase . '@ccs.edu.ph';
                    $attempts++;
                    
                    // If we've tried too many times, add a number suffix
                    if ($attempts > 50) {
                        $email = $emailBase . $counter . '@ccs.edu.ph';
                        break;
                    }
                } while (in_array($email, $usedEmails));
                
                $usedEmails[] = $email;
                $fullName = "Dr. $firstName $lastName";
                
                // Determine status based on distribution
                $status = $this->getWeightedStatus($statuses);
                
                // Generate hire date (between 1-20 years ago)
                $yearsAgo = rand(1, 20);
                $hireDate = Carbon::now()->subYears($yearsAgo)->subDays(rand(0, 365));
                
                // Generate faculty ID
                $facultyId = 'FAC' . $year . str_pad($counter, 4, '0', STR_PAD_LEFT);
                
                // Select random specialization
                $specialization = $specializations[array_rand($specializations)];
                
                // Select random qualifications and courses
                $qualification = $qualifications[array_rand($qualifications)];
                $course = $courses[array_rand($courses)];
                
                // Generate phone number
                $phone = '+63 9' . rand(10, 99) . ' ' . rand(100, 999) . ' ' . rand(1000, 9999);
                
                // Generate address
                $streetNum = rand(100, 999);
                $streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Park Ave'];
                $cities = ['Quezon City', 'Manila', 'Makati', 'Pasig', 'Taguig', 'Mandaluyong', 'San Juan'];
                $address = "$streetNum " . $streets[array_rand($streets)] . ", " . $cities[array_rand($cities)] . ", Metro Manila";
                
                // Generate notes based on position
                $notes = $this->generateNotes($position, $specialization, $yearsAgo);
                
                $facultyData[] = [
                    'faculty_id' => $facultyId,
                    'name' => $fullName,
                    'email' => $email,
                    'phone' => $phone,
                    'address' => $address,
                    'department' => 'IT',
                    'position' => $position,
                    'specialization' => $specialization,
                    'office' => $offices[array_rand($offices)],
                    'hire_date' => $hireDate->format('Y-m-d'),
                    'notes' => $notes,
                    'qualifications' => json_encode($qualification),
                    'courses' => json_encode($course),
                    'status' => $status,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $counter++;
            }
        }

        // Insert all faculty data
        Faculty::insert($facultyData);

        echo "\n✅ Successfully seeded 15 IT Faculty members\n";
        echo "   - Professors: 3\n";
        echo "   - Associate Professors: 4\n";
        echo "   - Assistant Professors: 5\n";
        echo "   - Instructors: 3\n";
        echo "   - Active: ~13, On Leave: ~1-2, Inactive: ~0-1\n\n";
    }

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

    private function generateNotes($position, $specialization, $yearsExperience)
    {
        $notes = [];
        
        // Add experience note
        $notes[] = "$yearsExperience years of teaching experience in Information Technology.";
        
        // Add specialization note
        $notes[] = "Specializes in $specialization with extensive industry and academic background.";
        
        // Add position-specific notes
        switch ($position) {
            case 'Professor':
                $notes[] = "Published numerous research papers in international journals.";
                $notes[] = "Serves as thesis adviser for graduate students.";
                $notes[] = "Active member of professional IT organizations.";
                break;
            case 'Associate Professor':
                $notes[] = "Actively involved in research and publication activities.";
                $notes[] = "Mentors junior faculty members.";
                $notes[] = "Contributes to curriculum development.";
                break;
            case 'Assistant Professor':
                $notes[] = "Pursuing advanced research in specialized IT fields.";
                $notes[] = "Participates in faculty development programs.";
                $notes[] = "Engages in community extension activities.";
                break;
            case 'Instructor':
                $notes[] = "Dedicated to student learning and development.";
                $notes[] = "Actively participates in departmental activities.";
                $notes[] = "Pursuing advanced studies and certifications.";
                break;
            case 'Lecturer':
                $notes[] = "Brings industry experience to the classroom.";
                $notes[] = "Part-time faculty with professional practice.";
                $notes[] = "Provides practical insights to students.";
                break;
        }
        
        return implode(' ', $notes);
    }
}

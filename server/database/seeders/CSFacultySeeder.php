<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CSFacultySeeder extends Seeder
{
    /**
     * Seed 15 CS Faculty members with professional data.
     */
    public function run(): void
    {
        // Skip if faculty already exist
        if (Faculty::where('department', 'CS')->count() > 0) {
            echo "\n⚠️  CS Faculty already exist, skipping CS Faculty seeding.\n";
            return;
        }

        $positions = [
            'Professor' => 3,
            'Associate Professor' => 4,
            'Assistant Professor' => 5,
            'Instructor' => 3
        ];

        $specializations = [
            'Artificial Intelligence',
            'Machine Learning',
            'Data Science',
            'Software Engineering',
            'Computer Graphics',
            'Computer Vision',
            'Natural Language Processing',
            'Algorithms and Complexity',
            'Distributed Systems',
            'Programming Languages',
            'Human-Computer Interaction',
            'Theoretical Computer Science',
            'Robotics',
            'Quantum Computing',
            'Bioinformatics'
        ];

        $qualifications = [
            ['Ph.D. in Computer Science', 'M.S. in Computer Science', 'B.S. in Computer Science'],
            ['Ph.D. in Artificial Intelligence', 'M.S. in Computer Science', 'B.S. in Computer Engineering'],
            ['M.S. in Computer Science', 'B.S. in Computer Science', 'Oracle Java Certified'],
            ['M.S. in Data Science', 'B.S. in Computer Science', 'Google Cloud Certified'],
            ['M.S. in Software Engineering', 'B.S. in Computer Science', 'Scrum Master Certified'],
            ['Ph.D. in Machine Learning', 'M.S. in Computer Science', 'B.S. in Mathematics'],
            ['M.S. in Computer Science', 'B.S. in Computer Science', 'Microsoft Certified Professional'],
            ['M.S. in Artificial Intelligence', 'B.S. in Computer Science', 'TensorFlow Developer Certified'],
            ['Ph.D. in Computer Science', 'M.S. in Data Science', 'B.S. in Computer Science'],
            ['M.S. in Computer Graphics', 'B.S. in Computer Science', 'Unity Certified Developer']
        ];

        $courses = [
            ['Data Structures and Algorithms', 'Advanced Algorithms', 'Algorithm Analysis'],
            ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
            ['Software Engineering', 'Software Design', 'Software Architecture'],
            ['Database Systems', 'Advanced Database', 'Big Data Analytics'],
            ['Computer Graphics', '3D Modeling', 'Game Development'],
            ['Operating Systems', 'Distributed Systems', 'Cloud Computing'],
            ['Programming Fundamentals', 'Object-Oriented Programming', 'Advanced Programming'],
            ['Computer Networks', 'Network Programming', 'Internet Technologies'],
            ['Theory of Computation', 'Discrete Mathematics', 'Formal Languages'],
            ['Mobile App Development', 'Web Development', 'Full Stack Development']
        ];

        $firstNames = [
            'Alexander', 'Benjamin', 'Christopher', 'Daniel', 'Ethan', 'Gabriel', 'Henry', 'Isaac', 'Jacob', 'Liam',
            'Sophia', 'Olivia', 'Emma', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
            'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Lucas', 'Mason', 'Logan', 'Jackson', 'Sebastian',
            'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria',
            'Aiden', 'Matthew', 'Samuel', 'David', 'Joseph', 'Carter', 'Owen', 'Wyatt', 'John', 'Jack',
            'Madison', 'Lily', 'Hannah', 'Aria', 'Layla', 'Zoe', 'Penelope', 'Riley', 'Nora', 'Lillian',
            'Luke', 'Jayden', 'Dylan', 'Grayson', 'Levi', 'Nathan', 'Caleb', 'Ryan', 'Connor', 'Asher',
            'Zoey', 'Natalie', 'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella',
            'Lincoln', 'Hunter', 'Eli', 'Adrian', 'Jonathan', 'Christian', 'Landon', 'Colton', 'Jordan', 'Brayden',
            'Claire', 'Skylar', 'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Emilia'
        ];

        $lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
            'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
            'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
            'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
            'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
            'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
            'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
            'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
            'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
            'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
        ];

        $offices = [
            'CS Building Room 101', 'CS Building Room 102', 'CS Building Room 103', 'CS Building Room 104',
            'CS Building Room 201', 'CS Building Room 202', 'CS Building Room 203', 'CS Building Room 204',
            'CS Building Room 301', 'CS Building Room 302', 'CS Building Room 303', 'CS Building Room 304',
            'CS Building Room 401', 'CS Building Room 402', 'CS Building Room 403', 'CS Building Room 404',
            'CCS Building Room 107', 'CCS Building Room 108', 'CCS Building Room 207', 'CCS Building Room 208'
        ];

        $statuses = ['active' => 85, 'on_leave' => 10, 'inactive' => 5];

        $facultyData = [];
        $counter = 16; // Start from 16 to avoid conflicts with IT faculty (1-15)
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
                    $email = $emailBase . '.cs@ccs.edu.ph';
                    $attempts++;
                    
                    // If we've tried too many times, add a number suffix
                    if ($attempts > 50) {
                        $email = $emailBase . $counter . '.cs@ccs.edu.ph';
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
                $streets = ['University Ave', 'College Rd', 'Academic Dr', 'Campus Ln', 'Scholar St', 'Education Blvd'];
                $cities = ['Quezon City', 'Manila', 'Makati', 'Pasig', 'Taguig', 'Mandaluyong', 'Pasay'];
                $address = "$streetNum " . $streets[array_rand($streets)] . ", " . $cities[array_rand($cities)] . ", Metro Manila";
                
                // Generate notes based on position
                $notes = $this->generateNotes($position, $specialization, $yearsAgo);
                
                $facultyData[] = [
                    'faculty_id' => $facultyId,
                    'name' => $fullName,
                    'email' => $email,
                    'phone' => $phone,
                    'address' => $address,
                    'department' => 'CS',
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

        echo "\n✅ Successfully seeded 15 CS Faculty members\n";
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
        $notes[] = "$yearsExperience years of teaching experience in Computer Science.";
        
        // Add specialization note
        $notes[] = "Specializes in $specialization with strong research background.";
        
        // Add position-specific notes
        switch ($position) {
            case 'Professor':
                $notes[] = "Published extensively in top-tier computer science conferences and journals.";
                $notes[] = "Principal investigator for multiple research grants.";
                $notes[] = "Recognized expert in the field with international collaborations.";
                break;
            case 'Associate Professor':
                $notes[] = "Active researcher with publications in reputable venues.";
                $notes[] = "Supervises graduate students and research projects.";
                $notes[] = "Contributes to academic program development.";
                break;
            case 'Assistant Professor':
                $notes[] = "Emerging researcher with promising publication record.";
                $notes[] = "Participates in collaborative research initiatives.";
                $notes[] = "Engages in professional development activities.";
                break;
            case 'Instructor':
                $notes[] = "Committed to excellence in computer science education.";
                $notes[] = "Actively involved in student mentoring and guidance.";
                $notes[] = "Pursuing doctoral studies and research interests.";
                break;
            case 'Lecturer':
                $notes[] = "Industry professional with practical expertise.";
                $notes[] = "Adjunct faculty bringing real-world experience.";
                $notes[] = "Bridges academic theory with industry practice.";
                break;
        }
        
        return implode(' ', $notes);
    }
}

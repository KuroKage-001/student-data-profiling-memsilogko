<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ClassSection;
use App\Models\Faculty;
use App\Models\FacultyClassAssignment;
use Carbon\Carbon;

class ClassSectionSeeder extends Seeder
{
    /**
     * Run the database seeds with professional, realistic class schedule data.
     */
    public function run(): void
    {
        // Check if data already exists
        if (ClassSection::count() > 0) {
            $this->command->warn('⚠️  Class sections already exist. Skipping seeding.');
            $this->command->info('💡 Run "php artisan migrate:fresh --seed" to reset and reseed all data.');
            return;
        }

        $this->command->info('🎓 Seeding class sections with professional data...');

        // Get faculty members by department
        $csFaculty = Faculty::where('department', 'CS')->where('status', 'active')->take(15)->get();
        $itFaculty = Faculty::where('department', 'IT')->where('status', 'active')->take(10)->get();

        if ($csFaculty->isEmpty() || $itFaculty->isEmpty()) {
            $this->command->error('❌ No faculty members found. Please run faculty seeders first:');
            $this->command->info('   php artisan db:seed --class=CSFacultySeeder');
            $this->command->info('   php artisan db:seed --class=ITFacultySeeder');
            return;
        }

        // Define comprehensive course catalog
        $courses = [
            // Computer Science Courses
            'CS' => [
                ['code' => 'CS 101', 'name' => 'Introduction to Programming', 'capacity' => 40],
                ['code' => 'CS 102', 'name' => 'Data Structures and Algorithms', 'capacity' => 35],
                ['code' => 'CS 201', 'name' => 'Object-Oriented Programming', 'capacity' => 35],
                ['code' => 'CS 202', 'name' => 'Database Management Systems', 'capacity' => 30],
                ['code' => 'CS 301', 'name' => 'Software Engineering', 'capacity' => 30],
                ['code' => 'CS 302', 'name' => 'Web Development', 'capacity' => 35],
                ['code' => 'CS 303', 'name' => 'Mobile Application Development', 'capacity' => 30],
                ['code' => 'CS 401', 'name' => 'Artificial Intelligence', 'capacity' => 25],
                ['code' => 'CS 402', 'name' => 'Machine Learning', 'capacity' => 25],
                ['code' => 'CS 403', 'name' => 'Computer Graphics', 'capacity' => 25],
                ['code' => 'CS 404', 'name' => 'Capstone Project I', 'capacity' => 20],
                ['code' => 'CS 405', 'name' => 'Capstone Project II', 'capacity' => 20],
            ],
            // Information Technology Courses
            'IT' => [
                ['code' => 'IT 101', 'name' => 'Introduction to Information Technology', 'capacity' => 40],
                ['code' => 'IT 102', 'name' => 'Computer Networks Fundamentals', 'capacity' => 35],
                ['code' => 'IT 201', 'name' => 'Network Security', 'capacity' => 30],
                ['code' => 'IT 202', 'name' => 'System Administration', 'capacity' => 30],
                ['code' => 'IT 203', 'name' => 'Cloud Computing', 'capacity' => 30],
                ['code' => 'IT 301', 'name' => 'Cybersecurity', 'capacity' => 25],
                ['code' => 'IT 302', 'name' => 'IT Project Management', 'capacity' => 30],
                ['code' => 'IT 303', 'name' => 'Enterprise Architecture', 'capacity' => 25],
                ['code' => 'IT 401', 'name' => 'Advanced Network Security', 'capacity' => 25],
                ['code' => 'IT 402', 'name' => 'IT Audit and Compliance', 'capacity' => 25],
            ],
        ];

        // Define rooms by building
        $rooms = [
            'CS' => ['CS-301', 'CS-302', 'CS-303', 'CS-304', 'CS-401', 'CS-402', 'CS-Lab1', 'CS-Lab2'],
            'IT' => ['IT-201', 'IT-202', 'IT-203', 'IT-Lab1', 'IT-Lab2', 'IT-Lab3'],
            'CCS' => ['CCS-101', 'CCS-102', 'CCS-103', 'CCS-201', 'CCS-202'],
        ];

        // Define time slots (realistic university schedule)
        $timeSlots = [
            ['start' => '07:00', 'end' => '08:30'],
            ['start' => '08:30', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '11:30'],
            ['start' => '11:30', 'end' => '13:00'],
            ['start' => '13:00', 'end' => '14:30'],
            ['start' => '14:30', 'end' => '16:00'],
            ['start' => '16:00', 'end' => '17:30'],
            ['start' => '17:30', 'end' => '19:00'],
        ];

        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $sections = ['A', 'B', 'C', 'D'];
        $semester = 'Spring 2026';
        $academicYear = '2025-2026';

        $classSectionsData = [];
        $assignmentsData = [];
        $usedCombinations = []; // Track room-day-time combinations to avoid conflicts

        // Generate class sections
        foreach ($courses as $dept => $courseList) {
            $facultyList = $dept === 'CS' ? $csFaculty : $itFaculty;
            $facultyIndex = 0;

            foreach ($courseList as $course) {
                // Create 2-3 sections per course
                $numSections = in_array($course['code'], ['CS 101', 'IT 101']) ? 3 : 2;
                
                for ($i = 0; $i < $numSections; $i++) {
                    $sectionCode = $sections[$i];
                    
                    // Find available time slot and room
                    $attempts = 0;
                    do {
                        $day = $days[array_rand($days)];
                        $timeSlot = $timeSlots[array_rand($timeSlots)];
                        $roomList = array_merge($rooms[$dept], $rooms['CCS']);
                        $room = $roomList[array_rand($roomList)];
                        
                        $combination = "{$room}-{$day}-{$timeSlot['start']}";
                        $attempts++;
                        
                        if ($attempts > 50) break; // Prevent infinite loop
                    } while (in_array($combination, $usedCombinations) && $attempts < 50);
                    
                    $usedCombinations[] = $combination;

                    // Calculate realistic enrollment (70-95% of capacity)
                    $enrollmentPercent = rand(70, 95) / 100;
                    $currentEnrollment = (int)($course['capacity'] * $enrollmentPercent);

                    // Get faculty for this section
                    $faculty = $facultyList[$facultyIndex % $facultyList->count()];
                    $facultyIndex++;

                    $classSectionsData[] = [
                        'section_code' => $sectionCode,
                        'course_code' => $course['code'],
                        'course_name' => $course['name'],
                        'room' => $room,
                        'day_of_week' => $day,
                        'start_time' => $timeSlot['start'],
                        'end_time' => $timeSlot['end'],
                        'semester' => $semester,
                        'academic_year' => $academicYear,
                        'max_capacity' => $course['capacity'],
                        'current_enrollment' => $currentEnrollment,
                        'status' => 'active',
                        'created_at' => now(),
                        'updated_at' => now(),
                        'faculty_id' => $faculty->id, // Temporary field for assignment
                    ];
                }
            }
        }

        // Insert class sections in batches
        $this->command->info('📚 Creating ' . count($classSectionsData) . ' class sections...');
        
        $insertedCount = 0;
        foreach ($classSectionsData as $sectionData) {
            try {
                $facultyId = $sectionData['faculty_id'];
                unset($sectionData['faculty_id']);

                $section = ClassSection::create($sectionData);
                $insertedCount++;

                // Create faculty assignment
                FacultyClassAssignment::create([
                    'faculty_id' => $facultyId,
                    'class_section_id' => $section->id,
                    'assignment_type' => 'primary',
                    'assigned_date' => Carbon::now()->subDays(rand(30, 90)),
                    'status' => 'active',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

            } catch (\Exception $e) {
                // Skip duplicates silently
                if (!str_contains($e->getMessage(), 'Duplicate entry')) {
                    $this->command->warn("⚠️  Skipped: {$sectionData['course_code']}-{$sectionData['section_code']} - " . $e->getMessage());
                }
            }
        }

        $this->command->info('');
        $this->command->info('✅ Successfully seeded class schedule!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info("   • Total Sections: {$insertedCount}");
        $this->command->info("   • CS Courses: " . count($courses['CS']) . " courses");
        $this->command->info("   • IT Courses: " . count($courses['IT']) . " courses");
        $this->command->info("   • Semester: {$semester}");
        $this->command->info("   • Academic Year: {$academicYear}");
        $this->command->info("   • Faculty Assigned: " . ($csFaculty->count() + $itFaculty->count()));
        $this->command->info('');
        $this->command->info('🎯 Next steps:');
        $this->command->info('   1. Start Laravel server: php artisan serve');
        $this->command->info('   2. Login to admin dashboard');
        $this->command->info('   3. Navigate to Scheduling page');
        $this->command->info('');
    }
}

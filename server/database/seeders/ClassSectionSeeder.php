<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ClassSection;
use App\Models\Faculty;
use App\Models\FacultyClassAssignment;

class ClassSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some faculty members
        $itFaculty = Faculty::where('department', 'IT')->first();
        $csFaculty = Faculty::where('department', 'CS')->first();

        $classSections = [
            [
                'section_code' => 'A',
                'course_code' => 'CS 101',
                'course_name' => 'Introduction to Programming',
                'room' => 'CS-301',
                'day_of_week' => 'Monday',
                'start_time' => '08:00',
                'end_time' => '10:00',
                'semester' => 'Fall 2024',
                'academic_year' => '2024-2025',
                'max_capacity' => 40,
                'current_enrollment' => 35,
                'status' => 'active',
                'faculty_id' => $csFaculty?->id,
            ],
            [
                'section_code' => 'B',
                'course_code' => 'IT 201',
                'course_name' => 'Network Security',
                'room' => 'IT-205',
                'day_of_week' => 'Tuesday',
                'start_time' => '14:00',
                'end_time' => '16:00',
                'semester' => 'Fall 2024',
                'academic_year' => '2024-2025',
                'max_capacity' => 30,
                'current_enrollment' => 28,
                'status' => 'active',
                'faculty_id' => $itFaculty?->id,
            ],
            [
                'section_code' => 'A',
                'course_code' => 'CE 301',
                'course_name' => 'Microprocessors',
                'room' => 'CE-150',
                'day_of_week' => 'Wednesday',
                'start_time' => '10:00',
                'end_time' => '12:00',
                'semester' => 'Fall 2024',
                'academic_year' => '2024-2025',
                'max_capacity' => 25,
                'current_enrollment' => 22,
                'status' => 'active',
                'faculty_id' => $csFaculty?->id,
            ],
            [
                'section_code' => 'A',
                'course_code' => 'DS 401',
                'course_name' => 'Advanced Analytics',
                'room' => 'DS-401',
                'day_of_week' => 'Thursday',
                'start_time' => '13:00',
                'end_time' => '15:00',
                'semester' => 'Fall 2024',
                'academic_year' => '2024-2025',
                'max_capacity' => 20,
                'current_enrollment' => 18,
                'status' => 'active',
                'faculty_id' => $itFaculty?->id,
            ],
            [
                'section_code' => 'B',
                'course_code' => 'CS 101',
                'course_name' => 'Introduction to Programming',
                'room' => 'CS-302',
                'day_of_week' => 'Friday',
                'start_time' => '08:00',
                'end_time' => '10:00',
                'semester' => 'Fall 2024',
                'academic_year' => '2024-2025',
                'max_capacity' => 40,
                'current_enrollment' => 32,
                'status' => 'active',
                'faculty_id' => $csFaculty?->id,
            ],
        ];

        foreach ($classSections as $sectionData) {
            $facultyId = $sectionData['faculty_id'];
            unset($sectionData['faculty_id']);

            $section = ClassSection::create($sectionData);

            // Assign faculty if available
            if ($facultyId) {
                FacultyClassAssignment::create([
                    'faculty_id' => $facultyId,
                    'class_section_id' => $section->id,
                    'assignment_type' => 'primary',
                    'assigned_date' => now(),
                    'status' => 'active',
                ]);
            }
        }

        $this->command->info('Class sections seeded successfully!');
    }
}

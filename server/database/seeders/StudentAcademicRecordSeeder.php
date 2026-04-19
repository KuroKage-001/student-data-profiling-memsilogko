<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\StudentAcademicRecord;
use App\Models\StudentSubject;
use Illuminate\Support\Facades\DB;

class StudentAcademicRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if records already exist
        $existingRecords = StudentAcademicRecord::count();
        if ($existingRecords > 50) {
            $this->command->warn("⚠️  {$existingRecords} academic records already exist. Skipping seeding.");
            return;
        }

        // Get all active students
        $students = User::where('role', 'student')
            ->where('status', 'active')
            ->get();

        if ($students->isEmpty()) {
            $this->command->info('No students found. Skipping academic records seeding.');
            return;
        }

        $this->command->info('Starting student academic records seeding...');
        $this->command->info("Found {$students->count()} students");

        $recordCount = 0;
        $subjectCount = 0;

        // Common subjects for IT and CS programs
        $itSubjects = [
            ['code' => 'IT101', 'name' => 'Introduction to Computing', 'units' => 3],
            ['code' => 'IT102', 'name' => 'Computer Programming 1', 'units' => 3],
            ['code' => 'IT103', 'name' => 'Data Structures and Algorithms', 'units' => 3],
            ['code' => 'IT201', 'name' => 'Database Management Systems', 'units' => 3],
            ['code' => 'IT202', 'name' => 'Web Development', 'units' => 3],
            ['code' => 'IT203', 'name' => 'Network Administration', 'units' => 3],
            ['code' => 'IT301', 'name' => 'System Analysis and Design', 'units' => 3],
            ['code' => 'IT302', 'name' => 'Mobile Application Development', 'units' => 3],
        ];

        $csSubjects = [
            ['code' => 'CS101', 'name' => 'Introduction to Computer Science', 'units' => 3],
            ['code' => 'CS102', 'name' => 'Programming Fundamentals', 'units' => 3],
            ['code' => 'CS103', 'name' => 'Discrete Mathematics', 'units' => 3],
            ['code' => 'CS201', 'name' => 'Object-Oriented Programming', 'units' => 3],
            ['code' => 'CS202', 'name' => 'Computer Architecture', 'units' => 3],
            ['code' => 'CS203', 'name' => 'Operating Systems', 'units' => 3],
            ['code' => 'CS301', 'name' => 'Software Engineering', 'units' => 3],
            ['code' => 'CS302', 'name' => 'Artificial Intelligence', 'units' => 3],
        ];

        $grades = ['1.0', '1.25', '1.5', '1.75', '2.0', '2.25', '2.5', '2.75', '3.0'];
        $semesters = [1, 2];
        $academicYears = ['2023-2024', '2024-2025', '2025-2026'];

        try {
            // Use batch processing for better performance
            DB::beginTransaction();
            
            foreach ($students as $student) {
                // Skip if student already has records
                if (StudentAcademicRecord::where('user_id', $student->id)->exists()) {
                    continue;
                }

                // Determine subjects based on department
                $subjects = $student->department === 'IT' ? $itSubjects : $csSubjects;

                // Create 2-3 academic records per student (different semesters)
                $numRecords = rand(2, 3);
                
                for ($i = 0; $i < $numRecords; $i++) {
                    $academicYear = $academicYears[array_rand($academicYears)];
                    $semester = $semesters[array_rand($semesters)];

                    // Create academic record
                    $record = StudentAcademicRecord::create([
                        'user_id' => $student->id,
                        'semester' => (string)$semester,
                        'academic_year' => $academicYear,
                        'semester_gpa' => 0, // Will be calculated
                        'remarks' => null,
                    ]);

                    $recordCount++;

                    // Add 4-6 subjects per semester
                    $numSubjects = rand(4, 6);
                    $selectedSubjects = array_rand($subjects, min($numSubjects, count($subjects)));
                    
                    if (!is_array($selectedSubjects)) {
                        $selectedSubjects = [$selectedSubjects];
                    }

                    $totalGradePoints = 0;
                    $totalUnits = 0;

                    foreach ($selectedSubjects as $subjectIndex) {
                        $subject = $subjects[$subjectIndex];
                        $grade = $grades[array_rand($grades)];
                        
                        StudentSubject::create([
                            'academic_record_id' => $record->id,
                            'subject_code' => $subject['code'],
                            'subject_name' => $subject['name'],
                            'units' => $subject['units'],
                            'grade' => $grade,
                        ]);

                        $subjectCount++;

                        // Calculate GPA
                        $gradePoint = $this->convertGradeToPoint($grade);
                        $totalGradePoints += $gradePoint * $subject['units'];
                        $totalUnits += $subject['units'];
                    }

                    // Update semester GPA
                    $semesterGpa = $totalUnits > 0 ? round($totalGradePoints / $totalUnits, 2) : 0;
                    $record->update(['semester_gpa' => $semesterGpa]);
                }

                // Update student's overall GPA
                $allRecords = StudentAcademicRecord::where('user_id', $student->id)->get();
                $overallGpa = $allRecords->avg('semester_gpa');
                $student->update(['gpa' => round($overallGpa, 2)]);
            }

            DB::commit();
            
            $this->command->info("Successfully created {$recordCount} academic records!");
            $this->command->info("Successfully created {$subjectCount} subject entries!");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding academic records: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Convert letter grade to grade point
     */
    private function convertGradeToPoint($grade)
    {
        $gradeMap = [
            '1.0' => 4.0,
            '1.25' => 3.75,
            '1.5' => 3.5,
            '1.75' => 3.25,
            '2.0' => 3.0,
            '2.25' => 2.75,
            '2.5' => 2.5,
            '2.75' => 2.25,
            '3.0' => 2.0,
            '4.0' => 1.0,
            '5.0' => 0.0,
        ];

        return $gradeMap[$grade] ?? 0.0;
    }
}

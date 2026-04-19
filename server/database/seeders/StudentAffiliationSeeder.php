<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\StudentAffiliation;
use Illuminate\Support\Facades\DB;

class StudentAffiliationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if affiliations already exist BEFORE starting transaction
        $existingAffiliations = StudentAffiliation::count();
        if ($existingAffiliations > 50) {
            $this->command->warn("⚠️  {$existingAffiliations} affiliations already exist. Skipping seeding.");
            return;
        }

        // Get all active students
        $students = User::where('role', 'student')
            ->where('status', 'active')
            ->get();

        if ($students->isEmpty()) {
            $this->command->info('No students found. Skipping affiliations seeding.');
            return;
        }

        $this->command->info('Starting student affiliations seeding...');

        $affiliations = [
            ['name' => 'Computer Science Society', 'type' => 'academic_org'],
            ['name' => 'IT Student Council', 'type' => 'academic_org'],
            ['name' => 'Programming Club', 'type' => 'academic_org'],
            ['name' => 'Robotics Club', 'type' => 'academic_org'],
            ['name' => 'Web Development Society', 'type' => 'academic_org'],
            ['name' => 'Cybersecurity Club', 'type' => 'academic_org'],
            ['name' => "Dean's List", 'type' => 'academic_org'],
            ['name' => "President's List", 'type' => 'academic_org'],
            ['name' => 'Academic Excellence Award', 'type' => 'academic_org'],
            ['name' => 'Best Capstone Project', 'type' => 'academic_org'],
            ['name' => 'Hackathon Winner', 'type' => 'academic_org'],
            ['name' => 'Research Symposium Presenter', 'type' => 'academic_org'],
            ['name' => 'Basketball Team', 'type' => 'sports'],
            ['name' => 'Volleyball Team', 'type' => 'sports'],
            ['name' => 'Chess Club', 'type' => 'sports'],
            ['name' => 'Community Service Organization', 'type' => 'civic'],
        ];

        $affiliationCount = 0;

        try {
            // Start transaction
            DB::beginTransaction();
            
            foreach ($students as $student) {
                // Each student gets 0-4 random affiliations
                $numAffiliations = rand(0, 4);
                
                if ($numAffiliations > 0) {
                    $selectedAffiliations = array_rand($affiliations, min($numAffiliations, count($affiliations)));
                    
                    if (!is_array($selectedAffiliations)) {
                        $selectedAffiliations = [$selectedAffiliations];
                    }

                    foreach ($selectedAffiliations as $affiliationIndex) {
                        $affiliation = $affiliations[$affiliationIndex];
                        
                        // Generate random values
                        $randomEndDate = rand(0, 1);
                        $randomActive = rand(0, 1);
                        
                        StudentAffiliation::create([
                            'user_id' => $student->id,
                            'organization_name' => $affiliation['name'],
                            'affiliation_type' => $affiliation['type'],
                            'role' => $this->getRandomRole($affiliation['type']),
                            'start_date' => now()->subMonths(rand(1, 24)),
                            'end_date' => $randomEndDate === 1 ? now()->addMonths(rand(1, 12)) : null,
                            'is_active' => $randomActive === 1 ? true : false,
                            'description' => $this->getDescription($affiliation['name'], $affiliation['type']),
                        ]);

                        $affiliationCount++;
                    }
                }
            }

            DB::commit();
            $this->command->info("Successfully created {$affiliationCount} student affiliations!");

        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error seeding affiliations: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get random role based on affiliation type
     */
    private function getRandomRole($type)
    {
        $roles = [
            'academic_org' => ['President', 'Vice President', 'Secretary', 'Treasurer', 'Member', 'Active Member'],
            'sports' => ['Team Captain', 'Vice Captain', 'Player', 'Member'],
            'civic' => ['President', 'Vice President', 'Volunteer', 'Member'],
            'religious' => ['Leader', 'Member', 'Active Member'],
            'political' => ['President', 'Member', 'Active Member'],
            'other' => ['Member', 'Active Member'],
        ];

        $typeRoles = $roles[$type] ?? ['Member'];
        return $typeRoles[array_rand($typeRoles)];
    }

    /**
     * Get description based on affiliation
     */
    private function getDescription($name, $type)
    {
        $descriptions = [
            'Computer Science Society' => 'Active member of the Computer Science Society, participating in various tech events and workshops.',
            'IT Student Council' => 'Representing IT students in academic and extracurricular activities.',
            'Programming Club' => 'Member of the Programming Club, engaging in coding challenges and collaborative projects.',
            'Robotics Club' => 'Participating in robotics competitions and building innovative projects.',
            'Web Development Society' => 'Contributing to web development projects and learning modern frameworks.',
            'Cybersecurity Club' => 'Learning and practicing cybersecurity principles and ethical hacking.',
            "Dean's List" => 'Achieved Dean\'s List recognition for academic excellence.',
            "President's List" => 'Achieved President\'s List recognition for outstanding academic performance.',
            'Academic Excellence Award' => 'Received award for maintaining high academic standards.',
            'Best Capstone Project' => 'Awarded for outstanding capstone project presentation and implementation.',
            'Hackathon Winner' => 'Won hackathon competition with innovative solution.',
            'Research Symposium Presenter' => 'Presented research paper at the annual research symposium.',
            'Basketball Team' => 'Member of the college basketball team.',
            'Volleyball Team' => 'Member of the college volleyball team.',
            'Chess Club' => 'Active member of the chess club, participating in tournaments.',
            'Community Service Organization' => 'Volunteering for community service projects and outreach programs.',
        ];

        return $descriptions[$name] ?? "Member of {$name}.";
    }
}

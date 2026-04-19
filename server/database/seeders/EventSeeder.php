<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // Skip if events already exist
        if (\App\Models\Event::count() > 0) {
            echo "\n⚠️  Events already exist, skipping Event seeding.\n";
            return;
        }

        $events = [
            [
                'title' => 'CCS Research Symposium 2026',
                'date' => '2026-05-15',
                'time' => '09:00:00',
                'location' => 'Main Auditorium',
                'type' => 'Academic',
                'status' => 'Upcoming',
                'attendees' => 150,
                'description' => 'Annual research presentation by CCS faculty and students',
            ],
            [
                'title' => 'Faculty Development Workshop',
                'date' => '2026-05-20',
                'time' => '14:00:00',
                'location' => 'Conference Room A',
                'type' => 'Professional',
                'status' => 'Upcoming',
                'attendees' => 25,
                'description' => 'Workshop on modern teaching methodologies',
            ],
            [
                'title' => 'Student Orientation',
                'date' => '2026-03-10',
                'time' => '08:00:00',
                'location' => 'CCS Building',
                'type' => 'Academic',
                'status' => 'Completed',
                'attendees' => 200,
                'description' => 'Orientation for new CCS students',
            ],
            [
                'title' => 'Tech Talk: AI in Education',
                'date' => '2026-04-25',
                'time' => '15:00:00',
                'location' => 'Lecture Hall B',
                'type' => 'Academic',
                'status' => 'Completed',
                'attendees' => 80,
                'description' => 'Guest speaker discussing AI applications in modern education',
            ],
            [
                'title' => 'Hackathon 2026',
                'date' => '2026-05-01',
                'time' => '08:00:00',
                'location' => 'Computer Lab Complex',
                'type' => 'Competition',
                'status' => 'Upcoming',
                'attendees' => 120,
                'description' => '24-hour coding competition for students',
            ],
            [
                'title' => 'Career Fair',
                'date' => '2026-06-15',
                'time' => '10:00:00',
                'location' => 'Main Hall',
                'type' => 'Professional',
                'status' => 'Upcoming',
                'attendees' => 300,
                'description' => 'Annual career fair with industry partners',
            ],
            [
                'title' => 'Web Development Bootcamp',
                'date' => '2026-05-10',
                'time' => '13:00:00',
                'location' => 'Computer Lab 1',
                'type' => 'Workshop',
                'status' => 'Upcoming',
                'attendees' => 50,
                'description' => 'Intensive workshop on modern web development frameworks',
            ],
            [
                'title' => 'Cybersecurity Awareness Seminar',
                'date' => '2026-04-28',
                'time' => '10:00:00',
                'location' => 'Lecture Hall A',
                'type' => 'Seminar',
                'status' => 'Completed',
                'attendees' => 100,
                'description' => 'Learn about cybersecurity best practices and threat prevention',
            ],
            [
                'title' => 'Mobile App Development Workshop',
                'date' => '2026-05-05',
                'time' => '14:00:00',
                'location' => 'Computer Lab 2',
                'type' => 'Workshop',
                'status' => 'Upcoming',
                'attendees' => 60,
                'description' => 'Hands-on workshop on building mobile applications',
            ],
            [
                'title' => 'Alumni Networking Night',
                'date' => '2026-06-01',
                'time' => '18:00:00',
                'location' => 'CCS Lobby',
                'type' => 'Social',
                'status' => 'Upcoming',
                'attendees' => 150,
                'description' => 'Connect with CCS alumni and expand your professional network',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'title' => 'CCS Research Symposium 2024',
                'date' => '2024-04-15',
                'time' => '09:00:00',
                'location' => 'Main Auditorium',
                'type' => 'Academic',
                'status' => 'Upcoming',
                'attendees' => 150,
                'description' => 'Annual research presentation by CCS faculty and students',
            ],
            [
                'title' => 'Faculty Development Workshop',
                'date' => '2024-04-20',
                'time' => '14:00:00',
                'location' => 'Conference Room A',
                'type' => 'Professional',
                'status' => 'Upcoming',
                'attendees' => 25,
                'description' => 'Workshop on modern teaching methodologies',
            ],
            [
                'title' => 'Student Orientation',
                'date' => '2024-03-10',
                'time' => '08:00:00',
                'location' => 'CCS Building',
                'type' => 'Academic',
                'status' => 'Completed',
                'attendees' => 200,
                'description' => 'Orientation for new CCS students',
            ],
            [
                'title' => 'Tech Talk: AI in Education',
                'date' => '2024-04-25',
                'time' => '15:00:00',
                'location' => 'Lecture Hall B',
                'type' => 'Academic',
                'status' => 'Upcoming',
                'attendees' => 80,
                'description' => 'Guest speaker discussing AI applications in modern education',
            ],
            [
                'title' => 'Hackathon 2024',
                'date' => '2024-05-01',
                'time' => '08:00:00',
                'location' => 'Computer Lab Complex',
                'type' => 'Competition',
                'status' => 'Upcoming',
                'attendees' => 120,
                'description' => '24-hour coding competition for students',
            ],
            [
                'title' => 'Career Fair',
                'date' => '2024-03-15',
                'time' => '10:00:00',
                'location' => 'Main Hall',
                'type' => 'Professional',
                'status' => 'Completed',
                'attendees' => 300,
                'description' => 'Annual career fair with industry partners',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}

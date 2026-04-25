<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class RehashPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'passwords:rehash';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rehash all user passwords with current bcrypt configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting password rehashing...');
        
        // Default passwords for each role
        $defaultPasswords = [
            'admin@ccs.edu' => 'Admin@2024',
            'deptchair.it@ccs.edu' => 'DeptChair@2024',
            'deptchair.cs@ccs.edu' => 'DeptChair@2024',
            'faculty.it@ccs.edu' => 'Faculty@2024',
            'faculty.cs@ccs.edu' => 'Faculty@2024',
            'student1@ccs.edu' => 'Student@2024',
            'student2@ccs.edu' => 'Student@2024',
            'inactive@ccs.edu' => 'Inactive@2024',
            'suspended@ccs.edu' => 'Suspended@2024',
        ];

        $count = 0;
        
        foreach ($defaultPasswords as $email => $password) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                $user->password = Hash::make($password);
                $user->save();
                $count++;
                $this->info("Rehashed password for: {$email}");
            }
        }

        $this->info("\nSuccessfully rehashed {$count} passwords!");
        $this->info('All passwords now use bcrypt rounds: ' . config('hashing.bcrypt.rounds'));
        
        return 0;
    }
}

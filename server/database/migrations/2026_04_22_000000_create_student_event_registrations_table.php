<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->enum('attendance_status', ['registered', 'attended', 'absent', 'cancelled'])->default('registered');
            $table->foreignId('registered_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Prevent duplicate registrations
            $table->unique(['student_id', 'event_id']);
            
            // Add indexes for faster queries
            $table->index('student_id');
            $table->index('event_id');
            $table->index('attendance_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_event_registrations');
    }
};

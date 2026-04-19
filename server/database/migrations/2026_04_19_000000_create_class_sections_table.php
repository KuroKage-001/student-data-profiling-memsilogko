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
        Schema::create('class_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_code', 20);
            $table->string('course_code', 20);
            $table->string('course_name');
            $table->string('room', 50)->nullable();
            $table->enum('day_of_week', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->string('semester', 50);
            $table->string('academic_year', 20);
            $table->integer('max_capacity')->default(40);
            $table->integer('current_enrollment')->default(0);
            $table->enum('status', ['active', 'cancelled', 'completed'])->default('active');
            $table->timestamps();

            // Indexes for better query performance
            $table->index('course_code');
            $table->index('day_of_week');
            $table->index('semester');
            $table->index('status');
            
            // Unique constraint to prevent duplicate sections
            $table->unique(['section_code', 'course_code', 'semester', 'academic_year'], 'unique_section');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_sections');
    }
};

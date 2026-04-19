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
        Schema::create('student_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('class_section_id')->constrained('class_sections')->onDelete('cascade');
            $table->enum('enrollment_status', ['enrolled', 'dropped', 'completed'])->default('enrolled');
            $table->date('enrollment_date');
            $table->date('drop_date')->nullable();
            $table->decimal('grade', 4, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for better query performance
            $table->index('user_id');
            $table->index('class_section_id');
            $table->index('enrollment_status');
            
            // Unique constraint to prevent duplicate enrollments
            $table->unique(['user_id', 'class_section_id'], 'unique_enrollment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_enrollments');
    }
};

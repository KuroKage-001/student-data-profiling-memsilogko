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
        Schema::create('faculty_class_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->constrained('faculty')->onDelete('cascade');
            $table->foreignId('class_section_id')->constrained('class_sections')->onDelete('cascade');
            $table->enum('assignment_type', ['primary', 'co-instructor', 'assistant'])->default('primary');
            $table->date('assigned_date');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // Indexes
            $table->index('faculty_id');
            $table->index('class_section_id');
            $table->index('status');
            
            // Unique constraint to prevent duplicate assignments
            $table->unique(['faculty_id', 'class_section_id'], 'unique_faculty_class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_class_assignments');
    }
};

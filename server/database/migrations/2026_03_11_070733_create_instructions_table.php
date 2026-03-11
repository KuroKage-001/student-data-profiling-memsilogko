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
        Schema::create('instructions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['syllabus', 'curriculum', 'lesson']); // Type of instruction
            $table->string('course_code')->nullable();
            $table->string('course_name');
            $table->string('department');
            $table->string('instructor')->nullable();
            $table->string('academic_year')->nullable();
            $table->string('semester')->nullable(); // 1st, 2nd, Summer
            $table->integer('units')->nullable();
            $table->text('learning_outcomes')->nullable();
            $table->string('file_url')->nullable();
            $table->json('topics')->nullable();
            $table->enum('status', ['active', 'draft', 'archived'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructions');
    }
};

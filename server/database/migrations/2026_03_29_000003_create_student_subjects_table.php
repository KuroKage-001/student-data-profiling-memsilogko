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
        Schema::create('student_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_record_id')->constrained('student_academic_records')->onDelete('cascade');
            $table->string('subject_code', 20)->nullable();
            $table->string('subject_name');
            $table->decimal('units', 3, 1);
            $table->decimal('grade', 4, 2)->nullable();
            $table->timestamps();

            // Add index for faster queries
            $table->index('academic_record_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_subjects');
    }
};

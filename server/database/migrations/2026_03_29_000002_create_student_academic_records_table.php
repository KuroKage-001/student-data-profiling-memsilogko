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
        Schema::create('student_academic_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('semester', 20);
            $table->string('academic_year', 20);
            $table->decimal('semester_gpa', 3, 2)->nullable();
            $table->string('remarks', 255)->nullable();
            $table->timestamps();

            // Add index for faster queries
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_academic_records');
    }
};

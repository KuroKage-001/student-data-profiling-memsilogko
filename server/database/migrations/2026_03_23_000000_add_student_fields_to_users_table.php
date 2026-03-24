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
        Schema::table('users', function (Blueprint $table) {
            // Student-specific fields
            $table->string('student_id')->nullable()->after('id');
            $table->string('phone')->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->string('program')->nullable()->after('address');
            $table->string('year_level')->nullable()->after('program');
            $table->decimal('gpa', 3, 2)->nullable()->after('year_level');
            $table->date('enrollment_date')->nullable()->after('gpa');
            $table->date('graduation_date')->nullable()->after('enrollment_date');
            $table->string('guardian_name')->nullable()->after('graduation_date');
            $table->string('guardian_phone')->nullable()->after('guardian_name');
            $table->text('notes')->nullable()->after('guardian_phone');
            
            // Add index for student_id
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'student_id',
                'phone',
                'address',
                'program',
                'year_level',
                'gpa',
                'enrollment_date',
                'graduation_date',
                'guardian_name',
                'guardian_phone',
                'notes'
            ]);
        });
    }
};
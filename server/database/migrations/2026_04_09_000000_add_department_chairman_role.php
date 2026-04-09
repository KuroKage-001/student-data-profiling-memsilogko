<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the role enum to include dept_chair
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'faculty', 'student', 'dept_chair') DEFAULT 'student'");
        
        // Add department column for department chairmen
        Schema::table('users', function (Blueprint $table) {
            $table->enum('department', ['IT', 'CS'])->nullable()->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('department');
        });
        
        // Revert the role enum back to original
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'faculty', 'student') DEFAULT 'student'");
    }
};

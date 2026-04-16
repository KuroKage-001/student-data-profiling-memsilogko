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
        // Modify the role to include dept_chair
        if (DB::getDriverName() === 'pgsql') {
            // PostgreSQL: Drop old constraint and add new one
            DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'faculty', 'student', 'dept_chair'))");
        } else {
            // MySQL: Modify enum
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'faculty', 'student', 'dept_chair') DEFAULT 'student'");
        }
        
        // Add department column - using string instead of enum for flexibility
        Schema::table('users', function (Blueprint $table) {
            $table->string('department', 100)->nullable()->after('role');
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
        
        // Revert the role back to original
        if (DB::getDriverName() === 'pgsql') {
            // PostgreSQL: Drop and recreate constraint
            DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'faculty', 'student'))");
        } else {
            // MySQL: Modify enum
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'faculty', 'student') DEFAULT 'student'");
        }
    }
};

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
            // Use string with check constraint for PostgreSQL compatibility
            if (DB::getDriverName() === 'pgsql') {
                $table->string('role', 20)->default('student')->after('email');
                $table->string('status', 20)->default('active')->after('role');
                
                // Add check constraints for PostgreSQL
                DB::statement("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'faculty', 'student'))");
                DB::statement("ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended'))");
            } else {
                // MySQL enum
                $table->enum('role', ['admin', 'faculty', 'student'])->default('student')->after('email');
                $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('role');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'status']);
        });
        
        // Drop constraints for PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            DB::statement("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check");
        }
    }
};

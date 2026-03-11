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
        Schema::create('research_materials', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('author');
            $table->string('faculty_department');
            $table->string('research_type'); // thesis, dissertation, journal, conference paper, etc.
            $table->year('publication_year');
            $table->string('file_url')->nullable();
            $table->string('external_link')->nullable();
            $table->json('keywords')->nullable();
            $table->enum('status', ['published', 'draft', 'archived'])->default('published');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_materials');
    }
};

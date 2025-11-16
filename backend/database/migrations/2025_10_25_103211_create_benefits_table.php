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
        Schema::create('benefits', function (Blueprint $table) {
            $table->id();

            // Bilingual titles
            $table->string('title')->nullable(); // legacy field kept nullable
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();

            // Bilingual descriptions
            $table->text('description')->nullable(); // legacy field kept nullable
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();

            // Other fields
            $table->string('icon')->nullable();
            $table->enum('language', ['ar', 'en'])->nullable(); // legacy field but nullable now
            $table->json('target_pages')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);

            $table->timestamps();

            $table->index(['is_active', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benefits');
    }
};

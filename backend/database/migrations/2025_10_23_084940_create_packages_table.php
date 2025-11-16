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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();

            // Language for legacy packages (ar/en)
            $table->string('language')->default('ar');

            // Legacy fields but nullable since bilingual is used now
            $table->string('name')->nullable();
            $table->text('description')->nullable();

            // ✅ Bilingual fields
            $table->string('name_ar')->nullable();
            $table->string('name_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();

            // Speed / price / package info
            $table->string('speed');
            $table->string('speed_unit');
            $table->integer('download_speed')->nullable();
            $table->integer('upload_speed')->nullable();
            $table->string('price');

            // Flags
            $table->enum('type', ['home', 'business'])->default('home');
            $table->boolean('popular')->default(false);
            $table->boolean('premium')->default(false);
            $table->boolean('is_active')->default(true);

            // Display order
            $table->integer('order')->default(0);

            // Features
            $table->json('features')->nullable();
            $table->json('features_ar')->nullable();
            $table->json('features_en')->nullable();
            $table->timestamps();

            // Useful indexes
            $table->index(['is_active', 'order']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

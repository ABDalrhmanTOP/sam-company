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
        Schema::create('premium_services', function (Blueprint $table) {
            $table->id();

            // Names
            $table->string('name'); // Arabic name
            $table->string('name_en')->nullable(); // English name

            // Descriptions
            $table->text('description'); // Arabic description
            $table->text('description_en')->nullable(); // English description

            // Pricing
            $table->decimal('price', 10, 2); // Price in Syrian Pounds

            // Features JSON
            $table->json('features')->nullable(); // Default features field
            $table->json('features_ar')->nullable(); // Arabic features
            $table->json('features_en')->nullable(); // English features

            // Additional Info
            $table->boolean('is_active')->default(true); // Service status
            $table->string('category'); // Service category
            $table->string('icon')->default('Star'); // Icon name
            $table->string('color')->default('primary'); // Color theme
            $table->integer('order')->default(0); // Display order

            $table->timestamps();

            // Indexes
            $table->index(['is_active', 'order']);
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('premium_services');
    }
};



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
        Schema::create('speed_test_settings', function (Blueprint $table) {
            $table->id();
            $table->string('api_name'); // Name of the API provider (e.g., 'speedtest', 'fast', 'cloudflare')
            $table->string('api_url'); // API endpoint URL
            $table->string('api_key')->nullable(); // Optional API key
            $table->boolean('is_default')->default(false); // Mark as default API
            $table->boolean('is_active')->default(true); // Enable/disable this API
            $table->integer('order')->default(0); // Display order
            $table->text('description')->nullable(); // Additional info
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('speed_test_settings');
    }
};

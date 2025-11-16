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
        Schema::create('contact_info', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // phone, email, address, whatsapp, etc.
            $table->string('label_ar'); // Arabic label
            $table->string('label_en'); // English label
            $table->string('value'); // Phone number, email, address, etc.
            $table->string('icon')->nullable(); // Icon name
            $table->string('link')->nullable(); // For links (WhatsApp, phone calls, etc.)
            $table->integer('order')->default(0); // Display order
            $table->boolean('is_active')->default(true); // Enable/disable
            $table->text('description_ar')->nullable(); // Optional description in Arabic
            $table->text('description_en')->nullable(); // Optional description in English
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_info');
    }
};

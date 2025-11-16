<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            // bilingual fields
            $table->text('text_ar');
            $table->text('text_en');
            $table->string('cta_ar')->nullable();
            $table->string('cta_en')->nullable();
            $table->boolean('is_active')->default(true);
            $table->date('date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};

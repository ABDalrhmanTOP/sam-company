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
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            $table->string('badge_ar')->nullable();
            $table->string('badge_en')->nullable();
            $table->string('title_ar')->nullable();
            $table->string('title_en')->nullable();
            $table->string('subtitle_ar')->nullable();
            $table->string('subtitle_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->string('subscribe_cta_ar')->nullable();
            $table->string('subscribe_cta_en')->nullable();
            $table->string('speed_test_cta_ar')->nullable();
            $table->string('speed_test_cta_en')->nullable();
            $table->string('trust_badge_ar')->nullable();
            $table->string('trust_badge_en')->nullable();

            // Stats
            $table->string('customers_label_ar')->nullable();
            $table->string('customers_label_en')->nullable();
            $table->string('customers_count')->nullable();
            $table->string('speed_label_ar')->nullable();
            $table->string('speed_label_en')->nullable();
            $table->string('speed_value')->nullable();
            $table->string('uptime_label_ar')->nullable();
            $table->string('uptime_label_en')->nullable();
            $table->string('uptime_value')->nullable();
            $table->string('support_label_ar')->nullable();
            $table->string('support_label_en')->nullable();
            $table->string('support_value')->nullable();

            // Background settings
            $table->string('background_type')->default('gradient'); // gradient, image, video
            $table->string('background_image')->nullable();
            $table->string('background_video')->nullable();
            $table->json('gradient_colors')->nullable(); // Array of gradient colors

            // Layout settings
            $table->boolean('show_stats')->default(true);
            $table->boolean('show_trust_badge')->default(true);
            $table->boolean('show_cta_buttons')->default(true);
            $table->string('layout_style')->default('split'); // split, centered, left, right

            // Animation settings
            $table->boolean('enable_animations')->default(true);
            $table->json('animation_settings')->nullable(); // Custom animation settings

            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};

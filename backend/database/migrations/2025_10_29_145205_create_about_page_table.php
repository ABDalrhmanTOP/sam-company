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
        Schema::create('about_page', function (Blueprint $table) {
            $table->id();

            // Hero Section
            $table->string('badge_ar')->nullable();
            $table->string('badge_en')->nullable();
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            $table->string('subtitle_ar');
            $table->string('subtitle_en')->nullable();
            $table->text('description_ar');
            $table->text('description_en')->nullable();

            // Stats
            $table->string('stats_title_ar')->nullable();
            $table->string('stats_title_en')->nullable();
            $table->string('customers_count')->nullable();
            $table->string('customers_label_ar')->nullable();
            $table->string('customers_label_en')->nullable();
            $table->string('coverage_count')->nullable();
            $table->string('coverage_label_ar')->nullable();
            $table->string('coverage_label_en')->nullable();
            $table->string('uptime_count')->nullable();
            $table->string('uptime_label_ar')->nullable();
            $table->string('uptime_label_en')->nullable();
            $table->string('support_count')->nullable();
            $table->string('support_label_ar')->nullable();
            $table->string('support_label_en')->nullable();

            // Story Section
            $table->string('our_story_title_ar')->nullable();
            $table->string('our_story_title_en')->nullable();
            $table->text('our_story_p1_ar')->nullable();
            $table->text('our_story_p1_en')->nullable();
            $table->text('our_story_p2_ar')->nullable();
            $table->text('our_story_p2_en')->nullable();

            // Mission & Vision
            $table->string('mission_title_ar')->nullable();
            $table->string('mission_title_en')->nullable();
            $table->text('mission_text_ar')->nullable();
            $table->text('mission_text_en')->nullable();
            $table->string('vision_title_ar')->nullable();
            $table->string('vision_title_en')->nullable();
            $table->text('vision_text_ar')->nullable();
            $table->text('vision_text_en')->nullable();

            // Values
            $table->string('values_title_ar')->nullable();
            $table->string('values_title_en')->nullable();
            $table->string('value1_title_ar')->nullable();
            $table->string('value1_title_en')->nullable();
            $table->text('value1_description_ar')->nullable();
            $table->text('value1_description_en')->nullable();
            $table->string('value2_title_ar')->nullable();
            $table->string('value2_title_en')->nullable();
            $table->text('value2_description_ar')->nullable();
            $table->text('value2_description_en')->nullable();
            $table->string('value3_title_ar')->nullable();
            $table->string('value3_title_en')->nullable();
            $table->text('value3_description_ar')->nullable();
            $table->text('value3_description_en')->nullable();
            $table->string('value4_title_ar')->nullable();
            $table->string('value4_title_en')->nullable();
            $table->text('value4_description_ar')->nullable();
            $table->text('value4_description_en')->nullable();

            // CTA Section
            $table->string('cta_title_ar')->nullable();
            $table->string('cta_title_en')->nullable();
            $table->text('cta_description_ar')->nullable();
            $table->text('cta_description_en')->nullable();
            $table->string('start_project_ar')->nullable();
            $table->string('start_project_en')->nullable();
            $table->string('view_services_ar')->nullable();
            $table->string('view_services_en')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('about_page');
    }
};

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    protected $table = 'about_page';

    protected $fillable = [
        // Hero Section
        'badge_ar',
        'badge_en',
        'title_ar',
        'title_en',
        'subtitle_ar',
        'subtitle_en',
        'description_ar',
        'description_en',

        // Stats
        'stats_title_ar',
        'stats_title_en',
        'customers_count',
        'customers_label_ar',
        'customers_label_en',
        'coverage_count',
        'coverage_label_ar',
        'coverage_label_en',
        'uptime_count',
        'uptime_label_ar',
        'uptime_label_en',
        'support_count',
        'support_label_ar',
        'support_label_en',

        // Story Section
        'our_story_title_ar',
        'our_story_title_en',
        'our_story_p1_ar',
        'our_story_p1_en',
        'our_story_p2_ar',
        'our_story_p2_en',

        // Mission & Vision
        'mission_title_ar',
        'mission_title_en',
        'mission_text_ar',
        'mission_text_en',
        'vision_title_ar',
        'vision_title_en',
        'vision_text_ar',
        'vision_text_en',

        // Values
        'values_title_ar',
        'values_title_en',
        'value1_title_ar',
        'value1_title_en',
        'value1_description_ar',
        'value1_description_en',
        'value2_title_ar',
        'value2_title_en',
        'value2_description_ar',
        'value2_description_en',
        'value3_title_ar',
        'value3_title_en',
        'value3_description_ar',
        'value3_description_en',
        'value4_title_ar',
        'value4_title_en',
        'value4_description_ar',
        'value4_description_en',

        // CTA Section
        'cta_title_ar',
        'cta_title_en',
        'cta_description_ar',
        'cta_description_en',
        'start_project_ar',
        'start_project_en',
        'view_services_ar',
        'view_services_en',
    ];
}

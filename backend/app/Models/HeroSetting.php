<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'badge_ar',
        'badge_en',
        'title_ar',
        'title_en',
        'subtitle_ar',
        'subtitle_en',
        'description_ar',
        'description_en',
        'subscribe_cta_ar',
        'subscribe_cta_en',
        'speed_test_cta_ar',
        'speed_test_cta_en',
        'trust_badge_ar',
        'trust_badge_en',
        'customers_label_ar',
        'customers_label_en',
        'customers_count',
        'speed_label_ar',
        'speed_label_en',
        'speed_value',
        'uptime_label_ar',
        'uptime_label_en',
        'uptime_value',
        'support_label_ar',
        'support_label_en',
        'support_value',
        'background_type',
        'background_image',
        'background_video',
        'gradient_colors',
        'show_stats',
        'show_trust_badge',
        'show_cta_buttons',
        'layout_style',
        'enable_animations',
        'animation_settings',
        'is_active',
        'order',
    ];

    protected $casts = [
        'gradient_colors' => 'array',
        'animation_settings' => 'array',
        'show_stats' => 'boolean',
        'show_trust_badge' => 'boolean',
        'show_cta_buttons' => 'boolean',
        'enable_animations' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    // Accessor for localized badge
    public function getBadgeAttribute($value)
    {
        return app()->getLocale() === 'en' && $this->badge_en ? $this->badge_en : $this->badge_ar;
    }

    // Accessor for localized title
    public function getTitleAttribute($value)
    {
        return app()->getLocale() === 'en' && $this->title_en ? $this->title_en : $this->title_ar;
    }

    // Accessor for localized subtitle
    public function getSubtitleAttribute($value)
    {
        return app()->getLocale() === 'en' && $this->subtitle_en ? $this->subtitle_en : $this->subtitle_ar;
    }

    // Accessor for localized description
    public function getDescriptionAttribute($value)
    {
        return app()->getLocale() === 'en' && $this->description_en ? $this->description_en : $this->description_ar;
    }

    // Scope for active settings
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Get the primary hero setting (first active one)
    public static function getPrimary()
    {
        return self::active()->orderBy('order')->first();
    }
}

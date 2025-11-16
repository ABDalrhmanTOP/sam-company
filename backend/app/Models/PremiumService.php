<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PremiumService extends Model
{
    protected $table = 'premium_services';

    protected $fillable = [
        'name',
        'name_en',
        'description',
        'description_en',
        'price',
        'features',
        'features_ar',
        'features_en',
        'is_active',
        'category',
        'icon',
        'color',
        'order',
    ];

    protected $casts = [
        'features' => 'array',
        'features_ar' => 'array',
        'features_en' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'order' => 'integer',
    ];

    /**
     * Scope for active services
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordering by order field
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at', 'desc');
    }

    /**
     * Scope for filtering by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get localized name based on locale
     */
    public function getLocalizedNameAttribute()
    {
        return app()->getLocale() === 'en' && $this->name_en
            ? $this->name_en
            : $this->name;
    }

    /**
     * Get localized description based on locale
     */
    public function getLocalizedDescriptionAttribute()
    {
        return app()->getLocale() === 'en' && $this->description_en
            ? $this->description_en
            : $this->description;
    }

    /**
     * Format price with currency
     */
    public function getFormattedPriceAttribute()
    {
        return number_format($this->price, 0) . ' ل.س';
    }
}








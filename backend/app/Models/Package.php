<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'price',
        'speed',
        'speed_unit',
        'features',
        'features_ar',
        'features_en',
        'type',
        'is_active',
        'order',
        'popular',
    ];

    protected $casts = [
        'features' => 'array',
        'features_ar' => 'array',
        'features_en' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'order' => 'integer',
    ];
}

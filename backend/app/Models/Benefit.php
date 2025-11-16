<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Benefit extends Model
{
    protected $fillable = [
        'title',
        'title_ar',
        'title_en',
        'description',
        'description_ar',
        'description_en',
        'icon',
        'language',
        'target_pages',
        'is_active',
        'order',
    ];

    protected $casts = [
        'target_pages' => 'array',
        'is_active' => 'boolean',
    ];
}

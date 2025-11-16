<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportInfo extends Model
{
    protected $table = 'support_info';

    protected $fillable = [
        'title_ar',
        'title_en',
        'description_ar',
        'description_en',
        'icon',
        'type',
        'value',
        'link',
        'is_active',
        'order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}

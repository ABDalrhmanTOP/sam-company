<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpeedTestSetting extends Model
{
    protected $table = 'speed_test_settings';

    protected $fillable = [
        'api_name',
        'api_url',
        'api_key',
        'is_default',
        'is_active',
        'order',
        'description',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}

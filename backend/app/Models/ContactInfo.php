<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInfo extends Model
{
    protected $table = 'contact_info';

    protected $fillable = [
        'type',
        'label_ar',
        'label_en',
        'value',
        'icon',
        'link',
        'order',
        'is_active',
        'description_ar',
        'description_en',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}

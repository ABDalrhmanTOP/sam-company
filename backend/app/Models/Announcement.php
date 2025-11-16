<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'text_ar',
        'text_en',
        'cta_ar',
        'cta_en',
        'is_active',
        'date',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'date' => 'date',
    ];
}

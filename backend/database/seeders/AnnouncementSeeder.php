<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        // Guaranteed active bilingual announcement
        Announcement::create([
            'text_ar' => 'عرض اليوم: إنترنت فايبر بسرعة 1000 ميجا بسعر مميز',
            'text_en' => 'Today offer: Fiber 1000 Mbps at a special price',
            'cta_ar' => 'اشترك الآن',
            'cta_en' => 'Subscribe Now',
            'is_active' => true,
            'date' => now()->toDateString(),
        ]);

        // Additional fake announcements
        Announcement::factory()->count(4)->create();
    }
}

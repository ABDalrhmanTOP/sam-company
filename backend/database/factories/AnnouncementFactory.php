<?php

namespace Database\Factories;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Announcement> */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        return [
            'text_ar' => $this->faker->randomElement([
                'عرض تجريبي اليوم فقط! إنترنت أسرع بسعر أقل',
                'ترقية مجانية للسرعة لمدة شهر',
                'اشترك الآن وتمتع بإنترنت بلا حدود',
            ]),
            'text_en' => $this->faker->randomElement([
                'Limited time: Fiber promo!',
                'Free speed upgrade for a month',
                'Subscribe now and enjoy unlimited internet',
            ]),
            'cta_ar' => $this->faker->randomElement(['اشترك الآن', 'اعرف المزيد', null]),
            'cta_en' => $this->faker->randomElement(['Subscribe', 'Learn More', null]),
            'is_active' => $this->faker->boolean(60),
            'date' => $this->faker->optional()->date(),
        ];
    }
}

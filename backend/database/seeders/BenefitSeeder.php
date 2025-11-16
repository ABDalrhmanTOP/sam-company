<?php

namespace Database\Seeders;

use App\Models\Benefit;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class BenefitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $benefits = [
            // Home Internet Benefits
            [
                'title_ar' => 'ألياف ضوئية عالية السرعة',
                'title_en' => 'High-Speed Fiber Optic',
                'description_ar' => 'تقنية الألياف الضوئية لأسرع إنترنت في سوريا',
                'description_en' => 'Fiber optic technology for the fastest internet in Syria',
                'icon' => 'wifi',
                'target_pages' => ['home-internet'],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title_ar' => 'دعم فني 24/7',
                'title_en' => '24/7 Technical Support',
                'description_ar' => 'فريق دعم فني متاح على مدار الساعة',
                'description_en' => 'Technical support team available around the clock',
                'icon' => 'headphones',
                'target_pages' => ['home-internet'],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title_ar' => 'استخدام غير محدود',
                'title_en' => 'Unlimited Usage',
                'description_ar' => 'تصفح وحركة بيانات غير محدودة',
                'description_en' => 'Unlimited browsing and data transfer',
                'icon' => 'zap',
                'target_pages' => ['home-internet'],
                'is_active' => true,
                'order' => 3,
            ],

            // Business Internet Benefits
            [
                'title_ar' => 'شبكة آمنة للشركات',
                'title_en' => 'Secure Business Network',
                'description_ar' => 'شبكة مخصصة وآمنة للشركات',
                'description_en' => 'Dedicated and secure network for businesses',
                'icon' => 'shield',
                'target_pages' => ['business-internet'],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title_ar' => 'اتصال مخصص',
                'title_en' => 'Dedicated Connection',
                'description_ar' => 'اتصال مخصص بسرعة مضمونة',
                'description_en' => 'Dedicated connection with guaranteed speed',
                'icon' => 'network',
                'target_pages' => ['business-internet'],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title_ar' => 'دعم متخصص',
                'title_en' => 'Expert Support',
                'description_ar' => 'دعم فني متخصص للشركات',
                'description_en' => 'Expert technical support for businesses',
                'icon' => 'users',
                'target_pages' => ['business-internet'],
                'is_active' => true,
                'order' => 3,
            ],

            // Support Page Benefits
            [
                'title_ar' => 'دعم فني متاح دائماً',
                'title_en' => 'Always Available Support',
                'description_ar' => 'فريق دعم جاهز لمساعدتك في أي وقت',
                'description_en' => 'Support team ready to help you anytime',
                'icon' => 'headphones',
                'target_pages' => ['support'],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title_ar' => 'استجابة سريعة',
                'title_en' => 'Fast Response',
                'description_ar' => 'نضمن استجابة سريعة لاستفساراتك',
                'description_en' => 'We guarantee fast response to your inquiries',
                'icon' => 'clock',
                'target_pages' => ['support'],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title_ar' => 'حلول مخصصة',
                'title_en' => 'Custom Solutions',
                'description_ar' => 'نوفر حلول مخصصة لمشاكلك',
                'description_en' => 'We provide custom solutions for your problems',
                'icon' => 'star',
                'target_pages' => ['support'],
                'is_active' => true,
                'order' => 3,
            ],

            // About Page Benefits
            [
                'title_ar' => 'خبرة طويلة',
                'title_en' => 'Long Experience',
                'description_ar' => 'سنوات من الخبرة في مجال الإنترنت',
                'description_en' => 'Years of experience in the internet field',
                'icon' => 'award',
                'target_pages' => ['about'],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title_ar' => 'فريق محترف',
                'title_en' => 'Professional Team',
                'description_ar' => 'فريق من الخبراء والمحترفين',
                'description_en' => 'Team of experts and professionals',
                'icon' => 'users',
                'target_pages' => ['about'],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title_ar' => 'التزام بالجودة',
                'title_en' => 'Quality Commitment',
                'description_ar' => 'نلتزم بأعلى معايير الجودة',
                'description_en' => 'We commit to the highest quality standards',
                'icon' => 'star',
                'target_pages' => ['about'],
                'is_active' => true,
                'order' => 3,
            ],

            // Home Page Benefits
            [
                'title_ar' => 'سرعة فائقة',
                'title_en' => 'Ultra-Fast Speed',
                'description_ar' => 'إنترنت بسرعات فائقة',
                'description_en' => 'Internet with ultra-fast speeds',
                'icon' => 'zap',
                'target_pages' => ['home'],
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title_ar' => 'أسعار منافسة',
                'title_en' => 'Competitive Prices',
                'description_ar' => 'أفضل الأسعار في السوق',
                'description_en' => 'Best prices in the market',
                'icon' => 'dollar-sign',
                'target_pages' => ['home'],
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title_ar' => 'خدمة موثوقة',
                'title_en' => 'Reliable Service',
                'description_ar' => 'خدمة موثوقة ومضمونة',
                'description_en' => 'Reliable and guaranteed service',
                'icon' => 'shield',
                'target_pages' => ['home'],
                'is_active' => true,
                'order' => 3,
            ],
        ];

        foreach ($benefits as $benefit) {
            Benefit::create($benefit);
        }
    }
}

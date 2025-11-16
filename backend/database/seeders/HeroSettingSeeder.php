<?php

namespace Database\Seeders;

use App\Models\HeroSetting;
use Illuminate\Database\Seeder;

class HeroSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $heroSettings = [
            [
                'badge_ar' => 'المزود الرائد للإنترنت في سوريا',
                'badge_en' => 'Syria\'s Leading Internet Provider',
                'title_ar' => 'إنترنت فائق السرعة',
                'title_en' => 'Ultra-Fast Internet',
                'subtitle_ar' => 'لحياة رقمية بلا حدود',
                'subtitle_en' => 'For Unlimited Digital Life',
                'description_ar' => 'استمتع بتجربة إنترنت استثنائية مع تقنية الألياف الضوئية المتطورة. سرعات تصل إلى 1 جيجابت، استقرار مضمون 99.9%، ودعم فني احترافي متواصل على مدار الساعة.',
                'description_en' => 'Experience exceptional internet with advanced fiber optic technology. Speeds up to 1 Gbps, guaranteed 99.9% uptime, and professional 24/7 technical support.',
                'subscribe_cta_ar' => 'ابدأ الآن',
                'subscribe_cta_en' => 'Get Started',
                'speed_test_cta_ar' => 'اختبر سرعتك',
                'speed_test_cta_en' => 'Test Your Speed',
                'trust_badge_ar' => 'موثوق من قبل +50,000 عميل',
                'trust_badge_en' => 'Trusted by +50,000 customers',
                'customers_label_ar' => 'عميل سعيد',
                'customers_label_en' => 'Happy Customers',
                'customers_count' => '50,000+',
                'speed_label_ar' => 'سرعة قصوى',
                'speed_label_en' => 'Max Speed',
                'speed_value' => '1 جيجابت',
                'uptime_label_ar' => 'جاهزية الخدمة',
                'uptime_label_en' => 'Service Uptime',
                'uptime_value' => '99.9%',
                'support_label_ar' => 'دعم فني',
                'support_label_en' => 'Support',
                'support_value' => '24/7',
                'background_type' => 'gradient',
                'gradient_colors' => [
                    'primary' => '#a01810',
                    'secondary' => '#c01810',
                    'accent' => '#ff6b35'
                ],
                'show_stats' => true,
                'show_trust_badge' => true,
                'show_cta_buttons' => true,
                'layout_style' => 'split',
                'enable_animations' => true,
                'animation_settings' => [
                    'glow_animation' => true,
                    'pulse_animation' => true,
                    'hover_effects' => true
                ],
                'is_active' => true,
                'order' => 1
            ],
            [
                'badge_ar' => 'الحل الأمثل للإنترنت',
                'badge_en' => 'The Perfect Internet Solution',
                'title_ar' => 'إنترنت ذكي',
                'title_en' => 'Smart Internet',
                'subtitle_ar' => 'للمستقبل الرقمي',
                'subtitle_en' => 'For Digital Future',
                'description_ar' => 'تقنية متطورة تواكب احتياجاتك الرقمية مع سرعات فائقة وموثوقية عالية. حلول مخصصة للأفراد والشركات.',
                'description_en' => 'Advanced technology that meets your digital needs with ultra-fast speeds and high reliability. Custom solutions for individuals and businesses.',
                'subscribe_cta_ar' => 'اكتشف المزيد',
                'subscribe_cta_en' => 'Discover More',
                'speed_test_cta_ar' => 'قياس الأداء',
                'speed_test_cta_en' => 'Measure Performance',
                'trust_badge_ar' => 'مختبر من قبل الخبراء',
                'trust_badge_en' => 'Tested by Experts',
                'customers_label_ar' => 'عملاء راضون',
                'customers_label_en' => 'Satisfied Customers',
                'customers_count' => '25,000+',
                'speed_label_ar' => 'سرعة مضمونة',
                'speed_label_en' => 'Guaranteed Speed',
                'speed_value' => '500 ميجا',
                'uptime_label_ar' => 'استقرار الخدمة',
                'uptime_label_en' => 'Service Stability',
                'uptime_value' => '99.8%',
                'support_label_ar' => 'مساعدة فورية',
                'support_label_en' => 'Instant Help',
                'support_value' => '12/7',
                'background_type' => 'gradient',
                'gradient_colors' => [
                    'primary' => '#1e40af',
                    'secondary' => '#3b82f6',
                    'accent' => '#60a5fa'
                ],
                'show_stats' => true,
                'show_trust_badge' => true,
                'show_cta_buttons' => true,
                'layout_style' => 'centered',
                'enable_animations' => true,
                'animation_settings' => [
                    'glow_animation' => false,
                    'pulse_animation' => true,
                    'hover_effects' => true
                ],
                'is_active' => false,
                'order' => 2
            ]
        ];

        foreach ($heroSettings as $setting) {
            HeroSetting::create($setting);
        }
    }
}

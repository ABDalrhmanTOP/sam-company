<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Home Internet Packages (الباقات المنزلية)
        $homePackages = [
            [
                'name_ar' => 'الأساسية',
                'name_en' => 'Basic',
                'description_ar' => 'مثالية للاستخدام اليومي',
                'description_en' => 'Perfect for daily use',
                'speed' => '100',
                'speed_unit' => 'ميجا',
                'price' => '350000',
                'type' => 'home',
                'popular' => false,
                'is_active' => true,
                'order' => 1,
                'features' => [
                    'تصفح سريع ومستقر',
                    'مشاهدة HD',
                    '2-3 أجهزة',
                    'راوتر مجاني',
                    'تركيب مجاني'
                ],
                'features_ar' => [
                    'تصفح سريع ومستقر',
                    'مشاهدة HD',
                    '2-3 أجهزة',
                    'راوتر مجاني',
                    'تركيب مجاني'
                ],
                'features_en' => [
                    'Fast and stable browsing',
                    'HD viewing',
                    '2-3 devices',
                    'Free router',
                    'Free installation'
                ],
            ],
            [
                'name_ar' => 'العائلية',
                'name_en' => 'Family',
                'description_ar' => 'الأفضل للعائلات',
                'description_en' => 'Best for families',
                'speed' => '300',
                'speed_unit' => 'ميجا',
                'price' => '700000',
                'type' => 'home',
                'popular' => true,
                'is_active' => true,
                'order' => 2,
                'features' => [
                    'سرعة فائقة',
                    'مشاهدة 4K',
                    '5-7 أجهزة',
                    'ألعاب بدون تأخير',
                    'دعم 24/7'
                ],
                'features_ar' => [
                    'سرعة فائقة',
                    'مشاهدة 4K',
                    '5-7 أجهزة',
                    'ألعاب بدون تأخير',
                    'دعم 24/7'
                ],
                'features_en' => [
                    'Ultra-fast speed',
                    '4K viewing',
                    '5-7 devices',
                    'Gaming without lag',
                    '24/7 support'
                ],
            ],
            [
                'name_ar' => 'المميزة',
                'name_en' => 'Premium',
                'description_ar' => 'قوة وأداء استثنائي',
                'description_en' => 'Exceptional power & performance',
                'speed' => '1',
                'speed_unit' => 'جيجابت',
                'price' => '1400000',
                'type' => 'home',
                'popular' => false,
                'is_active' => true,
                'order' => 3,
                'features' => [
                    'سرعة جيجابت كاملة',
                    'أجهزة غير محدودة',
                    'راوتر متطور',
                    'دعم VIP',
                    'أولوية الخدمة'
                ],
                'features_ar' => [
                    'سرعة جيجابت كاملة',
                    'أجهزة غير محدودة',
                    'راوتر متطور',
                    'دعم VIP',
                    'أولوية الخدمة'
                ],
                'features_en' => [
                    'Full gigabit speed',
                    'Unlimited devices',
                    'Advanced router',
                    'VIP support',
                    'Service priority'
                ],
            ],
        ];

        // Business Internet Packages (باقات الشركات)
        $businessPackages = [
            [
                'name_ar' => 'الشركات الصغيرة',
                'name_en' => 'Small Business',
                'description_ar' => 'مثالية للشركات الناشئة',
                'description_en' => 'Ideal for startups',
                'speed' => '500',
                'speed_unit' => 'ميجا',
                'price' => '1750000',
                'type' => 'business',
                'popular' => false,
                'is_active' => true,
                'order' => 1,
                'features' => [
                    'سرعة 500 ميجا مضمونة',
                    'IP ثابت مجاني',
                    'دعم VIP',
                    'SLA 99.9%',
                    'أولوية الخدمة',
                    'تقارير شهرية'
                ],
                'features_ar' => [
                    'سرعة 500 ميجا مضمونة',
                    'IP ثابت مجاني',
                    'دعم VIP',
                    'SLA 99.9%',
                    'أولوية الخدمة',
                    'تقارير شهرية'
                ],
                'features_en' => [
                    'Guaranteed 500 Mbps speed',
                    'Free static IP',
                    'VIP support',
                    '99.9% SLA',
                    'Service priority',
                    'Monthly reports'
                ],
            ],
            [
                'name_ar' => 'الشركات المتوسطة',
                'name_en' => 'Medium Business',
                'description_ar' => 'للشركات المتنامية',
                'description_en' => 'For growing companies',
                'speed' => '1',
                'speed_unit' => 'جيجابت',
                'price' => '3500000',
                'type' => 'business',
                'popular' => true,
                'is_active' => true,
                'order' => 2,
                'features' => [
                    'سرعة جيجابت كاملة',
                    'عدة IP ثابتة',
                    'دعم مخصص 24/7',
                    'SLA مضمون',
                    'تركيب احترافي',
                    'تقارير أسبوعية',
                    'نسخ احتياطي',
                    'حماية متقدمة'
                ],
                'features_ar' => [
                    'سرعة جيجابت كاملة',
                    'عدة IP ثابتة',
                    'دعم مخصص 24/7',
                    'SLA مضمون',
                    'تركيب احترافي',
                    'تقارير أسبوعية',
                    'نسخ احتياطي',
                    'حماية متقدمة'
                ],
                'features_en' => [
                    'Full gigabit speed',
                    'Multiple static IPs',
                    'Dedicated 24/7 support',
                    'Guaranteed SLA',
                    'Professional installation',
                    'Weekly reports',
                    'Backup',
                    'Advanced protection'
                ],
            ],
            [
                'name_ar' => 'المؤسسات الكبرى',
                'name_en' => 'Enterprise',
                'description_ar' => 'حلول متكاملة',
                'description_en' => 'Complete solutions',
                'speed' => 'حسب الطلب',
                'speed_unit' => '',
                'price' => '0',
                'type' => 'business',
                'popular' => false,
                'is_active' => true,
                'order' => 3,
                'features' => [
                    'سرعات مخصصة',
                    'بنية تحتية متطورة',
                    'فريق دعم مخصص',
                    'SLA مخصص',
                    'حلول أمنية متقدمة',
                    'استشارات تقنية',
                    'إدارة شبكة كاملة',
                    'دعم على مدار الساعة'
                ],
                'features_ar' => [
                    'سرعات مخصصة',
                    'بنية تحتية متطورة',
                    'فريق دعم مخصص',
                    'SLA مخصص',
                    'حلول أمنية متقدمة',
                    'استشارات تقنية',
                    'إدارة شبكة كاملة',
                    'دعم على مدار الساعة'
                ],
                'features_en' => [
                    'Custom speeds',
                    'Advanced infrastructure',
                    'Dedicated support team',
                    'Custom SLA',
                    'Advanced security solutions',
                    'Technical consultations',
                    'Complete network management',
                    'Round-the-clock support'
                ],
            ],
        ];

        // Insert packages
        foreach (array_merge($homePackages, $businessPackages) as $package) {
            Package::create($package);
        }
    }
}

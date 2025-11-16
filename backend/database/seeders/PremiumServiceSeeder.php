<?php

namespace Database\Seeders;

use App\Models\PremiumService;
use Illuminate\Database\Seeder;

class PremiumServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'خدمة الإنترنت فائقة السرعة',
                'name_en' => 'Ultra High-Speed Internet Service',
                'description' => 'إنترنت بسرعة عالية تصل إلى 1 جيجابايت مع دعم فني على مدار الساعة وضمان الاستقرار الكامل',
                'description_en' => 'Ultra high-speed internet up to 1 Gbps with 24/7 technical support and complete stability guarantee',
                'price' => 299000,
                'features' => ['سرعة 1 جيجابايت', 'دعم فني 24/7', 'ضمان الاستقرار', 'أجهزة مجانية'],
                'is_active' => true,
                'category' => 'إنترنت',
                'icon' => 'Zap',
                'color' => 'primary',
                'order' => 1
            ],
            [
                'name' => 'خدمة الأمان المتقدم',
                'name_en' => 'Advanced Security Service',
                'description' => 'حماية شاملة لجميع أجهزتك مع أحدث تقنيات الحماية من الفيروسات والتهديدات السيبرانية',
                'description_en' => 'Comprehensive protection for all your devices with the latest antivirus and cybersecurity threat protection technologies',
                'price' => 150000,
                'features' => ['حماية من الفيروسات', 'جدار حماية متقدم', 'حماية البريد الإلكتروني', 'مراقبة 24/7'],
                'is_active' => true,
                'category' => 'أمان',
                'icon' => 'Shield',
                'color' => 'purple',
                'order' => 2
            ],
            [
                'name' => 'خدمة الدعم الفني المتميز',
                'name_en' => 'Premium Technical Support Service',
                'description' => 'دعم فني متخصص ومتاح على مدار الساعة لحل جميع المشاكل التقنية بسرعة وكفاءة عالية',
                'description_en' => 'Specialized technical support available 24/7 to solve all technical problems quickly and efficiently',
                'price' => 200000,
                'features' => ['دعم فني 24/7', 'استجابة سريعة', 'خبراء متخصصون', 'حلول مخصصة'],
                'is_active' => true,
                'category' => 'دعم',
                'icon' => 'Headphones',
                'color' => 'blue',
                'order' => 3
            ],
            [
                'name' => 'خدمة التخزين السحابي المتقدم',
                'name_en' => 'Advanced Cloud Storage Service',
                'description' => 'تخزين سحابي آمن وسريع مع مساحة كبيرة ونسخ احتياطية تلقائية لحماية بياناتك المهمة',
                'description_en' => 'Secure and fast cloud storage with large space and automatic backups to protect your important data',
                'price' => 120000,
                'features' => ['مساحة 1 تيرابايت', 'نسخ احتياطية تلقائية', 'وصول من أي مكان', 'حماية متقدمة'],
                'is_active' => true,
                'category' => 'تخزين',
                'icon' => 'Cloud',
                'color' => 'blue',
                'order' => 4
            ],
            [
                'name' => 'خدمة الاستضافة المتميزة',
                'name_en' => 'Premium Hosting Service',
                'description' => 'استضافة مواقع ويب عالية الأداء مع سرعة تحميل فائقة وضمان وقت تشغيل 99.9%',
                'description_en' => 'High-performance web hosting with ultra-fast loading speeds and 99.9% uptime guarantee',
                'price' => 350000,
                'features' => ['أداء عالي', 'سرعة فائقة', 'ضمان 99.9%', 'دعم SSL مجاني'],
                'is_active' => true,
                'category' => 'استضافة',
                'icon' => 'Server',
                'color' => 'purple',
                'order' => 5
            ],
            [
                'name' => 'خدمة التطوير المخصص',
                'name_en' => 'Custom Development Service',
                'description' => 'تطوير تطبيقات ومواقع ويب مخصصة حسب احتياجاتك مع فريق من المطورين المحترفين',
                'description_en' => 'Custom application and website development tailored to your needs with a team of professional developers',
                'price' => 500000,
                'features' => ['تطوير مخصص', 'فريق محترف', 'دعم مستمر', 'تحديثات مجانية'],
                'is_active' => false,
                'category' => 'تطوير',
                'icon' => 'Code',
                'color' => 'orange',
                'order' => 6
            ]
        ];

        foreach ($services as $service) {
            PremiumService::create($service);
        }
    }
}

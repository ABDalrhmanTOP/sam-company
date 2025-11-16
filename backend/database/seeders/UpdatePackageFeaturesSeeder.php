<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class UpdatePackageFeaturesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = Package::whereNotNull('features')->get();
        
        $translations = [
            'تصفح سريع ومستقر' => 'Fast and stable browsing',
            'مشاهدة HD' => 'HD viewing',
            'مشاهدة 4K' => '4K viewing',
            '2-3 أجهزة' => '2-3 devices',
            '5-7 أجهزة' => '5-7 devices',
            'أجهزة غير محدودة' => 'Unlimited devices',
            'راوتر مجاني' => 'Free router',
            'راوتر متطور' => 'Advanced router',
            'تركيب مجاني' => 'Free installation',
            'تركيب احترافي' => 'Professional installation',
            'سرعة فائقة' => 'Ultra-fast speed',
            'ألعاب بدون تأخير' => 'Gaming without lag',
            'دعم 24/7' => '24/7 support',
            'سرعة 500 ميجا مضمونة' => 'Guaranteed 500 Mbps speed',
            'IP ثابت مجاني' => 'Free static IP',
            'عدة IP ثابتة' => 'Multiple static IPs',
            'دعم VIP' => 'VIP support',
            'دعم مخصص 24/7' => 'Dedicated 24/7 support',
            'SLA 99.9%' => '99.9% SLA',
            'SLA مضمون' => 'Guaranteed SLA',
            'SLA مخصص' => 'Custom SLA',
            'أولوية الخدمة' => 'Service priority',
            'تقارير شهرية' => 'Monthly reports',
            'تقارير أسبوعية' => 'Weekly reports',
            'سرعة جيجابت كاملة' => 'Full gigabit speed',
            'نسخ احتياطي' => 'Backup',
            'حماية متقدمة' => 'Advanced protection',
            'سرعات مخصصة' => 'Custom speeds',
            'بنية تحتية متطورة' => 'Advanced infrastructure',
            'فريق دعم مخصص' => 'Dedicated support team',
            'حلول أمنية متقدمة' => 'Advanced security solutions',
            'استشارات تقنية' => 'Technical consultations',
            'إدارة شبكة كاملة' => 'Complete network management',
            'دعم على مدار الساعة' => 'Round-the-clock support',
            // Additional common translations
            'مشاهدة مباشرة' => 'Live streaming',
            'تحميل سريع' => 'Fast download',
            'رابط مباشر' => 'Direct connection',
            'عدم وجود حدود' => 'No limits',
            'سرعة مضمونة' => 'Guaranteed speed',
            'دعم فني' => 'Technical support',
            'صيانة مجانية' => 'Free maintenance',
            'ضمان الجودة' => 'Quality assurance',
            'متابعة مستمرة' => 'Continuous monitoring',
            'أمان عالي' => 'High security',
            'حماية من الفيروسات' => 'Virus protection',
            'جدار ناري' => 'Firewall',
            'نسخ احتياطي تلقائي' => 'Automatic backup',
            'خدمة عملاء' => 'Customer service',
            'دعم متعدد اللغات' => 'Multilingual support',
            'مستوى عالي من الأداء' => 'High performance level',
            'اتصال مستقر' => 'Stable connection',
            'جودة HD' => 'HD quality',
            'جودة 4K' => '4K quality',
            'لعب أونلاين' => 'Online gaming',
            'بث مباشر' => 'Live streaming',
            'مكالمات فيديو' => 'Video calls',
            'عمل عن بعد' => 'Remote work',
            'تعليم أونلاين' => 'Online education',
            'مؤتمرات فيديو' => 'Video conferencing',
            'رفع ملفات' => 'File upload',
            'تحميل ملفات' => 'File download',
            'سحابة' => 'Cloud',
            'تخزين سحابي' => 'Cloud storage',
            'VPN' => 'VPN',
            'حماية VPN' => 'VPN protection',
            'شبكة خاصة' => 'Private network',
            'أمان متقدم' => 'Advanced security',
            'تشفير البيانات' => 'Data encryption',
            'حماية DDoS' => 'DDoS protection',
            'مراقبة 24/7' => '24/7 monitoring',
            'إشعارات فورية' => 'Instant notifications',
            'لوحة تحكم' => 'Control panel',
            'تقارير تفصيلية' => 'Detailed reports',
            'تحليلات متقدمة' => 'Advanced analytics',
        ];
        
        foreach ($packages as $package) {
            $features = $package->features;
            
            if (empty($features) || !is_array($features)) {
                continue;
            }
            
            // Always update to ensure all features are translated
            
            // Copy features to features_ar
            $features_ar = $features;
            
            // Translate features to English
            $features_en = [];
            foreach ($features as $feature) {
                if (empty($feature)) {
                    $features_en[] = '';
                    continue;
                }
                
                // Check if feature contains Arabic characters
                $hasArabic = preg_match('/[\x{0600}-\x{06FF}]/u', $feature);
                
                // Use translation mapping
                if (isset($translations[$feature])) {
                    $features_en[] = $translations[$feature];
                } elseif ($hasArabic) {
                    // If it's Arabic but no translation found, keep original (will be handled in frontend)
                    $this->command->warn("No translation found for: '{$feature}' in Package #{$package->id}");
                    $features_en[] = $feature; // Keep original, frontend will translate
                } else {
                    // Already in English
                    $features_en[] = $feature;
                }
            }
            
            // If features_ar already exists and is different, prefer the existing one
            if (!empty($package->features_ar) && is_array($package->features_ar)) {
                $features_ar = $package->features_ar;
                // Ensure features_en matches the count of features_ar
                if (count($features_en) !== count($features_ar)) {
                    $features_en = [];
                    foreach ($features_ar as $featureAr) {
                        if (isset($translations[$featureAr])) {
                            $features_en[] = $translations[$featureAr];
                        } else {
                            $hasArabic = preg_match('/[\x{0600}-\x{06FF}]/u', $featureAr);
                            $features_en[] = $hasArabic ? $featureAr : $featureAr; // Keep as is if no translation
                        }
                    }
                }
            }
            
            $package->features_ar = $features_ar;
            $package->features_en = $features_en;
            $package->save();
            
            $this->command->info("Updated features for Package #{$package->id} ({$package->name_ar})");
            $this->command->info("  AR: " . json_encode($features_ar));
            $this->command->info("  EN: " . json_encode($features_en));
        }
        
        $this->command->info("Update completed!");
    }
}


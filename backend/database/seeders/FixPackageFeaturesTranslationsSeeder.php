<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class FixPackageFeaturesTranslationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = Package::whereNotNull('features_ar')->get();
        
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
        ];
        
        foreach ($packages as $package) {
            if (empty($package->features_ar) || !is_array($package->features_ar)) {
                continue;
            }
            
            $features_ar = $package->features_ar;
            $features_en = $package->features_en ?? [];
            
            // Ensure features_en array matches features_ar array length
            if (count($features_en) !== count($features_ar)) {
                $features_en = array_fill(0, count($features_ar), '');
            }
            
            $updated = false;
            $new_features_en = [];
            
            foreach ($features_ar as $index => $featureAr) {
                if (empty($featureAr)) {
                    $new_features_en[] = '';
                    continue;
                }
                
                // Check if current translation exists and is valid
                $currentEn = $features_en[$index] ?? '';
                
                // Check if feature contains Arabic
                $hasArabic = preg_match('/[\x{0600}-\x{06FF}]/u', $featureAr);
                
                if ($hasArabic) {
                    // If translation exists in mapping, use it
                    if (isset($translations[$featureAr])) {
                        $new_features_en[] = $translations[$featureAr];
                        if ($currentEn !== $translations[$featureAr]) {
                            $updated = true;
                        }
                    } elseif (empty($currentEn) || preg_match('/[\x{0600}-\x{06FF}]/u', $currentEn)) {
                    // Translation missing or still in Arabic - try to find partial match
                    $translated = $this->findTranslation($featureAr, $translations);
                    if ($translated !== $featureAr) {
                        $new_features_en[] = $translated;
                        $updated = true;
                    } else {
                        $this->command->warn("Missing translation for Package #{$package->id}: '{$featureAr}'");
                        // Keep original for now, frontend will handle it
                        $new_features_en[] = $featureAr;
                        $updated = true;
                    }
                    } else {
                        // Keep existing translation
                        $new_features_en[] = $currentEn;
                    }
                } else {
                    // Already in English or other language
                    $new_features_en[] = $featureAr;
                    if ($currentEn !== $featureAr) {
                        $updated = true;
                    }
                }
            }
            
            if ($updated) {
                $package->features_en = $new_features_en;
                $package->save();
                $this->command->info("Fixed translations for Package #{$package->id} ({$package->name_ar})");
            } else {
                $this->command->info("Package #{$package->id} ({$package->name_ar}) is already up to date");
            }
        }
        
        $this->command->info("Fix completed!");
    }
    
    /**
     * Try to find translation by partial match
     */
    private function findTranslation(string $text, array $translations): string
    {
        // Exact match first
        if (isset($translations[$text])) {
            return $translations[$text];
        }
        
        // Try partial matches
        foreach ($translations as $ar => $en) {
            if (strpos($text, $ar) !== false || strpos($ar, $text) !== false) {
                return $en;
            }
        }
        
        return $text;
    }
}


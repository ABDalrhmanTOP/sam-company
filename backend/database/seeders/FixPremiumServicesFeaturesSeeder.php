<?php

namespace Database\Seeders;

use App\Models\PremiumService;
use Illuminate\Database\Seeder;

class FixPremiumServicesFeaturesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = PremiumService::whereNotNull('features')->get();
        
        $translations = [
            'سرعة 1 جيجابايت' => '1 Gbps speed',
            'دعم فني 24/7' => '24/7 technical support',
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
            'حماية البيانات' => 'Data protection',
            'تشفير البيانات' => 'Data encryption',
            'حماية DDoS' => 'DDoS protection',
            'مراقبة 24/7' => '24/7 monitoring',
            'إشعارات فورية' => 'Instant notifications',
            'لوحة تحكم' => 'Control panel',
            'تقارير تفصيلية' => 'Detailed reports',
            'تحليلات متقدمة' => 'Advanced analytics',
            // Additional translations for premium services
            'ضمان الاستقرار' => 'Stability guarantee',
            'أجهزة مجانية' => 'Free devices',
            'جدار حماية متقدم' => 'Advanced firewall',
            'حماية البريد الإلكتروني' => 'Email protection',
            'استجابة سريعة' => 'Fast response',
            'خبراء متخصصون' => 'Expert specialists',
            'حلول مخصصة' => 'Custom solutions',
            'مساحة 1 تيرابايت' => '1 TB storage',
            'نسخ احتياطية تلقائية' => 'Automatic backups',
            'وصول من أي مكان' => 'Access from anywhere',
            'أداء عالي' => 'High performance',
            'ضمان 99.9%' => '99.9% guarantee',
            'دعم SSL مجاني' => 'Free SSL support',
            'تطوير مخصص' => 'Custom development',
            'فريق محترف' => 'Professional team',
            'دعم مستمر' => 'Continuous support',
            'تحديثات مجانية' => 'Free updates',
        ];
        
        foreach ($services as $service) {
            $features = $service->features;
            
            if (empty($features) || !is_array($features)) {
                continue;
            }
            
            // Get current features_ar
            $features_ar = $service->features_ar;
            if (empty($features_ar) || !is_array($features_ar)) {
                $features_ar = $features;
            }
            
            // Get current features_en
            $features_en = $service->features_en;
            if (empty($features_en) || !is_array($features_en)) {
                $features_en = [];
            }
            
            // Ensure features_en matches features_ar length and translate
            $translated_features_en = [];
            foreach ($features_ar as $index => $featureAr) {
                if (empty($featureAr)) {
                    $translated_features_en[] = '';
                    continue;
                }
                
                // Check if current feature_en at this index is valid (not Arabic)
                $currentEn = $features_en[$index] ?? '';
                $hasArabicInCurrent = preg_match('/[\x{0600}-\x{06FF}]/u', $currentEn);
                
                if (!empty($currentEn) && !$hasArabicInCurrent) {
                    // Current English feature is valid, keep it
                    $translated_features_en[] = $currentEn;
                } else {
                    // Need to translate
                    if (isset($translations[$featureAr])) {
                        $translated_features_en[] = $translations[$featureAr];
                        $this->command->info("Translated: '{$featureAr}' -> '{$translations[$featureAr]}'");
                    } else {
                        // Check if it contains Arabic
                        $hasArabic = preg_match('/[\x{0600}-\x{06FF}]/u', $featureAr);
                        if ($hasArabic) {
                            $this->command->warn("No translation found for: '{$featureAr}' - keeping Arabic");
                            // Try simple translation mapping for common patterns
                            $translated_features_en[] = $this->simpleTranslate($featureAr);
                        } else {
                            // Already in English or other language
                            $translated_features_en[] = $featureAr;
                        }
                    }
                }
            }
            
            // Update service
            $service->features_ar = $features_ar;
            $service->features_en = $translated_features_en;
            $service->save();
            
            $this->command->info("Fixed features for Service #{$service->id} ({$service->name})");
            $this->command->info("  AR: " . json_encode($features_ar, JSON_UNESCAPED_UNICODE));
            $this->command->info("  EN: " . json_encode($translated_features_en, JSON_UNESCAPED_UNICODE));
        }
        
        $this->command->info("Fix completed!");
    }
    
    /**
     * Simple translation for common patterns
     */
    private function simpleTranslate(string $text): string
    {
        // Common patterns
        $patterns = [
            '/سرعة\s*(\d+)\s*ميجا/' => '$1 Mbps speed',
            '/سرعة\s*(\d+)\s*جيجا/' => '$1 Gbps speed',
            '/دعم\s*24\/7/' => '24/7 support',
            '/دعم\s*فني/' => 'Technical support',
            '/راوتر\s*مجاني/' => 'Free router',
            '/تركيب\s*مجاني/' => 'Free installation',
        ];
        
        foreach ($patterns as $pattern => $replacement) {
            if (preg_match($pattern, $text)) {
                return preg_replace($pattern, $replacement, $text);
            }
        }
        
        // Return original if no pattern matches
        return $text;
    }
}


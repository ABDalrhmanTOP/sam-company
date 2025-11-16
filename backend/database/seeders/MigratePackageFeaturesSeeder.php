<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class MigratePackageFeaturesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = Package::whereNotNull('features')->get();
        
        foreach ($packages as $package) {
            $features = $package->features;
            
            if (empty($features) || !is_array($features)) {
                continue;
            }
            
            // Check if features_ar and features_en are already set
            if (!empty($package->features_ar) && !empty($package->features_en)) {
                $this->command->info("Package #{$package->id} already has bilingual features. Skipping...");
                continue;
            }
            
            // Copy features to features_ar
            $package->features_ar = $features;
            
            // Translate features to English
            $features_en = [];
            foreach ($features as $feature) {
                if (empty($feature)) {
                    continue;
                }
                
                // Check if feature contains Arabic characters
                if (preg_match('/[\x{0600}-\x{06FF}]/u', $feature)) {
                    // Translate using MyMemory API
                    try {
                        $response = Http::timeout(10)->get('https://api.mymemory.translated.net/get', [
                            'q' => $feature,
                            'langpair' => 'ar|en'
                        ]);
                        
                        if ($response->successful() && isset($response->json()['responseData']['translatedText'])) {
                            $translated = $response->json()['responseData']['translatedText'];
                            $features_en[] = $translated;
                            $this->command->info("Translated: '{$feature}' -> '{$translated}'");
                        } else {
                            // If translation fails, use simple mapping
                            $features_en[] = $this->simpleTranslate($feature);
                        }
                    } catch (\Exception $e) {
                        $this->command->warn("Translation failed for '{$feature}': " . $e->getMessage());
                        // Use simple translation mapping
                        $features_en[] = $this->simpleTranslate($feature);
                    }
                } else {
                    // Feature is already in English or doesn't contain Arabic
                    $features_en[] = $feature;
                }
            }
            
            $package->features_en = $features_en;
            $package->save();
            
            $this->command->info("Migrated features for Package #{$package->id} ({$package->name_ar})");
        }
        
        $this->command->info("Migration completed!");
    }
    
    /**
     * Simple translation mapping for common features
     */
    private function simpleTranslate(string $text): string
    {
        $translations = [
            'تصفح سريع ومستقر' => 'Fast and stable browsing',
            'مشاهدة HD' => 'HD viewing',
            'مشاهدة 4K' => '4K viewing',
            '2-3 أجهزة' => '2-3 devices',
            '5-7 أجهزة' => '5-7 devices',
            'راوتر مجاني' => 'Free router',
            'تركيب مجاني' => 'Free installation',
            'سرعة فائقة' => 'Ultra-fast speed',
            'ألعاب بدون تأخير' => 'Gaming without lag',
            'دعم 24/7' => '24/7 support',
            'سرعة 500 ميجا مضمونة' => 'Guaranteed 500 Mbps speed',
            'IP ثابت مجاني' => 'Free static IP',
            'دعم VIP' => 'VIP support',
            'SLA 99.9%' => '99.9% SLA',
            'أولوية الخدمة' => 'Service priority',
            'تقارير شهرية' => 'Monthly reports',
            'سرعة جيجابت كاملة' => 'Full gigabit speed',
            'عدة IP ثابتة' => 'Multiple static IPs',
            'دعم مخصص 24/7' => 'Dedicated 24/7 support',
            'SLA مضمون' => 'Guaranteed SLA',
            'تركيب احترافي' => 'Professional installation',
            'تقارير أسبوعية' => 'Weekly reports',
            'نسخ احتياطي' => 'Backup',
            'حماية متقدمة' => 'Advanced protection',
            'سرعات مخصصة' => 'Custom speeds',
            'بنية تحتية متطورة' => 'Advanced infrastructure',
            'فريق دعم مخصص' => 'Dedicated support team',
            'SLA مخصص' => 'Custom SLA',
            'حلول أمنية متقدمة' => 'Advanced security solutions',
            'استشارات تقنية' => 'Technical consultations',
            'إدارة شبكة كاملة' => 'Complete network management',
            'دعم على مدار الساعة' => 'Round-the-clock support',
        ];
        
        return $translations[$text] ?? $text;
    }
}









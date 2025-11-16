<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AboutPage;

class AboutPageSeeder extends Seeder
{
    public function run(): void
    {
        AboutPage::truncate();
        AboutPage::create([
            'badge_ar' => 'قصتنا',
            'badge_en' => 'Our Story',
            'title_ar' => 'رواد الإنترنت في سوريا',
            'title_en' => 'Internet Pioneers in Syria',
            'subtitle_ar' => 'رحلة من الشغف والابتكار',
            'subtitle_en' => 'A Journey of Passion and Innovation',
            'description_ar' => 'نحن شركة سام للاتصالات، مزود خدمات الإنترنت الرائد في سوريا. نربط الناس بالعالم الرقمي من خلال تقنية الألياف الضوئية فائقة السرعة',
            'description_en' => 'We are SAM Company, the leading ISP in Syria. We connect people using high-speed fiber optic technology.',
            'stats_title_ar' => 'أرقام تتحدث عن إنجازاتنا',
            'stats_title_en' => 'Numbers That Speak of Our Achievements',
            'customers_count' => '50,000+',
            'customers_label_ar' => 'عميل سعيد',
            'customers_label_en' => 'Happy Customers',
            'coverage_count' => '100+',
            'coverage_label_ar' => 'منطقة تغطية',
            'coverage_label_en' => 'Coverage Areas',
            'uptime_count' => '99.9%',
            'uptime_label_ar' => 'جاهزية الخدمة',
            'uptime_label_en' => 'Service Uptime',
            'support_count' => '24/7',
            'support_label_ar' => 'دعم فني',
            'support_label_en' => 'Tech Support',
            'our_story_title_ar' => 'قصتنا',
            'our_story_title_en' => 'Our Story',
            'our_story_p1_ar' => 'تأسست شركة سام بهدف توفير خدمات إنترنت موثوقة للمنازل والشركات في سوريا.',
            'our_story_p1_en' => 'SAM was founded to offer reliable internet for homes and businesses in Syria.',
            'our_story_p2_ar' => 'كبرنا بسرعة بفضل ثقة عملائنا واستثمارنا بالتقنيات الحديثة.',
            'our_story_p2_en' => 'We grew fast thanks to customer trust and modern technology.',
            'mission_title_ar' => 'رسالتنا',
            'mission_title_en' => 'Our Mission',
            'mission_text_ar' => 'توفير خدمة إنترنت موثوقة لجميع العملاء مع التزام دائم بالتطوير.',
            'mission_text_en' => 'Provide reliable internet for all clients and always be committed to innovation.',
            'vision_title_ar' => 'رؤيتنا',
            'vision_title_en' => 'Our Vision',
            'vision_text_ar' => 'أن نكون المزود الأول للإنترنت في سوريا.',
            'vision_text_en' => 'To be the number one ISP in Syria.',
            'values_title_ar' => 'قيمنا التي نؤمن بها',
            'values_title_en' => 'Our Core Values',
            'value1_title_ar' => 'الابتكار',
            'value1_title_en' => 'Innovation',
            'value1_description_ar' => 'نستثمر دائماً في أفضل التقنيات.',
            'value1_description_en' => 'We always invest in the best technologies.',
            'value2_title_ar' => 'الشفافية',
            'value2_title_en' => 'Transparency',
            'value2_description_ar' => 'الصدق والثقة مع العملاء.',
            'value2_description_en' => 'Honesty and trust with our clients.',
            'value3_title_ar' => 'التميز بالخدمة',
            'value3_title_en' => 'Service Excellence',
            'value3_description_ar' => 'أفضل جودة واستقرار.',
            'value3_description_en' => 'Best quality and stability.',
            'value4_title_ar' => 'تطوير مستمر',
            'value4_title_en' => 'Continuous Development',
            'value4_description_ar' => 'نحسن البنية التحتية دائماً.',
            'value4_description_en' => 'We always improve infrastructure.',
            'cta_title_ar' => 'جاهز لتجربة إنترنت أسرع؟',
            'cta_title_en' => 'Ready for Faster Internet?',
            'cta_description_ar' => 'انضم لآلاف العملاء السعداء.',
            'cta_description_en' => 'Join thousands of happy customers.',
            'start_project_ar' => 'اشترك الآن',
            'start_project_en' => 'Subscribe Now',
            'view_services_ar' => 'شاهد الباقات',
            'view_services_en' => 'View Our Packages',
        ]);
    }
}













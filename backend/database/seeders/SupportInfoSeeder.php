<?php

namespace Database\Seeders;

use App\Models\SupportInfo;
use Illuminate\Database\Seeder;

class SupportInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supportInfos = [
            [
                'title_ar' => 'الدردشة المباشرة',
                'title_en' => 'Live Chat',
                'description_ar' => 'تحدث معنا مباشرة للحصول على إجابات فورية واستجابة سريعة',
                'description_en' => 'Chat with us directly for instant answers and quick response',
                'icon' => 'message-square',
                'type' => 'channel',
                'value' => 'chat-available',
                'link' => 'https://chat.samnet.sy',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title_ar' => 'الهاتف',
                'title_en' => 'Phone',
                'description_ar' => 'اتصل بنا على الرقم المجاني لدعم فني متاح على مدار الساعة',
                'description_en' => 'Call us on our free number for 24/7 technical support',
                'icon' => 'phone',
                'type' => 'channel',
                'value' => '+963 11 123 4567',
                'link' => 'tel:+963111234567',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title_ar' => 'البريد الإلكتروني',
                'title_en' => 'Email',
                'description_ar' => 'أرسل لنا بريد إلكتروني وسنرد عليك خلال 24 ساعة',
                'description_en' => 'Send us an email and we will reply within 24 hours',
                'icon' => 'mail',
                'type' => 'channel',
                'value' => 'support@samnet.sy',
                'link' => 'mailto:support@samnet.sy',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title_ar' => 'تذكرة الدعم',
                'title_en' => 'Support Ticket',
                'description_ar' => 'أنشئ تذكرة دعم وتابع حالتها من خلال نظام تتبع متقدم',
                'description_en' => 'Create a support ticket and track its status through advanced tracking system',
                'icon' => 'ticket',
                'type' => 'method',
                'value' => 'ticket-system',
                'link' => 'https://tickets.samnet.sy',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title_ar' => 'قاعدة المعرفة',
                'title_en' => 'Knowledge Base',
                'description_ar' => 'تصفح مقالاتنا ومصادر المساعدة للعثور على إجابات سريعة',
                'description_en' => 'Browse our articles and help resources to find quick answers',
                'icon' => 'book-open',
                'type' => 'method',
                'value' => 'knowledge-center',
                'link' => 'https://help.samnet.sy',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title_ar' => 'الفيديوهات التعليمية',
                'title_en' => 'Video Tutorials',
                'description_ar' => 'شاهد الفيديوهات التعليمية لتعلم كيفية استخدام خدماتنا',
                'description_en' => 'Watch tutorial videos to learn how to use our services',
                'icon' => 'video',
                'type' => 'method',
                'value' => 'video-tutorials',
                'link' => 'https://videos.samnet.sy',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'title_ar' => 'ساعات الدعم',
                'title_en' => 'Support Hours',
                'description_ar' => 'دعم فني متاح على مدار الساعة طوال أيام الأسبوع بدون توقف',
                'description_en' => 'Technical support available 24/7 all week without interruption',
                'icon' => 'clock',
                'type' => 'info',
                'value' => '24/7',
                'link' => null,
                'is_active' => true,
                'order' => 7,
            ],
            [
                'title_ar' => 'الموقع',
                'title_en' => 'Location',
                'description_ar' => 'قم بزيارتنا في مكتبنا الرئيسي في دمشق، سوريا',
                'description_en' => 'Visit us at our main office in Damascus, Syria',
                'icon' => 'map-pin',
                'type' => 'info',
                'value' => 'Damascus, Syria',
                'link' => 'https://maps.google.com/?q=Damascus,Syria',
                'is_active' => true,
                'order' => 8,
            ],
        ];

        foreach ($supportInfos as $info) {
            SupportInfo::create($info);
        }
    }
}

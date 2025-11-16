<?php

namespace Database\Seeders;

use App\Models\ContactInfo;
use Illuminate\Database\Seeder;

class ContactInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contactInfos = [
            [
                'type' => 'phone',
                'label_ar' => 'الهاتف',
                'label_en' => 'Phone',
                'value' => '+963 11 123 4567',
                'icon' => 'Phone',
                'link' => 'tel:+963111234567',
                'order' => 1,
                'is_active' => true,
                'description_ar' => 'اتصل بنا على مدار الساعة',
                'description_en' => 'Call us 24/7',
            ],
            [
                'type' => 'email',
                'label_ar' => 'البريد الإلكتروني',
                'label_en' => 'Email',
                'value' => 'info@samnet.sy',
                'icon' => 'Mail',
                'link' => 'mailto:info@samnet.sy',
                'order' => 2,
                'is_active' => true,
                'description_ar' => 'أرسل لنا رسالة',
                'description_en' => 'Send us a message',
            ],
            [
                'type' => 'whatsapp',
                'label_ar' => 'واتساب',
                'label_en' => 'WhatsApp',
                'value' => '+963 11 123 4567',
                'icon' => 'MessageCircle',
                'link' => 'https://wa.me/963111234567',
                'order' => 3,
                'is_active' => true,
                'description_ar' => 'تواصل معنا عبر واتساب',
                'description_en' => 'Contact us via WhatsApp',
            ],
            [
                'type' => 'address',
                'label_ar' => 'العنوان',
                'label_en' => 'Address',
                'value' => 'دمشق، سورية',
                'icon' => 'MapPin',
                'link' => null,
                'order' => 4,
                'is_active' => true,
                'description_ar' => 'مكتبنا الرئيسي',
                'description_en' => 'Our main office',
            ],
            [
                'type' => 'hours',
                'label_ar' => 'ساعات العمل',
                'label_en' => 'Working Hours',
                'value' => '24/7',
                'icon' => 'Clock',
                'link' => null,
                'order' => 5,
                'is_active' => true,
                'description_ar' => 'خدمة على مدار الساعة',
                'description_en' => '24/7 service',
            ],
        ];

        foreach ($contactInfos as $contactInfo) {
            ContactInfo::create($contactInfo);
        }
    }
}

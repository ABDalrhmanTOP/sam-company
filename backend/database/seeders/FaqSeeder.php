<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question_ar' => 'كيف أقوم بتركيب خدمة الإنترنت؟',
                'question_en' => 'How do I install internet service?',
                'answer_ar' => 'بعد الاشتراك، سيتواصل معك فريقنا خلال 24 ساعة لتحديد موعد التركيب. التركيب مجاني ويتم في نفس اليوم أو اليوم التالي حسب المنطقة.',
                'answer_en' => 'After subscribing, our team will contact you within 24 hours to schedule installation. Installation is free and takes place on the same day or the next day depending on the area.',
                'category' => 'Installation',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'question_ar' => 'ماذا أفعل إذا كان الإنترنت بطيئاً؟',
                'question_en' => 'What should I do if the internet is slow?',
                'answer_ar' => 'أولاً، أعد تشغيل الراوتر. تأكد من عدم وجود تطبيقات تستهلك النطاق الترددي. إذا استمرت المشكلة، تواصل مع الدعم الفني على مدار الساعة.',
                'answer_en' => 'First, restart your router. Make sure there are no applications consuming bandwidth. If the problem persists, contact technical support 24/7.',
                'category' => 'Technical Support',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'question_ar' => 'هل يمكنني تغيير باقتي؟',
                'question_en' => 'Can I change my package?',
                'answer_ar' => 'نعم، يمكنك الترقية أو الانتقال لباقة أخرى في أي وقت. تواصل مع خدمة العملاء وسيتم تفعيل الباقة الجديدة خلال 24 ساعة.',
                'answer_en' => 'Yes, you can upgrade or switch to another package at any time. Contact customer service and the new package will be activated within 24 hours.',
                'category' => 'Packages',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'question_ar' => 'كيف أدفع فاتورتي الشهرية؟',
                'question_en' => 'How do I pay my monthly bill?',
                'answer_ar' => 'يمكنك الدفع عبر التحويل البنكي، أو نقاط الدفع المنتشرة، أو عبر تطبيق الموبايل. يتم إرسال الفاتورة قبل موعد الاستحقاق بـ 5 أيام.',
                'answer_en' => 'You can pay via bank transfer, payment points, or through the mobile app. The bill is sent 5 days before the due date.',
                'category' => 'Billing',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'question_ar' => 'ما هي مدة عقد الاشتراك؟',
                'question_en' => 'What is the subscription contract duration?',
                'answer_ar' => 'نقدم عقود مرنة تبدأ من شهر واحد. يمكنك الإلغاء في أي وقت دون رسوم إضافية إذا التزمت بشروط العقد.',
                'answer_en' => 'We offer flexible contracts starting from one month. You can cancel at any time without additional fees if you comply with the contract terms.',
                'category' => 'Contract',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'question_ar' => 'هل تقدمون خدمة الإنترنت للمنازل فقط؟',
                'question_en' => 'Do you offer internet service for homes only?',
                'answer_ar' => 'لا، نقدم خدمات للقطاع السكني والشركات. لدينا باقات خاصة بالشركات مع سرعات أعلى ودعم متخصص.',
                'answer_en' => 'No, we provide services for residential and business sectors. We have special packages for businesses with higher speeds and specialized support.',
                'category' => 'Services',
                'is_active' => true,
                'order' => 6,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }
    }
}

<?php

namespace App\Helpers;

use App\Models\Notification;
use App\Models\User;

class NotificationHelper
{
    /**
     * إرسال إشعار لجميع المدراء عند استلام رسالة جديدة
     */
    public static function notifyAdminsOfNewMessage($message)
    {
        // الحصول على جميع المدراء
        $admins = User::where('is_admin', true)->get();

        foreach ($admins as $admin) {
            Notification::create([
                'title' => 'رسالة جديدة من مستخدم',
                'message' => "رسالة جديدة من {$message->name} ({$message->email}): " . substr($message->message, 0, 50) . '...',
                'type' => 'warning',
                'user_id' => $admin->id,
                'link' => '/admin/messages',
            ]);
        }
    }

    /**
     * إرسال إشعار لجميع المدراء عند تعديل أي صفحة/مورد
     */
    public static function notifyAdminsOfModification($modifiedBy, $resourceType, $resourceName, $action = 'updated')
    {
        // الحصول على جميع المدراء عدا الذي قام بالتعديل
        $admins = User::where('is_admin', true)
            ->where('id', '!=', $modifiedBy->id)
            ->get();

        if ($admins->isEmpty()) {
            return;
        }

        $actionLabels = [
            'created' => 'أنشأ',
            'updated' => 'عدّل',
            'deleted' => 'حذف',
        ];

        $resourceLabels = [
            'benefit' => 'ميزة',
            'benefits' => 'ميزة',
            'package' => 'باقة',
            'packages' => 'باقة',
            'user' => 'مستخدم',
            'users' => 'مستخدم',
            'faq' => 'سؤال شائع',
            'faqs' => 'سؤال شائع',
            'support-info' => 'معلومات دعم',
            'contact-info' => 'معلومات اتصال',
            'speed-test-setting' => 'إعدادات اختبار السرعة',
            'speed-test-settings' => 'إعدادات اختبار السرعة',
            'premium-service' => 'خدمة متميزة',
            'premium-services' => 'خدمة متميزة',
            'announcement' => 'إعلان',
            'announcements' => 'إعلان',
            'about-page' => 'صفحة من نحن',
            'hero-setting' => 'إعدادات البطل',
            'hero-settings' => 'إعدادات البطل',
            'message' => 'رسالة',
            'messages' => 'رسالة',
        ];

        $resourceLabel = $resourceLabels[strtolower($resourceType)] ?? $resourceType;
        $actionLabel = $actionLabels[$action] ?? $action;

        foreach ($admins as $admin) {
            Notification::create([
                'title' => 'تعديل من قبل مشرف',
                'message' => "{$modifiedBy->name} {$actionLabel} {$resourceLabel}: {$resourceName}",
                'type' => 'info',
                'user_id' => $admin->id,
                'link' => '/admin/' . strtolower(str_replace(' ', '-', $resourceType)),
            ]);
        }
    }
}








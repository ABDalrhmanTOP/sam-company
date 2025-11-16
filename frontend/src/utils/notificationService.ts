import React from 'react';
import { useNotifications } from '../context/NotificationContext';

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  user_id?: number;
}

/**
 * خدمة لإرسال الإشعارات التلقائية
 */
export class NotificationService {
  private static createNotification: ((data: NotificationData) => Promise<void>) | null = null;

  /**
   * تهيئة الخدمة بمؤشر إلى دالة createNotification من Context
   */
  static initialize(createFn: (data: NotificationData) => Promise<void>) {
    this.createNotification = createFn;
  }

  /**
   * إرسال إشعار عند تعديل بيانات من قبل مشرف
   */
  static async notifyAdminOfModification(
    modifiedBy: { id: number; name: string },
    resourceType: string,
    resourceName: string,
    action: 'created' | 'updated' | 'deleted'
  ) {
    if (!this.createNotification) {
      console.warn('NotificationService not initialized');
      return;
    }

    const actionLabels: Record<string, string> = {
      created: 'أنشأ',
      updated: 'عدّل',
      deleted: 'حذف',
    };

    const resourceLabels: Record<string, string> = {
      benefit: 'ميزة',
      benefits: 'ميزة',
      package: 'باقة',
      packages: 'باقة',
      user: 'مستخدم',
      users: 'مستخدم',
      faq: 'سؤال شائع',
      faqs: 'سؤال شائع',
      'support-info': 'معلومات دعم',
      'contact-info': 'معلومات اتصال',
      'speed-test': 'إعدادات اختبار السرعة',
      'premium-service': 'خدمة متميزة',
      announcement: 'إعلان',
      announcements: 'إعلان',
      'about-page': 'صفحة من نحن',
    };

    const resourceLabel = resourceLabels[resourceType.toLowerCase()] || resourceType;
    const actionLabel = actionLabels[action] || action;

    await this.createNotification({
      title: 'تعديل من قبل مشرف',
      message: `${modifiedBy.name} ${actionLabel} ${resourceLabel}: ${resourceName}`,
      type: 'info',
      link: `/admin/${resourceType.toLowerCase().replace(' ', '-')}`,
      // user_id سيتم تحديده في Backend ليكون المدير فقط
    });
  }

  /**
   * إرسال إشعار عند استلام رسالة جديدة من مستخدم
   */
  static async notifyAdminOfNewMessage(
    messageId: number,
    senderName: string,
    senderEmail: string,
    messagePreview: string
  ) {
    if (!this.createNotification) {
      console.warn('NotificationService not initialized');
      return;
    }

    await this.createNotification({
      title: 'رسالة جديدة من مستخدم',
      message: `رسالة جديدة من ${senderName} (${senderEmail}): ${messagePreview.substring(0, 50)}...`,
      type: 'warning',
      link: `/admin/messages`,
    });
  }

  /**
   * إرسال إشعار عام
   */
  static async sendNotification(data: NotificationData) {
    if (!this.createNotification) {
      console.warn('NotificationService not initialized');
      return;
    }

    await this.createNotification(data);
  }
}

/**
 * Hook لتسهيل استخدام NotificationService
 */
export function useNotificationService() {
  const { createNotification } = useNotifications();

  // تهيئة الخدمة عند أول استخدام
  React.useEffect(() => {
    if (createNotification) {
      NotificationService.initialize(createNotification);
    }
  }, [createNotification]);

  return {
    notifyAdminOfModification: NotificationService.notifyAdminOfModification.bind(NotificationService),
    notifyAdminOfNewMessage: NotificationService.notifyAdminOfNewMessage.bind(NotificationService),
    sendNotification: NotificationService.sendNotification.bind(NotificationService),
  };
}

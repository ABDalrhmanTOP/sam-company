import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { NotificationService } from '../utils/notificationService';
import axios from 'axios';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user_id?: number;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  createNotification: (data: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'is_read'>) => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [endpointAvailable, setEndpointAvailable] = useState<boolean | null>(null); // null = لم نتأكد بعد
  const previousNotificationIds = useRef<Set<number>>(new Set());

  const fetchNotifications = useCallback(async () => {
    // التحقق من localStorage أولاً قبل إرسال أي طلب (يمكن إزالة هذا بعد تفعيل الـ backend)
    const stored = localStorage.getItem('notifications_endpoint_available');
    // إذا كان stored === 'false' ولا نريد المحاولة، يمكن إضافة return هنا
    // لكن الآن بعد تفعيل الـ backend، نحاول دائماً
    if (stored === 'false' && endpointAvailable === false) {
      // يمكن إزالة هذا التحقق بعد التأكد من عمل الـ backend
      // setEndpointAvailable(false);
      // return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/api/admin/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // جعل axios يتعامل مع 404 كـ response عادي وليس خطأ
        validateStatus: (status) => status < 500,
      }).catch((error: any) => {
        // إذا كان الطلب ملغى (canceled)، نتجاهله
        if (axios.isCancel(error) || error.message?.includes('not available')) {
          setEndpointAvailable(false);
          localStorage.setItem('notifications_endpoint_available', 'false');
          return { status: 404, data: { success: false, data: [] } };
        }
        throw error;
      });

      // التعامل مع 404 كحالة عادية (Backend غير موجود بعد)
      if (response && response.status === 404) {
        setEndpointAvailable(false); // تأكيد أن الـ endpoint غير موجود
        localStorage.setItem('notifications_endpoint_available', 'false');
        setNotifications([]);
        setLoading(false);
        return;
      }

      // إذا وصلنا هنا، الـ endpoint موجود
      if (response && response.status !== 404) {
        setEndpointAvailable(true);
        localStorage.setItem('notifications_endpoint_available', 'true');
        
        if (response.data && response.data.success) {
          setNotifications(response.data.data || []);
        } else {
          setNotifications([]);
        }
      }
    } catch (error: any) {
      // في حالة حدوث خطأ 404 أو كان الطلب ملغى، نتوقف عن المحاولات المستقبلية
      if (error.response?.status === 404 || error.status === 404 || axios.isCancel(error)) {
        setEndpointAvailable(false);
        localStorage.setItem('notifications_endpoint_available', 'false');
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [endpointAvailable]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await api.patch(`/api/admin/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error: any) {
      // التعامل بهدوء مع 404
      if (error.response?.status === 404) {
        // تحديث محلي فقط إذا كان Backend غير موجود
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
        return;
      }
      console.error('Error marking notification as read:', error);
      toast.error('فشل تحديث حالة الإشعار');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await api.patch('/api/admin/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
    } catch (error: any) {
      // التعامل بهدوء مع 404
      if (error.response?.status === 404) {
        // تحديث محلي فقط إذا كان Backend غير موجود
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        toast.success('تم تحديد جميع الإشعارات كمقروءة');
        return;
      }
      console.error('Error marking all notifications as read:', error);
      toast.error('فشل تحديث حالة الإشعارات');
    }
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await api.delete(`/api/admin/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(prev => prev.filter(notif => notif.id !== id));
      toast.success('تم حذف الإشعار');
    } catch (error: any) {
      // التعامل بهدوء مع 404
      if (error.response?.status === 404) {
        // حذف محلي فقط إذا كان Backend غير موجود
        setNotifications(prev => prev.filter(notif => notif.id !== id));
        toast.success('تم حذف الإشعار');
        return;
      }
      console.error('Error deleting notification:', error);
      toast.error('فشل حذف الإشعار');
    }
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      await api.delete('/api/admin/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications([]);
      toast.success('تم حذف جميع الإشعارات');
    } catch (error: any) {
      // التعامل بهدوء مع 404
      if (error.response?.status === 404) {
        // حذف محلي فقط إذا كان Backend غير موجود
        setNotifications([]);
        toast.success('تم حذف جميع الإشعارات');
        return;
      }
      console.error('Error deleting all notifications:', error);
      toast.error('فشل حذف الإشعارات');
    }
  }, []);

  const createNotification = useCallback(async (data: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'is_read'>) => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      const response = await api.post('/api/admin/notifications', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        await fetchNotifications();
        // لا نعرض toast عند إنشاء إشعار تلقائي (لأنه سيظهر في قائمة الإشعارات)
        if (data.title !== 'تعديل من قبل مشرف' && !data.title.includes('رسالة جديدة')) {
          toast.success('تم إنشاء الإشعار بنجاح');
        }
      }
    } catch (error: any) {
      // التعامل بهدوء مع 404 (Backend غير موجود بعد)
      if (error.response?.status === 404) {
        // Backend غير موجود - نتجاهل بهدوء بدون طباعة أي شيء
        return;
      }
      
      // فقط الأخطاء الأخرى (غير 404) نطبعها
      if (error.response?.status !== 404) {
        console.error('Error creating notification:', error);
        // لا نعرض toast للأخطاء في الإشعارات التلقائية
        if (data.title !== 'تعديل من قبل مشرف' && !data.title.includes('رسالة جديدة')) {
          toast.error('فشل إنشاء الإشعار');
        }
      }
    }
  }, [fetchNotifications]);

  // تهيئة NotificationService عند تحميل Context
  useEffect(() => {
    NotificationService.initialize(createNotification);
  }, [createNotification]);

  // كشف الإشعارات الجديدة وعرض Toast لها
  useEffect(() => {
    if (notifications.length === 0) {
      previousNotificationIds.current.clear();
      return;
    }

    const currentIds = new Set(notifications.map(n => n.id));
    
    // العثور على الإشعارات الجديدة (غير المقروءة)
    const newUnreadNotifications = notifications.filter(notif => 
      !notif.is_read && !previousNotificationIds.current.has(notif.id)
    );

    // عرض Toast للإشعارات الجديدة
    if (newUnreadNotifications.length > 0) {
      newUnreadNotifications.forEach(notif => {
        // استخدام window.showToast إذا كان موجوداً (من ToastContext)
        if (typeof window !== 'undefined' && (window as any).showToast) {
          (window as any).showToast({
            title: notif.title,
            message: notif.message,
            type: notif.type,
            duration: 5000,
          });
        }
      });
    }

    // تحديث مجموعة معرفات الإشعارات السابقة
    previousNotificationIds.current = currentIds;
  }, [notifications]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    // مسح حالة الـ endpoint القديمة عند التحميل (لإعادة المحاولة بعد تفعيل الـ backend)
    const stored = localStorage.getItem('notifications_endpoint_available');
    if (stored === 'false') {
      // مسح الحالة القديمة لإعادة المحاولة
      localStorage.removeItem('notifications_endpoint_available');
      setEndpointAvailable(null);
    }

    const loadNotifications = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          await fetchNotifications();
        } catch (error) {
          // تجاهل الأخطاء بهدوء
        }
      }
    };

    loadNotifications();

    const interval = setInterval(() => {
      // نتوقف عن التحديث الدوري إذا تأكدنا أن الـ endpoint غير موجود
      // ولكن الآن بعد تفعيل الـ backend، نحاول دائماً
      // if (endpointAvailable === false) {
      //   return;
      // }
      
      const currentToken = localStorage.getItem('admin_token');
      if (currentToken) {
        // استخدام catch صامت لتجنب الأخطاء في الكونسول
        fetchNotifications().catch(() => {
          // تجاهل الأخطاء بهدوء عند التحديث الدوري
        });
      }
    }, 30000); // تحديث كل 30 ثانية

    return () => {
      clearInterval(interval);
    };
  }, [fetchNotifications, endpointAvailable]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        createNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

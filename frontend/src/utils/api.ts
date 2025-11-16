import axios from 'axios';

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// متغير لتتبع حالة endpoints الإشعارات
let notificationsEndpointChecked = false;
let notificationsEndpointAvailable = false;

// التحقق من localStorage عند بدء التطبيق
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('notifications_endpoint_available');
  if (stored !== null) {
    notificationsEndpointChecked = true;
    notificationsEndpointAvailable = stored === 'true';
  }
}

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${adminToken}`;
    }
    
    // بعد تفعيل الـ backend، لا نمنع أي طلبات للإشعارات
    // إذا أردت إعادة تفعيل الحماية، يمكنك إلغاء التعليق على الكود أدناه
    // if (config.url?.includes('/notifications')) {
    //   const stored = localStorage.getItem('notifications_endpoint_available');
    //   if (stored === 'false') {
    //     const CancelToken = axios.CancelToken;
    //     const source = CancelToken.source();
    //     config.cancelToken = source.token;
    //     source.cancel('Notifications endpoint not available');
    //     return config;
    //   }
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor للتعامل مع الأخطاء بهدوء
api.interceptors.response.use(
  (response) => {
    // عند نجاح الطلب، نحدّث حالة endpoint الإشعارات
    if (response.config?.url?.includes('/notifications')) {
      notificationsEndpointChecked = true;
      notificationsEndpointAvailable = true;
      // حفظ في localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('notifications_endpoint_available', 'true');
      }
    }
    return response;
  },
  (error) => {
    // تحويل أخطاء 404 للإشعارات إلى response عادي بدلاً من error
    if (
      error.response?.status === 404 &&
      error.config?.url?.includes('/notifications')
    ) {
      // نحدّث حالة endpoint
      notificationsEndpointChecked = true;
      notificationsEndpointAvailable = false;
      
      // حفظ في localStorage لتجنب الطلبات المستقبلية
      if (typeof window !== 'undefined') {
        localStorage.setItem('notifications_endpoint_available', 'false');
      }
      
      // نعيد response عادي لـ 404 بدلاً من error
      return Promise.resolve({
        data: { success: false, data: [] },
        status: 404,
        statusText: 'Not Found',
        headers: error.response?.headers || {},
        config: error.config,
      });
    }
    // الأخطاء الأخرى نرجعها كما هي
    return Promise.reject(error);
  }
);

// تصدير دالة لإعادة تعيين حالة endpoint (للاستخدام في التطوير)
export const resetNotificationsEndpointStatus = () => {
  notificationsEndpointChecked = false;
  notificationsEndpointAvailable = false;
};

export const endpoints = {
  announcements: {
    active: '/api/announcements/active',
    admin: '/api/admin/announcements',
    adminById: (id: number | string) => `/api/admin/announcements/${id}`,
  },
  notifications: {
    admin: '/api/admin/notifications',
    adminById: (id: number | string) => `/api/admin/notifications/${id}`,
    markAsRead: (id: number | string) => `/api/admin/notifications/${id}/read`,
    markAllAsRead: '/api/admin/notifications/read-all',
  },
};



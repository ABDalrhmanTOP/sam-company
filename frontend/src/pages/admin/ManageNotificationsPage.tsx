import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Search,
  Filter,
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export function ManageNotificationsPage() {
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    createNotification,
  } = useNotifications();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
          badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          text: 'text-emerald-600 dark:text-emerald-400',
          glow: 'shadow-emerald-500/50'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-amber-400 to-amber-600',
          badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-500/30',
          text: 'text-amber-600 dark:text-amber-400',
          glow: 'shadow-amber-500/50'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-br from-red-400 to-red-600',
          badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-500/30',
          text: 'text-red-600 dark:text-red-400',
          glow: 'shadow-red-500/50'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
          badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-500/30',
          text: 'text-blue-600 dark:text-blue-400',
          glow: 'shadow-blue-500/50'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    const iconClass = "h-5 w-5 text-white";
    switch (type) {
      case 'success':
        return <CheckCircle2 className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesRead = 
      filterRead === 'all' || 
      (filterRead === 'read' && notification.is_read) ||
      (filterRead === 'unread' && !notification.is_read);

    return matchesSearch && matchesType && matchesRead;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
      await deleteNotification(id);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
      await deleteAllNotifications();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary via-primary to-[#c01810] shadow-lg">
              <Bell className="h-7 w-7 text-white" />
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg ring-2 ring-white dark:ring-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              إدارة الإشعارات
              <Sparkles className="h-6 w-6 text-primary" />
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-base">
              إدارة وإنشاء الإشعارات للمستخدمين
              {unreadCount > 0 && (
                <span className="mr-2 text-primary font-semibold">• {unreadCount} غير مقروء</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="h-5 w-5" />
            تحديد الكل كمقروء
          </button>
          <button
            onClick={() => {
              setEditingNotification(null);
              setIsFormOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-[#c01810] text-white rounded-xl hover:shadow-xl transition-all flex items-center gap-2 font-semibold hover:scale-105 active:scale-95 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            إشعار جديد
          </button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded-xl">
            <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400 mr-1" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border-0 rounded-lg bg-transparent dark:bg-transparent focus:ring-2 focus:ring-primary text-sm font-medium cursor-pointer"
            >
              <option value="all">جميع الأنواع</option>
              <option value="info">معلومات</option>
              <option value="success">نجاح</option>
              <option value="warning">تحذير</option>
              <option value="error">خطأ</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded-xl">
            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-4 py-2 border-0 rounded-lg bg-transparent dark:bg-transparent focus:ring-2 focus:ring-primary text-sm font-medium cursor-pointer"
            >
              <option value="all">الكل</option>
              <option value="read">مقروء</option>
              <option value="unread">غير مقروء</option>
            </select>
          </div>

          {(searchQuery || filterType !== 'all' || filterRead !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterRead('all');
              }}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-2 font-medium"
            >
              <X className="h-4 w-4" />
              إعادة تعيين
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"></div>
              <Bell className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Bell className="h-12 w-12 text-slate-400 dark:text-slate-500" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <X className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {notifications.length === 0 ? 'لا توجد إشعارات' : 'لا توجد نتائج'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {notifications.length === 0 
                ? 'ابدأ بإنشاء إشعار جديد' 
                : 'جرب تغيير معايير البحث'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => {
              const colors = getTypeColor(notification.type);
              const getUnreadBg = () => {
                switch (notification.type) {
                  case 'success':
                    return 'bg-gradient-to-l from-emerald-50/90 to-transparent dark:from-emerald-900/30 dark:to-transparent border-r-4 border-emerald-500 shadow-lg shadow-emerald-500/20';
                  case 'warning':
                    return 'bg-gradient-to-l from-amber-50/90 to-transparent dark:from-amber-900/30 dark:to-transparent border-r-4 border-amber-500 shadow-lg shadow-amber-500/20';
                  case 'error':
                    return 'bg-gradient-to-l from-red-50/90 to-transparent dark:from-red-900/30 dark:to-transparent border-r-4 border-red-500 shadow-lg shadow-red-500/20';
                  default:
                    return 'bg-gradient-to-l from-blue-50/90 to-transparent dark:from-blue-900/30 dark:to-transparent border-r-4 border-blue-500 shadow-lg shadow-blue-500/20';
                }
              };
              return (
                <div
                  key={notification.id}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                    !notification.is_read
                      ? getUnreadBg()
                      : 'bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`relative flex-shrink-0 ${colors.bg} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${colors.glow} group-hover:scale-110 transition-transform duration-300`}>
                        {getTypeIcon(notification.type)}
                        {!notification.is_read && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-900 rounded-full border-2 border-current animate-pulse"></div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className={`font-bold text-xl leading-tight ${
                            !notification.is_read
                              ? 'text-slate-900 dark:text-slate-100'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full animate-pulse shadow-md">
                              جديد
                            </span>
                          )}
                        </div>
                        <p className={`text-base leading-relaxed mb-4 ${
                          !notification.is_read
                            ? 'text-slate-800 dark:text-slate-200 font-medium'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            {formatDate(notification.created_at)}
                          </span>
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${colors.badge}`}>
                            {notification.type === 'info' ? 'معلومات' :
                             notification.type === 'success' ? 'نجاح' :
                             notification.type === 'warning' ? 'تحذير' : 'خطأ'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-xl transition-all hover:scale-110 active:scale-95"
                          title="تحديد كمقروء"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110 active:scale-95"
                        title="حذف"
                      >
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isFormOpen && (
        <NotificationForm
          notification={editingNotification}
          onClose={() => {
            setIsFormOpen(false);
            setEditingNotification(null);
          }}
          onSuccess={() => {
            setIsFormOpen(false);
            setEditingNotification(null);
            fetchNotifications();
          }}
        />
      )}
    </div>
  );
}

function NotificationForm({ 
  notification, 
  onClose, 
  onSuccess 
}: { 
  notification?: any; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const { createNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: notification?.title || '',
    message: notification?.message || '',
    type: notification?.type || 'info',
    link: notification?.link || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createNotification({
        title: formData.title,
        message: formData.message,
        type: formData.type as any,
        link: formData.link || undefined,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating notification:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200/50 dark:border-slate-700/50">
        <div className="sticky top-0 bg-gradient-to-r from-primary/10 via-primary/5 to-[#c01810]/10 dark:from-primary/20 dark:via-primary/10 dark:to-[#c01810]/20 border-b border-slate-200/50 dark:border-slate-700/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-[#c01810]">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">إشعار جديد</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all hover:scale-110 active:scale-95"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">العنوان</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="أدخل عنوان الإشعار"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">الرسالة</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              placeholder="أدخل محتوى الإشعار"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">النوع</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
            >
              <option value="info">معلومات</option>
              <option value="success">نجاح</option>
              <option value="warning">تحذير</option>
              <option value="error">خطأ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">رابط اختياري</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-primary to-[#c01810] text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 font-semibold shadow-lg hover:scale-105 active:scale-95"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ الإشعار'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

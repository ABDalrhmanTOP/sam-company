import React, { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from '../context/NotificationContext';

export type NotificationType = "success" | "warning" | "error" | "info";

interface NotificationBellProps {
  language?: "ar" | "en";
  onNavigate?: (view: string) => void;
}

export function NotificationBell({ language = "ar", onNavigate }: NotificationBellProps) {
  const {
    notifications: backendNotifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const content = {
    ar: {
      notifications: "الإشعارات",
      noNotifications: "لا توجد إشعارات",
      noNotificationsDesc: "ستظهر جميع الإشعارات هنا",
      markAllRead: "تعليم الكل كمقروء",
      clearAll: "حذف الكل",
      markAsRead: "تعليم كمقروء",
      markAsUnread: "تعليم كغير مقروء",
      delete: "حذف",
      settings: "إعدادات الإشعارات",
      justNow: "الآن",
      minutesAgo: "منذ {0} دقيقة",
      hoursAgo: "منذ {0} ساعة",
      daysAgo: "منذ {0} يوم",
      unread: "غير مقروء",
    },
    en: {
      notifications: "Notifications",
      noNotifications: "No notifications",
      noNotificationsDesc: "All notifications will appear here",
      markAllRead: "Mark all as read",
      clearAll: "Clear all",
      markAsRead: "Mark as read",
      markAsUnread: "Mark as unread",
      delete: "Delete",
      settings: "Notification Settings",
      justNow: "Just now",
      minutesAgo: "{0} minutes ago",
      hoursAgo: "{0} hours ago",
      daysAgo: "{0} days ago",
      unread: "Unread",
    },
  };

  const t = content[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // إذا كان النقر داخل الـ dropdown button نفسه، لا نغلق
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }
      
      // إذا كان النقر داخل الـ panel، لا نغلق
      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }
      
      // إذا كان النقر على Overlay، نغلق (Overlay لديه onClick يغلق الحالة)
      if (target.hasAttribute('data-overlay')) {
        return;
      }
      
      // في أي حالة أخرى، نغلق
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsReadHandler = (id: number) => {
    markAsRead(id);
  };

  const deleteNotificationHandler = (id: number) => {
    deleteNotification(id);
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return t.justNow;
      if (minutes < 60) return t.minutesAgo.replace("{0}", minutes.toString());
      if (hours < 24) return t.hoursAgo.replace("{0}", hours.toString());
      return t.daysAgo.replace("{0}", days.toString());
    } catch {
      return t.justNow;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return "bg-slate-50/50 dark:bg-slate-800/50";

    switch (type) {
      case "success":
        return "bg-green-50/80 dark:bg-green-900/20 border-green-200/50 dark:border-green-800/50";
      case "warning":
        return "bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800/50";
      case "error":
        return "bg-red-50/80 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/50";
      case "info":
        return "bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/50";
      default:
        return "bg-slate-50 dark:bg-slate-800";
    }
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            refreshNotifications();
          }
        }}
        className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-[#c01810]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        <div className="relative z-10">
          <Bell className={`h-5 w-5 transition-all duration-300 ${
            isOpen ? "text-primary scale-110" : "text-foreground group-hover:text-primary"
          } ${unreadCount > 0 ? "animate-pulse" : ""}`} />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-br from-red-500 to-red-600 border-2 border-background shadow-lg">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            </motion.div>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Overlay للخلفية */}
          <div 
            data-overlay
            className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
            style={{ 
              zIndex: 99998, 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              width: '100%',
              height: '100%'
            }}
          />
          {/* Dropdown Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${language === "ar" ? "left-0" : "right-0"} mt-2 w-96 bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[9999] overflow-hidden backdrop-blur-xl`}
            style={{
              zIndex: 99999,
              position: 'fixed',
              top: '80px',
              right: language === "ar" ? 'auto' : '16px',
              left: language === "ar" ? '16px' : 'auto',
              maxWidth: 'calc(100vw - 32px)'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-[#c01810]/5 to-primary/10 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-[#c01810] shadow-lg">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                    {t.notifications}
                  </h3>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                      {unreadCount} {t.unread}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Action Buttons */}
              {backendNotifications.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={markAllAsRead}
                    className="flex-1 h-8 text-xs gap-1.5 border-slate-300 dark:border-slate-600"
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck className="h-3 w-3" />
                    {t.markAllRead}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={deleteAllNotifications}
                    className="flex-1 h-8 text-xs gap-1.5 border-slate-300 dark:border-slate-600 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t.clearAll}
                  </Button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full"></div>
                </div>
              ) : backendNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] px-4 text-center">
                  <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-[#c01810]/5 mb-4">
                    <Bell className="h-12 w-12 text-primary/40" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">
                    {t.noNotifications}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.noNotificationsDesc}
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  <AnimatePresence>
                    {backendNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          if (notification.link) {
                            // إذا كان لدينا onNavigate callback، نستخدمه للتنقل داخل AdminPanel
                            if (onNavigate) {
                              // تحويل /admin/benefits إلى benefits، /admin/messages إلى messages، إلخ
                              const viewMatch = notification.link.match(/\/admin\/([^\/]+)/);
                              if (viewMatch) {
                                let viewName = viewMatch[1];
                                // معالجة الحالات الخاصة
                                if (viewName === 'speed-test-settings') viewName = 'speed-test';
                                else if (viewName === 'support-info') viewName = 'support';
                                else if (viewName === 'contact-info') viewName = 'contact';
                                else if (viewName === 'about-page') viewName = 'about-page';
                                else if (viewName === 'premium-services') viewName = 'premium-services';
                                
                                onNavigate(viewName);
                                setIsOpen(false);
                              } else {
                                // إذا لم يكن رابط adminPanel، نستخدم window.location.href
                                window.location.href = notification.link;
                              }
                            } else {
                              // إذا لم يكن لدينا onNavigate، نستخدم window.location.href
                              window.location.href = notification.link;
                            }
                          }
                        }}
                        className={`relative group mb-2 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${getNotificationBgColor(
                          notification.type,
                          notification.is_read
                        )} ${notification.link ? 'cursor-pointer' : ''}`}
                      >
                        {/* Unread Indicator */}
                        {!notification.is_read && (
                          <div className="absolute top-4 left-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg">
                            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`font-semibold text-sm ${
                                !notification.is_read 
                                  ? "text-slate-900 dark:text-slate-100" 
                                  : "text-slate-600 dark:text-slate-400"
                              }`}>
                                {notification.title}
                              </h4>
                            </div>
                            <p className={`text-sm mb-2 ${
                              !notification.is_read 
                                ? "text-slate-700 dark:text-slate-300" 
                                : "text-slate-500 dark:text-slate-400"
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {getTimeAgo(notification.created_at)}
                              </span>

                              {/* Quick Actions */}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.is_read ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsReadHandler(notification.id);
                                    }}
                                    className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-700 transition-colors"
                                    title={t.markAsRead}
                                  >
                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                  </button>
                                ) : null}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotificationHandler(notification.id);
                                  }}
                                  className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-700 transition-colors"
                                  title={t.delete}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {backendNotifications.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Settings className="h-4 w-4" />
                  {t.settings}
                </button>
              </div>
            )}
          </motion.div>
        </>,
        document.body
      )}
    </div>
  );
}

export default NotificationBell;

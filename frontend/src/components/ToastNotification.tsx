import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface ToastNotificationProps {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  onClose: (id: string) => void;
}

export function ToastNotification({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
}: ToastNotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-slate-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${getBgColor()} max-w-md`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
          {title}
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>
      </div>
      
      {/* Close Button */}
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <X className="h-4 w-4 text-slate-500" />
      </button>
      
      {/* Progress Bar */}
      {duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 rounded-b-xl origin-left"
        />
      )}
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    title: string;
    message: string;
    type: NotificationType;
  }>;
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center";
}

export function ToastContainer({
  toasts,
  onClose,
  position = "top-right",
}: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-[9999] space-y-3 pointer-events-none`}>
      <div className="space-y-3 pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastNotification
              key={toast.id}
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type}
              onClose={onClose}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}


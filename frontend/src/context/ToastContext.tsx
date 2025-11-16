import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ToastNotification';
import { NotificationType } from '../components/ToastNotification';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  // جعل showToast متاحاً على window للوصول إليه من NotificationContext
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showToast = showToast;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).showToast;
      }
    };
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onClose={removeToast} 
        position="top-right"
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}


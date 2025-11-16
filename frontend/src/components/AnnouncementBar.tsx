import { X, Sparkles, Gift } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api, endpoints } from "../utils/api";

interface AnnouncementBarProps {
  language: 'ar' | 'en';
  text?: string;            // اختياري: نص يُمرَّر من الأعلى
  cta?: string;             // اختياري: نص زر الدعوة
  autoFetch?: boolean;      // اجلب تلقائيًا من API
  endpoint?: string;        // مسار API لجلب الإعلان النشط
  forceVisible?: boolean;   // إجبار الظهور للاختبار، يتجاهل localStorage
  showWhenEmpty?: boolean;  // عرض شريط بمحتوى بديل إن لم يتوفر إعلان نشط
  emptyMessage?: string;    // نص بديل عند عدم وجود إعلان نشط
}

type RemoteAnnouncement = {
  text?: string;
  cta?: string;
  language?: 'ar' | 'en';
};

export function AnnouncementBar({ language, text, cta, autoFetch = true, endpoint, forceVisible = false, showWhenEmpty = false, emptyMessage }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [remote, setRemote] = useState<RemoteAnnouncement | null>(null);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    const dismissed = localStorage.getItem('announcementDismissed');
    if (dismissed === 'true') setIsVisible(false);
  }, [forceVisible]);

  useEffect(() => {
    if (!autoFetch) return;
    const fetchAnnouncement = async () => {
      try {
        const url = endpoint || endpoints.announcements.active;
        const { data } = await api.get(url, { params: { lang: language } });
        setRemote(data || null);
        if (data?.text) setIsVisible(true);
        console.log(data);
        console.log(language);

      } catch (e) {
        setRemote(null);
      }
    };
    fetchAnnouncement();
  }, [autoFetch, endpoint, language]);

  const handleClose = () => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    setIsVisible(false);
    localStorage.setItem('announcementDismissed', 'true');
  };

  // الاعتماد على الداتا القادمة من السيرفر فقط
  const activeText = remote?.text || '';
  const activeCta = remote?.cta || '';

  if (!isVisible && !forceVisible) return null;
  if (!activeText) {
    if (!showWhenEmpty) return null;
    const placeholder = emptyMessage || (language === 'ar' ? 'لا يوجد إعلان نشط حالياً' : 'No active announcement');
    return (
      <div 
        className="relative bg-muted text-muted-foreground fixed top-16 left-0 right-0 z-[99998] overflow-hidden"
        style={{ position: 'fixed', top: '64px', zIndex: 99998 }}
      >
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="flex items-center justify-between py-2 gap-3">
            <p className="text-xs sm:text-sm font-medium text-center flex-1">{placeholder}</p>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-gradient-to-r from-primary via-[#c01810] to-primary text-primary-foreground fixed top-16 left-0 right-0 z-[99998] overflow-hidden"
      style={{ position: 'fixed', top: '64px', zIndex: 99998 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-[10%] w-2 h-2 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-[30%] w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-[60%] w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-[85%] w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="flex items-center justify-between py-2 gap-3">
          <div className="flex items-center gap-2.5 flex-1 justify-center">
            <div className="hidden sm:flex items-center gap-2">
              <div className="relative">
                <Gift className="h-4 w-4 animate-bounce" />
                <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-center leading-tight sm:leading-normal">
              {activeText}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeCta && (
              <Button
                size="sm"
                variant="secondary"
                className="group relative bg-white/95 hover:bg-white text-primary border-0 backdrop-blur-sm text-xs h-7 px-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10 font-semibold">{activeCta}</span>
              </Button>
            )}
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Home, Building2, Wifi, Gauge, Headphones, FileText, Users, Mail, X } from 'lucide-react';

interface FixedNavProps {
  onNavigate?: (page: string) => void;
}

export function FixedNav({ onNavigate }: FixedNavProps) {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'home-internet', label: 'إنترنت المنزل', icon: Wifi },
    { id: 'business-internet', label: 'إنترنت الأعمال', icon: Building2 },
    { id: 'speed-test', label: 'اختبار السرعة', icon: Gauge },
    { id: 'support', label: 'الدعم الفني', icon: Headphones },
    { id: 'about', label: 'من نحن', icon: FileText },
    { id: 'contact', label: 'تواصل معنا', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      // Fallback navigation
      const pageMap: { [key: string]: string } = {
        'home': '/',
        'home-internet': '/home-internet',
        'business-internet': '/business-internet',
        'speed-test': '/speed-test',
        'support': '/support',
        'about': '/about',
        'contact': '/contact',
      };
      window.location.href = pageMap[id] || '/';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-primary text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
      >
        <span className="text-sm font-bold">عرض القائمة</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-slideUp">
      <div className="bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl px-4 py-3">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl hover:bg-primary/10 transition-all group min-w-[70px]"
              >
                <Icon className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center px-3 py-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

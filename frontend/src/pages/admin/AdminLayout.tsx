import React from 'react';
import { LogOut, Bell, Home, Menu, X } from 'lucide-react';
// أضف باقي الأيقونات المطلوبة إذا ظهرت في الكود المنسوخ

// مكون AdminLayout
interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  // من كود AdminDashboard
  const FixedNavBar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <button
            onClick={() => window.location.href = '/admin'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-all group"
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">لوحة التحكم</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors group">
            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[#c01810] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
              أ
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold">الأدمن</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('admin_token');
              window.location.href = '/login';
            }}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 group"
          >
            <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <FixedNavBar />
      <div className="pt-[60px] pb-6 px-2 sm:px-4 bg-background min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;













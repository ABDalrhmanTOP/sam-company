import React, { useState, useEffect } from 'react';
import { requireAuth, removeAuthToken } from '../../utils/auth';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Star,
  Shield,
  Bell,
  LogOut,
  Menu,
  X,
  Package,
  Headphones,
  HelpCircle,
  Phone,
  Mail,
  Gauge,
  ArrowRight,
  Activity,
  Zap,
  Home,
  Sparkles,
  Edit,
  Save,
  Plus,
  Trash2,
  Database
} from 'lucide-react';
import { ManageBenefitsPage } from './ManageBenefitsPage';
import { ManagePackagesPage } from './ManagePackagesPage';
import { ManageSupportInfoPage } from './ManageSupportInfoPage';
import { ManageFaqsPage } from './ManageFaqsPage';
import { ManageContactInfoPage } from './ManageContactInfoPage';
import { ManageMessagesPage } from './ManageMessagesPage';
import { ManageUsersPage } from './ManageUsersPage';
import { ManageSpeedTestSettingsPage } from './ManageSpeedTestSettingsPage';
import { ManagePremiumServicesPage } from './ManagePremiumServicesPage';
import ManageAboutPage from './ManageAboutPage';
import { ManageAnnouncementsPage } from './ManageAnnouncementsPage';
import { ProfilePage } from './ProfilePage';
import { ManageNotificationsPage } from './ManageNotificationsPage';
import { NotificationBell } from '../../components/NotificationBell';
import axios from 'axios';

type ViewType = 'overview' | 'benefits' | 'packages' | 'support' | 'faqs' | 'contact' | 'messages' | 'users' | 'speed-test' | 'premium-services' | 'about-page' | 'announcements' | 'profile' | 'notifications';

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [user, setUser] = useState<{ name?: string; is_admin?: boolean; permissions?: string[] } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [permDenied, setPermDenied] = useState(false);
  const [statistics, setStatistics] = useState<{
    users?: { total?: number; change?: string };
    messages?: { total?: number; change?: string; unread?: number };
    benefits?: { active?: number; total?: number; change?: string };
    support_info?: { active?: number; total?: number; change?: string };
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    requireAuth();
    axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    })
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    if (currentView === 'overview') {
      fetchStatistics();
    }
  }, [currentView]);

  const fetchStatistics = async () => {
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/statistics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const VIEW_PERMS: { [key in ViewType]?: string } = {
    benefits: 'manage_benefits',
    packages: 'manage_packages',
    support: 'manage_support_info',
    faqs: 'manage_faqs',
    contact: 'manage_contact_info',
    messages: 'manage_messages',
    users: 'manage_users',
    'speed-test': 'manage_speed_test_settings',
    'premium-services': 'manage_premium_services',
    'about-page': 'manage_about_page',
    announcements: 'manage_announcements',
    notifications: 'manage_notifications',
    overview: 'view_dashboard',
  };

  const isAllowed = (perm: string | undefined) => {
    if (!perm) return true;
    if (user?.is_admin) return true;
    return user?.permissions?.includes(perm);
  };

  const handleLogout = () => {
    removeAuthToken();
    toast.success('تم تسجيل الخروج بنجاح');
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard, color: 'text-primary' },
    { id: 'benefits', label: 'إدارة المزايا', icon: Star, color: 'text-[#c01810]' },
    { id: 'packages', label: 'إدارة الباقات', icon: Package, color: 'text-[#a01810]' },
    { id: 'support', label: 'معلومات الدعم الفني', icon: Headphones, color: 'text-primary' },
    { id: 'faqs', label: 'الأسئلة الشائعة', icon: HelpCircle, color: 'text-[#c01810]' },
    { id: 'contact', label: 'معلومات الاتصال', icon: Phone, color: 'text-[#a01810]' },
    { id: 'messages', label: 'الرسائل', icon: Mail, color: 'text-primary' },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, color: 'text-[#c01810]' },
    { id: 'speed-test', label: 'اختبار السرعة', icon: Gauge, color: 'text-[#a01810]' },
    { id: 'premium-services', label: 'الخدمات المتميزة', icon: Star, color: 'text-primary' },
    { id: 'about-page', label: 'صفحة من نحن', icon: FileText, color: 'text-[#c01810]' },
    { id: 'announcements', label: 'إدارة الإعلانات', icon: Sparkles, color: 'text-yellow-400' },
    { id: 'notifications', label: 'إدارة الإشعارات', icon: Bell, color: 'text-primary' },
  ];

  const formatNumber = (num: number) => {
    return num.toLocaleString('ar-SA');
  };

  const getStatsCards = () => {
    if (!statistics) {
      return [
        { title: 'إجمالي المستخدمين', value: '...', icon: Users, color: 'text-blue-500', change: '', bg: 'bg-primary/5 dark:bg-primary/10', description: 'جاري التحميل' },
        { title: 'إجمالي الرسائل', value: '...', icon: FileText, color: 'text-red-500', change: '', bg: 'bg-[#c01810]/5 dark:bg-[#c01810]/10', description: 'جاري التحميل' },
        { title: 'المزايا النشطة', value: '...', icon: Star, color: 'text-purple-500', change: '', bg: 'bg-[#a01810]/5 dark:bg-[#a01810]/10', description: 'جاري التحميل' },
        { title: 'معلومات الدعم الفني', value: '...', icon: Headphones, color: 'text-orange-500', change: '', bg: 'bg-primary/5 dark:bg-primary/10', description: 'جاري التحميل' },
      ];
    }

    return [
      { 
        title: 'إجمالي المستخدمين', 
        value: formatNumber(statistics.users?.total || 0), 
        icon: Users, 
        color: 'text-blue-500', 
        change: statistics.users?.change || '0%', 
        bg: 'bg-primary/5 dark:bg-primary/10', 
        description: 'مستخدم نشط' 
      },
      { 
        title: 'إجمالي الرسائل', 
        value: formatNumber(statistics.messages?.total || 0), 
        icon: FileText, 
        color: 'text-red-500', 
        change: statistics.messages?.change || '0%', 
        bg: 'bg-[#c01810]/5 dark:bg-[#c01810]/10', 
        description: `${statistics.messages?.unread || 0} رسالة غير مقروءة` 
      },
      { 
        title: 'المزايا النشطة', 
        value: formatNumber(statistics.benefits?.active || 0), 
        icon: Star, 
        color: 'text-purple-500', 
        change: statistics.benefits?.change || '0%', 
        bg: 'bg-[#a01810]/5 dark:bg-[#a01810]/10', 
        description: `${statistics.benefits?.total || 0} ميزة متاحة` 
      },
      { 
        title: 'معلومات الدعم الفني', 
        value: formatNumber(statistics.support_info?.active || 0), 
        icon: Headphones, 
        color: 'text-orange-500', 
        change: statistics.support_info?.change || '0%', 
        bg: 'bg-primary/5 dark:bg-primary/10', 
        description: `${statistics.support_info?.total || 0} معلومات متاحة` 
      },
    ];
  };

  const quickActions = [
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, color: 'from-blue-500 to-blue-600', view: 'users' as ViewType },
    { id: 'benefits', label: 'إدارة المزايا', icon: Star, color: 'from-green-500 to-green-600', view: 'benefits' as ViewType },
    { id: 'packages', label: 'إدارة الباقات', icon: Package, color: 'from-purple-500 to-purple-600', view: 'packages' as ViewType },
    { id: 'support', label: 'معلومات الدعم', icon: Headphones, color: 'from-orange-500 to-orange-600', view: 'support' as ViewType },
    { id: 'faqs', label: 'الأسئلة الشائعة', icon: HelpCircle, color: 'from-blue-500 to-blue-600', view: 'faqs' as ViewType },
    { id: 'contact', label: 'معلومات الاتصال', icon: Phone, color: 'from-green-500 to-green-600', view: 'contact' as ViewType },
    { id: 'messages', label: 'الرسائل', icon: Mail, color: 'from-purple-500 to-purple-600', view: 'messages' as ViewType },
    { id: 'speed-test', label: 'اختبار السرعة', icon: Gauge, color: 'from-orange-500 to-orange-600', view: 'speed-test' as ViewType },
    { id: 'premium-services', label: 'الخدمات المتميزة', icon: Star, color: 'from-yellow-500 to-orange-500', view: 'premium-services' as ViewType },
    { id: 'about-page', label: 'صفحة من نحن', icon: FileText, color: 'from-indigo-500 to-purple-500', view: 'about-page' as ViewType },
    { id: 'announcements', label: 'إدارة الإعلانات', icon: Sparkles, color: 'from-yellow-500 to-orange-500', view: 'announcements' as ViewType },
  ];

  const menuItemsFiltered = menuItems.filter((item) => isAllowed(VIEW_PERMS[item.id as ViewType]));
  const quickActionsFiltered = quickActions.filter((action) => isAllowed(VIEW_PERMS[action.id as ViewType]));

  const NoPermission = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <span className="text-6xl text-red-400 mb-4">🚫</span>
      <h2 className="font-bold text-2xl mb-2">ليس لديك صلاحية للدخول إلى هذا القسم</h2>
      <p className="text-md text-muted-foreground">يرجى مراجعة الأدمن الرئيسي إذا كنت تعتقد أن هناك خطأ.</p>
    </div>
  );

  useEffect(() => {
    if (currentView === 'overview') {
      setPermDenied(false);
      return;
    }
    const perm = VIEW_PERMS[currentView as ViewType];
    if (!isAllowed(perm)) {
      setPermDenied(true);
    } else {
      setPermDenied(false);
    }
  }, [currentView, user]);

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full" />
      </div>
    );
  }

  const PlaceholderView = ({ title }: { title: string }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">سيتم عرض المحتوى هنا في التطبيق الفعلي</p>
      <div className="text-center py-12 space-y-4">
        <Database className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto" />
        <div>
          <p className="text-slate-500 dark:text-slate-400 mb-2">قيد التطوير</p>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    if (permDenied) return <NoPermission />;
    switch (currentView) {
      case 'benefits':
        return <ManageBenefitsPage />;
      case 'packages':
        return <ManagePackagesPage />;
      case 'support':
        return <ManageSupportInfoPage />;
      case 'faqs':
        return <ManageFaqsPage />;
      case 'contact':
        return <ManageContactInfoPage />;
      case 'messages':
        return <ManageMessagesPage />;
      case 'users':
        return <ManageUsersPage />;
      case 'speed-test':
        return <ManageSpeedTestSettingsPage />;
      case 'premium-services':
        return <ManagePremiumServicesPage />;
      case 'about-page':
        return <ManageAboutPage />;
      case 'announcements':
        return <ManageAnnouncementsPage />;
      case 'notifications':
        return <ManageNotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <aside className={`
      fixed lg:static left-0 z-40 w-72 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-700/50
      transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      shadow-2xl lg:shadow-none
      ${currentView === 'overview' ? 'top-0' : 'top-[60px]'}
    `}>
      <div className={`h-full overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent ${currentView === 'overview' ? '' : 'pt-4'}`}>
        <nav className="space-y-2 px-6">
          {menuItemsFiltered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                  ${currentView === item.id 
                    ? 'bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 text-primary shadow-lg border border-primary/20' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:shadow-md'
                  }
                `}
              >
                {/* Background effect for active item */}
                {currentView === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl"></div>
                )}
                
                <div className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                  currentView === item.id 
                    ? 'bg-gradient-to-br from-primary to-[#c01810] shadow-lg' 
                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-primary/10'
                }`}>
                  <Icon className={`h-5 w-5 transition-all duration-300 ${
                    currentView === item.id 
                      ? 'text-white scale-110' 
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-primary group-hover:scale-110'
                  }`} />
                </div>
                
                <span className={`font-semibold text-sm transition-colors duration-300 ${
                  currentView === item.id 
                    ? 'text-primary' 
                    : 'text-slate-700 dark:text-slate-300 group-hover:text-primary'
                }`}>
                  {item.label}
                </span>
                
                {currentView === item.id && (
                  <div className="mr-auto">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-lg"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );

  const getStyles = () => {
    const leftPosition = currentView === 'overview' ? '50%' : '0';
    return (
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        @keyframes wave {
          0%, 100% {
            transform: translateX(-50%) translateY(0) scaleY(1);
          }
          50% {
            transform: translateX(-50%) translateY(-25px) scaleY(0.9);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .wave-background {
          position: absolute;
          bottom: 0;
          left: ${leftPosition};
          right: 0;
          width: 200%;
          height: 200px;
          background: linear-gradient(180deg, transparent, rgba(220, 38, 38, 0.03), rgba(220, 38, 38, 0.05));
          border-radius: 100% 100% 0 0;
          animation: wave 10s ease-in-out infinite;
        }
        .wave-background-2 {
          position: absolute;
          bottom: 0;
          left: ${leftPosition};
          right: 0;
          width: 200%;
          height: 180px;
          background: linear-gradient(180deg, transparent, rgba(192, 24, 16, 0.03), rgba(192, 24, 16, 0.04));
          border-radius: 100% 100% 0 0;
          animation: wave 12s ease-in-out infinite;
          animation-delay: -2s;
        }
        .wave-background-3 {
          position: absolute;
          bottom: 0;
          left: ${leftPosition};
          right: 0;
          width: 200%;
          height: 160px;
          background: linear-gradient(180deg, transparent, rgba(160, 24, 16, 0.02), rgba(160, 24, 16, 0.03));
          border-radius: 100% 100% 0 0;
          animation: wave 14s ease-in-out infinite;
          animation-delay: -4s;
        }
      `}</style>
    );
  };

  const FixedNavBar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <button
            onClick={() => setCurrentView('overview')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-all group"
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">العودة</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-[#c01810] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0)?.toUpperCase() || 'أ'}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold">{user?.name || 'الأدمن'}</p>
                <p className="text-xs text-muted-foreground">الملف الشخصي</p>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 group"
            >
              <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentView !== 'overview') {
    return (
      <>
        {getStyles()}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
          {/* Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-primary/25 via-[#c01810]/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-[#662020]/25 via-[#a01810]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
            
            {/* Wave Backgrounds */}
            <div className="wave-background"></div>
            <div className="wave-background-2"></div>
            <div className="wave-background-3"></div>
          </div>

          <FixedNavBar />
          <div className="flex pt-[60px]">
            {renderSidebar()}
            <main className="flex-1 min-h-[calc(100vh-60px)] p-8 lg:p-10">
              {renderView()}
            </main>
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {getStyles()}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Multiple animated gradient orbs */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-primary/25 via-[#c01810]/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-[#662020]/25 via-[#a01810]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/20 via-[#c01810]/15 to-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-bl from-[#c01810]/15 via-primary/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: "4.5s" }} />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-gradient-to-tr from-primary/15 via-[#a01810]/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2.5s" }} />
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
        
        {/* More floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/40 rounded-full animate-float shadow-lg" style={{ animationDelay: "0s" }} />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-[#c01810]/50 rounded-full animate-float shadow-lg" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-primary/35 rounded-full animate-float shadow-lg" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#a01810]/45 rounded-full animate-float shadow-lg" style={{ animationDelay: "1s" }} />
        <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-primary/30 rounded-full animate-float shadow-lg" style={{ animationDelay: "3.5s" }} />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-[#c01810]/40 rounded-full animate-float shadow-lg" style={{ animationDelay: "5.5s" }} />
        
        {/* Subtle radial gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-primary/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-radial-gradient from-[#c01810]/5 via-transparent to-transparent" />
        
        {/* Wave Backgrounds */}
        <div className="wave-background"></div>
        <div className="wave-background-2"></div>
        <div className="wave-background-3"></div>
      </div>

      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-3xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50 shadow-2xl overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-[#c01810]/5"></div>
        
        <div className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-[#c01810]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {sidebarOpen ? <X className="h-6 w-6 group-hover:scale-110 transition-transform" /> : <Menu className="h-6 w-6 group-hover:scale-110 transition-transform" />}
                </div>
              </button>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#c01810] to-primary rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#c01810] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-105"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary via-[#c01810] to-[#a01810] shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/30">
                    <Shield className="h-8 w-8 text-white drop-shadow-lg" />
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                  </div>
                  {/* Enhanced status indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800 animate-pulse shadow-lg">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-0 bg-emerald-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-[#c01810] to-[#a01810] bg-clip-text text-transparent tracking-tight">
                    لوحة تحكم الأدمن
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
                    <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                    النظام يعمل بشكل طبيعي
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell onNavigate={setCurrentView} />
              <button
                onClick={() => setCurrentView('profile')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-[#c01810]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[#c01810] flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                  {user?.name?.charAt(0)?.toUpperCase() || 'أ'}
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.name || 'الأدمن'}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">الملف الشخصي</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <LogOut className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-8 lg:p-10">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-primary">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                        مرحباً بك! 👋
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        لوحة تحكم شاملة ومتطورة
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">النظام نشط</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">آخر تحديث: الآن</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">متصل</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">اتصال مستقر</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">آمن</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">مشفر بالكامل</p>
                      </div>
                    </div>
                </div>
                  
                </div>
                
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {getStatsCards().map((stat, index) => {
              const Icon = stat.icon;
              
              let gradientBg = '';
              let cardBorder = 'border-slate-200/50 dark:border-slate-700/50';
              
              if (index === 0) {
                gradientBg = 'bg-gradient-to-br from-blue-500 to-blue-600';
              } else if (index === 1) {
                gradientBg = 'bg-gradient-to-br from-green-500 to-green-600';
                cardBorder = 'border-green-400/80 dark:border-green-500/80 ring-2 ring-green-200/50 dark:ring-green-800/50';
              } else if (index === 2) {
                gradientBg = 'bg-gradient-to-br from-purple-500 to-purple-600';
              } else if (index === 3) {
                gradientBg = 'bg-gradient-to-br from-orange-500 to-orange-600';
              }
              
              return (
                <div
                  key={stat.title}
                  className={`${index === 1 ? 'bg-green-50/80 dark:bg-green-900/20' : 'bg-white/95 dark:bg-slate-800/95'} backdrop-blur-sm rounded-xl border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${cardBorder}`}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 ${gradientBg} ${index === 1 ? 'opacity-30 group-hover:opacity-40' : 'opacity-20 group-hover:opacity-30'} transition-opacity duration-300`}></div>
                  
                  {/* Additional accents for each card */}
                  {index === 0 && (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-500/15 rounded-full blur-lg"></div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/30 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-500/25 rounded-full blur-lg"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-500/15 rounded-full blur-lg"></div>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-orange-500/15 rounded-full blur-lg"></div>
                    </>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${gradientBg} shadow-lg ring-2 ring-white/20`}>
                        <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                    </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</h3>
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
                      <p className="text-sm text-slate-500 dark:text-slate-500">{stat.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black flex items-center gap-4 text-slate-900 dark:text-slate-100">
                <span className="p-4 rounded-3xl bg-gradient-to-br from-primary to-[#c01810] shadow-2xl relative overflow-hidden">
                  <Zap className="h-7 w-7 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </span>
                إجراءات سريعة
              </h3>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">جميع الخدمات متاحة</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActionsFiltered.map((action, index) => {
                const Icon = action.icon;
                
                let cardBg = 'bg-white/90 dark:bg-slate-800/90';
                let cardBorder = 'border-slate-200/60 dark:border-slate-700/60';
                
                if (action.id === 'users' || action.id === 'faqs') {
                  cardBg = 'bg-blue-50/80 dark:bg-blue-900/20';
                  cardBorder = 'border-blue-300/70 dark:border-blue-600/70';
                } else if (action.id === 'benefits' || action.id === 'contact') {
                  cardBg = 'bg-green-50/80 dark:bg-green-900/20';
                  cardBorder = 'border-green-300/70 dark:border-green-600/70';
                } else if (action.id === 'packages' || action.id === 'messages') {
                  cardBg = 'bg-purple-50/80 dark:bg-purple-900/20';
                  cardBorder = 'border-purple-300/70 dark:border-purple-600/70';
                } else if (action.id === 'support' || action.id === 'speed-test') {
                  cardBg = 'bg-orange-50/80 dark:bg-orange-900/20';
                  cardBorder = 'border-orange-300/70 dark:border-orange-600/70';
                }
                
                return (
                  <div
                    key={action.id}
                    onClick={() => setCurrentView(action.view)}
                    className={`${cardBg} backdrop-blur-3xl border rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden relative ${cardBorder}`}
                  >
                    {/* Enhanced Decorative Elements */}
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${action.color} opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>
                    <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r ${action.color} opacity-10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500`}></div>
                    
                    {/* Additional accent for better visibility */}
                    <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-br ${action.color} opacity-30 rounded-full blur-sm`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-5 bg-gradient-to-br ${action.color} rounded-3xl shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden ring-4 ring-transparent group-hover:ring-white/20`}>
                          <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                          {/* Enhanced shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors duration-300">{action.label}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors duration-300 font-semibold">
                        <span>إدارة</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span>متاح</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </>
  );
}

export default AdminDashboard;

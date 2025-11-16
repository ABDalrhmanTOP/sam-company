import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./context/ToastContext";
import { Navigation, PageType, Language } from "./components/Navigation";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Footer } from "./components/Footer";
import { FixedNav } from "./components/FixedNav";
import { HomePage } from "./pages/HomePage";
import { HomeInternetPage } from "./pages/HomeInternetPage";
import { BusinessInternetPage } from "./pages/BusinessInternetPage";
import { SpeedTestPage } from "./pages/SpeedTestPage";
import { SupportPage } from "./pages/SupportPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { ManageBenefitsPage } from "./pages/admin/ManageBenefitsPage";
import { ManagePackagesPage } from "./pages/admin/ManagePackagesPage";
import { ManageSupportInfoPage } from "./pages/admin/ManageSupportInfoPage";
import { ManageFaqsPage } from "./pages/admin/ManageFaqsPage";
import { ManageSpeedTestSettingsPage } from "./pages/admin/ManageSpeedTestSettingsPage";
import { ManageContactInfoPage } from "./pages/admin/ManageContactInfoPage";
import { ManageMessagesPage } from "./pages/admin/ManageMessagesPage";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { ManagePremiumServicesPage } from "./pages/admin/ManagePremiumServicesPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('ar');
  
  // Check if we're on admin pages
  const isManageBenefitsPage = window.location.pathname === '/manage-benefits';
  const isManagePackagesPage = window.location.pathname === '/manage-packages';
  const isManageSupportInfoPage = window.location.pathname === '/manage-support-info';
  const isManageFaqsPage = window.location.pathname === '/manage-faqs';
  const isManageSpeedTestSettingsPage = window.location.pathname === '/manage-speed-test-settings';
  const isManageContactInfoPage = window.location.pathname === '/manage-contact-info';
  const isManageMessagesPage = window.location.pathname === '/manage-messages';
  const isManageUsersPage = window.location.pathname === '/manage-users';
  const isManagePremiumServicesPage = window.location.pathname === '/manage-premium-services';
  const isLoginPage = window.location.pathname === '/login';
  const isAdminDashboard = window.location.pathname === '/admin';

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    if (savedLanguage === 'en') {
      setLanguage('en');
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    } else {
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', String(newValue));
      
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newValue;
    });
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => {
      const newLang: Language = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('language', newLang);
      
      document.documentElement.setAttribute('lang', newLang);
      document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
      
      return newLang;
    });
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    // Scroll to top instantly when navigating between pages
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} language={language} />;
      case 'home-internet':
        return <HomeInternetPage onNavigate={handleNavigate} language={language} />;
      case 'business-internet':
        return <BusinessInternetPage onNavigate={handleNavigate} language={language} />;
      case 'speed-test':
        return <SpeedTestPage onNavigate={handleNavigate} language={language} />;
      case 'support':
        return <SupportPage onNavigate={handleNavigate} language={language} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} language={language} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} language={language} />;
      default:
        return <HomePage onNavigate={handleNavigate} language={language} />;
    }
  };

  // If on manage benefits page, render it without navigation
  if (isManageBenefitsPage) {
    return <ManageBenefitsPage />;
  }

  // If on manage packages page, render it without navigation
  if (isManagePackagesPage) {
    return <ManagePackagesPage />;
  }

  // If on manage support info page, render it without navigation
  if (isManageSupportInfoPage) {
    return <ManageSupportInfoPage />;
  }

  // If on manage FAQs page, render it without navigation
  if (isManageFaqsPage) {
    return <ManageFaqsPage />;
  }

  // If on manage speed test settings page, render it without navigation
  if (isManageSpeedTestSettingsPage) {
    return <ManageSpeedTestSettingsPage />;
  }

  // If on manage contact info page, render it without navigation
  if (isManageContactInfoPage) {
    return <ManageContactInfoPage />;
  }

  // If on manage messages page, render it without navigation
  if (isManageMessagesPage) {
    return <ManageMessagesPage />;
  }

  // If on manage users page, render it without navigation
  if (isManageUsersPage) {
    return <ManageUsersPage />;
  }

  // If on manage premium services page, render it without navigation
  if (isManagePremiumServicesPage) {
    return <ManagePremiumServicesPage />;
  }

  // If on login page, render it without navigation
  if (isLoginPage) {
    return (
      <>
        <Toaster 
          position="top-center"
          richColors
          closeButton
          expand={true}
          visibleToasts={5}
          toastOptions={{
            className: 'font-arabic',
            duration: 4000,
          }}
        />
        <LoginPage />
      </>
    );
  }

  // If on admin dashboard, render it without navigation
  if (isAdminDashboard) {
    return (
      <ToastProvider>
        <NotificationProvider>
          <Toaster 
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              className: 'font-arabic',
            }}
          />
          <AdminDashboard />
        </NotificationProvider>
      </ToastProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background s-wave-background transition-colors duration-300">
      <Toaster 
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          className: 'font-arabic',
        }}
      />
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />
      <AnnouncementBar 
        language={language}
      />
      <main className="pt-24">
        {renderCurrentPage()}
      </main>
      <Footer language={language} />
      <FixedNav onNavigate={handleNavigate} />
    </div>
  );
}

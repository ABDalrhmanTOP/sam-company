import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { PageType, Language, Navigation } from "../components/Navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle2,
  ShieldCheck,
  Settings,
  BarChart3,
  Database,
  Verified,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function LoginPage() {
  const [language, setLanguage] = useState<Language>('ar');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize language and dark mode
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (savedLanguage === 'en') {
      setLanguage('en');
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    } else {
      setLanguage('ar');
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    }

    if (savedDarkMode) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load saved credentials if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavigate = (page: PageType) => {
    if (page === 'home') {
      window.location.href = '/';
    } else {
      window.location.href = `/${page}`;
    }
  };

  const content = {
    ar: {
      pageTitle: "لوحة تحكم الأدمن",
      pageDescription: "سجل دخولك للوصول إلى لوحة التحكم",
      welcomeBack: "لوحة الإدارة",
      secureLogin: "منطقة محمية - للمشرفين فقط",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "admin@samnet.sy",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      rememberMe: "تذكر تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      loginButton: "دخول لوحة التحكم",
      loggingIn: "جارِ التحقق...",
      adminOnly: "منطقة إدارية",
      restrictedAccess: "محدود للمشرفين فقط",
      backToHome: "العودة للرئيسية",
      features: {
        secure: "تشفير متقدم",
        fast: "وصول آمن",
        support: "حماية كاملة",
      },
      management: {
        title: "إدارة شاملة للموقع",
        items: [
          "إدارة الباقات والأسعار",
          "متابعة الطلبات والاشتراكات",
          "إدارة المحتوى والعروض",
          "تقارير وإحصائيات متقدمة",
        ],
      },
      security: {
        title: "نظام أمان متقدم",
        subtitle: "حماية بيانات الموقع والعملاء بأعلى معايير الأمان",
      },
      loginSuccess: "✅ تم تسجيل الدخول بنجاح!",
      loginSuccessDesc: "مرحباً بك في لوحة التحكم، جاري التوجيه...",
      loginError: "❌ فشل تسجيل الدخول",
      loginErrorDesc: "يرجى التحقق من بيانات الدخول والمحاولة مرة أخرى",
      errorTitle: "خطأ في تسجيل الدخول",
    },
    en: {
      pageTitle: "Admin Dashboard",
      pageDescription: "Sign in to access the control panel",
      welcomeBack: "Admin Panel",
      secureLogin: "Protected Area - Admins Only",
      emailLabel: "Email Address",
      emailPlaceholder: "admin@samnet.sy",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      rememberMe: "Keep me signed in",
      forgotPassword: "Forgot password?",
      loginButton: "Access Dashboard",
      loggingIn: "Verifying...",
      adminOnly: "Admin Area",
      restrictedAccess: "Restricted to Administrators",
      backToHome: "Back to Home",
      features: {
        secure: "Advanced encryption",
        fast: "Secure access",
        support: "Full protection",
      },
      management: {
        title: "Complete Site Management",
        items: [
          "Manage packages & pricing",
          "Track orders & subscriptions",
          "Manage content & offers",
          "Advanced reports & analytics",
        ],
      },
      security: {
        title: "Advanced Security System",
        subtitle: "Protecting site and customer data with highest security standards",
      },
      loginSuccess: "✅ Login Successful!",
      loginSuccessDesc: "Welcome to your dashboard, redirecting...",
      loginError: "❌ Login Failed",
      loginErrorDesc: "Please check your credentials and try again",
      errorTitle: "Login Error",
    },
  };

  const t = content[language];
  const isRTL = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
        device_name: 'web'
      }, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const { user, token } = response.data;

      // Store token and user in localStorage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Set axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Enhanced success notification - use toast.promise for better reliability
      toast.success(t.loginSuccess, {
        description: t.loginSuccessDesc,
        icon: <Verified className="h-6 w-6 text-white" />,
        duration: 3000,
        className: language === 'ar' ? 'rtl:font-arabic' : '',
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
          fontSize: '16px',
          fontWeight: '600',
          padding: '16px 20px',
        },
        onDismiss: () => {
          // Ensure navigation happens even if toast is dismissed
        },
      });
      
      // Wait a bit longer before redirecting to ensure toast is visible
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMsg = error.response?.data?.message || 
        (error.response?.data?.errors ? Object.values(error.response.data.errors)[0]?.[0] : null) ||
        t.loginErrorDesc;
      
      setErrorMessage(errorMsg);
      
      // Use toast.error with explicit configuration
      const toastId = toast.error(t.loginError, {
        description: errorMsg || t.loginErrorDesc,
        icon: <AlertCircle className="h-6 w-6 text-white" />,
        duration: 5000,
        className: language === 'ar' ? 'rtl:font-arabic' : '',
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 15px 35px rgba(239, 68, 68, 0.4)',
          fontSize: '16px',
          fontWeight: '600',
          padding: '16px 20px',
        },
        id: `login-error-${Date.now()}`, // Unique ID to prevent duplicates
      });
    } finally {
      // Delay setting loading to false slightly to ensure toast appears
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation Bar */}
      <Navigation
        currentPage="home"
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Area */}
      <div className="pt-24 pb-20 relative min-h-[calc(100vh-6rem)]">
        {/* Spacer to account for fixed navigation bar (h-16 = 64px) */}
        <div className="h-20 sm:h-24"></div>
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(102,32,32,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(160,24,16,0.06),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-glow" />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#c01810]/10 via-transparent to-transparent rounded-full blur-3xl animate-glow"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-[#c01810]/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "3s" }}
          />
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-start lg:items-center min-h-[600px]">
              
              {/* Right Side - Admin Features Info (First on mobile, second on desktop) */}
              <div className={`order-1 lg:order-2 space-y-6 lg:space-y-8 ${isRTL ? 'lg:pr-8' : 'lg:pl-8'}`}>
                {/* Header Section */}
                <div className="space-y-4 text-center lg:text-right">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong rounded-full border border-amber-500/30 mx-auto lg:mx-0">
                    <Settings className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                      {t.pageTitle}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-primary via-[#a01810] to-primary bg-clip-text text-transparent leading-tight">
                    {t.management.title}
                  </h1>
                  
                  <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                    {t.security.subtitle}
                  </p>
                </div>

                {/* Management Features List */}
                <div className="space-y-3 lg:space-y-4 max-w-xl mx-auto lg:mx-0">
                  {t.management.items.map((item, index) => {
                    const icons = [BarChart3, Database, Settings, CheckCircle2];
                    const ItemIcon = icons[index] || CheckCircle2;
                    
                    return (
                      <div
                        key={index}
                        className={`group flex items-start gap-3 lg:gap-4 glass-card-strong p-4 lg:p-5 rounded-xl lg:rounded-2xl hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] border border-primary/10 ${isRTL ? '' : 'flex-row-reverse'}`}
                      >
                        <div className="flex-shrink-0 p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors duration-300 border border-primary/20">
                          <ItemIcon className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                        </div>
                        <p className={`text-sm lg:text-base text-foreground/90 leading-relaxed font-medium flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {item}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Admin Stats */}
                <div className="glass-card-strong p-5 lg:p-6 rounded-xl lg:rounded-2xl border border-primary/10 max-w-xl mx-auto lg:mx-0">
                  <div className={`flex items-center gap-3 mb-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                      <ShieldCheck className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
                    </div>
                    <h3 className="text-base lg:text-lg font-bold text-foreground">
                      {t.security.title}
                    </h3>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-2 lg:gap-3">
                    {[
                      { value: "SSL", label: language === "ar" ? "تشفير" : "Encryption" },
                      { value: "2FA", label: language === "ar" ? "مصادقة" : "Auth" },
                      { value: "24/7", label: language === "ar" ? "مراقبة" : "Monitor" },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="flex-1 text-center p-2.5 lg:p-3 bg-background/50 rounded-lg lg:rounded-xl border border-border/50"
                      >
                        <div className="text-lg lg:text-xl xl:text-2xl font-black bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Left Side - Login Form (Second on mobile, first on desktop) */}
              <div className={`order-2 lg:order-1 ${isRTL ? 'lg:pr-8' : 'lg:pl-8'}`}>
                <Card className="glass-card-strong border-primary/10 shadow-2xl overflow-hidden relative max-w-lg mx-auto lg:mx-0">
                  {/* Decorative Top Bar */}
                  <div className="h-1.5 lg:h-2 bg-gradient-to-r from-amber-500 via-primary to-amber-500" />
                  
                  {/* Warning Badge */}
                  <div className={`absolute top-4 lg:top-6 ${isRTL ? 'left-4 lg:left-6' : 'right-4 lg:right-6'} z-10`}>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-primary/20 border border-amber-500/30 rounded-lg backdrop-blur-sm">
                      <ShieldCheck className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-amber-500" />
                      <span className="text-xs font-bold text-amber-500">
                        {t.adminOnly}
                      </span>
                    </div>
                  </div>

                  {/* Card Header */}
                  <CardHeader className="space-y-3 lg:space-y-4 pt-16 lg:pt-20 pb-4 lg:pb-6">
                    {/* Security Badge */}
                    <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 glass-card border border-primary/20 rounded-full w-fit">
                      <Shield className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary animate-pulse" />
                      <span className="text-xs lg:text-sm font-semibold text-primary">
                        {t.secureLogin}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <CardTitle className="text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-r from-primary via-[#a01810] to-primary bg-clip-text text-transparent">
                        {t.welcomeBack}
                      </CardTitle>
                      <CardDescription className="text-sm lg:text-base flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
                        {t.restrictedAccess}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="space-y-5 lg:space-y-6 px-4 lg:px-6 pb-4 lg:pb-6">
                    {/* Error Message */}
                    {errorMessage && (
                      <div className={`p-3 lg:p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-800/50 flex items-start gap-3 shadow-lg ${isRTL ? '' : 'flex-row-reverse'}`}>
                        <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold mb-1 text-sm lg:text-base">{t.errorTitle}</p>
                          <p className="text-xs lg:text-sm text-red-600 dark:text-red-300">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                      {/* Email Field */}
                      <div className="space-y-2 lg:space-y-2.5">
                        <Label htmlFor="email" className={`text-xs lg:text-sm flex items-center gap-2 ${isRTL ? '' : 'flex-row-reverse'}`}>
                          <Mail className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                          {t.emailLabel}
                        </Label>
                        <div className="relative group">
                          <Input
                            id="email"
                            type="email"
                            placeholder={t.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 lg:h-12 px-4 bg-background/50 border-border hover:border-primary/40 focus:border-primary transition-all duration-300 rounded-xl text-sm lg:text-base"
                            required
                            dir="ltr"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2 lg:space-y-2.5">
                        <Label htmlFor="password" className={`text-xs lg:text-sm flex items-center gap-2 ${isRTL ? '' : 'flex-row-reverse'}`}>
                          <Lock className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                          {t.passwordLabel}
                        </Label>
                        <div className="relative group">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t.passwordPlaceholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`h-11 lg:h-12 bg-background/50 border-border hover:border-primary/40 focus:border-primary transition-all duration-300 rounded-xl text-sm lg:text-base ${
                              isRTL ? "pr-12 pl-4" : "pl-4 pr-12"
                            }`}
                            required
                            dir="ltr"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 ${
                              isRTL ? "right-4" : "left-4"
                            }`}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 lg:h-5 lg:w-5" />
                            ) : (
                              <Eye className="h-4 w-4 lg:h-5 lg:w-5" />
                            )}
                          </button>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className={`flex items-center justify-between gap-4 ${isRTL ? '' : 'flex-row-reverse'}`}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-primary border-2 border-slate-300 rounded focus:ring-2 focus:ring-primary/50 cursor-pointer transition-colors hover:border-primary"
                          />
                          <span className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors">
                            {t.rememberMe}
                          </span>
                        </label>
                        <Button
                          type="button"
                          variant="link"
                          className="text-xs lg:text-sm text-primary hover:text-primary/80 p-0 h-auto"
                        >
                          {t.forgotPassword}
                        </Button>
                      </div>

                      {/* Login Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="group w-full h-12 lg:h-14 text-sm lg:text-base font-semibold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-[1.02] rounded-xl relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        <span className={`relative z-10 flex items-center justify-center gap-2 ${isRTL ? '' : 'flex-row-reverse'}`}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin" />
                              {t.loggingIn}
                            </>
                          ) : (
                            <>
                              {t.loginButton}
                              <ArrowRight className={`h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform duration-300 ${!isRTL ? 'rotate-180' : ''}`} />
                            </>
                          )}
                        </span>
                      </Button>
                    </form>
                  </CardContent>

                  {/* Card Footer */}
                  <CardFooter className="flex-col gap-3 lg:gap-4 pb-6 lg:pb-8 px-4 lg:px-6 pt-2">
                    {/* Security Features */}
                    <div className="flex flex-row items-center justify-between gap-2 lg:gap-3 w-full pt-3 lg:pt-4 border-t border-border/50">
                      {[
                        { icon: ShieldCheck, text: t.features.secure },
                        { icon: Settings, text: t.features.fast },
                        { icon: Database, text: t.features.support },
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center gap-1.5 lg:gap-2 text-center"
                        >
                          <div className="p-2 lg:p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                            <feature.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground leading-tight font-medium">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Admin Contact Info */}
                    <div className="w-full pt-2">
                      <p className="text-xs text-muted-foreground text-center leading-relaxed">
                        {language === "ar" 
                          ? "للحصول على صلاحيات الإدارة، يرجى التواصل مع المدير العام"
                          : "For admin access, please contact the general manager"}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

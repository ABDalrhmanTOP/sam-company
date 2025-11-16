import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Wifi,
  Zap,
  Building2,
  Phone,
  Moon,
  Sun,
  Globe,
  Gauge,
  Headphones,
  Package,
  Users,
  Sparkles,
  LayoutDashboard,
  Settings,
  Star,
  Shield,
  LogIn,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import logo from "../assets/687e5a16fd08cc5f84ef904ce9a76a663d5116d7.png";

export type PageType =
  | "home"
  | "home-internet"
  | "business-internet"
  | "speed-test"
  | "support"
  | "about"
  | "contact";
export type Language = "ar" | "en";

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export function Navigation({
  currentPage,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  language,
  onToggleLanguage,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  const translations = {
    ar: {
      home: "الرئيسية",
      homeInternet: "إنترنت منزلي",
      homeInternetDesc: "باقات الألياف الضوئية للمنازل",
      businessInternet: "إنترنت للشركات",
      businessInternetDesc: "حلول إنترنت احترافية للأعمال",
      speedTest: "اختبار السرعة",
      support: "الدعم الفني",
      about: "من نحن",
      contact: "تواصل معنا",
      subscribe: "اشترك الآن",
      login: "تسجيل الدخول",
      loginDashboard: "لوحة التحكم",
    },
    en: {
      home: "Home",
      homeInternet: "Home Internet",
      homeInternetDesc: "Fiber optic packages for homes",
      businessInternet: "Business Internet",
      businessInternetDesc: "Professional internet solutions",
      speedTest: "Speed Test",
      support: "Support",
      about: "About Us",
      contact: "Contact Us",
      subscribe: "Subscribe Now",
      login: "Login",
      loginDashboard: "Admin Dashboard",
    },
  };

  const t = translations[language];

  const navigationItems = [
    {
      id: "home" as PageType,
      label: t.home,
      subItems: [],
      icon: Home,
    },
    {
      id: "home-internet" as PageType,
      label: t.homeInternet,
      subItems: [],
      icon: Wifi,
    },
    {
      id: "business-internet" as PageType,
      label: t.businessInternet,
      subItems: [],
      icon: Building2,
    },
    {
      id: "speed-test" as PageType,
      label: t.speedTest,
      subItems: [],
      icon: Gauge,
    },
    {
      id: "support" as PageType,
      label: t.support,
      subItems: [],
      icon: Headphones,
    },
    {
      id: "about" as PageType,
      label: t.about,
      subItems: [],
      icon: Users,
    },
    {
      id: "contact" as PageType,
      label: t.contact,
      subItems: [],
      icon: Phone,
    },
  ];

  const handleNavigation = (page: PageType) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const handleItemClick = (
    item: (typeof navigationItems)[0],
  ) => {
    handleNavigation(item.id);
  };

  return (
    <header
      className={`border-b fixed top-0 left-0 right-0 z-[99999] transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-2xl border-border/50"
          : "bg-background/90 backdrop-blur-lg shadow-lg"
      }`}
      style={{ position: 'fixed', zIndex: 99999 }}
    >
      <nav className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("home")}
            className="flex items-center gap-3 group transition-all duration-500 hover:scale-105"
          >
            <div className="relative h-14 w-auto flex items-center justify-center">
              <img
                src={logo}
                alt="SAM NET Logo"
                className="h-full w-auto object-contain transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const ItemIcon = item.icon;

              if (item.subItems.length > 0) {
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`group relative flex items-center gap-1.5 h-10 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                          currentPage === item.id ||
                          item.subItems.some(
                            (sub: any) =>
                              sub.page === currentPage,
                          )
                            ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5"
                            : "hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <ItemIcon className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">
                          {item.label}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      align="center"
                      sideOffset={12}
                      className="w-72 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
                    >
                      {/* Main packages page option */}
                      <DropdownMenuItem
                        onClick={() =>
                          handleNavigation(item.id)
                        }
                        className="group cursor-pointer p-4 focus:bg-gradient-to-r focus:from-primary/10 focus:to-primary/5 transition-all duration-300 hover:scale-[0.98] bg-gradient-to-r from-primary/5 to-transparent rounded-lg m-1"
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <ItemIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold group-hover:tracking-wide transition-all duration-300">
                              {t.allPackages}
                            </span>
                            <span className="text-xs text-muted-foreground leading-tight">
                              {t.allPackagesDesc}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />

                      {/* Sub items */}
                      {item.subItems.map((subItem, index) => {
                        const SubIcon = subItem.icon;
                        return (
                          <div key={index}>
                            <DropdownMenuItem
                              onClick={subItem.action}
                              className="group cursor-pointer p-4 focus:bg-gradient-to-r focus:from-primary/10 focus:to-primary/5 transition-all duration-300 hover:scale-[0.98] rounded-lg m-1"
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                  <SubIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="font-semibold group-hover:tracking-wide transition-all duration-300">
                                    {subItem.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground leading-tight">
                                    {subItem.description}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuItem>
                            {index <
                              item.subItems.length - 1 && (
                              <DropdownMenuSeparator className="my-1" />
                            )}
                          </div>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleItemClick(item)}
                  className={`group relative flex items-center gap-1.5 h-10 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                    currentPage === item.id
                      ? "text-primary bg-gradient-to-r from-primary/10 to-primary/5"
                      : "hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <ItemIcon className="h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Login Button - Desktop Only */}
            <a
              href="/login"
              className="group hidden lg:flex h-10 px-4 gap-2 items-center hover:bg-primary/10 transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <LogIn className="h-4 w-4 group-hover:scale-110 transition-transform duration-500" />
              <span className="font-medium">{t.login}</span>
            </a>

            {/* Subscribe Button - Desktop Only */}
            <Button
              size="sm"
              className="group hidden lg:flex h-10 px-5 gap-2 bg-gradient-to-r from-primary to-[#c01810] hover:from-[#c01810] hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-xl relative overflow-hidden"
              onClick={() => handleNavigation("contact")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Sparkles className="h-4 w-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                {t.subscribe}
              </span>
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLanguage}
              className="group h-10 w-10 hover:bg-primary/10 transition-all duration-300 hover:scale-110 rounded-xl"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="group h-10 w-10 hover:bg-primary/10 transition-all duration-300 hover:scale-110 rounded-xl"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="h-4 w-4 group-hover:-rotate-45 transition-transform duration-500" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="group lg:hidden h-10 w-10 hover:bg-primary/10 transition-all duration-300 hover:scale-110 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-xl mobile-menu-enter rounded-b-2xl shadow-xl">
            <div className="py-4 space-y-1">
              {navigationItems.map((item) => {
                const ItemIcon = item.icon;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[0.98] active:scale-95 ${
                        currentPage === item.id ||
                        (item.subItems.length > 0 &&
                          item.subItems.some(
                            (sub: any) =>
                              sub.page === currentPage,
                          ))
                          ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                          : "hover:bg-primary/5"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          currentPage === item.id ||
                          (item.subItems.length > 0 &&
                            item.subItems.some(
                              (sub: any) =>
                                sub.page === currentPage,
                            ))
                            ? "bg-primary/20"
                            : "bg-primary/10 group-hover:bg-primary/15"
                        }`}
                      >
                        <ItemIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="font-medium group-hover:tracking-wide transition-all duration-300">
                        {item.label}
                      </span>
                    </button>

                    {item.subItems.length > 0 && (
                      <div
                        className={`mt-1 ${language === "ar" ? "mr-12" : "ml-12"} space-y-1`}
                      >
                        {item.subItems.map((subItem, index) => {
                          const SubIcon = subItem.icon;
                          return (
                            <button
                              key={index}
                              onClick={subItem.action}
                              className="group w-full flex items-start gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-all duration-300 text-sm active:scale-95"
                            >
                              <SubIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                              <div className="flex flex-col items-start gap-0.5">
                                <span className="font-medium group-hover:tracking-wide transition-all duration-300">
                                  {subItem.label}
                                </span>
                                <span className="text-xs text-muted-foreground leading-tight">
                                  {subItem.description}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Mobile Login Link */}
              <a
                href="/login"
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
              >
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-medium group-hover:tracking-wide transition-all duration-300">
                  {t.loginDashboard}
                </span>
              </a>

              {/* Mobile Subscribe Button */}
              <Button
                className="group w-full mt-4 h-12 gap-2 bg-gradient-to-r from-primary to-[#c01810] hover:from-[#c01810] hover:to-primary text-primary-foreground shadow-lg transition-all duration-500 rounded-xl relative overflow-hidden"
                onClick={() => handleNavigation("contact")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Sparkles className="h-4 w-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                  {t.subscribe}
                </span>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
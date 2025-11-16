// HomeInternetPage.tsx
import React from "react";
import { PageType, Language } from "../components/Navigation";
import { DynamicBenefits } from "../components/DynamicBenefits";
import { DynamicPackages } from "../components/DynamicPackages";
import { Button } from "../components/ui/button";
import { Rocket, Home } from "lucide-react";

interface HomeInternetPageProps {
  onNavigate: (page: PageType) => void;
  language: Language;
}

export function HomeInternetPage({
  onNavigate,
  language,
}: HomeInternetPageProps) {

  // Static translations for fixed UI strings (packages & benefits come from API)
  const translations: Record<
    Language,
    {
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      popular: string;
      mbps: string;
      gbps: string;
      sar: string;
      month: string;
      subscribe: string;
      features: string;
      allPackagesInclude: string;
      downloadSpeed: string;
      uploadSpeed: string;
      freeRouter: string;
      freeInstallation: string;
      support247: string;
      unlimited: string;
      fiberOptic: string;
      secureConnection: string;
      readyTitle: string;
      readySubtitle: string;
    }
  > = {
    ar: {
      badge: "للمنازل",
      title: "باقات الإنترنت المنزلي",
      subtitle: "اختر الباقة المناسبة لاحتياجاتك",
      description:
        "باقات مصممة خصيصاً للعائلات مع تقنية الألياف الضوئية فائقة السرعة",
      popular: "الأكثر شيوعاً",
      mbps: "ميجا",
      gbps: "جيجابت",
      sar: "ليرة",
      month: "/شهرياً",
      subscribe: "اشترك الآن",
      features: "مميزات الباقة",
      allPackagesInclude: "جميع الباقات تشمل",
      downloadSpeed: "سرعة التحميل",
      uploadSpeed: "سرعة الرفع",
      freeRouter: "راوتر احترافي مجاني",
      freeInstallation: "تركيب فوري مجاني",
      support247: "دعم فني 24/7",
      unlimited: "استخدام غير محدود",
      fiberOptic: "ألياف ضوئية",
      secureConnection: "اتصال آمن",
      readyTitle: "جاهز لتجربة إنترنت أسرع؟",
      readySubtitle: "اشترك الآن واستمتع بأسرع إنترنت في سوريا",
    },
    en: {
      badge: "For Homes",
      title: "Home Internet Packages",
      subtitle: "Choose the package that suits your needs",
      description:
        "Packages designed specifically for families with ultra-fast fiber optic technology",
      popular: "Most Popular",
      mbps: "Mbps",
      gbps: "Gbps",
      sar: "SYP",
      month: "/month",
      subscribe: "Subscribe Now",
      features: "Package Features",
      allPackagesInclude: "All Packages Include",
      downloadSpeed: "Download Speed",
      uploadSpeed: "Upload Speed",
      freeRouter: "Free Professional Router",
      freeInstallation: "Free Instant Installation",
      support247: "24/7 Tech Support",
      unlimited: "Unlimited Usage",
      fiberOptic: "Fiber Optic",
      secureConnection: "Secure Connection",
      readyTitle: "Ready for Faster Internet?",
      readySubtitle: "Subscribe now and enjoy the fastest internet in Syria",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(102,32,32,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(160,24,16,0.06),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-glow" />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#c01810]/10 via-transparent to-transparent rounded-full blur-3xl animate-glow"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2.5 px-6 py-3 glass-card-strong rounded-full shadow-xl border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                {t.badge}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight">
                <span className="block bg-gradient-to-r from-primary via-[#a01810] to-primary bg-clip-text text-transparent mb-3 animate-gradient font-black">
                  {t.title}
                </span>
                <span className="block text-foreground/90 font-bold text-3xl sm:text-4xl lg:text-5xl">
                  {t.subtitle}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground/90 leading-relaxed max-w-3xl mx-auto font-light">
                {t.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {t.allPackagesInclude}
                </span>
              </h2>
            </div>

            <DynamicBenefits 
              currentPage="home-internet" 
              language={language} 
              limit={4}
            />
          </div>
        </div>
      </section>

      {/* Packages Section - Dynamic from Database */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <DynamicPackages 
              packageType="home" 
              language={language}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-[#c01810]/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-black">
              {t.readyTitle}
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              {t.readySubtitle}
            </p>
            <Button
              size="lg"
              className="group relative h-16 px-12 text-lg font-bold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-110 rounded-2xl overflow-hidden"
              onClick={() => onNavigate("contact")}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Rocket className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">
                {t.subscribe}
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

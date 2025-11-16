import React from "react";
import { PageType, Language } from "../components/Navigation";
import { DynamicBenefits } from "../components/DynamicBenefits";
import { DynamicPackages } from "../components/DynamicPackages";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Check,
  Building2,
  Zap,
  Shield,
  Network,
  TrendingUp,
  Award,
  Star,
  Sparkles,
  Rocket,
  Crown,
  Lock,
  ArrowRight,
} from "lucide-react";

interface BusinessInternetPageProps {
  onNavigate: (page: PageType) => void;
  language: Language;
}

export function BusinessInternetPage({
  onNavigate,
  language,
}: BusinessInternetPageProps) {
  const content = {
    ar: {
      badge: "للشركات",
      title: "حلول الإنترنت للشركات",
      subtitle: "باقات احترافية لأعمالك",
      description:
        "حلول مخصصة للشركات مع ضمان الأداء والاستقرار وخدمة VIP متميزة",
      enterprise: "للمؤسسات",
      popular: "الأكثر طلباً",
      mbps: "ميجا",
      gbps: "جيجابت",
      sar: "ليرة",
      month: "/شهرياً",
      contactSales: "تواصل مع المبيعات",
      getQuote: "احصل على عرض",
      features: "مميزات الباقة",
      packages: [
        {
          name: "الشركات الصغيرة",
          speed: "500",
          speedUnit: "ميجا",
          price: "1,750,000",
          description: "مثالية للشركات الناشئة",
          users: "حتى 20 مستخدم",
          features: [
            "سرعة 500 ميجا مضمونة",
            "IP ثابت مجاني",
            "دعم VIP",
            "SLA 99.9%",
            "أولوية الخدمة",
            "تقارير شهرية",
          ],
        },
        {
          name: "الشركات المتوسطة",
          speed: "1",
          speedUnit: "جيجابت",
          price: "3,500,000",
          description: "للشركات المتنامية",
          users: "حتى 50 مستخدم",
          popular: true,
          features: [
            "سرعة جيجابت كاملة",
            "عدة IP ثابتة",
            "دعم مخصص 24/7",
            "SLA مضمون",
            "تركيب احترافي",
            "تقارير أسبوعية",
            "نسخ احتياطي",
            "حماية متقدمة",
          ],
        },
        {
          name: "المؤسسات الكبرى",
          speed: "حسب الطلب",
          speedUnit: "",
          price: "مخصص",
          description: "حلول متكاملة",
          users: "غير محدود",
          enterprise: true,
          features: [
            "سرعات مخصصة",
            "بنية تحتية متطورة",
            "فريق دعم مخصص",
            "SLA مخصص",
            "حلول أمنية متقدمة",
            "استشارات تقنية",
            "إدارة شبكة كاملة",
            "دعم على مدار الساعة",
          ],
        },
      ],
      benefits: [
        {
          title: "IP ثابت",
          description: "عنوان ثابت لخدماتك",
        },
        {
          title: "SLA مضمون",
          description: "ضمان جاهزية 99.9%",
        },
        {
          title: "دعم VIP",
          description: "أولوية في الخدمة",
        },
        {
          title: "أمان متقدم",
          description: "حماية شاملة لبياناتك",
        },
      ],
    },
    en: {
      badge: "For Business",
      title: "Business Internet Solutions",
      subtitle: "Professional packages for your business",
      description:
        "Customized solutions for businesses with guaranteed performance, stability and premium VIP service",
      enterprise: "Enterprise",
      popular: "Most Requested",
      mbps: "Mbps",
      gbps: "Gbps",
      sar: "SYP",
      month: "/month",
      contactSales: "Contact Sales",
      getQuote: "Get Quote",
      features: "Package Features",
      packages: [
        {
          name: "Small Business",
          speed: "500",
          speedUnit: "Mbps",
          price: "1,750,000",
          description: "Ideal for startups",
          users: "Up to 20 users",
          features: [
            "Guaranteed 500 Mbps",
            "Free static IP",
            "VIP support",
            "99.9% SLA",
            "Priority service",
            "Monthly reports",
          ],
        },
        {
          name: "Medium Business",
          speed: "1",
          speedUnit: "Gbps",
          price: "3,500,000",
          description: "For growing companies",
          users: "Up to 50 users",
          popular: true,
          features: [
            "Full gigabit speed",
            "Multiple static IPs",
            "24/7 dedicated support",
            "Guaranteed SLA",
            "Professional installation",
            "Weekly reports",
            "Cloud backup",
            "Advanced protection",
          ],
        },
        {
          name: "Enterprise",
          speed: "Custom",
          speedUnit: "",
          price: "Custom",
          description: "Complete solutions",
          users: "Unlimited",
          enterprise: true,
          features: [
            "Custom speeds",
            "Advanced infrastructure",
            "Dedicated support team",
            "Custom SLA",
            "Advanced security",
            "Technical consulting",
            "Full network management",
            "24/7 support",
          ],
        },
      ],
      benefits: [
        {
          title: "Static IP",
          description: "Fixed address for your services",
        },
        {
          title: "Guaranteed SLA",
          description: "99.9% uptime guarantee",
        },
        {
          title: "VIP Support",
          description: "Priority in service",
        },
        {
          title: "Advanced Security",
          description: "Complete data protection",
        },
      ],
    },
  };

  const t = content[language];

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
              <Building2 className="h-4 w-4 text-primary" />
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

      {/* Benefits Section - Dynamic from Database */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <DynamicBenefits 
              currentPage="business-internet" 
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
              packageType="business" 
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
              {language === "ar"
                ? "جاهز لتطوير أعمالك؟"
                : "Ready to Grow Your Business?"}
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              {language === "ar"
                ? "تواصل مع فريق المبيعات للحصول على استشارة مجانية"
                : "Contact our sales team for a free consultation"}
            </p>
            <Button
              size="lg"
              className="group relative h-16 px-12 text-lg font-bold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-110 rounded-2xl overflow-hidden"
              onClick={() => onNavigate("contact")}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Rocket className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">
                {t.contactSales}
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
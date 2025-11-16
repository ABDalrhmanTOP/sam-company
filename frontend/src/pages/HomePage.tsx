import React from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { PageType, Language } from "../components/Navigation";
import { DynamicBenefits } from "../components/DynamicBenefits";
import { DynamicPackages } from "../components/DynamicPackages";
import { DynamicPremiumServices } from "../components/DynamicPremiumServices";
import {
  Wifi,
  Zap,
  Shield,
  Headphones,
  Router,
  TrendingUp,
  Users,
  Award,
  Check,
  ArrowRight,
  Gauge,
  Building2,
  Home,
  Sparkles,
  Star,
  Globe2,
  CheckCircle2,
  Rocket,
  Target,
  Network,
  Cloud,
  Server,
  Activity,
  BarChart3,
  Fingerprint,
  Lock,
  Radio,
} from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  language: Language;
}

export function HomePage({
  onNavigate,
  language,
}: HomePageProps) {
  // الحالات للداتا الإحصائية
  const [aboutStats, setAboutStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/about-page");
        if (res.data.success) {
          setAboutStats(res.data.data);
        }
      } catch (e) {
        setAboutStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const content = {
    ar: {
      hero: {
        badge: "المزود الرائد للإنترنت في سوريا",
        title: "إنترنت فائق السرعة",
        subtitle: "لحياة رقمية بلا حدود",
        description:
          "استمتع بتجربة إنترنت استثنائية مع تقنية الألياف الضوئية المتطورة. سرعات تصل إلى 1 جيجابت، استقرار مضمون 99.9%، ودعم فني احترافي متواصل على مدار الساعة.",
        subscribeCTA: "ابدأ الآن",
        speedTestCTA: "اختبر سرعتك",
        trustBadge: "موثوق من قبل +50,000 عميل",
      },
      stats: {
        customers: "عميل سعيد",
        customersCount: "50,000+",
        speed: "سرعة قصوى",
        speedValue: "1 جيجابت",
        uptime: "جاهزية الخدمة",
        uptimeValue: "99.9%",
        support: "دعم فني",
        supportValue: "24/7",
      },
      services: {
        title: "خدماتنا المتميزة",
        subtitle:
          "حلول إنترنت متكاملة مصممة لتلبية جميع احتياجاتك",
        homeInternet: {
          title: "إنترنت منزلي",
          description:
            "باقات مصممة خصيصاً للعائلات مع سرعات فائقة وتجربة استثنائية للألعاب والبث المباشر بجودة 4K",
          features: [
            "تقنية الألياف الضوئية",
            "راوتر احترافي مجاني",
            "تركيب فوري مجاني",
            "دعم فني مخصص",
          ],
          cta: "استكشف الباقات",
        },
        businessInternet: {
          title: "إنترنت للشركات",
          description:
            "حلول احترافية مخصصة للأعمال مع ضمان الجاهزية والأداء العالي وخدمة VIP متميزة",
          features: [
            "عنوان IP ثابت",
            "ضمان SLA 99.9%",
            "دعم VIP مخصص",
            "أولوية في الخدمة",
          ],
          cta: "حلول الأعمال",
        },
        support: {
          title: "الدعم الفني",
          description:
            "فريق متخصص من الخبراء جاهز لمساعدتك في أي وقت مع استجابة فورية وحل احترافي لجميع المشاكل",
          features: [
            "متاح 24/7/365",
            "استجابة خلال دقائق",
            "فريق خبراء محترف",
            "دعم عبر كل القنوات",
          ],
          cta: "تواصل معنا",
        },
      },
      why: {
        title: "لماذا نحن الخيار الأفضل؟",
        subtitle: "مزايا تجعلنا رواد الإنترنت في سوريا",
        features: [
          {
            title: "سرعة خارقة",
            description:
              "تقنية الألياف الضوئية توفر أعلى السرعات المتاحة في السوق",
          },
          {
            title: "أمان متقدم",
            description:
              "حماية شاملة لبياناتك وخصوصيتك مع أحدث تقنيات التشفير",
          },
          {
            title: "استقرار عالي",
            description:
              "جاهزية 99.9% مع بنية تحتية متطورة وصيانة استباقية",
          },
          {
            title: "دعم استثنائي",
            description:
              "فريق محترف متاح دائماً لخدمتك بأعلى معايير الجودة",
          },
          {
            title: "تقنية متطورة",
            description:
              "أحدث المعدات والتقنيات لضمان أفضل تجربة ممكنة",
          },
          {
            title: "خبرة موثوقة",
            description:
              "سنوات من الخبرة والتميز في خدمة أكثر من 50,000 عميل",
          },
        ],
      },
      packages: {
        title: "باقاتنا المميزة",
        subtitle: "اختر الباقة المثالية التي تناسب احتياجاتك",
        homeTab: "الباقات المنزلية",
        businessTab: "باقات الشركات",
        viewAllHome: "عرض جميع الباقات المنزلية",
        viewAllBusiness: "عرض جميع باقات الشركات",
        homePackages: [
          {
            name: "الأساسية",
            speed: "100 ميجا",
            price: "350,000",
            currency: "ليرة/شهرياً",
            description: "مثالية للاستخدام اليومي",
            features: [
              "تصفح سريع ومستقر",
              "مشاهدة HD",
              "2-3 أجهزة",
              "راوتر مجاني",
              "تركيب مجاني",
            ],
          },
          {
            name: "العائلية",
            speed: "300 ميجا",
            price: "700,000",
            currency: "ليرة/شهرياً",
            popular: "الأكثر شيوعاً",
            description: "الأفضل للعائلات",
            features: [
              "سرعة فائقة",
              "مشاهدة 4K",
              "5-7 أجهزة",
              "ألعاب بدون تأخير",
              "دعم 24/7",
            ],
          },
          {
            name: "المميزة",
            speed: "1 جيجابت",
            price: "1,400,000",
            currency: "ليرة/شهرياً",
            description: "قوة وأداء استثنائي",
            features: [
              "سرعة جيجابت كاملة",
              "أجهزة غير محدودة",
              "راوتر متطور",
              "دعم VIP",
              "أولوية الخدمة",
            ],
          },
        ],
        businessPackages: [
          {
            name: "الشركات الصغيرة",
            speed: "500 ميجا",
            price: "1,750,000",
            currency: "ليرة/شهرياً",
            description: "مثالية للشركات الناشئة",
            features: [
              "سرعة 500 ميجا مضمونة",
              "IP ثابت مجاني",
              "دعم VIP",
              "SLA 99.9%",
              "أولوية الخدمة",
            ],
          },
          {
            name: "الشركات المتوسطة",
            speed: "1 جيجابت",
            price: "3,500,000",
            currency: "ليرة/شهرياً",
            popular: "الأكثر طلباً",
            description: "للشركات المتنامية",
            features: [
              "سرعة جيجابت كاملة",
              "عدة IP ثابتة",
              "دعم مخصص 24/7",
              "SLA مضمون",
              "تركيب احترافي",
            ],
          },
          {
            name: "المؤسسات الكبرى",
            speed: "حسب الطلب",
            price: "مخصص",
            currency: "",
            description: "حلول متكاملة للمؤسسات",
            features: [
              "سرعات مخصصة",
              "بنية تحتية متطورة",
              "فريق دعم مخصص",
              "SLA مخصص",
              "حلول متكاملة",
            ],
          },
        ],
      },
      cta: {
        title: "جاهز لتجربة إنترنت أسرع؟",
        description:
          "انضم إلى آلاف العملاء السعداء واستمتع بأسرع إنترنت في سوريا مع عروض حصرية للمشتركين الجدد",
        subscribe: "اشترك الآن",
        contact: "تحدث مع فريق المبيعات",
      },
    },
    en: {
      hero: {
        badge: "Syria's Leading Internet Provider",
        title: "Ultra-Fast Internet",
        subtitle: "For Unlimited Digital Life",
        description:
          "Experience exceptional internet with advanced fiber optic technology. Speeds up to 1 Gbps, guaranteed 99.9% uptime, and professional 24/7 technical support.",
        subscribeCTA: "Get Started",
        speedTestCTA: "Test Your Speed",
        trustBadge: "Trusted by +50,000 customers",
      },
      stats: {
        customers: "Happy Customers",
        customersCount: "50,000+",
        speed: "Max Speed",
        speedValue: "1 Gbps",
        uptime: "Service Uptime",
        uptimeValue: "99.9%",
        support: "Support",
        supportValue: "24/7",
      },
      services: {
        title: "Our Premium Services",
        subtitle:
          "Complete internet solutions designed to meet all your needs",
        homeInternet: {
          title: "Home Internet",
          description:
            "Packages designed specifically for families with ultra-fast speeds and exceptional 4K streaming & gaming experience",
          features: [
            "Fiber Optic Technology",
            "Free Professional Router",
            "Free Instant Installation",
            "Dedicated Tech Support",
          ],
          cta: "Explore Packages",
        },
        businessInternet: {
          title: "Business Internet",
          description:
            "Professional solutions for businesses with guaranteed uptime, high performance, and premium VIP service",
          features: [
            "Static IP Address",
            "99.9% SLA Guarantee",
            "Dedicated VIP Support",
            "Priority Service",
          ],
          cta: "Business Solutions",
        },
        support: {
          title: "Technical Support",
          description:
            "Expert team ready to help you anytime with immediate response and professional solutions to all issues",
          features: [
            "Available 24/7/365",
            "Response in Minutes",
            "Professional Expert Team",
            "All Channel Support",
          ],
          cta: "Contact Us",
        },
      },
      why: {
        title: "Why Choose Us?",
        subtitle:
          "Advantages that make us Syria's internet pioneers",
        features: [
          {
            title: "Ultra-Fast Speed",
            description:
              "Fiber optic technology provides the highest speeds available in the market",
          },
          {
            title: "Advanced Security",
            description:
              "Complete protection for your data and privacy with latest encryption",
          },
          {
            title: "High Stability",
            description:
              "99.9% uptime with advanced infrastructure and proactive maintenance",
          },
          {
            title: "Exceptional Support",
            description:
              "Professional team always available to serve you with highest quality standards",
          },
          {
            title: "Advanced Technology",
            description:
              "Latest equipment and technologies to ensure the best possible experience",
          },
          {
            title: "Trusted Experience",
            description:
              "Years of excellence serving over 50,000 satisfied customers",
          },
        ],
      },
      packages: {
        title: "Our Featured Packages",
        subtitle:
          "Choose the perfect package that suits your needs",
        homeTab: "Home Packages",
        businessTab: "Business Packages",
        viewAllHome: "View All Home Packages",
        viewAllBusiness: "View All Business Packages",
        homePackages: [
          {
            name: "Basic",
            speed: "100 Mbps",
            price: "350,000",
            currency: "SYP/month",
            description: "Perfect for daily use",
            features: [
              "Fast stable browsing",
              "HD streaming",
              "2-3 devices",
              "Free router",
              "Free installation",
            ],
          },
          {
            name: "Family",
            speed: "300 Mbps",
            price: "700,000",
            currency: "SYP/month",
            popular: "Most Popular",
            description: "Best for families",
            features: [
              "Ultra-fast speed",
              "4K streaming",
              "5-7 devices",
              "Gaming with no lag",
              "24/7 support",
            ],
          },
          {
            name: "Premium",
            speed: "1 Gbps",
            price: "1,400,000",
            currency: "SYP/month",
            description: "Exceptional power & performance",
            features: [
              "Full gigabit speed",
              "Unlimited devices",
              "Advanced router",
              "VIP support",
              "Priority service",
            ],
          },
        ],
        businessPackages: [
          {
            name: "Small Business",
            speed: "500 Mbps",
            price: "1,750,000",
            currency: "SYP/month",
            description: "Ideal for startups",
            features: [
              "Guaranteed 500 Mbps",
              "Free static IP",
              "VIP support",
              "99.9% SLA",
              "Priority service",
            ],
          },
          {
            name: "Medium Business",
            speed: "1 Gbps",
            price: "3,500,000",
            currency: "SYP/month",
            popular: "Most Requested",
            description: "For growing companies",
            features: [
              "Full gigabit speed",
              "Multiple static IPs",
              "24/7 dedicated support",
              "Guaranteed SLA",
              "Professional installation",
            ],
          },
          {
            name: "Enterprise",
            speed: "Custom",
            price: "Custom",
            currency: "",
            description: "Complete solutions for enterprises",
            features: [
              "Custom speeds",
              "Advanced infrastructure",
              "Dedicated support team",
              "Custom SLA",
              "Complete solutions",
            ],
          },
        ],
      },
      cta: {
        title: "Ready for Faster Internet?",
        description:
          "Join thousands of happy customers and enjoy the fastest internet in Syria with exclusive offers for new subscribers",
        subscribe: "Subscribe Now",
        contact: "Talk to Sales Team",
      },
    },
  };

  // الكلاسيكية للعرض كما السابق مع ربط القيم بالديناميكي من الباكند
  const t = language === "ar"
    ? {
        ...content.ar,
        stats: {
          customers: "عميل سعيد",
          customersCount: aboutStats?.customers_count || "...",
          speed: "سرعة قصوى",
          speedValue: "1 جيجابت",
          uptime: "جاهزية الخدمة",
          uptimeValue: aboutStats?.uptime_count || "...",
          support: "دعم فني",
          supportValue: aboutStats?.support_count || "...",
        },
      }
    : {
        ...content.en,
        stats: {
          customers: "Happy Customers",
          customersCount: aboutStats?.customers_count || "...",
          speed: "Max Speed",
          speedValue: "1 Gbps",
          uptime: "Service Uptime",
          uptimeValue: aboutStats?.uptime_count || "...",
          support: "Tech Support",
          supportValue: aboutStats?.support_count || "...",
        },
      };

  const PricingCard = ({
    pkg,
    type,
  }: {
    pkg: any;
    type: string;
  }) => {
    const isPopular = pkg.popular;
    const isBusiness = type === "business";
    const buttonAction = isBusiness
      ? "business-internet"
      : "home-internet";

    return (
      <Card
        className={`relative overflow-hidden group transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
          isPopular
            ? "border-2 border-primary/30 shadow-lg bg-gradient-to-b from-background via-background to-primary/[0.03]"
            : "border border-border hover:border-primary/40 bg-card"
        }`}
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Elegant Top Border */}
        {isPopular && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}

        {/* Refined Popular Badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-0">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-4 py-2 rounded-full">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span className="font-bold text-sm">
                  {pkg.popular}
                </span>
              </div>
            </Badge>
          </div>
        )}

        <CardHeader className="!gap-4 pt-10 pb-4 text-center relative">
          {/* Clean Speed Display */}
          <div className="space-y-1">
            <h3 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-primary via-[#a01810] to-[#c01810] bg-clip-text text-transparent leading-tight">
              {pkg.speed}
            </h3>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">
              {pkg.name}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-relaxed">
              {pkg.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="!gap-5 pb-6">
          {/* Minimal Price Display */}
          <div className="text-center py-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted border border-border/50">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl md:text-5xl font-black text-foreground">
                {pkg.price === "مخصص" ||
                pkg.price === "Custom" ? (
                  <span className="text-2xl">{pkg.price}</span>
                ) : (
                  pkg.price
                )}
              </span>
            </div>
            {pkg.price !== "مخصص" && pkg.price !== "Custom" && (
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                {pkg.currency}
              </p>
            )}
            {(pkg.price === "Custom" || pkg.price === "مخصص") &&
              isBusiness && (
                <p className="text-sm text-muted-foreground/70 mt-2">
                  {language === "ar"
                    ? "اتصل للحصول على عرض"
                    : "Contact for quote"}
                </p>
              )}
          </div>

          {/* Clean Features List */}
          <div className="space-y-3.5">
            {pkg.features.map(
              (feature: string, fIndex: number) => (
                <div
                  key={fIndex}
                  className="flex items-start gap-3 group/item"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 group-hover/item:bg-primary/20 transition-colors">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/85 leading-relaxed font-medium">
                    {feature}
                  </span>
                </div>
              ),
            )}
          </div>

          {/* Elegant CTA Button */}
          <Button
            className={`w-full h-14 mt-2 rounded-xl font-bold text-base transition-all duration-300 hover:scale-[1.02] ${
              isPopular
                ? "bg-gradient-to-r from-primary to-[#c01810] hover:from-primary/90 hover:to-[#c01810]/90 text-primary-foreground shadow-lg hover:shadow-xl"
                : "border-2 border-red-600 bg-background text-red-600 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm hover:shadow-md"
            }`}
            onClick={() => onNavigate(buttonAction as PageType)}
          >
            <span className="flex items-center justify-center gap-2">
              {isPopular
                ? language === "ar"
                  ? "اشترك الآن"
                  : "Subscribe Now"
                : language === "ar"
                  ? "اختر الباقة"
                  : "Select Package"}
              <ArrowRight className="h-5 w-5" />
            </span>
          </Button>
        </CardContent>
      </Card>
    );
  };

  // --- Start of JSX Render ---
  return (
    <div className="min-h-screen">
      {/* Hero Section - Ultra Premium (Existing Code) */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-16 lg:pb-32">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 -z-10">
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

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-10 text-center lg:text-right">
                {/* Premium Badge */}
                <div className="inline-flex items-center gap-2.5 px-6 py-3 glass-card-strong rounded-full shadow-xl border-primary/20 group hover:scale-105 transition-transform duration-300">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <Sparkles className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                    {t.hero.badge}
                  </span>
                </div>

                {/* Hero Title */}
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-7xl lg:text-8xl xl:text-6xl leading-[0.95] tracking-tight">
                    <span className=" space-y-6 block bg-gradient-to-r from-primary via-[#a01810] to-primary bg-clip-text text-transparent mb-4 animate-gradient font-black">
                      {t.hero.title}
                    </span>
                    <span className="block text-foreground/95 font-bold">
                      {t.hero.subtitle}
                    </span>
                  </h1>

                  <p className="text-xl sm:text-2xl text-muted-foreground/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                    {t.hero.description}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="group relative h-16 px-10 text-lg font-semibold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-110 rounded-2xl overflow-hidden"
                    onClick={() => onNavigate("home-internet")}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <Rocket className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">
                      {t.hero.subscribeCTA}
                    </span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group h-16 px-10 text-lg font-semibold glass-card border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 rounded-2xl"
                    onClick={() => onNavigate("speed-test")}
                  >
                    <Gauge className="h-6 w-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    <span>{t.hero.speedTestCTA}</span>
                  </Button>
                </div>

                {/* Trust Indicator */}
                <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {t.hero.trustBadge}
                  </span>
                </div>
              </div>

              {/* Right Stats Grid - Premium */}
              <div className="grid grid-cols-2 gap-5 lg:gap-6">
                {[
                  {
                    label: t.stats.customers,
                    value: t.stats.customersCount,
                    icon: Users,
                    gradient:
                      "from-blue-500/20 via-blue-400/20 to-cyan-500/20",
                    iconColor: "text-blue-500",
                    glowColor: "shadow-blue-500/20",
                  },
                  {
                    label: t.stats.speed,
                    value: t.stats.speedValue,
                    icon: Zap,
                    gradient:
                      "from-orange-500/20 via-primary/20 to-red-500/20",
                    iconColor: "text-orange-500",
                    glowColor: "shadow-orange-500/20",
                  },
                  {
                    label: t.stats.uptime,
                    value: t.stats.uptimeValue,
                    icon: Activity,
                    gradient:
                      "from-green-500/20 via-emerald-500/20 to-teal-500/20",
                    iconColor: "text-green-500",
                    glowColor: "shadow-green-500/20",
                  },
                  {
                    label: t.stats.support,
                    value: t.stats.supportValue,
                    icon: Headphones,
                    gradient:
                      "from-purple-500/20 via-pink-500/20 to-rose-500/20",
                    iconColor: "text-purple-500",
                    glowColor: "shadow-purple-500/20",
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="group relative"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <Card
                      className={`relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:${stat.glowColor} hover:shadow-2xl h-full`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                      />

                      <CardContent className="relative pt-8 pb-8 text-center space-y-4">
                        <div
                          className={`inline-flex p-4 glass-card rounded-2xl group-hover:scale-110 transition-transform duration-500 ${stat.glowColor} shadow-lg`}
                        >
                          <stat.icon
                            className={`h-8 w-8 ${stat.iconColor}`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                            {stat.value}
                          </p>
                          <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                            {stat.label}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Premium Services Section - Dynamic from Backend */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <DynamicPremiumServices 
              language={language}
              limit={3}
              showTitle={true}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us - Premium Grid (Existing Code) */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong border border-primary/20 rounded-full">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === "ar" ? "المميزات" : "Features"}
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black">
                <span className="bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] bg-clip-text text-transparent animate-gradient">
                  {t.why.title}
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
                {t.why.subtitle}
              </p>
            </div>

            {/* Dynamic Benefits from Database */}
            <DynamicBenefits 
              currentPage="home" 
              language={language}
            />
          </div>
        </div>
      </section>

      {/* --- Packages Section (Missing Code) --- */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20 space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong border border-primary/20 rounded-full">
                <Wifi className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === "ar" ? "الباقات" : "Packages"}
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black">
                <span className="bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] bg-clip-text text-transparent animate-gradient">
                  {t.packages.title}
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
                {t.packages.subtitle}
              </p>
            </div>

            {/* Tabs Component for Pricing */}
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 mb-16 h-16 glass-card-strong border-2 border-primary/20 p-2 rounded-3xl shadow-2xl">
                <TabsTrigger
                  value="home"
                  className="gap-2.5 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[#c01810] data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-xl text-base font-semibold h-full"
                >
                  <Home className="h-5 w-5" />
                  {t.packages.homeTab}
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="gap-2.5 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-[#c01810] data-[state=active]:text-primary-foreground transition-all duration-300 data-[state=active]:shadow-xl text-base font-semibold h-full"
                >
                  <Building2 className="h-5 w-5" />
                  {t.packages.businessTab}
                </TabsTrigger>
              </TabsList>

              {/* Home Packages Tab Content */}
              <TabsContent value="home">
                <DynamicPackages 
                  packageType="home" 
                  language={language}
                  limit={3}
                />
                <div className="text-center mt-12">
                  <Button
                    variant="link"
                    className="group text-lg font-semibold text-primary hover:text-[#c01810] transition-colors"
                    onClick={() => onNavigate("home-internet")}
                  >
                    <span className="group-hover:tracking-wider transition-all duration-300">
                      {t.packages.viewAllHome}
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 transition-transform duration-300 ${
                        language === "ar"
                          ? "group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </Button>
                </div>
              </TabsContent>

              {/* Business Packages Tab Content */}
              <TabsContent value="business">
                <DynamicPackages 
                  packageType="business" 
                  language={language}
                  limit={3}
                />
                <div className="text-center mt-12">
                  <Button
                    variant="link"
                    className="group text-lg font-semibold text-primary hover:text-[#c01810] transition-colors"
                    onClick={() =>
                      onNavigate("business-internet")
                    }
                  >
                    <span className="group-hover:tracking-wider transition-all duration-300">
                      {t.packages.viewAllBusiness}
                    </span>
                    <ArrowRight
                      className={`h-5 w-5 transition-transform duration-300 ${
                        language === "ar"
                          ? "group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* --- Final CTA Section (Missing Code) --- */}
      <section className="py-24 lg:py-32 relative bg-primary/5">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl sm:text-6xl font-black">
              <span className="bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] bg-clip-text text-transparent animate-gradient">
                {t.cta.title}
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground/80 font-light leading-relaxed">
              {t.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
              <Button
                size="lg"
                className="group relative h-16 px-10 text-lg font-semibold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 rounded-2xl overflow-hidden"
                onClick={() => onNavigate("home-internet")}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <Sparkles className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">
                  {t.cta.subscribe}
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group h-16 px-10 text-lg font-semibold glass-card border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 rounded-2xl"
                onClick={() => onNavigate("contact")}
              >
                <Headphones className="h-6 w-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                <span>{t.cta.contact}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { PageType, Language } from "../components/Navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  Search,
  BookOpen,
  HelpCircle,
  Sparkles,
  Rocket,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Shield,
} from "lucide-react";
import { DynamicSupportInfo } from "../components/DynamicSupportInfo";
import { DynamicFaqs } from "../components/DynamicFaqs";

interface SupportPageProps {
  onNavigate: (page: PageType) => void;
  language: Language;
}

export function SupportPage({ onNavigate, language }: SupportPageProps) {
  const content = {
    ar: {
      badge: "الدعم الفني",
      title: "كيف يمكننا مساعدتك؟",
      subtitle: "نحن هنا لخدمتك",
      description:
        "فريق الدعم الفني جاهز لمساعدتك في أي وقت. اختر طريقة التواصل المناسبة لك",
      searchPlaceholder: "ابحث عن إجابة...",
      contactSupport: "تواصل مع الدعم",
      viewAllFAQ: "عرض جميع الأسئلة",
      faqTitle: "الأسئلة الشائعة",
      faqSubtitle: "إجابات سريعة لأكثر الأسئلة شيوعاً",
      supportChannels: "قنوات الدعم",
      helpCenter: "مركز المساعدة",
      guides: "الأدلة الإرشادية",
      contactOptions: [
        {
          title: "الدردشة المباشرة",
          description: "تحدث معنا مباشرة للحصول على إجابات فورية",
          action: "ابدأ المحادثة",
          availability: "متاح الآن",
        },
        {
          title: "الهاتف",
          description: "اتصل بنا على الرقم +963 11 xxx xxxx",
          action: "اتصل بنا",
          availability: "24/7",
        },
        {
          title: "البريد الإلكتروني",
          description: "أرسل لنا رسالة على support@samnet.sy",
          action: "أرسل رسالة",
          availability: "رد خلال 24 ساعة",
        },
        {
          title: "تذكرة دعم",
          description: "أنشئ تذكرة دعم وتابع حالتها",
          action: "إنشاء تذكرة",
          availability: "تتبع الحالة",
        },
      ],
      faqs: [
        {
          question: "كيف أقوم بتركيب خدمة الإنترنت؟",
          answer:
            "بعد الاشتراك، سيتواصل معك فريقنا خلال 24 ساعة لتحديد موعد التركيب. التركيب مجاني ويتم في نفس اليوم أو اليوم التالي حسب المنطقة.",
        },
        {
          question: "ماذا أفعل إذا كان الإنترنت بطيئاً؟",
          answer:
            "أولاً، أعد تشغيل الراوتر. تأكد من عدم وجود تطبيقات تستهلك النطاق الترددي. إذا استمرت المشكلة، تواصل مع الدعم الفني على مدار الساعة.",
        },
        {
          question: "هل يمكنني تغيير باقتي؟",
          answer:
            "نعم، يمكنك الترقية أو الانتقال لباقة أخرى في أي وقت. تواصل مع خدمة العملاء وسيتم تفعيل الباقة الجديدة خلال 24 ساعة.",
        },
        {
          question: "كيف أدفع فاتورتي الشهرية؟",
          answer:
            "يمكنك الدفع عبر التحويل البنكي، أو نقاط الدفع المنتشرة، أو عبر تطبيق الموبايل. يتم إرسال الفاتورة قبل موعد الاستحقاق بـ 5 أيام.",
        },
        {
          question: "ما هي مدة عقد الاشتراك؟",
          answer:
            "لدينا خيارات مرنة: عقد شهري بدون التزام طويل، أو عقد سنوي مع خصم 10%. يمكنك اختيار ما يناسبك.",
        },
        {
          question: "هل الراوتر مجاني؟",
          answer:
            "نعم، نوفر راوتر احترافي مجاناً مع جميع باقاتنا. الراوتر بمواصفات عالية ويدعم أحدث تقنيات الواي فاي.",
        },
      ],
      resources: [
        {
          title: "دليل المستخدم",
          description: "دليل شامل لاستخدام خدماتنا",
        },
        {
          title: "فيديوهات تعليمية",
          description: "شروحات مصورة خطوة بخطوة",
        },
        {
          title: "استكشاف الأخطاء",
          description: "حل المشاكل الشائعة بنفسك",
        },
      ],
    },
    en: {
      badge: "Technical Support",
      title: "How Can We Help You?",
      subtitle: "We're Here to Serve You",
      description:
        "Our technical support team is ready to help you anytime. Choose the contact method that suits you",
      searchPlaceholder: "Search for an answer...",
      contactSupport: "Contact Support",
      viewAllFAQ: "View All FAQs",
      faqTitle: "Frequently Asked Questions",
      faqSubtitle: "Quick answers to the most common questions",
      supportChannels: "Support Channels",
      helpCenter: "Help Center",
      guides: "User Guides",
      contactOptions: [
        {
          title: "Live Chat",
          description: "Chat with us directly for instant answers",
          action: "Start Chat",
          availability: "Available Now",
        },
        {
          title: "Phone",
          description: "Call us at +963 11 xxx xxxx",
          action: "Call Us",
          availability: "24/7",
        },
        {
          title: "Email",
          description: "Send us a message at support@samnet.sy",
          action: "Send Message",
          availability: "Reply within 24 hours",
        },
        {
          title: "Support Ticket",
          description: "Create a support ticket and track its status",
          action: "Create Ticket",
          availability: "Track Status",
        },
      ],
      faqs: [
        {
          question: "How do I install the internet service?",
          answer:
            "After subscribing, our team will contact you within 24 hours to schedule installation. Installation is free and done same day or next day depending on location.",
        },
        {
          question: "What should I do if the internet is slow?",
          answer:
            "First, restart your router. Make sure there are no apps consuming bandwidth. If the problem persists, contact 24/7 technical support.",
        },
        {
          question: "Can I change my package?",
          answer:
            "Yes, you can upgrade or switch to another package anytime. Contact customer service and the new package will be activated within 24 hours.",
        },
        {
          question: "How do I pay my monthly bill?",
          answer:
            "You can pay via bank transfer, payment points, or mobile app. The invoice is sent 5 days before the due date.",
        },
        {
          question: "What is the subscription contract period?",
          answer:
            "We have flexible options: monthly contract with no long commitment, or annual contract with 10% discount. You can choose what suits you.",
        },
        {
          question: "Is the router free?",
          answer:
            "Yes, we provide a professional router free with all our packages. The router has high specs and supports the latest WiFi technologies.",
        },
      ],
      resources: [
        {
          title: "User Guide",
          description: "Comprehensive guide to using our services",
        },
        {
          title: "Video Tutorials",
          description: "Step-by-step illustrated tutorials",
        },
        {
          title: "Troubleshooting",
          description: "Solve common problems yourself",
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
              <Headphones className="h-4 w-4 text-primary" />
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

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t.searchPlaceholder}
                  className="h-14 pl-12 pr-4 glass-card-strong border-primary/20 focus:border-primary/40 text-lg rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {t.supportChannels}
                </span>
              </h2>
            </div>

            <DynamicSupportInfo language={language} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong border border-primary/20 rounded-full">
                <HelpCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === "ar" ? "الأسئلة" : "FAQs"}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {t.faqTitle}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground font-light">
                {t.faqSubtitle}
              </p>
            </div>

            <Card className="glass-card-strong border-primary/10">
              <CardContent className="p-6">
                <DynamicFaqs language={language} limit={5} />
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-10 glass-card-strong border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 font-semibold"
              >
                <BookOpen className="h-5 w-5" />
                {t.viewAllFAQ}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {t.helpCenter}
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: BookOpen,
                  color: "from-blue-500 to-cyan-500",
                  ...t.resources[0],
                },
                {
                  icon: Video,
                  color: "from-purple-500 to-pink-500",
                  ...t.resources[1],
                },
                {
                  icon: AlertCircle,
                  color: "from-orange-500 to-red-500",
                  ...t.resources[2],
                },
              ].map((resource, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 cursor-pointer"
                >
                  <CardContent className="pt-10 pb-8 text-center space-y-5">
                    <div
                      className={`inline-flex p-5 bg-gradient-to-br ${resource.color} rounded-2xl shadow-xl`}
                    >
                      <resource.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground font-light">
                        {resource.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                ? "لم تجد إجابة لسؤالك؟"
                : "Didn't Find an Answer?"}
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              {language === "ar"
                ? "تواصل مع فريق الدعم الفني المتخصص"
                : "Contact our specialized technical support team"}
            </p>
            <Button
              size="lg"
              className="group relative h-16 px-12 text-lg font-bold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-110 rounded-2xl overflow-hidden"
              onClick={() => onNavigate("contact")}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <Headphones className="h-6 w-6 relative z-10" />
              <span className="relative z-10">{t.contactSupport}</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

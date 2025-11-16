import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  Rocket,
  Headphones,
  Globe2,
} from "lucide-react";
import { PageType, Language } from "../components/Navigation";
import { DynamicContactInfo } from "../components/DynamicContactInfo";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";
import React from "react";
interface ContactPageProps {
  onNavigate: (page: PageType) => void;
  language: Language;
}

export function ContactPage({ onNavigate, language }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const translations = {
    ar: {
      badge: "تواصل معنا",
      title: "لنبدأ معاً",
      subtitle: "نحن هنا لمساعدتك",
      description:
        "تواصل معنا اليوم وسنقوم بالرد عليك في أسرع وقت ممكن. فريقنا جاهز لمساعدتك في أي استفسار أو احتياج",
      contactInfoTitle: "معلومات التواصل",
      sendMessageTitle: "أرسل لنا رسالة",
      formSubtitle: "املأ النموذج وسنتواصل معك خلال 24 ساعة",
      fullName: "الاسم الكامل",
      fullNamePlaceholder: "أدخل اسمك الكامل",
      email: "البريد الإلكتروني",
      emailPlaceholder: "your@email.com",
      phone: "رقم الهاتف",
      phonePlaceholder: "+963 xxx xxx xxx",
      message: "رسالتك",
      messagePlaceholder: "اكتب رسالتك هنا...",
      sendMessage: "إرسال الرسالة",
      location: "دمشق، سوريا",
      buildingName: "مركز سام للاتصالات",
      hours1: "السبت - الخميس: 9ص - 6م",
      hours2: "الجمعة: مغلق",
      callNow: "اتصل بنا",
      subscribe: "اشترك الآن",
      quickContactTitle: "تواصل سريع",
      quickContactDesc: "اختر الطريقة الأنسب لك",
      liveChat: "الدردشة المباشرة",
      techSupport: "الدعم الفني",
      bookMeeting: "احجز موعد",
    },
    en: {
      badge: "Contact Us",
      title: "Let's Start Together",
      subtitle: "We're Here to Help",
      description:
        "Contact us today and we'll respond as soon as possible. Our team is ready to assist you with any inquiry or need",
      contactInfoTitle: "Contact Information",
      sendMessageTitle: "Send Us a Message",
      formSubtitle: "Fill the form and we'll contact you within 24 hours",
      fullName: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "your@email.com",
      phone: "Phone Number",
      phonePlaceholder: "+963 xxx xxx xxx",
      message: "Your Message",
      messagePlaceholder: "Write your message here...",
      sendMessage: "Send Message",
      location: "Damascus, Syria",
      buildingName: "SAM Communications Center",
      hours1: "Saturday - Thursday: 9AM - 6PM",
      hours2: "Friday: Closed",
      callNow: "Call Us",
      subscribe: "Subscribe Now",
      quickContactTitle: "Quick Contact",
      quickContactDesc: "Choose the method that suits you",
      liveChat: "Live Chat",
      techSupport: "Technical Support",
      bookMeeting: "Book Appointment",
    },
  };

  const t = translations[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === "name" ? "name" : id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

         try {
       console.log('Sending message:', { name: formData.name, email: formData.email, phone: formData.phone, message: formData.message });
       const response = await axios.post("http://127.0.0.1:8000/api/messages", {
         name: formData.name,
         email: formData.email,
         phone: formData.phone || null,
         message: formData.message,
       });
       
       console.log('Message sent successfully:', response.data);
       toast.success(
        language === "ar" 
          ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً" 
          : "Your message has been sent successfully! We'll contact you soon"
      );
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
         } catch (error: any) {
       console.error('Error sending message:', error);
       console.error('Error response:', error.response?.data);
       toast.error(
         language === "ar"
           ? "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى"
           : "An error occurred while sending the message. Please try again"
       );
     } finally {
       setIsSubmitting(false);
     }
  };

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
              <MessageSquare className="h-4 w-4 text-primary" />
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

      {/* Contact Information Cards */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong border border-primary/20 rounded-full mb-4">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {t.contactInfoTitle}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {language === "ar" ? "كيفية التواصل معنا" : "How to Reach Us"}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                {language === "ar" 
                  ? "اختر الطريقة الأنسب لك للتواصل معنا" 
                  : "Choose the most suitable way to contact us"}
              </p>
            </div>

            {/* Dynamic Contact Information */}
            <DynamicContactInfo language={language} />

            {/* Contact Form and Info Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="glass-card-strong border-primary/10 p-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass-card border border-primary/20 rounded-full">
                      <Send className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">
                        {t.sendMessageTitle}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-light">
                      {t.formSubtitle}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">
                        {t.fullName}
                      </Label>
                      <Input
                        id="name"
                        placeholder={t.fullNamePlaceholder}
                        className="h-12 glass-card border-primary/10 focus:border-primary/30"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-semibold">
                          {t.email}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t.emailPlaceholder}
                          className="h-12 glass-card border-primary/10 focus:border-primary/30"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-semibold">
                          {t.phone}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          className="h-12 glass-card border-primary/10 focus:border-primary/30"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-semibold">
                        {t.message}
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={t.messagePlaceholder}
                        rows={6}
                        className="glass-card border-primary/10 focus:border-primary/30 resize-none"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                      {isSubmitting ? (
                        <div className="relative z-10 flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>
                            {language === "ar" ? "جاري الإرسال..." : "Sending..."}
                          </span>
                        </div>
                      ) : (
                        <>
                          <Send className="h-5 w-5 relative z-10" />
                          <span className="relative z-10">{t.sendMessage}</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>

              {/* Quick Contact Options */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 glass-card border border-primary/20 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      {t.quickContactTitle}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-light">
                    {t.quickContactDesc}
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: MessageSquare,
                      title: t.liveChat,
                      description: language === "ar" 
                        ? "تحدث معنا مباشرة للحصول على إجابات فورية"
                        : "Chat with us directly for instant answers",
                      color: "from-blue-500 to-cyan-500",
                      action: language === "ar" ? "ابدأ المحادثة" : "Start Chat",
                    },
                    {
                      icon: Headphones,
                      title: t.techSupport,
                      description: language === "ar"
                        ? "تواصل مع فريق الدعم التقني للمساعدة"
                        : "Contact our technical support team",
                      color: "from-green-500 to-emerald-500",
                      action: language === "ar" ? "احصل على الدعم" : "Get Support",
                    },
                    {
                      icon: Rocket,
                      title: t.subscribe,
                      description: language === "ar"
                        ? "اشترك الآن واستمتع بأسرع إنترنت"
                        : "Subscribe now and enjoy the fastest internet",
                      color: "from-orange-500 to-red-500",
                      action: language === "ar" ? "اشترك الآن" : "Subscribe",
                    },
                  ].map((option, index) => (
                    <Card
                      key={index}
                      className="group relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 cursor-pointer"
                      onClick={() => onNavigate(index === 2 ? "home-internet" : "support")}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                      <CardContent className="p-6 flex items-start gap-4 relative">
                        <div
                          className={`flex-shrink-0 p-3 bg-gradient-to-br ${option.color} rounded-2xl shadow-xl`}
                        >
                          <option.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-lg">{option.title}</h3>
                          <p className="text-sm text-muted-foreground font-light">
                            {option.description}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-4 glass-card hover:bg-primary/10 transition-all duration-300"
                          >
                            {option.action}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

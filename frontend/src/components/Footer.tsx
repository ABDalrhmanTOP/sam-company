import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Wifi,
  Send,
  Sparkles,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Language } from "./Navigation";
import { Input } from "./ui/input";
import logo from "../assets/687e5a16fd08cc5f84ef904ce9a76a663d5116d7.png";
import { useEffect, useState } from "react";
import axios from "axios";

interface FooterProps {
  language: Language;
}

const socialLinks = [
  {
    icon: Facebook,
    href: "#",
    label: "Facebook",
    color: "hover:text-blue-500",
  },
  {
    icon: Twitter,
    href: "#",
    label: "Twitter",
    color: "hover:text-sky-500",
  },
  {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn",
    color: "hover:text-blue-600",
  },
  {
    icon: Instagram,
    href: "#",
    label: "Instagram",
    color: "hover:text-pink-500",
  },
];

interface ContactInfo {
  id: number;
  type: string;
  label_ar: string;
  label_en: string;
  value: string;
  icon?: string;
  link?: string;
  order?: number;
  is_active?: boolean;
  description_ar?: string;
  description_en?: string;
}

const getIconComponent = (iconName: string = '') => {
  const iconMap: Record<string, any> = {
    Phone: Phone,
    Mail: Mail,
    MapPin: MapPin,
    MessageCircle: MessageCircle,
    Clock: Clock,
  };
  return iconMap[iconName] || Phone;
};

export function Footer({ language }: FooterProps) {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [loadingContactInfo, setLoadingContactInfo] = useState(true);

  useEffect(() => {
    const fetchContactInfos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/contact-info');
        const allInfos = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        // Filter by active status and sort by order
        const activeInfos = allInfos
          .filter((info: ContactInfo) => info.is_active !== false)
          .sort((a: ContactInfo, b: ContactInfo) => (a.order || 0) - (b.order || 0));
        
        setContactInfos(activeInfos);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoadingContactInfo(false);
      }
    };

    fetchContactInfos();
  }, []);

  const translations = {
    ar: {
      quickLinks: "روابط سريعة",
      home: "الرئيسية",
      services: "خدماتنا",
      about: "من نحن",
      contact: "اتصل بنا",
      ourServices: "خدماتنا",
      webDev: "إنترنت منزلي",
      consulting: "إنترنت للشركات",
      support: "اختبار السرعة",
      contactInfo: "معلومات التواصل",
      companyDesc:
        "مزود خدمات الإنترنت الرائد في سوريا. نوفر أسرع اتصال بالألياف الضوئية لمنزلك وعملك مع دعم فني على مدار الساعة.",
      location: "دمشق",
      buildingName: "مركز سام نت للاتصالات",
      copyright: "© 2025 سام نت. جميع الحقوق محفوظة.",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      cookies: "سياسة الكوكيز",
      newsletter: "النشرة البريدية",
      newsletterDesc: "اشترك للحصول على أحدث العروض والأخبار",
      emailPlaceholder: "البريد الإلكتروني",
      subscribe: "اشتراك",
    },
    en: {
      quickLinks: "Quick Links",
      home: "Home",
      services: "Our Services",
      about: "About Us",
      contact: "Contact Us",
      ourServices: "Our Services",
      webDev: "Home Internet",
      consulting: "Business Internet",
      support: "Speed Test",
      contactInfo: "Contact Information",
      companyDesc:
        "Leading internet service provider in Syria. We provide the fastest fiber optic connection for your home and business with 24/7 technical support.",
      location: "Damascus",
      buildingName: "SAM NET Communications Center",
      copyright: "© 2025 SAM NET. All Rights Reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      cookies: "Cookie Policy",
      newsletter: "Newsletter",
      newsletterDesc: "Subscribe to get latest offers and news",
      emailPlaceholder: "Email address",
      subscribe: "Subscribe",
    },
  };

  const t = translations[language];

  const quickLinks = [
    { title: t.home, href: "#home" },
    { title: t.services, href: "#services" },
    { title: t.about, href: "#about" },
    { title: t.contact, href: "#contact" },
  ];

  const services = [
    { title: t.webDev, href: "#" },
    { title: t.consulting, href: "#" },
    { title: t.support, href: "#" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/30 border-t">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Company Info - Larger Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center">
                <div className="relative h-20 w-auto flex items-center justify-center">
                  <img
                    src={logo}
                    alt="SAM NET Logo"
                    className="h-full w-auto object-contain"
                  />
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed text-sm">
                {t.companyDesc}
              </p>

              {/* Social Links */}
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className={`group h-10 w-10 border-border hover:border-primary ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg rounded-xl`}
                      asChild
                    >
                      <a
                        href={social.href}
                        aria-label={social.label}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-4 text-foreground">{t.quickLinks}</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-4 text-foreground">{t.ourServices}</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <a
                      href={service.href}
                      className="group inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 mr-0 group-hover:mr-2 rounded-full" />
                      {service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="font-semibold mb-4 text-foreground">{t.contactInfo}</h4>
              
              <div className="space-y-3">
                {loadingContactInfo ? (
                  // Loading state
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg animate-pulse">
                          <div className="h-4 w-4 bg-primary/20 rounded" />
                        </div>
                        <div className="text-sm flex-1">
                          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : contactInfos.length > 0 ? (
                  // Display contact info from database (only first 3)
                  contactInfos.slice(0, 3).map((info) => {
                    const IconComponent = getIconComponent(info.icon);
                    const label = language === 'ar' ? info.label_ar : info.label_en;
                    const isAddress = info.type === 'address';
                    
                    return (
                      <a
                        key={info.id}
                        href={info.link || '#'}
                        className="flex items-start gap-3 group cursor-pointer"
                        onClick={(e) => {
                          if (!info.link || info.link === '#') {
                            e.preventDefault();
                          }
                        }}
                      >
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />
                        </div>
                        <div className="text-sm">
                          <p className="text-muted-foreground group-hover:text-primary transition-colors" dir={isAddress ? 'auto' : 'ltr'}>
                            {info.value}
                          </p>
                          {info.description_ar || info.description_en ? (
                            <p className="text-muted-foreground/70 mt-1 text-xs">
                              {language === 'ar' ? info.description_ar : info.description_en}
                            </p>
                          ) : null}
                        </div>
                      </a>
                    );
                  })
                ) : (
                  // Fallback if no contact info from database
                  <>
                    <div className="flex items-start gap-3 group cursor-pointer">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground group-hover:text-primary transition-colors" dir="ltr">
                          +963 11 123 4567
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 group cursor-pointer">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground group-hover:text-primary transition-colors">
                          info@samnet.sy
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 group cursor-pointer">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground group-hover:text-primary transition-colors">
                          {t.location}, {language === 'ar' ? 'سوريا' : 'Syria'}
                        </p>
                        <p className="text-muted-foreground/70 mt-1 text-xs">
                          {t.buildingName}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Newsletter */}
              <div className="pt-4">
                <h5 className="font-semibold mb-2 text-sm">{t.newsletter}</h5>
                <p className="text-xs text-muted-foreground mb-3">{t.newsletterDesc}</p>
                <div className="flex gap-2">
                  <Input 
                    type="email" 
                    placeholder={t.emailPlaceholder}
                    className="h-10 bg-background/50 border-border focus:border-primary rounded-xl"
                  />
                  <Button 
                    size="icon"
                    className="h-10 w-10 bg-gradient-to-r from-primary to-[#c01810] hover:from-[#c01810] hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              {t.copyright}
            </p>

            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t.privacy}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t.terms}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t.cookies}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </footer>
  );
}

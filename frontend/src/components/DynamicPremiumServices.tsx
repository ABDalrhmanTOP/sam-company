import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Star, 
  Shield, 
  Zap, 
  Crown, 
  Award, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Wifi,
  Headphones,
  Cloud,
  Server,
  Code,
  Building2,
  Globe2
} from 'lucide-react';

interface PremiumService {
  id: number;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  price: number;
  features: string[];
  features_ar?: string[];
  features_en?: string[];
  isActive: boolean;
  category: string;
  icon: string;
  color: string;
  createdAt: string;
}

interface DynamicPremiumServicesProps {
  language: 'ar' | 'en';
  limit?: number;
  showTitle?: boolean;
}

const iconMap: Record<string, any> = {
  Star,
  Shield,
  Zap,
  Crown,
  Award,
  Sparkles,
  Wifi,
  Headphones,
  Cloud,
  Server,
  Code,
  Building2
};

const colorMap: Record<string, string> = {
  primary: 'from-primary to-[#c01810]',
  red: 'from-red-500 to-red-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  c01810: 'from-[#c01810] to-[#a01810]',
  a01810: 'from-[#a01810] to-primary',
  // ألوان إضافية
  cyan: 'from-cyan-500 to-cyan-600',
  indigo: 'from-indigo-500 to-indigo-600',
  pink: 'from-pink-500 to-pink-600',
  teal: 'from-teal-500 to-teal-600',
  yellow: 'from-yellow-500 to-yellow-600',
  emerald: 'from-emerald-500 to-emerald-600',
  violet: 'from-violet-500 to-violet-600',
  rose: 'from-rose-500 to-rose-600'
};

export function DynamicPremiumServices({ 
  language, 
  limit, 
  showTitle = true 
}: DynamicPremiumServicesProps) {
  const [services, setServices] = useState<PremiumService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('🚀 Starting to fetch premium services...');
        console.log('📍 URL: http://127.0.0.1:8000/api/premium-services');
        
        const response = await axios.get('http://127.0.0.1:8000/api/premium-services');
        
        console.log('✅ Response received:', response);
        console.log('📊 Response status:', response.status);
        console.log('📋 Response data:', response.data);
        
        if (response.data && response.data.success) {
          console.log('🎯 Services data found:', response.data.data);
          console.log('📈 Number of services:', response.data.data?.length || 0);
          
          // Transform snake_case to camelCase
          const transformedServices = (response.data.data || []).map((service: any) => {
            const transformed = {
              id: service.id,
              name: service.name,
              name_en: service.name_en,
              description: service.description,
              description_en: service.description_en,
              price: service.price,
              features: service.features || [],
              features_ar: service.features_ar && Array.isArray(service.features_ar) && service.features_ar.length > 0 
                ? service.features_ar 
                : (service.features && Array.isArray(service.features) ? service.features : []),
              features_en: service.features_en && Array.isArray(service.features_en) && service.features_en.length > 0
                ? service.features_en.filter((f: any) => f && String(f).trim().length > 0)
                : [],
              isActive: service.is_active !== undefined ? service.is_active : service.isActive,
              category: service.category,
              icon: service.icon,
              color: service.color,
              createdAt: service.created_at || service.createdAt
            };
            // Debug: log features
            console.log(`Service ${transformed.id}:`, {
              features_ar: transformed.features_ar,
              features_en: transformed.features_en,
              features: transformed.features
            });
            return transformed;
          });
          
          console.log('🔄 Transformed services:', transformedServices);
          console.log('📊 Number of transformed services:', transformedServices.length);
          setServices(transformedServices);
        } else {
          console.error('❌ Failed to fetch premium services - response.data.success is false');
          console.error('📋 Response data:', response.data);
        }
      } catch (error) {
        console.error('💥 Error fetching premium services:', error);
        console.error('🔍 Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
      } finally {
        setLoading(false);
        console.log('🏁 Loading finished');
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {showTitle && (
          <div className="text-center space-y-4">
            <div className="h-8 w-64 mx-auto bg-muted rounded animate-pulse" />
            <div className="h-4 w-96 mx-auto bg-muted rounded animate-pulse" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-muted rounded-xl" />
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-8 w-24 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-2/3 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  const displayedServices = limit ? services.slice(0, limit) : services;

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Star;
  };

  const getColorClasses = (color: string) => {
    return colorMap[color] || colorMap.primary;
  };

  // Helper function to detect if text is Arabic
  const isArabic = (text: string): boolean => {
    return /[\u0600-\u06FF]/.test(text);
  };

  // Format features based on language
  const formatFeatures = (features: string[] | undefined, lang: string): string[] => {
    if (!features || features.length === 0) return [];
    
    return features.map((feature: string) => {
      if (typeof feature === 'string') {
        // If language is English and feature is in Arabic, provide a simple translation mapping
        if (lang === 'en' && isArabic(feature)) {
          // Simple translation mapping for common features
          const translations: { [key: string]: string } = {
            'سرعة 1 جيجابايت': '1 Gbps speed',
            'دعم فني 24/7': '24/7 technical support',
            'تصفح سريع ومستقر': 'Fast and stable browsing',
            'مشاهدة HD': 'HD viewing',
            'مشاهدة 4K': '4K viewing',
            '2-3 أجهزة': '2-3 devices',
            '5-7 أجهزة': '5-7 devices',
            'أجهزة غير محدودة': 'Unlimited devices',
            'راوتر مجاني': 'Free router',
            'راوتر متطور': 'Advanced router',
            'تركيب مجاني': 'Free installation',
            'تركيب احترافي': 'Professional installation',
            'سرعة فائقة': 'Ultra-fast speed',
            'ألعاب بدون تأخير': 'Gaming without lag',
            'دعم 24/7': '24/7 support',
            'سرعة 500 ميجا مضمونة': 'Guaranteed 500 Mbps speed',
            'IP ثابت مجاني': 'Free static IP',
            'عدة IP ثابتة': 'Multiple static IPs',
            'دعم VIP': 'VIP support',
            'دعم مخصص 24/7': 'Dedicated 24/7 support',
            'SLA 99.9%': '99.9% SLA',
            'SLA مضمون': 'Guaranteed SLA',
            'SLA مخصص': 'Custom SLA',
            'أولوية الخدمة': 'Service priority',
            'تقارير شهرية': 'Monthly reports',
            'تقارير أسبوعية': 'Weekly reports',
            'سرعة جيجابت كاملة': 'Full gigabit speed',
            'نسخ احتياطي': 'Backup',
            'حماية متقدمة': 'Advanced protection',
            'سرعات مخصصة': 'Custom speeds',
            'بنية تحتية متطورة': 'Advanced infrastructure',
            'فريق دعم مخصص': 'Dedicated support team',
            'حلول أمنية متقدمة': 'Advanced security solutions',
            'استشارات تقنية': 'Technical consultations',
            'إدارة شبكة كاملة': 'Complete network management',
            'دعم على مدار الساعة': 'Round-the-clock support',
            'مشاهدة مباشرة': 'Live streaming',
            'تحميل سريع': 'Fast download',
            'رابط مباشر': 'Direct connection',
            'عدم وجود حدود': 'No limits',
            'سرعة مضمونة': 'Guaranteed speed',
            'دعم فني': 'Technical support',
            'صيانة مجانية': 'Free maintenance',
            'ضمان الجودة': 'Quality assurance',
            'متابعة مستمرة': 'Continuous monitoring',
            'أمان عالي': 'High security',
            'حماية من الفيروسات': 'Virus protection',
            'جدار ناري': 'Firewall',
            'نسخ احتياطي تلقائي': 'Automatic backup',
            'حماية البيانات': 'Data protection',
            'تشفير البيانات': 'Data encryption',
            'حماية DDoS': 'DDoS protection',
            'مراقبة 24/7': '24/7 monitoring',
            'إشعارات فورية': 'Instant notifications',
            'لوحة تحكم': 'Control panel',
            'تقارير تفصيلية': 'Detailed reports',
            'تحليلات متقدمة': 'Advanced analytics',
          };
          
          // Check if translation exists
          if (translations[feature]) {
            return translations[feature];
          }
          
          // Return original if no translation found
          return feature;
        }
        return feature;
      }
      return String(feature);
    });
  };

  const getColorVariants = (color: string) => {
    const colorVariants: Record<string, any> = {
      primary: {
        text: 'text-primary',
        textHover: 'group-hover:text-primary',
        text600: 'text-primary',
        text700: 'text-primary',
        text500: 'text-primary',
        border: 'hover:border-primary/40',
        bg100: 'bg-primary/10',
        bg900: 'bg-primary/20',
      },
      blue: {
        text: 'text-blue-600',
        textHover: 'group-hover:text-blue-600',
        text600: 'text-blue-600',
        text700: 'text-blue-700',
        text500: 'text-blue-500',
        border: 'hover:border-blue-500/40',
        bg100: 'bg-blue-100',
        bg900: 'bg-blue-900/30'
      
      },
      red: {
        text: 'text-red-600',
      //  textHover: 'group-hover:text-red-600',
        text600: 'text-red-600',
        text700: 'text-red-700',
        text500: 'text-red-500',
      //  border: 'hover:border-red-500/40',
        bg100: 'bg-red-100',
        bg900: 'bg-red-900/30',
       // shadow: 'hover:shadow-red-500/25'
      },
      green: {
        text: 'text-green-600',
        textHover: 'group-hover:text-green-600',
        text600: 'text-green-600',
        text700: 'text-green-700',
        text500: 'text-green-500',
        border: 'hover:border-green-500/40',
        bg100: 'bg-green-100',
        bg900: 'bg-green-900/30',
        shadow: 'hover:shadow-green-500/25'
      },
      purple: {
        text: 'text-purple-600',
        textHover: 'group-hover:text-purple-600',
        text600: 'text-purple-600',
        text700: 'text-purple-700',
        text500: 'text-purple-500',
        border: 'hover:border-purple-500/40',
        bg100: 'bg-purple-100',
        bg900: 'bg-purple-900/30',
        shadow: 'hover:shadow-purple-500/25'
      },
      orange: {
        text: 'text-orange-600',
        textHover: 'group-hover:text-orange-600',
        text600: 'text-orange-600',
        text700: 'text-orange-700',
        text500: 'text-orange-500',
        border: 'hover:border-orange-500/40',
        bg100: 'bg-orange-100',
        bg900: 'bg-orange-900/30',
        shadow: 'hover:shadow-orange-500/25'
      },
      // ألوان إضافية
      cyan: {
        text: 'text-cyan-600',
        textHover: 'group-hover:text-cyan-600',
        text600: 'text-cyan-600',
        text700: 'text-cyan-700',
        text500: 'text-cyan-500',
        border: 'hover:border-cyan-500/40',
        bg100: 'bg-cyan-100',
        bg900: 'bg-cyan-900/30',
        shadow: 'hover:shadow-cyan-500/25'
      },
      indigo: {
        text: 'text-indigo-600',
        textHover: 'group-hover:text-indigo-600',
        text600: 'text-indigo-600',
        text700: 'text-indigo-700',
        text500: 'text-indigo-500',
        border: 'hover:border-indigo-500/40',
        bg100: 'bg-indigo-100',
        bg900: 'bg-indigo-900/30',
        shadow: 'hover:shadow-indigo-500/25'
      },
      pink: {
        text: 'text-pink-600',
        textHover: 'group-hover:text-pink-600',
        text600: 'text-pink-600',
        text700: 'text-pink-700',
        text500: 'text-pink-500',
        border: 'hover:border-pink-500/40',
        bg100: 'bg-pink-100',
        bg900: 'bg-pink-900/30',
        shadow: 'hover:shadow-pink-500/25'
      },
      teal: {
        text: 'text-teal-600',
        textHover: 'group-hover:text-teal-600',
        text600: 'text-teal-600',
        text700: 'text-teal-700',
        text500: 'text-teal-500',
        border: 'hover:border-teal-500/40',
        bg100: 'bg-teal-100',
        bg900: 'bg-teal-900/30',
        shadow: 'hover:shadow-teal-500/25'
      },
      yellow: {
        text: 'text-yellow-600',
        textHover: 'group-hover:text-yellow-600',
        text600: 'text-yellow-600',
        text700: 'text-yellow-700',
        text500: 'text-yellow-500',
        border: 'hover:border-yellow-500/40',
        bg100: 'bg-yellow-100',
        bg900: 'bg-yellow-900/30',
        shadow: 'hover:shadow-yellow-500/25'
      },
      emerald: {
        text: 'text-emerald-600',
        textHover: 'group-hover:text-emerald-600',
        text600: 'text-emerald-600',
        text700: 'text-emerald-700',
        text500: 'text-emerald-500',
        border: 'hover:border-emerald-500/40',
        bg100: 'bg-emerald-100',
        bg900: 'bg-emerald-900/30',
        shadow: 'hover:shadow-emerald-500/25'
      },
      violet: {
        text: 'text-violet-600',
        textHover: 'group-hover:text-violet-600',
        text600: 'text-violet-600',
        text700: 'text-violet-700',
        text500: 'text-violet-500',
        border: 'hover:border-violet-500/40',
        bg100: 'bg-violet-100',
        bg900: 'bg-violet-900/30',
        shadow: 'hover:shadow-violet-500/25'
      },
      rose: {
        text: 'text-rose-600',
        textHover: 'group-hover:text-rose-600',
        text600: 'text-rose-600',
        text700: 'text-rose-700',
        text500: 'text-rose-500',
        border: 'hover:border-rose-500/40',
        bg100: 'bg-rose-100',
        bg900: 'bg-rose-900/30',
        shadow: 'hover:shadow-rose-500/25'
      }
    };
    
    return colorVariants[color] || colorVariants.primary;
  };

  return (
    <div className="space-y-8">
      {showTitle && (
        <div className="text-center mb-20 space-y-8">
          {/* Subtle Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-full backdrop-blur-sm shadow-lg">
            <Globe2 className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {language === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
            </span>
          </div>
          
          {/* Clean Title */}
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              {language === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-primary to-[#c01810] mx-auto rounded-full" />
          </div>
          
          {/* Simple Description */}
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {language === 'ar' 
                ? 'اكتشف مجموعة واسعة من الخدمات المتميزة المصممة خصيصاً لتلبية احتياجاتك الرقمية' 
                : 'Discover a wide range of premium services specifically designed to meet your digital needs'
              }
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {displayedServices.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          const colorClasses = getColorClasses(service.color);
          const colorVars = getColorVariants(service.color);
          
          const title = language === 'ar' ? service.name : (service.name_en || service.name);
          const description = language === 'ar' ? service.description : (service.description_en || service.description);
          
          // Translate category
          const categoryTranslations: { [key: string]: { ar: string; en: string } } = {
            'إنترنت': { ar: 'إنترنت', en: 'Internet' },
            'أمان': { ar: 'أمان', en: 'Security' },
            'استضافة': { ar: 'استضافة', en: 'Hosting' },
            'تصميم': { ar: 'تصميم', en: 'Design' },
            'تطوير': { ar: 'تطوير', en: 'Development' },
            'دعم': { ar: 'دعم', en: 'Support' },
            'شبكة': { ar: 'شبكة', en: 'Network' },
          };
          const category = service.category 
            ? (language === 'ar' 
              ? (categoryTranslations[service.category]?.ar || service.category)
              : (categoryTranslations[service.category]?.en || service.category))
            : service.category;
          
          // Get features based on language - STRICT separation
          let displayFeatures: string[] = [];
          
          if (language === 'ar') {
            // For Arabic: ONLY use features_ar, strictly filter out English
            if (service.features_ar && Array.isArray(service.features_ar) && service.features_ar.length > 0) {
              displayFeatures = service.features_ar
                .filter((f: any) => {
                  if (f == null || String(f).trim().length === 0) return false;
                  const str = String(f).trim();
                  // Keep only if it contains Arabic characters
                  const hasArabic = /[\u0600-\u06FF]/.test(str);
                  return hasArabic;
                })
                .map((f: any) => String(f).trim());
            } else if (service.features && Array.isArray(service.features) && service.features.length > 0) {
              // Fallback: filter features to keep only Arabic
              displayFeatures = service.features
                .filter((f: any) => {
                  if (f == null || String(f).trim().length === 0) return false;
                  const str = String(f).trim();
                  const hasArabic = /[\u0600-\u06FF]/.test(str);
                  return hasArabic;
                })
                .map((f: any) => String(f).trim());
            }
          } else {
            // For English: ONLY use features_en, strictly filter out Arabic
            if (service.features_en && Array.isArray(service.features_en) && service.features_en.length > 0) {
              displayFeatures = service.features_en
                .filter((f: any) => {
                  if (f == null || String(f).trim().length === 0) return false;
                  const str = String(f).trim();
                  // Strictly remove ANY Arabic text
                  const hasArabic = /[\u0600-\u06FF]/.test(str);
                  return !hasArabic; // Only keep non-Arabic
                })
                .map((f: any) => String(f).trim())
                .filter((f: string) => f.length > 0);
              
              // If we filtered out everything (all were Arabic), translate from features_ar
              if (displayFeatures.length === 0) {
                if (service.features_ar && Array.isArray(service.features_ar) && service.features_ar.length > 0) {
                  displayFeatures = formatFeatures(service.features_ar, language);
                } else if (service.features && Array.isArray(service.features) && service.features.length > 0) {
                  displayFeatures = formatFeatures(service.features, language);
                }
              }
            } else {
              // No features_en, translate from features_ar
              if (service.features_ar && Array.isArray(service.features_ar) && service.features_ar.length > 0) {
                displayFeatures = formatFeatures(service.features_ar, language);
              } else if (service.features && Array.isArray(service.features) && service.features.length > 0) {
                displayFeatures = formatFeatures(service.features, language);
              }
            }
            
            // Final safety check: remove any Arabic that might have slipped through
            displayFeatures = displayFeatures.filter((f: string) => {
              const hasArabic = /[\u0600-\u06FF]/.test(f);
              return !hasArabic;
            });
          }
          
          // Ensure we always have an array
          if (!Array.isArray(displayFeatures)) {
            displayFeatures = [];
          }
          
          // Debug: Log mixed language issues
          if (displayFeatures.length > 0) {
            const hasArabic = displayFeatures.some((f: string) => isArabic(f));
            const hasEnglish = displayFeatures.some((f: string) => !isArabic(f) && /[A-Za-z]/.test(f));
            if (hasArabic && hasEnglish && language === 'en') {
              console.warn(`⚠️ Service ${service.id} has mixed languages in English view:`, {
                displayFeatures,
                features_ar: service.features_ar,
                features_en: service.features_en
              });
            }
          }

          return (
            <Card
              key={service.id}
              className={`group relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer rounded-2xl`}
            >
              {/* Subtle gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Clean border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colorClasses} p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 rounded-2xl" />
              </div>

              <div className="relative z-0 p-8">
                {/* Clean Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Simple Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${colorClasses} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Category */}
                    <div className="space-y-2">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorVars.bg100} ${colorVars.text700}`}>
                        {category}
                      </div>
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${colorClasses} rounded-full`} />
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${service.isActive ? `${colorVars.bg100} ${colorVars.text700}` : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {service.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </div>
                </div>

                {/* Clean Title and Description */}
                <div className="space-y-4 mb-6">
                  <h3 className={`text-2xl font-bold ${colorVars.text600} group-hover:${colorVars.text700} transition-colors duration-300 leading-tight`}>
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    {description}
                  </p>
                </div>

                {/* Simple Features Section */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {language === 'ar' ? 'الميزات الرئيسية' : 'Key Features'}
                  </h4>
                  
                  <div className="space-y-3">
                    {displayFeatures.slice(0, 3).map((feature, fIndex) => (
                      <div
                        key={fIndex}
                        className="flex items-center gap-3"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 bg-gradient-to-br ${colorClasses} rounded-lg flex items-center justify-center`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {displayFeatures.length > 3 && (
                      <div className={`text-xs ${colorVars.text500} font-medium`}>
                        +{displayFeatures.length - 3} {language === 'ar' ? 'ميزات إضافية' : 'more features'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Clean Price and CTA Section */}
                <div className="space-y-6">
                  {/* Simple Price Display */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${colorVars.text600} mb-1`}>
                      {service.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {language === 'ar' ? 'ليرة سورية' : 'Syrian Pounds'}
                    </div>
                  </div>

                  {/* Simple CTA Button */}
                  <button
                    className={`w-full h-12 bg-gradient-to-r ${colorClasses} hover:shadow-lg ${colorVars.shadow} rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>
                        {language === 'ar' ? 'احصل على الخدمة' : 'Get Service'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

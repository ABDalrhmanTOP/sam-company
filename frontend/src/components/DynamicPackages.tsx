import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Check, Star, Crown, ArrowRight, Network, Zap, Shield, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
// Utility function for conditional classes
const cn = (...classes: (string | undefined | null | false)[]) => 
  classes.filter(Boolean).join(' ');
interface Package {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  speed: string;
  speed_unit: string;
  features: string[] | Array<{ ar: string; en: string }> | Array<string>;
  features_ar?: string[];
  features_en?: string[];
  type: string;
  is_active: boolean | number;
  order: number;
  popular: boolean | number;
}

interface DynamicPackagesProps {
  packageType: string;
  language: string;
  limit?: number;
}

export function DynamicPackages({ packageType, language, limit }: DynamicPackagesProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/packages`);
        const allPackages = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        // Filter packages by type and active status
        const filteredPackages = allPackages.filter((pkg: Package) => {
          const matchesType = pkg.type === packageType;
          const isActive = pkg.is_active === true || (typeof pkg.is_active === 'number' && pkg.is_active === 1);
          return matchesType && isActive;
        });
        
        // Sort by order
        const sortedPackages = filteredPackages.sort((a: Package, b: Package) => 
          (a.order || 0) - (b.order || 0)
        );
        
        setPackages(sortedPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [packageType]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse overflow-hidden h-full">
            <CardHeader className="text-center pt-10 pb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl mb-8" />
              <div className="h-8 w-3/4 mx-auto bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded mb-3" />
              <div className="h-4 w-full bg-gradient-to-r from-muted/30 via-muted to-muted/30 rounded" />
            </CardHeader>
            <CardContent className="pt-0 pb-8 space-y-8">
              <div className="py-6 rounded-2xl bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60">
                <div className="h-12 w-3/4 mx-auto bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded mb-2" />
                <div className="h-4 w-1/2 mx-auto bg-gradient-to-r from-muted/30 via-muted to-muted/30 rounded" />
              </div>
              <div className="py-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="h-10 w-1/2 mx-auto bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded mb-2" />
                <div className="h-4 w-1/3 mx-auto bg-gradient-to-r from-muted/30 via-muted to-muted/30 rounded" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-muted/30 to-muted/20" />
                    <div className="h-4 flex-1 bg-gradient-to-r from-muted/30 via-muted to-muted/30 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-14 w-full bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{language === 'ar' ? 'لا توجد باقات متاحة حالياً' : 'No packages available at the moment'}</p>
      </div>
    );
  }

  const displayedPackages = limit ? packages.slice(0, limit) : packages;

  // Get icon based on package index
  const getPackageIcon = (index: number) => {
    const icons = [Network, Zap, Rocket, Shield, Star, Crown];
    return icons[index % icons.length];
  };

  // Format price with better handling
  const formatPrice = (priceStr: string) => {
    if (!priceStr || priceStr.trim() === '' || priceStr === '0') return null;
    const price = parseFloat(priceStr);
    if (!price || isNaN(price) || price === 0) return null;
    return price.toLocaleString();
  };

  // Format speed with better handling
  const formatSpeed = (speedStr: string) => {
    if (!speedStr || speedStr.trim() === '' || speedStr === '0') return null;
    
    // Translate "حسب الطلب" to English if needed
    if (language === 'en' && speedStr.trim() === 'حسب الطلب') {
      return 'On Demand';
    }
    
    return speedStr;
  };

  // Format speed unit based on language
  const formatSpeedUnit = (speedUnit: string | null | undefined) => {
    if (!speedUnit) return null;
    
    // Trim whitespace
    const unit = speedUnit.trim();
    
    // If speed_unit contains Arabic text, return as is for Arabic, translate for English
    if (language === 'en') {
      // Check if unit contains Arabic characters
      const hasArabic = /[\u0600-\u06FF]/.test(unit);
      
      if (hasArabic) {
        // Translate common Arabic speed units to English
        const unitTranslations: { [key: string]: string } = {
          'ميجا': 'Mbps',
          'ميجابت': 'Mbps',
          'جيجا': 'Gbps',
          'جيجابت': 'Gbps',
          'جيجابت/ثانية': 'Gbps',
          'ميجابت/ثانية': 'Mbps',
          'م.ب/ث': 'Mbps',
          'ج.ب/ث': 'Gbps',
        };
        
        // Exact match first
        if (unitTranslations[unit]) {
          return unitTranslations[unit];
        }
        
        // Check if the unit contains any Arabic word
        for (const [ar, en] of Object.entries(unitTranslations)) {
          if (unit.includes(ar)) {
            return unit.replace(ar, en);
          }
        }
        
        // Default translation for Arabic units
        if (unit.includes('ميجا')) {
          return 'Mbps';
        }
        if (unit.includes('جيجا')) {
          return 'Gbps';
        }
      }
      
      // If it's already in English or unrecognized, return as is
      return unit;
    }
    
    // For Arabic, return as is
    return unit;
  };

  // Helper function to detect if text is Arabic
  const isArabic = (text: string): boolean => {
    return /[\u0600-\u06FF]/.test(text);
  };

  // Format features based on language
  const formatFeatures = (features: string[] | Array<{ ar: string; en: string }> | Array<string> | undefined, lang: string) => {
    if (!features || features.length === 0) return [];
    
    return features.map((feature: any) => {
      // If feature is an object with ar and en properties
      if (typeof feature === 'object' && feature !== null && 'ar' in feature && 'en' in feature) {
        return lang === 'ar' ? feature.ar : feature.en;
      }
      
      // If feature is a string
      if (typeof feature === 'string') {
        // If language is English and feature is in Arabic, provide a simple translation mapping
        if (lang === 'en' && isArabic(feature)) {
          // Simple translation mapping for common features
          const translations: { [key: string]: string } = {
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
            // Additional common translations
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
          };
          
          // Check if translation exists
          if (translations[feature]) {
            return translations[feature];
          }
        }
        return feature;
      }
      
      return String(feature);
    });
  };

  // Helper function to render package card
  const renderPackageCard = (pkg: Package, index: number) => {
    const name = language === 'ar' ? pkg.name_ar : pkg.name_en;
    const description = language === 'ar' ? pkg.description_ar : pkg.description_en;
    const formattedPrice = formatPrice(pkg.price);
    const formattedSpeed = formatSpeed(pkg.speed);
    const formattedSpeedUnit = formatSpeedUnit(pkg.speed_unit);
    
    // Get features based on language - check if features_ar/features_en exist first
    let displayFeatures: string[] = [];
    if (pkg.features_ar && pkg.features_en && Array.isArray(pkg.features_ar) && Array.isArray(pkg.features_en)) {
      // Use bilingual features if both exist
      if (language === 'ar') {
        displayFeatures = pkg.features_ar;
      } else {
        // For English, use features_en but translate any Arabic text that might be there
        displayFeatures = pkg.features_en.map((feature: string) => {
          // Check if feature still contains Arabic (shouldn't happen, but just in case)
          if (isArabic(feature)) {
            return formatFeatures([feature], language)[0] || feature;
          }
          return feature;
        });
      }
    } else if (pkg.features && Array.isArray(pkg.features)) {
      // Fallback to old features array with translation
      displayFeatures = formatFeatures(pkg.features, language);
    } else {
      // No features available
      displayFeatures = [];
    }
    
    const Icon = getPackageIcon(index);
    
    // Convert popular to boolean for display
    const isPopular = pkg.popular === true || pkg.popular === 1;

    return (
      <Card
      className={cn(
        "group relative h-full flex flex-col  transition-all duration-500 overflow-visible package-card",
        isPopular
          ? "border border-primary/30  bg-gradient-to-br from-primary/[0.02] via-card to-primary/[0.01] shadow-lg hover:shadow-xl hover:scale-[1.01] hover:-translate-y-1"
          : "border border-border/50 bg-card/95 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg hover:scale-[1.005] hover:-translate-y-1"
      )}
      >
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/3 via-transparent to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Gentle accent for popular packages */}
        {isPopular && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 via-primary/2 to-primary/5 opacity-30" />
        )}
        
        {/* Premium Top Border */}
        {isPopular && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}

        {/* Elegant Popular Badge */}
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <Badge className="bg-gradient-to-r from-primary/90 to-primary/80 text-white shadow-lg px-5 py-1.5 rounded-full border-0">
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 fill-white text-white" />
                <span className="text-xs font-semibold tracking-wide">
                  {language === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </span>
              </div>
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pt-10 pb-6 flex-grow relative">
          {/* Elegant Icon Container */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary/15 via-primary/8 to-primary/5 flex items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 shadow-lg">
              <Icon className="h-12 w-12 text-primary/80 group-hover:text-primary transition-colors duration-300" />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {isPopular && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-3xl font-bold text-foreground mb-3">
            {name}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-8 space-y-8">
          {/* Premium Speed Display */}
          {formattedSpeed && (
            <div className="text-center py-6 rounded-xl bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 border border-border/40">
              <div className="text-4xl font-bold text-primary mb-2">
                {formattedSpeed}
              </div>
              {formattedSpeedUnit && (
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  {formattedSpeedUnit}
                </div>
              )}
            </div>
          )}

          {/* Elegant Price Display */}
          {formattedPrice ? (
            <div className="text-center py-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="text-3xl font-bold text-foreground mb-2">
                {formattedPrice}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {language === 'ar' ? 'ليرة سورية/شهرياً' : 'SYP/month'}
              </div>
            </div>
          ) : (
            <div className="text-center py-5 border border-dashed border-primary/30 rounded-xl bg-gradient-to-br from-primary/8 to-primary/5 group-hover:from-primary/10 group-hover:to-primary/8 transition-all">
              <div className="text-lg font-semibold text-primary">
                {language === 'ar' ? 'اسعار مخصصة' : 'Custom Pricing'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {language === 'ar' ? 'اتصل للحصول على عرض' : 'Contact for quote'}
              </div>
            </div>
          )}

          {/* Enhanced Features List */}
          <div className="space-y-3">
            {displayFeatures && displayFeatures.length > 0 ? (
              displayFeatures.map((feature: string, fIndex: number) => (
                <div key={`feature-${fIndex}`} className="flex items-start gap-3 group/item">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 group-hover/item:scale-110 group-hover/item:bg-primary/20 transition-all duration-300">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80 leading-relaxed group-hover/item:text-foreground transition-colors duration-300">
                    {feature}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-6 bg-muted/30 rounded-xl">
                {language === 'ar' ? 'لا توجد ميزات محددة' : 'No specific features'}
              </div>
            )}
          </div>

          {/* Premium CTA Button with Animations */}
          <Button
            className={`w-full h-12 font-semibold text-base transition-all duration-300 rounded-xl group/btn relative overflow-hidden ${
              isPopular
                ? "bg-primary hover:bg-primary/90  shadow-lg hover:shadow-xl animate-btn-pulse"
                : "border border-primary bg-transparent  text-red-800 text-primary hover:bg-primary hover:text-white hover:shadow-lg"
            }`}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 scale-0 group-active/btn:scale-100 group-active/btn:opacity-0 transition-all duration-500 rounded-xl bg-white/30"></div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-xl bg-white/10 blur-sm"></div>
            
            <div className="flex items-center justify-center gap-2 relative z-10">
              <span className="text-current group-hover/btn:scale-105 transition-transform duration-300">
                {language === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
              </span>
              <ArrowRight className="h-4 w-4 text-current group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-all duration-300" />
            </div>
          </Button>
        </CardContent>

        {/* Elegant Bottom Accent */}
        {isPopular && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>
        )}
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedPackages.map((pkg: Package, index: number) => (
        <div 
          key={pkg.id && pkg.id > 0 ? `pkg-${pkg.id}` : `pkg-index-${index + 1}`}
          className="transform transition-all duration-300"
        >
          {renderPackageCard(pkg, index)}
        </div>
      ))}
    </div>
  );
}
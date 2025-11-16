import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Phone, Mail, MapPin, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import type { Icon } from 'lucide-react';

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

interface DynamicContactInfoProps {
  language: string;
}

const getIconComponent = (iconName: string = ''): Icon => {
  const iconMap: Record<string, Icon> = {
    Phone: Phone,
    Mail: Mail,
    MapPin: MapPin,
    MessageCircle: MessageCircle,
    Clock: Clock,
  };
  
  return iconMap[iconName] || Phone;
};

export function DynamicContactInfo({ language }: DynamicContactInfoProps) {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfos = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/contact-info`);
        const allInfos = Array.isArray(response.data) ? response.data : (response.data?.data || []);

        // Filter by active status and sort by order
        const activeInfos = allInfos
          .filter((info: ContactInfo) => info.is_active)
          .sort((a: ContactInfo, b: ContactInfo) => (a.order || 0) - (b.order || 0));

        setContactInfos(activeInfos);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfos();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (contactInfos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{language === 'ar' ? 'لا توجد معلومات اتصال متاحة' : 'No contact information available'}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {contactInfos.map((info, index) => {
        const IconComponent = getIconComponent(info.icon);
        const label = language === 'ar' ? info.label_ar : info.label_en;
        const description = language === 'ar' ? info.description_ar : info.description_en;
        
        // Different gradient colors for each card
        const gradients = [
          'from-blue-500 to-cyan-500',      // Phone (index 0)
          'from-orange-500 to-red-500',     // Email (index 1) - swapped with WhatsApp
          'from-green-500 to-emerald-500',  // WhatsApp (index 2) - swapped with Email
          'from-purple-500 to-pink-500',
          'from-indigo-500 to-blue-500',
        ];
        const gradient = gradients[index % gradients.length];

        return (
          <Card 
            key={info.id} 
            className="group relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Gradient fill background - fills from top-left (icon position) on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-15 transition-all duration-700 ease-out`} />
            
            {/* Radial gradient that spreads from the icon position (top-left) */}
            <div 
              className={`absolute top-0 left-0 w-0 h-0 opacity-0 group-hover:opacity-20 group-hover:w-[400px] group-hover:h-[400px] transition-all duration-700 ease-out rounded-full`}
              style={{
                background: `radial-gradient(circle, var(--tw-gradient-from), transparent 70%)`,
                '--tw-gradient-from': gradient.includes('blue-500') ? 'rgb(59 130 246)' : 
                                     gradient.includes('green-500') ? 'rgb(34 197 94)' :
                                     gradient.includes('orange-500') ? 'rgb(249 115 22)' :
                                     gradient.includes('purple-500') ? 'rgb(168 85 247)' :
                                     'rgb(99 102 241)',
              } as React.CSSProperties}
            />
            
            {/* Decorative gradient background */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 group-hover:scale-150 transition-transform duration-700`} />
            
            <CardContent className="p-8 relative z-10">
              <div className="space-y-6">
                {/* Icon and Title */}
                <div className="space-y-3">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">{label}</h3>
                    {description && (
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Value */}
                <div className="py-3 px-4 glass-card border border-primary/10 rounded-xl">
                  <p className="text-foreground font-semibold text-lg">{info.value}</p>
                </div>
                
                {/* Contact Button */}
                {info.link && (
                  <Button
                    className={`w-full h-12 bg-gradient-to-r ${gradient} hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-semibold text-white`}
                    onClick={() => window.open(info.link, '_blank')}
                  >
                    {language === 'ar' ? 'تواصل الآن' : 'Contact Now'}
                    <ExternalLink className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

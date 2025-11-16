import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Phone, Mail, MessageCircle, Globe, Headphones, Clock, MessageSquare, Ticket, BookOpen, Video, MapPin } from 'lucide-react';

interface SupportInfo {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon?: string;
  type: 'channel' | 'method' | 'info';
  value?: string;
  link?: string;
  is_active: boolean | number;
  order: number;
}

interface DynamicSupportInfoProps {
  language: string;
  limit?: number;
}

const getIconByName = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'phone': Phone,
    'mail': Mail,
    'message-square': MessageSquare,
    'message-circle': MessageCircle,
    'ticket': Ticket,
    'book-open': BookOpen,
    'video': Video,
    'clock': Clock,
    'globe': Globe,
    'map-pin': MapPin,
    'headphones': Headphones,
  };
  
  return iconMap[iconName] || Headphones;
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'channel':
      return Phone;
    case 'method':
      return MessageCircle;
    case 'info':
      return Globe;
    default:
      return Headphones;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'channel':
      return 'from-blue-500 to-cyan-500';
    case 'method':
      return 'from-green-500 to-emerald-500';
    case 'info':
      return 'from-orange-500 to-red-500';
    default:
      return 'from-purple-500 to-pink-500';
  }
};

export function DynamicSupportInfo({ language, limit }: DynamicSupportInfoProps) {
  const [supportInfos, setSupportInfos] = useState<SupportInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportInfos = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/support-info`);
        const allInfos = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        // Filter by active status
        const filteredInfos = allInfos.filter((info: SupportInfo) => {
          const isActive = info.is_active === true || (typeof info.is_active === 'number' && info.is_active === 1);
          return isActive;
        });
        
        // Sort by order
        const sortedInfos = filteredInfos.sort((a: SupportInfo, b: SupportInfo) => 
          (a.order || 0) - (b.order || 0)
        );
        
        setSupportInfos(sortedInfos);
      } catch (error) {
        console.error('Error fetching support info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportInfos();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse overflow-hidden glass-card-strong border-primary/10">
            <CardContent className="pt-8 pb-6 space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl" />
              <div className="h-4 w-3/4 mx-auto bg-gradient-to-r from-muted/50 via-muted to-muted/50 rounded" />
              <div className="h-3 w-full bg-gradient-to-r from-muted/30 via-muted to-muted/30 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (supportInfos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{language === 'ar' ? 'لا توجد معلومات دعم متاحة حالياً' : 'No support information available at the moment'}</p>
      </div>
    );
  }

  const displayedInfos = limit ? supportInfos.slice(0, limit) : supportInfos;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedInfos.map((info) => {
        const title = language === 'ar' ? info.title_ar : info.title_en;
        const description = language === 'ar' ? info.description_ar : info.description_en;
        const Icon = info.icon ? getIconByName(info.icon) : getTypeIcon(info.type);
        const color = getTypeColor(info.type);

        return (
          <Card
            key={info.id}
            className="group relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <CardContent className="pt-8 pb-6 space-y-5 relative">
              <div className={`inline-flex p-4 bg-gradient-to-br ${color} rounded-2xl shadow-xl`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-xl">{title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {description}
                </p>
                
                {info.value && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{info.value}</span>
                  </div>
                )}
                
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  {language === 'ar' ? 'متاح الآن' : 'Available Now'}
                </Badge>
              </div>
              <Button
                className="w-full h-11 glass-card border-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-[#c01810] hover:border-transparent transition-all duration-300 font-semibold"
                variant="outline"
                onClick={() => {
                  if (info.link) {
                    window.open(info.link, '_blank');
                  }
                }}
              >
                {language === 'ar' ? 'تواصل الآن' : 'Contact Now'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { Wifi, Router, Zap, Shield, CheckCircle, Star, Network, Server, Clock, Lock, Users, Globe, Headphones, TrendingUp, DollarSign, Award } from 'lucide-react';

interface Benefit {
  id?: number;
  title_ar: string;
  description_ar: string;
  title_en: string;
  description_en: string;
  icon: string;
  target_pages?: string[];
  is_active?: boolean;
  order?: number;
}

interface DynamicBenefitsProps {
  currentPage: string;
  language: 'ar' | 'en';
  limit?: number;
}

const iconMap: Record<string, any> = {
  wifi: Wifi,
  router: Router,
  zap: Zap,
  shield: Shield,
  check: CheckCircle,
  star: Star,
  network: Network,
  server: Server,
  clock: Clock,
  lock: Lock,
  users: Users,
  globe: Globe,
  headphones: Headphones,
  'trending-up': TrendingUp,
  'dollar-sign': DollarSign,
  award: Award,
};

const defaultVisuals = [
  { icon: Wifi, color: 'from-blue-500 to-blue-600' },
  { icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { icon: Shield, color: 'from-green-500 to-green-600' },
  { icon: Star, color: 'from-purple-500 to-purple-600' },
];

export function DynamicBenefits({ currentPage, language, limit }: DynamicBenefitsProps) {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/benefits`);
        const allBenefits = response.data;
        
        // Filter benefits based on TWO conditions:
        // 1. Current page must be in target_pages
        // 2. Benefit must be active
        const filteredBenefits = allBenefits.filter((benefit: Benefit) => {
          const isForCurrentPage = benefit.target_pages && benefit.target_pages.includes(currentPage);
          const isActive = benefit.is_active;
          
          return isActive && isForCurrentPage;
        });
        
        // Sort by order
        const sortedBenefits = filteredBenefits.sort((a: Benefit, b: Benefit) => 
          (a.order || 0) - (b.order || 0)
        );
        
        setBenefits(sortedBenefits);
      } catch (error) {
        console.error('Error fetching benefits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, [currentPage, language]); // Add language as dependency

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full" />
              <div className="h-4 w-3/4 mx-auto bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (benefits.length === 0) {
    return null; // Don't render anything if no benefits
  }

  const displayedBenefits = limit ? benefits.slice(0, limit) : benefits;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayedBenefits.map((benefit, index) => {
        const IconComponent = benefit.icon && iconMap[benefit.icon] 
          ? iconMap[benefit.icon] 
          : defaultVisuals[index % defaultVisuals.length].icon;
        
        const visual = defaultVisuals[index % defaultVisuals.length];
        
        const title = language === 'ar' ? benefit.title_ar : benefit.title_en;
        const description = language === 'ar' ? benefit.description_ar : benefit.description_en;

        return (
          <Card
            key={benefit.id ?? index}
            className="group relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105"
          >
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div
                className={`inline-flex p-4 bg-gradient-to-br ${visual.color} rounded-2xl shadow-xl`}
              >
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground font-light">{description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

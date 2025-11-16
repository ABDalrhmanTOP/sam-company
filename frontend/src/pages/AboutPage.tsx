import React from "react";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Users,
  Target,
  Award,
  Heart,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
  Lock,
  Lightbulb,
  Eye,
} from "lucide-react";
import { PageType, Language } from "../components/Navigation";
import { DynamicPremiumServices } from "../components/DynamicPremiumServices";
import axios from "axios";
import { useState, useEffect } from "react";

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
  language: Language;
}

export function AboutPage({
  onNavigate,
  language,
}: AboutPageProps) {
  // الحالة لحفظ بيانات من نحن
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/about-page");
        if (res.data.success) {
          setAboutData(res.data.data);
        }
      } catch (err) {
        setAboutData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="py-32 text-center text-2xl">جاري تحميل البيانات...</div>;
  }
  if (!aboutData) {
    return <div className="py-32 text-center text-red-500 text-2xl">خطأ في تحميل البيانات!</div>;
  }

  // استخدم المتغير عن طريق اللغة
  const t = language === "ar"
    ? {
        aboutUs: "من نحن",
        badge: aboutData.badge_ar,
        title: aboutData.title_ar,
        subtitle: aboutData.subtitle_ar,
        description: aboutData.description_ar,
        ourStoryTitle: aboutData.our_story_title_ar,
        ourStoryP1: aboutData.our_story_p1_ar,
        ourStoryP2: aboutData.our_story_p2_ar,
        statsTitle: aboutData.stats_title_ar,
        valuesTitle: aboutData.values_title_ar,
        missionTitle: aboutData.mission_title_ar,
        missionText: aboutData.mission_text_ar,
        visionTitle: aboutData.vision_title_ar,
        visionText: aboutData.vision_text_ar,
        ctaTitle: aboutData.cta_title_ar,
        ctaDescription: aboutData.cta_description_ar,
        startProject: aboutData.start_project_ar,
        viewServices: aboutData.view_services_ar,
        stats: {
          customers: {
            count: aboutData.customers_count,
            label: aboutData.customers_label_ar,
          },
          coverage: {
            count: aboutData.coverage_count,
            label: aboutData.coverage_label_ar,
          },
          uptime: {
            count: aboutData.uptime_count,
            label: aboutData.uptime_label_ar,
          },
          support: {
            count: aboutData.support_count,
            label: aboutData.support_label_ar,
          },
        },
        values: [
          {
            title: aboutData.value1_title_ar,
            description: aboutData.value1_description_ar,
          },
          {
            title: aboutData.value2_title_ar,
            description: aboutData.value2_description_ar,
          },
          {
            title: aboutData.value3_title_ar,
            description: aboutData.value3_description_ar,
          },
          {
            title: aboutData.value4_title_ar,
            description: aboutData.value4_description_ar,
          },
        ],
      }
    : {
        aboutUs: "About Us",
        badge: aboutData.badge_en,
        title: aboutData.title_en,
        subtitle: aboutData.subtitle_en,
        description: aboutData.description_en,
        ourStoryTitle: aboutData.our_story_title_en,
        ourStoryP1: aboutData.our_story_p1_en,
        ourStoryP2: aboutData.our_story_p2_en,
        statsTitle: aboutData.stats_title_en,
        valuesTitle: aboutData.values_title_en,
        missionTitle: aboutData.mission_title_en,
        missionText: aboutData.mission_text_en,
        visionTitle: aboutData.vision_title_en,
        visionText: aboutData.vision_text_en,
        ctaTitle: aboutData.cta_title_en,
        ctaDescription: aboutData.cta_description_en,
        startProject: aboutData.start_project_en,
        viewServices: aboutData.view_services_en,
        stats: {
          customers: {
            count: aboutData.customers_count,
            label: aboutData.customers_label_en,
          },
          coverage: {
            count: aboutData.coverage_count,
            label: aboutData.coverage_label_en,
          },
          uptime: {
            count: aboutData.uptime_count,
            label: aboutData.uptime_label_en,
          },
          support: {
            count: aboutData.support_count,
            label: aboutData.support_label_en,
          },
        },
        values: [
          {
            title: aboutData.value1_title_en,
            description: aboutData.value1_description_en,
          },
          {
            title: aboutData.value2_title_en,
            description: aboutData.value2_description_en,
          },
          {
            title: aboutData.value3_title_en,
            description: aboutData.value3_description_en,
          },
          {
            title: aboutData.value4_title_en,
            description: aboutData.value4_description_en,
          },
        ],
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-6 py-3 glass-card-strong rounded-full shadow-xl border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                {t.badge}
              </span>
            </div>

            {/* Title */}
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

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {t.statsTitle}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { ...t.stats.customers, icon: Users, color: "from-blue-500 to-cyan-500" },
                { ...t.stats.coverage, icon: Globe2, color: "from-green-500 to-emerald-500" },
                { ...t.stats.uptime, icon: TrendingUp, color: "from-orange-500 to-red-500" },
                { ...t.stats.support, icon: Shield, color: "from-purple-500 to-pink-500" },
              ].map((stat, index) => (
                <Card key={index} className="relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <CardContent className="pt-8 pb-8 text-center space-y-4 relative">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${stat.color} rounded-2xl shadow-xl`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                        {stat.count}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Mission */}
              <Card className="glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 p-8">
                <div className="space-y-6">
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">{t.missionTitle}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {t.missionText}
                  </p>
                </div>
              </Card>

              {/* Vision */}
              <Card className="glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 p-8">
                <div className="space-y-6">
                  <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold">{t.visionTitle}</h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {t.visionText}
                  </p>
                </div>
              </Card>
            </div>

            {/* Story Text */}
            <div className="mt-16 space-y-6 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong border border-primary/20 rounded-full">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {t.ourStoryTitle}
                </span>
              </div>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="text-lg text-muted-foreground/90 leading-relaxed font-light">
                  {t.ourStoryP1}
                </p>
                <p className="text-lg text-muted-foreground/90 leading-relaxed font-light">
                  {t.ourStoryP2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-card-strong border border-primary/20 rounded-full">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {language === "ar" ? "القيم" : "Values"}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
                <span className="bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  {t.valuesTitle}
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[
                { icon: Lightbulb, color: "from-yellow-500 to-orange-500", ...t.values[0] },
                { icon: Lock, color: "from-green-500 to-emerald-500", ...t.values[1] },
                { icon: Award, color: "from-blue-500 to-cyan-500", ...t.values[2] },
                { icon: TrendingUp, color: "from-purple-500 to-pink-500", ...t.values[3] },
              ].map((value, index) => (
                <Card key={index} className="group relative overflow-hidden glass-card-strong border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  
                  <CardContent className="pt-10 pb-8 space-y-5 relative">
                    <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl items-center justify-center shadow-xl`}>
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">{value.title}</h3>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary/5 rounded-full blur-3xl" />
        
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

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-[#c01810]/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#c01810]/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                {t.ctaTitle}
              </h2>
              <p className="text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto font-light">
                {t.ctaDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="group relative h-16 px-12 text-lg font-bold bg-gradient-to-r from-primary via-[#a01810] to-[#c01810] hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-110 rounded-2xl overflow-hidden"
                onClick={() => onNavigate("home-internet")}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <Rocket className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t.startProject}</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group h-16 px-12 text-lg font-bold glass-card-strong border-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105 rounded-2xl"
                onClick={() => onNavigate("home-internet")}
              >
                <Globe2 className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span>{t.viewServices}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

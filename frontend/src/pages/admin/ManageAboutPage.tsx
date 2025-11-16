import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { 
  Save, 
  X, 
  Settings,
  Languages,
  RefreshCw,
  Eye,
  FileText,
  Users,
  Target,
  Award,
  Heart,
  Eye as EyeIcon,
  TrendingUp,
  Globe2,
  Shield,
  Sparkles,
  Rocket,
  Lightbulb,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';

interface AboutPageData {
  id?: number;
  // Hero Section
  badge_ar: string;
  badge_en: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  description_ar: string;
  description_en: string;
  
  // Stats
  stats_title_ar: string;
  stats_title_en: string;
  customers_count: string;
  customers_label_ar: string;
  customers_label_en: string;
  coverage_count: string;
  coverage_label_ar: string;
  coverage_label_en: string;
  uptime_count: string;
  uptime_label_ar: string;
  uptime_label_en: string;
  support_count: string;
  support_label_ar: string;
  support_label_en: string;
  
  // Story Section
  our_story_title_ar: string;
  our_story_title_en: string;
  our_story_p1_ar: string;
  our_story_p1_en: string;
  our_story_p2_ar: string;
  our_story_p2_en: string;
  
  // Mission & Vision
  mission_title_ar: string;
  mission_title_en: string;
  mission_text_ar: string;
  mission_text_en: string;
  vision_title_ar: string;
  vision_title_en: string;
  vision_text_ar: string;
  vision_text_en: string;
  
  // Values
  values_title_ar: string;
  values_title_en: string;
  value1_title_ar: string;
  value1_title_en: string;
  value1_description_ar: string;
  value1_description_en: string;
  value2_title_ar: string;
  value2_title_en: string;
  value2_description_ar: string;
  value2_description_en: string;
  value3_title_ar: string;
  value3_title_en: string;
  value3_description_ar: string;
  value3_description_en: string;
  value4_title_ar: string;
  value4_title_en: string;
  value4_description_ar: string;
  value4_description_en: string;
  
  // CTA Section
  cta_title_ar: string;
  cta_title_en: string;
  cta_description_ar: string;
  cta_description_en: string;
  start_project_ar: string;
  start_project_en: string;
  view_services_ar: string;
  view_services_en: string;
}

export default function ManageAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState<AboutPageData>({
    badge_ar: '',
    badge_en: '',
    title_ar: '',
    title_en: '',
    subtitle_ar: '',
    subtitle_en: '',
    description_ar: '',
    description_en: '',
    stats_title_ar: '',
    stats_title_en: '',
    customers_count: '',
    customers_label_ar: '',
    customers_label_en: '',
    coverage_count: '',
    coverage_label_ar: '',
    coverage_label_en: '',
    uptime_count: '',
    uptime_label_ar: '',
    uptime_label_en: '',
    support_count: '',
    support_label_ar: '',
    support_label_en: '',
    our_story_title_ar: '',
    our_story_title_en: '',
    our_story_p1_ar: '',
    our_story_p1_en: '',
    our_story_p2_ar: '',
    our_story_p2_en: '',
    mission_title_ar: '',
    mission_title_en: '',
    mission_text_ar: '',
    mission_text_en: '',
    vision_title_ar: '',
    vision_title_en: '',
    vision_text_ar: '',
    vision_text_en: '',
    values_title_ar: '',
    values_title_en: '',
    value1_title_ar: '',
    value1_title_en: '',
    value1_description_ar: '',
    value1_description_en: '',
    value2_title_ar: '',
    value2_title_en: '',
    value2_description_ar: '',
    value2_description_en: '',
    value3_title_ar: '',
    value3_title_en: '',
    value3_description_ar: '',
    value3_description_en: '',
    value4_title_ar: '',
    value4_title_en: '',
    value4_description_ar: '',
    value4_description_en: '',
    cta_title_ar: '',
    cta_title_en: '',
    cta_description_ar: '',
    cta_description_en: '',
    start_project_ar: '',
    start_project_en: '',
    view_services_ar: '',
    view_services_en: '',
  });

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/about-page', { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success && response.data.data) {
        setFormData(response.data.data);
      }
    } catch (error: any) {
      console.error('Error loading about page data:', error);
      if (error.response?.status !== 404) {
        toast.error('خطأ في تحميل البيانات');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto translate function
  const autoTranslate = async (text: string, targetLang: 'en') => {
    if (!text.trim()) return;
    
    try {
      setTranslating(true);
      const response = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|${targetLang}`
      );
      
      if (response.data.responseStatus === 200 && response.data.responseData.translatedText) {
        return response.data.responseData.translatedText;
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
    return '';
  };

  const handleTranslate = async (field: keyof AboutPageData, text: string) => {
    if (!text.trim()) return;
    
    const enField = field.replace('_ar', '_en') as keyof AboutPageData;
    const translated = await autoTranslate(text, 'en');
    if (translated) {
      setFormData(prev => ({ ...prev, [enField]: translated }));
    }
  };

  const validateForm = () => {
    setErrors({});
    return true; // لم يعد هناك شروط إلزامية
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء قبل الحفظ');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.post('http://127.0.0.1:8000/api/admin/about-page', formData, { headers: { Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        toast.success('تم حفظ البيانات بنجاح');
        await loadData();
      }
    } catch (error: any) {
      console.error('Error saving about page data:', error);
      toast.error(error.response?.data?.message || 'خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">جاري تحميل البيانات...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          style={{ position: 'relative', zIndex: 10 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                إدارة صفحة من نحن
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                تعديل وإدارة محتوى صفحة من نحن
              </p>
            </div>
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              className="flex items-center gap-2"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <EyeIcon className="w-4 h-4" />
              {previewMode ? 'إخفاء المعاينة' : 'معاينة'}
            </Button>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8" style={{ pointerEvents: 'auto' }}>
          {/* Hero Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                قسم البطل (Hero Section)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" style={{ pointerEvents: 'auto' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="badge_ar">الشارة (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="badge_ar"
                      value={formData.badge_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, badge_ar: e.target.value }));
                        handleTranslate('badge_ar', e.target.value);
                      }}
                      placeholder="قصتنا"
                      style={{ pointerEvents: 'auto' }}
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge_en">الشارة (إنجليزي)</Label>
                  <Input
                    id="badge_en"
                    value={formData.badge_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge_en: e.target.value }))}
                    placeholder="Our Story"
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_ar">العنوان الرئيسي (عربي) *</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="title_ar"
                      value={formData.title_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, title_ar: e.target.value }));
                        handleTranslate('title_ar', e.target.value);
                      }}
                      className={errors.title_ar ? 'border-red-500' : ''}
                      placeholder="رواد الإنترنت في سوريا"
                      style={{ pointerEvents: 'auto' }}
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.title_ar && <p className="text-red-500 text-sm">{errors.title_ar}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_en">العنوان الرئيسي (إنجليزي)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                    placeholder="Internet Pioneers in Syria"
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle_ar">العنوان الفرعي (عربي) *</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="subtitle_ar"
                      value={formData.subtitle_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, subtitle_ar: e.target.value }));
                        handleTranslate('subtitle_ar', e.target.value);
                      }}
                      className={errors.subtitle_ar ? 'border-red-500' : ''}
                      placeholder="رحلة من الشغف والابتكار"
                      style={{ pointerEvents: 'auto' }}
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.subtitle_ar && <p className="text-red-500 text-sm">{errors.subtitle_ar}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle_en">العنوان الفرعي (إنجليزي)</Label>
                  <Input
                    id="subtitle_en"
                    value={formData.subtitle_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle_en: e.target.value }))}
                    placeholder="A Journey of Passion and Innovation"
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description_ar">الوصف (عربي) *</Label>
                  <div className="relative">
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="description_ar"
                      value={formData.description_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, description_ar: e.target.value }));
                        handleTranslate('description_ar', e.target.value);
                      }}
                      className={errors.description_ar ? 'border-red-500' : ''}
                      placeholder="نحن شركة سام للاتصالات..."
                      rows={3}
                      style={{ pointerEvents: 'auto' }}
                    />
                    <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.description_ar && <p className="text-red-500 text-sm">{errors.description_ar}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description_en">الوصف (إنجليزي)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    placeholder="We are SAM Company for Communications..."
                    rows={3}
                    style={{ pointerEvents: 'auto' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                قسم الإحصائيات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" style={{ pointerEvents: 'auto' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="stats_title_ar">عنوان القسم (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="stats_title_ar"
                      value={formData.stats_title_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, stats_title_ar: e.target.value }));
                        handleTranslate('stats_title_ar', e.target.value);
                      }}
                      placeholder="أرقام تتحدث عن إنجازاتنا"
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stats_title_en">عنوان القسم (إنجليزي)</Label>
                  <Input
                    id="stats_title_en"
                    value={formData.stats_title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, stats_title_en: e.target.value }))}
                    placeholder="Numbers That Speak of Our Achievements"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Customers */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    العملاء
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customers_count">العدد</Label>
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="customers_count"
                        value={formData.customers_count}
                        onChange={(e) => setFormData(prev => ({ ...prev, customers_count: e.target.value }))}
                        placeholder="50,000+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customers_label_ar">التسمية (عربي)</Label>
                      <div className="relative">
                        <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                          id="customers_label_ar"
                          value={formData.customers_label_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, customers_label_ar: e.target.value }));
                            handleTranslate('customers_label_ar', e.target.value);
                          }}
                          placeholder="عميل سعيد"
                        />
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customers_label_en">التسمية (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="customers_label_en"
                      value={formData.customers_label_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, customers_label_en: e.target.value }))}
                      placeholder="Happy Customers"
                    />
                  </div>
                </div>

                {/* Coverage */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Globe2 className="w-4 h-4" />
                    التغطية
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverage_count">العدد</Label>
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="coverage_count"
                        value={formData.coverage_count}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverage_count: e.target.value }))}
                        placeholder="100+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverage_label_ar">التسمية (عربي)</Label>
                      <div className="relative">
                        <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                          id="coverage_label_ar"
                          value={formData.coverage_label_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, coverage_label_ar: e.target.value }));
                            handleTranslate('coverage_label_ar', e.target.value);
                          }}
                          placeholder="منطقة تغطية"
                        />
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverage_label_en">التسمية (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="coverage_label_en"
                      value={formData.coverage_label_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverage_label_en: e.target.value }))}
                      placeholder="Coverage Areas"
                    />
                  </div>
                </div>

                {/* Uptime */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    الجاهزية
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="uptime_count">القيمة</Label>
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="uptime_count"
                        value={formData.uptime_count}
                        onChange={(e) => setFormData(prev => ({ ...prev, uptime_count: e.target.value }))}
                        placeholder="99.9%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uptime_label_ar">التسمية (عربي)</Label>
                      <div className="relative">
                        <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                          id="uptime_label_ar"
                          value={formData.uptime_label_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, uptime_label_ar: e.target.value }));
                            handleTranslate('uptime_label_ar', e.target.value);
                          }}
                          placeholder="جاهزية الخدمة"
                        />
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uptime_label_en">التسمية (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="uptime_label_en"
                      value={formData.uptime_label_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, uptime_label_en: e.target.value }))}
                      placeholder="Service Uptime"
                    />
                  </div>
                </div>

                {/* Support */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    الدعم
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="support_count">القيمة</Label>
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="support_count"
                        value={formData.support_count}
                        onChange={(e) => setFormData(prev => ({ ...prev, support_count: e.target.value }))}
                        placeholder="24/7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support_label_ar">التسمية (عربي)</Label>
                      <div className="relative">
                        <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                          id="support_label_ar"
                          value={formData.support_label_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, support_label_ar: e.target.value }));
                            handleTranslate('support_label_ar', e.target.value);
                          }}
                          placeholder="دعم فني"
                        />
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support_label_en">التسمية (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="support_label_en"
                      value={formData.support_label_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_label_en: e.target.value }))}
                      placeholder="Tech Support"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                قسم القصة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" style={{ pointerEvents: 'auto' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="our_story_title_ar">عنوان القسم (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="our_story_title_ar"
                      value={formData.our_story_title_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, our_story_title_ar: e.target.value }));
                        handleTranslate('our_story_title_ar', e.target.value);
                      }}
                      placeholder="قصتنا"
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="our_story_title_en">عنوان القسم (إنجليزي)</Label>
                  <Input
                    id="our_story_title_en"
                    value={formData.our_story_title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, our_story_title_en: e.target.value }))}
                    placeholder="Our Story"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="our_story_p1_ar">الفقرة الأولى (عربي)</Label>
                  <div className="relative">
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="our_story_p1_ar"
                      value={formData.our_story_p1_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, our_story_p1_ar: e.target.value }));
                        handleTranslate('our_story_p1_ar', e.target.value);
                      }}
                      placeholder="تأسست شركة سام للاتصالات..."
                      rows={4}
                    />
                    <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="our_story_p1_en">الفقرة الأولى (إنجليزي)</Label>
                  <Textarea
                    id="our_story_p1_en"
                    value={formData.our_story_p1_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, our_story_p1_en: e.target.value }))}
                    placeholder="SAM Company for Communications was founded..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="our_story_p2_ar">الفقرة الثانية (عربي)</Label>
                  <div className="relative">
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="our_story_p2_ar"
                      value={formData.our_story_p2_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, our_story_p2_ar: e.target.value }));
                        handleTranslate('our_story_p2_ar', e.target.value);
                      }}
                      placeholder="استثمرنا بكثافة في بناء بنية تحتية..."
                      rows={4}
                    />
                    <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="our_story_p2_en">الفقرة الثانية (إنجليزي)</Label>
                  <Textarea
                    id="our_story_p2_en"
                    value={formData.our_story_p2_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, our_story_p2_en: e.target.value }))}
                    placeholder="We have invested heavily in building..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                الرسالة والرؤية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" style={{ pointerEvents: 'auto' }}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Mission */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    الرسالة
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mission_title_ar">العنوان (عربي)</Label>
                      <div className="relative">
                        <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                          id="mission_title_ar"
                          value={formData.mission_title_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, mission_title_ar: e.target.value }));
                            handleTranslate('mission_title_ar', e.target.value);
                          }}
                          placeholder="رسالتنا"
                        />
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission_title_en">العنوان (إنجليزي)</Label>
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="mission_title_en"
                        value={formData.mission_title_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, mission_title_en: e.target.value }))}
                        placeholder="Our Mission"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission_text_ar">النص (عربي)</Label>
                      <div className="relative">
                        <Textarea style={{ pointerEvents: 'auto' }}
                          id="mission_text_ar"
                          value={formData.mission_text_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, mission_text_ar: e.target.value }));
                            handleTranslate('mission_text_ar', e.target.value);
                          }}
                          placeholder="نسعى في شركة سام..."
                          rows={4}
                        />
                        <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mission_text_en">النص (إنجليزي)</Label>
                      <Textarea style={{ pointerEvents: 'auto' }}
                        id="mission_text_en"
                        value={formData.mission_text_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, mission_text_en: e.target.value }))}
                        placeholder="At SAM Company, we strive..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Vision */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <EyeIcon className="w-4 h-4 text-purple-500" />
                    الرؤية
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vision_title_ar">العنوان (عربي)</Label>
                      <div className="relative">
                        <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                          id="vision_title_ar"
                          value={formData.vision_title_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, vision_title_ar: e.target.value }));
                            handleTranslate('vision_title_ar', e.target.value);
                          }}
                          placeholder="رؤيتنا"
                        />
                        <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision_title_en">العنوان (إنجليزي)</Label>
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="vision_title_en"
                        value={formData.vision_title_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, vision_title_en: e.target.value }))}
                        placeholder="Our Vision"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision_text_ar">النص (عربي)</Label>
                      <div className="relative">
                        <Textarea style={{ pointerEvents: 'auto' }}
                          id="vision_text_ar"
                          value={formData.vision_text_ar}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, vision_text_ar: e.target.value }));
                            handleTranslate('vision_text_ar', e.target.value);
                          }}
                          placeholder="أن نكون الخيار الأول..."
                          rows={4}
                        />
                        <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vision_text_en">النص (إنجليزي)</Label>
                      <Textarea style={{ pointerEvents: 'auto' }}
                        id="vision_text_en"
                        value={formData.vision_text_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, vision_text_en: e.target.value }))}
                        placeholder="To be the first choice..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                قسم القيم
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" style={{ pointerEvents: 'auto' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="values_title_ar">عنوان القسم (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="values_title_ar"
                      value={formData.values_title_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, values_title_ar: e.target.value }));
                        handleTranslate('values_title_ar', e.target.value);
                      }}
                      placeholder="قيمنا التي نؤمن بها"
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="values_title_en">عنوان القسم (إنجليزي)</Label>
                  <Input
                    id="values_title_en"
                    value={formData.values_title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, values_title_en: e.target.value }))}
                    placeholder="Our Core Values"
                  />
                </div>
              </div>

              {/* Value 1 */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  القيمة الأولى
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value1_title_ar">العنوان (عربي)</Label>
                    <div className="relative">
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="value1_title_ar"
                        value={formData.value1_title_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value1_title_ar: e.target.value }));
                          handleTranslate('value1_title_ar', e.target.value);
                        }}
                        placeholder="الابتكار التقني"
                      />
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value1_title_en">العنوان (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="value1_title_en"
                      value={formData.value1_title_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value1_title_en: e.target.value }))}
                      placeholder="Technical Innovation"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value1_description_ar">الوصف (عربي)</Label>
                    <div className="relative">
                      <Textarea style={{ pointerEvents: 'auto' }}
                        id="value1_description_ar"
                        value={formData.value1_description_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value1_description_ar: e.target.value }));
                          handleTranslate('value1_description_ar', e.target.value);
                        }}
                        placeholder="نستثمر في أحدث التقنيات..."
                        rows={2}
                      />
                      <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value1_description_en">الوصف (إنجليزي)</Label>
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="value1_description_en"
                      value={formData.value1_description_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value1_description_en: e.target.value }))}
                      placeholder="We invest in the latest technologies..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Value 2 */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  القيمة الثانية
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value2_title_ar">العنوان (عربي)</Label>
                    <div className="relative">
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="value2_title_ar"
                        value={formData.value2_title_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value2_title_ar: e.target.value }));
                          handleTranslate('value2_title_ar', e.target.value);
                        }}
                        placeholder="الشفافية والثقة"
                      />
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value2_title_en">العنوان (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="value2_title_en"
                      value={formData.value2_title_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value2_title_en: e.target.value }))}
                      placeholder="Transparency & Trust"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value2_description_ar">الوصف (عربي)</Label>
                    <div className="relative">
                      <Textarea style={{ pointerEvents: 'auto' }}
                        id="value2_description_ar"
                        value={formData.value2_description_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value2_description_ar: e.target.value }));
                          handleTranslate('value2_description_ar', e.target.value);
                        }}
                        placeholder="نبني علاقاتنا على أساس الشفافية..."
                        rows={2}
                      />
                      <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value2_description_en">الوصف (إنجليزي)</Label>
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="value2_description_en"
                      value={formData.value2_description_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value2_description_en: e.target.value }))}
                      placeholder="We build relationships based on transparency..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Value 3 */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  القيمة الثالثة
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value3_title_ar">العنوان (عربي)</Label>
                    <div className="relative">
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="value3_title_ar"
                        value={formData.value3_title_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value3_title_ar: e.target.value }));
                          handleTranslate('value3_title_ar', e.target.value);
                        }}
                        placeholder="التميز في الخدمة"
                      />
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value3_title_en">العنوان (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="value3_title_en"
                      value={formData.value3_title_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value3_title_en: e.target.value }))}
                      placeholder="Service Excellence"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value3_description_ar">الوصف (عربي)</Label>
                    <div className="relative">
                      <Textarea style={{ pointerEvents: 'auto' }}
                        id="value3_description_ar"
                        value={formData.value3_description_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value3_description_ar: e.target.value }));
                          handleTranslate('value3_description_ar', e.target.value);
                        }}
                        placeholder="نلتزم بتقديم أعلى مستويات الجودة..."
                        rows={2}
                      />
                      <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value3_description_en">الوصف (إنجليزي)</Label>
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="value3_description_en"
                      value={formData.value3_description_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value3_description_en: e.target.value }))}
                      placeholder="We are committed to delivering the highest levels..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Value 4 */}
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  القيمة الرابعة
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value4_title_ar">العنوان (عربي)</Label>
                    <div className="relative">
                      <Input style={{ pointerEvents: 'auto' }} style={{ pointerEvents: 'auto' }}
                        id="value4_title_ar"
                        value={formData.value4_title_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value4_title_ar: e.target.value }));
                          handleTranslate('value4_title_ar', e.target.value);
                        }}
                        placeholder="التطوير المستمر"
                      />
                      <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value4_title_en">العنوان (إنجليزي)</Label>
                    <Input style={{ pointerEvents: 'auto' }}
                      id="value4_title_en"
                      value={formData.value4_title_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value4_title_en: e.target.value }))}
                      placeholder="Continuous Development"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value4_description_ar">الوصف (عربي)</Label>
                    <div className="relative">
                      <Textarea style={{ pointerEvents: 'auto' }}
                        id="value4_description_ar"
                        value={formData.value4_description_ar}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, value4_description_ar: e.target.value }));
                          handleTranslate('value4_description_ar', e.target.value);
                        }}
                        placeholder="نطور بنيتنا التحتية..."
                        rows={2}
                      />
                      <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="value4_description_en">الوصف (إنجليزي)</Label>
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="value4_description_en"
                      value={formData.value4_description_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, value4_description_en: e.target.value }))}
                      placeholder="We develop our infrastructure..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5" />
                قسم الدعوة للإجراء (CTA)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6" style={{ pointerEvents: 'auto' }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cta_title_ar">العنوان (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="cta_title_ar"
                      value={formData.cta_title_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, cta_title_ar: e.target.value }));
                        handleTranslate('cta_title_ar', e.target.value);
                      }}
                      placeholder="جاهز لتجربة إنترنت أسرع؟"
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cta_title_en">العنوان (إنجليزي)</Label>
                  <Input
                    id="cta_title_en"
                    value={formData.cta_title_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_title_en: e.target.value }))}
                    placeholder="Ready for Faster Internet?"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cta_description_ar">الوصف (عربي)</Label>
                  <div className="relative">
                    <Textarea style={{ pointerEvents: 'auto' }}
                      id="cta_description_ar"
                      value={formData.cta_description_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, cta_description_ar: e.target.value }));
                        handleTranslate('cta_description_ar', e.target.value);
                      }}
                      placeholder="انضم إلى آلاف العملاء السعداء..."
                      rows={2}
                    />
                    <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cta_description_en">الوصف (إنجليزي)</Label>
                  <Textarea
                    id="cta_description_en"
                    value={formData.cta_description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, cta_description_en: e.target.value }))}
                    placeholder="Join thousands of happy customers..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_project_ar">نص زر الاشتراك (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="start_project_ar"
                      value={formData.start_project_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, start_project_ar: e.target.value }));
                        handleTranslate('start_project_ar', e.target.value);
                      }}
                      placeholder="اشترك الآن"
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_project_en">نص زر الاشتراك (إنجليزي)</Label>
                  <Input
                    id="start_project_en"
                    value={formData.start_project_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_project_en: e.target.value }))}
                    placeholder="Subscribe Now"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view_services_ar">نص زر عرض الخدمات (عربي)</Label>
                  <div className="relative">
                    <Input style={{ pointerEvents: 'auto' }}
                      id="view_services_ar"
                      value={formData.view_services_ar}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, view_services_ar: e.target.value }));
                        handleTranslate('view_services_ar', e.target.value);
                      }}
                      placeholder="اطلع على باقاتنا"
                    />
                    <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view_services_en">نص زر عرض الخدمات (إنجليزي)</Label>
                  <Input
                    id="view_services_en"
                    value={formData.view_services_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, view_services_en: e.target.value }))}
                    placeholder="View Our Packages"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4" style={{ pointerEvents: 'auto' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => loadData()}
              className="px-8 py-3"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              إعادة تحميل
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ pointerEvents: 'auto', cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}



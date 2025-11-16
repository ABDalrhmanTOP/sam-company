import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Plus, Trash2, Wifi, Router, Zap, Shield, CheckCircle, Star, Home, Building2, Gauge, Headphones, Users, Phone, X, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { toast } from 'sonner';
import BenefitForm from './BenefitForm';

interface Benefit {
  id?: number;
  title: string;
  description: string;
  icon: string;
  language: string;
  target_pages?: string[];
  is_active?: boolean;
  order?: number;
}

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  icon: '',
  language: 'ar',
  target_pages: [],
  is_active: true,
  order: 0,
};

const availablePages = [
  { value: 'home', label: 'الرئيسية', icon: Home },
  { value: 'home-internet', label: 'إنترنت منزلي', icon: Wifi },
  { value: 'business-internet', label: 'إنترنت للشركات', icon: Building2 },
  { value: 'speed-test', label: 'اختبار السرعة', icon: Gauge },
  { value: 'support', label: 'الدعم الفني', icon: Headphones },
  { value: 'about', label: 'من نحن', icon: Users },
  { value: 'contact', label: 'تواصل معنا', icon: Phone },
];

export function ManageBenefitsPage() {
  // States
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [filterPage, setFilterPage] = useState<string>('all');

  const iconMap: Record<string, any> = {
    wifi: Wifi,
    router: Router,
    zap: Zap,
    shield: Shield,
    check: CheckCircle,
    star: Star,
  };
  const availableIcons = Object.keys(iconMap);

  const fetchBenefits = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/benefits`, { headers: { Authorization: `Bearer ${token}` } });
      setBenefits(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
      toast.error('فشل تحميل المزايا');
    } finally {
      setLoading(false);
    }
  };

  // Filter benefits based on selected page
  const filteredBenefits = filterPage === 'all' 
    ? benefits 
    : benefits.filter(benefit => 
        benefit.target_pages?.includes(filterPage)
      );

  // Get statistics
  const stats = {
    total: benefits.length,
    active: benefits.filter(b => b.is_active).length,
    filtered: filteredBenefits.length,
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  const handleAddBenefit = () => {
    setEditingBenefit(null);
    setShowForm(true);
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setEditingBenefit(benefit);
    setShowForm(true);
  };

  const handleBenefitSuccess = () => {
    setShowForm(false);
    setEditingBenefit(null);
    fetchBenefits();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBenefit(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الميزة؟')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/benefits/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('تم حذف الميزة بنجاح');
      await fetchBenefits();
    } catch (err: any) {
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  if (loading && benefits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/admin'}
                className="hover:bg-primary/10 transition-colors"
                title="العودة للوحة التحكم"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-2 rounded-lg bg-primary/10">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">لوحة إدارة المزايا</h1>
                <p className="text-sm text-muted-foreground">إدارة وعرض المزايا الخاصة بالموقع</p>
              </div>
            </div>
            <Button onClick={handleAddBenefit} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              إضافة ميزة جديدة
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي المزايا</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المزايا النشطة</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المعروضة</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.filtered}</p>
                </div>
                <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
                  <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-background to-muted/30 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">تصفية حسب الصفحة:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterPage === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPage('all')}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  الكل
                </Button>
                {availablePages.map(page => {
                  const PageIcon = page.icon;
                  const count = benefits.filter(b => b.target_pages?.includes(page.value)).length;
                  return (
                    <Button
                      key={page.value}
                      variant={filterPage === page.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterPage(page.value)}
                      className="gap-2"
                    >
                      <PageIcon className="h-4 w-4" />
                      {page.label}
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-primary/20">{count}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">لا توجد مزايا</h3>
                  <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة ميزة جديدة</p>
                  <Button onClick={handleAddBenefit}>
                    إضافة ميزة
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : filteredBenefits.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-dashed border-orange-200">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">لا توجد مزايا للصفحة المختارة</h3>
                  <p className="text-sm text-muted-foreground mb-4">جرب اختيار صفحة أخرى أو أضف ميزة جديدة</p>
                  <Button variant="outline" onClick={() => setFilterPage('all')}>
                    عرض الكل
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredBenefits.map((benefit) => {
              const IconComponent = benefit.icon && iconMap[benefit.icon] ? iconMap[benefit.icon] : Star;
              return (
                <Card key={benefit.id} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{benefit.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${benefit.language === 'ar' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {benefit.language === 'ar' ? 'عربي' : 'English'}
                            </span>
                            {benefit.is_active && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">نشط</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBenefit(benefit)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => benefit.id && handleDelete(benefit.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{benefit.description}</CardDescription>
                    {benefit.target_pages && benefit.target_pages.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {benefit.target_pages.map(page => {
                          const pageInfo = availablePages.find(p => p.value === page);
                          if (!pageInfo) return null;
                          const PageIcon = pageInfo.icon;
                          return (
                            <span key={page} className="text-xs px-2 py-1 rounded-md bg-muted flex items-center gap-1">
                              <PageIcon className="w-3 h-3" />
                              {pageInfo.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Benefit Form Modal */}
      {showForm && (
        <BenefitForm
          editingBenefit={editingBenefit}
          onSuccess={handleBenefitSuccess}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  MoreVertical,
  Shield,
  Zap,
  Crown,
  Award,
  Sparkles,
  Settings,
  CheckCircle,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import './BenefitForm.css';

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

export function ManagePremiumServicesPage() {
  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [services, setServices] = useState<PremiumService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState<PremiumService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<string | null>(null);
  const [editingFeatureAr, setEditingFeatureAr] = useState<number | null>(null);
  const [editingFeatureEn, setEditingFeatureEn] = useState<number | null>(null);
  const [newFeatureAr, setNewFeatureAr] = useState('');
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [translatingFeature, setTranslatingFeature] = useState(false);
  const [formData, setFormData] = useState<Partial<PremiumService>>({
    name: '',
    name_en: '',
    description: '',
    description_en: '',
    price: 0,
    features: [],
    features_ar: [],
    features_en: [],
    isActive: true,
    category: '',
    icon: 'Star',
    color: 'primary'
  });

  // Load services from API
  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/premium-services', { headers: { Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        setServices(response.data.data.data || []);
      } else {
        toast.error('فشل في تحميل الخدمات');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('حدث خطأ في تحميل الخدمات');
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);



  const categories = ['إنترنت', 'أمان', 'دعم', 'تخزين', 'أخرى'];
  const colors = [
    { name: 'أساسي', value: 'primary' },
    { name: 'أحمر فاتح', value: 'c01810' },
    { name: 'أحمر داكن', value: 'a01810' },
    { name: 'أزرق', value: 'blue' },
    { name: 'أخضر', value: 'green' }
  ];
  const icons = ['Star', 'Shield', 'Zap', 'Crown', 'Award', 'Sparkles'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && service.isActive) ||
                         (filterStatus === 'inactive' && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });


  const handleEditService = (id: number) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setEditingService(service);
      setFormData(service);
      setIsAdding(true);
    }
  };

  // Update formData when editingService changes
  useEffect(() => {
    if (editingService) {
      setFormData({
        ...editingService,
        features_ar: editingService.features_ar || editingService.features || [],
        features_en: editingService.features_en || [],
      });
    } else {
      setFormData({
        name: '',
        name_en: '',
        description: '',
        description_en: '',
        price: 0,
        features: [],
        features_ar: [],
        features_en: [],
        isActive: true,
        category: '',
        icon: 'Star',
        color: 'primary'
      });
    }
    setNewFeatureAr('');
    setNewFeatureEn('');
    setEditingFeatureAr(null);
    setEditingFeatureEn(null);
    setErrors({});
  }, [editingService]);

  // Auto-translate feature function
  const translateFeature = useCallback(async (text: string): Promise<string> => {
    if (!text.trim()) return '';
    
    // Check if text is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(text);
    if (!isArabic) return text;

    try {
      const response = await axios.post(
        'https://api.mymemory.translated.net/get',
        null,
        {
          params: {
            q: text.trim(),
            langpair: 'ar|en'
          }
        }
      );

      if (response.data && response.data.responseData) {
        return response.data.responseData.translatedText;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    
    return '';
  }, []);

  // Features management functions
  const addFeatureAr = async () => {
    if (!newFeatureAr.trim()) {
      toast.error('يرجى إدخال ميزة');
      return;
    }
    
    const featureAr = newFeatureAr.trim();
    
    // Add Arabic feature immediately
    setFormData(prev => ({
      ...prev,
      features_ar: [...(prev.features_ar || []), featureAr]
    }));
    
    // Auto-translate and add to English features
    setTranslatingFeature(true);
    const translatedEn = await translateFeature(featureAr);
    setTranslatingFeature(false);
    
    if (translatedEn) {
      setFormData(prev => ({
        ...prev,
        features_en: [...(prev.features_en || []), translatedEn]
      }));
      toast.success('تمت إضافة الميزة وترجمتها تلقائياً');
    } else {
      toast.info('تمت إضافة الميزة بالعربية');
    }
    
    setNewFeatureAr('');
  };

  const addFeatureEn = () => {
    if (!newFeatureEn.trim()) {
      toast.error('Please enter a feature');
      return;
    }
    setFormData(prev => ({
      ...prev,
      features_en: [...(prev.features_en || []), newFeatureEn.trim()]
    }));
    setNewFeatureEn('');
  };

  const updateFeatureAr = async (index: number, value: string) => {
    if (!value.trim()) {
      toast.error('يرجى إدخال ميزة');
      return;
    }
    const featureAr = value.trim();
    const updatedAr = [...(formData.features_ar || [])];
    updatedAr[index] = featureAr;
    
    // Update Arabic feature
    setFormData(prev => ({ ...prev, features_ar: updatedAr }));
    
    // Auto-translate and update corresponding English feature
    const translatedEn = await translateFeature(featureAr);
    if (translatedEn) {
      const updatedEn = [...(formData.features_en || [])];
      // Update the same index in English features
      if (updatedEn[index] !== undefined) {
        updatedEn[index] = translatedEn;
        setFormData(prev => ({ ...prev, features_en: updatedEn }));
      }
    }
    
    setEditingFeatureAr(null);
  };

  const updateFeatureEn = (index: number, value: string) => {
    if (!value.trim()) {
      toast.error('Please enter a feature');
      return;
    }
    const updated = [...(formData.features_en || [])];
    updated[index] = value.trim();
    setFormData(prev => ({ ...prev, features_en: updated }));
    setEditingFeatureEn(null);
  };

  const deleteFeatureAr = (index: number) => {
    const updatedAr = (formData.features_ar || []).filter((_, i) => i !== index);
    const updatedEn = (formData.features_en || []).filter((_, i) => i !== index);
    setFormData(prev => ({ 
      ...prev, 
      features_ar: updatedAr,
      features_en: updatedEn
    }));
  };

  const deleteFeatureEn = (index: number) => {
    const updated = (formData.features_en || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features_en: updated }));
  };

  // Auto-translate function
  const autoTranslate = useCallback(async (text: string, targetField: string) => {
    if (!text.trim() || text.length < 3) return;

    // Simple Arabic detection
    const isArabic = /[\u0600-\u06FF]/.test(text);
    if (!isArabic) return;

    setTranslating(targetField);

    try {
      // Using a free translation service
      const response = await axios.post(
        'https://api.mymemory.translated.net/get',
        null,
        {
          params: {
            q: text,
            langpair: 'ar|en'
          }
        }
      );

      if (response.data && response.data.responseData) {
        const translatedText = response.data.responseData.translatedText;
        setFormData(prev => ({ ...prev, [targetField]: translatedText }));
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Don't show error to user, translation is optional
    } finally {
      setTranslating(null);
    }
  }, []);

  const handleFormSuccess = () => {
    setIsAdding(false);
    setEditingService(null);
    setFormData({
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      price: 0,
      features: [],
      features_ar: [],
      features_en: [],
      isActive: true,
      category: '',
      icon: 'Star',
      color: 'primary'
    });
    setNewFeatureAr('');
    setNewFeatureEn('');
    setEditingFeatureAr(null);
    setEditingFeatureEn(null);
    setErrors({});
    // Refresh services
    loadServices();
  };

  const handleFormCancel = () => {
    setIsAdding(false);
    setEditingService(null);
    setFormData({
      name: '',
      name_en: '',
      description: '',
      description_en: '',
      price: 0,
      features: [],
      features_ar: [],
      features_en: [],
      isActive: true,
      category: '',
      icon: 'Star',
      color: 'primary'
    });
    setNewFeatureAr('');
    setNewFeatureEn('');
    setEditingFeatureAr(null);
    setEditingFeatureEn(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'اسم الخدمة بالعربي مطلوب';
    }

    if (!formData.name_en?.trim()) {
      newErrors.name_en = 'اسم الخدمة بالإنجليزي مطلوب';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'وصف الخدمة بالعربي مطلوب';
    }

    if (!formData.description_en?.trim()) {
      newErrors.description_en = 'وصف الخدمة بالإنجليزي مطلوب';
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'فئة الخدمة مطلوبة';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      let response;
      
      if (editingService) {
        // Update existing service
        response = await axios.put(
          `http://127.0.0.1:8000/api/admin/premium-services/${editingService.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new service
        response = await axios.post(
          'http://127.0.0.1:8000/api/admin/premium-services',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data.success) {
        toast.success(editingService ? 'تم تحديث الخدمة بنجاح' : 'تم إضافة الخدمة بنجاح');
        handleFormSuccess();
      } else {
        toast.error(response.data.message || 'حدث خطأ أثناء حفظ الخدمة');
      }
    } catch (error: any) {
      console.error('Error saving service:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        toast.error('يرجى تصحيح الأخطاء في النموذج');
      } else {
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء حفظ الخدمة');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteService = async (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.delete(`http://127.0.0.1:8000/api/admin/premium-services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        
        if (response.data.success) {
          toast.success('تم حذف الخدمة بنجاح');
          loadServices();
        } else {
          toast.error(response.data.message || 'فشل في حذف الخدمة');
        }
      } catch (error: any) {
        console.error('Error deleting service:', error);
        toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الخدمة');
      }
    }
  };

  const toggleServiceStatus = async (id: number) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    // If trying to activate a service, check if we already have 3 active services
    if (!service.isActive) {
      const activeCount = services.filter(s => s.isActive).length;
      if (activeCount >= 3) {
        toast.error('لا يمكن تفعيل أكثر من 3 خدمات في نفس الوقت');
        return;
      }
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`http://127.0.0.1:8000/api/admin/premium-services/${id}/toggle-status`, { headers: { Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        toast.success(response.data.message || 'تم تحديث حالة الخدمة');
        loadServices();
      } else {
        toast.error(response.data.message || 'فشل في تحديث حالة الخدمة');
      }
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الخدمة');
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Star, Shield, Zap, Crown, Award, Sparkles
    };
    const IconComponent = iconMap[iconName] || Star;
    return <IconComponent className="h-5 w-5" />;
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      primary: 'from-primary to-[#c01810] bg-primary/10 border-primary/20 text-primary',
      c01810: 'from-[#c01810] to-[#a01810] bg-[#c01810]/10 border-[#c01810]/20 text-[#c01810]',
      a01810: 'from-[#a01810] to-primary bg-[#a01810]/10 border-[#a01810]/20 text-[#a01810]',
      blue: 'from-blue-500 to-blue-600 bg-blue-50 border-blue-200 text-blue-700',
      green: 'from-green-500 to-green-600 bg-green-50 border-green-200 text-green-700'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative z-0 ${isAdding ? 'pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-0 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-[#c01810] shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-[#c01810] bg-clip-text text-transparent">
                  إدارة الخدمات المتميزة
                </h1>
                <p className="text-sm text-muted-foreground mt-1">إدارة وعرض جميع الخدمات المتميزة المتاحة</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingService(null);
                setIsAdding(true);
              }}
              className="px-8 py-3 bg-gradient-to-r from-primary to-[#c01810] text-white rounded-xl hover:from-[#c01810] hover:to-[#a01810] transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              إضافة خدمة جديدة
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الخدمات</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{services.length}</p>
              </div>
              <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">الخدمات النشطة</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">متوسط السعر</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length).toLocaleString()} ل.س
                </p>
              </div>
              <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Filter Bar */}
        <div className="bg-gradient-to-r from-background to-muted/30 shadow-sm rounded-xl border border-primary/20 p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">البحث:</span>
            </div>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-foreground">تصفية الخدمات:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === 'all' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border border-input text-foreground hover:bg-muted'
                }`}
              >
                الكل
              </button>
              {categories.map(category => {
                const count = services.filter(s => s.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filterCategory === category 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border border-input text-foreground hover:bg-muted'
                    }`}
                  >
                    {category}
                    <span className="px-1.5 py-0.5 rounded-full text-xs bg-primary/20">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">الحالة:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background border border-input text-foreground hover:bg-muted'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-background border border-input text-foreground hover:bg-muted'
                }`}
              >
                نشط
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'inactive' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-background border border-input text-foreground hover:bg-muted'
                }`}
              >
                غير نشط
              </button>
            </div>
          </div>
        </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingServices ? (
          <div className="col-span-full">
            <div className="bg-card rounded-xl border border-dashed">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold mb-2">جاري تحميل الخدمات...</h3>
                <p className="text-sm text-muted-foreground">يرجى الانتظار</p>
              </div>
            </div>
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-card rounded-xl border border-dashed">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد خدمات</h3>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة خدمة جديدة</p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-[#c01810] text-white rounded-lg hover:from-[#c01810] hover:to-[#a01810] transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة خدمة
                </button>
              </div>
            </div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-card rounded-xl border border-dashed border-orange-200">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد خدمات للتصفية المختارة</h3>
                <p className="text-sm text-muted-foreground mb-4">جرب اختيار تصفية أخرى أو أضف خدمة جديدة</p>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setFilterStatus('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  عرض الكل
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${getColorClasses(service.color).split(' ')[0]} ${getColorClasses(service.color).split(' ')[1]}`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getColorClasses(service.color).split(' ')[0]} ${getColorClasses(service.color).split(' ')[1]}`}>
                      {getIconComponent(service.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleServiceStatus(service.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        service.isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {service.isActive ? 'نشط' : 'غير نشط'}
                    </button>
                    
                    <div className="relative">
                      <button className="p-1 hover:bg-muted rounded">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                
                <div className="mb-4">
                  <p className="text-2xl font-bold text-foreground mb-2">
                    {service.price.toLocaleString()} ل.س
                  </p>
                  <div className="space-y-1">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleEditService(service.id)}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-lg hover:from-primary/20 hover:to-primary/10 border border-primary/20 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md group"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ 
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                      className="group-hover:scale-110 transition-transform"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.div>
                    <span className="group-hover:font-semibold transition-all">تعديل</span>
                  </motion.button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Internal Form Modal */}
      {isAdding && (
        <AnimatePresence>
          <div className="benefit-form-overlay" style={{ pointerEvents: 'auto' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overlay-background"
              onClick={handleFormCancel}
              style={{ pointerEvents: 'auto' }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="benefit-form-container"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              {/* Header */}
              <div className="benefit-form-header">
                <div className="benefit-form-header-content">
                  <div className="benefit-form-icon-wrapper">
                    {editingService ? <CheckCircle className="icon" /> : <Plus className="icon" />}
                  </div>
                  <div>
                    <h2 className="benefit-form-title">
                      {editingService?.id ? 'تعديل الخدمة المتميزة' : 'إضافة خدمة متميزة جديدة'}
                    </h2>
                    <p className="benefit-form-subtitle">
                      {editingService?.id ? 'قم بتعديل معلومات الخدمة' : 'أضف خدمة متميزة جديدة للموقع'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFormCancel}
                  className="benefit-form-close-btn"
                >
                  <X className="icon" />
                </button>
              </div>

              {/* Form Content */}
              <div className="benefit-form-content">
                <div className="benefit-form-body">
                  <form id="premium-service-form" onSubmit={handleFormSubmit} className="h-full flex flex-col">
                    <div className="benefit-form-fields flex-1">
                {/* Basic Info Section */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3 pb-3 border-b border-primary/20">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">المعلومات الأساسية</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        اسم الخدمة (عربي) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          value={formData.name || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({...formData, name: value});
                            if (e.target.value.length > 2) {
                              autoTranslate(value, 'name_en');
                            }
                            if (errors.name) {
                              setErrors({...errors, name: ''});
                            }
                          }}
                          className={errors.name ? 'border-red-500' : ''}
                          placeholder="أدخل اسم الخدمة بالعربية"
                        />
                        {translating === 'name_en' && (
                          <Languages className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
                        )}
                      </div>
                      {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="name_en" className="text-sm font-medium">
                        اسم الخدمة (إنجليزي) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name_en"
                        name="name_en"
                        value={formData.name_en || ''}
                        onChange={(e) => {
                          setFormData({...formData, name_en: e.target.value});
                          if (errors.name_en) {
                            setErrors({...errors, name_en: ''});
                          }
                        }}
                        className={errors.name_en ? 'border-red-500' : ''}
                        placeholder="Service name in English"
                      />
                      {errors.name_en && <p className="text-sm text-red-500 mt-1">{errors.name_en}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        الفئة <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                          errors.category ? 'border-red-500' : 'border-input'
                        }`}
                      >
                        <option value="">اختر الفئة</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        وصف الخدمة (عربي) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({...formData, description: value});
                            if (e.target.value.length > 2) {
                              autoTranslate(value, 'description_en');
                            }
                            if (errors.description) {
                              setErrors({...errors, description: ''});
                            }
                          }}
                          className={errors.description ? 'border-red-500' : ''}
                          rows={4}
                          placeholder="أدخل وصف الخدمة بالعربية"
                        />
                        {translating === 'description_en' && (
                          <Languages className="absolute right-3 top-3 h-4 w-4 text-primary animate-pulse" />
                        )}
                      </div>
                      {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="description_en" className="text-sm font-medium">
                        وصف الخدمة (إنجليزي) <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description_en"
                        name="description_en"
                        value={formData.description_en || ''}
                        onChange={(e) => {
                          setFormData({...formData, description_en: e.target.value});
                          if (errors.description_en) {
                            setErrors({...errors, description_en: ''});
                          }
                        }}
                        className={errors.description_en ? 'border-red-500' : ''}
                        rows={4}
                        placeholder="Service description in English"
                      />
                      {errors.description_en && <p className="text-sm text-red-500 mt-1">{errors.description_en}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      السعر (ل.س) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      className={errors.price ? 'border-red-500' : ''}
                      placeholder="0"
                      min="0"
                    />
                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                  </div>
                </div>

                {/* Visual Settings Section */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-[#c01810]/5 to-transparent rounded-2xl border border-[#c01810]/10">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#c01810]/20">
                    <div className="p-2 rounded-lg bg-[#c01810]/10">
                      <Zap className="h-5 w-5 text-[#c01810]" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">الإعدادات البصرية</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="icon" className="text-sm font-medium">
                        الأيقونة <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="icon"
                        value={formData.icon || ''}
                        onChange={(e) => setFormData({...formData, icon: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {icons.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="color" className="text-sm font-medium">
                        اللون <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="color"
                        value={formData.color || ''}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {colors.map(color => (
                          <option key={color.value} value={color.value}>{color.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-green-500/5 to-transparent rounded-2xl border border-green-500/10">
                  <div className="flex items-center gap-3 pb-3 border-b border-green-500/20">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">الميزات (عربي)</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(formData.features_ar || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          {editingFeatureAr === index ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const updated = [...(formData.features_ar || [])];
                                  updated[index] = e.target.value;
                                  setFormData(prev => ({ ...prev, features_ar: updated }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    updateFeatureAr(index, feature);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingFeatureAr(null);
                                  }
                                }}
                                onBlur={() => updateFeatureAr(index, feature)}
                                autoFocus
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => updateFeatureAr(index, feature)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 text-sm">{feature}</div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingFeatureAr(index)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteFeatureAr(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={newFeatureAr}
                          onChange={(e) => setNewFeatureAr(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeatureAr();
                            }
                          }}
                          placeholder="أدخل ميزة جديدة بالعربية (سيتم ترجمتها تلقائياً)"
                          className="flex-1"
                          disabled={translatingFeature}
                        />
                        {translatingFeature && (
                          <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <Languages className="h-4 w-4 text-primary animate-pulse" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={addFeatureAr}
                        variant="outline"
                        disabled={translatingFeature}
                      >
                        {translatingFeature ? (
                          <>
                            <Languages className="h-4 w-4 mr-2 animate-pulse" />
                            جاري الترجمة...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            إضافة
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* English Features Section */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl border border-blue-500/10">
                  <div className="flex items-center gap-3 pb-3 border-b border-blue-500/20">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">الميزات (English)</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {(formData.features_en || []).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          {editingFeatureEn === index ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const updated = [...(formData.features_en || [])];
                                  updated[index] = e.target.value;
                                  setFormData(prev => ({ ...prev, features_en: updated }));
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    updateFeatureEn(index, feature);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingFeatureEn(null);
                                  }
                                }}
                                onBlur={() => updateFeatureEn(index, feature)}
                                autoFocus
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => updateFeatureEn(index, feature)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 text-sm">{feature}</div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingFeatureEn(index)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteFeatureEn(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newFeatureEn}
                        onChange={(e) => setNewFeatureEn(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFeatureEn();
                          }
                        }}
                        placeholder="Enter new feature in English"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addFeatureEn}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-6 p-6 bg-gradient-to-r from-[#a01810]/5 to-transparent rounded-2xl border border-[#a01810]/10">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#a01810]/20">
                    <div className="p-2 rounded-lg bg-[#a01810]/10">
                      <Settings className="h-5 w-5 text-[#a01810]" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">الحالة</h3>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary/20"
                    />
                    <Label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
                      خدمة نشطة
                    </Label>
                  </div>
                </div>

                    </div>
                  </form>
                </div>
              </div>

              {/* Footer */}
              <div className="benefit-form-footer">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  disabled={loading}
                  className="cancel-btn"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = document.getElementById('premium-service-form') as HTMLFormElement;
                    if (form) {
                      form.requestSubmit();
                    }
                  }}
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? (
                    <span className="spinner"></span>
                  ) : (
                    <Save className="icon" style={{ width: '16px', height: '16px', marginRight: '8px', display: 'inline-block' }} />
                  )}
                  {editingService ? 'حفظ التعديلات' : 'حفظ الخدمة'}
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

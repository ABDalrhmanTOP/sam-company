import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Home, Wifi, Building2, Gauge, Headphones, Users, Phone, CheckCircle, Plus, Shield, Zap, Rocket, Award, Globe, Lock, Clock, TrendingUp, DollarSign, Network, Server, Database, Cloud, Smartphone, Monitor, Tablet, Languages } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

interface Benefit {
  id?: number;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  title?: string;
  description?: string;
  icon: string;
  language?: string;
  target_pages?: string[];
  is_active?: boolean;
  order?: number;
}

interface BenefitFormProps {
  editingBenefit: Benefit | null;
  onSuccess: () => void;
  onClose: () => void;
}

const availablePages = [
  { value: 'home', label: 'الرئيسية', icon: Home },
  { value: 'home-internet', label: 'إنترنت منزلي', icon: Wifi },
  { value: 'business-internet', label: 'إنترنت للشركات', icon: Building2 },
  { value: 'speed-test', label: 'اختبار السرعة', icon: Gauge },
  { value: 'support', label: 'الدعم الفني', icon: Headphones },
  { value: 'about', label: 'من نحن', icon: Users },
  { value: 'contact', label: 'تواصل معنا', icon: Phone },
];

const iconOptions = [
  { value: 'wifi', label: 'WiFi', icon: Wifi },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'check', label: 'Check', icon: CheckCircle },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'rocket', label: 'Rocket', icon: Rocket },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'globe', label: 'Globe', icon: Globe },
  { value: 'lock', label: 'Lock', icon: Lock },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'trending-up', label: 'Trending', icon: TrendingUp },
  { value: 'dollar-sign', label: 'Dollar', icon: DollarSign },
  { value: 'network', label: 'Network', icon: Network },
  { value: 'server', label: 'Server', icon: Server },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'smartphone', label: 'Smartphone', icon: Smartphone },
  { value: 'monitor', label: 'Monitor', icon: Monitor },
  { value: 'tablet', label: 'Tablet', icon: Tablet },
];

const INITIAL_FORM_DATA = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  icon: '',
  target_pages: [],
  is_active: true,
  order: 0,
};

export default function BenefitForm({ editingBenefit, onSuccess, onClose }: BenefitFormProps) {
  const [formData, setFormData] = useState<Benefit>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<string | null>(null);

  useEffect(() => {
    if (editingBenefit) {
      setFormData(editingBenefit);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [editingBenefit]);

  // Auto-translate function
  const autoTranslate = useCallback(async (text: string, targetField: string) => {
    if (!text.trim() || text.length < 3) return;

    // Simple Arabic detection
    const isArabic = /[\u0600-\u06FF]/.test(text);
    if (!isArabic) return;

    setTranslating(targetField);

    try {
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
    } finally {
      setTranslating(null);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-translate for Arabic fields
    if (name === 'title_ar' && value.length > 2) {
      autoTranslate(value, 'title_en');
    } else if (name === 'description_ar' && value.length > 2) {
      autoTranslate(value, 'description_en');
    }
  };

  const handleCheckboxChange = (pageValue: string) => {
    setFormData(prev => {
      const currentPages = prev.target_pages || [];
      const newPages = currentPages.includes(pageValue)
        ? currentPages.filter(p => p !== pageValue)
        : [...currentPages, pageValue];
      return { ...prev, target_pages: newPages };
    });
  };

  const handleIconSelect = (iconValue: string) => {
    setFormData(prev => ({ ...prev, icon: iconValue }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title_ar?.trim()) {
      newErrors.title_ar = 'العنوان بالعربية مطلوب';
    }

    if (!formData.title_en?.trim()) {
      newErrors.title_en = 'العنوان بالإنجليزية مطلوب';
    }

    if (!formData.icon) {
      newErrors.icon = 'الأيقونة مطلوبة';
    }

    if (!formData.description_ar?.trim()) {
      newErrors.description_ar = 'الوصف بالعربية مطلوب';
    }

    if (!formData.description_en?.trim()) {
      newErrors.description_en = 'الوصف بالإنجليزية مطلوب';
    }

    if (formData.target_pages && formData.target_pages.length === 0) {
      newErrors.target_pages = 'يجب اختيار صفحة واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (editingBenefit?.id) {
        await axios.put(`http://127.0.0.1:8000/api/admin/benefits/${editingBenefit.id}`, formData,{ 
          headers: { Authorization: `Bearer ${token}` } });
        toast.success('تم تحديث الميزة بنجاح');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/benefits', formData,
         { headers: { Authorization: `Bearer ${token}` }}
         
        );
        toast.success('تم إضافة الميزة بنجاح');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'حدث خطأ أثناء الحفظ');
      console.error('Error saving benefit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="benefit-form-overlay">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overlay-background"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="benefit-form-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="benefit-form-header">
            <div className="benefit-form-header-content">
              <div className="benefit-form-icon-wrapper">
                {editingBenefit ? <CheckCircle className="icon" /> : <Plus className="icon" />}
              </div>
              <div>
                <h2 className="benefit-form-title">
                  {editingBenefit ? 'تعديل الميزة' : 'إضافة ميزة جديدة'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingBenefit ? 'قم بتعديل معلومات الميزة' : 'أضف ميزة جديدة للموقع'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="benefit-form-close-btn"
              onClick={onClose}
              aria-label="إغلاق"
            >
              <X className="icon" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="benefit-form-content">
            <div className="benefit-form-fields">
              {/* Basic Info Section */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <Star className="icon" />
                  </div>
                  <h3 className="section-title">المعلومات الأساسية</h3>
                </div>

                <div className="form-group">
                  <Label htmlFor="title_ar" className="form-label">
                    العنوان بالعربية <span className="required">*</span>
                  </Label>
                  <Input
                    id="title_ar"
                    name="title_ar"
                    value={formData.title_ar || ''}
                    onChange={handleInputChange}
                    placeholder="أدخل العنوان بالعربية"
                    className={errors.title_ar ? 'error' : ''}
                  />
                  {errors.title_ar && <span className="error-message">{errors.title_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="title_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      العنوان بالإنجليزية <span className="required">*</span>
                      {translating === 'title_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Input
                    id="title_en"
                    name="title_en"
                    value={formData.title_en || ''}
                    onChange={handleInputChange}
                    placeholder="Enter title in English (auto-translated)"
                    className={errors.title_en ? 'error' : ''}
                  />
                  {errors.title_en && <span className="error-message">{errors.title_en}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="description_ar" className="form-label">
                    الوصف بالعربية <span className="required">*</span>
                  </Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={formData.description_ar || ''}
                    onChange={handleInputChange}
                    placeholder="أدخل الوصف بالعربية"
                    rows={3}
                    className={errors.description_ar ? 'error' : ''}
                  />
                  {errors.description_ar && <span className="error-message">{errors.description_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="description_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      الوصف بالإنجليزية <span className="required">*</span>
                      {translating === 'description_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    value={formData.description_en || ''}
                    onChange={handleInputChange}
                    placeholder="Enter description in English (auto-translated)"
                    rows={3}
                    className={errors.description_en ? 'error' : ''}
                  />
                  {errors.description_en && <span className="error-message">{errors.description_en}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="order" className="form-label">
                    الترتيب
                  </Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <Label className="form-label">
                    الأيقونة <span className="required">*</span>
                  </Label>
                  <div className="icon-grid">
                    {iconOptions.map((iconOption) => {
                      const IconComponent = iconOption.icon;
                      const isSelected = formData.icon === iconOption.value;
                      return (
                        <button
                          key={iconOption.value}
                          type="button"
                          className={`icon-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleIconSelect(iconOption.value)}
                        >
                          <IconComponent className="icon" />
                        </button>
                      );
                    })}
                  </div>
                  {errors.icon && <span className="error-message">{errors.icon}</span>}
                </div>
              </div>

              {/* Settings Section */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <Gauge className="icon" />
                  </div>
                  <h3 className="section-title">الإعدادات</h3>
                </div>

                <div className="form-group">
                  <Label htmlFor="is_active" className="form-label">الحالة</Label>
                  <select
                    id="is_active"
                    name="is_active"
                    value={formData.is_active ? '1' : '0'}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === '1' }))}
                    className="form-select"
                  >
                    <option value="1">نشط</option>
                    <option value="0">غير نشط</option>
                  </select>
                </div>
              </div>

              {/* Target Pages Section */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <Home className="icon" />
                  </div>
                  <h3 className="section-title">الصفحات المستهدفة</h3>
                </div>

                <div className="pages-grid">
                  {availablePages.map(page => {
                    const PageIcon = page.icon;
                    const isSelected = formData.target_pages?.includes(page.value);
                    return (
                      <label
                        key={page.value}
                        className={`page-option ${isSelected ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(page.value)}
                          className="checkbox-input"
                        />
                        <PageIcon className="icon" />
                        <span className="page-label">{page.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.target_pages && (
                  <span className="error-message">{errors.target_pages}</span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="benefit-form-footer">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="cancel-btn"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    {editingBenefit ? 'تحديث الميزة' : 'إضافة الميزة'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

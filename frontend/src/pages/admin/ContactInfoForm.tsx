import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Plus, CheckCircle, Languages } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

interface ContactInfo {
  id?: number;
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

interface ContactInfoFormProps {
  editingInfo: ContactInfo | null;
  onSuccess: () => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA = {
  type: '',
  label_ar: '',
  label_en: '',
  value: '',
  icon: '',
  link: '',
  is_active: true,
  order: 0,
  description_ar: '',
  description_en: '',
};

export default function ContactInfoForm({ editingInfo, onSuccess, onClose }: ContactInfoFormProps) {
  const [formData, setFormData] = useState<ContactInfo>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<string | null>(null);

  useEffect(() => {
    if (editingInfo) {
      setFormData(editingInfo);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [editingInfo]);

  // Auto-translate function
  const autoTranslate = useCallback(async (text: string, targetField: string) => {
    if (!text.trim() || text.length < 3) return;

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-translate for Arabic fields
    if (name === 'label_ar' && value.length > 2) {
      autoTranslate(value, 'label_en');
    } else if (name === 'description_ar' && value.length > 2) {
      autoTranslate(value, 'description_en');
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.type?.trim()) {
      newErrors.type = 'النوع مطلوب';
    }

    if (!formData.label_ar?.trim()) {
      newErrors.label_ar = 'التسمية بالعربي مطلوبة';
    }

    if (!formData.label_en?.trim()) {
      newErrors.label_en = 'التسمية بالإنجليزي مطلوبة';
    }

    if (!formData.value?.trim()) {
      newErrors.value = 'القيمة مطلوبة';
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
      const url = editingInfo
        ? `http://127.0.0.1:8000/api/admin/contact-info/${editingInfo.id}`
        : 'http://127.0.0.1:8000/api/admin/contact-info';

      const method = editingInfo ? 'put' : 'post';

      await axios[method](url, formData,{ headers: { Authorization: `Bearer ${token}` } });

      toast.success(editingInfo ? 'تم تحديث المعلومات بنجاح' : 'تم إضافة المعلومات بنجاح');
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.errors 
        || error?.message 
        || 'حدث خطأ';
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
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
                {editingInfo ? <CheckCircle className="icon" /> : <Plus className="icon" />}
              </div>
              <div>
                <h2 className="benefit-form-title">
                  {editingInfo?.id ? 'تعديل معلومات اتصال' : 'إضافة معلومات اتصال جديدة'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingInfo?.id ? 'قم بتحديث المعلومات' : 'أضف معلومات اتصال جديدة لصفحة تواصل معنا'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="benefit-form-close-btn"
            >
              <X className="icon" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="benefit-form-body">
            {/* Basic Info Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <Phone className="icon" />
                </div>
                <h3 className="section-title">معلومات الاتصال</h3>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <Label htmlFor="type" className="form-label">
                    النوع <span className="required">*</span>
                  </Label>
                  <Select value={formData.type} onValueChange={handleSelectChange}>
                    <SelectTrigger className={errors.type ? 'input-error' : ''}>
                      <SelectValue placeholder="اختر نوع المعلومات" />
                    </SelectTrigger>
                    <SelectContent position="popper" style={{ zIndex: 9999 }} sideOffset={4}>
                      <SelectItem value="phone">هاتف</SelectItem>
                      <SelectItem value="email">بريد إلكتروني</SelectItem>
                      <SelectItem value="address">عنوان</SelectItem>
                      <SelectItem value="whatsapp">واتساب</SelectItem>
                      <SelectItem value="hours">ساعات العمل</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <span className="error-message">{errors.type}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="label_ar" className="form-label">
                    التسمية بالعربي <span className="required">*</span>
                  </Label>
                  <Input
                    id="label_ar"
                    name="label_ar"
                    value={formData.label_ar}
                    onChange={handleInputChange}
                    placeholder="مثال: الهاتف"
                    className={errors.label_ar ? 'input-error' : ''}
                    dir="rtl"
                  />
                  {errors.label_ar && <span className="error-message">{errors.label_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="label_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      التسمية بالإنجليزي <span className="required">*</span>
                      {translating === 'label_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Input
                    id="label_en"
                    name="label_en"
                    value={formData.label_en}
                    onChange={handleInputChange}
                    placeholder="Example: Phone (auto-translated)"
                    className={errors.label_en ? 'input-error' : ''}
                  />
                  {errors.label_en && <span className="error-message">{errors.label_en}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="value" className="form-label">
                    القيمة <span className="required">*</span>
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="مثال: +963 11 123 4567"
                    className={errors.value ? 'input-error' : ''}
                  />
                  {errors.value && <span className="error-message">{errors.value}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="icon" className="form-label">
                    اسم الأيقونة
                  </Label>
                  <Input
                    id="icon"
                    name="icon"
                    value={formData.icon || ''}
                    onChange={handleInputChange}
                    placeholder="مثال: Phone, Mail, MapPin"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="link" className="form-label">
                    الرابط
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    value={formData.link || ''}
                    onChange={handleInputChange}
                    placeholder="مثال: tel:+963111234567 أو mailto:info@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <Phone className="icon" />
                </div>
                <h3 className="section-title">الوصف الإضافي</h3>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <Label htmlFor="description_ar" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      الوصف بالعربي
                      {translating === 'description_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={formData.description_ar || ''}
                    onChange={handleInputChange}
                    placeholder="مثال: اتصل بنا على مدار الساعة"
                    rows={3}
                    dir="rtl"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="description_en" className="form-label">
                    الوصف بالإنجليزي
                  </Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    value={formData.description_en || ''}
                    onChange={handleInputChange}
                    placeholder="Example: Call us 24/7 (auto-translated)"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <Phone className="icon" />
                </div>
                <h3 className="section-title">الإعدادات</h3>
              </div>

              <div className="section-content">
                <div className="form-grid grid-2">
                  <div className="form-group">
                    <Label htmlFor="order" className="form-label">
                      الترتيب
                    </Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      value={formData.order || 0}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="mr-2"
                      />
                      نشط
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="benefit-form-footer">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="cancel-btn"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'جاري الحفظ...' : editingInfo?.id ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

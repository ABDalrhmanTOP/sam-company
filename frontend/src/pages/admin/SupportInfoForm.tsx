import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones, Phone, MessageCircle, Globe, Plus, CheckCircle, Languages } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

interface SupportInfo {
  id?: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon?: string;
  type: 'channel' | 'method' | 'info';
  value?: string;
  link?: string;
  is_active?: boolean;
  order?: number;
}

interface SupportInfoFormProps {
  editingInfo: SupportInfo | null;
  onSuccess: () => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  icon: '',
  type: 'info' as const,
  value: '',
  link: '',
  is_active: true,
  order: 0,
};

export default function SupportInfoForm({ editingInfo, onSuccess, onClose }: SupportInfoFormProps) {
  const [formData, setFormData] = useState<SupportInfo>(INITIAL_FORM_DATA);
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
    if (name === 'title_ar' && value.length > 2) {
      autoTranslate(value, 'title_en');
    } else if (name === 'description_ar' && value.length > 2) {
      autoTranslate(value, 'description_en');
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as 'channel' | 'method' | 'info' }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title_ar.trim()) {
      newErrors.title_ar = 'العنوان بالعربي مطلوب';
    }

    if (!formData.title_en.trim()) {
      newErrors.title_en = 'العنوان بالإنجليزي مطلوب';
    }

    if (!formData.description_ar.trim()) {
      newErrors.description_ar = 'الوصف بالعربي مطلوب';
    }

    if (!formData.description_en.trim()) {
      newErrors.description_en = 'الوصف بالإنجليزي مطلوب';
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
        ? `http://127.0.0.1:8000/api/admin/support-info/${editingInfo.id}`
        : 'http://127.0.0.1:8000/api/admin/support-info';

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
                  {editingInfo?.id ? 'تعديل معلومات الدعم الفني' : 'إضافة معلومات دعم فني جديدة'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingInfo?.id ? 'قم بتحديث معلومات الدعم الفني' : 'أضف معلومات جديدة للدعم الفني'}
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
                  <Headphones className="icon" />
                </div>
                <h3 className="section-title">المعلومات الأساسية</h3>
              </div>

              <div className="section-content">
                <div className="form-grid">
                  <div className="form-group">
                    <Label htmlFor="title_ar" className="form-label">
                      العنوان بالعربي <span className="required">*</span>
                    </Label>
                    <Input
                      id="title_ar"
                      name="title_ar"
                      value={formData.title_ar}
                      onChange={handleInputChange}
                      placeholder="مثال: اتصل بنا"
                      className={errors.title_ar ? 'input-error' : ''}
                      dir="rtl"
                    />
                    {errors.title_ar && <span className="error-message">{errors.title_ar}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="title_en" className="form-label">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        العنوان بالإنجليزي <span className="required">*</span>
                        {translating === 'title_en' && (
                          <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        )}
                      </div>
                    </Label>
                    <Input
                      id="title_en"
                      name="title_en"
                      value={formData.title_en}
                      onChange={handleInputChange}
                      placeholder="Example: Contact Us (auto-translated)"
                      className={errors.title_en ? 'input-error' : ''}
                    />
                    {errors.title_en && <span className="error-message">{errors.title_en}</span>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <Label htmlFor="type" className="form-label">
                      نوع المعلومات <span className="required">*</span>
                    </Label>
                    <Select value={formData.type} onValueChange={(value: string) => handleSelectChange('type', value)}>
                      <SelectTrigger className={errors.type ? 'input-error' : ''}>
                        <SelectValue placeholder="اختر نوع المعلومات" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={4} className="z-[9999] min-w-[var(--radix-select-trigger-width)]">
                        <SelectItem value="channel">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            قناة اتصال
                          </div>
                        </SelectItem>
                        <SelectItem value="method">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            طريقة دعم
                          </div>
                        </SelectItem>
                        <SelectItem value="info">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            معلومات
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <span className="error-message">{errors.type}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="icon" className="form-label">
                      الأيقونة
                    </Label>
                    <Input
                      id="icon"
                      name="icon"
                      value={formData.icon || ''}
                      onChange={handleInputChange}
                      placeholder="مثال: phone, mail, message-circle"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="description_ar" className="form-label">
                    الوصف بالعربي <span className="required">*</span>
                  </Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleInputChange}
                    placeholder="مثال: تواصل معنا عبر الهاتف"
                    rows={3}
                    className={errors.description_ar ? 'input-error' : ''}
                    dir="rtl"
                  />
                  {errors.description_ar && <span className="error-message">{errors.description_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="description_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      الوصف بالإنجليزي <span className="required">*</span>
                      {translating === 'description_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    placeholder="Example: Contact us via phone (auto-translated)"
                    rows={3}
                    className={errors.description_en ? 'input-error' : ''}
                  />
                  {errors.description_en && <span className="error-message">{errors.description_en}</span>}
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <Globe className="icon" />
                </div>
                <h3 className="section-title">معلومات إضافية</h3>
              </div>

              <div className="section-content">
                <div className="form-grid grid-2">
                  <div className="form-group">
                    <Label htmlFor="value" className="form-label">
                      القيمة (اختياري)
                    </Label>
                    <Input
                      id="value"
                      name="value"
                      value={formData.value || ''}
                      onChange={handleInputChange}
                      placeholder="مثال: +963123456789"
                    />
                  </div>

                  <div className="form-group">
                    <Label htmlFor="link" className="form-label">
                      الرابط (اختياري)
                    </Label>
                    <Input
                      id="link"
                      name="link"
                      type="url"
                      value={formData.link || ''}
                      onChange={handleInputChange}
                      placeholder="مثال: https://example.com"
                    />
                  </div>
                </div>

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
                    <Label htmlFor="is_active" className="form-label">
                      الحالة
                    </Label>
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

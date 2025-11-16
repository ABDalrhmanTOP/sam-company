import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Home, Building2, Plus, CheckCircle, Languages, Trash2, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

interface PackageData {
  id?: number;
  name?: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  price: string | number;
  speed: string;
  speed_unit?: string;
  features?: string[];
  features_ar?: string[];
  features_en?: string[];
  type: 'home' | 'business';
  is_active?: boolean;
  order?: number;
  popular?: boolean;
}

interface PackageFormProps {
  editingPackage: PackageData | null;
  onSuccess: () => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA: PackageData = {
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  price: '',
  speed: '',
  speed_unit: '',
  features: [],
  features_ar: [],
  features_en: [],
  type: 'home',
  is_active: true,
  order: 0,
  popular: false,
};

export default function PackageForm({ editingPackage, onSuccess, onClose }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageData>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<string | null>(null);
  const [editingFeatureAr, setEditingFeatureAr] = useState<number | null>(null);
  const [editingFeatureEn, setEditingFeatureEn] = useState<number | null>(null);
  const [newFeatureAr, setNewFeatureAr] = useState('');
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [translatingFeature, setTranslatingFeature] = useState(false);

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        ...editingPackage,
        features_ar: editingPackage.features_ar || editingPackage.features || [],
        features_en: editingPackage.features_en || [],
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    setNewFeatureAr('');
    setNewFeatureEn('');
    setEditingFeatureAr(null);
    setEditingFeatureEn(null);
  }, [editingPackage]);

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
    const updated = (formData.features_ar || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features_ar: updated }));
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
      // Using a free translation service (you can replace with your preferred service)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-translate for Arabic fields
    if (name === 'name_ar' && value.length > 2) {
      autoTranslate(value, 'name_en');
    } else if (name === 'description_ar' && value.length > 2) {
      autoTranslate(value, 'description_en');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_ar?.trim()) {
      newErrors.name_ar = 'اسم الباقة بالعربية مطلوب';
    }

    if (!formData.name_en?.trim()) {
      newErrors.name_en = 'اسم الباقة بالإنجليزية مطلوب';
    }

    if (!formData.description_ar?.trim()) {
      newErrors.description_ar = 'وصف الباقة بالعربية مطلوب';
    }

    if (!formData.description_en?.trim()) {
      newErrors.description_en = 'وصف الباقة بالإنجليزية مطلوب';
    }

    const priceNum = typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price;
    if (!formData.price || priceNum <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    }

    if (!formData.speed?.trim()) {
      newErrors.speed = 'السرعة مطلوبة';
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
      if (editingPackage?.id) {
        await axios.put(`http://127.0.0.1:8000/api/admin/packages/${editingPackage.id}`, formData,{ headers: { Authorization: `Bearer ${token}` } });
        toast.success('تم تحديث الباقة بنجاح');
      } else {
        await axios.post(`http://127.0.0.1:8000/api/admin/packages`, formData,{ headers: { Authorization: `Bearer ${token}` } });
        toast.success('تم إنشاء الباقة بنجاح');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.errors 
        || error?.message 
        || 'حدث خطأ';
      toast.error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
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
                {editingPackage ? <CheckCircle className="icon" /> : <Plus className="icon" />}
              </div>
              <div>
                <h2 className="benefit-form-title">
                  {editingPackage?.id ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingPackage?.id ? 'قم بتعديل معلومات الباقة' : 'أضف باقة جديدة للموقع'}
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
                  <Package className="icon" />
                </div>
                <h3 className="section-title">المعلومات الأساسية</h3>
              </div>

              <div className="section-content">
                <div className="form-grid">
                  <div className="form-group">
                    <Label htmlFor="name_ar" className="form-label">
                      اسم الباقة (عربي) <span className="required">*</span>
                    </Label>
                    <Input
                      id="name_ar"
                      name="name_ar"
                      value={formData.name_ar || ''}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم الباقة بالعربية"
                      className={errors.name_ar ? 'input-error' : ''}
                    />
                    {errors.name_ar && <span className="error-message">{errors.name_ar}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="name_en" className="form-label">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        اسم الباقة (English) <span className="required">*</span>
                        {translating === 'name_en' && (
                          <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                        )}
                      </div>
                    </Label>
                    <Input
                      id="name_en"
                      name="name_en"
                      value={formData.name_en || ''}
                      onChange={handleInputChange}
                      placeholder="Enter package name in English (auto-translated)"
                      className={errors.name_en ? 'input-error' : ''}
                    />
                    {errors.name_en && <span className="error-message">{errors.name_en}</span>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <Label htmlFor="type" className="form-label">
                      النوع <span className="required">*</span>
                    </Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="home">منزلي</option>
                      <option value="business">تجاري</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <Label htmlFor="description_ar" className="form-label">
                    الوصف (عربي) <span className="required">*</span>
                  </Label>
                  <Textarea
                    id="description_ar"
                    name="description_ar"
                    value={formData.description_ar || ''}
                    onChange={handleInputChange}
                    placeholder="أدخل وصف الباقة بالعربية"
                    rows={3}
                    className={errors.description_ar ? 'input-error' : ''}
                  />
                  {errors.description_ar && <span className="error-message">{errors.description_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="description_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      الوصف (English) <span className="required">*</span>
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
                    placeholder="Enter package description in English (auto-translated)"
                    rows={3}
                    className={errors.description_en ? 'input-error' : ''}
                  />
                  {errors.description_en && <span className="error-message">{errors.description_en}</span>}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <Package className="icon" />
                </div>
                <h3 className="section-title">التفاصيل</h3>
              </div>

              <div className="section-content">
                <div className="form-grid grid-2">
                  <div className="form-group">
                    <Label htmlFor="speed" className="form-label">
                      السرعة (القيمة) <span className="required">*</span>
                    </Label>
                    <Input
                      id="speed"
                      name="speed"
                      type="text"
                      value={formData.speed}
                      onChange={handleInputChange}
                      placeholder="مثال: 100 أو 1"
                      className={errors.speed ? 'input-error' : ''}
                    />
                    {errors.speed && <span className="error-message">{errors.speed}</span>}
                  </div>

                  <div className="form-group">
                    <Label htmlFor="speed_unit" className="form-label">
                      وحدة السرعة
                    </Label>
                    <select
                      id="speed_unit"
                      name="speed_unit"
                      value={formData.speed_unit}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">اختر الوحدة</option>
                      <option value="ميجا">ميجا (Mbps)</option>
                      <option value="جيجابت">جيجابت (Gbps)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid grid-3">
                  <div className="form-group">
                    <Label htmlFor="price" className="form-label">
                      السعر <span className="required">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="مثال: 350000"
                      className={errors.price ? 'input-error' : ''}
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
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
                    <Label htmlFor="popular" className="form-label">
                      حالة شائعة
                    </Label>
                    <select
                      id="popular"
                      name="popular"
                      value={formData.popular ? '1' : '0'}
                      onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.value === '1' }))}
                      className="form-select"
                    >
                      <option value="0">غير شائع</option>
                      <option value="1">شائع</option>
                    </select>
                  </div>
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

            {/* Features Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <CheckCircle className="icon" />
                </div>
                <h3 className="section-title">ميزات الباقة</h3>
              </div>

              <div className="section-content">
                {/* Arabic Features */}
                <div className="form-group">
                  <Label className="form-label">
                    الميزات (عربي)
                  </Label>
                  <div className="space-y-2 mb-4">
                    {(formData.features_ar || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        {editingFeatureAr === index ? (
                          <>
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const updated = [...(formData.features_ar || [])];
                                updated[index] = e.target.value;
                                setFormData(prev => ({ ...prev, features_ar: updated }));
                              }}
                              onBlur={() => updateFeatureAr(index, feature)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateFeatureAr(index, feature);
                                }
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => updateFeatureAr(index, feature)}
                              variant="outline"
                            >
                              حفظ
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm">{feature}</span>
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

                {/* English Features */}
                <div className="form-group">
                  <Label className="form-label">
                    الميزات (English)
                  </Label>
                  <div className="space-y-2 mb-4">
                    {(formData.features_en || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        {editingFeatureEn === index ? (
                          <>
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const updated = [...(formData.features_en || [])];
                                updated[index] = e.target.value;
                                setFormData(prev => ({ ...prev, features_en: updated }));
                              }}
                              onBlur={() => updateFeatureEn(index, feature)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateFeatureEn(index, feature);
                                }
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => updateFeatureEn(index, feature)}
                              variant="outline"
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm">{feature}</span>
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
              {loading ? 'جاري الحفظ...' : editingPackage?.id ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

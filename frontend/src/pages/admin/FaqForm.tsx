import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Plus, CheckCircle, Languages } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

interface Faq {
  id?: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  category?: string;
  is_active?: boolean;
  order?: number;
}

interface FaqFormProps {
  editingFaq: Faq | null;
  onSuccess: () => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA = {
  question_ar: '',
  question_en: '',
  answer_ar: '',
  answer_en: '',
  category: '',
  is_active: true,
  order: 0,
};

export default function FaqForm({ editingFaq, onSuccess, onClose }: FaqFormProps) {
  const [formData, setFormData] = useState<Faq>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<string | null>(null);

  useEffect(() => {
    if (editingFaq) {
      setFormData(editingFaq);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [editingFaq]);

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
    if (name === 'question_ar' && value.length > 2) {
      autoTranslate(value, 'question_en');
    } else if (name === 'answer_ar' && value.length > 2) {
      autoTranslate(value, 'answer_en');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.question_ar.trim()) {
      newErrors.question_ar = 'السؤال بالعربي مطلوب';
    }

    if (!formData.question_en.trim()) {
      newErrors.question_en = 'السؤال بالإنجليزي مطلوب';
    }

    if (!formData.answer_ar.trim()) {
      newErrors.answer_ar = 'الإجابة بالعربي مطلوبة';
    }

    if (!formData.answer_en.trim()) {
      newErrors.answer_en = 'الإجابة بالإنجليزي مطلوبة';
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
      const url = editingFaq
        ? `http://127.0.0.1:8000/api/admin/faqs/${editingFaq.id}`
        : 'http://127.0.0.1:8000/api/admin/faqs';

      const method = editingFaq ? 'put' : 'post';

      await axios[method](url, formData,{ headers: { Authorization: `Bearer ${token}` } });

      toast.success(editingFaq ? 'تم تحديث السؤال بنجاح' : 'تم إضافة السؤال بنجاح');
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
                {editingFaq ? <CheckCircle className="icon" /> : <Plus className="icon" />}
              </div>
              <div>
                <h2 className="benefit-form-title">
                  {editingFaq?.id ? 'تعديل سؤال' : 'إضافة سؤال جديد'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingFaq?.id ? 'قم بتحديث السؤال' : 'أضف سؤالاً جديداً للأسئلة الشائعة'}
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
            {/* Question Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <HelpCircle className="icon" />
                </div>
                <h3 className="section-title">معلومات السؤال</h3>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <Label htmlFor="question_ar" className="form-label">
                    السؤال بالعربي <span className="required">*</span>
                  </Label>
                  <Input
                    id="question_ar"
                    name="question_ar"
                    value={formData.question_ar}
                    onChange={handleInputChange}
                    placeholder="مثال: كيف أقوم بتركيب خدمة الإنترنت؟"
                    className={errors.question_ar ? 'input-error' : ''}
                    dir="rtl"
                  />
                  {errors.question_ar && <span className="error-message">{errors.question_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="question_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      السؤال بالإنجليزي <span className="required">*</span>
                      {translating === 'question_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Input
                    id="question_en"
                    name="question_en"
                    value={formData.question_en}
                    onChange={handleInputChange}
                    placeholder="Example: How do I install internet service? (auto-translated)"
                    className={errors.question_en ? 'input-error' : ''}
                  />
                  {errors.question_en && <span className="error-message">{errors.question_en}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="answer_ar" className="form-label">
                    الإجابة بالعربي <span className="required">*</span>
                  </Label>
                  <Textarea
                    id="answer_ar"
                    name="answer_ar"
                    value={formData.answer_ar}
                    onChange={handleInputChange}
                    placeholder="مثال: بعد الاشتراك، سيتواصل معك فريقنا خلال 24 ساعة..."
                    rows={4}
                    className={errors.answer_ar ? 'input-error' : ''}
                    dir="rtl"
                  />
                  {errors.answer_ar && <span className="error-message">{errors.answer_ar}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="answer_en" className="form-label">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      الإجابة بالإنجليزي <span className="required">*</span>
                      {translating === 'answer_en' && (
                        <Languages className="icon" style={{ width: '16px', height: '16px', color: '#8a0d02', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      )}
                    </div>
                  </Label>
                  <Textarea
                    id="answer_en"
                    name="answer_en"
                    value={formData.answer_en}
                    onChange={handleInputChange}
                    placeholder="Example: After subscribing, our team will contact you within 24 hours... (auto-translated)"
                    rows={4}
                    className={errors.answer_en ? 'input-error' : ''}
                  />
                  {errors.answer_en && <span className="error-message">{errors.answer_en}</span>}
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <HelpCircle className="icon" />
                </div>
                <h3 className="section-title">معلومات إضافية</h3>
              </div>

              <div className="section-content">
                <div className="form-grid grid-2">
                  <div className="form-group">
                    <Label htmlFor="category" className="form-label">
                      الفئة
                    </Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      placeholder="مثال: Installation, Technical Support"
                    />
                  </div>

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
              {loading ? 'جاري الحفظ...' : editingFaq?.id ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

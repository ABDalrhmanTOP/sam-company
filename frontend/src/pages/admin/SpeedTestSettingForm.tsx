import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gauge, Plus, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

interface SpeedTestSetting {
  id?: number;
  api_name: string;
  api_url: string;
  api_key?: string;
  is_default?: boolean;
  is_active?: boolean;
  order?: number;
  description?: string;
}

interface SpeedTestSettingFormProps {
  editingSetting: SpeedTestSetting | null;
  onSuccess: () => void;
  onClose: () => void;
}

const INITIAL_FORM_DATA = {
  api_name: '',
  api_url: '',
  api_key: '',
  is_default: false,
  is_active: true,
  order: 0,
  description: '',
};

export default function SpeedTestSettingForm({ editingSetting, onSuccess, onClose }: SpeedTestSettingFormProps) {
  const [formData, setFormData] = useState<SpeedTestSetting>(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSetting) {
      setFormData(editingSetting);
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [editingSetting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.api_name?.trim()) {
      newErrors.api_name = 'اسم API مطلوب';
    }

    if (!formData.api_url?.trim()) {
      newErrors.api_url = 'عنوان URL مطلوب';
    } else if (!formData.api_url.startsWith('http://') && !formData.api_url.startsWith('https://')) {
      newErrors.api_url = 'يجب أن يبدأ URL بـ http:// أو https://';
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
      const url = editingSetting
        ? `http://127.0.0.1:8000/api/admin/speed-test-settings/${editingSetting.id}`
        : 'http://127.0.0.1:8000/api/admin/speed-test-settings';

      const method = editingSetting ? 'put' : 'post';

      await axios[method](url, formData,{ headers: { Authorization: `Bearer ${token}` } });

      toast.success(editingSetting ? 'تم تحديث API بنجاح' : 'تم إضافة API بنجاح');
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
                {editingSetting ? <CheckCircle className="icon" /> : <Plus className="icon" />}
              </div>
              <div>
                <h2 className="benefit-form-title">
                  {editingSetting?.id ? 'تعديل API' : 'إضافة API جديد'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingSetting?.id ? 'قم بتحديث إعدادات API' : 'أضف API جديد لاختبار سرعة الإنترنت'}
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
                  <Gauge className="icon" />
                </div>
                <h3 className="section-title">معلومات API</h3>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <Label htmlFor="api_name" className="form-label">
                    اسم API <span className="required">*</span>
                  </Label>
                  <Input
                    id="api_name"
                    name="api_name"
                    value={formData.api_name}
                    onChange={handleChange}
                    placeholder="مثال: Speedtest by Ookla"
                    className={errors.api_name ? 'input-error' : ''}
                  />
                  {errors.api_name && <span className="error-message">{errors.api_name}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="api_url" className="form-label">
                    عنوان URL <span className="required">*</span>
                  </Label>
                  <Input
                    id="api_url"
                    name="api_url"
                    type="url"
                    value={formData.api_url}
                    onChange={handleChange}
                    placeholder="https://www.example.com/api/speedtest"
                    className={errors.api_url ? 'input-error' : ''}
                  />
                  {errors.api_url && <span className="error-message">{errors.api_url}</span>}
                </div>

                <div className="form-group">
                  <Label htmlFor="api_key" className="form-label">
                    API Key (اختياري)
                  </Label>
                  <Input
                    id="api_key"
                    name="api_key"
                    type="password"
                    value={formData.api_key || ''}
                    onChange={handleChange}
                    placeholder="أدخل API Key إذا لزم الأمر"
                  />
                </div>

                <div className="form-group">
                  <Label htmlFor="description" className="form-label">
                    الوصف
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="وصف مختصر عن API..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="benefit-form-section">
              <div className="section-header">
                <div className="section-icon">
                  <Gauge className="icon" />
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
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={formData.is_default || false}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      افتراضي
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active || false}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    نشط
                  </label>
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
              {loading ? 'جاري الحفظ...' : editingSetting?.id ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

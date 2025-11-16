import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User as UserIcon, 
  Shield, 
  CheckCircle, 
  Mail, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  Verified,
  Package,
  Award,
  Headphones,
  HelpCircle,
  Gauge,
  Phone,
  MessageSquare,
  Star,
  Layout,
  Info,
  BarChart3
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import './BenefitForm.css';

const PERMISSIONS = [
  { key: 'manage_users', label: 'إدارة المستخدمين', icon: UserIcon },
  { key: 'manage_packages', label: 'إدارة الباقات', icon: Package },
  { key: 'manage_benefits', label: 'إدارة المزايا', icon: Award },
  { key: 'manage_support_info', label: 'إدارة بيانات الدعم الفني', icon: Headphones },
  { key: 'manage_faqs', label: 'إدارة الأسئلة الشائعة', icon: HelpCircle },
  { key: 'manage_speed_test_settings', label: 'إعدادات اختبار السرعة', icon: Gauge },
  { key: 'manage_contact_info', label: 'إدارة معلومات التواصل', icon: Phone },
  { key: 'manage_messages', label: 'إدارة الرسائل', icon: MessageSquare },
  { key: 'manage_premium_services', label: 'إدارة الخدمات المتميزة', icon: Star },
  { key: 'manage_hero_settings', label: 'إدارة إعدادات الهيرو', icon: Layout },
  { key: 'manage_about_page', label: 'إدارة صفحة من نحن', icon: Info },
  { key: 'view_dashboard', label: 'عرض لوحة التحكم الرئيسية', icon: BarChart3 },
];

interface UserFormProps {
  editingUser: any | null;
  onSuccess: () => void;
  onClose: () => void;
}

export default function UserForm({ editingUser, onClose, onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
    permissions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '',
        is_admin: editingUser.is_admin || false,
        permissions: editingUser.permissions || [],
      });
    } else {
      setFormData({ name: '', email: '', password: '', is_admin: false, permissions: [] });
    }
    setErrors({});
    setShowPassword(false);
  }, [editingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheck = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePermissionChange = (key: string) => {
    setFormData(prev => {
      const checked = prev.permissions.includes(key);
      const permissions = checked
        ? prev.permissions.filter((p: string) => p !== key)
        : [...prev.permissions, key];
      return { ...prev, permissions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingUser
        ? `http://127.0.0.1:8000/api/admin/users/${editingUser.id}`
        : 'http://127.0.0.1:8000/api/admin/users';
      const data: any = {
        name: formData.name,
        email: formData.email,
        is_admin: formData.is_admin,
        permissions: formData.permissions,
      };
  
      if (formData.password) data.password = formData.password;
      if(data.is_admin) {
      if (editingUser ) {
        console.log(data.is_admin);
        await axios.put(url, data, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('تم التحديث بنجاح!', {
          description: 'تم تحديث بيانات المستخدم بنجاح',
          icon: <Verified className="h-5 w-5 text-emerald-500" />,
          duration: 3000,
          className: 'rtl:font-arabic',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          },
        });
      } else {
        await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('تم الإضافة بنجاح!', {
          description: 'تم إضافة المستخدم الجديد بنجاح',
          icon: <Verified className="h-5 w-5 text-emerald-500" />,
          duration: 3000,
          className: 'rtl:font-arabic',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
          },
        });
      }
      onSuccess();
    }else {
      toast.error('لا يمكنك تعديل المستخدمين فقط المدير الرئيسي يمكنه تعديل المستخدمين');
    }
      onClose();

    } catch (err: any) {
      console.error('Error:', err);
      if (err.response?.data?.errors) {
        const errorObj = err.response.data.errors;
        const newErrors: Record<string, string> = {};
        Object.keys(errorObj).forEach(key => {
          newErrors[key] = Array.isArray(errorObj[key]) ? errorObj[key][0] : errorObj[key];
        });
        setErrors(newErrors);
      }
      toast.error('فشل العملية', {
        description: err.response?.data?.message || 'حدث خطأ أثناء حفظ البيانات',
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        duration: 4000,
        className: 'rtl:font-arabic',
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="benefit-form-overlay" onClick={onClose}>
        <div className="overlay-background" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="benefit-form-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="benefit-form-header">
            <div className="benefit-form-header-content">
              <div className="benefit-form-icon-wrapper">
                {editingUser ? (
                  <UserIcon className="icon" />
                ) : (
                  <UserIcon className="icon" />
                )}
              </div>
              <div>
                <h2 className="benefit-form-title">
                  {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
                </h2>
                <p className="benefit-form-subtitle">
                  {editingUser ? 'قم بتحديث بيانات المستخدم' : 'أدخل بيانات المستخدم الجديد'}
                </p>
              </div>
              {formData.is_admin && (
                <div className="ml-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-semibold">مدير</span>
                </div>
              )}
            </div>
            <button
              type="button"
              className="benefit-form-close-btn"
              onClick={onClose}
              disabled={loading}
            >
              <X className="icon" />
            </button>
          </div>

          {/* Form Content */}
          <div className="benefit-form-content">
            <div className="benefit-form-body">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="benefit-form-fields flex-1">
                  {/* Basic Info Section */}
                  <div className="benefit-form-section">
                    <div className="section-header">
                      <div className="section-icon">
                        <UserIcon className="icon" />
                      </div>
                      <h3 className="section-title">المعلومات الأساسية</h3>
                    </div>
                    <div className="section-content">
                      <div className="form-grid">
                        <div className="form-group">
                          <Label htmlFor="name" className="form-label flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-primary" />
                            الاسم الكامل
                            <span className="required">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className={`h-12 ${errors.name ? 'input-error' : ''}`}
                            placeholder="أدخل الاسم الكامل"
                          />
                          {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                          <Label htmlFor="email" className="form-label flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            البريد الإلكتروني
                            <span className="required">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className={`h-12 ${errors.email ? 'input-error' : ''}`}
                            placeholder="example@company.com"
                          />
                          {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                          <Label htmlFor="password" className="form-label flex items-center gap-2">
                            <Lock className="h-4 w-4 text-primary" />
                            كلمة المرور
                            {editingUser && <span className="text-xs text-muted-foreground font-normal">(اتركه فارغ للحفاظ على الكلمة الحالية)</span>}
                            {!editingUser && <span className="required">*</span>}
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              value={formData.password}
                              onChange={handleChange}
                              required={!editingUser}
                              disabled={loading}
                              className={`h-12 pr-12 ${errors.password ? 'input-error' : ''}`}
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={loading}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                          <Label className="form-label flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            نوع المستخدم
                          </Label>
                          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
                            <input
                              id="is_admin"
                              type="checkbox"
                              checked={formData.is_admin}
                              onChange={() => handleCheck('is_admin')}
                              disabled={loading}
                              className="w-5 h-5 accent-primary cursor-pointer"
                            />
                            <Label htmlFor="is_admin" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Shield className="h-5 w-5 text-primary" />
                              <span className="font-semibold">مدير النظام</span>
                              <span className="text-xs text-muted-foreground">(صلاحيات كاملة)</span>
                            </Label>
                          </div>
                          {formData.is_admin && (
                            <p className="text-xs text-primary mt-2 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              عند تفعيل هذه الخيار، سيحصل المستخدم على جميع الصلاحيات تلقائياً
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Section */}
                  <div className="benefit-form-section">
                    <div className="section-header">
                      <div className="section-icon">
                        <Key className="icon" />
                      </div>
                      <h3 className="section-title">الصلاحيات</h3>
                    </div>
                    <div className="section-content">
                      {formData.is_admin ? (
                        <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 text-center">
                          <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                          <p className="text-sm font-semibold text-foreground">
                            المستخدم لديه صلاحيات المدير الكاملة
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            لا حاجة لتحديد صلاحيات إضافية
                          </p>
                        </div>
                      ) : (
                        <div className="pages-grid">
                          {PERMISSIONS.map(perm => {
                            const IconComponent = perm.icon;
                            const isSelected = formData.permissions.includes(perm.key);
                            return (
                              <label
                                key={perm.key}
                                className={`page-option ${isSelected ? 'selected' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handlePermissionChange(perm.key)}
                                  disabled={loading || formData.is_admin}
                                  className="checkbox-input"
                                />
                                <IconComponent className="icon" />
                                <span className="page-label">{perm.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {errors.permissions && (
                        <span className="error-message mt-3 block">{errors.permissions}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="benefit-form-footer">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={onClose}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {editingUser ? 'جاري التحديث...' : 'جاري الإضافة...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {editingUser ? 'تحديث' : 'إضافة'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

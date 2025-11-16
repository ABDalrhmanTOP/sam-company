import React, { useState, useEffect } from 'react';
import { requireAuth, getAuthToken } from '../../utils/auth';
import { toast } from 'sonner';
import axios from 'axios';
import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  X,
  Lock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCircle,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';

interface UserData {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    requireAuth();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    } catch (error: any) {
      toast.error('فشل تحميل بيانات المستخدم');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'كلمة المرور الحالية مطلوبة';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const token = getAuthToken();
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        updateData.current_password = formData.currentPassword;
        updateData.password = formData.newPassword;
        updateData.password_confirmation = formData.confirmPassword;
      }

      await axios.put('http://127.0.0.1:8000/api/user', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('تم تحديث الملف الشخصي بنجاح!', {
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        duration: 3000,
      });

      await fetchUserData();
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل تحديث الملف الشخصي';
      toast.error(errorMessage, {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">لم يتم العثور على بيانات المستخدم</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
            <p className="text-muted-foreground mt-1">إدارة معلومات حسابك الشخصي</p>
          </div>
          {!isEditing && (
            <Button onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-[#c01810] flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase() || <UserCircle className="h-12 w-12" />}
              </div>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                المعلومات الأساسية
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  تغيير كلمة المرور
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className={errors.currentPassword ? 'border-red-500' : ''}
                        placeholder="اتركه فارغاً إذا كنت لا تريد تغيير كلمة المرور"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className={errors.newPassword ? 'border-red-500' : ''}
                      />
                      {errors.newPassword && (
                        <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                معلومات الحساب
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الحساب</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    {user.is_admin ? (
                      <>
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-medium">مدير</span>
                      </>
                    ) : (
                      <>
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">مستخدم</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الصلاحيات</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    {user.permissions && user.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((perm, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">لا توجد صلاحيات محددة</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    تاريخ الإنشاء
                  </Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="text-sm">{formatDate(user.created_at)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    آخر تحديث
                  </Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="text-sm">{formatDate(user.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
                <Button onClick={handleCancel} variant="outline" disabled={isSaving} className="gap-2">
                  <X className="h-4 w-4" />
                  إلغاء
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


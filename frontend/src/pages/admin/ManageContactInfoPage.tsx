import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Plus, Trash2, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { toast } from 'sonner';
import ContactInfoForm from './ContactInfoForm';

interface ContactInfoData {
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

export function ManageContactInfoPage() {
  const [contactInfos, setContactInfos] = useState<ContactInfoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInfo, setEditingInfo] = useState<ContactInfoData | null>(null);

  const token = localStorage.getItem('admin_token');

  const fetchContactInfos = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/contact-info`, { headers: { Authorization: `Bearer ${token}` } });
      setContactInfos(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
      toast.error('فشل تحميل معلومات الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const filteredContactInfos = filterType === 'all'
    ? contactInfos
    : contactInfos.filter(info => info.type === filterType);

  const types = Array.from(new Set(contactInfos.map(info => info.type)));

  const stats = {
    total: contactInfos.length,
    active: contactInfos.filter(i => i.is_active).length,
    filtered: filteredContactInfos.length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="h-5 w-5" />;
      case 'email':
        return '✉️';
      case 'address':
        return '📍';
      case 'whatsapp':
        return '💬';
      case 'hours':
        return '🕐';
      default:
        return '📞';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'phone':
        return 'هاتف';
      case 'email':
        return 'بريد';
      case 'address':
        return 'عنوان';
      case 'whatsapp':
        return 'واتساب';
      case 'hours':
        return 'ساعات العمل';
      default:
        return type;
    }
  };

  useEffect(() => {
    fetchContactInfos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المعلومات؟')) return;

    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/contact-info/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('تم حذف المعلومات بنجاح');
      await fetchContactInfos();
    } catch (err: any) {
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInfo = () => {
    setEditingInfo(null);
    setShowForm(true);
  };

  const handleEditInfo = (info: ContactInfoData) => {
    setEditingInfo(info);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingInfo(null);
    fetchContactInfos();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInfo(null);
  };

  if (loading && contactInfos.length === 0) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20" style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm" style={{ position: 'relative', zIndex: 10 }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/admin'}
                className="hover:bg-primary/10 transition-colors"
                title="العودة للوحة التحكم"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة معلومات الاتصال</h1>
                <p className="text-sm text-muted-foreground">إدارة معلومات صفحة تواصل معنا</p>
              </div>
            </div>
            <Button onClick={handleAddInfo} className="gap-2" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
              <Plus className="w-5 h-5" />
              إضافة معلومات جديدة
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative" style={{ zIndex: 1, pointerEvents: 'auto' }}>
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
                  <p className="text-sm font-medium text-muted-foreground">إجمالي المعلومات</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">المعلومات النشطة</p>
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
                  <p className="text-sm font-medium text-muted-foreground">المعلومات المعروضة</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.filtered}</p>
                </div>
                <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium">تصفية حسب النوع:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                الكل
              </Button>
              {types.map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  {getTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info List */}
        <div className="space-y-4">
          {filteredContactInfos.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد معلومات</h3>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة معلومات جديدة</p>
                <Button onClick={handleAddInfo} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                  إضافة معلومات
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredContactInfos.map((info) => (
              <Card key={info.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative" style={{ pointerEvents: 'auto', zIndex: 1 }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          {getTypeIcon(info.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {info.label_ar} / {info.label_en}
                          </CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {getTypeLabel(info.type)}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 text-foreground">
                              {info.value}
                            </span>
                            {info.is_active && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                نشط
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ pointerEvents: 'auto' }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditInfo(info)}
                        className="h-8 w-8"
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => info.id && handleDelete(info.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {info.description_ar || 'لا يوجد وصف'}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Contact Info Form Modal */}
      {showForm && (
        <ContactInfoForm
          editingInfo={editingInfo}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default ManageContactInfoPage;

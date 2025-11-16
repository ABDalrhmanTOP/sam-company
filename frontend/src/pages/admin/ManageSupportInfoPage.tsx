import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Plus, Trash2, Headphones, ArrowLeft, Filter, Phone, Mail, MessageCircle, Globe } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { toast } from 'sonner';
import SupportInfoForm from './SupportInfoForm';

interface SupportInfoData {
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

export function ManageSupportInfoPage() {
  const [supportInfos, setSupportInfos] = useState<SupportInfoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingInfo, setEditingInfo] = useState<SupportInfoData | null>(null);

  const token = localStorage.getItem('admin_token');

  const fetchSupportInfos = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/support-info`, { headers: { Authorization: `Bearer ${token}` } });
      setSupportInfos(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
      toast.error('فشل تحميل معلومات الدعم الفني');
    } finally {
      setLoading(false);
    }
  };

  const filteredSupportInfos = filterType === 'all' 
    ? supportInfos 
    : supportInfos.filter(info => info.type === filterType);

  const stats = {
    total: supportInfos.length,
    active: supportInfos.filter(i => i.is_active).length,
    filtered: filteredSupportInfos.length,
  };

  useEffect(() => {
    fetchSupportInfos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المعلومات؟')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/support-info/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('تم حذف المعلومات بنجاح');
      await fetchSupportInfos();
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

  const handleEditInfo = (info: SupportInfoData) => {
    setEditingInfo(info);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingInfo(null);
    fetchSupportInfos();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingInfo(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'channel':
        return Phone;
      case 'method':
        return MessageCircle;
      case 'info':
        return Globe;
      default:
        return Headphones;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'channel':
        return 'قناة اتصال';
      case 'method':
        return 'طريقة دعم';
      case 'info':
        return 'معلومات';
      default:
        return type;
    }
  };

  if (loading && supportInfos.length === 0) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/admin'}
                className="hover:bg-primary/10 transition-colors"
                title="العودة للوحة التحكم"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-2 rounded-lg bg-primary/10">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة معلومات الدعم الفني</h1>
                <p className="text-sm text-muted-foreground">إدارة وعرض معلومات الدعم الفني</p>
              </div>
            </div>
            <Button onClick={handleAddInfo} className="gap-2">
              <Plus className="w-5 h-5" />
              إضافة معلومات جديدة
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
                  <Headphones className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                  <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                  <Filter className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">تصفية حسب النوع:</span>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                الكل
              </Button>
              <Button
                variant={filterType === 'channel' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('channel')}
              >
                قناة اتصال
              </Button>
              <Button
                variant={filterType === 'method' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('method')}
              >
                طريقة دعم
              </Button>
              <Button
                variant={filterType === 'info' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('info')}
              >
                معلومات
              </Button>
            </div>
          </div>
        </div>

        {/* Support Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupportInfos.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Headphones className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">لا توجد معلومات</h3>
                  <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة معلومات جديدة</p>
                  <Button onClick={handleAddInfo}>
                    إضافة معلومات
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredSupportInfos.map((info) => {
              const TypeIcon = getTypeIcon(info.type);
              return (
                <Card key={info.id} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <TypeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{info.title_ar}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              {getTypeLabel(info.type)}
                            </span>
                            {info.is_active && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">نشط</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditInfo(info)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => info.id && handleDelete(info.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{info.description_ar}</CardDescription>
                    {info.value && (
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{info.value}</span>
                      </div>
                    )}
                    {info.link && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <a href={info.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {info.link}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Support Info Form Modal */}
      {showForm && (
        <SupportInfoForm
          editingInfo={editingInfo}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default ManageSupportInfoPage;

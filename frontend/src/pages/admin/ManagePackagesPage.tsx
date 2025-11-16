import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Plus, Trash2, Package, ArrowLeft, Filter, DollarSign, Clock, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { toast } from 'sonner';
import PackageForm from './PackageForm';

interface PackageData {
  id?: number;
  name: string;
  description: string;
  price: number;
  speed: string;
  features?: string[];
  type: 'home' | 'business';
  is_active?: boolean;
  order?: number;
}

export function ManagePackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageData | null>(null);

  const token = localStorage.getItem('admin_token');

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/packages`, { headers: { Authorization: `Bearer ${token}` } });
      setPackages(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
      toast.error('فشل تحميل الباقات');
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = filterType === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.type === filterType);

  const stats = {
    total: packages.length,
    active: packages.filter(p => p.is_active).length,
    filtered: filteredPackages.length,
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: number, packageName: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/packages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('تم حذف الباقة بنجاح');
      // إرسال إشعار للمدير إذا كان المستخدم مشرف
      try {
        const userResponse = await axios.get('http://127.0.0.1:8000/api/user', { headers: { Authorization: `Bearer ${token}` } });
        const currentUser = userResponse.data;
        if (!currentUser.is_admin) {
          const { useNotificationService } = await import('../../utils/notificationService');
          const service = useNotificationService();
          await service.notifyAdminOfModification(currentUser, 'packages', packageName, 'deleted');
        }
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }
      await fetchPackages();
    } catch (err: any) {
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setShowForm(true);
  };

  const handleEditPackage = (pkg: PackageData) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handlePackageSuccess = () => {
    setShowForm(false);
    setEditingPackage(null);
    fetchPackages();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPackage(null);
  };

  if (loading && packages.length === 0) {
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
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">لوحة إدارة الباقات</h1>
                <p className="text-sm text-muted-foreground">إدارة وعرض الباقات الخاصة بالموقع</p>
              </div>
            </div>
                         <Button onClick={handleAddPackage} className="gap-2">
               <Plus className="w-5 h-5" />
               إضافة باقة جديدة
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
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الباقات</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الباقات النشطة</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الباقات المعروضة</p>
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
                variant={filterType === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('home')}
              >
                منزلي
              </Button>
              <Button
                variant={filterType === 'business' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('business')}
              >
                تجاري
              </Button>
            </div>
          </div>
        </div>

                {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">لا توجد باقات</h3>
                  <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة باقة جديدة</p>
                  <Button onClick={handleAddPackage}>
                    إضافة باقة
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredPackages.map((pkg) => (
                             <Card key={pkg.id} className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <CardHeader className="pb-3">
                   <div className="flex items-start justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                         <Package className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                         <CardTitle className="text-lg">{pkg.name}</CardTitle>
                         <div className="flex items-center gap-2 mt-1">
                           <span className={`text-xs px-2 py-1 rounded-full ${
                             pkg.type === 'home' 
                               ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                               : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                           }`}>
                             {pkg.type === 'home' ? 'منزلي' : 'تجاري'}
                           </span>
                           {pkg.is_active && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">نشط</span>}
                         </div>
                       </div>
                     </div>
                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => handleEditPackage(pkg)}
                         className="h-8 w-8"
                       >
                         <Pencil className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => pkg.id && handleDelete(pkg.id)}
                         className="h-8 w-8 text-destructive hover:text-destructive"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="mb-4">{pkg.description}</CardDescription>
                   <div className="flex items-center justify-between pt-4 border-t">
                     <div className="flex items-center gap-2">
                       <Zap className="h-4 w-4 text-primary" />
                       <span className="font-bold text-lg">{pkg.speed}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <DollarSign className="h-4 w-4 text-green-600" />
                       <span className="font-bold text-xl text-primary">{pkg.price}</span>
                     </div>
                   </div>
                 </CardContent>
               </Card>
            ))
          )}
        </div>
      </div>

      {/* Package Form Modal */}
      {showForm && (
        <PackageForm
          editingPackage={editingPackage}
          onSuccess={handlePackageSuccess}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default ManagePackagesPage;

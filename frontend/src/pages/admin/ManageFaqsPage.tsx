import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pencil, Plus, Trash2, HelpCircle, ArrowLeft, Filter, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../components/ui/card';
import { toast } from 'sonner';
import FaqForm from './FaqForm';

interface FaqData {
  id?: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  category?: string;
  is_active?: boolean;
  order?: number;
}

export function ManageFaqsPage() {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/faqs`, { headers: { Authorization: `Bearer ${token}` } });
      setFaqs(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
      toast.error('فشل تحميل الأسئلة الشائعة');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = filterCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === filterCategory);

  const categories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)));

  const stats = {
    total: faqs.length,
    active: faqs.filter(i => i.is_active).length,
    filtered: filteredFaqs.length,
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`http://127.0.0.1:8000/api/admin/faqs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('تم حذف السؤال بنجاح');
      await fetchFaqs();
    } catch (err: any) {
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = () => {
    setEditingFaq(null);
    setShowForm(true);
  };

  const handleEditFaq = (faq: FaqData) => {
    setEditingFaq(faq);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingFaq(null);
    fetchFaqs();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFaq(null);
  };

  if (loading && faqs.length === 0) {
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
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة الأسئلة الشائعة</h1>
                <p className="text-sm text-muted-foreground">إدارة وعرض الأسئلة الشائعة</p>
              </div>
            </div>
            <Button onClick={handleAddFaq} className="gap-2" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
              <Plus className="w-5 h-5" />
              إضافة سؤال جديد
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
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الأسئلة</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الأسئلة النشطة</p>
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
                  <p className="text-sm font-medium text-muted-foreground">الأسئلة المعروضة</p>
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
        <div className="bg-card rounded-xl border border-border p-4 mb-6" style={{ pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">تصفية حسب الفئة:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory('all')}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                الكل
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category!)}
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <HelpCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">لا توجد أسئلة</h3>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة سؤال جديد</p>
                <Button onClick={handleAddFaq} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                  إضافة سؤال
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredFaqs.map((faq) => (
              <Card key={faq.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/20 overflow-hidden relative" style={{ pointerEvents: 'auto', zIndex: 1 }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <HelpCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{faq.question_ar}</CardTitle>
                          <div className="flex items-center gap-2">
                            {faq.category && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {faq.category}
                              </span>
                            )}
                            {faq.is_active && (
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
                        onClick={() => handleEditFaq(faq)}
                        className="h-8 w-8"
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => faq.id && handleDelete(faq.id)}
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
                    {faq.answer_ar}
                  </CardDescription>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* FAQ Form Modal */}
      {showForm && (
        <FaqForm
          editingFaq={editingFaq}
          onSuccess={handleSuccess}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default ManageFaqsPage;

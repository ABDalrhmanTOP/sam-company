import React, { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, Sparkles, CheckCircle, X, Filter, ArrowLeft, Search, RefreshCcw, Inbox, ArrowUpDown, Languages } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { api, endpoints } from '../../utils/api';

interface Announcement {
  id?: number;
  text_ar: string;
  text_en: string;
  cta_ar: string;
  cta_en: string;
  is_active?: boolean;
  date?: string;
  created_at?: string;
}

const INITIAL_ANN: Announcement = {
  text_ar: '', text_en: '', cta_ar: '', cta_en: '', is_active: true, date: ''
};

export function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [filterLang, setFilterLang] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<'date' | 'created_at'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get(endpoints.announcements.admin);
      setAnnouncements(response.data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل التحميل');
      toast.error('فشل تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  // فلترة الحالة فقط
  const filteredAnnouncements = announcements
    .filter(a => filterActive === 'all' ? true : (filterActive === 'active' ? !!a.is_active : !a.is_active))
    .filter(a => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (a.text_ar || '').toLowerCase().includes(q) ||
        (a.text_en || '').toLowerCase().includes(q) ||
        (a.cta_ar || '').toLowerCase().includes(q) ||
        (a.cta_en || '').toLowerCase().includes(q)
      );
    });

  // sorting & pagination
  const total = filteredAnnouncements.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageItems = filteredAnnouncements.slice(startIdx, startIdx + pageSize);

  const stats = {
    total: announcements.length,
    active: announcements.filter(a => a.is_active).length,
    inactive: announcements.filter(a => !a.is_active).length,
  };

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleToggleActive = async (a: Announcement) => {
    try {
      const payload = { ...a, is_active: !a.is_active };
      await api.put(endpoints.announcements.adminById(a.id as number), payload);
      toast.success(!a.is_active ? 'تم تفعيل الإعلان' : 'تم إيقاف الإعلان');
      await fetchAnnouncements();
    } catch {
      toast.error('تعذر تبديل حالة الإعلان');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    setLoading(true);
    try {
      await api.delete(endpoints.announcements.adminById(id));
      toast.success('تم حذف الإعلان بنجاح');
      await fetchAnnouncements();
    } catch (err: any) {
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
    fetchAnnouncements();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  if (loading && announcements.length === 0) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4" style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
      <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background/95 to-transparent backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-xl p-3 mb-6 border" style={{ position: 'relative', zIndex: 10 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
          إدارة الإعلانات
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchAnnouncements} className="flex items-center gap-2" title="تحديث" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddAnnouncement} className="flex items-center gap-2 text-sm font-bold" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
            <Plus className="h-4 w-4" /> إعلان جديد
          </Button>
        </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border">
            <div className="text-xs text-muted-foreground">إجمالي</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300/50">
            <div className="text-xs text-emerald-700 dark:text-emerald-300">نشطة</div>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{stats.active}</div>
          </div>
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-300/50">
            <div className="text-xs text-red-700 dark:text-red-300">غير نشطة</div>
            <div className="text-xl font-bold text-red-700 dark:text-red-300">{stats.inactive}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6" style={{ pointerEvents: 'auto' }}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث في النص أو زر الدعوة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
            style={{ pointerEvents: 'auto' }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant={filterLang==='all'? 'default':'outline'} onClick={()=>setFilterLang('all')} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>كل اللغات</Button>
          <Button size="sm" variant={filterLang==='ar'? 'default':'outline'} onClick={()=>setFilterLang('ar')} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>العربية</Button>
          <Button size="sm" variant={filterLang==='en'? 'default':'outline'} onClick={()=>setFilterLang('en')} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>الإنجليزية</Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant={filterActive==='all'? 'default':'outline'} onClick={()=>setFilterActive('all')} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>الكل</Button>
          <Button size="sm" variant={filterActive==='active'? 'default':'outline'} onClick={()=>setFilterActive('active')} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>نشط</Button>
          <Button size="sm" variant={filterActive==='inactive'? 'default':'outline'} onClick={()=>setFilterActive('inactive')} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>غير نشط</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 px-1" style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={()=> setSortDir(d => d==='asc'?'desc':'asc')} className="flex items-center gap-1" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
            <ArrowUpDown className="h-4 w-4" />
            {sortDir === 'asc' ? 'تصاعدي' : 'تنازلي'}
          </Button>
          <select className="border rounded-md px-2 py-1 text-sm bg-background" value={sortBy} onChange={(e)=> setSortBy(e.target.value as any)} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
            <option value="date">حسب التاريخ</option>
            <option value="created_at">حسب الإنشاء</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">لكل صفحة</span>
          <select className="border rounded-md px-2 py-1 text-sm bg-background" value={pageSize} onChange={(e)=>{ setPageSize(parseInt(e.target.value)); setPage(1); }} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md bg-white dark:bg-slate-800" style={{ pointerEvents: 'auto' }}>
        <table className="min-w-full divide-y divide-muted">
          <thead className="bg-muted/50 dark:bg-slate-900/20">
            <tr>
              <th className="py-3 px-2">#</th>
              <th className="py-3 px-2">النصوص</th>
              <th className="py-3 px-2">CTA</th>
              <th className="py-3 px-2">الحالة</th>
              <th className="py-3 px-2">التاريخ</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {!pageItems.length ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted-foreground">لا يوجد نتائج</td>
              </tr>
            ) : (
              pageItems.map((a, idx) => (
                <tr key={a.id}>
                  <td className="py-3 px-2 font-mono">{startIdx + idx + 1}</td>
                  <td className="py-3 px-2">
                    <div>
                      <span className="inline-block mb-1 font-semibold text-primary">AR:</span>
                      <span>{a.text_ar}</span>
                    </div>
                    <div>
                      <span className="inline-block mb-1 font-semibold text-primary">EN:</span>
                      <span>{a.text_en}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div><b>AR:</b> {a.cta_ar || '-'}</div>
                    <div><b>EN:</b> {a.cta_en || '-'}</div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
                      {a.is_active ? <CheckCircle className="text-green-500"/> : <X className="text-red-500"/>}
                      <Button size="sm" variant="outline" onClick={()=>handleToggleActive(a)} style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
                        {a.is_active ? 'إيقاف' : 'تفعيل'}
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 px-2">{a.date || '-'}</td>
                  <td className="py-3 px-2">
                    <Button variant="outline" size="icon" onClick={()=>handleEditAnnouncement(a)} style={{ pointerEvents: 'auto', cursor: 'pointer' }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={()=>handleDelete(a.id!)} style={{ pointerEvents: 'auto', cursor: 'pointer' }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm" style={{ pointerEvents: 'auto' }}>
        <div className="text-muted-foreground">عرض {pageItems.length} من {total} إعلان</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage<=1} onClick={()=> setPage(p => Math.max(1, p-1))} style={{ pointerEvents: 'auto', cursor: currentPage<=1 ? 'not-allowed' : 'pointer' }}>السابق</Button>
          <span className="px-2">{currentPage} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={currentPage>=totalPages} onClick={()=> setPage(p => Math.min(totalPages, p+1))} style={{ pointerEvents: 'auto', cursor: currentPage>=totalPages ? 'not-allowed' : 'pointer' }}>التالي</Button>
        </div>
      </div>
      {showForm && (
        <AnnouncementForm
          initialValues={editingAnnouncement || INITIAL_ANN}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}

// نموذج الإضافة/التعديل AnnouncementForm
// يجب أن يقرأ ويكتب Announcement (وليس سجليْن)
function AnnouncementForm({ initialValues, onSuccess, onCancel }: { initialValues: Announcement; onSuccess:()=>void; onCancel:()=>void }) {
  const [form, setForm] = useState<Announcement>(initialValues);
  const [saving, setSaving] = useState(false);
  const isEdit = !!form.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    let value: any = (e.target as any).value;
    if (type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(endpoints.announcements.adminById(form.id!), form);
        toast.success('تم تحديث الإعلان!');
      } else {
        await api.post(endpoints.announcements.admin, form);
        toast.success('تم إنشاء الإعلان!');
      }
      onSuccess();
    } catch {
      toast.error('فشل حفظ الإعلان');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="benefit-form-overlay" style={{ pointerEvents: 'auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.20 }}
          className="overlay-background"
          onClick={onCancel}
          style={{ pointerEvents: 'auto' }}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="benefit-form-container w-full max-w-3xl !p-0"
          onClick={e => e.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Header */}
          <div className="benefit-form-header flex items-center justify-between bg-primary/10 rounded-t-xl px-6 py-3 border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h2 className="font-black text-2xl">{isEdit ? 'تعديل إعلان' : 'إضافة إعلان جديد'}</h2>
            </div>
            <button onClick={onCancel} className="benefit-form-close-btn" style={{ pointerEvents: 'auto', cursor: 'pointer' }}><X className="icon" /></button>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8" style={{ pointerEvents: 'auto' }}>
            <div className="benefit-form-section">
              <div className="section-header mb-2 flex items-center gap-2">
                <Sparkles className="icon text-yellow-400" />
                <h3 className="section-title font-semibold">النصوص</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="text_ar">النص (عربي)</Label>
                  <Textarea id="text_ar" name="text_ar" value={form.text_ar} onChange={handleChange} rows={3} style={{ pointerEvents: 'auto' }} />
                  <Label htmlFor="cta_ar">CTA (عربي)</Label>
                  <Input id="cta_ar" name="cta_ar" value={form.cta_ar} onChange={handleChange} style={{ pointerEvents: 'auto' }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text_en">النص (English)</Label>
                  <Textarea id="text_en" name="text_en" value={form.text_en} onChange={handleChange} rows={3} style={{ pointerEvents: 'auto' }} />
                  <Label htmlFor="cta_en">CTA (English)</Label>
                  <Input id="cta_en" name="cta_en" value={form.cta_en} onChange={handleChange} style={{ pointerEvents: 'auto' }} />
                </div>
              </div>
            </div>
            <div className="benefit-form-section mt-3">
              <div className="section-header mb-2 flex items-center gap-2">
                <Inbox className="icon text-blue-400" />
                <h3 className="section-title font-semibold">إعدادات إضافية</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="space-y-2 w-full md:w-1/3">
                  <Label htmlFor="date">تاريخ العرض</Label>
                  <Input id="date" type="date" name="date" value={form.date || ''} onChange={handleChange} style={{ pointerEvents: 'auto' }} />
                </div>
                <div className="flex items-center gap-2 mt-6" style={{ pointerEvents: 'auto' }}>
                  <input id="is_active" type="checkbox" name="is_active" checked={!!form.is_active} onChange={handleChange} style={{ pointerEvents: 'auto', cursor: 'pointer' }} />
                  <Label htmlFor="is_active">نشط</Label>
                </div>
              </div>
            </div>
            <div className="benefit-form-footer flex flex-row-reverse gap-2 mt-6" style={{ pointerEvents: 'auto' }}>
              <Button type="submit" disabled={saving} className="submit-btn" style={{ pointerEvents: 'auto', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'يرجى الانتظار...' : isEdit ? 'تحديث' : 'حفظ'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={saving} className="cancel-btn" style={{ pointerEvents: 'auto', cursor: saving ? 'not-allowed' : 'pointer' }}>إلغاء</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

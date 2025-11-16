import React, { useEffect, useState, useRef } from 'react';
import { api } from '../../utils/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Trash2, Eye, Archive, CheckCircle, Circle, Clock } from 'lucide-react';
import { useNotificationService } from '../../utils/notificationService';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  is_read: boolean;
  read_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export function ManageMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const lastMessageIdRef = useRef<number | null>(null);
  const { notifyAdminOfNewMessage } = useNotificationService();

  useEffect(() => {
    fetchMessages();
    
    // فحص الرسائل الجديدة كل 10 ثوان
    const interval = setInterval(() => {
      checkForNewMessages();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const checkForNewMessages = async () => {
    try {
      const response = await api.get('/api/admin/messages');
      const newMessages = response.data as Message[];
      
      // البحث عن الرسائل الجديدة
      if (lastMessageIdRef.current !== null && newMessages.length > 0) {
        const newUnreadMessages = newMessages.filter(
          msg => !msg.is_read && 
          msg.status === 'new' &&
          (!lastMessageIdRef.current || msg.id > lastMessageIdRef.current)
        );

        // إرسال إشعار عن كل رسالة جديدة
        for (const msg of newUnreadMessages) {
          await notifyAdminOfNewMessage(
            msg.id,
            msg.name,
            msg.email,
            msg.message
          );
        }
      }

      // تحديث آخر معرف رسالة
      if (newMessages.length > 0) {
        const maxId = Math.max(...newMessages.map(m => m.id));
        if (lastMessageIdRef.current === null || maxId > lastMessageIdRef.current) {
          lastMessageIdRef.current = maxId;
        }
      }

      setMessages(newMessages);
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get('/api/admin/messages');
      const fetchedMessages = response.data as Message[];
      setMessages(fetchedMessages);
      
      // تحديث آخر معرف رسالة
      if (fetchedMessages.length > 0) {
        lastMessageIdRef.current = Math.max(...fetchedMessages.map(m => m.id));
      }
      
      setLoading(false);
    } catch (error: any) {
      toast.error('فشل تحميل الرسائل');
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/api/admin/messages/${id}`, {
        is_read: true,
        status: 'read',
      });
      toast.success('تم تحديد الرسالة كمقروءة');
      fetchMessages();
    } catch (error) {
      toast.error('فشل تحديث حالة الرسالة');
    }
  };

  const handleChangeStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/admin/messages/${id}`, { status });
      toast.success('تم تحديث حالة الرسالة');
      fetchMessages();
    } catch (error) {
      toast.error('فشل تحديث حالة الرسالة');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    try {
      await api.delete(`/api/admin/messages/${id}`);
      toast.success('تم حذف الرسالة بنجاح');
      fetchMessages();
    } catch (error) {
      toast.error('فشل حذف الرسالة');
    }
  };

  const filteredMessages = filterStatus === 'all' 
    ? messages 
    : messages.filter(msg => msg.status === filterStatus);

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { className: 'bg-blue-500', text: 'جديدة' },
      read: { className: 'bg-green-500', text: 'مقروءة' },
      replied: { className: 'bg-purple-500', text: 'تم الرد' },
      archived: { className: 'bg-gray-500', text: 'مؤرشفة' },
    };
    const variant = variants[status] || variants.new;
    return <Badge className={variant.className}>{variant.text}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                className="hover:bg-primary/10"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة الرسائل</h1>
                <p className="text-sm text-muted-foreground">عرض وإدارة رسائل التواصل</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative" style={{ zIndex: 1, pointerEvents: 'auto' }}>
        {/* Statistics */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">إجمالي الرسائل</div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">جديدة</div>
              <div className="text-2xl font-bold text-green-600">{stats.new}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">مقروءة</div>
              <div className="text-2xl font-bold text-purple-600">{stats.read}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">تم الرد</div>
              <div className="text-2xl font-bold text-orange-600">{stats.replied}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">مؤرشفة</div>
              <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-6" style={{ pointerEvents: 'auto' }}>
          {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              {status === 'all' ? 'الكل' : 
               status === 'new' ? 'جديدة' :
               status === 'read' ? 'مقروءة' :
               status === 'replied' ? 'تم الرد' : 'مؤرشفة'}
            </Button>
          ))}
        </div>

        {/* Messages List */}
        <div className="grid gap-4">
          {filteredMessages.map((msg) => (
            <Card key={msg.id} className="hover:shadow-lg transition-shadow relative" style={{ pointerEvents: 'auto', zIndex: 1 }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{msg.name}</h3>
                      {!msg.is_read && <Circle className="h-3 w-3 text-blue-500 fill-current" />}
                      {getStatusBadge(msg.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                    {msg.phone && <p className="text-sm text-muted-foreground">{msg.phone}</p>}
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(msg.created_at)}</p>
                  </div>
                  <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
                    {!msg.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(msg.id)}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        حدد كمقروء
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChangeStatus(msg.id, 'archived')}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      <Archive className="h-4 w-4 mr-1" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(msg.id)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                    </Button>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{msg.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">لا توجد رسائل</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import { Users, ArrowLeft, Plus, Search, Trash2, Edit, Shield, Mail, User as UserIcon } from 'lucide-react';
import { getAuthToken, requireAuth } from '../../utils/auth';
import UserForm from './UserForm';
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  permissions?: string[];
  created_at: string;
  updated_at: string;
}

export function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
    permissions: [],
  });

  useEffect(() => {
    requireAuth();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error: any) {
      toast.error('فشل تحميل المستخدمين');
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', is_admin: false, permissions: [] });
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      is_admin: user.is_admin,
      permissions: user.permissions || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const token = getAuthToken();
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('تم حذف المستخدم بنجاح');
      fetchUsers();
    } catch (error) {
      toast.error('فشل حذف المستخدم');
    }
  };

  const handlePermissionChange = (perm: string) => {
    setFormData((prev: any) => {
      const hasPerm = prev.permissions.includes(perm);
      return {
        ...prev,
        permissions: hasPerm
          ? prev.permissions.filter((p: string) => p !== perm)
          : [...prev.permissions, perm],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const url = editingUser
        ? `http://127.0.0.1:8000/api/admin/users/${editingUser.id}`
        : 'http://127.0.0.1:8000/api/admin/users';
      
      const data: any = {
        name: formData.name,
        email: formData.email,
        is_admin: formData.is_admin,
        permissions: formData.permissions,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (editingUser) {
        await axios.put(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('تم تحديث المستخدم بنجاح');
      } else {
        await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('تم إضافة المستخدم بنجاح');
      }

      setShowForm(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    admins: users.filter(u => u.is_admin).length,
    regular: users.filter(u => !u.is_admin).length,
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
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
                <p className="text-sm text-muted-foreground">عرض وإدارة المستخدمين والنظام</p>
              </div>
            </div>
            <Button onClick={handleAddUser} className="gap-2" style={{ pointerEvents: 'auto', cursor: 'pointer' }}>
              <Plus className="h-4 w-4" />
              إضافة مستخدم جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative" style={{ zIndex: 1, pointerEvents: 'auto' }}>
        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">إجمالي المستخدمين</div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">مدراء</div>
              <div className="text-2xl font-bold text-green-600">{stats.admins}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">مستخدمون عاديون</div>
              <div className="text-2xl font-bold text-purple-600">{stats.regular}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-6" style={{ pointerEvents: 'auto' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
              style={{ pointerEvents: 'auto' }}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow relative" style={{ pointerEvents: 'auto', zIndex: 1 }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${user.is_admin ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-500'}`}>
                      {user.is_admin ? (
                        <Shield className="h-6 w-6 text-white" />
                      ) : (
                        <UserIcon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{user.name}</h3>
                        {user.is_admin && <Badge className="bg-orange-500">مدير</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        تم الإنشاء: {new Date(user.created_at).toLocaleDateString('ar')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user.id)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg text-muted-foreground">لا يوجد مستخدمون</p>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
    editingUser={editingUser}
    onClose={() => setShowForm(false)}
    onSuccess={() => { setShowForm(false); fetchUsers(); }}
  />        
      )}
    </div>
  );
}

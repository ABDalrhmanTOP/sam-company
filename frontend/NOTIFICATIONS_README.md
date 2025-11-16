# نظام الإشعارات (Notifications System)

## نظرة عامة

تم إنشاء نظام إشعارات شامل لإدارة الإشعارات في لوحة تحكم الأدمن. يتضمن النظام:

- **NotificationContext**: Context لإدارة حالة الإشعارات
- **NotificationBell**: مكون لعرض جرس الإشعارات مع عداد الإشعارات غير المقروءة
- **ManageNotificationsPage**: صفحة لإدارة الإشعارات (إنشاء، عرض، حذف)
- تكامل كامل مع `AdminDashboard`

## المكونات

### 1. NotificationContext (`src/context/NotificationContext.tsx`)

Context رئيسي يوفر:
- جلب الإشعارات من الـ API
- تحديث الإشعارات تلقائياً كل 30 ثانية
- تحديد الإشعارات كمقروءة
- حذف الإشعارات
- إنشاء إشعارات جديدة

### 2. NotificationBell (`src/components/NotificationBell.tsx`)

مكون جرس الإشعارات مع:
- عداد الإشعارات غير المقروءة
- لوحة منبثقة لعرض الإشعارات
- إمكانية تحديد الإشعارات كمقروءة
- إمكانية حذف الإشعارات

### 3. ManageNotificationsPage (`src/pages/admin/ManageNotificationsPage.tsx`)

صفحة إدارة الإشعارات مع:
- عرض قائمة الإشعارات
- البحث والفلترة (حسب النوع، الحالة)
- إنشاء إشعارات جديدة
- حذف الإشعارات

## API Endpoints المطلوبة

يحتاج النظام إلى الـ API endpoints التالية في الـ backend:

### 1. جلب جميع الإشعارات
```
GET /api/admin/notifications
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  data: Notification[]
}
```

### 2. إنشاء إشعار جديد
```
POST /api/admin/notifications
Headers: Authorization: Bearer {token}
Body: {
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  link?: string,
  user_id?: number
}
Response: {
  success: true,
  data: Notification
}
```

### 3. تحديد إشعار كمقروء
```
PATCH /api/admin/notifications/{id}/read
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  message: string
}
```

### 4. تحديد جميع الإشعارات كمقروءة
```
PATCH /api/admin/notifications/read-all
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  message: string
}
```

### 5. حذف إشعار
```
DELETE /api/admin/notifications/{id}
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  message: string
}
```

### 6. حذف جميع الإشعارات
```
DELETE /api/admin/notifications
Headers: Authorization: Bearer {token}
Response: {
  success: true,
  message: string
}
```

## نموذج البيانات (Notification Interface)

```typescript
interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  user_id?: number;
  link?: string;
}
```

## الاستخدام

### في AdminDashboard

تم دمج النظام تلقائياً في `AdminDashboard`. يمكنك:

1. رؤية عداد الإشعارات غير المقروءة في شريط التنقل
2. فتح لوحة الإشعارات بالنقر على جرس الإشعارات
3. الوصول إلى صفحة إدارة الإشعارات من القائمة الجانبية

### استخدام Context مباشرة

```typescript
import { useNotifications } from '../context/NotificationContext';

function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    createNotification 
  } = useNotifications();

  // استخدام الإشعارات
}
```

## ملاحظات التطوير

- يتم تحديث الإشعارات تلقائياً كل 30 ثانية
- يعمل النظام فقط في صفحات الأدمن (محمي بـ NotificationProvider)
- يتم التحقق من الـ token قبل كل طلب API
- يدعم النظام الأنواع التالية: info, success, warning, error

## الخطوات التالية للـ Backend

يجب إنشاء:

1. **Migration** لجدول `notifications`:
   - id
   - title
   - message
   - type (enum: info, success, warning, error)
   - is_read (boolean, default: false)
   - user_id (nullable, foreign key)
   - link (nullable)
   - timestamps

2. **Model**: `Notification.php`
3. **Controller**: `NotificationController.php`
4. **Routes**: إضافة routes في `routes/api.php`

## مثال على Migration (Laravel)

```php
Schema::create('notifications', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('message');
    $table->enum('type', ['info', 'success', 'warning', 'error'])->default('info');
    $table->boolean('is_read')->default(false);
    $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
    $table->string('link')->nullable();
    $table->timestamps();
});
```







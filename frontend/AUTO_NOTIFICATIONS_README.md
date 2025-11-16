# نظام الإشعارات التلقائية (Auto Notifications System)

## نظرة عامة

تم تطوير نظام إشعارات تلقائي يقوم بإرسال إشعارات للمدير في الحالات التالية:

1. **عند تعديل المشرفين**: عندما يقوم مشرف بتعديل أو إنشاء أو حذف أي بيانات (مزايا، باقات، مستخدمين، إلخ)، يتم إرسال إشعار تلقائي للمدير
2. **عند استلام رسائل جديدة**: عندما يرسل مستخدم رسالة جديدة، يتم إرسال إشعار فوري للمدير

## المكونات

### 1. NotificationService (`src/utils/notificationService.ts`)

خدمة مركزية لإرسال الإشعارات التلقائية:

```typescript
// إرسال إشعار عند تعديل من قبل مشرف
NotificationService.notifyAdminOfModification(
  modifiedBy: { id: number; name: string },
  resourceType: string,
  resourceName: string,
  action: 'created' | 'updated' | 'deleted'
);

// إرسال إشعار عند استلام رسالة جديدة
NotificationService.notifyAdminOfNewMessage(
  messageId: number,
  senderName: string,
  senderEmail: string,
  messagePreview: string
);
```

### 2. Hooks (`src/hooks/useAdminNotifications.ts`)

- **useCurrentUser**: جلب معلومات المستخدم الحالي
- **useNotifyOnModification**: Hook لإرسال إشعار عند التعديل (للمشرفين فقط)

### 3. التكامل مع الصفحات الإدارية

تم دمج النظام في:
- `BenefitForm.tsx`: إرسال إشعار عند إنشاء/تحديث/حذف ميزة
- `ManageMessagesPage.tsx`: فحص دوري كل 10 ثوانٍ للرسائل الجديدة

## كيفية العمل

### 1. إشعارات تعديل المشرفين

عندما يقوم مشرف بتعديل بيانات:

```typescript
// في BenefitForm.tsx
const currentUser = await getUser();
if (currentUser && !currentUser.is_admin) {
  await NotificationService.notifyAdminOfModification(
    currentUser,
    'benefits',
    resourceName,
    'created' // أو 'updated' أو 'deleted'
  );
}
```

**ملاحظة مهمة**: الإشعار يُرسل فقط للمدير (user_id للمدير في Backend)، ولا يتم إرسال إشعار إذا كان المستخدم نفسه هو المدير.

### 2. إشعارات الرسائل الجديدة

في `ManageMessagesPage.tsx`:
- يتم فحص الرسائل الجديدة كل 10 ثوانٍ
- عند اكتشاف رسالة جديدة غير مقروءة، يتم إرسال إشعار للمدير تلقائياً

```typescript
useEffect(() => {
  fetchMessages();
  
  // فحص الرسائل الجديدة كل 10 ثوان
  const interval = setInterval(() => {
    checkForNewMessages();
  }, 10000);

  return () => clearInterval(interval);
}, []);
```

## إضافة النظام لصفحات أخرى

لإضافة نظام الإشعارات لصفحة إدارية أخرى (مثل Packages، Users، إلخ):

### مثال: PackageForm

```typescript
import { NotificationService } from '../../utils/notificationService';

// في handleSubmit
const currentUser = await axios.get('/api/user');
if (currentUser.data && !currentUser.data.is_admin) {
  const action = editingPackage ? 'updated' : 'created';
  await NotificationService.notifyAdminOfModification(
    currentUser.data,
    'packages',
    packageName,
    action
  );
}
```

## Backend Requirements

يجب أن يدعم Backend:

1. **إنشاء إشعار**: `POST /api/admin/notifications`
2. **تحديد المستلم**: الإشعار يجب أن يُرسل للمدير فقط
   - في Backend، عند استلام إشعار من نوع "تعديل من قبل مشرف"، يجب البحث عن جميع المستخدمين الذين `is_admin = true` وإرسال الإشعار لهم

### مثال Laravel:

```php
// في NotificationController
public function store(Request $request)
{
    // إنشاء الإشعار
    $notification = Notification::create([
        'title' => $request->title,
        'message' => $request->message,
        'type' => $request->type,
        'link' => $request->link,
    ]);

    // إذا كان الإشعار عن تعديل مشرف، إرساله لجميع المديرين
    if ($request->title === 'تعديل من قبل مشرف') {
        $admins = User::where('is_admin', true)->get();
        foreach ($admins as $admin) {
            $notification->users()->attach($admin->id);
        }
    } else {
        // إرسال للمستخدم المحدد أو جميع المديرين
        if ($request->user_id) {
            $notification->users()->attach($request->user_id);
        } else {
            // إرسال لجميع المديرين (للرسائل الجديدة)
            $admins = User::where('is_admin', true)->get();
            foreach ($admins as $admin) {
                $notification->users()->attach($admin->id);
            }
        }
    }

    return response()->json([
        'success' => true,
        'data' => $notification
    ]);
}
```

## الإعدادات

- **معدل فحص الرسائل**: 10 ثوانٍ (قابل للتعديل في `ManageMessagesPage.tsx`)
- **معدل تحديث الإشعارات**: 30 ثانية (في `NotificationContext.tsx`)

## ملاحظات

1. **الأداء**: النظام يستخدم فحص دوري للرسائل، يمكن تحسينه باستخدام WebSockets في المستقبل
2. **التكرار**: يمكن تحسين نظام الإشعارات لمنع الإشعارات المكررة باستخدام cache أو timestamps
3. **الأمان**: يتم التحقق من صلاحيات المستخدم قبل إرسال الإشعارات

## الاختبار

لاختبار النظام:

1. **تعديل المشرف**: 
   - تسجيل دخول كمشرف (ليس مدير)
   - تعديل/إنشاء/حذف أي بيانات
   - التحقق من وصول الإشعار للمدير

2. **رسالة جديدة**:
   - إرسال رسالة من صفحة التواصل
   - فتح صفحة الرسائل (يتم الفحص تلقائياً كل 10 ثوانٍ)
   - التحقق من وصول الإشعار للمدير

## الخطوات التالية

- [ ] إضافة WebSocket للرسائل الفورية
- [ ] إضافة نظام تصفية الإشعارات المكررة
- [ ] إضافة إعدادات لتخصيص معدل الفحص
- [ ] دمج النظام في جميع الصفحات الإدارية







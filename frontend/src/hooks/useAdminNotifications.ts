import { useEffect, useState } from 'react';
import { useNotificationService } from '../utils/notificationService';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  is_admin?: boolean;
}

/**
 * Hook للحصول على معلومات المستخدم الحالي
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, isAdmin: user?.is_admin || false };
}

/**
 * Hook لإرسال إشعار عند التعديل (للمشرفين فقط - يرسل للمدير)
 */
export function useNotifyOnModification(
  resourceType: string,
  action: 'created' | 'updated' | 'deleted',
  resourceName: string
) {
  const { user } = useCurrentUser();
  const { notifyAdminOfModification } = useNotificationService();

  const sendNotification = async () => {
    // إذا كان المستخدم الحالي هو مدير، لا نرسل إشعار
    if (user?.is_admin) {
      return;
    }

    // إذا كان المستخدم مشرف، نرسل إشعار للمدير
    if (user) {
      await notifyAdminOfModification(user, resourceType, resourceName, action);
    }
  };

  return { sendNotification, user };
}







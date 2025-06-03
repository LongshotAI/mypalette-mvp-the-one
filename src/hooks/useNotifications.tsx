
import { useState } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  type: 'follow' | 'submission' | 'open_call' | 'portfolio_like' | 'admin_notice';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

// Placeholder notification system until database table is created
export const useNotifications = () => {
  const [notifications] = useState<Notification[]>([]);
  const [unreadCount] = useState(0);

  const markAsRead = {
    mutate: (notificationId: string) => {
      console.log('Mark as read placeholder:', notificationId);
    },
  };

  const markAllAsRead = {
    mutate: () => {
      console.log('Mark all as read placeholder');
    },
  };

  const createNotification = {
    mutate: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
      console.log('Create notification placeholder:', notification);
    },
  };

  return {
    notifications,
    unreadCount,
    isLoading: false,
    markAsRead,
    markAllAsRead,
    createNotification,
  };
};

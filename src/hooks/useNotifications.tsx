
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const getUserNotifications = useQuery({
    queryKey: ['user-notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use raw SQL query with proper type casting
      const { data, error } = await supabase.rpc('get_user_notifications' as any, {
        p_user_id: user.id
      });

      if (error) {
        console.log('Notifications table may not exist yet, returning empty array');
        return [] as Notification[];
      }
      return (data || []) as Notification[];
    },
  });

  const getUnreadCount = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Use raw SQL query with proper type casting
      const { data, error } = await supabase.rpc('get_unread_notifications_count' as any, {
        p_user_id: user.id
      });

      if (error) {
        console.log('Notifications table may not exist yet, returning 0');
        return 0;
      }
      return data || 0;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase.rpc('mark_notification_as_read' as any, {
        p_notification_id: notificationId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('mark_all_notifications_as_read' as any, {
        p_user_id: user.id
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
    },
  });

  return {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};

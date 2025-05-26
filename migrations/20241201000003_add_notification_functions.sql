
-- Add missing notification functions

-- Function to get user notifications
CREATE OR REPLACE FUNCTION get_user_notifications(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  type text,
  title text,
  message text,
  data jsonb,
  read boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id, n.user_id, n.type, n.title, n.message, n.data, n.read, n.created_at
  FROM public.notifications n
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT 50;
END;
$$;

-- Function to get unread notifications count
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result integer;
BEGIN
  SELECT COUNT(*)::integer INTO count_result
  FROM public.notifications
  WHERE user_id = p_user_id AND read = false;
  
  RETURN COALESCE(count_result, 0);
END;
$$;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_as_read(p_notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true, updated_at = now()
  WHERE id = p_notification_id;
END;
$$;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true, updated_at = now()
  WHERE user_id = p_user_id AND read = false;
END;
$$;

-- Add updated_at column to notifications if it doesn't exist
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();


import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log('Checking admin status for user:', user.email);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return null;
      }

      console.log('User profile role:', profile?.role);
      
      // Force admin role for the specified email
      if (user.email === 'lshot.crypto@gmail.com' && profile?.role !== 'admin') {
        console.log('Updating admin role for lshot.crypto@gmail.com');
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating admin role:', updateError);
        } else {
          console.log('Admin role updated successfully');
          return 'admin';
        }
      }

      return profile?.role || 'user';
    },
    enabled: !!user,
  });
};

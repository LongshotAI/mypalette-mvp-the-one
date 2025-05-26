
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin-check', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user for admin check');
        return null;
      }

      console.log('Checking admin status for user:', user.email);

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          return null;
        }

        console.log('Current user profile role:', profile?.role);
        
        // Force admin role update for lshot.crypto@gmail.com if not already admin
        if (user.email === 'lshot.crypto@gmail.com') {
          if (profile?.role !== 'admin') {
            console.log('FORCING ADMIN ROLE UPDATE for lshot.crypto@gmail.com');
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ role: 'admin' })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating admin role:', updateError);
              return null;
            } else {
              console.log('ADMIN ROLE UPDATED SUCCESSFULLY');
              return 'admin';
            }
          }
          return 'admin';
        }

        return profile?.role || 'user';
      } catch (error) {
        console.error('Admin check failed:', error);
        return null;
      }
    },
    enabled: !!user,
    retry: 3,
    retryDelay: 1000,
  });
};

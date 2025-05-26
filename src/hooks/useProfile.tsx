
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Ensure user profile exists
  const ensureProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No authenticated user');

      console.log('Ensuring profile exists for user:', user.id);

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        return existingProfile;
      }

      // Create profile if it doesn't exist
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: user.email === 'lshot.crypto@gmail.com' ? 'admin' : 'user'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }

      console.log('Profile created successfully:', newProfile);
      return newProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });

  const getProfile = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  return {
    profile: getProfile.data,
    isLoading: getProfile.isLoading,
    ensureProfile,
    refetch: getProfile.refetch,
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  phone: string | null;
  location: string | null;
  artistic_medium: string | null;
  artistic_style: string | null;
  years_active: number | null;
  education: string | null;
  awards: string | null;
  exhibitions: string | null;
  artist_statement: string | null;
  commission_info: string | null;
  pricing_info: string | null;
  available_for_commission: boolean | null;
  role: 'user' | 'admin' | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async (userId?: string) => {
    try {
      setLoading(true);
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        setProfile(null);
        return;
      }

      console.log('Fetching profile for user:', targetUserId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Profile fetch error:', error);
        throw error;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Updating profile with:', updates);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully!",
      });

      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update profile',
        variant: "destructive",
      });
      throw err;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      console.log('Uploading avatar:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });

      return publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to upload avatar',
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    refetch: () => fetchProfile()
  };
};

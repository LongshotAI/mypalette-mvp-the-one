
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIFilm3Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface AIFilm3Config {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export const useAIFilm3 = () => {
  const queryClient = useQueryClient();

  // Get all announcements (public access)
  const getAnnouncements = useQuery({
    queryKey: ['aifilm3-announcements'],
    queryFn: async (): Promise<AIFilm3Announcement[]> => {
      console.log('Fetching AIFilm3 announcements...');
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching AIFilm3 announcements:', error);
        throw error;
      }

      console.log('AIFilm3 announcements fetched:', data);
      return data as AIFilm3Announcement[];
    },
  });

  // Get all announcements for admin (authenticated access)
  const getAllAnnouncements = useQuery({
    queryKey: ['admin-aifilm3-announcements'],
    queryFn: async (): Promise<AIFilm3Announcement[]> => {
      console.log('Fetching all AIFilm3 announcements for admin...');
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin AIFilm3 announcements:', error);
        throw error;
      }

      console.log('Admin AIFilm3 announcements fetched:', data);
      return data as AIFilm3Announcement[];
    },
  });

  // Get festival configuration (authenticated access)
  const getFestivalConfig = useQuery({
    queryKey: ['aifilm3-config'],
    queryFn: async (): Promise<AIFilm3Config[]> => {
      console.log('Fetching AIFilm3 config...');
      
      const { data, error } = await supabase
        .from('aifilm3_config')
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        console.error('Error fetching AIFilm3 config:', error);
        throw error;
      }

      console.log('AIFilm3 config fetched:', data);
      return data as AIFilm3Config[];
    },
  });

  // Get single config value by key
  const getConfigValue = (key: string) => {
    return useQuery({
      queryKey: ['aifilm3-config-value', key],
      queryFn: async (): Promise<string | null> => {
        console.log('Fetching AIFilm3 config value for key:', key);
        
        const { data, error } = await supabase
          .from('aifilm3_config')
          .select('value')
          .eq('key', key)
          .maybeSingle();

        if (error) {
          console.error('Error fetching AIFilm3 config value:', error);
          throw error;
        }

        return data?.value || null;
      },
    });
  };

  // Create new announcement (admin only)
  const createAnnouncement = useMutation({
    mutationFn: async (announcementData: Omit<AIFilm3Announcement, 'id' | 'created_at'>) => {
      console.log('Creating AIFilm3 announcement:', announcementData);
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .insert(announcementData)
        .select()
        .single();

      if (error) {
        console.error('Error creating AIFilm3 announcement:', error);
        throw error;
      }

      console.log('AIFilm3 announcement created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-aifilm3-announcements'] });
      toast({
        title: "Announcement Created",
        description: "AIFilm3 announcement has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create announcement.",
        variant: "destructive",
      });
    },
  });

  // Update announcement (admin only)
  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<AIFilm3Announcement> & { id: string }) => {
      console.log('Updating AIFilm3 announcement:', id, updateData);
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating AIFilm3 announcement:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-aifilm3-announcements'] });
      toast({
        title: "Announcement Updated",
        description: "AIFilm3 announcement has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update announcement.",
        variant: "destructive",
      });
    },
  });

  // Delete announcement (admin only)
  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting AIFilm3 announcement:', id);
      
      const { error } = await supabase
        .from('aifilm3_announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting AIFilm3 announcement:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-aifilm3-announcements'] });
      toast({
        title: "Announcement Deleted",
        description: "AIFilm3 announcement has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete announcement.",
        variant: "destructive",
      });
    },
  });

  // Update festival configuration (admin only)
  const updateFestivalConfig = useMutation({
    mutationFn: async (configData: Record<string, string>) => {
      console.log('Updating AIFilm3 festival config:', configData);
      
      const updates = Object.entries(configData).map(([key, value]) => ({
        key,
        value,
      }));

      const { data, error } = await supabase
        .from('aifilm3_config')
        .upsert(updates, { onConflict: 'key' })
        .select();

      if (error) {
        console.error('Error updating AIFilm3 config:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-config'] });
      queryClient.invalidateQueries({ queryKey: ['aifilm3-config-value'] });
      toast({
        title: "Configuration Updated",
        description: "AIFilm3 festival configuration has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update configuration.",
        variant: "destructive",
      });
    },
  });

  return {
    getAnnouncements,
    getAllAnnouncements,
    getFestivalConfig,
    getConfigValue,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    updateFestivalConfig,
  };
};

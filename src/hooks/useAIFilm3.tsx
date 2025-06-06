
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIFilm3Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: 'general' | 'deadline' | 'winner' | 'update';
  is_published: boolean;
  publish_date: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  };
}

export interface AIFilm3Config {
  id: string;
  festival_name: string;
  festival_description: string;
  submission_deadline: string;
  festival_dates: {
    start_date: string;
    end_date: string;
  };
  submission_guidelines: string;
  prizes: string[];
  judges: string[];
  is_active: boolean;
  banner_image?: string;
  updated_at: string;
}

export const useAIFilm3 = () => {
  const queryClient = useQueryClient();

  // Fetch all announcements
  const getAnnouncements = useQuery({
    queryKey: ['aifilm3-announcements'],
    queryFn: async () => {
      console.log('Fetching AIFilm3 announcements...');
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .eq('is_published', true)
        .order('publish_date', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }

      console.log('AIFilm3 announcements fetched:', data);
      return data as AIFilm3Announcement[];
    },
  });

  // Fetch all announcements for admin (including unpublished)
  const getAllAnnouncements = useQuery({
    queryKey: ['aifilm3-admin-announcements'],
    queryFn: async () => {
      console.log('Fetching all AIFilm3 announcements for admin...');
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin announcements:', error);
        throw error;
      }

      console.log('All AIFilm3 announcements fetched:', data);
      return data as AIFilm3Announcement[];
    },
  });

  // Fetch festival configuration
  const getFestivalConfig = useQuery({
    queryKey: ['aifilm3-config'],
    queryFn: async () => {
      console.log('Fetching AIFilm3 festival configuration...');
      
      const { data, error } = await supabase
        .from('aifilm3_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching festival config:', error);
        throw error;
      }

      console.log('AIFilm3 config fetched:', data);
      return data as AIFilm3Config;
    },
  });

  // Create announcement
  const createAnnouncement = useMutation({
    mutationFn: async (announcementData: {
      title: string;
      content: string;
      announcement_type: 'general' | 'deadline' | 'winner' | 'update';
      is_published: boolean;
      publish_date: string;
    }) => {
      console.log('Creating AIFilm3 announcement:', announcementData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .insert({
          ...announcementData,
          author_id: user.id
        })
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .single();

      if (error) {
        console.error('Error creating announcement:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['aifilm3-admin-announcements'] });
      toast({
        title: "Announcement Created",
        description: "AIFilm3 announcement has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement.",
        variant: "destructive",
      });
    },
  });

  // Update announcement
  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<AIFilm3Announcement> 
    }) => {
      console.log('Updating AIFilm3 announcement:', id, updates);

      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          profiles(first_name, last_name, username)
        `)
        .single();

      if (error) {
        console.error('Error updating announcement:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['aifilm3-admin-announcements'] });
      toast({
        title: "Announcement Updated",
        description: "AIFilm3 announcement has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement.",
        variant: "destructive",
      });
    },
  });

  // Update festival configuration
  const updateFestivalConfig = useMutation({
    mutationFn: async (configData: Partial<AIFilm3Config>) => {
      console.log('Updating AIFilm3 festival config:', configData);

      const { data, error } = await supabase
        .from('aifilm3_config')
        .upsert({
          ...configData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating festival config:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-config'] });
      toast({
        title: "Festival Configuration Updated",
        description: "AIFilm3 festival settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update festival configuration.",
        variant: "destructive",
      });
    },
  });

  // Delete announcement
  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting AIFilm3 announcement:', id);

      const { error } = await supabase
        .from('aifilm3_announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['aifilm3-admin-announcements'] });
      toast({
        title: "Announcement Deleted",
        description: "AIFilm3 announcement has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement.",
        variant: "destructive",
      });
    },
  });

  return {
    getAnnouncements,
    getAllAnnouncements,
    getFestivalConfig,
    createAnnouncement,
    updateAnnouncement,
    updateFestivalConfig,
    deleteAnnouncement,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIFilm3Announcement {
  id: string;
  title: string;
  content: string;
  announcement_type: string;
  is_published: boolean;
  published_at: string | null;
  author_id: string;
  image_url: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useAIFilm3Announcements = () => {
  const queryClient = useQueryClient();

  const getAnnouncements = useQuery({
    queryKey: ['aifilm3-announcements'],
    queryFn: async (): Promise<AIFilm3Announcement[]> => {
      console.log('Fetching AIFilm3 announcements...');
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching AIFilm3 announcements:', error);
        throw error;
      }

      console.log('AIFilm3 announcements fetched:', data);
      return data as AIFilm3Announcement[];
    },
  });

  const getPublishedAnnouncements = useQuery({
    queryKey: ['aifilm3-published-announcements'],
    queryFn: async (): Promise<AIFilm3Announcement[]> => {
      console.log('Fetching published AIFilm3 announcements...');
      
      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching published announcements:', error);
        throw error;
      }

      console.log('Published announcements fetched:', data);
      return data as AIFilm3Announcement[];
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async (announcementData: Partial<AIFilm3Announcement>) => {
      console.log('Creating AIFilm3 announcement:', announcementData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('aifilm3_announcements')
        .insert({
          title: announcementData.title || '',
          content: announcementData.content || '',
          announcement_type: announcementData.announcement_type || 'general',
          is_published: announcementData.is_published || false,
          published_at: announcementData.is_published ? new Date().toISOString() : null,
          author_id: user.id,
          image_url: announcementData.image_url,
          metadata: announcementData.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating announcement:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['aifilm3-published-announcements'] });
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

  return {
    getAnnouncements,
    getPublishedAnnouncements,
    createAnnouncement,
  };
};

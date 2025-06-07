
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
      
      try {
        const { data, error } = await supabase
          .rpc('exec_sql', {
            sql: `
              SELECT 
                a.*,
                json_build_object(
                  'first_name', p.first_name,
                  'last_name', p.last_name,
                  'username', p.username
                ) as profiles
              FROM aifilm3_announcements a
              LEFT JOIN profiles p ON a.author_id = p.id
              WHERE a.is_published = true
              ORDER BY a.publish_date DESC
            `
          });

        if (error) {
          console.error('Error fetching announcements:', error);
          return [];
        }

        console.log('AIFilm3 announcements fetched:', data);
        return (data || []) as AIFilm3Announcement[];
      } catch (err) {
        console.error('AIFilm3 announcements table may not exist yet:', err);
        return [];
      }
    },
  });

  // Fetch all announcements for admin (including unpublished)
  const getAllAnnouncements = useQuery({
    queryKey: ['aifilm3-admin-announcements'],
    queryFn: async () => {
      console.log('Fetching all AIFilm3 announcements for admin...');
      
      try {
        const { data, error } = await supabase
          .rpc('exec_sql', {
            sql: `
              SELECT 
                a.*,
                json_build_object(
                  'first_name', p.first_name,
                  'last_name', p.last_name,
                  'username', p.username
                ) as profiles
              FROM aifilm3_announcements a
              LEFT JOIN profiles p ON a.author_id = p.id
              ORDER BY a.created_at DESC
            `
          });

        if (error) {
          console.error('Error fetching admin announcements:', error);
          return [];
        }

        console.log('All AIFilm3 announcements fetched:', data);
        return (data || []) as AIFilm3Announcement[];
      } catch (err) {
        console.error('AIFilm3 announcements table may not exist yet:', err);
        return [];
      }
    },
  });

  // Fetch festival configuration
  const getFestivalConfig = useQuery({
    queryKey: ['aifilm3-config'],
    queryFn: async () => {
      console.log('Fetching AIFilm3 festival configuration...');
      
      try {
        const { data, error } = await supabase
          .rpc('exec_sql', {
            sql: `
              SELECT * FROM aifilm3_config 
              WHERE is_active = true 
              ORDER BY created_at DESC 
              LIMIT 1
            `
          });

        if (error) {
          console.error('Error fetching festival config:', error);
          return null;
        }

        console.log('AIFilm3 config fetched:', data);
        return data && data.length > 0 ? data[0] as AIFilm3Config : null;
      } catch (err) {
        console.error('AIFilm3 config table may not exist yet:', err);
        return null;
      }
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
        .rpc('exec_sql', {
          sql: `
            INSERT INTO aifilm3_announcements (
              title, content, announcement_type, is_published, publish_date, author_id
            ) VALUES (
              '${announcementData.title}',
              '${announcementData.content}',
              '${announcementData.announcement_type}',
              ${announcementData.is_published},
              '${announcementData.publish_date}',
              '${user.id}'
            ) RETURNING *
          `
        });

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

      const setClause = Object.entries(updates)
        .map(([key, value]) => `${key} = '${value}'`)
        .join(', ');

      const { data, error } = await supabase
        .rpc('exec_sql', {
          sql: `
            UPDATE aifilm3_announcements 
            SET ${setClause}, updated_at = now()
            WHERE id = '${id}'
            RETURNING *
          `
        });

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
        .rpc('exec_sql', {
          sql: `
            INSERT INTO aifilm3_config (
              festival_name, festival_description, submission_deadline,
              festival_dates, submission_guidelines, prizes, judges, is_active
            ) VALUES (
              '${configData.festival_name}',
              '${configData.festival_description}',
              '${configData.submission_deadline}',
              '${JSON.stringify(configData.festival_dates)}',
              '${configData.submission_guidelines}',
              ARRAY[${configData.prizes?.map(p => `'${p}'`).join(',')}],
              ARRAY[${configData.judges?.map(j => `'${j}'`).join(',')}],
              true
            )
            ON CONFLICT (id) DO UPDATE SET
              festival_name = EXCLUDED.festival_name,
              festival_description = EXCLUDED.festival_description,
              submission_deadline = EXCLUDED.submission_deadline,
              festival_dates = EXCLUDED.festival_dates,
              submission_guidelines = EXCLUDED.submission_guidelines,
              prizes = EXCLUDED.prizes,
              judges = EXCLUDED.judges,
              updated_at = now()
            RETURNING *
          `
        });

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
        .rpc('exec_sql', {
          sql: `DELETE FROM aifilm3_announcements WHERE id = '${id}'`
        });

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

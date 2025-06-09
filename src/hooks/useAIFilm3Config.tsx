
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIFilm3Config {
  id: string;
  festival_name: string;
  festival_description: string;
  festival_dates: string;
  registration_deadline: string;
  website_url: string | null;
  contact_email: string | null;
  banner_image: string | null;
  is_active: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
}

export const useAIFilm3Config = () => {
  const queryClient = useQueryClient();

  const getConfig = useQuery({
    queryKey: ['aifilm3-config'],
    queryFn: async (): Promise<AIFilm3Config | null> => {
      console.log('Fetching AIFilm3 config...');
      
      const { data, error } = await supabase
        .from('aifilm3_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching AIFilm3 config:', error);
        throw error;
      }

      console.log('AIFilm3 config fetched:', data);
      return data as AIFilm3Config | null;
    },
  });

  const updateConfig = useMutation({
    mutationFn: async (configData: Partial<AIFilm3Config>) => {
      console.log('Updating AIFilm3 config:', configData);
      
      const { data, error } = await supabase
        .from('aifilm3_config')
        .upsert({
          ...configData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating AIFilm3 config:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aifilm3-config'] });
      toast({
        title: "Configuration Updated",
        description: "AIFilm3 festival configuration has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update AIFilm3 configuration.",
        variant: "destructive",
      });
    },
  });

  return {
    getConfig,
    updateConfig,
  };
};

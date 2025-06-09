
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FeaturedContent {
  id: string;
  content_type: 'portfolio' | 'open_call' | 'artist';
  content_id: string;
  display_order: number;
  is_active: boolean;
  featured_until: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useFeaturedContent = () => {
  const queryClient = useQueryClient();

  const getFeaturedContent = useQuery({
    queryKey: ['featured-content'],
    queryFn: async (): Promise<FeaturedContent[]> => {
      console.log('Fetching featured content...');
      
      const { data, error } = await supabase
        .from('featured_content')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching featured content:', error);
        throw error;
      }

      console.log('Featured content fetched:', data);
      return data as FeaturedContent[];
    },
  });

  const getFeaturedPortfolios = useQuery({
    queryKey: ['featured-portfolios'],
    queryFn: async () => {
      console.log('Fetching featured portfolios...');
      
      const { data, error } = await supabase
        .from('featured_content')
        .select(`
          *,
          portfolios(
            id,
            title,
            description,
            cover_image,
            slug,
            user_id,
            view_count,
            profiles(username, first_name, last_name, avatar_url)
          )
        `)
        .eq('content_type', 'portfolio')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching featured portfolios:', error);
        throw error;
      }

      console.log('Featured portfolios fetched:', data);
      return data;
    },
  });

  const getFeaturedOpenCalls = useQuery({
    queryKey: ['featured-open-calls'],
    queryFn: async () => {
      console.log('Fetching featured open calls...');
      
      const { data, error } = await supabase
        .from('featured_content')
        .select(`
          *,
          open_calls(
            id,
            title,
            description,
            organization_name,
            submission_deadline,
            submission_fee,
            banner_image,
            status,
            number_of_winners,
            prize_details
          )
        `)
        .eq('content_type', 'open_call')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching featured open calls:', error);
        throw error;
      }

      console.log('Featured open calls fetched:', data);
      return data;
    },
  });

  const addFeaturedContent = useMutation({
    mutationFn: async ({ 
      content_type, 
      content_id, 
      display_order 
    }: { 
      content_type: 'portfolio' | 'open_call' | 'artist';
      content_id: string;
      display_order?: number;
    }) => {
      console.log('Adding featured content:', content_type, content_id);

      const { data, error } = await supabase
        .from('featured_content')
        .insert({
          content_type,
          content_id,
          display_order: display_order || 0,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding featured content:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-content'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['featured-open-calls'] });
      toast({
        title: "Content Featured",
        description: "Content has been added to featured list successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Feature Failed",
        description: error.message || "Failed to feature content.",
        variant: "destructive",
      });
    },
  });

  const removeFeaturedContent = useMutation({
    mutationFn: async (id: string) => {
      console.log('Removing featured content:', id);

      const { error } = await supabase
        .from('featured_content')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error removing featured content:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-content'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['featured-open-calls'] });
      toast({
        title: "Content Unfeatured",
        description: "Content has been removed from featured list.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remove Failed",
        description: error.message || "Failed to remove featured content.",
        variant: "destructive",
      });
    },
  });

  return {
    getFeaturedContent,
    getFeaturedPortfolios,
    getFeaturedOpenCalls,
    addFeaturedContent,
    removeFeaturedContent,
  };
};

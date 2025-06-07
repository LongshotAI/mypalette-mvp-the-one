
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useOpenCalls = () => {
  const queryClient = useQueryClient();

  const getOpenCalls = useQuery({
    queryKey: ['open-calls'],
    queryFn: async () => {
      console.log('Fetching open calls...');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .eq('status', 'live')
        .order('submission_deadline', { ascending: true });

      if (error) {
        console.error('Error fetching open calls:', error);
        throw error;
      }

      console.log('Open calls fetched:', data);
      return data;
    },
  });

  const getAllOpenCalls = useQuery({
    queryKey: ['admin-open-calls'],
    queryFn: async () => {
      console.log('Fetching all open calls for admin...');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin open calls:', error);
        throw error;
      }

      console.log('Admin open calls fetched:', data);
      return data;
    },
  });

  const getFeaturedOpenCalls = useQuery({
    queryKey: ['featured-open-calls'],
    queryFn: async () => {
      console.log('Fetching featured open calls...');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .eq('status', 'live')
        .eq('is_featured', true)
        .order('submission_deadline', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching featured open calls:', error);
        // If the is_featured column doesn't exist yet, fall back to regular query
        if (error.message?.includes('is_featured')) {
          console.log('is_featured column not found, using fallback query');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('open_calls')
            .select(`
              *,
              profiles(first_name, last_name, username, avatar_url)
            `)
            .eq('status', 'live')
            .order('submission_deadline', { ascending: true })
            .limit(6);
          
          if (fallbackError) throw fallbackError;
          return fallbackData;
        }
        throw error;
      }

      console.log('Featured open calls fetched:', data);
      return data;
    },
  });

  const getOpenCallById = (id: string) => {
    return useQuery({
      queryKey: ['open-call', id],
      queryFn: async () => {
        console.log('Fetching open call:', id);
        
        const { data, error } = await supabase
          .from('open_calls')
          .select(`
            *,
            profiles(first_name, last_name, username, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching open call:', error);
          throw error;
        }

        console.log('Open call fetched:', data);
        return data;
      },
      enabled: !!id,
    });
  };

  const updateOpenCallStatus = useMutation({
    mutationFn: async ({ id, status, is_featured }: { id: string; status?: string; is_featured?: boolean }) => {
      console.log('Updating open call status:', id, { status, is_featured });
      
      const updates: any = { updated_at: new Date().toISOString() };
      if (status !== undefined) updates.status = status;
      if (is_featured !== undefined) updates.is_featured = is_featured;

      const { data, error } = await supabase
        .from('open_calls')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating open call:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
      queryClient.invalidateQueries({ queryKey: ['admin-open-calls'] });
      queryClient.invalidateQueries({ queryKey: ['featured-open-calls'] });
      toast({
        title: "Open Call Updated",
        description: "Open call status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update open call.",
        variant: "destructive",
      });
    },
  });

  const createOpenCall = useMutation({
    mutationFn: async (openCallData: any) => {
      console.log('Creating open call:', openCallData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('open_calls')
        .insert({
          ...openCallData,
          host_user_id: user.id,
          status: 'live' // Default to live for admin-created calls
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating open call:', error);
        throw error;
      }

      console.log('Open call created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
      queryClient.invalidateQueries({ queryKey: ['admin-open-calls'] });
      queryClient.invalidateQueries({ queryKey: ['featured-open-calls'] });
      toast({
        title: "Open Call Created",
        description: "Open call has been created and is now live.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create open call.",
        variant: "destructive",
      });
    },
  });

  return {
    getOpenCalls,
    getAllOpenCalls,
    getFeaturedOpenCalls,
    getOpenCallById,
    updateOpenCallStatus,
    createOpenCall,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OpenCall {
  id: string;
  title: string;
  description: string;
  organization_name: string | null;
  organization_website: string | null;
  submission_deadline: string;
  submission_fee: number;
  max_submissions: number;
  submission_requirements: any;
  status: string;
  host_user_id: string | null;
  banner_image: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useOpenCalls = () => {
  const queryClient = useQueryClient();

  const getOpenCalls = useQuery({
    queryKey: ['open-calls'],
    queryFn: async (): Promise<OpenCall[]> => {
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
      return data as OpenCall[];
    },
  });

  const getAllOpenCalls = useQuery({
    queryKey: ['admin-open-calls'],
    queryFn: async (): Promise<OpenCall[]> => {
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
      return data as OpenCall[];
    },
  });

  const getFeaturedOpenCalls = useQuery({
    queryKey: ['featured-open-calls'],
    queryFn: async (): Promise<OpenCall[]> => {
      console.log('Fetching featured open calls...');
      
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(first_name, last_name, username, avatar_url)
        `)
        .eq('status', 'live')
        .order('submission_deadline', { ascending: true })
        .limit(6);

      if (error) {
        console.error('Error fetching featured open calls:', error);
        throw error;
      }

      console.log('Featured open calls fetched:', data);
      return data as OpenCall[];
    },
  });

  const getOpenCallById = (id: string) => {
    return useQuery({
      queryKey: ['open-call', id],
      queryFn: async (): Promise<OpenCall> => {
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
        return data as OpenCall;
      },
      enabled: !!id,
    });
  };

  const updateOpenCallStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating open call status:', id, status);
      
      const { data, error } = await supabase
        .from('open_calls')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
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
    mutationFn: async (openCallData: Partial<OpenCall>) => {
      console.log('Creating open call:', openCallData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('open_calls')
        .insert({
          title: openCallData.title || '',
          description: openCallData.description || '',
          organization_name: openCallData.organization_name,
          organization_website: openCallData.organization_website,
          submission_deadline: openCallData.submission_deadline || new Date().toISOString(),
          submission_fee: openCallData.submission_fee || 0,
          max_submissions: openCallData.max_submissions || 100,
          submission_requirements: openCallData.submission_requirements || {},
          host_user_id: user.id,
          status: 'live'
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

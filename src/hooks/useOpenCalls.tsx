
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
          status: 'pending'
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
      toast({
        title: "Open Call Submitted",
        description: "Your open call has been submitted for review.",
      });
    },
    onError: (error: any) => {
      console.error('Open call creation error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit open call.",
        variant: "destructive",
      });
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
          profiles(first_name, last_name, username)
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

  const updateOpenCallStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating open call status:', id, status);
      
      const { error } = await supabase
        .from('open_calls')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating open call status:', error);
        throw error;
      }

      console.log('Open call status updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
      queryClient.invalidateQueries({ queryKey: ['admin-open-calls'] });
      toast({
        title: "Status Updated",
        description: "Open call status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating open call status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  return {
    getOpenCalls,
    getOpenCallById,
    createOpenCall,
    getAllOpenCalls,
    updateOpenCallStatus,
  };
};

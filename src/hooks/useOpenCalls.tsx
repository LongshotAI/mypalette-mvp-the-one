
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OpenCallData {
  title: string;
  description: string;
  organizationName?: string;
  organizationWebsite?: string;
  submissionDeadline: string;
  submissionFee: number;
  maxSubmissions: number;
  submissionRequirements?: any;
  bannerImage?: string;
}

export interface OpenCall {
  id: string;
  host_user_id: string;
  title: string;
  description: string;
  organization_name?: string;
  organization_website?: string;
  submission_deadline: string;
  submission_fee: number;
  max_submissions: number;
  submission_requirements?: any;
  banner_image?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  };
}

export const useOpenCalls = () => {
  const queryClient = useQueryClient();

  const createOpenCall = useMutation({
    mutationFn: async (openCallData: OpenCallData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('open_calls')
        .insert({
          host_user_id: user.id,
          title: openCallData.title,
          description: openCallData.description,
          organization_name: openCallData.organizationName,
          organization_website: openCallData.organizationWebsite,
          submission_deadline: openCallData.submissionDeadline,
          submission_fee: openCallData.submissionFee,
          max_submissions: openCallData.maxSubmissions,
          submission_requirements: openCallData.submissionRequirements,
          banner_image: openCallData.bannerImage,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
      toast({
        title: "Open Call Created",
        description: "Your open call has been submitted for review.",
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

  const getLiveOpenCalls = useQuery({
    queryKey: ['open-calls', 'live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .eq('status', 'live')
        .gte('submission_deadline', new Date().toISOString())
        .order('submission_deadline', { ascending: true });

      if (error) throw error;
      return (data || []) as OpenCall[];
    },
  });

  const getAllOpenCalls = useQuery({
    queryKey: ['open-calls', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('open_calls')
        .select(`
          *,
          profiles(username, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as OpenCall[];
    },
  });

  const getOpenCallById = (id: string) => {
    return useQuery({
      queryKey: ['open-call', id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('open_calls')
          .select(`
            *,
            profiles(username, first_name, last_name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        return data as OpenCall;
      },
      enabled: !!id,
    });
  };

  const updateOpenCallStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { error } = await supabase
        .from('open_calls')
        .update({ 
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
      toast({
        title: "Status Updated",
        description: "Open call status has been updated successfully.",
      });
    },
  });

  return {
    createOpenCall,
    getLiveOpenCalls,
    getAllOpenCalls,
    getOpenCallById,
    updateOpenCallStatus,
  };
};

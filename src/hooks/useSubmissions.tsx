
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SubmissionData {
  title: string;
  description: string;
  artistStatement: string;
  files?: File[];
}

export const useSubmissions = () => {
  const queryClient = useQueryClient();

  const createSubmission = useMutation({
    mutationFn: async ({ openCallId, submissionData }: { 
      openCallId: string; 
      submissionData: SubmissionData;
    }) => {
      const { data, error } = await supabase.functions.invoke('create-submission-payment', {
        body: { openCallId, submissionData }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: "Submission Created",
        description: "Your submission has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getUserSubmissions = useQuery({
    queryKey: ['user-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          open_calls(title, organization_name),
          submission_files(*)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getSubmissionsByCall = (openCallId: string) => {
    return useQuery({
      queryKey: ['submissions', openCallId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            *,
            profiles(username, first_name, last_name, avatar_url)
          `)
          .eq('open_call_id', openCallId)
          .eq('payment_status', 'paid')
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        return data;
      },
    });
  };

  const checkSubmissionCount = async (openCallId: string) => {
    const { data, error } = await supabase
      .rpc('get_user_submission_count', { 
        user_id: (await supabase.auth.getUser()).data.user?.id,
        call_id: openCallId 
      });

    if (error) throw error;
    return data || 0;
  };

  return {
    createSubmission,
    getUserSubmissions,
    getSubmissionsByCall,
    checkSubmissionCount,
  };
};

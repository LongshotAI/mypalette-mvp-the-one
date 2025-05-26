
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
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return 0;

    const { data, error } = await supabase
      .from('submissions')
      .select('id', { count: 'exact' })
      .eq('artist_id', user.user.id)
      .eq('open_call_id', openCallId)
      .in('payment_status', ['paid', 'free']);

    if (error) throw error;
    return data?.length || 0;
  };

  return {
    createSubmission,
    getUserSubmissions,
    getSubmissionsByCall,
    checkSubmissionCount,
  };
};

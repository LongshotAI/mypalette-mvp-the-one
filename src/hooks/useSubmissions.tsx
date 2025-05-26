
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
      console.log('Creating submission for open call:', openCallId);
      
      const { data, error } = await supabase.functions.invoke('create-submission-payment', {
        body: { openCallId, submissionData }
      });

      if (error) {
        console.error('Submission creation error:', error);
        throw error;
      }
      
      console.log('Submission creation response:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "Submission Created",
        description: "Your submission has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Submission mutation error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create submission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getUserSubmissions = useQuery({
    queryKey: ['user-submissions'],
    queryFn: async () => {
      console.log('Fetching user submissions...');
      
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          open_calls(title, organization_name),
          submission_files(*)
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching user submissions:', error);
        throw error;
      }
      
      console.log('User submissions fetched:', data);
      return data;
    },
  });

  const getSubmissionsByCall = (openCallId: string) => {
    return useQuery({
      queryKey: ['submissions', openCallId],
      queryFn: async () => {
        console.log('Fetching submissions for open call:', openCallId);
        
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            *,
            profiles(username, first_name, last_name, avatar_url)
          `)
          .eq('open_call_id', openCallId)
          .eq('payment_status', 'paid')
          .order('submitted_at', { ascending: false });

        if (error) {
          console.error('Error fetching submissions by call:', error);
          throw error;
        }
        
        console.log('Submissions by call fetched:', data);
        return data;
      },
      enabled: !!openCallId,
    });
  };

  const checkSubmissionCount = async (openCallId: string) => {
    console.log('Checking submission count for:', openCallId);
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log('No authenticated user found');
      return 0;
    }

    const { data, error } = await supabase
      .from('submissions')
      .select('id', { count: 'exact' })
      .eq('artist_id', user.user.id)
      .eq('open_call_id', openCallId)
      .in('payment_status', ['paid', 'free']);

    if (error) {
      console.error('Error checking submission count:', error);
      throw error;
    }
    
    const count = data?.length || 0;
    console.log('Submission count:', count);
    return count;
  };

  return {
    createSubmission,
    getUserSubmissions,
    getSubmissionsByCall,
    checkSubmissionCount,
  };
};

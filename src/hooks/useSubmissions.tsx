
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
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check submission count first
      const { data: existingSubmissions } = await supabase
        .from('submissions')
        .select('id')
        .eq('artist_id', user.id)
        .eq('open_call_id', openCallId);

      const submissionCount = existingSubmissions?.length || 0;
      const isFirstSubmission = submissionCount === 0;
      
      // Create submission record
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          open_call_id: openCallId,
          artist_id: user.id,
          submission_data: {
            title: submissionData.title,
            description: submissionData.description,
            artist_statement: submissionData.artistStatement,
          },
          payment_status: isFirstSubmission ? 'free' : 'pending'
        })
        .select()
        .single();

      if (submissionError) {
        console.error('Submission creation error:', submissionError);
        throw submissionError;
      }

      console.log('Submission created:', submission);

      // If first submission, mark as paid/free and return success
      if (isFirstSubmission) {
        await supabase
          .from('submissions')
          .update({ payment_status: 'free' })
          .eq('id', submission.id);

        return { 
          submissionId: submission.id, 
          paymentRequired: false,
          success: true 
        };
      }

      // For paid submissions, call the payment function
      try {
        const { data, error } = await supabase.functions.invoke('create-submission-payment', {
          body: { 
            openCallId, 
            submissionId: submission.id,
            submissionData 
          }
        });

        if (error) {
          console.error('Payment creation error:', error);
          throw error;
        }
        
        console.log('Payment creation response:', data);
        return {
          submissionId: submission.id,
          paymentRequired: true,
          clientSecret: data.clientSecret,
          ...data
        };
      } catch (error) {
        // If payment fails, clean up the submission
        await supabase
          .from('submissions')
          .delete()
          .eq('id', submission.id);
        
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      
      if (!data.paymentRequired) {
        toast({
          title: "Submission Created",
          description: "Your free submission has been created successfully.",
        });
      }
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
          .in('payment_status', ['paid', 'free'])
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

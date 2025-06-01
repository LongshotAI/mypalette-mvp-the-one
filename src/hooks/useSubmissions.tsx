
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SubmissionData, Submission } from '@/types/submission';

// Add function to check if user has made any submissions before
const checkIsFirstSubmission = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('submissions')
    .select('id')
    .eq('artist_id', userId)
    .eq('payment_status', 'paid')
    .limit(1);

  if (error) {
    console.error('Error checking first submission:', error);
    return false;
  }

  return !data || data.length === 0;
};

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

      // Check if this is user's first submission
      const isFirst = await checkIsFirstSubmission(user.id);

      // Create submission record with enhanced data structure
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert({
          open_call_id: openCallId,
          artist_id: user.id,
          submission_data: submissionData as any, // Cast to satisfy Json type
          payment_status: isFirst ? 'free' : 'pending',
          is_selected: false
        })
        .select()
        .single();

      if (submissionError) {
        console.error('Submission creation error:', submissionError);
        throw submissionError;
      }

      console.log('Submission created:', submission);

      // If first submission, mark as free and return success
      if (isFirst) {
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
            submissionData,
            amount: 200 // $2.00 in cents
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
      queryClient.invalidateQueries({ queryKey: ['open-call-stats'] });
      
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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          open_calls(title, organization_name)
        `)
        .eq('artist_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching user submissions:', error);
        throw error;
      }
      
      console.log('User submissions fetched:', data);
      return data as Submission[];
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
        return data as Submission[];
      },
      enabled: !!openCallId,
    });
  };

  const getOpenCallStats = (openCallId: string) => {
    return useQuery({
      queryKey: ['open-call-stats', openCallId],
      queryFn: async () => {
        console.log('Fetching open call stats for:', openCallId);
        
        const { data, error } = await supabase.rpc('get_open_call_stats' as any, {
          p_open_call_id: openCallId
        });

        if (error) {
          console.error('Error fetching open call stats:', error);
          throw error;
        }
        
        console.log('Open call stats fetched:', data);
        return data?.[0] || {};
      },
      enabled: !!openCallId,
    });
  };

  const updateSubmissionStatus = useMutation({
    mutationFn: async ({ submissionId, status, notes }: { 
      submissionId: string; 
      status: string; 
      notes?: string;
    }) => {
      const { error } = await supabase.rpc('update_submission_status' as any, {
        p_submission_id: submissionId,
        p_new_status: status,
        p_notes: notes
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['open-call-stats'] });
      toast({
        title: "Status Updated",
        description: "Submission status has been updated successfully.",
      });
    },
  });

  const checkSubmissionCount = async (openCallId: string) => {
    console.log('Checking submission count for:', openCallId);
    
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log('No authenticated user found');
      return 0;
    }

    const { data, error } = await supabase.rpc('get_user_submission_count' as any, {
      p_user_id: user.user.id,
      p_open_call_id: openCallId
    });

    if (error) {
      console.error('Error checking submission count:', error);
      throw error;
    }
    
    console.log('Submission count:', data);
    return data || 0;
  };

  return {
    createSubmission,
    getUserSubmissions,
    getSubmissionsByCall,
    getOpenCallStats,
    updateSubmissionStatus,
    checkSubmissionCount,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SubmissionData, Submission } from '@/types/submission';
import { convertToSubmissionData } from '@/utils/typeGuards';

export const useSubmissions = () => {
  const queryClient = useQueryClient();

  const getSubmissionsByCall = (openCallId: string) => {
    return useQuery({
      queryKey: ['submissions-by-call', openCallId],
      queryFn: async (): Promise<Submission[]> => {
        if (!openCallId) return [];

        console.log('Fetching submissions for open call:', openCallId);
        
        const { data, error } = await supabase
          .from('submissions')
          .select(`
            *,
            profiles(first_name, last_name, username, avatar_url)
          `)
          .eq('open_call_id', openCallId)
          .order('submitted_at', { ascending: false });

        if (error) {
          console.error('Error fetching submissions:', error);
          throw error;
        }

        console.log('Submissions fetched:', data);
        
        return (data || []).map(submission => ({
          ...submission,
          submission_data: convertToSubmissionData(submission.submission_data)
        })) as Submission[];
      },
      enabled: !!openCallId,
    });
  };

  const getUserSubmissions = useQuery({
    queryKey: ['user-submissions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching submissions for user:', user.id);
      
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          open_calls(title, organization_name, submission_deadline, status)
        `)
        .eq('artist_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching user submissions:', error);
        throw error;
      }

      console.log('User submissions fetched:', data);
      
      return (data || []).map(submission => ({
        ...submission,
        submission_data: convertToSubmissionData(submission.submission_data)
      }));
    },
  });

  const createSubmission = useMutation({
    mutationFn: async ({ openCallId, submissionData }: { 
      openCallId: string; 
      submissionData: SubmissionData 
    }) => {
      console.log('Creating submission:', openCallId, submissionData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if submission fee is required
      const { data: openCall, error: callError } = await supabase
        .from('open_calls')
        .select('submission_fee, max_submissions')
        .eq('id', openCallId)
        .single();

      if (callError) {
        console.error('Error fetching open call:', callError);
        throw callError;
      }

      // Check current submission count for this user and open call
      const { data: existingSubmissions, error: countError } = await supabase
        .from('submissions')
        .select('id')
        .eq('open_call_id', openCallId)
        .eq('artist_id', user.id);

      if (countError) {
        console.error('Error checking submission count:', countError);
        throw countError;
      }

      if (existingSubmissions && existingSubmissions.length >= (openCall?.max_submissions || 1)) {
        throw new Error(`Maximum submissions (${openCall?.max_submissions}) reached for this open call`);
      }

      // Create the submission with proper type casting
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          open_call_id: openCallId,
          artist_id: user.id,
          submission_data: submissionData as any,
          payment_status: openCall?.submission_fee && openCall.submission_fee > 0 ? 'pending' : 'free',
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating submission:', error);
        throw error;
      }

      console.log('Submission created:', data);
      
      return {
        submission: data,
        paymentRequired: openCall?.submission_fee && openCall.submission_fee > 0
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-by-call'] });
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "Submission Created",
        description: "Your submission has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create submission.",
        variant: "destructive",
      });
    },
  });

  const updateSubmissionStatus = useMutation({
    mutationFn: async ({ submissionId, status, notes }: { 
      submissionId: string; 
      status: string; 
      notes?: string 
    }) => {
      console.log('Updating submission status:', submissionId, status, notes);

      const { data, error } = await supabase
        .from('submissions')
        .update({ 
          curator_notes: notes,
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating submission:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-by-call'] });
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "Submission Updated",
        description: "Submission status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update submission.",
        variant: "destructive",
      });
    },
  });

  return {
    getSubmissionsByCall,
    getUserSubmissions,
    createSubmission,
    updateSubmissionStatus,
  };
};

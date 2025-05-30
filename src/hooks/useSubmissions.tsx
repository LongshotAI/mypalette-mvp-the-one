
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SubmissionData } from '@/types/submission';

export const useSubmissions = () => {
  const queryClient = useQueryClient();

  const createSubmission = useMutation({
    mutationFn: async ({
      openCallId,
      submissionData
    }: {
      openCallId: string;
      submissionData: SubmissionData;
    }) => {
      console.log('Creating submission:', { openCallId, submissionData });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate required fields
      if (!submissionData.title?.trim()) {
        throw new Error('Artwork title is required');
      }
      if (!submissionData.description?.trim()) {
        throw new Error('Artwork description is required');
      }
      if (!submissionData.medium) {
        throw new Error('Medium is required');
      }
      if (!submissionData.artist_statement?.trim()) {
        throw new Error('Artist statement is required');
      }
      if (!submissionData.image_urls || submissionData.image_urls.length === 0) {
        throw new Error('At least one image is required');
      }

      // Get open call details to determine fee
      const { data: openCall, error: openCallError } = await supabase
        .from('open_calls')
        .select('submission_fee')
        .eq('id', openCallId)
        .single();

      if (openCallError) {
        console.error('Error fetching open call:', openCallError);
        throw openCallError;
      }

      const { data, error } = await supabase
        .from('submissions')
        .insert({
          open_call_id: openCallId,
          artist_id: user.id,
          submission_data: submissionData,
          payment_status: openCall.submission_fee > 0 ? 'pending' : 'free'
        })
        .select(`
          *,
          open_calls(title, organization_name),
          profiles(username, first_name, last_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error creating submission:', error);
        throw error;
      }

      console.log('Submission created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast({
        title: "Submission Successful!",
        description: "Your artwork has been submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Submission creation error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit artwork.",
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
          open_calls(title, organization_name, submission_deadline),
          profiles(username, first_name, last_name, avatar_url)
        `)
        .eq('artist_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching user submissions:', error);
        throw error;
      }

      console.log('User submissions fetched:', data);
      return data;
    },
  });

  const getSubmissionsByOpenCall = (openCallId: string) => {
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
          .order('submitted_at', { ascending: false });

        if (error) {
          console.error('Error fetching submissions:', error);
          throw error;
        }

        console.log('Submissions fetched:', data);
        return data;
      },
      enabled: !!openCallId,
    });
  };

  const updateSubmissionStatus = useMutation({
    mutationFn: async ({
      submissionId,
      isSelected,
      notes
    }: {
      submissionId: string;
      isSelected: boolean;
      notes?: string;
    }) => {
      console.log('Updating submission status:', { submissionId, isSelected, notes });
      
      const { error } = await supabase
        .from('submissions')
        .update({
          is_selected: isSelected,
          curator_notes: notes
        })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating submission status:', error);
        throw error;
      }

      console.log('Submission status updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });
      toast({
        title: "Status Updated",
        description: "Submission status has been updated.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating submission status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  return {
    createSubmission,
    getUserSubmissions,
    getSubmissionsByOpenCall,
    updateSubmissionStatus,
  };
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSubmissions = () => {
  const queryClient = useQueryClient();

  const getSubmissionsByCall = (openCallId: string) => {
    return useQuery({
      queryKey: ['submissions-by-call', openCallId],
      queryFn: async () => {
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
        return data || [];
      },
      enabled: !!openCallId,
    });
  };

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
          // Add any status-related fields here as needed
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
    updateSubmissionStatus,
  };
};

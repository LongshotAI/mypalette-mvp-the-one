
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SubmissionFile {
  id: string;
  submission_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export const useSubmissionFiles = () => {
  const queryClient = useQueryClient();

  const uploadFiles = useMutation({
    mutationFn: async ({ submissionId, files }: { submissionId: string; files: File[] }) => {
      console.log('Uploading files for submission:', submissionId);
      
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${submissionId}/${Math.random()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('submission-files')
          .upload(fileName, file);

        if (error) {
          console.error('File upload error:', error);
          throw error;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('submission-files')
          .getPublicUrl(fileName);

        // Update submission with file info in submission_data
        const { data: submission } = await supabase
          .from('submissions')
          .select('submission_data')
          .eq('id', submissionId)
          .single();

        const existingData = submission?.submission_data || {};
        const files = existingData.files || [];
        
        files.push({
          id: Math.random().toString(),
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          created_at: new Date().toISOString()
        });

        await supabase
          .from('submissions')
          .update({
            submission_data: {
              ...existingData,
              files
            }
          })
          .eq('id', submissionId);

        return {
          id: Math.random().toString(),
          submission_id: submissionId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          created_at: new Date().toISOString()
        };
      });

      const results = await Promise.all(uploadPromises);
      console.log('Files uploaded successfully:', results);
      return results;
    },
    onSuccess: () => {
      toast({
        title: "Files Uploaded",
        description: "Your artwork files have been uploaded successfully.",
      });
    },
    onError: (error: any) => {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getSubmissionFiles = (submissionId: string) => {
    return useQuery({
      queryKey: ['submission-files', submissionId],
      queryFn: async () => {
        console.log('Fetching files for submission:', submissionId);
        
        const { data, error } = await supabase
          .from('submissions')
          .select('submission_data')
          .eq('id', submissionId)
          .single();

        if (error) {
          console.error('Error fetching submission:', error);
          throw error;
        }
        
        const files = data?.submission_data?.files || [];
        console.log('Submission files fetched:', files);
        return files as SubmissionFile[];
      },
      enabled: !!submissionId,
    });
  };

  return {
    uploadFiles,
    getSubmissionFiles,
  };
};

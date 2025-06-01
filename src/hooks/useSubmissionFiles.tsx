
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SubmissionData, SubmissionFile } from '@/types/submission';

export const useSubmissionFiles = () => {
  const queryClient = useQueryClient();

  const uploadFiles = useMutation({
    mutationFn: async ({ submissionId, files }: { submissionId: string; files: File[] }) => {
      console.log('Uploading files for submission:', submissionId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${submissionId}/${Math.random()}.${fileExt}`;
        
        // For now, we'll just store file URLs in the submission_data
        // In a real implementation, you'd upload to Supabase Storage
        const mockUrl = `https://example.com/files/${fileName}`;

        // Update submission with file info in submission_data
        const { data: submission } = await supabase
          .from('submissions')
          .select('submission_data')
          .eq('id', submissionId)
          .single();

        const existingData = (submission?.submission_data as any) || {
          title: '',
          description: '',
          medium: '',
          year: '',
          dimensions: '',
          artist_statement: '',
          image_urls: [],
          external_links: [],
          files: []
        };
        
        const existingFiles = existingData.files || [];
        
        const newFile: SubmissionFile = {
          id: Math.random().toString(),
          file_name: file.name,
          file_url: mockUrl,
          file_type: file.type,
          file_size: file.size,
          created_at: new Date().toISOString()
        };

        existingFiles.push(newFile);

        const updatedData: any = {
          ...existingData,
          files: existingFiles
        };

        await supabase
          .from('submissions')
          .update({
            submission_data: updatedData
          })
          .eq('id', submissionId);

        return newFile;
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
      queryClient.invalidateQueries({ queryKey: ['submission-files'] });
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
        
        const submissionData = data?.submission_data as any;
        const files = submissionData?.files || [];
        console.log('Submission files fetched:', files);
        return files as SubmissionFile[];
      },
      enabled: !!submissionId,
    });
  };

  const deleteFile = useMutation({
    mutationFn: async ({ submissionId, fileId, fileName }: { 
      submissionId: string; 
      fileId: string; 
      fileName: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Remove from submission_data
      const { data: submission } = await supabase
        .from('submissions')
        .select('submission_data')
        .eq('id', submissionId)
        .single();

      if (submission) {
        const submissionData = submission.submission_data as any;
        const updatedFiles = submissionData.files?.filter((file: SubmissionFile) => file.id !== fileId) || [];

        const updatedData: any = {
          ...submissionData,
          files: updatedFiles
        };

        await supabase
          .from('submissions')
          .update({
            submission_data: updatedData
          })
          .eq('id', submissionId);
      }
    },
    onSuccess: () => {
      toast({
        title: "File Deleted",
        description: "File has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['submission-files'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete file.",
        variant: "destructive",
      });
    },
  });

  return {
    uploadFiles,
    getSubmissionFiles,
    deleteFile,
  };
};

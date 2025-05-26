
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
        
        const { data, error } = await supabase.storage
          .from('submission-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

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

        const existingData = (submission?.submission_data as SubmissionData) || {};
        const existingFiles = existingData.files || [];
        
        const newFile: SubmissionFile = {
          id: Math.random().toString(),
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          created_at: new Date().toISOString()
        };

        existingFiles.push(newFile);

        // Cast the entire object to any to avoid type conflicts
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
        
        const submissionData = data?.submission_data as SubmissionData;
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

      // Delete from storage
      const filePath = `${user.id}/${submissionId}/${fileName}`;
      const { error: storageError } = await supabase.storage
        .from('submission-files')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue even if storage deletion fails
      }

      // Remove from submission_data
      const { data: submission } = await supabase
        .from('submissions')
        .select('submission_data')
        .eq('id', submissionId)
        .single();

      if (submission) {
        const submissionData = submission.submission_data as SubmissionData;
        const updatedFiles = submissionData.files?.filter(file => file.id !== fileId) || [];

        // Cast to any to avoid type conflicts
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

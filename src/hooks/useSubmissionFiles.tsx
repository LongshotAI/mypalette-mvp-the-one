
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SubmissionData, SubmissionFile } from '@/types/submission';
import { toast } from '@/hooks/use-toast';

export const useSubmissionFiles = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadFile = async (file: File, submissionId: string): Promise<SubmissionFile> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${submissionId}/${Date.now()}.${fileExt}`;
    
    // Note: This would require a storage bucket to be set up
    // For now, we'll simulate the upload and return a mock file object
    return {
      id: `file_${Date.now()}`,
      file_name: file.name,
      file_url: `https://placeholder.com/uploads/${fileName}`,
      file_type: file.type,
      file_size: file.size,
      created_at: new Date().toISOString()
    };
  };

  const addFileToSubmission = useMutation({
    mutationFn: async ({ submissionId, file }: { submissionId: string; file: File }) => {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Get current submission data
        const { data: submission, error: fetchError } = await supabase
          .from('submissions')
          .select('submission_data')
          .eq('id', submissionId)
          .single();

        if (fetchError) throw fetchError;

        // Safe type conversion with fallback
        let currentData: SubmissionData;
        try {
          const rawData = submission.submission_data;
          if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
            currentData = rawData as SubmissionData;
          } else {
            currentData = {
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
          }
        } catch (e) {
          currentData = {
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
        }

        setUploadProgress(50);

        // Upload the file
        const uploadedFile = await uploadFile(file, submissionId);
        
        setUploadProgress(75);

        // Update submission data with new file
        const updatedFiles = [...(currentData.files || []), uploadedFile];
        const updatedData: SubmissionData = {
          ...currentData,
          files: updatedFiles
        };

        // Update the submission in the database
        const { error: updateError } = await supabase
          .from('submissions')
          .update({ submission_data: updatedData as any })
          .eq('id', submissionId);

        if (updateError) throw updateError;

        setUploadProgress(100);
        return uploadedFile;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-by-call'] });
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "File Uploaded",
        description: "File has been successfully uploaded to your submission.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
    },
  });

  const removeFileFromSubmission = useMutation({
    mutationFn: async ({ submissionId, fileId }: { submissionId: string; fileId: string }) => {
      // Get current submission data
      const { data: submission, error: fetchError } = await supabase
        .from('submissions')
        .select('submission_data')
        .eq('id', submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Safe type conversion with fallback
      let currentData: SubmissionData;
      try {
        const rawData = submission.submission_data;
        if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
          currentData = rawData as SubmissionData;
        } else {
          currentData = {
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
        }
      } catch (e) {
        currentData = {
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
      }

      // Remove the file from the array
      const updatedFiles = (currentData.files || []).filter(file => file.id !== fileId);
      const updatedData: SubmissionData = {
        ...currentData,
        files: updatedFiles
      };

      // Update the submission in the database
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ submission_data: updatedData as any })
        .eq('id', submissionId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions-by-call'] });
      queryClient.invalidateQueries({ queryKey: ['user-submissions'] });
      toast({
        title: "File Removed",
        description: "File has been removed from your submission.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remove Failed",
        description: error.message || "Failed to remove file.",
        variant: "destructive",
      });
    },
  });

  const getSubmissionFiles = (submissionData: SubmissionData): SubmissionFile[] => {
    return submissionData.files || [];
  };

  return {
    uploadProgress,
    isUploading,
    addFileToSubmission,
    removeFileFromSubmission,
    getSubmissionFiles,
  };
};

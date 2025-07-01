
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StorageManager, StorageUploadResult } from '@/utils/storageUtils';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useEnhancedStorage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const uploadUserFile = useMutation({
    mutationFn: async ({ 
      file, 
      category 
    }: { 
      file: File; 
      category: 'avatars' | 'artworks' | 'submissions';
    }): Promise<StorageUploadResult> => {
      if (!user?.id) {
        throw new Error('User must be authenticated');
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      try {
        const result = await StorageManager.uploadUserFile(file, user.id, category);
        
        if (result.error) {
          throw new Error(result.error);
        }

        setUploadProgress(100);
        return result;
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
    },
    onSuccess: (result) => {
      toast({
        title: "Upload Successful",
        description: "Your file has been uploaded successfully.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
    },
  });

  const uploadHostAsset = useMutation({
    mutationFn: async ({ 
      file, 
      category 
    }: { 
      file: File; 
      category: 'logos' | 'covers';
    }): Promise<StorageUploadResult> => {
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      try {
        const result = await StorageManager.uploadHostAsset(file, category);
        
        if (result.error) {
          throw new Error(result.error);
        }

        setUploadProgress(100);
        return result;
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
    },
    onSuccess: () => {
      toast({
        title: "Asset Uploaded",
        description: "Host asset has been uploaded successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload asset.",
        variant: "destructive",
      });
    },
  });

  const deleteFile = useMutation({
    mutationFn: async ({ bucket, path }: { bucket: string; path: string }) => {
      return await StorageManager.deleteFile(bucket, path);
    },
    onSuccess: () => {
      toast({
        title: "File Deleted",
        description: "File has been deleted successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
      queryClient.invalidateQueries({ queryKey: ['open-calls'] });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    },
  });

  return {
    uploadUserFile,
    uploadHostAsset,
    deleteFile,
    uploadProgress,
    isUploading,
    getFileUrl: StorageManager.getFileUrl,
  };
};

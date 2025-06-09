
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type StorageBucket = 
  | 'artwork-uploads'
  | 'open-call-banners' 
  | 'business-logos'
  | 'user-avatars'
  | 'submission-files';

export const useFileStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File, 
    bucket: StorageBucket, 
    path?: string
  ): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = path || `${user.id}/${Date.now()}.${fileExt}`;
      
      setUploadProgress(25);

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      setUploadProgress(75);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setUploadProgress(100);
      
      toast({
        title: "Upload Successful",
        description: "File has been uploaded successfully.",
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (bucket: StorageBucket, path: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      toast({
        title: "File Deleted",
        description: "File has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete file.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getFileUrl = (bucket: StorageBucket, path: string): string => {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  return {
    uploadFile,
    deleteFile,
    getFileUrl,
    uploading,
    uploadProgress,
  };
};

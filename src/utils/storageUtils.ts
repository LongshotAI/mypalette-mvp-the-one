
import { supabase } from '@/integrations/supabase/client';

export interface StorageUploadResult {
  url: string;
  path: string;
  error?: string;
}

export class StorageManager {
  // Generate organized file paths for user_uploads bucket
  static generateUserFilePath(userId: string, category: 'avatars' | 'artworks' | 'submissions', fileName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    const fileExt = fileName.split('.').pop();
    return `${userId}/${category}/${timestamp}_${randomStr}.${fileExt}`;
  }

  // Generate organized file paths for host_assets bucket
  static generateHostAssetPath(category: 'logos' | 'covers', fileName: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2);
    const fileExt = fileName.split('.').pop();
    return `${category}/${timestamp}_${randomStr}.${fileExt}`;
  }

  // Upload to user_uploads bucket
  static async uploadUserFile(
    file: File, 
    userId: string, 
    category: 'avatars' | 'artworks' | 'submissions'
  ): Promise<StorageUploadResult> {
    try {
      const filePath = this.generateUserFilePath(userId, category, file.name);
      
      const { data, error } = await supabase.storage
        .from('user_uploads')
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        url: '',
        path: '',
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Upload to host_assets bucket (admin only)
  static async uploadHostAsset(
    file: File, 
    category: 'logos' | 'covers'
  ): Promise<StorageUploadResult> {
    try {
      const filePath = this.generateHostAssetPath(category, file.name);
      
      const { data, error } = await supabase.storage
        .from('host_assets')
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('host_assets')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        url: '',
        path: '',
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Delete file from storage
  static async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  // Get file URL
  static getFileUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

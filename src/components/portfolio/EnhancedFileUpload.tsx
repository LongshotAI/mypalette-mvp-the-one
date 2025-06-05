
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon, Video, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EnhancedFileUploadProps {
  onFileUploaded: (fileUrl: string, fileType: 'image' | 'video') => void;
  allowVideo?: boolean;
  maxSizeMB?: number;
  bucket?: string;
}

const EnhancedFileUpload = ({ 
  onFileUploaded, 
  allowVideo = true, 
  maxSizeMB = 50,
  bucket = 'artwork-uploads'
}: EnhancedFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'youtube'>('file');

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1920px width)
        const maxWidth = 1920;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`);
      }

      let fileToUpload = file;
      
      // Compress images
      if (file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file);
        setUploadProgress(30);
      }

      // Generate unique filename
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploadProgress(50);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload);

      if (error) throw error;

      setUploadProgress(80);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadProgress(100);

      const fileType = fileToUpload.type.startsWith('image/') ? 'image' : 'video';
      onFileUploaded(urlData.publicUrl, fileType);
      
      toast({
        title: "Success",
        description: "File uploaded successfully!"
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleYouTubeSubmit = () => {
    if (!validateYouTubeUrl(videoUrl)) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive"
      });
      return;
    }

    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      onFileUploaded(embedUrl, 'video');
      setVideoUrl('');
      toast({
        title: "Success",
        description: "YouTube video added successfully!"
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      ...(allowVideo && {
        'video/*': ['.mp4', '.mov', '.avi', '.wmv']
      })
    },
    maxFiles: 1,
    maxSize: maxSizeMB * 1024 * 1024
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        {allowVideo && (
          <Button
            type="button"
            variant={uploadMode === 'youtube' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode('youtube')}
          >
            <Video className="h-4 w-4 mr-2" />
            YouTube URL
          </Button>
        )}
      </div>

      {uploadMode === 'file' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto h-12 w-12 text-muted-foreground">
                {isDragActive ? (
                  <div className="h-full w-full border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6" />
                  </div>
                ) : (
                  <ImageIcon className="h-full w-full" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {allowVideo ? 'Images and videos up to' : 'Images up to'} {maxSizeMB}MB
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF, WebP{allowVideo ? ', MP4, MOV, AVI' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadMode === 'youtube' && allowVideo && (
        <div className="space-y-3">
          <Label htmlFor="youtube-url">YouTube URL</Label>
          <div className="flex gap-2">
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={handleYouTubeSubmit}
              disabled={!videoUrl}
            >
              Add Video
            </Button>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Enter a valid YouTube URL. The video will be embedded in your portfolio.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default EnhancedFileUpload;

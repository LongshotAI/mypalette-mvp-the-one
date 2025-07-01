
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { useEnhancedStorage } from '@/hooks/useEnhancedStorage';
import { toast } from '@/hooks/use-toast';

interface EnhancedFileUploadProps {
  onFileUploaded: (fileUrl: string, fileType: 'image' | 'video') => void;
  allowVideo?: boolean;
  maxSizeMB?: number;
  category?: 'avatars' | 'artworks' | 'submissions';
}

const EnhancedFileUpload = ({ 
  onFileUploaded, 
  allowVideo = true, 
  maxSizeMB = 50,
  category = 'artworks'
}: EnhancedFileUploadProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'youtube'>('file');
  const { uploadUserFile, uploadProgress, isUploading } = useEnhancedStorage();

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadUserFile.mutateAsync({ file, category });
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      onFileUploaded(result.url, fileType);
    } catch (error) {
      console.error('Upload failed:', error);
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
      handleFileUpload(file);
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
    maxSize: maxSizeMB * 1024 * 1024,
    disabled: isUploading
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
            ${isUploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
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

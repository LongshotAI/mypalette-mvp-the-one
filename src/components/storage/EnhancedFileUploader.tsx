
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Video, File, Check } from 'lucide-react';
import { useEnhancedStorage } from '@/hooks/useEnhancedStorage';

interface EnhancedFileUploaderProps {
  category: 'avatars' | 'artworks' | 'submissions';
  onUploadComplete: (url: string, path: string) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

const EnhancedFileUploader = ({ 
  category, 
  onUploadComplete, 
  maxFiles = 1,
  acceptedTypes = ['image/*', 'video/*'],
  maxSizeMB = 50,
  className = ''
}: EnhancedFileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadUserFile, uploadProgress, isUploading } = useEnhancedStorage();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        console.warn(`File ${file.name} exceeds size limit`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
  }, [maxFiles, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - selectedFiles.length,
    disabled: isUploading || selectedFiles.length >= maxFiles
  });

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadUserFile.mutateAsync({ file, category });
      onUploadComplete(result.url, result.path);
      setSelectedFiles(prev => prev.filter(f => f !== file));
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const removeFile = (file: File) => {
    setSelectedFiles(prev => prev.filter(f => f !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {selectedFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : isUploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-2">
            <Upload className={`h-8 w-8 ${isUploading ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max {maxSizeMB}MB • {acceptedTypes.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <Card key={`${file.name}-${index}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isUploading && (
                      <div className="w-20">
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={() => handleUpload(file)}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(file)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedFileUploader;


import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image, Building } from 'lucide-react';
import { useEnhancedStorage } from '@/hooks/useEnhancedStorage';

interface HostAssetUploaderProps {
  category: 'logos' | 'covers';
  onUploadComplete: (url: string, path: string) => void;
  title?: string;
  className?: string;
}

const HostAssetUploader = ({ 
  category, 
  onUploadComplete, 
  title,
  className = ''
}: HostAssetUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadHostAsset, uploadProgress, isUploading } = useEnhancedStorage();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 50 * 1024 * 1024) { // 50MB limit
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadHostAsset.mutateAsync({ 
        file: selectedFile, 
        category 
      });
      
      onUploadComplete(result.url, result.path);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {!selectedFile && (
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
              <Image className={`h-8 w-8 ${isUploading ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop image here' : 'Upload company asset'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WebP up to 50MB
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Image className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center text-gray-500">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload Asset'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HostAssetUploader;

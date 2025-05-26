
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

const FileUploadZone = ({ 
  onFilesSelected, 
  selectedFiles, 
  maxFiles = 10,
  acceptedFileTypes = ['image/*', 'video/*', '.pdf', '.doc', '.docx']
}: FileUploadZoneProps) => {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - selectedFiles.length,
    disabled: selectedFiles.length >= maxFiles
  });

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : selectedFiles.length >= maxFiles
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <Upload className={`h-12 w-12 ${
            selectedFiles.length >= maxFiles ? 'text-gray-400' : 'text-gray-500'
          }`} />
          
          {selectedFiles.length >= maxFiles ? (
            <div>
              <p className="text-gray-500 font-medium">Maximum files reached</p>
              <p className="text-sm text-gray-400">
                You can upload up to {maxFiles} files
              </p>
            </div>
          ) : isDragActive ? (
            <div>
              <p className="text-blue-600 font-medium">Drop files here</p>
              <p className="text-sm text-blue-500">
                Release to upload your artwork
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 font-medium">
                Drag and drop your artwork files here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse from your computer
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports images, videos, and documents • Max {maxFiles} files
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">
            Selected Files ({selectedFiles.length}/{maxFiles})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                {uploadProgress[file.name] !== undefined && (
                  <div className="w-20 mr-3">
                    <Progress value={uploadProgress[file.name]} className="h-2" />
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;

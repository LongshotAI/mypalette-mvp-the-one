
import React from 'react';
import { useSubmissionFiles } from '@/hooks/useSubmissionFiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, File, Image, Video } from 'lucide-react';

interface SubmissionFilesDisplayProps {
  submissionId: string;
}

const SubmissionFilesDisplay = ({ submissionId }: SubmissionFilesDisplayProps) => {
  const { getSubmissionFiles } = useSubmissionFiles();
  const { data: files, isLoading } = getSubmissionFiles(submissionId);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Artwork Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!files || files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Artwork Files</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No files uploaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Artwork Files
          <Badge variant="outline">{files.length} files</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.file_type)}
                <div>
                  <p className="font-medium text-sm">{file.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.file_size)} • {file.file_type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {file.file_type.startsWith('image/') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(file.file_url, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(file.file_url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionFilesDisplay;

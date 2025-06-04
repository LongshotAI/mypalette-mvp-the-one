
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image, Video, Youtube, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface EnhancedArtworkUploadProps {
  portfolioId: string;
  onSuccess: () => void;
}

const EnhancedArtworkUpload = ({ portfolioId, onSuccess }: EnhancedArtworkUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [artworkDetails, setArtworkDetails] = useState({
    title: '',
    description: '',
    medium: '',
    year: new Date().getFullYear(),
    dimensions: '',
    tags: '',
    youtubeUrl: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const uploadArtwork = async () => {
    if (!user?.id || (!selectedFiles.length && !artworkDetails.youtubeUrl)) {
      toast({
        title: "Missing content",
        description: "Please upload an image/video or provide a YouTube URL",
        variant: "destructive"
      });
      return;
    }

    if (!artworkDetails.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your artwork",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Handle file uploads
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${portfolioId}/${Date.now()}.${fileExt}`;

        console.log('Uploading file:', fileName);

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);

        // Create artwork record
        const artworkData = {
          title: artworkDetails.title,
          description: artworkDetails.description || null,
          medium: artworkDetails.medium || null,
          year: artworkDetails.year,
          dimensions: artworkDetails.dimensions || null,
          tags: artworkDetails.tags ? artworkDetails.tags.split(',').map(tag => tag.trim()) : null,
          portfolio_id: portfolioId,
          user_id: user.id,
          image_url: file.type.startsWith('image/') ? publicUrl : null,
          video_url: file.type.startsWith('video/') ? publicUrl : null
        };

        const { error: insertError } = await supabase
          .from('artworks')
          .insert(artworkData);

        if (insertError) throw insertError;
      }

      // Handle YouTube URL
      if (artworkDetails.youtubeUrl) {
        const youtubeId = extractYouTubeId(artworkDetails.youtubeUrl);
        if (!youtubeId) {
          throw new Error('Invalid YouTube URL');
        }

        const artworkData = {
          title: artworkDetails.title,
          description: artworkDetails.description || null,
          medium: artworkDetails.medium || null,
          year: artworkDetails.year,
          dimensions: artworkDetails.dimensions || null,
          tags: artworkDetails.tags ? artworkDetails.tags.split(',').map(tag => tag.trim()) : null,
          portfolio_id: portfolioId,
          user_id: user.id,
          image_url: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          video_url: artworkDetails.youtubeUrl,
          external_url: artworkDetails.youtubeUrl
        };

        const { error: insertError } = await supabase
          .from('artworks')
          .insert(artworkData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Artwork uploaded",
        description: "Your artwork has been added to your portfolio!"
      });

      // Reset form
      setArtworkDetails({
        title: '',
        description: '',
        medium: '',
        year: new Date().getFullYear(),
        dimensions: '',
        tags: '',
        youtubeUrl: ''
      });
      setSelectedFiles([]);
      onSuccess();

    } catch (error) {
      console.error('Error uploading artwork:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload artwork',
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Add Artwork to Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'image' | 'video')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              YouTube Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop files here' : 'Upload your artwork'}
              </h3>
              <p className="text-gray-500 mb-2">
                Drag and drop images or videos, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports JPEG, PNG, WebP, GIF, MP4, MOV • Max 50MB per file
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.type.startsWith('image/') ? (
                          <Image className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Video className="h-4 w-4 text-purple-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="video" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={artworkDetails.youtubeUrl}
                onChange={(e) => setArtworkDetails(prev => ({ ...prev, youtubeUrl: e.target.value }))}
              />
              {artworkDetails.youtubeUrl && extractYouTubeId(artworkDetails.youtubeUrl) && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Valid YouTube URL detected</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Artwork Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Artwork title"
              value={artworkDetails.title}
              onChange={(e) => setArtworkDetails(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium">Medium</Label>
            <Input
              id="medium"
              placeholder="Oil on canvas, Digital art, etc."
              value={artworkDetails.medium}
              onChange={(e) => setArtworkDetails(prev => ({ ...prev, medium: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="2024"
              value={artworkDetails.year}
              onChange={(e) => setArtworkDetails(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              placeholder="24 x 36 inches"
              value={artworkDetails.dimensions}
              onChange={(e) => setArtworkDetails(prev => ({ ...prev, dimensions: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="w-full p-3 border rounded-lg"
            rows={3}
            placeholder="Describe your artwork..."
            value={artworkDetails.description}
            onChange={(e) => setArtworkDetails(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="abstract, colorful, painting (comma-separated)"
            value={artworkDetails.tags}
            onChange={(e) => setArtworkDetails(prev => ({ ...prev, tags: e.target.value }))}
          />
        </div>

        <Button 
          onClick={uploadArtwork} 
          disabled={uploading || (!selectedFiles.length && !artworkDetails.youtubeUrl) || !artworkDetails.title.trim()}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Add Artwork'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedArtworkUpload;

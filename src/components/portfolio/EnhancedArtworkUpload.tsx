import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save } from 'lucide-react';
import EnhancedFileUpload from '@/components/portfolio/EnhancedFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EnhancedArtworkUploadProps {
  portfolioId: string;
  onSuccess?: () => void;
}

const EnhancedArtworkUpload = ({ portfolioId, onSuccess }: EnhancedArtworkUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [artworkData, setArtworkData] = useState({
    title: '',
    description: '',
    medium: '',
    year: '',
    dimensions: '',
    image_url: '',
    video_url: '',
    external_url: '',
    tags: [] as string[]
  });

  const handleFileUploaded = (fileUrl: string, fileType: 'image' | 'video') => {
    if (fileType === 'image') {
      setArtworkData(prev => ({ ...prev, image_url: fileUrl }));
    } else {
      setArtworkData(prev => ({ ...prev, video_url: fileUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artworkData.title || !artworkData.image_url) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and an image for your artwork.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('artworks')
        .insert({
          ...artworkData,
          portfolio_id: portfolioId,
          user_id: user.id,
          year: artworkData.year ? parseInt(artworkData.year) : null
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Artwork uploaded successfully:', data);
      
      toast({
        title: "Artwork Added",
        description: "Your artwork has been added to your portfolio successfully!"
      });

      // Reset form
      setArtworkData({
        title: '',
        description: '',
        medium: '',
        year: '',
        dimensions: '',
        image_url: '',
        video_url: '',
        external_url: '',
        tags: []
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to add artwork",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Artwork
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload with Enhanced Storage */}
          <div>
            <Label>Artwork Files</Label>
            <EnhancedFileUpload
              onFileUploaded={handleFileUploaded}
              allowVideo={true}
              maxSizeMB={50}
              category="artworks"
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Artwork Title *</Label>
              <Input
                id="title"
                value={artworkData.title}
                onChange={(e) => setArtworkData({ ...artworkData, title: e.target.value })}
                placeholder="Enter artwork title"
                required
              />
            </div>
            <div>
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                value={artworkData.medium}
                onChange={(e) => setArtworkData({ ...artworkData, medium: e.target.value })}
                placeholder="e.g., Oil on canvas, Digital art"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={artworkData.description}
              onChange={(e) => setArtworkData({ ...artworkData, description: e.target.value })}
              placeholder="Describe your artwork"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year Created</Label>
              <Input
                id="year"
                value={artworkData.year}
                onChange={(e) => setArtworkData({ ...artworkData, year: e.target.value })}
                placeholder="2024"
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={artworkData.dimensions}
                onChange={(e) => setArtworkData({ ...artworkData, dimensions: e.target.value })}
                placeholder="e.g., 24 x 36 inches"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="external_url">External Link</Label>
            <Input
              id="external_url"
              value={artworkData.external_url}
              onChange={(e) => setArtworkData({ ...artworkData, external_url: e.target.value })}
              placeholder="Link to more information about this artwork"
              type="url"
            />
          </div>

          <Button type="submit" disabled={isUploading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {isUploading ? 'Adding Artwork...' : 'Add Artwork'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedArtworkUpload;

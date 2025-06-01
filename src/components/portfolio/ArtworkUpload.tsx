
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ArtworkUploadProps {
  portfolioId: string;
  onSuccess: () => void;
}

const ArtworkUpload = ({ portfolioId, onSuccess }: ArtworkUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [artworkData, setArtworkData] = useState({
    title: '',
    description: '',
    medium: '',
    year: new Date().getFullYear(),
    dimensions: '',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadArtwork = async () => {
    if (!user?.id || selectedFiles.length === 0 || !artworkData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in the title and select at least one image",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);

      // For now, we'll simulate file upload and store mock URLs
      // In a real implementation, you'd upload to Supabase Storage
      const mockImageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;

      const { error } = await supabase
        .from('artworks')
        .insert({
          portfolio_id: portfolioId,
          user_id: user.id,
          title: artworkData.title.trim(),
          description: artworkData.description.trim() || null,
          medium: artworkData.medium.trim() || null,
          year: artworkData.year,
          dimensions: artworkData.dimensions.trim() || null,
          image_url: mockImageUrl,
          is_featured: false
        });

      if (error) throw error;

      toast({
        title: "Artwork uploaded",
        description: "Your artwork has been added to the portfolio successfully!"
      });

      // Reset form
      setArtworkData({
        title: '',
        description: '',
        medium: '',
        year: new Date().getFullYear(),
        dimensions: '',
      });
      setSelectedFiles([]);
      onSuccess();
    } catch (error) {
      console.error('Error uploading artwork:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload artwork. Please try again.",
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
          Add New Artwork
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div>
          <Label>Images</Label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="artwork-upload"
            />
            <label
              htmlFor="artwork-upload"
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors block"
            >
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload images or drag and drop
              </p>
            </label>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label>Selected Files:</Label>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Artwork Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={artworkData.title}
              onChange={(e) => setArtworkData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Artwork title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="medium">Medium</Label>
            <Input
              id="medium"
              value={artworkData.medium}
              onChange={(e) => setArtworkData(prev => ({ ...prev, medium: e.target.value }))}
              placeholder="e.g., Oil on canvas, Digital art"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={artworkData.description}
            onChange={(e) => setArtworkData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your artwork"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={artworkData.year}
              onChange={(e) => setArtworkData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
          
          <div>
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={artworkData.dimensions}
              onChange={(e) => setArtworkData(prev => ({ ...prev, dimensions: e.target.value }))}
              placeholder="e.g., 24 x 36 inches"
            />
          </div>
        </div>

        <Button
          onClick={uploadArtwork}
          disabled={uploading || selectedFiles.length === 0 || !artworkData.title.trim()}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Add Artwork'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArtworkUpload;

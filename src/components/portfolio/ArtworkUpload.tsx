
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ArtworkData {
  title: string;
  description?: string;
  medium?: string;
  year?: number;
  dimensions?: string;
  tags?: string[];
}

interface ArtworkUploadProps {
  portfolioId: string;
  onSuccess?: () => void;
}

const ArtworkUpload = ({ portfolioId, onSuccess }: ArtworkUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [artworkData, setArtworkData] = useState<ArtworkData>({
    title: '',
    description: '',
    medium: '',
    year: new Date().getFullYear(),
    dimensions: '',
    tags: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !artworkData.tags?.includes(tagInput.trim())) {
      setArtworkData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setArtworkData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleUpload = async () => {
    if (!file || !user?.id || !artworkData.title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a file, title, and ensure you're logged in.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      console.log('Uploading artwork for portfolio:', portfolioId);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${portfolioId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(fileName);

      // Save artwork data to database
      const { error: dbError } = await supabase
        .from('artworks')
        .insert({
          portfolio_id: portfolioId,
          user_id: user.id,
          title: artworkData.title.trim(),
          description: artworkData.description?.trim() || null,
          medium: artworkData.medium?.trim() || null,
          year: artworkData.year || null,
          dimensions: artworkData.dimensions?.trim() || null,
          tags: artworkData.tags || [],
          image_url: publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "Artwork uploaded",
        description: "Your artwork has been added to the portfolio successfully!"
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setArtworkData({
        title: '',
        description: '',
        medium: '',
        year: new Date().getFullYear(),
        dimensions: '',
        tags: []
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error uploading artwork:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload artwork',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Artwork</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div>
          <Label htmlFor="artwork-file">Artwork File</Label>
          <div className="mt-2">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <Label htmlFor="artwork-file" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80">Choose a file</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 100MB
                  </p>
                </div>
                <Input
                  id="artwork-file"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            )}
          </div>
        </div>

        {/* Artwork Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={artworkData.title}
              onChange={(e) => setArtworkData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Artwork title"
              disabled={isUploading}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={artworkData.description}
              onChange={(e) => setArtworkData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your artwork"
              rows={3}
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="medium">Medium</Label>
            <Input
              id="medium"
              value={artworkData.medium}
              onChange={(e) => setArtworkData(prev => ({ ...prev, medium: e.target.value }))}
              placeholder="Oil on canvas, Digital, etc."
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={artworkData.year || ''}
              onChange={(e) => setArtworkData(prev => ({ ...prev, year: parseInt(e.target.value) || undefined }))}
              placeholder="2024"
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={artworkData.dimensions}
              onChange={(e) => setArtworkData(prev => ({ ...prev, dimensions: e.target.value }))}
              placeholder="24x36 inches"
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                disabled={isUploading}
              />
              <Button type="button" onClick={addTag} size="sm" disabled={isUploading}>
                Add
              </Button>
            </div>
            {artworkData.tags && artworkData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {artworkData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={isUploading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || !artworkData.title.trim() || isUploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Artwork'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArtworkUpload;


import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ArtworkData {
  title: string;
  description: string;
  medium: string;
  year: number | null;
  dimensions: string;
  image_url: string;
  video_url: string;
  external_url: string;
  tags: string[];
  blockchain: string;
}

interface ArtworkUploadModalProps {
  portfolioId: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const ArtworkUploadModal = ({ portfolioId, onSuccess, trigger }: ArtworkUploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ArtworkData>({
    title: '',
    description: '',
    medium: '',
    year: null,
    dimensions: '',
    image_url: '',
    video_url: '',
    external_url: '',
    tags: [],
    blockchain: '',
  });
  const [tagInput, setTagInput] = useState('');
  const queryClient = useQueryClient();

  const mediums = [
    'Painting', 'Photography', 'Sculpture', 'Digital Art', 'Mixed Media',
    'Installation', 'Performance', 'Video Art', 'Printmaking', 'Drawing',
    'Ceramics', 'Textile Art', 'NFT', 'AI Art'
  ];

  const createArtwork = useMutation({
    mutationFn: async (artworkData: ArtworkData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!artworkData.title.trim()) throw new Error('Title is required');
      if (!artworkData.image_url.trim()) throw new Error('Image URL is required');

      const { data, error } = await supabase
        .from('artworks')
        .insert({
          ...artworkData,
          user_id: user.id,
          portfolio_id: portfolioId,
          year: artworkData.year || new Date().getFullYear(),
          tags: artworkData.tags.length > 0 ? artworkData.tags : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-artworks', portfolioId] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        medium: '',
        year: null,
        dimensions: '',
        image_url: '',
        video_url: '',
        external_url: '',
        tags: [],
        blockchain: '',
      });
      setTagInput('');
      onSuccess?.();
      toast({
        title: "Artwork Added",
        description: "Your artwork has been added to the portfolio successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add artwork.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createArtwork.mutate(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Artwork
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add New Artwork
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Artwork Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter artwork title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your artwork"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Select 
                  value={formData.medium} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, medium: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediums.map((medium) => (
                      <SelectItem key={medium} value={medium.toLowerCase()}>
                        {medium}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    year: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                  placeholder="e.g., 24 x 36 inches"
                />
              </div>
            </div>
          </div>

          {/* Media URLs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <Label htmlFor="video_url">Video URL (Optional)</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div>
              <Label htmlFor="external_url">External Link (Optional)</Label>
              <Input
                id="external_url"
                value={formData.external_url}
                onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                placeholder="https://marketplace.com/artwork"
              />
            </div>

            <div>
              <Label htmlFor="blockchain">Blockchain/NFT Info (Optional)</Label>
              <Input
                id="blockchain"
                value={formData.blockchain}
                onChange={(e) => setFormData(prev => ({ ...prev, blockchain: e.target.value }))}
                placeholder="Ethereum, Polygon, etc."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-primary/20"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createArtwork.isPending || !formData.title.trim() || !formData.image_url.trim()} 
              className="flex-1"
            >
              {createArtwork.isPending ? 'Adding...' : 'Add Artwork'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkUploadModal;

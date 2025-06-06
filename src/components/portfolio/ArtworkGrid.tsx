
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink, Calendar, Ruler } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  medium: string | null;
  year: number | null;
  dimensions: string | null;
  image_url: string;
  video_url: string | null;
  external_url: string | null;
  created_at: string;
}

interface ArtworkGridProps {
  portfolioId: string;
  onRefresh?: () => void;
}

const ArtworkGrid = ({ portfolioId, onRefresh }: ArtworkGridProps) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      console.log('Fetching artworks for portfolio:', portfolioId);
      
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Artworks fetched:', data);
      setArtworks(data || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast({
        title: "Error",
        description: "Failed to load artworks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (portfolioId) {
      fetchArtworks();
    }
  }, [portfolioId]);

  const handleDelete = async (artworkId: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    setDeleting(artworkId);
    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId);

      if (error) throw error;

      toast({
        title: "Artwork Deleted",
        description: "The artwork has been removed from your portfolio."
      });

      setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete artwork",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading artworks...</p>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
          <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No artworks yet</h3>
        <p className="text-muted-foreground">
          Upload your first artwork to start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Card key={artwork.id} className="overflow-hidden">
          <div className="aspect-square relative">
            {artwork.video_url ? (
              <video
                src={artwork.video_url}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium line-clamp-1">{artwork.title}</h3>
                {artwork.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {artwork.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {artwork.medium && (
                  <Badge variant="secondary" className="text-xs">
                    {artwork.medium}
                  </Badge>
                )}
                {artwork.year && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {artwork.year}
                  </Badge>
                )}
                {artwork.dimensions && (
                  <Badge variant="outline" className="text-xs">
                    <Ruler className="h-3 w-3 mr-1" />
                    {artwork.dimensions}
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  {artwork.external_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(artwork.external_url!, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement artwork editing
                      toast({
                        title: "Coming Soon",
                        description: "Artwork editing will be available soon!"
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(artwork.id)}
                    disabled={deleting === artwork.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArtworkGrid;

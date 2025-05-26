
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  medium: string | null;
  year: number | null;
  dimensions: string | null;
  tags: string[] | null;
  image_url: string;
  sort_order: number | null;
  created_at: string | null;
}

interface ArtworkGridProps {
  portfolioId: string;
  onRefresh?: () => void;
}

const ArtworkGrid = ({ portfolioId, onRefresh }: ArtworkGridProps) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchArtworks = async () => {
    try {
      console.log('Fetching artworks for portfolio:', portfolioId);
      
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('sort_order', { ascending: true })
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

  const deleteArtwork = async (artworkId: string) => {
    try {
      console.log('Deleting artwork:', artworkId);
      
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId);

      if (error) throw error;

      toast({
        title: "Artwork deleted",
        description: "The artwork has been removed successfully"
      });

      // Refresh the artworks list
      fetchArtworks();
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast({
        title: "Error",
        description: "Failed to delete artwork",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (portfolioId) {
      fetchArtworks();
    }
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-primary/60" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No artworks yet</h3>
        <p className="text-muted-foreground">
          Add your first artwork to start building your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artworks.map((artwork, index) => (
        <motion.div
          key={artwork.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteArtwork(artwork.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-1">{artwork.title}</h3>
              
              {artwork.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {artwork.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-2">
                {artwork.medium && (
                  <Badge variant="secondary" className="text-xs">
                    {artwork.medium}
                  </Badge>
                )}
                {artwork.year && (
                  <Badge variant="outline" className="text-xs">
                    {artwork.year}
                  </Badge>
                )}
              </div>
              
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {artwork.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {artwork.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{artwork.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ArtworkGrid;

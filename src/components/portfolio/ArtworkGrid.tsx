
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Star, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface ArtworkGridProps {
  portfolioId: string;
  onRefresh: () => void;
}

const ArtworkGrid = ({ portfolioId, onRefresh }: ArtworkGridProps) => {
  const { toast } = useToast();

  const { data: artworks, isLoading, refetch } = useQuery({
    queryKey: ['portfolio-artworks', portfolioId],
    queryFn: async () => {
      console.log('Fetching artworks for portfolio:', portfolioId);
      
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching artworks:', error);
        throw error;
      }

      return data;
    },
    enabled: !!portfolioId,
  });

  const handleToggleFeatured = async (artworkId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('artworks')
        .update({ is_featured: !currentFeatured })
        .eq('id', artworkId);

      if (error) throw error;

      toast({
        title: "Artwork updated",
        description: `Artwork ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`
      });

      refetch();
      onRefresh();
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast({
        title: "Update failed",
        description: "Failed to update artwork",
        variant: "destructive"
      });
    }
  };

  const handleDeleteArtwork = async (artworkId: string) => {
    if (!window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', artworkId);

      if (error) throw error;

      toast({
        title: "Artwork deleted",
        description: "Artwork has been removed from your portfolio"
      });

      refetch();
      onRefresh();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete artwork",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!artworks || artworks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Star className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-medium mb-2">No artworks yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first artwork to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {artworks.map((artwork) => (
        <Card key={artwork.id} className="group overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted overflow-hidden relative">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              
              {/* Featured Badge */}
              {artwork.is_featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500 text-yellow-50">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Actions Menu */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleToggleFeatured(artwork.id, artwork.is_featured)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      {artwork.is_featured ? 'Unfeature' : 'Feature'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteArtwork(artwork.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-sm mb-1 line-clamp-1">{artwork.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{artwork.year}</span>
                {artwork.medium && (
                  <span className="line-clamp-1">{artwork.medium}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ArtworkGrid;

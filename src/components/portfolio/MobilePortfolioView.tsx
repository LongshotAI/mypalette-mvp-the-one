
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Share2, 
  ExternalLink, 
  Grid, 
  List,
  Heart,
  User,
  Calendar,
  Eye
} from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import PortfolioLikes from '@/components/social/PortfolioLikes';
import { usePortfolioAnalytics } from '@/hooks/usePortfolioAnalytics';

interface MobilePortfolioViewProps {
  portfolio: any;
  artworks: any[];
  onBack: () => void;
}

const MobilePortfolioView = ({ portfolio, artworks, onBack }: MobilePortfolioViewProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const { trackView, trackEvent } = usePortfolioAnalytics(portfolio.id);

  useEffect(() => {
    // Track portfolio view
    trackView(portfolio.id);
  }, [portfolio.id]);

  const handleShare = async () => {
    trackEvent(portfolio.id, 'share_attempt');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolio.title,
          text: portfolio.description || `Check out ${portfolio.title} portfolio`,
          url: window.location.href
        });
        trackEvent(portfolio.id, 'share_success', { method: 'native' });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        trackEvent(portfolio.id, 'share_success', { method: 'clipboard' });
        // Show toast or notification
      } catch (error) {
        console.error('Failed to copy link');
      }
    }
  };

  const handleArtworkClick = (artwork: any) => {
    setSelectedArtwork(artwork);
    trackEvent(portfolio.id, 'artwork_view', { artwork_id: artwork.id });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Header */}
      <div className="p-4 space-y-4">
        {portfolio.cover_image && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <LazyImage
              src={portfolio.cover_image}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{portfolio.title}</h1>
          
          {portfolio.description && (
            <p className="text-muted-foreground">{portfolio.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{portfolio.profiles?.username || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(portfolio.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{portfolio.view_count || 0} views</span>
            </div>
          </div>

          <PortfolioLikes portfolioId={portfolio.id} variant="compact" />
        </div>
      </div>

      {/* Artworks */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Artworks ({artworks.length})</h2>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleArtworkClick(artwork)}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer"
              >
                <LazyImage
                  src={artwork.image_url}
                  alt={artwork.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
                {artwork.is_featured && (
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Featured
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="cursor-pointer" onClick={() => handleArtworkClick(artwork)}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <LazyImage
                          src={artwork.image_url}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{artwork.title}</h3>
                        {artwork.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {artwork.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {artwork.year && (
                            <Badge variant="outline" className="text-xs">
                              {artwork.year}
                            </Badge>
                          )}
                          {artwork.medium && (
                            <Badge variant="outline" className="text-xs">
                              {artwork.medium}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Artwork Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <LazyImage
                src={selectedArtwork.image_url}
                alt={selectedArtwork.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-white text-center">
                <h3 className="text-lg font-medium">{selectedArtwork.title}</h3>
                {selectedArtwork.description && (
                  <p className="text-sm text-gray-300 mt-1">{selectedArtwork.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobilePortfolioView;

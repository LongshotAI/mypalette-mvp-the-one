
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Share2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ArtworkGrid from '@/components/portfolio/ArtworkGrid';

interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  slug: string | null;
  cover_image: string | null;
  view_count: number | null;
  is_public: boolean | null;
  template_id: string | null;
  created_at: string | null;
  profiles?: {
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    artistic_medium: string | null;
  };
}

const PortfolioView = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!slug) {
        setError('Portfolio not found');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading portfolio by slug:', slug);
        
        const { data, error } = await supabase
          .from('portfolios')
          .select(`
            id,
            title,
            description,
            slug,
            cover_image,
            view_count,
            is_public,
            template_id,
            created_at,
            profiles!inner (
              username,
              first_name,
              last_name,
              avatar_url,
              artistic_medium
            )
          `)
          .eq('slug', slug)
          .eq('is_public', true)
          .single();

        if (error) {
          console.error('Error loading portfolio:', error);
          setError('Portfolio not found or not public');
          return;
        }

        console.log('Portfolio loaded:', data);
        setPortfolio(data);

        // Increment view count
        if (data.id) {
          await supabase.rpc('increment_portfolio_views', { portfolio_id: data.id });
        }
      } catch (err) {
        console.error('Error loading portfolio:', err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [slug]);

  const getArtistName = () => {
    if (!portfolio?.profiles) return 'Unknown Artist';
    const { first_name, last_name, username } = portfolio.profiles;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    }
    return username || 'Unknown Artist';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: portfolio?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Portfolio link copied to clipboard!"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-center text-muted-foreground mt-4">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Portfolio Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The portfolio you are looking for does not exist or is not public.'}
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Portfolio Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-4">{portfolio.title}</h1>
                    {portfolio.description && (
                      <p className="text-lg text-muted-foreground mb-4">
                        {portfolio.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {portfolio.profiles?.avatar_url ? (
                          <img
                            src={portfolio.profiles.avatar_url}
                            alt={getArtistName()}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        <span className="font-medium">{getArtistName()}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{(portfolio.view_count || 0) + 1} views</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {portfolio.profiles?.artistic_medium && (
                        <Badge variant="secondary">{portfolio.profiles.artistic_medium}</Badge>
                      )}
                      {portfolio.template_id && (
                        <Badge variant="outline">{portfolio.template_id}</Badge>
                      )}
                      {portfolio.created_at && (
                        <Badge variant="outline">
                          {new Date(portfolio.created_at).getFullYear()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cover Image */}
          {portfolio.cover_image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={portfolio.cover_image}
                  alt={portfolio.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Artworks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Artworks</h2>
                <ArtworkGrid portfolioId={portfolio.id} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioView;

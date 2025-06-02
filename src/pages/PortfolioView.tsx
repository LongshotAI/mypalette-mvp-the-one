
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  Share2, 
  ExternalLink,
  MapPin,
  Calendar,
  Palette
} from 'lucide-react';
import ArtworkGrid from '@/components/portfolio/ArtworkGrid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from '@/hooks/use-toast';

const PortfolioView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No portfolio slug provided');

      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles(
            username,
            first_name,
            last_name,
            bio,
            avatar_url,
            location,
            artistic_medium,
            artistic_style,
            website,
            years_active,
            available_for_commission
          )
        `)
        .eq('slug', slug)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Increment view count when portfolio loads
  useEffect(() => {
    if (portfolio?.id) {
      supabase.rpc('increment_portfolio_views', { portfolio_id: portfolio.id });
    }
  }, [portfolio?.id]);

  const handleLike = async () => {
    if (!portfolio) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to like portfolios.",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        // Remove like
        await supabase
          .from('portfolio_likes')
          .delete()
          .eq('portfolio_id', portfolio.id)
          .eq('user_id', user.id);
        setIsLiked(false);
      } else {
        // Add like
        await supabase
          .from('portfolio_likes')
          .insert({
            portfolio_id: portfolio.id,
            user_id: user.id,
            like_type: 'like'
          });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolio?.title,
          text: portfolio?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Portfolio link copied to clipboard!",
      });
    }
  };

  const handleRefresh = () => {
    // This function can be used to refresh the artwork grid if needed
    console.log('Refreshing artwork grid');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !portfolio) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The portfolio you're looking for doesn't exist or is not public.
            </p>
            <Button onClick={() => navigate('/discover')}>
              Browse Other Portfolios
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const profile = portfolio.profiles;

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-80 bg-gradient-to-br from-primary/20 to-primary/40">
          {portfolio.cover_image && (
            <img
              src={portfolio.cover_image}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Back Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Portfolio Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-6"
              >
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{portfolio.title}</h1>
                  <p className="text-lg opacity-90 mb-2">
                    by {profile?.first_name} {profile?.last_name} 
                    {profile?.username && ` (@${profile.username})`}
                  </p>
                  {portfolio.description && (
                    <p className="opacity-75 max-w-2xl">{portfolio.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Artist Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About the Artist</h3>
                  
                  {profile?.bio && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {profile.bio}
                    </p>
                  )}

                  <div className="space-y-3">
                    {profile?.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    {profile?.years_active && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.years_active} years active</span>
                      </div>
                    )}

                    {profile?.artistic_medium && (
                      <div className="flex items-center gap-2 text-sm">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.artistic_medium}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mt-4 space-y-2">
                    {profile?.artistic_style && (
                      <div>
                        <Badge variant="secondary">{profile.artistic_style}</Badge>
                      </div>
                    )}
                    
                    {profile?.available_for_commission && (
                      <div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Available for Commission
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* External Links */}
                  {profile?.website && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Portfolio Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Portfolio Stats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{portfolio.view_count || 0} views</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Template: {portfolio.template_id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Artwork Grid */}
            <div className="lg:col-span-3">
              <ArtworkGrid 
                portfolioId={portfolio.id} 
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioView;

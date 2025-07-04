
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, ExternalLink, Globe, Lock, Share2, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Portfolio } from '@/hooks/usePortfolios';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onDelete?: (portfolioId: string) => void;
  onEdit?: (portfolio: Portfolio) => void;
  showActions?: boolean;
  showPublicActions?: boolean; // New prop for public actions (like, share, follow)
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onDelete,
  onEdit,
  showActions = false,
  showPublicActions = false
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleDelete = () => {
    if (onDelete && portfolio.id) {
      onDelete(portfolio.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(portfolio);
    }
  };

  const handleShare = async () => {
    const portfolioUrl = `${window.location.origin}/portfolio/${portfolio.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolio.title,
          text: portfolio.description,
          url: portfolioUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(portfolioUrl);
      toast({
        title: "Link Copied",
        description: "Portfolio link copied to clipboard!",
      });
    }
  };

  const handleLike = async () => {
    if (!portfolio.id) return;

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
        setLikeCount(prev => Math.max(0, prev - 1));
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
        setLikeCount(prev => prev + 1);
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

  const handleFollowArtist = async () => {
    if (!portfolio.user_id) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to follow artists.",
          variant: "destructive",
        });
        return;
      }

      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', portfolio.user_id);
        setIsFollowing(false);
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: portfolio.user_id
          });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        {/* Cover Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
          {portfolio.cover_image ? (
            <img
              src={portfolio.cover_image}
              alt={portfolio.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-primary/60" />
                </div>
                <p className="text-sm text-muted-foreground">No cover image</p>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={portfolio.is_public ? "default" : "secondary"}>
              {portfolio.is_public ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </div>

          {/* Featured Badge */}
          {portfolio.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-yellow-500 text-yellow-900 border-yellow-600">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Portfolio Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
              {portfolio.title}
            </h3>
            {portfolio.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {portfolio.description}
              </p>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{portfolio.view_count || 0} views</span>
                </div>
                {portfolio.template_id && (
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {portfolio.template_id}
                    </Badge>
                  </div>
                )}
              </div>
              
              {portfolio.created_at && (
                <span className="text-xs">
                  {new Date(portfolio.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {(showActions || showPublicActions) && (
            <div className="space-y-2">
              {/* Public Actions */}
              {showPublicActions && (
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/portfolio/${portfolio.slug}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              )}
              
              {showPublicActions && (
                <div className="flex gap-2">
                  <Button 
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className="flex-1"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    Like {likeCount > 0 && `(${likeCount})`}
                  </Button>
                  
                  <Button 
                    variant={isFollowing ? "default" : "outline"}
                    size="sm"
                    onClick={handleFollowArtist}
                    className="flex-1"
                  >
                    <User className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              )}

              {/* Owner Actions */}
              {showActions && (
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/portfolio/${portfolio.slug}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  
                  {onEdit ? (
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/portfolio/${portfolio.slug}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PortfolioCard;

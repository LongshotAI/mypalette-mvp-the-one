
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioLikesProps {
  portfolioId: string;
  showCounts?: boolean;
  variant?: 'default' | 'compact';
}

interface LikeData {
  likes: number;
  loves: number;
  bookmarks: number;
  userLike: string | null;
}

const PortfolioLikes = ({ portfolioId, showCounts = true, variant = 'default' }: PortfolioLikesProps) => {
  const { user } = useAuth();
  const [likeData, setLikeData] = useState<LikeData>({
    likes: 0,
    loves: 0,
    bookmarks: 0,
    userLike: null
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLikeData();
  }, [portfolioId, user]);

  const fetchLikeData = async () => {
    try {
      // Get all likes for this portfolio
      const { data: allLikes, error: likesError } = await supabase
        .from('portfolio_likes')
        .select('like_type, user_id')
        .eq('portfolio_id', portfolioId);

      if (likesError) throw likesError;

      // Count likes by type
      const likes = allLikes?.filter(like => like.like_type === 'like').length || 0;
      const loves = allLikes?.filter(like => like.like_type === 'love').length || 0;
      const bookmarks = allLikes?.filter(like => like.like_type === 'bookmark').length || 0;

      // Check user's current like
      const userLike = user ? allLikes?.find(like => like.user_id === user.id)?.like_type || null : null;

      setLikeData({ likes, loves, bookmarks, userLike });
    } catch (error) {
      console.error('Error fetching like data:', error);
    }
  };

  const handleLike = async (likeType: 'like' | 'love' | 'bookmark') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like portfolios",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // If user already has this like type, remove it
      if (likeData.userLike === likeType) {
        const { error } = await supabase
          .from('portfolio_likes')
          .delete()
          .eq('portfolio_id', portfolioId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Removed",
          description: `${likeType} removed`
        });
      } else {
        // Remove existing like if any, then add new one
        await supabase
          .from('portfolio_likes')
          .delete()
          .eq('portfolio_id', portfolioId)
          .eq('user_id', user.id);

        const { error } = await supabase
          .from('portfolio_likes')
          .insert({
            portfolio_id: portfolioId,
            user_id: user.id,
            like_type: likeType
          });

        if (error) throw error;

        toast({
          title: "Added",
          description: `${likeType} added!`
        });
      }

      fetchLikeData();
    } catch (error) {
      console.error('Error updating like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const LikeButton = ({ type, icon: Icon, count }: { type: 'like' | 'love' | 'bookmark', icon: any, count: number }) => {
    const isActive = likeData.userLike === type;
    
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={isActive ? 'default' : 'outline'}
          size={variant === 'compact' ? 'sm' : 'default'}
          onClick={() => handleLike(type)}
          disabled={isLoading}
          className={`gap-2 ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Icon className={`h-4 w-4 ${isActive ? 'fill-current' : ''}`} />
          {showCounts && count > 0 && <span>{count}</span>}
        </Button>
      </motion.div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className="flex gap-1">
        <LikeButton type="like" icon={Heart} count={likeData.likes} />
        <LikeButton type="love" icon={Sparkles} count={likeData.loves} />
        <LikeButton type="bookmark" icon={Bookmark} count={likeData.bookmarks} />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <LikeButton type="like" icon={Heart} count={likeData.likes} />
      <LikeButton type="love" icon={Sparkles} count={likeData.loves} />
      <LikeButton type="bookmark" icon={Bookmark} count={likeData.bookmarks} />
    </div>
  );
};

export default PortfolioLikes;

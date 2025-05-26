
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  onFollowChange: (isFollowing: boolean) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

const FollowButton = ({ 
  targetUserId, 
  isFollowing, 
  onFollowChange, 
  variant = 'default',
  size = 'default'
}: FollowButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow artists",
        variant: "destructive"
      });
      return;
    }

    if (user.id === targetUserId) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;

        onFollowChange(false);
        
        toast({
          title: "Unfollowed",
          description: "You are no longer following this artist"
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          });

        if (error) throw error;

        onFollowChange(true);
        
        toast({
          title: "Following",
          description: "You are now following this artist"
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.id === targetUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleFollow}
      disabled={isLoading}
      className="flex items-center space-x-2"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isFollowing ? (
        <>
          <Heart className="h-4 w-4 fill-current" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          <span>Follow</span>
        </>
      )}
    </Button>
  );
};

export default FollowButton;

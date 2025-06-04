
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SocialStats {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export const useSocialStats = (targetUserId?: string) => {
  const [stats, setStats] = useState<SocialStats>({
    followerCount: 0,
    followingCount: 0,
    isFollowing: false
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Use current user ID if no targetUserId provided
      const userId = targetUserId || user?.id;
      
      if (!userId) {
        setLoading(false);
        return;
      }

      console.log('Fetching social stats for user:', userId);

      // Get follower count
      const { count: followerCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      // Get following count
      const { count: followingCount } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      // Check if current user is following this user
      let isFollowing = false;
      if (user && user.id !== userId) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', userId)
          .single();
        
        isFollowing = !!followData;
      }

      setStats({
        followerCount: followerCount || 0,
        followingCount: followingCount || 0,
        isFollowing
      });

      console.log('Social stats loaded:', {
        followerCount: followerCount || 0,
        followingCount: followingCount || 0,
        isFollowing
      });
    } catch (error) {
      console.error('Error fetching social stats:', error);
      toast({
        title: "Error",
        description: "Failed to load social statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFollowStatus = (isFollowing: boolean) => {
    setStats(prev => ({
      ...prev,
      isFollowing,
      followerCount: prev.followerCount + (isFollowing ? 1 : -1)
    }));
  };

  useEffect(() => {
    const userId = targetUserId || user?.id;
    if (userId) {
      fetchStats();
    }
  }, [targetUserId, user?.id]);

  return {
    stats,
    loading,
    updateFollowStatus,
    refetch: fetchStats
  };
};


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { SearchFilters } from '@/components/discover/SearchFilters';

interface ArtistProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  artistic_medium: string | null;
  artistic_style: string | null;
  years_active: number | null;
  available_for_commission: boolean | null;
  created_at: string | null;
  portfolio_count?: number;
  follower_count?: number;
  is_following?: boolean;
}

interface FeaturedContent {
  featured_artists: ArtistProfile[];
  trending_portfolios: any[];
}

export const useDiscovery = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [featuredContent, setFeaturedContent] = useState<FeaturedContent>({
    featured_artists: [],
    trending_portfolios: []
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const PAGE_SIZE = 12;

  const searchArtists = useCallback(async (filters: SearchFilters, page = 0, append = false) => {
    try {
      setLoading(true);
      console.log('Searching artists with filters:', filters, 'page:', page);

      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          first_name,
          last_name,
          bio,
          avatar_url,
          location,
          artistic_medium,
          artistic_style,
          years_active,
          available_for_commission,
          created_at
        `);

      // Apply text search
      if (filters.query) {
        query = query.or(`
          first_name.ilike.%${filters.query}%,
          last_name.ilike.%${filters.query}%,
          username.ilike.%${filters.query}%,
          bio.ilike.%${filters.query}%,
          artistic_medium.ilike.%${filters.query}%,
          artistic_style.ilike.%${filters.query}%
        `);
      }

      // Apply artistic medium filter
      if (filters.artisticMedium.length > 0) {
        query = query.in('artistic_medium', filters.artisticMedium);
      }

      // Apply artistic style filter
      if (filters.artisticStyle.length > 0) {
        query = query.in('artistic_style', filters.artisticStyle);
      }

      // Apply location filter
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply years active filter
      if (filters.yearsActive) {
        const [min, max] = filters.yearsActive.includes('+') 
          ? [parseInt(filters.yearsActive.replace('+', '')), 100]
          : filters.yearsActive.split('-').map(Number);
        
        query = query.gte('years_active', min);
        if (max !== 100) {
          query = query.lte('years_active', max);
        }
      }

      // Apply commission availability filter
      if (filters.availableForCommission !== null) {
        query = query.eq('available_for_commission', filters.availableForCommission);
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      console.log('Artists search result:', data);

      // Get additional stats for each artist
      const artistsWithStats = await Promise.all(
        (data || []).map(async (artist) => {
          // Get portfolio count
          const { count: portfolioCount } = await supabase
            .from('portfolios')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', artist.id)
            .eq('is_public', true);

          // Get follower count
          const { count: followerCount } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', artist.id);

          // Check if current user is following this artist
          let isFollowing = false;
          if (user) {
            const { data: followData } = await supabase
              .from('follows')
              .select('id')
              .eq('follower_id', user.id)
              .eq('following_id', artist.id)
              .single();
            
            isFollowing = !!followData;
          }

          return {
            ...artist,
            portfolio_count: portfolioCount || 0,
            follower_count: followerCount || 0,
            is_following: isFollowing
          };
        })
      );

      if (append) {
        setArtists(prev => [...prev, ...artistsWithStats]);
      } else {
        setArtists(artistsWithStats);
      }

      setHasMore((data?.length || 0) === PAGE_SIZE);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching artists:', error);
      toast({
        title: "Error",
        description: "Failed to search artists",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const loadFeaturedContent = useCallback(async () => {
    try {
      console.log('Loading featured content...');

      // Get featured artists (most followed)
      const { data: followCounts } = await supabase
        .from('follows')
        .select('following_id, count(*)');

      // Get top artists by follower count
      const { data: featuredArtistsData } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          first_name,
          last_name,
          bio,
          avatar_url,
          location,
          artistic_medium,
          artistic_style,
          years_active,
          available_for_commission,
          created_at
        `)
        .limit(6);

      // Get trending portfolios (most viewed recently)
      const { data: trendingPortfolios } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles!inner (
            username,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('view_count', { ascending: false })
        .limit(8);

      setFeaturedContent({
        featured_artists: featuredArtistsData || [],
        trending_portfolios: trendingPortfolios || []
      });

      console.log('Featured content loaded:', {
        artists: featuredArtistsData?.length || 0,
        portfolios: trendingPortfolios?.length || 0
      });
    } catch (error) {
      console.error('Error loading featured content:', error);
      toast({
        title: "Error",
        description: "Failed to load featured content",
        variant: "destructive"
      });
    }
  }, [toast]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      // This would need the current filters to work properly
      // For now, we'll implement this when we have the filters context
      console.log('Load more requested - needs filters context');
    }
  }, [loading, hasMore]);

  const updateFollowStatus = useCallback((artistId: string, isFollowing: boolean) => {
    setArtists(prev => prev.map(artist => 
      artist.id === artistId 
        ? { 
            ...artist, 
            is_following: isFollowing,
            follower_count: (artist.follower_count || 0) + (isFollowing ? 1 : -1)
          }
        : artist
    ));

    setFeaturedContent(prev => ({
      ...prev,
      featured_artists: prev.featured_artists.map(artist =>
        artist.id === artistId
          ? {
              ...artist,
              is_following: isFollowing,
              follower_count: (artist.follower_count || 0) + (isFollowing ? 1 : -1)
            }
          : artist
      )
    }));
  }, []);

  return {
    artists,
    featuredContent,
    loading,
    hasMore,
    searchArtists,
    loadFeaturedContent,
    loadMore,
    updateFollowStatus
  };
};
